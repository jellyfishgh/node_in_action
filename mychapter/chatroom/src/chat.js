function Chat(socket) {
    this.socket = socket;
}

Chat.prototype = {
    constructor: Chat,
    sendMessage: function(room, text) {
        let msg = {
            room: room,
            text: text
        };
        this.socket.emit('message', msg);
    },
    changeRoom: function(room) {
        this.socket.emit('join', {
            newRoom: room
        });
    },
    processCommand: function(cmd) {
        let words = cmd.split(' ');
        let command = words[0].substring(1, words[0].length).toLowerCase();
        let msg = false;
        switch (command) {
            case 'join':
                {
                    words.shift();
                    let room = words.join(' ');
                    this.changeRoom(room);
                    break;
                }
            case 'nick':
                {
                    words.shift();
                    let name = words.join(' ');
                    this.socket.emit('nameAttempt', name);
                    break;
                }
            default:
                msg = 'Unrecognized command.';
                break;
        }
        return msg;
    }
};

module.exports = Chat;

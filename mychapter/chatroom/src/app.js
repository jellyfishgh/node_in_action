const io = require('socket.io');
const $ = require('jquery');
const Chat = require('./Chat');

function divEscapedContentElement(msg) {
    return $('<div/>').text(msg);
}

function divSystemContentElement(msg) {
    return $('<div/>').html(`<i>${msg}</i>`);
}

function processUserInput(chatter, socket) {
    let msg = $('#send-message').val();
    let systemMessage;
    if(msg.charAt(0) === '/') {
        systemMessage = chatter.processCommand(msg);
        if(systemMessage) {
            $('#messages').append(divSystemContentElement(systemMessage));
        }
    }else {
        chatter.sendMessage($('#room').text(), msg);
    }
    $('#send-message').val('');
}

$(document).ready(function() {
    let socket = io.connect();
    let chatter = new Chat(socket);
    socket.on('nameResult', function(result) {
        let msg;
        if(result.success) {
            msg = `You are now known as ${result.name} .`;
        }else {
            msg = result.message;
        }
        $('#messages').append(divSystemContentElement(msg));
    });
    socket.on('joinResult', function(result) {
        $('#room').text(result.room);
        $('#messages').append(divSystemContentElement('Room Changed.'));
    });
    socket.on('message', function(message) {
        $('#messages').append($('<div/>').text(message.text));
    });
    socket.on('rooms', function(rooms) {
        $('#room-list').empty();
        for(let room in rooms) {
            room = room.substring(1, room.length);
            if(room !== ''){
                $('#room-list').append(divEscapedContentElement(room));
            }
        }
        $('#room-list div').click(() => {
            chatter.processCommand(`/join${$(this).text()}`);
            $('#sendMessage').focus();
        });
    });
    setInterval(() => {
        socket.emit('rooms');
    }, 1000);
    $('#sendMessage').focus();
    $('#send-form').submit(() => {
        processUserInput(chatter, socket);
        return false;
    });
});

const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

const cache = {};

function send404(res) {
    let body = 'Error 404: resource not found.';
    res.writeHead(404, {
        'Content-Type': 'text/plain',
        'Content-Length': Buffer.byteLength(body)
    });
    res.end(body);
}

function sendFile(res, filePath, fileContents) {
    res.writeHead(200, {
        'Content-Type': mime.lookup(path.basename(filePath))
    });
    res.end(fileContents);
}

function serveStatic(res, cache, absPath) {
    if(cache[absPath]){
        sendFile(res, absPath, cache[absPath]);
    }else{
        fs.stat(absPath, (err, stats) => {
            if(err || !stats.isFile()) return send404(res);
            fs.readFile(absPath, (err, data) => {
                if(err) return send404(res);
                cache[absPath] = data;
                sendFile(res, absPath, data);
            });
        });
    }
}

let port = 3000;
let host = '127.0.0.1';

cons server = http.createServer((req, res) => {
    let filePath;
    if(request.url === '/') {
        filePath = path.join();
    }
});

server.listen(port, host, (err) => {
    if(err) return console.err(err);
    console.log(`server listen on http://${host}:${port}`);
});

const chatServer = require('./chatServer');
chatServer.listen(server)

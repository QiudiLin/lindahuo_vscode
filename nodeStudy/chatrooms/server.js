const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
let cache = {};

// 发送文件数据及错误响应
function send404(response) {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.write('Error 404: resource not found.');
    response.end();
}

// 提供文件数据服务
function sendFile(response, filePath, fileContents) {
    response.writeHead(
        200,
        { 'content-type': mime.lookup(path.basename(filePath)) }
    );
    response.end(fileContents);
}

// 提供静态文件服务
function serveStatic(response, cache, absPath) {
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.readFile(absPath, function (err, data) {
            if (err) {
                send404(response);
            } else {
                cache[absPath] = data;
                sendFile(response, absPath, data);
            }
        });
    }
}

// 创建 http 服务器的逻辑
const server = http.createServer(function (request, response) {
    let filePath = false;

    if (request.url == '/') {
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + request.url;
    }

    const absPath = '/nodestudy/vscode/nodeStudy/chatrooms/' + filePath;
    serveStatic(response, cache, absPath);
});

server.listen(3000, function () {
    console.log('Server listening on port 3000.');
});
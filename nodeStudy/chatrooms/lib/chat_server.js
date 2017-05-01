const socketio = require('socket.io');

let io;
let guestNumber = 1;
let nickNames = {};
let namesUsed = [];
let currentRoom = {};

exports.listen = function () {
    // 启动 socket io 服务器，允许它搭载在已有的 HTTP 服务器上
    io = socketio.listen(server);
    io.set('log leve', 1);

    io.sockets.on('connection', (socket) => {
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed)
    });

    // 在用户连接上来时把他放入聊天室 Lobby 里
    joinRoom(socket, 'Lobby');
    // 处理用户的消息，更名，以及聊天室的创建和变更
    handleMessageBroadcasting(socket, nickNames);
    handleNameChangeAttempts(socket, nickNames, nameUsed);
    handleRoomJoining(socket);
    // 用户发出请求时，向其提供已经被占用的聊天室的列表
    socket.on('rooms', function () {
        socket.emit('rooms', io.sockets.manager.rooms);
    });
    // 定义用户断开连接后的清除逻辑
    handleClientDisconnection(socket, nickNames, namesUsed);
};

// 分配用户昵称
function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    const name = 'Guest' + guestNumber;
    nickNames[socket.id] = name;
    socket.emit('nameResult', {
        success: true,
        name: name
    });
    nameUsed.push(name);
    return guestNumber + 1;
};

// 与进入聊天室相关的逻辑
function joinRoom(socket, room) {
    socket.join(room);
    currentRoom[socket.io] = room;
    socket.emit('joinResult', { room: room });
    socket.broadcase.to(room).emit('message', {
        text: nickNames[socket.id] + ' has joined ' + room + '.'
    });

    const usersInRoom = io.sockets.clients(room);
    if (usersInRoom.length > 1) {
        const usersInRoomSummary = 'Users currently in ' + room + ': ';
        for (let index in usersInRoom) {
            const userSocketId = usersInRoom[index].id;
            if (userSocketId != socket.id) {
                if (index > 0) {
                    usersInRoomSummary += ', ';
                }
                usersInRoomSummary += nickNames[userSocketId];
            }
            usersInRoomSummary += '.';
            socket.emit('message', { text: usersInRoomSummary });
        }
    }
};
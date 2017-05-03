// 显示系统创建的内容信息
function divEscapedContentElement(message) {
    return $('<div></div>').text(message);
};
function divSystemContentElement(message) {
    return $('<div></div>').html('<i>' + message + '</i>')
};

//处理原始的用户输入
function processUserInput(chatApp, socket) {
    const message = $('#send-message').val();
    let systemMessage;
    // 如果用户输入的内容以斜杠开头，将其作为聊天命令
    if (message.charAt(0) == '/') {
        systemMessage = chatApp.processCommand(message);
        if (systemMessage) {
            $('#messages').append(divSystemContentElement(systemMessage));
        }
    } else {
        // 将非命令输入广播给其他用户
        chatApp.sendMessage($('#room').text(), message);
        $('#messages').append(divEsapedContentElement(message));
        $('#messages').scrollTop($('#messages').prop('scrollHeight'));
    }

    $('#send-message').val('');
};

// 客户单程序初始化逻辑
const socket = io.connect;

$(document).ready(() => {
    let chatApp = new Chat(socket);

    socket.on('nameResult', (result) => {
        let message;

        if (result.success) {
            message = 'You are now known as ' + result.name + '.';
        } else {
            message = result.message;
        }
        $('#messages').append(divSystemContentElement(message));
    });

    socket.on('joinResult', (reuslt) => {
        $('#room').text(result.room);
        $('#messages').append(divSystemContentElement('Room changed.'));
    });

    socket.on('message', (message) => {
        const newElement = $('<div></div>').text(message.text);
        $('#messages').append(newElement);
    });

    socket.on('rooms', (rooms) => {
        $('#room-list').empty();

        for (let room in rooms) {
            room = room.substring(1, room.length);
            if (room != '') {
                $('#room-list').append(divEscapedContentElement(room));
            }
         }
         $('#room-list div').click(() => {
            chatApp.processCommand('/join ' + $(this).text());
            $('#send-message').focus();
         });
    });

    setInterval(() => {
        socket.emit('room');
    }, 1000);

    $('#send-message').focus();

    $('#send-message').submit(() => {
        processUserInput(chatApp, socket);

        return false;
    });
});
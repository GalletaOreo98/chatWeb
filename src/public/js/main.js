$(function () {
    const socket = io();

    //Obtaining DOM elements from the interface
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    //Obtaining DOM elements from the nickName form
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickName = $('#nickName');
    const $users = $('#userNames');

    $nickForm.submit(e => {
        e.preventDefault();
        socket.emit('new user', $nickName.val(), data => {
            if (data) {
                $('#nickWrap').hide();
                $('#contentWrap').show();
            }else{
                $nickError.html(`
                    <div class="alert alert-danger">
                        Ese usuario ya existe
                    </div>`
                );
            }
        })
    });
    //Events
    $messageForm.submit(e => {
        e.preventDefault();
        socket.emit('send message', $messageBox.val(), data => {
            $chat.append(`<p class="error">${data}</p>`);
        });
        $messageBox.val('');
    });

    socket.on('new message', function (data) {
       $chat.append('<b>' + data.nick + '</b>: ' + data.msg + '</br>'); 
    });

    socket.on('usernames', data => {
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`  
        }
        $users.html(html);
    });

    socket.on('whisper', data => {
        $chat.append(`<p class="whisper"><b>${data.nick}: </b>${data.msg}</p>`);
    })
});
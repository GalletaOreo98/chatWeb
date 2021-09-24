module.exports = function(io){

    let users = {};
    
    io.on('connection', socket =>{
        console.log('new user connected');

        socket.on('new user', (data, cb) => {
            if (data in users){
                cb(false);
            } else{
                cb(true);
                socket.nickName = data;
                users[socket.nickName] = socket;
                updateNickNames();
            }
        });

        socket.on('send message', (data, cb) => {
            var msg = data.trim();

            if (msg.substr(0, 3) === '/w ') {
                msg = msg.substr(3);
                const index = msg.indexOf(' ');
                if (index !== -1) {
                    var name = msg.substring(0, index);
                    var msg = msg.substring(index + 1);
                    if (name in users) {
                        users[name].emit('whisper', {
                            msg,
                            nick: socket.nickName
                        });
                    }else{
                        cb('Error, este usuario no existe');
                    }
                }else{
                    cb('Error, no has ingresado un mensaje');
                }
            }else{
                io.sockets.emit('new message', {
                    msg: data,
                    nick: socket.nickName
                });
            }

        });


        socket.on('disconnect', data => {
            if(!socket.nickName) return;
            delete users[socket.nickName];
            updateNickNames();
            console.log('an user disconnected');
        });

        function updateNickNames() {
            io.sockets.emit('usernames', Object.keys(users));
        }
    });

    
}
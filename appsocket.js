/* ************************************************************************ */
/*
    Socket IO Stuff - This is where we'll wait for socket.io events. Any 
    other module that has access to server.js:app can also wait for events.
*/
exports = module.exports = function (io) {
    // Set socket.io listeners.
    io.on('connection', function(socket) {
        console.log('SOCKET.IO - client connected id = '+socket.id+' addr = '+socket.conn.remoteAddress);
    
        socket.on('disconnect', function() {
            console.log('SOCKET.IO - client disconnected');
        });
    });
};


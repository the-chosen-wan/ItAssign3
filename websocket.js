const io = require('socket.io')()
var socketIds = {}

io.on('connection', (socket) => {
    socket.on('connectionInit', (data) => {
        if(socketIds[data.username] == null) {
            socketIds[data.username] = [socket.id]
        }
        else{
            socketIds[data.username].push(socket.id)
        }
    })

    socket.on('disconnect', () => {
        for(var key in socketIds) {
            socketIds[key] = socketIds[key].filter((id) => id != socket.id)
        }
    })

    socket.on('chatMessage',(data)=>{
        if(socketIds[data.to] != null) {
            socketIds[data.to].forEach((id) => {
                io.to(id).emit('chatMessage', data)
            })
        }
    })
})

module.exports.io = io
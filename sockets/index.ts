import socketIO from 'socket.io';

const io = new socketIO.Server();

io.on('connection', (socket) => {
  console.log('is connected');
  socket.emit('test', 'This worked!');
  socket.on('join_room', (room) => {
    socket.join(room);
  });
  socket.on('message', (message) => {
    console.log(message);
    socket.emit('broadcast_message', message.message);
  });
});

io.on('connect_error', (err) => {
  console.log(`Connection error: ${err}`);
});

function init(server: any) {
  io.attach(server, {
    serveClient: false,
    cors: {
      origin: '*',
    },
  });
}

export default {
  init,
};

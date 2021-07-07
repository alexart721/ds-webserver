import socketIO from 'socket.io';
import Messages from '../models/message';
import Issues from '../models/issue';

const io = new socketIO.Server();
let activeRooms: string[] = [];

io.on('connection', (socket) => {
  console.log(socket, 'is connected');
  socket.emit('test', 'This worked!');
  socket.on('join_room', (room) => {
    if (room !== 'undefined' && !activeRooms.includes(room)) {
      activeRooms = activeRooms.concat(room);
    }
    if (!socket.rooms.has(room)) socket.join(room);
    console.log(activeRooms);
  });
  socket.on('leave_all_rooms', (exclude) => {
    activeRooms.forEach((room) => {
      if (room !== exclude) {
        socket.leave(room);
      }
    });
    console.log(io.sockets.adapter.rooms);
  });
  // This works, may need to revert if rooms doesn't work
  // socket.on('message', (message) => {
  //   socket.to(room).emit('test', message);
  //   socket.emit('broadcast_message', message.message);
  // });
  socket.on('room_message', async (message) => {
    console.log(Object.entries(message.message));
    const newMessage = await Messages.create({
      messageOwnerId: message.message.messageOwnerId,
      messageOwnerName: message.message.messageOwnerName,
      content: message.message.content,
    });
    await Issues.findByIdAndUpdate(message.room, { $push: { threadMessages: newMessage } }, { new: true });
    console.log('Sending to room: ', message.room);
    console.log(io.sockets.adapter.rooms);
    io.to(message.room).emit('broadcast_message', message.message);
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

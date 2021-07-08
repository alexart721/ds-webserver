import socketIO from 'socket.io';
import Messages from '../models/message';
import Issues from '../models/issue';

const io = new socketIO.Server();
let activeRooms: string[] = [];

io.on('connection', (socket) => {
  socket.on('join_room', (room) => {
    if (room !== 'undefined' && !activeRooms.includes(room)) {
      activeRooms = activeRooms.concat(room);
    }
    if (!socket.rooms.has(room)) socket.join(room);
  });
  socket.on('leave_all_rooms', (exclude) => {
    activeRooms.forEach((room) => {
      if (room !== exclude) {
        socket.leave(room);
      }
    });
  });
  // This works, may need to revert if rooms doesn't work
  // socket.on('message', (message) => {
  //   socket.to(room).emit('test', message);
  //   socket.emit('broadcast_message', message.message);
  // });
  socket.on('room_message', async (message) => {
    const newMessage = await Messages.create({
      messageOwnerId: message.message.messageOwnerId,
      messageOwnerName: message.message.messageOwnerName,
      content: message.message.content,
    });
    await Issues.findByIdAndUpdate(message.room, { $push: { threadMessages: newMessage } }, { new: true });
    io.to(message.room).emit('broadcast_message', message.message);
  });
});

io.on('connect_error', () => {});

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

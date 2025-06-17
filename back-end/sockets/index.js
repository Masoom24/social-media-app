const connectedUsers = new Map();

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("registerUser", (userId) => {
      connectedUsers.set(userId, socket.id);
    });
    socket.on("joinCelebrityRoom", (celebrityId) => {
      socket.join(celebrityId); // ✅ join that room
      console.log(`User ${socket.id} joined celebrity room ${celebrityId}`);
    });
    // socket.on("newPost", (data) => {
    //   console.log("Got new post via socket:", data);
    // });

    socket.on("disconnect", () => {
      for (let [uid, sid] of connectedUsers.entries()) {
        if (sid === socket.id) {
          connectedUsers.delete(uid);

          break;
        }
      }
    });
  });

  io.connectedUsers = connectedUsers;
};

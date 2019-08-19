const Dev = require("../models/Dev");

module.exports = {
  async store(req, res) {
    console.log(req.io, req.connectedUsers);

    const { DevId } = req.params;
    const { user } = req.headers;

    const loggedDev = await Dev.findById(user);
    const targetDev = await Dev.findById(DevId);

    if (!targetDev) {
      return res.status(400).json({ error: "Dev not exists" });
    }

    if (targetDev.likes.includes(loggedDev._id)) {
      const loggedSocket = req.connectedUsers[user];
      const targerSocket = req.connectedUsers[DevId];

      if (loggedSocket) {
        req.io.to(loggedSocket).emit("match", targetDev);
      }
      if (targerSocket) {
        req.io.to(targerSocket).emit("match", loggedDev);
      }
    }

    loggedDev.likes.push(targetDev._id);

    await loggedDev.save();

    return res.json(loggedDev);
  }
};

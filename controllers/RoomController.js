const RoomRouter = require("express").Router();
const { usedRoomIds, roomPlayers, isGameStartedForRoom, maxPlayersInGame } = require("../shared");

RoomRouter.get("/createRandomNotUsedRoomId", (req, res) => {
  try {
    const createRandomRoomId = () => {
      const s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
      let roomKey = "";
      for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * s.length);
        roomKey += s[randomIndex];
      }
      return roomKey;
    };
    let roomId = createRandomRoomId();
    while (usedRoomIds.has(roomId)) {
      roomId = createRandomRoomId();
    }
    return res.status(200).json({ roomId: roomId });
  } catch (err) {
    console.log("Error while creating random roomId");
    return res.status(500).json(err.message);
  }
});

RoomRouter.get("/canEnterRoom/:game/:roomId", (req, res) => {
  try {
    const roomId = req.params.roomId;
    const game = req.params.game;
    if (roomId.length !== 5) {
      return res
        .status(200)
        .json({
          canJoin: false,
          message: "Incorrect type of roomId!",
          caseCode: -1,
        });
    }
    if (!roomPlayers[game][roomId]) {
      return res
        .status(200)
        .json({
          canJoin: true,
          message: "You are joining an empty room!",
          caseCode: 0,
        });
    }
    if (roomPlayers[game][roomId].size > maxPlayersInGame[game]) {
      return res
        .status(200)
        .json({
          canJoin: false,
          message: "Capacity of room is full!",
          caseCode: 1,
        });
    }
    if (isGameStartedForRoom[game][roomId] === true) {
      return res
        .status(200)
        .json({
          canJoin: false,
          message: "Game for that room has already started!",
          caseCode: 2,
        });
    }
    return res
        .status(200)
        .json({ 
            canJoin: true, 
            message: "Can join!!", 
            caseCode: 3 
        });
  } catch (err) {
    console.log("Error while checking if room can be joined in bingo");
    return res.status(500).json(err.message);
  }
});

module.exports = RoomRouter;

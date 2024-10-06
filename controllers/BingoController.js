const BingoRouter = require("express").Router();
const {Bingo_createRandomBoard} = require("../HelperFunctions/Bingo/Bingo_createRandomBoard");
const {Bingo_FindOptimalNumber} = require("../HelperFunctions/Bingo/Bingo_FindOptimalNumber");
const BingoStats = require("../models/BingoStats");

BingoRouter.get("/findRandomBingoBoard", (req, res) => {
  try {
    const board = Bingo_createRandomBoard();
    return res.status(200).json({ result: board });
  } catch (err) {
    console.log("Error while finding random board in bingo");
    return res.status(500).json(err.message);
  }
});

BingoRouter.post("/findOptimalMove", (req, res) => {
  try {
    const findOptimalMove = Bingo_FindOptimalNumber(
      req.body.board,
      req.body.numbersCalled
    );
    return res.status(200).json({ result: findOptimalMove });
  } catch (err) {
    console.log("Error while finding optimal move in bingo");
    return res.status(500).json(err.message);
  }
});

BingoRouter.put("/updateStats", async (req, res) => {
  try {
    const userStats = await BingoStats.findOne({
      email: req.body.email,
    }).lean();
    let indx = 0;
    if (req.body.isMultiplayer) {
      indx = 1;
    }
    userStats.total_games_played[indx]++;
    if (req.body.result === true) {
      userStats.total_games_won[indx]++;
    }
    const updatedStats = await BingoStats.findByIdAndUpdate(
      userStats._id,
      userStats,
      { new: true }
    );
    console.log(`${req.body.email} stats were updated`);
    return res.status(201).json(updatedStats);
  } catch (err) {
    console.log("Error while updating stats in bingo");
    return res.status(500).json(err.message);
  }
});

module.exports = BingoRouter;

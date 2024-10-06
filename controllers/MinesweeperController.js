const MinesweeperRouter=require('express').Router();
const { createRandomBoard } = require('../HelperFunctions/Minesweeper/Minesweeper_FindRandomBoardBoard');
const MinesweeperStats=require('../models/MinesweeperStats');

MinesweeperRouter.get('/',(req,res)=>{
    res.send('Mox is gr8!!');
});

MinesweeperRouter.get('/getRandomBoard',(req,res)=>{
    try{
        res.status(200).json(createRandomBoard(req.query.size,req.query.mines));
    }catch(err){
        console.log("Error while getting randomBoad in minesweeper");
        return res.status(500).json(err.message);
    }
})

MinesweeperRouter.put('/updateStats',async(req,res)=>{
    try{
      const userStats=await MinesweeperStats.findOne({email:req.body.email}).lean();

      console.log(req.body.email);
      console.log(userStats);
      
      userStats.total_games_played++;
      if(req.body.result===true){
        userStats.total_games_won++;
        userStats.best_time=Math.min(userStats.best_time,req.body.timeTaken);
      }
      const updatedStats=await MinesweeperStats.findByIdAndUpdate(userStats._id,userStats,{new:true});
      return res.status(201).json(updatedStats);
    }catch(err){
      console.log("Error while updating stats in minesweeper");
      return res.status(500).json(err.message);
    }
});

module.exports=MinesweeperRouter;
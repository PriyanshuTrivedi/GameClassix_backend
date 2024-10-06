const TicTackToeRouter=require('express').Router();
const {TicTacToe_FindMoveAccToDifficulty}=require('../HelperFunctions/TicTacToe/TicTacToe_FindMoveAccToDifficulty');
const TicTacToeStats=require('../models/TicTacToeStats');

const mapDifficultyToIndex={
    easy:0,
    medium:1,
    hard:2
}

TicTackToeRouter.post('/findOptimalMove',(req,res)=>{
    try{
        const optimalMove=TicTacToe_FindMoveAccToDifficulty(req.body.difficulty,req.body.board);
        return res.status(200).json({result:optimalMove});
    }catch(err){
        console.log("Error while finding optimal move in tic tac toe");
        return res.status(500).json(err.message);
    }
});

TicTackToeRouter.put('/updateStats',async(req,res)=>{
    try{
      console.log(req.body);
      const userStats=await TicTacToeStats.findOne({email:req.body.email}).lean();
      if(req.body.isMultiplayer===true){
        userStats.total_games_played[3]++;
        if(req.body.result===1){
          userStats.total_games_won[3]++;
        }else if(req.body.result===-1){
          userStats.total_games_tie[3]++;
        }
      }else{
        const diff=mapDifficultyToIndex[req.body.difficulty];
        userStats.total_games_played[diff]++;
        if(req.body.result===1){
          userStats.total_games_won[diff]++;
        }else if(req.body.result===-1){
          userStats.total_games_tie[diff]++;
        }
      }
      const updatedStats=await TicTacToeStats.findByIdAndUpdate(userStats._id,userStats,{new:true});
      return res.status(201).json(updatedStats);
    }catch(err){
      console.log("Error while updating stats in tic tac toe");
      return res.status(500).json(err.message);
    }
});

module.exports=TicTackToeRouter;
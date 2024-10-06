const SudokuRouter=require('express').Router();
const {Sudoku_RandomSolvableSudokuWithSolution}=require('../HelperFunctions/Sudoku/Sudoku_RandomSolvableSudokuWithSolution');
const SudokuStats=require('../models/SudokuStats');

const mapDifficultyToIndex={
    beginner:0,
    easy:1,
    medium:2,
    hard:3
}

SudokuRouter.post('/findRandomSolvableSudokuWithSolution',async(req,res)=>{
    try{
        const RandomSolvableSudokuWithSolution=await Sudoku_RandomSolvableSudokuWithSolution(req.body.difficulty);
        return res.status(200).json(RandomSolvableSudokuWithSolution);
    }catch(err){
        console.log("Error while finding optimal move in sudoku");
        return res.status(500).json(err.message);
    }
});

SudokuRouter.put('/updateStats',async(req,res)=>{
    try{
      const userStats=await SudokuStats.findOne({email:req.body.email}).lean();
      const diff=mapDifficultyToIndex[req.body.difficulty];
      userStats.total_games_played[diff]++;
      if(req.body.result===true){
        userStats.total_games_won[diff]++;
        userStats.best_time[diff]=Math.min(userStats.best_time[diff],req.body.timeTaken);
      }
      const updatedStats=await SudokuStats.findByIdAndUpdate(userStats._id,userStats,{new:true});
      return res.status(201).json(updatedStats);
    }catch(err){
      console.log("Error while updating stats in sudoku");
      return res.status(500).json(err.message);
    }
});

module.exports=SudokuRouter;
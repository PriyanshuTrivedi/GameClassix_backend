const DotAndBoxesRouter=require('express').Router();
const {DotAndBoxes_FindOptimalMove}=require('../HelperFunctions/DotAndBoxes/DotAndBoxes_FindOptimalMove');
const verifyToken = require('../middlewares/verifyToken');
const DotBoxesStats=require('../models/DotBoxesStats');

const mapDifficultyToIndex={
  easy:0,
  medium:1,
  hard:2
}

DotAndBoxesRouter.post('/findOptimalMove',(req,res)=>{
  try{
    const findOptimalMove=DotAndBoxes_FindOptimalMove(req.body.horiLineMatrix,req.body.vertLineMatrix,req.body.difficulty);
    return res.status(200).json({result:findOptimalMove});
  }catch(err){
    console.log("Error while finding optimal move in dot and boxes");
    return res.status(500).json(err.message);
  }
});

DotAndBoxesRouter.put('/updateStats',verifyToken,async(req,res)=>{
  try{
    const userStats=await DotBoxesStats.findOne({email:req.body.email}).lean();
    if(req.body.isMultiplayer===true){
      userStats.total_games_played[3]++;
      if(req.body.result===true){
        userStats.total_games_won[3]++;
      }
    }else{
      const diff=mapDifficultyToIndex[req.body.difficulty];
      userStats.total_games_played[diff]++;
      if(req.body.result===true){
        userStats.total_games_won[diff]++;
      }
    }
    
    const updatedStats=await DotBoxesStats.findByIdAndUpdate(userStats._id,userStats,{new:true});
    return res.status(201).json(updatedStats);
  }catch(err){
    console.log("Error while updating stats in dot and boxes");
    return res.status(500).json(err);
  }
});

module.exports=DotAndBoxesRouter;
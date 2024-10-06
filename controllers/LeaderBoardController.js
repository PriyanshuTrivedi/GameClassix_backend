const LeaderBoardRouter=require('express').Router();
const userModel=require('../models/user');

LeaderBoardRouter.post('/',async(req,res)=>{
    try{
        let gameStat;
        if (req.body.game === 'dotAndBoxes') {
            gameStat = 'dotboxesstats';
        } else if (req.body.game === 'ticTacToe') {
            gameStat = 'tictactoestats';
        } else if (req.body.game === 'sudoku') {
            gameStat = 'sudokustats';
        } else if (req.body.game === 'bingo') {
            gameStat = 'bingostats';
        }else if(req.body.game==='minesweeper'){
            gameStat='minesweeperstats';
        }
        // this join op just to get the username since it is not included in stats 
        const leaderBoard = await userModel.aggregate([
            {
                $lookup: {
                    from: gameStat,         
                    localField: "email",    
                    foreignField: "email",  
                    as: "stats"             
                }
            },
            {
                $unwind: "$stats"
            }
        ]);
        const result=[];
        leaderBoard.forEach((el)=>{
            let temp=el.stats;
            temp["username"]=el.username;
            result.push(temp);
        });
        const index=req.body.index;
        if(req.body.sortAccTo==="wins"){
            result.sort((b,a)=> a.total_games_won[index]-b.total_games_won[index]);
        }else{
            result.sort((b,a)=> (a.total_games_won[index]/a.total_games_played[index])-(b.total_games_won[index]/b.total_games_played[index]));
        }
        return res.status(200).json(result);
    }catch(err){
        console.log(`Error while fetching leaderboard of ${req.params.game}`);
        return res.status(500).json(err.message);
    }
});

module.exports=LeaderBoardRouter;

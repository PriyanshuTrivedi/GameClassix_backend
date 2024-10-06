const mongoose=require('mongoose');

// type of total_games_played, total_games_won and best_time is array of 4 integers coz of [singlePlayerEasy,med,hard,multiplayer]

const TicTacToeSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    total_games_played:{
        type:[Number],
        default:[0,0,0,0],
        required:true
    },
    total_games_won:{
        type:[Number],
        default:[0,0,0,0],
        required:true
    },
    total_games_tie:{
        type:[Number],
        default:[0,0,0,0],
        required:true
    }
},{timestamps:true});

const TicTacToeModel=mongoose.model('TicTacToeStats',TicTacToeSchema);

module.exports=TicTacToeModel;
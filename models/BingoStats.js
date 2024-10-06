const mongoose=require('mongoose');

// type of total_games_played, total_games_won and best_time is array of 2 integers coz of [singlePlayerMode,multiPlayerMode]

const BingoSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    total_games_played:{
        type:[Number],
        default:[0,0],
        required:true
    },
    total_games_won:{
        type:[Number],
        default:[0,0],
        required:true
    }
},{timestamps:true});

const BingoModel=mongoose.model('BingoStats',BingoSchema);

module.exports=BingoModel;
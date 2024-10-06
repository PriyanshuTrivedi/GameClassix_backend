const mongoose=require('mongoose');

// type of total_games_played, total_games_won and best_time is array of 4 integers coz of difficulty 

const SudokuSchema=new mongoose.Schema({
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
    best_time:{
        type:[Number],
        default:[3600,3600,3600,3600],
        required:true
    }
},{timestamps:true});

const SudokuModel=mongoose.model('SudokuStats',SudokuSchema);

module.exports=SudokuModel;
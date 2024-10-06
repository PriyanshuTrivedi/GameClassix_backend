const mongoose=require('mongoose');

const MinesweeperSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    total_games_played:{
        type:Number,
        default:0,
        required:true
    },
    total_games_won:{
        type:Number,
        default:0,
        required:true
    },
    best_time:{
        type:Number,
        default:3600,
        required:true
    }
},{timestamps:true});

const MinesweeperModel=mongoose.model('MinesweeperStats',MinesweeperSchema);

module.exports=MinesweeperModel;
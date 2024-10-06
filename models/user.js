const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profileImg:{
        type:String,
        default:null
    }
},{timestamps:true});

const userModel=mongoose.model('User',UserSchema);

module.exports=userModel;
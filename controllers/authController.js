const express=require('express');
const authRouter=express.Router();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const userModel=require('../models/user');
const DotBoxesStats=require('../models/DotBoxesStats');
const TicTacToeStats=require('../models/TicTacToeStats');
const SudokuStats=require('../models/SudokuStats');
const BingoStats=require('../models/BingoStats');
const MinesweeperStats=require('../models/MinesweeperStats');
require('dotenv').config();

const deletePasswordAndAddJWT=(userInfo)=>{
    delete userInfo.password;
    const token=jwt.sign({id:userInfo._id},process.env.JWT_SECRET,{expiresIn:'7d'});
    const result={
        token:token,
        others:userInfo
    };
    return result;
}

const createInStatsdb=async(mail)=>{
    await DotBoxesStats.create({email:mail});
    await TicTacToeStats.create({email:mail});
    await SudokuStats.create({email:mail});
    await BingoStats.create({email:mail});
    await MinesweeperStats.create({email:mail});
}


authRouter.post('/register',async(req,res)=>{
    try{
        const found=await userModel.findOne({email:req.body.email});
        if(found){
            return res.status(400).json({msg:"Already registered with this email"});
        }
        const duplicateUserName=await userModel.findOne({username:req.body.username});
        if(duplicateUserName){
            return res.status(400).json({msg:"Already registered with this username"});
        }
        const saltRounds=10;
        const hashedPassword=await bcrypt.hash(req.body.password,saltRounds);
        const newUser={
            email:req.body.email,
            username:req.body.username,
            password:hashedPassword
        };
        const addedUser=await userModel.create(newUser);
        await createInStatsdb(req.body.email);
        const result=deletePasswordAndAddJWT(addedUser._doc);
        return res.status(201).json(result);
    }catch(err){
        console.log('There was error while registering');
        return res.status(500).json(err.message);
    }
});

authRouter.post('/login',async(req,res)=>{
    try{
        const userWithSameEmail=await userModel.findOne({email:req.body.email});
        if(!userWithSameEmail){
            return res.status(404).json({msg:"No user with such email exists!!"});
        }
        const passwordMatched=await bcrypt.compare(req.body.password,userWithSameEmail.password);
        if(!passwordMatched){
            return res.status(400).json({msg:"Wrong Password!!"});
        }
        const result=deletePasswordAndAddJWT(userWithSameEmail._doc);
        return res.status(200).json(result);
    }catch(err){
        console.log('There was error while login');
        return res.status(500).json(err.message);
    }
});

authRouter.get('/profile/:username',async(req,res)=>{
    try{
        const user=await userModel.findOne({username:req.params.username});
        if(!user){
            return res.status(404).json({msg:"No user with such username exists!!"});
        }
        const userEmail=user.email;
        const bingoStats=await BingoStats.findOne({email:userEmail});
        const dotAndBoxesStats=await DotBoxesStats.findOne({email:userEmail});
        const ticTacToeStats=await TicTacToeStats.findOne({email:userEmail});
        const minesweeperStats=await MinesweeperStats.findOne({email:userEmail});
        const sudokuStats=await SudokuStats.findOne({email:userEmail});
        const ans={
            "email":userEmail,
            "username":req.params.username,
            "bingo":{
                "total_games_played":bingoStats.total_games_played,
                "total_games_won":bingoStats.total_games_won,
            },
            "dotAndBoxes":{
                "total_games_played":dotAndBoxesStats.total_games_played,
                "total_games_won":dotAndBoxesStats.total_games_won,
            },
            "ticTacToe":{
                "total_games_played":ticTacToeStats.total_games_played,
                "total_games_won":ticTacToeStats.total_games_won,
                "total_games_tie":ticTacToeStats.total_games_tie,
            },
            "minesweeper":{
                "total_games_played":minesweeperStats.total_games_played,
                "total_games_won":minesweeperStats.total_games_won,
                "best_time":minesweeperStats.best_time,
            },
            "sudoku":{
                "total_games_played":sudokuStats.total_games_played,
                "total_games_won":sudokuStats.total_games_won,
                "best_time":sudokuStats.best_time,
            },
        };
        return res.status(200).json(ans);
    }catch(err){
        console.log('There was error while fetching profile');
        res.status(500).json(err.message);
    }
});

module.exports=authRouter;
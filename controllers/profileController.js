const express=require('express');
const profileRouter=express.Router();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const multer=require('multer');
const userModel=require('../models/user');
require('dotenv').config();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../profileImages')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname)
    }
});
const upload = multer({
    storage: storage,
    limits:{ fileSize: 1000000 * 100 },
});

profileRouter.get('/:id',async(req,res)=>{
    try{
        // mongoose return immutable objects so to convert them to mutable we use .lean()
        const user=await userModel.findById(req.params.id).lean();
        if(!user){
            return res.status(404).json({msg:"No user with such id exists!!"});
        }
        delete user.password;
        return res.status(200).json(user);
    }catch(err){
        console.log('There was error while fetching profile');
        return res.status(500).json(err.message);
    }
});

profileRouter.put('/:id',upload.single('img'),async(req,res)=>{
    try{
        const user=await userModel.findById(req.params.id);
        if(!user){
            return res.status(404).json({msg:"No user with such id exists!!"});
        }
        if(req.params.id!==req.user.id.toString()){
            return res.status(403).json({msg:"You cannot change other's profile!!"});
        }
        if(req.body.password){
            const saltRounds=10;
            const newPassword=await bcrypt.hash(req.body.password,saltRounds);
            req.body.password=newPassword;
        }
        let updatedData={...req.body};
        if(req.body.email){
            const found=await userModel.finddOne({email:req.body.email});
            if(found){
                return res.send(400).json({msg:"Cannot change email as the given email is already registered!!"});
            }
        }
        if(req.file){
            updatedData.profileImg=req.file.filename;
        }
        const updatedUser= await userModel.findByIdAndUpdate(req.params.id,updatedData,{new: true}).lean();
        delete updatedUser.password;
        return res.status(201).json(updatedUser);
    }catch(err){
        console.log('There was error while updating profile');
        return res.status(500).json(err.message);
    }
});

module.exports=profileRouter;
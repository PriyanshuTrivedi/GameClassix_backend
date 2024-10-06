const mongoose=require('mongoose');
require('dotenv').config();

const dbConnection=async()=>{
    const URL=process.env.MONGO_URL;
    try{
        await mongoose.connect(URL,{});
        console.log('database connected successfully!!')
    }catch(err){
        console.log(`Error while connecting to db, error->`);
        console.log(err);
    }
}

module.exports=dbConnection;
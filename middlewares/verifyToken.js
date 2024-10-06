const jwt=require('jsonwebtoken');

const verifyToken=async(req,res,next)=>{
    if(!req.headers.authorization){
        return res.status(403).json({msg:'Not authorized. No token'});
    }
    const authorization=req.headers.authorization;
    if(authorization.startsWith("Bearer ")){
        const token=authorization.split(' ')[1];
        jwt.verify(token,process.env.JWT_SECRET,(err,data)=>{
            if(err){
                return res.status(403).json({msg:'Wrong or expired token'});
            }else{
                req.user=data;
                next();
            }
        })
    }
}

module.exports=verifyToken;
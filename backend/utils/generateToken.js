import jwt from 'jsonwebtoken';
import { ENV_VARS } from '../config/envVars.js';

export const generateTokenAndSetCookie=(user,res)=>{
    const token=jwt.sign({id:user._id},ENV_VARS.JWT_SECRET,{expiresIn:'1d'});
    const now = new Date();
    const expiresAtMidnight = new Date(now);
    expiresAtMidnight.setHours(23, 59, 59, 999);
    res.cookie('jwt-hirehelper',token,{
        expires:expiresAtMidnight,
        httpOnly:true, 
        sameSite:"none",
        secure:true
    });
    return token;
}
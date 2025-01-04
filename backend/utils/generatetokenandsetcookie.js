import jwt from 'jsonwebtoken'

export const generateTokenAndSetCookie = (userID, res) => {
    try {
        const token =jwt.sign({userID},process.env.JWT_SECRET,{expiresIn:"7d"})
        const options = {
           
            
            secure: process.env.NODE_ENV === 'production',
           
            maxAge: 7 * 24 * 60 * 60 * 1000
        };    
        res.cookie('token', token, options);
    
        return token;    
    } catch (error) {
        console.log("errro in cookie generation",error);
    }
  
}
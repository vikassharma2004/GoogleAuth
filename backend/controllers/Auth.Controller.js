import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generatetokenandsetcookie.js";
import { sendVerificationEmail, sendWelcomeEmail,sendPasswordResetEmail,sendResetSuccessEmail } from "../mailtrap/email.js";
import crypto from "crypto";

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Something went wrong",
      });
    console.log("error inlogout controler");
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    generateTokenAndSetCookie(user._id, res);
    user.lastlogin = Date.now();
    await user.save();
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Something went wrong",
      });
  }
};
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // user already exists

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ sucess: false, message: "User already exists" });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const verificationcode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = await User.create({
      name,
      email,
      password: hashpassword,
      verificationToken: verificationcode,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    await user.save();

    // jwt cookie token
    generateTokenAndSetCookie(user._id, res);

    // verification mail
    sendVerificationEmail(user?.email, user?.verificationToken);

    res.status(200).json({
      sucess: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ sucess: false, message: error.message });
  }
};

export const verifyemail = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid or expired verification code",
        });
    }

    user.isverified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const forgetPassword=async(req,res)=>{
    const {email}=req.body;
    try {
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message:"User not found"});  
        }
        // generate reset token 
        const resettoken=crypto.randomBytes(20).toString("hex");
        const resettokenexpires=Date.now()+1*60*60*1000;
        user.resetPasswordToken=resettoken;
        user.resetPasswordExpiresAt=resettokenexpires;
        await user.save();
        // send reset password email
        sendPasswordResetEmail(user.email,`https://google-auth-snowy.vercel.app/reset-password?token=`+resettoken);
        res.status(200).json({success:true,message:"Reset password link sent to your email"});

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
        console.log("errro in forget password",error);
        
    }
}
export const resetpassword=async(req,res)=>{
    try {
        const {token}=req.params;
        const {password}=req.body;

        const user=await User.findOne({resetPasswordToken:token,resetPasswordExpiresAt:{$gt:Date.now()}});
        if(!user){
            return res.status(400).json({success:false,message:"Invalid or expired token"});
        }
        user.password=await bcrypt.hash(password,10);
        user.resetPasswordToken=undefined;
        user.resetPasswordExpiresAt=undefined;
        await user.save();
       await  sendResetSuccessEmail(user?.email);
        res.status(200).json({success:true,message:"Password reset successfully"});
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
        console.log("errro in reset password",error);
    }
}
   export const checkAuth=async(req,res)=>{
   
    
    try {
		const user = await User.findById(req.userId)
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user: { ...user._doc, password: undefined } });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};
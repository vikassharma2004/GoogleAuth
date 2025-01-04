 import express from "express"
import { login, logout,register, verifyemail,forgetPassword ,resetpassword,checkAuth} from "../controllers/Auth.Controller.js"
import { verifyToken } from "../middleware/verifytoken.js"

 const router=express.Router()
router.route("/check-auth").get(verifyToken,checkAuth)
 router.route("/login").post(login)

router.route("/register").post(register)


router.route("/forgot-password").post(forgetPassword)
router.route("/reset-password/:token").post(resetpassword)
router.route("/logout").post(logout)
router.route("/verify-email").post(verifyemail)

 export default router
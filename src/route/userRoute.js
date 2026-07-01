import { Router } from "express";
import { About, postUser, login, logOut } from "../controller/usercontroller.js";
import { checkAuth } from "../middleware/authmiddleware.js";


const router = Router()

router.get("/about", About)
router.post("/signup", postUser)
router.post("/login", login)
router.get("/logout", checkAuth, logOut)
router.get("/rofile", checkAuth)


export default router;
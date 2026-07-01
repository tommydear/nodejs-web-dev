
import jwt from "jsonwebtoken"
import { userModel } from "../models/userSchema.js"
import dotenv from "dotenv"
dotenv.config()

const secret = process.env.JWT_SECRET


export const checkAuth = async (req, res, next) => {
    const token = req.cookies.token

    if(!token) {
        return res.status(404).json({
            message: "Token not found!"
        })
    }

    try {
        const decodedToken = await jwt.verify(token, secret)

        const user = await userModel.findById(decodedToken.id)

        if(!user) {
            return res.status(404).json({
                message: `User with id:${decodedToken.id} does not exist!`
            })
        }

        req.user = user

        next()
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token!"
        })
    }

}

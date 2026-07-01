import { userModel } from "../models/userSchema.js"
import { signupValidate, loginValidate } from "../validator/userValidator.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generatetoken.js"




export const About = (req, res) => {
    res.send("About page")
}

export const login = async (req, res) => {
   try{
   const {email, password} = req.body

   const {error} = loginValidate.validate(req.body)

   if(error) {
    return res.status(400).json({
        message: error.details[0].message
    })
   }

   const existingUser = await userModel.findOne({email})

   if(!existingUser) {
    return res.status(404).json({
        data: existingUser,
        message: "User not found, signup instead"
    })
   }

   const isPasswordValid = await bcrypt.compare(password, existingUser.password)

   if(!isPasswordValid) {
    return res.status(401).json({
        message: "Invalid credentials"
    })
   }

const token = await generateToken(existingUser._id )
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7
        })


   return res.status(200).json({
    data: existingUser,
    message: "Login successful!"
   })

   }catch(err){
    if(err instanceof Error) {
        console.error(err.message, err.name)
        throw new Error(err.message)
    }
   }
}

export const postUser = async (req, res) => {
    try{
        const {username, email, password} = req.body

        const {error} = signupValidate.validate(req.body)

        if(error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }

        const existingUser = await userModel.findOne({email})

        if(existingUser) {
            return res.status(400).json({
                data: existingUser,
                message: "User already exists"
            })
        }

        const newUser = await userModel.create({
            username,
            email,
            password
        })

        const token = await generateToken(newUser._id )
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7
        })



        return res.status(201).json({
            data: newUser,
            message: "User created successfully"
        })

    }catch(err){
        if(err instanceof Error) {
            console.error(err.message, err.name)
            throw new Error(err.message)
        }
    }
}





export const logOut = async (req, res) => {
    try {
        res.clearCookie("token")

        return res.status(200).json({
            message: "Logout sucessful"
        })
    } catch (err) {
        if(err instanceof Error) {
            return res.status(500).json({
                message: err.message
            })
        }
    }
}



export const profile = async (req, res) => {
    try{
        const user = req.user

        return res.status(200).json({
            data: user,
            message: "Profile fetched successfully!"
        })
    }catch(err){
        if(err instanceof Error) {
            return res.status(500).json({
                message: err.message
            })
        }
    }
}
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const secret = process.env.SECRET_KEY

export const generateToken = async (userId) => {
    const token = await jwt.sign({ id: userId }, secret, {
        expiresIn: "7d"
    })

    return token;
}


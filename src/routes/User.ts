import express, { Request, Response } from 'express'
import jwt from "jsonwebtoken"
import User from '../models/UserModel'
import { hashPassword, matchPassword } from '../utils/hash'
import { authMidd } from '../middleware/auth'
import {CustomRequest} from '../middleware/auth'

const router = express.Router()

router.get("/",authMidd, async (req: Request, res: Response)=>{
    try {
        const reqWithUser = req as CustomRequest;
        const users = await User.findById(reqWithUser.user)
        res.json(users)
    } catch (error: any) {
        console.log(error.message)
    }
})

router.post("/", async (req: Request, res: Response)=>{
    try {
        const {username, password} = req.body
        const newPassword = await hashPassword(password)
        const user = await User.create({username, password: newPassword})

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!)
        res.status(201).json({message: "User Created", sucess: true, user, token})
    } catch (error: any) {
        console.log(error.message)
    }
})

router.post("/login", async (req: Request, res: Response)=>{
    try {
        const {username, password} = req.body
        const user = await User.findOne({username})
        if (!user) {
            return res.status(400).json({message: "User does not exist"})
        }
        const isMatch = await matchPassword(password, user.password)
        if (!isMatch) {
            return res.status(400).json({message: "Incorrect password"})
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!)
        res.json({message: "Login Sucessfull", sucess: true, user, token})
    } catch (error: any) {
        console.log(error.message)
    }
})


router.patch("/:id", authMidd, async (req: Request, res: Response)=>{
    try {
        const {username, password} = req.body
        const userId = req.params.id
        const reqWithUser = req as CustomRequest;
        if(reqWithUser.user !== userId) return res.status(401).json({message: "Unauthorized"})
        const newPassword = await hashPassword(password)
        if(!userId) return res.status(400).json({message: "User does not exist or provide a valid id"})

        const user = await User.findByIdAndUpdate(userId, {username, password: newPassword}, {new: true})
        res.json({message: "User Updated", sucess: true, user})
    } catch (error: any) {
        console.log(error.message)
    }
})

router.delete("/:id", authMidd, async (req: Request, res: Response)=>{
    try {
        const userId = req.params.id
        const reqWithUser = req as CustomRequest;
        if(reqWithUser.user !== userId) return res.status(401).json({message: "Unauthorized"})
        await User.findByIdAndDelete(userId)
        res.json({message: "User Deleted", sucess: true})
    } catch (error: any) {
        console.log(error.message)
    }
})




export default router
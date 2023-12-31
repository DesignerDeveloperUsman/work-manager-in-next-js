import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/models/user";
import { connectDb } from "@/helper/db";

export async function GET(request) {
    await connectDb()
    const authToken = request.cookies.get("authToken")?.value
    if (!authToken) {
        return NextResponse.json({
            message: "User Is Not LogIn"
        })
    }
    // console.log(authToken);
    const data = jwt.verify(authToken, process.env.JWT_KEY)
    // data sy hmy user id mil jay gi 
    console.log(data);
    // phr hum user id sy user ki sari detail lyly gy aur password show nhi krway gy
    const user = await User.findById(data._id)
    return NextResponse.json(user)
} 
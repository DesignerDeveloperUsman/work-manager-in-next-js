import { NextResponse } from "next/server";
import { User } from "@/models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDb } from "@/helper/db";
export async function POST(req) {
    const { email, password } = await req.json();
    try {
        await connectDb()
        // 1.get user
        const user = await User.findOne({
            email: email,
        });

        if (user == null) {
            throw new Error("user not found !!");
        }

        // 2.password check
        const matched = bcrypt.compareSync(password, user.password);
        if (!matched) {
            throw new Error("Password not matched !!");
        }

        // 3. generate token

        const token = jwt.sign(
            {
                _id: user._id,
                name: user.name,
            },
            process.env.JWT_KEY
        );

        // 4.create nextresponse-- cookie

        const response = NextResponse.json({
            message: "Login success !!",
            success: true,
            user: user,
        });

        response.cookies.set("authToken", token, {
            expiresIn: "1d",
            httpOnly: true,
        });

        console.log(user);
        console.log(token);

        return response;
    } catch (error) {
        return NextResponse.json(
            {
                message: error.message,
                success: false,
            },
            {
                status: 500,
            }
        );
    }
}
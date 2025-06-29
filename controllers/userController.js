import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import axios from "axios";
dotenv.config()
export function saveUser(req, res) {
    if (req.body.role == "superadmin") {
        if (req.user == null) {
            res.status(403).json({
                message: "please login as super admin before creating an as admin account"
            })
            return
        }
        if (req.user.role != "superadmin") {
            res.status(403).json({
                message: "you are not authorized to create an admin account"
            })
            return
        }

    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const user = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashedPassword,
        role: req.body.role
    }) 


    user.save().then(() => {
        res.json({
            message: "User created successfully"
        })
    }).catch(
        () => {
            res.status(500).json({
                message: "User not created"
            })
        })
}
export function loginUser(req, res) {
    const email = req.body.email;
    const password = req.body.password

    User.findOne({
        email: email
    }).then((user) => {
        if (user == null) {
            res.status(404).json({
                message: "Invalied Email"
            })
        } else {
            const isPasswordCorrect = bcrypt.compareSync(password, user.password)
            if (isPasswordCorrect) {
                const userData = {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    isDisabled: user.isDisable,
                    isEmailVerified: user.isEmailVarified,
                    profilePicture: user.profilePicture
                }
                const token = jwt.sign(userData, process.env.JWT_KEY)
                res.json({
                    message: "login successfull",
                    token: token,
                    user: userData
                })

            } else {
                res.status(403).json({
                    message: "invalid password"
                })
            }



        }

    })
}

export async function googleLogin(req, res) {

    const accessToken = req.body.accessToken

    try {
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        })
        const user = await User.findOne({

            email : response.data.email
        })
        if(user==null){
        console.log(response.data)
            const newUser = new User({
                email: response.data.email,
                firstName: response.data.given_name,
                lastName: response.data.family_name,
                isEmailVarified: true,
                password:accessToken,
                profilePicture:response.data.picture
            })
            await newUser.save()

            const userData = {
                email: response.data.email,
                firstName: response.data.given_name,
                lastName: response.data.family_name,
                profilePicture:response.data.picture,
                role: "user",
                phone:"not given",
                isDisabled: false,
                isEmailVerified: true



            }
            const token = jwt.sign(userData, process.env.JWT_KEY)
            res.json({
                message: "login successfull",
                token: token,
                user: userData
            })


        }
        else{

            const userData = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                phone:user.phone,
                profilePicture:user.profilePicture,
                isDisabled: user.isDisable,
                isEmailVerified: user.isEmailVarified
            }
            const token = jwt.sign(userData, process.env.JWT_KEY)
            res.json({
                message: "login successfull",
                token: token,
                user: userData
            })

        }

    }
    catch (err) {
        console.log(err)
        res.status(500).json(
            {
                message: "error in google login"
            }
        )
    }

}

export function getUsers(req,res){
    if (req.user == null){
        res.status(403).json({
            message: "You need to login first"
        })
        return;
    }
     if(req.user.isDisabled){
        res.status(403).json({
            message: "Your account is disabled"
        })
        return;

    }

    if( req.user.role !=="superadmin" && req.user.role !=="admin"){
        res.status(403).json({
            message:"You are not authorized to get users"
        })
        return;
    }
   User.find().then(
    (users)=>{
        res.json(users)
    }
   ).catch(
    ()=>{
        res.status(500).json({
            message:"users not found"
        })
    }
   )
}

export  function updateUserRole(req, res) {
    if (req.user == null) {
        res.status(403).json({
            message: "You need to login first"
        })
        return;
    }
    if(req.user.isDisabled){
        res.status(403).json({
            message: "Your account is disabled"
        })
        return;
    }
    if (req.user.role != "superadmin") {
        res.status(403).json({
            message: "You are not authorized to update a user"
        })
        return;
    }
     User.findOneAndUpdate({
        email: req.params.email
    }, req.body).then(
        ()=>{
            res.json({
                message:"User updated successfully"
            })
        }
    ).catch(
        (err)=>{
            res.status(500).json({
                message: "User not updated"
            })
        }
    )
}

export function deleteUser(req,res){
    if (req.user == null) {
        res.status(403).json({
            message: "You need to login first"
        })
        return;
    }
    if(req.user.isDisabled){
        res.status(403).json({
            message: "Your account is disabled"
        })
        return;

    }
    if (req.user.role != "superadmin") {
        res.status(403).json({
            message: "You are not authorized to delete a user"
        })
        return;
    }

    User.findOneAndDelete({
        email: req.params.email
    }).then(
        ()=>{
            res.json({
                message:"User deleted successfully"
            })
        }
    ).catch(
        (err)=>{
            res.status(500).json({
                message: "User not deleted"
            })
        }
    )
}
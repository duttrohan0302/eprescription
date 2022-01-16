// Import bcryptjs and JsonWebToken
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Import validations
const validateRegisterInput = require('./../validations/register')
const validateLoginInput = require('./../validations/login')
const validateSetPasswordInput = require('./../validations/setPassword')

const { secretOrKey, frontendURL, mailHost, mailAuthUser, mailAuthPass } = require('../config')

const nodemailer = require('nodemailer');

// Import User Services
const UserService = require('./../services/users');

//Create user
exports.register = async function(req,res, next) {
    const { errors, isValid } = validateRegisterInput(req.body)
    if(!isValid) {
        return res.status(400).json(errors);
    }
    const newUser = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        sex: req.body.sex,
        age: req.body.age,
        userRole: req.body.userRole,
        specialization: req.body.specialization
    }


    try {
        const user = await UserService.findOne(newUser.email)
        if(!user) {
            newUser.password = await hashPassword(newUser.password); 
            const createdUser = await UserService.register(newUser)
            return res.status(200).json(createdUser)
        }
        errors.email = "Email already exists, please login";

        res.status(409).json(errors)
    } catch (errors) {
        return res.status(400).json(errors);
    }
}


//Login controller
exports.login = async function(req, res, next) {
    const { errors, isValid } = validateLoginInput(req.body)
    if(!isValid) {
        return res.status(400).json(errors);
    }
    const { email, password } = req.body;
    try {
        const user = await UserService.findOne(email);

        if(!user) {
            errors.email= "User not found";
            return res.status(404).json(errors)
        }

        // Check password
        const isSame = await compare(password, user.password);

        if(isSame){
            // Password matched, create payload
            const payload = { id: user.id, name: user.name, email:user.email, phone:user.phone, userRole: user.userRole, sex: user.sex, age: user.age, specialization: user.specialization }; //Create JWT Payload
            // Sign token
            jwt.sign(
                payload,
                secretOrKey,
                { expiresIn: 86400 },
                (err, token) => {
                return res.status(200).json({
                    success: true,
                    token: "Bearer " + token,
                    user: user
                });
                }
            );
        } else {
            errors.password = "Password Incorrect";
            return res.status(401).json(errors);
        }
    } catch (errors) {
        res.status(400).json(errors);
    }
}


//Get all users controller
exports.getAll = async function(req,res, next) {
    try {
        const users = await UserService.getAll(req.params.userRole)
        // const data = {
        //         count: users.length,
        //         users: users
        //     }
 
        return res.status(200).json(users)
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message});
    }
}

exports.getMyDoctors = async function(req,res,next) {
    try{
        const myDoctors = await UserService.getMyDoctors(req.user.id)
        let doctors = new Set()
        myDoctors.forEach(prescription=> doctors.add(prescription.doctor))
        return res.status(200).json(Array.from(doctors))
    } catch(e){
        console.log(e)
        return res.status(400).json(e);
    }
}

exports.update = async function (req,res,next) {
    try{
        if(!req.params.id){
            return res.status(400).json({
                errors:{
                    UserId:"User id is required"
                }
            })
        }
        const updateUser = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            sex: req.body.sex,
            age: req.body.age,
            userRole: req.body.userRole,
            specialization: req.body.specialization
        }

        const updatedUser = await UserService.update(req.params.id,updateUser)

        return res.status(200).json(updatedUser)
    }
    catch(errors){
        return res.status(400).json(errors)
    }
}

// Get the current user details controller
exports.getUserById = async function(req,res,next) {
    try{
        const user = await UserService.findOneById(req.body.id)
        return user
    } catch (errors) {
        return res.status(400).json(errors);
    }
}

// Delete a user
exports.delete = async function(req,res, next) {
    try {
        const users = await UserService.delete(req.user.id)

        return res.status(200).json({message: 'User Deleted', data: users})
 
    } catch (errors) {
        return res.status(400).json(errors);
    }
}

// Send mail to user with reset password link
exports.resetPassword = async function(req,res,next){
    try{

        if(!req.body.email){
            return res.status(400).json({errors:{email:"Email is required"}})
        }
        const user = await UserService.findOne(req.body.email)
        if(!user)
            return res.status(400).json({errors:{email:"Email is not registered"}})
        let transport = nodemailer.createTransport({
            host: mailHost,
            port: 2525,
            auth: {
               user: mailAuthUser,
               pass: mailAuthPass
            }
        });
        const payload = { id: user.id, email:user.email }; //Create JWT Payload

        const token = await jwt.sign(payload,secretOrKey,{expiresIn:10*60})
        const url = frontendURL+'/resetPassword/'+token;
        const message = {
            from: 'resetpassword@climbax.com', // Sender address
            to: req.body.email,         // List of recipients
            subject: 'Reset Password Link for Calbook', // Subject line
            html: `<h3>Hello there</h3><p>Your reset password link will be active just for 10 mins on ${req.body.email}. Please click on the link to reset password: <a href=${url}> Reset Password </a> </p>` // Plain text body
        };
        const info = await transport.sendMail(message)
        
        return res.status(200).json(info)
    } catch(errors){
        console.log(errors)
        return res.status(400).json({errors:errors})
    }
}

// Set password
exports.setPassword = async function(req,res,next){

    const { errors, isValid } = validateSetPasswordInput(req.body)
    if(!isValid) {
        return res.status(400).json(errors);
    }
    
    const setPass = {
        id: req.body.id,
        password: req.body.password
    }
    try{
        setPass.password = await hashPassword(setPass.password); 
        const changedPass = await UserService.setPassword(setPass);
        return res.status(200).json(changedPass);
    } catch(errors){
        console.log(errors)
        return res.status(400).json({errors:errors})
    }
}

// Change password
exports.changePassword = async function(req,res,next){

    try{
        const { errors, isValid } = validateSetPasswordInput(req.body)
        if(!isValid) {
            if(!req.body.oldpassword){
                return res.status(400).json({...errors,oldpassword:"Current password is required"})
            }
            
            return res.status(400).json(errors);
        }
        
        if(!req.body.oldpassword){
            return res.status(400).json({errors:{oldpassword:"Current password is required"}})
        }
        if(req.body.oldpassword===req.body.password){
            return res.status(400).json({...errors,password:"Current password and new password cannot be the same"})
        }
    
            const user = await UserService.findOneById(req.body.id);

            // Check password
            const isSame = await compare(req.body.oldpassword, user.password);

            if(!isSame){
                return res.status(400).json({...errors,oldpassword:'Incorrect current password'})
            }else{
                const setPass = {
                    id: req.body.id,
                    password: req.body.password
                }
                setPass.password = await hashPassword(setPass.password); 
                const changedPass = await UserService.setPassword(setPass);
                return res.status(200).json({message:"Password changed Successfully",changedPass});
            }
    }catch(errors){
        console.log(errors)
        return res.status(400).json({errors:errors})
    }
}
//Function to hash Password
async function hashPassword (password) {
    
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, 12, function(err, hash) {
        if (err) reject(err)
        resolve(hash)
      });
    })
  
    return hashedPassword
}

//Compare password
async function compare (password1, password2) {

    const isSame = await new Promise((resolve, reject) => {
        bcrypt.compare(password1, password2, function(err, result) {
            if(err) reject(err)
            resolve(result)
        })
    })

    return isSame;
}



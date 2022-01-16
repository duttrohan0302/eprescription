//Import Model
const User = require('./../models/User')
const Prescription = require('./../models/Prescription')


//Create user
exports.register = async function (newUser) {
    try {
        const user = await User.create(newUser)
        // const user = await User.create({name: newUser.name, email: newUser.email, phone: newUser.phone, password: newUser.password})
        const createdUser = {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            age: user.age,
            sex: user.sex,
            userRole: user.userRole
        }
        return createdUser;
    } catch (e) {
        return e
    }
}



// Get complete list of Users
exports.getEveryUser = async function(){
    try{
        const users = await User.find()
        return users;
    }catch (e) {
        return e
    }
}

//Get all users
exports.getAll = async function (userRole) {
    try {
        const users = await User.find({userRole: userRole},{name:1,email:1, phone:1,sex:1,age:1,userRole:1})
        return users;
    } catch (e) {
        return e
    }
}

exports.getMyDoctors = async function(id){
    try{
        const myDoctors = await Prescription.find({patient:id}).populate('doctor',{password:0})
        return myDoctors
    }catch (e) {
        return e
    }
}

exports.update = async function(userId,updateUser){
    try{
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateUser
            // {
            //     name:updateUser.name,
            //     email:updateUser.email,
            //     phone:updateUser.phone
            // }
            ,{
                "fields": { "password":0},
                new:true,
                omitUndefined: true
            }
        )
        return updatedUser
    }
    catch(errors) {
        return errors;
    }
} 


//Service to check if user already exist
exports.findOne = async function(email) {

    let user = await User.findOne({email: email})

    if(user){
        console.log("Service=> Email already exists");
    }
    else{
        console.log("Service=>user doesn't exist")
    }

    return user
}

//User find one by ID
exports.findOneById = async function(id) {
    try{
        const user = await User.findById(id)
        return user

    }catch(err){
        return err;
    }

}

// Delete a user
exports.delete = async function(id) {
    try{
        let response = await User.findByIdAndDelete(id);

        const user = {
            id: response._id,
            name: response.name,
            email: response.email,
            phone: response.phone
        }
        return user;
        
    } catch(errors) {
        return errors
    }
}

// Set password
exports.setPassword = async function(userDetails){
    try{
        const user = await User.findByIdAndUpdate(
            userDetails.id,
            {
                password:userDetails.password
            },{
                "fields": { "password":0},
                new:true
            }
        )
        return user;
    } catch(errors) {
        return errors
    }
}
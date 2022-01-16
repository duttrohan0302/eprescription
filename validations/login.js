const validator = require('validator');
const isEmpty = require('./../utils/isEmpty');


module.exports = function validateLoginInput(data){
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if(!validator.isEmail(data.email)){
        errors.email = 'Please enter valid email address'
    }

    if(validator.isEmpty(data.email)){
        errors.email = 'Email field is required'
    }

    if(validator.isEmpty(data.password)){
        errors.password = 'Password field is required'
    }

    return{
        errors,
        isValid : isEmpty(errors)
    }

}
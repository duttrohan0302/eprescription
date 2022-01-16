const validator = require('validator')
const isEmpty = require('./../utils/isEmpty')


module.exports = function validateInviteInput(data) {
    let errors = {}


    data.emails = !isEmpty(data.emails) ? data.emails : '';

    if(validator.isEmpty(data.emails)){
        errors.emails = 'Please enter atleast 1 email id to invite';
    }
    else{
        const emailArray = data.emails.split(',');

        emailArray.forEach(email=>{
            if(!validator.isEmail(email.trim())){
                errors.email = `Please enter valid email address(${email})`
            }
        })
    
    }

    return {
        errors,
        isValid : isEmpty(errors)
    }


}
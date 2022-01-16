const validator = require('validator')
const isEmpty = require('./../utils/isEmpty')


module.exports = function validateSetPasswordInput(data) {
    let errors = {}

    data.id = !isEmpty(data.id) ? data.id : ''
    data.password = !isEmpty(data.password) ? data.password : ''
    data.password2 = !isEmpty(data.password2) ? data.password2 : ''

    if(validator.isEmpty(data.id)){
        errors.id = 'User id is required, please try again';
    }

    if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be at least 6 characters";
    }

    if(validator.isEmpty(data.password)){
        errors.password = 'Password field is required';
    }

    if (!validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match";
    }

    if (validator.isEmpty(data.password2)) {
        errors.password2 = "Confirm Password field is required";
    }

    return {
        errors,
        isValid : isEmpty(errors)
    }


}
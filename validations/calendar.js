const validator = require('validator')
const isEmpty = require('./../utils/isEmpty')


module.exports = function validateCalendarInput(data) {
    let errors = {}

    data.slug = !isEmpty(data.slug) ? data.slug : ''


    if(!validator.isLength(data.slug,{min : 4, max : 20})){
        errors.slug = 'Calendar slug must be between 4 and 20 characters'
    }

    if(validator.isEmpty(data.slug)){
        errors.slug = 'Calendar slug is required';
    }

    if(data.slug.indexOf(' ') !== -1){
        errors.slug = 'Slug cannot contain spaces'
    }

    return {
        errors,
        isValid : isEmpty(errors)
    }


}
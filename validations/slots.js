const isEmpty = require('./../utils/isEmpty')

module.exports = function validateSlotInput(data) {
    let errors = {}

    data.monday.startTime = !isEmpty(data.monday.startTime) ? data.monday.startTime : '';
    data.monday.endTime = !isEmpty(data.monday.endTime) ? data.monday.endTime : '';

    data.tuesday.startTime = !isEmpty(data.tuesday.startTime) ? data.tuesday.startTime : '';
    data.tuesday.endTime = !isEmpty(data.tuesday.endTime) ? data.tuesday.endTime : '';

    data.wednesday.startTime = !isEmpty(data.wednesday.startTime) ? data.wednesday.startTime : '';
    data.wednesday.endTime = !isEmpty(data.wednesday.endTime) ? data.wednesday.endTime : '';

    data.thursday.startTime = !isEmpty(data.thursday.startTime) ? data.thursday.startTime : '';
    data.thursday.endTime = !isEmpty(data.thursday.endTime) ? data.thursday.endTime : '';

    data.friday.startTime = !isEmpty(data.friday.startTime) ? data.friday.startTime : '';
    data.friday.endTime = !isEmpty(data.friday.endTime) ? data.friday.endTime : '';

    data.saturday.startTime = !isEmpty(data.saturday.startTime) ? data.saturday.startTime : '';
    data.saturday.endTime = !isEmpty(data.saturday.endTime) ? data.saturday.endTime : '';

    data.sunday.startTime = !isEmpty(data.sunday.startTime) ? data.sunday.startTime : '';
    data.sunday.endTime = !isEmpty(data.sunday.endTime) ? data.sunday.endTime : '';

    if(new Date(data.monday.endTime).getHours()<new Date(data.monday.startTime).getHours() || 
            (new Date(data.monday.endTime).getHours()===new Date(data.monday.startTime).getHours() && new Date(data.monday.endTime).getMinutes()<new Date(data.monday.startTime).getMinutes())){
        if(!errors.monday){
            errors.monday={}
        }
        errors.monday.time = 'End time cannot be less than or equal to start time';
    }

    if(new Date(data.tuesday.endTime).getHours()<new Date(data.tuesday.startTime).getHours() || 
            (new Date(data.tuesday.endTime).getHours()===new Date(data.tuesday.startTime).getHours() && new Date(data.tuesday.endTime).getMinutes()<new Date(data.tuesday.startTime).getMinutes())){
        if(!errors.tuesday){
            errors.tuesday={}
        }
        errors.tuesday.time = 'End time cannot be less than or equal to start time';
    }

    if(new Date(data.wednesday.endTime).getHours()<new Date(data.wednesday.startTime).getHours() || 
            (new Date(data.wednesday.endTime).getHours()===new Date(data.wednesday.startTime).getHours() &&new Date(data.wednesday.endTime).getMinutes()<new Date(data.wednesday.startTime).getMinutes())){
        if(!errors.wednesday){
            errors.wednesday={}
        }
        errors.wednesday.time = 'End time cannot be less than or equal to start time';
    }

    if(new Date(data.thursday.endTime).getHours()<new Date(data.thursday.startTime).getHours() || 
            (new Date(data.thursday.endTime).getHours()===new Date(data.thursday.startTime).getHours() && new Date(data.thursday.endTime).getMinutes()<new Date(data.thursday.startTime).getMinutes())){
        if(!errors.thursday){
            errors.thursday={}
        }
        errors.thursday.time = 'End time cannot be less than or equal to start time';
    }

    if(new Date(data.friday.endTime).getHours()<new Date(data.friday.startTime).getHours() || 
            (new Date(data.friday.endTime).getHours()===new Date(data.friday.startTime).getHours() && new Date(data.friday.endTime).getMinutes()<new Date(data.friday.startTime).getMinutes())){
        if(!errors.friday){
            errors.friday={}
        }
        errors.friday.time = 'End time cannot be less than or equal to start time';
    }

    if(new Date(data.saturday.endTime).getHours()<new Date(data.saturday.startTime).getHours() || 
            (new Date(data.saturday.endTime).getHours()===new Date(data.saturday.startTime).getHours() && new Date(data.saturday.endTime).getMinutes()<new Date(data.saturday.startTime).getMinutes())){
        if(!errors.saturday){
            errors.saturday={}
        }
        errors.saturday.time = 'End time cannot be less than or equal to start time';
    }

    if(new Date(data.sunday.endTime).getHours()<new Date(data.sunday.startTime).getHours() || 
            (new Date(data.sunday.endTime).getHours()<new Date(data.sunday.startTime).getHours() && new Date(data.sunday.endTime).getMinutes()<new Date(data.sunday.startTime).getMinutes())){
        if(!errors.sunday){
            errors.sunday={}
        }
        errors.sunday.time = 'End time cannot be less than or equal to start time';
    }
    

    return {
        errors,
        isValid : isEmpty(errors)
    }


}
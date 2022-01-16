const validator = require('validator')
const isEmpty = require('./../utils/isEmpty')


module.exports = function validateEventInput(data) {
    let errors = {}

    data.name = !isEmpty(data.name) ? data.name : '';
    data.startTime = !isEmpty(data.startTime) ? data.startTime : '';
    data.endTime = !isEmpty(data.endTime) ? data.endTime : '';

    if(!validator.isLength(data.name,{min : 2, max : 30})){
        errors.name = 'Meeting/Event name must be between 2 and 30 characters'
    }

    if(validator.isEmpty(data.name)){
        errors.name = 'Meeting/Event name is required';
    }

    if(validator.isEmpty(data.startTime)){
        errors.startTime = 'Meeting/Event start time is required';
    }

    if(validator.isEmpty(data.endTime)){
        errors.endTime = 'Meeting/Event end time is required';
    }

    if(!validator.isInt(data.recurringIn,{min:0, max:365})){
        errors.recurringIn = 'This must be a number lying between 0 to 365'
    }

    const arr = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]

    const { slots } = data;
    const day = new Date(data.startTime).getDay()
    const slotH = new Date(slots[arr[day]].startTime).getHours();
    const slotM = new Date(slots[arr[day]].startTime).getMinutes();
    const slotEH = new Date(slots[arr[day]].endTime).getHours();
    const slotEM = new Date(slots[arr[day]].endTime).getMinutes();
    const currentSH = new Date(data.startTime).getHours()
    const currentSM = new Date(data.startTime).getMinutes()

    const currentEH = new Date(data.endTime).getHours()
    const currentEM = new Date(data.endTime).getMinutes()

    if((currentEH<slotH || (currentEH===slotH && currentEM<slotM))||(currentEH>slotEH || (currentEH===slotEH && currentEM>slotEM))){
        errors.slot = `The meeting timing for ${arr[day].replace(/\b\w/g, l => l.toUpperCase()).split(' ')[0]} must be after ${slotH}:${String(slotM).padStart(2, '0')} and before ${slotEH}:${String(slotEM).padStart(2, '0')}`
    }

    if((currentSH<slotH || (currentSH===slotH && currentSM<slotM))||(currentSH>slotEH || (currentSH===slotEH && currentSM>slotEM))){
        errors.slot = `The meeting timing for ${arr[day].replace(/\b\w/g, l => l.toUpperCase()).split(' ')[0]} must be after ${slotH}:${String(slotM).padStart(2, '0')} and before ${slotEH}:${String(slotEM).padStart(2, '0')}`
    }

    return {
        errors,
        isValid : isEmpty(errors)
    }


}
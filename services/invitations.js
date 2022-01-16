const Invitation = require('./../models/Invitation');

exports.create = async function (newInvitation) {
    try{
        const invitation = await Invitation.create({fromUser: newInvitation.fromUser, event: newInvitation.event, actedUpon: newInvitation.actedUpon})
        
        const getInvitation = await Invitation.findById(invitation._id).populate({
                path: 'actedUpon.user fromUser',
                select:'name email'
              });
        console.log(getInvitation)
        
        return getInvitation;
    }
    catch(errors){
        console.log(errors)
        return errors;
    }
}

exports.getMyInvitations = async function (id) {
    try{
        const invitations = await Invitation.find({
            actedUpon:{$elemMatch:{user:id,action:"notActed"}}
        },{fromUser:1,event:1, 'actedUpon.$':1}).populate('fromUser','name email phone').populate('event')

        return invitations

    } catch(errors){
        return errors;
    }
}


exports.getInvitationById = async function(id) {
    try{
        const invitation = await Invitation.findOne({_id:id,actedUpon:{$elemMatch:{action:"notActed"}}},{_id:0,event:1}).populate('event',{'_id':0,'name':1,'description':1,'dates':1});
        return invitation;
    } catch(errors) {
        console.log(errors)
        return errors;
    }
}
exports.acceptInvitationById = async function(id,userId) {
    try{
        const invitation = await Invitation.findOneAndUpdate({
            _id:id,
            },
            {$set: {'actedUpon.$[elem].action':'accepted'}},
            {new:true, arrayFilters:[{'elem.user':userId}]}).populate('fromUser',{'_id':0,'name':1,'email':1});
        return invitation;
    } catch(errors) {
        console.log(errors)
        return errors;
    }
}

exports.rejectInvitationById = async function(id,userId,rejectionMessage) {
    try{
        if(rejectionMessage){
            const reject = "rejected "+ rejectionMessage;
            const invitation = await Invitation.findOneAndUpdate({
                _id:id,
                },
                {$set: {'actedUpon.$[elem].action':reject}},
                {new:true, arrayFilters:[{'elem.user':userId}]}).populate('fromUser event');
            console.log(invitation)

            return invitation;
        } else{
            const invitation = await Invitation.findOneAndUpdate({
                _id:id,
                },
                {$set: {'actedUpon.$[elem].action':'rejected'}},
                {new:true, arrayFilters:[{'elem.user':userId}]}).populate('fromUser event');
            console.log(invitation)
            return invitation;
        }
        
    } catch(errors) {
        console.log(errors)
        return errors;
    }
}

exports.suggestInInvitation = async function(id,userId,suggestionMessage) {
    try{
        if(suggestionMessage){
            const message = "suggestion "+ suggestionMessage;
            const invitation = await Invitation.findOneAndUpdate({
                _id:id,
                },
                {$set: {'actedUpon.$[elem].action':message}},
                {new:true, arrayFilters:[{'elem.user':userId}]}).populate('fromUser event');;
            return invitation;
        }
        
    } catch(errors) {
        console.log(errors)
        return errors;
    }
}

exports.getSentInvitations = async function(userId) {
    try{
        const invitations = await Invitation.find({fromUser:userId}).populate('event','name description dates').populate('actedUpon.user','name email phone')
        return invitations;
    }
    catch(errors){
        console.log(errors)
        return errors;
    }
    
}

exports.checkIsOwner = async function(userId,invitationId){
    try{
        const isOwner = await Invitation.findOne({fromUser:userId,_id:invitationId})
        return isOwner;
    } catch(errors){
        console.log(errors)
        return errors;
    }
}

exports.updateInvitationById = async function(eventId,invitationId){
    try{
        const invitation = await Invitation.findByIdAndUpdate(invitationId,{event:eventId})
        return invitation;
    } catch(errors) {
        console.log(errors);
        return errors;
    }
}
exports.deleteInvitationById = async function(invitationId){
    try{
        const invitation = await Invitation.findByIdAndDelete(invitationId)
        return invitation;
    } catch(errors){
        console.log(errors);
        return errors;
    }
}

exports.setStatusDeleted = async function(userId,id){
    try{
        const invitation = await Invitation.findOneAndUpdate({
            _id:id,
            },
            {$set: {'actedUpon.$[elem].action':'deleted'}},
            {new:true, arrayFilters:[{'elem.user':userId}]});
        return invitation;
    } catch(errors){
        return errors;
    }
}

exports.resetInvitationById = async function(invitationId){
    try{
        const invitation = await Invitation.findOneAndUpdate({
            _id:invitationId},
            {$set: {'actedUpon.$[elem].action':'notActed'}},
            {multi:true,new:true,arrayFilters:[{'elem.action':{$ne:'notActed'}}]});
        return invitation;
    } catch(errors){
        console.log(errors)
        return errors;
    }
}
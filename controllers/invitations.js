// Import Services
const EventService = require('./../services/events')
const InvitationService = require('../services/invitations.js')
// Import User Services
const UserService = require('./../services/users')

//Import controller
const EventController = require('../controllers/events')

const validateInviteInput = require('./../validations/invitation')


const isEmpty = require('../utils/isEmpty')

const nodemailer = require('nodemailer');
const { mailHost, mailAuthUser, mailAuthPass, frontendURL } = require('../config')

const transport = nodemailer.createTransport({
    host: mailHost,
    port: 2525,
    auth: {
       user: mailAuthUser,
       pass: mailAuthPass
    }
});

//Create Invitation
exports.create = async function(req,res, next) {

    const { errors, isValid } = validateInviteInput(req.body) 

    if(!isValid) {
        return res.status(400).json(errors);
    }
    const rawEmails = req.body.emails.split(',');
    const emails = rawEmails.map(email=> {return email.trim()})
    console.log(emails)
    if(emails.find(email=> email===req.user.email)){
        return res.status(400).json({email:'You cannot include yourself in the mailing list'})
    }
    const newInvitation = {
        fromUser:req.user.id,
        event:req.params.eventId
    }
    try {
        const users = await UserService.getEveryUser()

        const mailList = users.filter(user=>(emails.find((email)=>user.email===email && user.email!==req.user.email)))
        console.log(mailList)
        const list = mailList.map(user => user.email)

        // Send a mail
        
        const event = await EventService.getEventById(newInvitation.event)
        const message = {
            from: 'support@climbax.in', // Sender address
            to: list,         // List of recipients
            subject: 'Meeting Invite', // Subject line
            html: `
                    <h3>Hello there</h3>
                    <p>
                        You have been invited to a meeting by ${req.user.name} (${req.user.email})
                        <br>
                        <h4>Meeting Details</h4>
                        <b>Title:</b> ${event.name}
                        <br>
                        <b>Description:</b> ${event.description}
                        <br>
                        Log on to the calbook portal to see the dates
                        <hr>
                        <h4>List of Invitees</h4>
                        <table style="border: 1px black solid;">
                            <tr>
                                <th style="border: 1px black solid;">Name</th>
                                <th style="border: 1px black solid;">Email</th>
                            </tr>
                            ${mailList.map(user=>
                                    (`<tr>
                                        <td style="border: 1px black solid;">${user.name}</td>
                                        <td style="border: 1px black solid;">${user.email}</td>
                                    </tr>`)
                                )
                            }
                        </table>
                    </p>`
        };
        const info = await transport.sendMail(message)
        // Mail sending finished

        let actedUpon=[];
        mailList.forEach((mail)=>{
            const obj={
                user:mail._id
            }
            actedUpon.push(obj)
        })

        newInvitation.actedUpon = actedUpon;

        const createdInvitation = await InvitationService.create(newInvitation);

        const eventSync = await EventService.eventSyncInvitation(newInvitation.event,createdInvitation._id)
        console.log(eventSync)
        if(eventSync){
            return res.status(200).json(createdInvitation);
        }

    } catch (errors) {
        console.log(errors)
        return res.status(400).json(errors);
    }
}

exports.getMyInvitations = async function(req,res,next) {
    
    try{

        let invitations = await InvitationService.getMyInvitations(req.user.id);

        return res.status(200).json(invitations)

    } catch (errors) {
        console.log(errors)
        return res.status(400).json(errors)
    }
}

exports.acceptInvitationById = async function(req,res,next) {
    try{
        const errors={}
        let invitation = await InvitationService.getInvitationById(req.params.id,req.user.id);
        if(!invitation){
            errors.message="Invitation not found"
            return res.status(400).json(errors)
        }
        const event = invitation.event;

        let createdEvent = await EventController.createEventForAnyUser(event,req.user.id)

        if(createdEvent.status===200){
            let acceptedInvitation = await InvitationService.acceptInvitationById(req.params.id,req.user.id);
            
            if(acceptedInvitation){
                const eventSync = await EventService.eventSyncInvitation(createdEvent.message._id,acceptedInvitation._id)
                if(eventSync){
                    const message = {
                        from: 'support@climbax.in', // Sender address
                        to: acceptedInvitation.fromUser.email,         // List of recipients
                        subject: 'Meeting Invite Accepted', // Subject line
                        html: `
                                <h3>Hello ${acceptedInvitation.fromUser.name}</h3>
                                <p>
                                    Your meeting invite for the following meeting has been <span style="color:green;">accepted</span> by ${req.user.name} (${req.user.email})
                                    <hr>
                                    <h4>Meeting Details</h4>
                                    <b>Title:</b> ${event.name}
                                    <br>
                                    <b>Description:</b> ${event.description}
                                    <br>
                                    Log on to the <a href='${frontendURL}/sentInvitations'> Calbook </a> to see the dates and other sent invitations
                                </p>`
                    };
                    const info = await transport.sendMail(message)
    
                    return res.status(200).json({message:"Invitation accepted and event created", invitation:acceptedInvitation,event:createdEvent.message})
                }
                
            }
        }
        return res.status(createdEvent.status).json(createdEvent.message)


    } catch (errors) {
        console.log(errors)
        return res.status(400).json(errors)
    }
} 

exports.rejectInvitationById = async function(req,res,next) {
    try{
        const rejectionMessage = req.body.rejectionMessage;
        console.log(rejectionMessage)
        let invitation = await InvitationService.rejectInvitationById(req.params.id,req.user.id,rejectionMessage);
        if(invitation){
            const message = {
                from: 'support@climbax.in', // Sender address
                to: invitation.fromUser.email,         // List of recipients
                subject: 'Meeting Invite Rejected', // Subject line
                html: `
                        <h3>Hello ${invitation.fromUser.name}</h3>
                        <p>
                            Your meeting invite for the following meeting has been <span style="color:red;">rejected</span> by ${req.user.name} (${req.user.email})
                            ${rejectionMessage ? 
                                `<br>
                                    Message: ${rejectionMessage}
                                <br>` :null}
                            <hr>
                            <h4>Meeting Details</h4>
                            <b>Title:</b> ${invitation.event.name}
                            <br>
                            <b>Description:</b> ${invitation.event.description}
                            <br>
                            Log on to the <a href='${frontendURL}/sentInvitations'> Calbook </a> to see the dates and other sent invitations
                        </p>`
            };
            const info = await transport.sendMail(message)
            return res.status(200).json(invitation)
        }
        return res.status(404).json({message:"Invitation not found"})

    } catch(errors) {
        console.log(errors);
        return res.status(400).json(errors)
    }
}

exports.suggestInInvitation = async function(req,res,next) {
    try{
        const suggestionMessage = req.body.suggestionMessage;
        let arr;
        if(suggestionMessage.includes('GMT+0530 (India Standard Time)')){
            arr = suggestionMessage.split(',')
            console.log(arr)
        }
        let invitation = await InvitationService.suggestInInvitation(req.params.id,req.user.id,suggestionMessage);
        if(invitation){
            const message = {
                from: 'support@climbax.in', // Sender address
                to: invitation.fromUser.email,         // List of recipients
                subject: 'Changes Suggested to Meeting Invite', // Subject line
                html: `
                        <h3>Hello ${invitation.fromUser.name}</h3>
                        <p>
                            ${req.user.name} (${req.user.email}) has <span style="color:orange;">suggested</span> a few changes to your meeting (Meeting details are mentioned below)
                            ${suggestionMessage ? 
                                `<br>
                                    Message: ${arr ? arr[0] : suggestionMessage}
                                    ${
                                        (arr && arr[1]) ? 
                                        `<br>
                                        Timing Changes-
                                        ${arr[1]} to ${arr[2]}
                                        <br>`
                                        :
                                        ''
                                    }
                                <br>` :''}
                            <hr>
                            <h4>Meeting Details</h4>
                            <b>Title:</b> ${invitation.event.name}
                            <br>
                            <b>Description:</b> ${invitation.event.description}
                            <br>
                            Log on to the <a href='${frontendURL}/sentInvitations'> Calbook </a> to see the dates and other sent invitations
                        </p>`
            };
            const info = await transport.sendMail(message)
            return res.status(200).json(invitation)
        }
        return res.status(404).json({message:"Invitation not found"})

    } catch(errors){
        console.log(errors);
        return res.status(400).json(errors)
    }
}

// Get sent invitations
exports.getSentInvitations = async function(req,res,next) {
    try{
        const sentInvitations = await InvitationService.getSentInvitations(req.user.id);
        if(sentInvitations)
            return res.status(200).json(sentInvitations)
        else if(isEmpty(sentInvitations) || !sentInvitations.length)
            return res.status(404).json({message:"You do not have any sent invitations"})
    }
    catch(errors){
        console.log(errors);
        return res.status(400).json(errors)
    }
}

// Delete invitation by Id
// Deletes the invitation and all events with that invitation
exports.deleteInvitationById = async function(req,res,next){
    try{
        const deletedInvitation = await InvitationService.deleteInvitationById(req.params.id)
        console.log(deletedInvitation)
        if(deletedInvitation){
            // Delete all events that are part of this invitations
            const deletedEvents = await EventService.deleteEventsByInvitation(req.params.id,deletedInvitation.event)
            if(deletedEvents){
                return res.status(200).json({message:"Invitation Deleted and events deleted for others",invitation:deletedInvitation,deletedEvents:deletedEvents.deletedCount})
            }
            return res.status(200).json({message:"Invitation Deleted",invitation:deletedInvitation,})
        }
        else if(isEmpty(deletedInvitation) || !deletedInvitation.length)
            return res.status(404).json({message:"You do not have any such invitation"})
    }catch(errors){
        console.log(errors);
        return res.status(400).json(errors)
    }
}
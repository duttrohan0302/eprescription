import React,{ useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Collapse, Card, CardTitle, CardHeader, Form, Input } from 'reactstrap';
import Flatpickr from "react-flatpickr";
import { useEffect } from 'react';

const EventModal = ({modal,toggle,event,deleteEvent,user,isInvitationOpen,toggleInvitation,toggleInvitePeople,invitePeople,sendInvitation,errors,setCurrentEvent,updateEvent,deleteInvitation}) => {
    let content = <div></div>
    const [disabled,setDisabled]=useState(true)
    useEffect(()=>setDisabled(true),[])
    const [changeDate,setChangeDate] = useState(false);

    if(event){
      const { id,recurringIn,invitation,dateId } = event;

      const onChange = e => {
        setCurrentEvent({ ...event, [e.target.name]: e.target.value });
        if(errors){
          delete errors[e.target.name]
        }
      }

      const onChangeStartDate = date => {
        setCurrentEvent({ ...event, startTime:date });
        setChangeDate(true);
        if(errors){
          delete errors['startTime']
          delete errors['time']
        }
      }
      const onChangeEndDate = date => {
        setCurrentEvent({ ...event, endTime:date });
        setChangeDate(true);
        if(errors){
          delete errors['endTime']
          delete errors['time']
        }
      }
      const onSubmitUpdate = () => {

          updateEvent(event,changeDate,dateId);
            toggle();
      }
      const onSubmitInvite = event => {
          event.preventDefault();
          sendInvitation(id,event.target.emails.value);
          toggle();
      }
      content = (
        // Modal for showing, and updating event details
        <Modal isOpen={modal} toggle={toggle} >
          <ModalHeader toggle={toggle}>Meeting Details
            
          </ModalHeader>
          <ModalBody>
            
            <div className="form-group">
              <input
                type="text"
                placeholder="Your Meeting Title"
                className={ 
                  (errors && errors.name) ?
                  "form-control is-invalid"
                  : 
                  "form-control" 
                }
                name="name"
                value={event.name}
                onChange={onChange}
                disabled={disabled}
              />
              {
                errors && errors.name &&
                <small className="text-danger">{errors.name}</small>
              }
            </div>
            <div className="form-group">
              <textarea
                type="text"
                placeholder="Description"
                className={ 
                  (errors && errors.description) ?
                  "form-control is-invalid"
                  : 
                  "form-control" 
                }
                name="description"
                value={event.description}
                onChange={onChange}
                cols={60}
                rows={4}
                disabled={disabled}
              />
              {
                errors && errors.description &&
                <small className="text-danger">{errors.description}</small>
              }
            </div>
            {
              disabled
              ?
              <>
                <div className="d-inline-block w-50">Start Time</div>
                <div className="d-inline-block w-50">End Time</div>
              </>
              :
              <div className="text d-block">Please select start and end time</div>

            }
            
            <Flatpickr
              value={event.startTime}
              onChange={onChangeStartDate}
              // disabled={disabled ? true : false}
              options={{
                  enableTime:true,
                  altFormat:'M j, Y h:i K',
                  altInput:true,
                  altInputClass:'d-inline-block w-50 border border-secondary bg-light rounded pl-2',
                  dateFormat:"d-m-Y H:i",
                  minuteIncrement:30,
              }}
            />
            <Flatpickr
              value={event.endTime}
              onChange={onChangeEndDate}
              // disabled={disabled ? true : false}
              options={{
                  enableTime:true,
                  altFormat:'M j, Y h:i K',
                  altInput:true,
                  altInputClass:'d-inline-block w-50 border border-secondary bg-light rounded pl-2',
                  dateFormat:"d-m-Y H:i",
                  minuteIncrement:30,
              }}
            />
            
            
            <div>
              {
              errors && errors.startTime &&
              <small className="text-danger">{errors.startTime}</small>
              }
              <p></p>
              {
              errors && errors.endTime &&
              <small className="text-danger">{errors.endTime}</small>
              }
              {
              errors && errors.time &&
              <small className="text-danger">{errors.time}</small>
              }
            </div>
            {
              recurringIn ?
              <div className="d-block w-100 mt-2">
                <Button 
                  color="danger" 
                  className="btn btn-sm float float-left" 
                  onClick={()=>{
                    deleteEvent(id,dateId)
                    toggle();
                    }}>Delete This Meeting
                </Button>
              </div>
              :null
            }
            <p></p>
            {
              invitation ?
                <div className="mt-2">
                    {/* Invitation exists, show details */}
                  <p>This meeting is part of an invitation
                  <Button color="info" className="float float-right" onClick={toggleInvitation}>Details</Button>
                  </p>
                  <Collapse isOpen={isInvitationOpen}>
                    <Card className="mt-2">
                      <CardTitle  className="pl-2">
                        <b>Hosted by:</b>
                        {
                          invitation.host.email===user.email ? 
                          <Button 
                            color="danger" 
                            className="float float-right" 
                            onClick={
                              ()=>{
                                deleteInvitation(invitation.id)
                                toggle()
                                }
                            }>Delete Invitation</Button>
                          :null
                        }
                        
                        <br />
                        {invitation.host.email===user.email ? 
                        'You' :
                        `${invitation.host.name}(${invitation.host.email})`
                        }
                        </CardTitle>
                        <CardTitle className="pl-2">Attendees:</CardTitle>
                        {
                          invitation.attendees.map((attendee,index)=>
                            <CardHeader key={index}>
                              <small>
                                {attendee.email===user.email ? 'You' :
                                `${attendee.name}(${attendee.email})`
                                }
                                 -  
                                <span 
                                  className=
                                    {
                                      attendee.action==='accepted' ? 
                                      'text-success' : 
                                      (
                                        (attendee.action.includes('rejected') || attendee.action==='deleted') ? 
                                        'text-danger' :
                                        (attendee.action.includes('suggestion') ? 'text-info' : '')
                                      )
                                    }> {attendee.action.replace(/\b\w/g, l => l.toUpperCase()).split(' ')[0]}
                                    {
                                        attendee.action.includes('rejected') ? 
                                            '\n' + attendee.action.substr(attendee.action.indexOf(' ')+1) +'\n'
                                        :
                                        (attendee.action.includes('suggestion') ? (
                                            attendee.action.split(',').map((element,index)=>{
                                                if(index===0){
                                                    return <span key={index}><br />{'\n' + element.substr(11)}</span>
                                                }else if(index===1 || index===2){
                                                   
                                                    return(
                                                        <Flatpickr
                                                                key={index}
                                                                value={new Date(element)}
                                                                disabled={true}
                                                                options={{
                                                                    enableTime:true,
                                                                    altFormat:'M j, Y h:i K',
                                                                    altInput:true,
                                                                    altInputClass:'d-inline-block w-100 border border-secondary bg-light rounded pl-2',
                                                                    dateFormat:"d-m-Y H:i",
                                                                    minuteIncrement:30,
                                                                }}
                                                        />
                                                    )
                                                }
                                            })
                                        ) : null)
                                    }
                                    </span>
                              </small>
                            </CardHeader>
                          )
                        }
                    </Card>
                  </Collapse>
                </div>
              : 
              <div className="mt-2">
                {/* Invitation doesn't exists, give an option to add people*/}
                <div>
                    <Button color={invitePeople ? 'danger' : 'info'} className="btn btn-sm float float-right mb-2" onClick={toggleInvitePeople}>
                        {invitePeople ? 'Cancel' : 'Invite People'}
                    </Button>
                </div>
                <div>
                    <Collapse isOpen = {invitePeople}>
                        <Form className="mt-2" onSubmit={onSubmitInvite}>
                            <Input type="text" name="emails" placeholder="Enter list of emails(comma separated)" className="mt-2"/>
                            <small>E.g. xyz@gmail.com,abc@gmail.com</small>
                           <Button color="success" className="btn btn-sm mt-2 float float-right">Invite</Button>
                        </Form>
                    </Collapse>
                </div>
                
              </div>
            }
          </ModalBody>
          <ModalFooter>
            {(!invitation || invitation.host.email===user.email) ? 
                (disabled ? 
                  <Button color="warning" onClick={()=>setDisabled(false)}>Update Details</Button>
                  :
                  <Button color="warning" onClick={onSubmitUpdate}>Save</Button>
                  )
              :
              null
            }
            
            <Button 
              color="danger" 
              className="float float-right" 
              onClick={()=>{
                deleteEvent(id)
                toggle();
                }}>
                  {recurringIn ? 'Delete recurring Meeting' : 'Delete'}
            </Button>
          </ModalFooter>
        </Modal>
      )
    }
  
    return <div>{content}</div>;
  }
  

export default EventModal;
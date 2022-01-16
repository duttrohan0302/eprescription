import React,{ useState, useEffect } from "react";
import CalendarComponent from "./CalendarComponent";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { createEvent  } from '../Actions/eventActions';

import Flatpickr from "react-flatpickr";
import SlotModal from "./SlotModal";
import { history } from "../Helpers";

const DashBoard = ({ errors,newEvent, createEvent, slug,loading, isAuthenticated,slots,user}) => {
    const[creatingEvent,setCreatingEvent] = useState(false)
    const[recurringCheck,setRecurringCheck] = useState(false)
    const defaultDate = new Date((new Date(new Date().setMinutes(0)).setSeconds(0))).setMilliseconds(0)
    const [formData, setFormData] = useState({
        name: '',   
        description: '',
        startTime:defaultDate,
        endTime:defaultDate,
        recurringIn:'0'
      });

      
    useEffect(()=>{
      if(newEvent){
        setCreatingEvent(false);
        setRecurringCheck(false)
        toggle();
        setFormData({
          name: '',   
          description: '',
          startTime:defaultDate,
          endTime:defaultDate,
          recurringIn:'0'
        })
      }
      if(errors){
        if(errors){
          setCreatingEvent(false);
          setRecurringCheck(false)
        }
      }
    },newEvent,errors)
      
    const [modal, setModal] = useState(false);
    useEffect(()=>{
      setModal(false)
      if( user && user.userRole==='admin'){
        history.push('/myProfile')
      }
    
    },[])
    const toggle = () =>{
      setModal(!modal);
      setRecurringCheck(false)
      setCustomRecurring(false)

    } 

      const { name, description,startTime,endTime, recurringIn } = formData;


      const onChangeCheck = e => {
        setRecurringCheck(recurringCheck=> !recurringCheck)
        if(!recurringCheck){
          setFormData({...formData,recurringIn:0})
        }
        setCustomRecurring(false)

      }

      const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if(errors){
          delete errors[e.target.name]
        }
      }

      const onChangeStartDate = date => {
          setFormData({ ...formData, startTime:date });
          if(errors){
            delete errors['startTime']
            delete errors['time']
            delete errors['slot']
          }
      }
      const onChangeEndDate = date => {
          setFormData({ ...formData, endTime:date });
          if(errors){
            delete errors['endTime']
            delete errors['time']
            delete errors['slot']
          }
          
      }
      const [slotModal, setSlotModal] = useState(false);
      const toggleSlotModal = () => setSlotModal(!slotModal);
      
      const onSubmit = (e) => {
        e.preventDefault();
          setCreatingEvent(true);
          const event = {
              name,description,startTime: new Date(startTime),endTime: new Date(endTime),recurringIn,slots
          }
          createEvent(event);
        
      };

      const [customRecurring,setCustomRecurring] = useState(false)

      const onRecurring = (e) => {
        if(e.target.value==='daily'){
          setFormData({
            ...formData,
            recurringIn:1
          })
          setCustomRecurring(false)
        }else if(e.target.value==='weekly'){
          setFormData({
            ...formData,
            recurringIn:7
          })
          setCustomRecurring(false)
        }else if(e.target.value==='custom'){
          setCustomRecurring(true)
        }
      }

    return(

          <div>
            {
              slug && <div style={{textAlign:'center'}}><Button onClick={toggle} >Create Meeting</Button></div> 
                
            }
            {
              (slug && user.userRole==='doctor') && <Button className="d-inline-block float float-right" color="info" onClick={toggleSlotModal}>View Slots </Button>
            }
            {
              slots ?
              <SlotModal 
                slots={slots}
                toggle={toggleSlotModal}
                modal={slotModal}
              />
              :null
            }


            <Modal isOpen={modal} toggle={toggle} >
                <ModalHeader toggle={toggle}>Create Meeting</ModalHeader>
                <ModalBody>

                    <div className="event-form">
                        <form className="login-form" id="login-form" noValidate onSubmit={onSubmit}>
                            <div className="form-group">
                              
                                <input
                                  type="text"
                                  placeholder="Your Meeting Title"
                                  className={ 
                                    (errors && errors.name) ?
                                    "form-control is-invalid"
                                    : "form-control" 
                                  }
                                  name="name"
                                  value={name}
                                  onChange={onChange}
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
                                    : "form-control" 
                                  }
                                  name="description"
                                  value={description}
                                  onChange={onChange}
                                  cols={60}
                                  rows={4}
                                />
                                {
                                  errors && errors.description &&
                                  <small className="text-danger">{errors.description}</small>
                                }
                            </div>
                            {/* {console.log(new Date(startTime).getDay())} */}

                            <div className="from-group">
                              <small className="text d-block">Please select start and end time</small>
                              <Flatpickr
                                      value={startTime}
                                      onChange={onChangeStartDate}
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
                                      data-enable-time
                                      value={endTime}
                                      onChange={onChangeEndDate}
                                      options={{
                                          // altFormat:'H:i',
                                          altFormat:'M j, Y h:i K',
                                          altInput:true,
                                          dateFormat:"d-m-Y H:i",
                                          altInputClass:'d-inline-block w-50 border border-secondary bg-light rounded pl-2',
                                          minuteIncrement:30,
                                          // noCalendar:true
                                      }}
                              />
                            </div>
                            
                            <div className="form-group">
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
                                {
                                  errors && errors.slot &&
                                  <small className="text-danger"><p></p>{errors.slot}</small>
                                }
                                
                            </div>
                              
                              <div className="form-check">
                                <input
                                    className={ 
                                      "form-check-input" 
                                    }
                                    type="checkbox"
                                    value={recurringCheck}
                                    id="checkRecurring"
                                    style={{width:'20px'}}
                                    name="recurringCheck"
                                    onChange={onChangeCheck}
                                  />
                                <small>
                                  Check this to create a recurring event
                                </small>
                                
                              </div>

                            {
                              recurringCheck &&
                                <div className="form-group" style={{marginTop:'10px'}}>
                                  
                                  <small>Please enter the number of days, the meeting recurs in</small><p></p>
                                  <small>(0 for non-recurring meeting)</small>
                                  <div class="form-check">
                                    <label class="form-check-label">
                                      <input type="radio" class="form-check-input" name="recurringInterval" value={'daily'} onChange={onRecurring}/>Daily
                                    </label>
                                  </div>
                                  <div class="form-check">
                                    <label class="form-check-label">
                                      <input type="radio" class="form-check-input" name="recurringInterval" value={'weekly'} onChange={onRecurring}/>Weekly
                                    </label>
                                  </div>
                                  <div class="form-check">
                                    <label class="form-check-label">
                                      <input type="radio" class="form-check-input" name="recurringInterval" value={'custom'} onChange={onRecurring}/>Custom
                                    </label>
                                  </div>
                                  {
                                      customRecurring &&
                                    <>
                                      <input
                                        type="number"
                                        placeholder="Recurring in"
                                        className={ 
                                          (errors && errors.recurringIn) ?
                                          "form-control is-invalid"
                                          : "form-control" 
                                        }
                                        name="recurringIn"
                                        value={recurringIn}
                                        onChange={onChange}
                                      />
                                      <small>Number of days in which the meeting recurs</small>
                                    </>
                                  }
                                  {
                                    errors && errors.recurringIn &&
                                    <small className="text-danger">{errors.recurringIn}</small>
                                  }<p></p>
                                
                                
                                </div>
                            }
                            
                            <div className="form-group form-button">
                                <input type="submit" name="event" id="event" className="form-submit" value="Submit"/>
                                {
                                  creatingEvent &&
                                  <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                }
                            </div>
                        </form>
                    </div>
                </ModalBody>
            </Modal>
            <CalendarComponent extraEvent={newEvent}/>
            
          </div>
    )

}

DashBoard.propTypes = {
    createEvent: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    errors: PropTypes.object || PropTypes.bool,
    newEvent: PropTypes.array,
    slug: PropTypes.string,
    loading: PropTypes.bool,
    slots: PropTypes.object,
    user: PropTypes.object
};
  
  const mapStateToProps = (state) => ({
    auth: state.auth,
    isAuthenticated: state.auth.isAuthenticated,
    errors: state.event.errors,
    newEvent: state.event.newEvent,
    slug: state.event.slug,
    loading: state.event.loading,
    slots: state.event.slots,
    user: state.auth.user
  });
  
  export default connect(mapStateToProps,{createEvent})(DashBoard);
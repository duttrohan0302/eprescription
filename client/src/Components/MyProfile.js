import React, {useState} from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteAccount } from '../Actions/authActions';
import Flatpickr from "react-flatpickr";
import {
    Modal,
    ModalHeader,
    ModalBody, ModalFooter
    } from 'reactstrap';

import {
    Card, 
    CardImg, 
    CardHeader,
    Button
  } from 'reactstrap';
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { getSlots,setSlots } from "../Actions/eventActions";

const SlotModal = ({toggle,modal,dayData,genericData,setSlots,errors}) => {

    let {day,startTime,endTime} = dayData;
    const [sT,setST] = useState(startTime)
    const [eT,setET] = useState(endTime)
    const [data,setData] = useState(genericData)

    // console.log(data)

    const onChangeStartDate = (date) => {
        setST(date[0].toJSON())
        
        setData({
                ...data,
                [day]:{
                    startTime:date[0].toJSON(),
                    endTime:data[day].endTime
                }
            }
        )
        if(errors){
            delete errors[day]
        }
    }

    const onChangeEndDate = (date) => {
        setET(date[0].toJSON())
        setData({
                ...data,
                [day]:{
                    startTime:data[day].startTime,
                    endTime:date[0].toJSON()
                }
            }
        )
        if(errors){
            delete errors[day]
        }
    }

    const onSubmit = () => {

        setSlots(data)
        toggle();
        
    }
    return(
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>{day.replace(/\b\w/g, l => l.toUpperCase()).split(' ')[0]}</ModalHeader>
            <ModalBody>
            <Flatpickr
                value={sT ? sT : startTime}
                onChange={onChangeStartDate}
                options={{
                    enableTime:true,
                    altFormat:'h:i K',
                    altInput:true,
                    noCalendar: true,
                    altInputClass:'d-inline-block w-50 border border-secondary bg-light rounded pl-2',
                    dateFormat:"d-m-Y H:i",
                    minuteIncrement:30,
                }}
            />
            
            <Flatpickr
                data-enable-time
                value={eT ? eT : endTime}
                onChange={onChangeEndDate}
                options={{
                    altFormat:'h:i K',
                    altInput:true,
                    noCalendar: true,
                    dateFormat:"d-m-Y H:i",
                    altInputClass:'d-inline-block w-50 border border-secondary bg-light rounded pl-2',
                    minuteIncrement:30,
                }}
            />
            </ModalBody>
            <ModalFooter>
                <Button color="info" onClick={onSubmit}>Save</Button>
            </ModalFooter>
        </Modal>
    )
}
const MyProfile = ({user,deleteAccount,slots,getSlots,setSlots,errors}) => {

    const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
    const [dayData,setDayData] = useState({
        day:'',
        startTime:null,
        endTime:null
    })
    const [slotData,setSlotData] = useState({
        monday:{
            startTime:(slots && slots.monday) ? new Date(slots.monday.startTime) : new Date(),
            endTime:(slots && slots.monday) ? new Date(slots.monday.endTime) : new Date()
        },
        tuesday:{
            startTime:(slots && slots.tuesday) ? new Date(slots.tuesday.startTime) : new Date(),
            endTime:(slots && slots.tuesday) ? new Date(slots.tuesday.endTime) : new Date()
        },
        wednesday:{
            startTime:(slots && slots.wednesday) ? new Date(slots.wednesday.startTime) : new Date(),
            endTime:(slots && slots.wednesday) ? new Date(slots.wednesday.endTime) : new Date()
        },
        thursday:{
            startTime:(slots && slots.thursday) ? new Date(slots.thursday.startTime) : new Date(),
            endTime:(slots && slots.thursday) ? new Date(slots.thursday.endTime) : new Date()
        },
        friday:{
            startTime:(slots && slots.friday) ? new Date(slots.friday.startTime) : new Date(),
            endTime:(slots && slots.friday) ? new Date(slots.friday.endTime) : new Date()
        },
        saturday:{
            startTime:(slots && slots.saturday) ? new Date(slots.saturday.startTime) : new Date(),
            endTime:(slots && slots.saturday) ? new Date(slots.saturday.endTime) : new Date()
        },
        sunday:{
            startTime:(slots && slots.sunday) ? new Date(slots.sunday.startTime) : new Date(),
            endTime:(slots && slots.sunday) ? new Date(slots.sunday.endTime) : new Date()
        }
    })

    useEffect(()=>{
        if(slots){
            setSlotData(slots)
        }else{
            getSlots();
        }
    },[getSlots,slots])

    const [modal, setModal] = useState(false);

    const toggle = () =>{
        setModal(!modal);
        
    } 

    return(
        <div>
            {
                slots ?
                <SlotModal 
                    toggle={toggle} 
                    modal={modal} 
                    dayData={dayData}
                    genericData={slots}
                    setSlots={setSlots}
                    errors={errors}
                /> 
                : 
                null
            }
            <div className="container-fluid">
                <div className="row mb-3">
                    <div className="col">
                    <span className="float float-right">
                        <Button color="danger" onClick={deleteAccount}>Delete Acount</Button>
                    </span>
                    <span className="float float-right mr-2">
                        <Link to="/changePassword"><Button color="warning">Change Password</Button></Link>
                    </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4 col-md-10 col-sm-12">
                        <Card>
                            {/* <CardImg top width="80%" src="https://w5insight.com/wp-content/uploads/2014/07/placeholder-user-400x400.png" alt="Card image cap" /> */}
                            <CardHeader ><h2>{user.name}</h2></CardHeader>
                            <CardHeader tag="h4">{user.email}</CardHeader>
                            {
                                user.phone &&
                                <CardHeader tag="h4">{user.phone}</CardHeader>
                            }
                            {
                                user.userRole!=='admin' &&
                                <CardHeader tag="h4">Age - {user.age}</CardHeader>
                            }
                            {
                                user.userRole!=='admin' &&
                                <CardHeader tag="h4">Sex - {user.sex}</CardHeader>
                            }
                            {
                                user.userRole==='doctor' &&
                                <CardHeader tag="h4">{user.specialization} </CardHeader>
                            }
                        </Card>
                    </div>
                    {
                        user.userRole==='doctor' &&
                        <div className="col-lg-6 col-md-10 col-sm-12">
                        <h3 className="display-4">Your Free Slots</h3>
                        {
                             
                            days.map((day,index)=>{

                                return(
                                    <>
                                    <h4 key={index}className="section-title pt-2">{day.replace(/\b\w/g, l => l.toUpperCase()).split(' ')[0]}</h4>
                                        <Flatpickr
                                            value={slotData[day].startTime}
                                            // onChange={onChangeStartDate}
                                            disabled={true}
                                            options={{
                                                enableTime:true,
                                                altFormat:'h:i K',
                                                altInput:true,
                                                noCalendar: true,
                                                altInputClass:'d-inline-block w-48 border border-secondary bg-light rounded pl-2',
                                                dateFormat:"d-m-Y H:i",
                                                minuteIncrement:30,
                                            }}
                                        />
                                        <Flatpickr
                                                data-enable-time
                                                value={slotData[day].endTime}
                                                disabled={true}
                                                // onChange={onChangeEndDate}
                                                options={{
                                                    altFormat:'h:i K',
                                                    altInput:true,
                                                    noCalendar: true,
                                                    dateFormat:"d-m-Y H:i",
                                                    altInputClass:'d-inline-block w-48 border border-secondary bg-light rounded pl-2',
                                                    minuteIncrement:30
                                                }}
                                        />
                                        <Button 
                                            className="d-inline-block w-2 ml-2 pt-0" 
                                            color="info" 
                                            onClick={()=>{
                                                setDayData({
                                                    day:day,
                                                    startTime:slotData[day].startTime,
                                                    endTime:slotData[day].endTime
                                                })
                                                toggle();
                                                if(errors){
                                                    if(errors[day]){
                                                        delete errors[day]['time']
                                                    }
                                                    delete errors[day]
                                                }
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <p></p>
                                        {
                                            errors && errors[day] && errors[day].time && 
                                            <small className="text-danger">{errors[day].time}</small>
                                        }
                                    </>
                                )
                            })
                        }
                    </div>
                    }
                </div>
            </div>
            
            
        </div>
    )
}


MyProfile.propTypes = {
    auth: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    user: PropTypes.object.isRequired,
    slots: PropTypes.object,
    getSlots: PropTypes.func.isRequired,
    setSlots: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    errors: PropTypes.object,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    slots: state.event.slots,
    errors:state.event.errors
  });

export default connect(mapStateToProps,{deleteAccount,getSlots,setSlots})(MyProfile);
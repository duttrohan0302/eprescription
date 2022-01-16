import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import Flatpickr from 'react-flatpickr'

const SlotModal = ({slots,toggle,modal}) => {

    const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
    
    return(
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>
                <h3 className="display-4">Daily Slots</h3>
            </ModalHeader>
            <ModalBody>
                <div className="col-12">
                        {
                            days.map((day,index)=>{
                                return(
                                    <>
                                    <h4 key={index}className="section-title pt-2">{day.replace(/\b\w/g, l => l.toUpperCase()).split(' ')[0]}</h4>
                                        <Flatpickr
                                            value={slots[day].startTime}
                                            // onChange={onChangeStartDate}
                                            disabled={true}
                                            options={{
                                                enableTime:true,
                                                altFormat:'h:i K',
                                                altInput:true,
                                                noCalendar: true,
                                                altInputClass:'d-inline-block w-20 border border-secondary bg-light rounded p-0 pl-2',
                                                dateFormat:"d-m-Y H:i",
                                                minuteIncrement:30,
                                            }}
                                        />
                                        <Flatpickr
                                                data-enable-time
                                                value={slots[day].endTime}
                                                disabled={true}
                                                // onChange={onChangeEndDate}
                                                options={{
                                                    altFormat:'h:i K',
                                                    altInput:true,
                                                    noCalendar: true,
                                                    dateFormat:"d-m-Y H:i",
                                                    altInputClass:'d-inline-block w-20 border border-secondary bg-light rounded p-0 pl-2',
                                                    minuteIncrement:30
                                                }}
                                        />
                                        
                                    </>
                                )
                            })
                        }
                </div>
            </ModalBody>
        </Modal>
    )
}


export default SlotModal;
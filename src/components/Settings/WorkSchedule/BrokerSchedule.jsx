import React, { Component } from 'react';
import { Modal, Button, Card, Table, Form } from "react-bootstrap"
import axios from 'axios';
import Moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import config from '../../../config/config';
import { FaEdit, FaTrash } from 'react-icons/fa';
import TimePicker from 'react-time-picker';

const BEARER_TOKEN = localStorage.getItem("userData");
class BrokerSchedule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: '',
            data: [],
            form: {
                startTime: '10:00',
                endTime: '10:00',
                workingHours: ''
            },
            workingHours: '',
            days: [
                { id: 1, value: "", isChecked: false, day: "Sunday" },
                { id: 2, value: "", isChecked: false, day: "Monday" },
                { id: 3, value: "", isChecked: false, day: "Tuesday" },
                { id: 4, value: "", isChecked: false, day: "Wednesday" },
                { id: 5, value: "", isChecked: false, day: "Thursday" },
                { id: 6, value: "", isChecked: false, day: "Friday" },
                { id: 7, value: "", isChecked: false, day: "Saturday" },

            ],
            token: localStorage.getItem("userData"),
            orgId: localStorage.getItem("orgId")
        }
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData = () => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/organization/schedule/list/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                const allCheckedDays = r.data.organizationSchedule.rows;
                let allDays = this.state.days;
                let checkedDays = [];
                for (let day of allDays) {
                    for (let checkedDay of allCheckedDays) {
                        if (day.id == parseInt(checkedDay.day)) {
                            day.isChecked = true;
                            day.value = checkedDay.day;
                        }
                    }
                    checkedDays.push(day);
                }
                this.setState({
                    ...this.state,
                    days: checkedDays,
                    workingHours: allCheckedDays[0].workingHours ? allCheckedDays[0].workingHours : '00:00',
                    form: {
                        ...this.state.form,
                        workingHours: allCheckedDays[0].workingHours ? allCheckedDays[0].workingHours : '00:00',
                        startTime: allCheckedDays[0].startTime ? allCheckedDays[0].startTime : "10:00",
                        endTime: allCheckedDays[0].endTime ? allCheckedDays[0].endTime : "10:00",
                        day: checkedDays
                    }
                })
                // this.state.form.workingHours = this.state.workingHours;
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }

    handleShow = () => {
        console.log('close button')
        this.setState({ show: true })
    };

    handleClose = () => {
        console.log('close button')
        this.setState({ show: false })
    };

    handleChange = (event) => {
        // console.log('Input event',this.props.item);   
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            form: {
                ...this.state.form, [name]: value
            }
        })
    }

    handleSubmit = (event) => {
        // console.log('Form Data', this.state.form);
        let datas = this.state.form;
        datas.orgId = this.state.orgId;
        datas.locationId = 0;
        
        //console.log('Form Data', datas);
        const apiUrl = config.API_URL + '/organization/schedule/add';
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        // console.log('headers => ', headers);
        axios.post(apiUrl, datas, { headers: headers })
            .then(res => {
                this.refreshData();
                console.log('POST response', res);
            })

        const toasts = "Updated Successfully"
        toast.success('Updated Successfully');
        setTimeout(function () {
            toast.dismiss()
        }, 2000)
        this.setState({ show: false })
    }

    handleCheckElement = (event) => {
        //console.log(event.target.checked);
        let days = this.state.days;
        days.forEach(day => {
            if (event.target.checked) {
                if (day.id == event.target.value) {

                    day.value = event.target.value;
                    day.isChecked = true;
                }
            }
            else {
                //console.log('Uncheck');
                if (day.id == event.target.value) {
                    console.log('Uncheck match', day.id)
                    day.value = '';
                    day.isChecked = false;
                }
            }
            // console.log(day.id);
        })
        console.log('all days ==> ', days);
        // this.setState({})

        this.setState({
            ...this.state,
            days: days,
            form: {
                ...this.state.form,
                day: days
            }
        })
        // console.log('Form State', this.state.form);
        // console.log('Form State', this.state.form);
    }
    onTimechange = (name, time) => {
        let startTimeSelected = '';
        let endTimeSelected = '';

        if (name == 'startTime') {
            startTimeSelected = time;
            endTimeSelected = this.state.form.endTime;
        } else {
            startTimeSelected = this.state.form.startTime;
            endTimeSelected = time;
        }

        const startTime = Moment(startTimeSelected, 'HH:mm');
        const endTime = Moment(endTimeSelected, 'HH:mm');

        if (startTime.isBefore(endTime)) {
            var duration = Moment.duration(endTime.diff(startTime));
            var workingHours = parseInt(duration.asHours()) + ':' + parseInt(duration.asMinutes()) % 60
            // const workingHours = 
            this.setState({
                ...this.state,
                form: {
                    ...this.state.form,
                    [name]: time,
                    workingHours: workingHours,
                }
                // workingHours: workingHours
            })
        } else {
            console.log("End time should be greater than Start time.")
        }
    }
    render() {
        console.log('this.state.form.startTime =====> ', this.state.form.startTime);
        // console.log('Days State', this.state.days)
        return (
            <>

                <ToastContainer />
                <Card className="card d-block p-1 mb-4 shadow-sm">
                    <h4 className="font-16 pl-3">Work Schedule</h4>
                    <div className=" mb-4 ">


                        <div className="row text-center">
                            <ul className="myinfoListing">
                                <li>

                                    <div className="scheduleCheck">
                                        <div>Working Days</div>

                                        <div className="checkboxGroup">
                                            {this.state.days.map((data, key) => {
                                                if (data !== null) {
                                                    return (
                                                        <label className="hrms_control hrms_checkbox">{data.day}
                                                            <input type="checkbox" name="day[]" onChange={this.handleCheckElement} checked={data.isChecked ? 'checked' : ''} value={data.id} />
                                                            <i className="hrms_control__indicator"></i>
                                                        </label>
                                                    )
                                                }
                                            })
                                            }

                                        </div>
                                    </div>


                                </li>
                            </ul>
                        </div>

                        <div className="row text-center">
                            <ul className="myinfoListing">
                                <li className="text-left">
                                    <label>Start Time</label>
                                    <span>
                                        <div className="input-group mb-3">
                                            <TimePicker className="form-control" name="startTime" onChange={this.onTimechange.bind(this, 'startTime')} disableClock="true" value={this.state.form.startTime} format="HH:mm"/* locale="en-US" */ />
                                        </div>
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className="row text-center">
                            <ul className="myinfoListing">
                                <li className="text-left">
                                    <label>End Time</label>
                                    <span>
                                        <div className="input-group mb-3">
                                            <TimePicker className="form-control" name="endTime" onChange={this.onTimechange.bind(this, 'endTime')} disableClock="true" value={this.state.form.endTime} format="HH:mm"/* locale="en-US" */
                                            />
                                        </div>
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className="row text-center">
                            <ul className="myinfoListing">
                                <li className="text-left">
                                    <label>Working Hours (HH:MM)</label>
                                    <span>
                                        <div className="input-group mb-3">
                                            <input type="text" name="workingHours" onChange={this.handleChange} className="form-control" defaultValue={this.state.form.workingHours} placeholder="ex. 8 Hours/Day" readOnly={true} />
                                        </div>

                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>

                <div className="form-group row pt-2 ">
                    <div className="col-lg-12 text-center">
                        <button type="button" onClick={this.handleSubmit} className="btn btn-primary">Save</button>
                    </div>
                </div>
            </>
        )
    }

}

export default BrokerSchedule;
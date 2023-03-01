import React, { Component } from 'react';
import { Modal, Button, Card, Table, Form } from "react-bootstrap"
import axios from 'axios';
import Moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import config from '../../../config/config';
import { FaEdit, FaTrash } from 'react-icons/fa';
import TimePicker from 'react-time-picker';

const BEARER_TOKEN = localStorage.getItem("userData");
class OrgSchedule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            data: [],
            form: {
                startTime: '10:00',
                endTime: '10:00',
                workingHours: '',
                locationId: ''
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
            orgId: localStorage.getItem("orgId"),
            orgLocations: [],
            scheduleList: [],
            btnDisable: false,
            validateFields: {},
            role: localStorage.getItem("roleSlug")
        }
        this.editData = this.editData.bind(this);
    }

    componentDidMount() {
        this.getScheduleList();
        this.getOrgLocation();
    }
    getScheduleList() {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/organization/schedule/list/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                console.log('locations mere bhai ====> ', r.data);
                this.setState({
                    ...this.state,
                    scheduleList: r.data.organizationSchedule
                })
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
            });
    }
    getOrgLocation() {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/organization/locations-list/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                console.log('locations ====> ', r.data.locations);
                this.setState({
                    ...this.state,
                    orgLocations: r.data.locations
                })
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
            });
    }
    editData = (locationId) => {
        console.log('locationId', locationId)
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/organization/schedule/details/' + this.state.orgId + '/' + locationId, { headers: { Authorization: bearer } })
            .then(r => {
                const allCheckedDays = r.data.locationsDetails;
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
                        day: checkedDays,
                        locationId: allCheckedDays[0].locationId
                    },
                    show: true,
                    validateFields:{}
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

        this.setState({
            ...this.state,
            days: [
                { id: 1, value: "", isChecked: false, day: "Sunday" },
                { id: 2, value: "", isChecked: false, day: "Monday" },
                { id: 3, value: "", isChecked: false, day: "Tuesday" },
                { id: 4, value: "", isChecked: false, day: "Wednesday" },
                { id: 5, value: "", isChecked: false, day: "Thursday" },
                { id: 6, value: "", isChecked: false, day: "Friday" },
                { id: 7, value: "", isChecked: false, day: "Saturday" },

            ],
            workingHours: '00:00',
            form: {
                ...this.state.form,
                workingHours: '00:00',
                startTime: "10:00",
                endTime: "10:00",
                day: [],
                locationId: ''
            },
            show: true,
            validateFields:{}
        })

        // this.setState({ show: true })
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
    isFormValid() {
        let fields = this.state.validateFields;
        let validations = {};
        let isFormValid = true;
        console.log('this.state.form ========> ', this.state.form);
        if (
            this.state.form.locationId == "" ||
            typeof this.state.form.locationId == "undefined"
        ) {
            validations["locationId"] = "Please select work location";
            isFormValid = false;
        }
        if (
            this.state.form.day.length<5
        ) {
            validations["weekdays"] = "Please choose atleast 5 week days";
            isFormValid = false;
        }
        if (
            this.state.form.startTime == "" ||
            typeof this.state.form.startTime == "undefined"
        ) {
            validations["startTime"] = "Please add start time";
            isFormValid = false;
        }
        if (
            this.state.form.endTime == "" ||
            typeof this.state.form.endTime == "undefined"
        ) {
            validations["endTime"] = "Please add end time";
            isFormValid = false;
        }
        

        const startTime = Moment(this.state.form.startTime, 'HH:mm');
        const endTime = Moment(this.state.form.endTime, 'HH:mm');
        console.log(startTime, endTime, startTime.isBefore(endTime));
        if (!startTime.isBefore(endTime)) {
            validations["endTime"] = "End time should be greater than Start time.";
            isFormValid = false;
        } else {
            var duration = Moment.duration(endTime.diff(startTime));
            var workingHours = parseInt(duration.asHours())
            if(workingHours<=5)
            {
                validations["workingHours"] = "Working hours should be greater than 5 hours";
                isFormValid = false;
            }
        }

        console.log('validations ============> ', validations);
        this.setState({ validateFields: validations });
        return isFormValid;
    }
    handleSubmit = (event) => {
        event.preventDefault()
        if (this.isFormValid()) {
            // console.log('Form Data', this.state.form);
            let datas = this.state.form;
            datas.orgId = this.state.orgId;
            //console.log('Form Data', datas);
            const apiUrl = config.API_URL + '/organization/schedule/add';
            var bearer = 'Bearer ' + this.state.token;
            const headers = {
                "Authorization": bearer,
                "Content-Type": "application/json"
            }
            this.setState({ btnDisable: true })
            // console.log('headers => ', headers);
            axios.post(apiUrl, datas, { headers: headers })
                .then(res => {
                    this.getScheduleList();
                    this.setState({ btnDisable: false, show: false })
                    console.log('POST response', res);
                })

            const toasts = "Updated Successfully"
            toast.success('Updated Successfully');
            setTimeout(function () {
                toast.dismiss()
            }, 2000)
        }
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
            console.log('workingHours ====> ', workingHours);
            this.setState({
                ...this.state,
                form: {
                    ...this.state.form,
                    [name]: time,
                    workingHours: workingHours,
                },
                workingHours: workingHours,
                validateFields:{
                    ...this.state.validateFields,
                    endTime: ""
                }
            })
        } else {
            console.log("End time should be greater than Start time.")
            this.setState({
                validateFields:{
                    ...this.state.validateFields,
                    endTime: "End time should be greater than Start time"
                },
                form: {
                    ...this.state.form,
                    [name]: time,
                    workingHours: '00:00',
                },
                workingHours: '00:00'
            })
        }
    }
    loadScheduleList() {
        if (this.state.scheduleList.length > 0) {

            return this.state.scheduleList.map((data, key) => {
                if (key !== null) {
                    return (
                        <tr key={key}>

                            <td>{data.locationName}</td>
                            <td>{data.locationAddress === null ? '' : data.locationAddress}</td>
                            <td>{data.dayNames}</td>
                            <td>{data.startTime}</td>
                            <td>{data.endTime}</td>
                            <td>{data.workingHours}</td>
                            {this.state.role != 'broker-admin' && this.state.role != 'broker-primary' ? (<>
                                <td><span onClick={e => this.editData(data.locationId)}><i><FaEdit /></i> </span></td>
                            </>) : ''}
                        </tr>
                    )
                }
            })
        } else {
            return (<tr><td colspan="7">No Record Available.</td></tr>)
        }
    }
    render() {
        console.log('this.state.validationFields =====> ', this.state.validateFields);
        // console.log('Days State', this.state.days)
        return (
            <>

                <ToastContainer />
                <Card className="card d-block p-1 mb-4 shadow-sm">
                    <div className="d-flex justify-content-between  mb-4 ">
                        <h4 className="font-16 pl-3">Work Schedule</h4>
                    </div>

                    <Table className="leaveTable">
                        <thead>
                            <tr>
                                <th>Work Location</th>
                                <th>Address</th>
                                <th>Week Days</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Working Hours</th>
                                {this.state.role != 'broker-admin' && this.state.role != 'broker-primary' ? (<>
                                    <th>Action</th>
                                </>) : ''}
                            </tr>
                        </thead>
                        <tbody>
                            {this.loadScheduleList()}
                        </tbody>
                    </Table>
                </Card>


                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Work Schedule</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleSubmit(this.state) }}>
                            <fieldset style={{ textAlign: "center" }}>
                                <div className=" mb-4 ">

                                    <div className="row text-center">
                                        <ul className="myinfoListing">
                                            <li className="text-left">
                                                <label>Work Locations</label>
                                                <span>
                                                    <div className="input-group mb-3">
                                                        <select className="form-control custom-select" onChange={this.handleChange} name="locationId">
                                                            <option selected value=''>Select Location</option>
                                                            {this.state.orgLocations.length > 0 && this.state.orgLocations.map((location) => {
                                                                return (
                                                                    <option value={location.locationId} selected={location.locationId == this.state.form.locationId ? true : false}>{location.locationName}</option>
                                                                )
                                                            })
                                                            }
                                                        </select>
                                                    </div>
                                                    <div class="errMsg">{this.state.validateFields.locationId}</div>
                                                </span>
                                            </li>
                                        </ul>
                                    </div>

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
                                                <div class="errMsg" style={{float: "left",marginLeft: "36%",fontWeight: "bold"}}>{this.state.validateFields.weekdays}</div>
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
                                                    <div class="errMsg">{this.state.validateFields.startTime}</div>
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
                                                    <div class="errMsg">{this.state.validateFields.endTime}</div>
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
                                                        <input type="text" name="workingHours" onChange={this.handleChange} className="form-control" value={this.state.form.workingHours} placeholder="ex. 8 Hours/Day" readOnly={true} />
                                                    </div>
                                                    <div class="errMsg">{this.state.validateFields.workingHours}</div>
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <Button variant="outline-primary mr-2" onClick={this.handleClose} disabled={this.state.btnDisable}>
                                    Close
                                </Button>
                                <Button type="submit" variant="primary" onClick={this.handleSubmit} disabled={this.state.btnDisable}>
                                    Save
                                </Button>
                            </fieldset>
                        </Form>

                    </Modal.Body>
                </Modal>

                <div className="form-group row pt-2 ">
                    <div className="col-lg-12 text-left">
                        <span className="addNewButton" onClick={this.handleShow}> <i className="icon-plus icons"></i> Add New</span>
                    </div>
                </div>
            </>
        )
    }

}

export default OrgSchedule;
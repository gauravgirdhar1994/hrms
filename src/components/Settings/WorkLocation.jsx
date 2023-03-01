import React, { Component, useState } from 'react';
import { Modal, Button, Card, Table, Form } from "react-bootstrap"
import axios from 'axios';
import Moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import TimePicker from 'react-time-picker';
import DatePicker from "react-datepicker";
import config from '../../config/config';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ConfirmPrompt from './ConfirmPrompt';
const BEARER_TOKEN = localStorage.getItem("userData");
class WorkLocation extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            show: false,
            editShow: false,
            data: [],
            editData: {},
            formDate: [],
            form: [],
            editLocation: '',
            token: localStorage.getItem("userData"),
            orgId: localStorage.getItem("orgId"),
            role: localStorage.getItem("roleSlug"),
            fields: [{ "locationName": "Location Name", "locationAddress": "Location Address", "status": "Status" }],
            validateFields: {}, 
            locEmployees: '',
            confirmPromptShow : false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleEditChange = this.handleEditChange.bind(this);
        this.onChangeSalaryDate1 = this.onChangeSalaryDate1.bind(this)
    }

    componentDidMount() {
        this.refreshData();
        this.setState({
            form: {
                ...this.state.form, ['startTime']: "10:00"
            }
        })
    }

    refreshData = () => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/organization/locations/list/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                console.log('Api result', r);
                this.setState({ data: r.data.organizationLocations.rows })
                console.log(this.state.data)
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

    handleEditClose = () => {
        console.log('close button')
        this.setState({ editShow: false })
    };

    handleChange = (event) => {
        // console.log('Input event',this.props.item);   
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            form: {
                ...this.state.form, [name]: value
            },
            validateFields: {
                ...this.state.validateFields, [name]: ""
            },
            
        }) 
    }

    handleEditChange(event){
        // event.preventDefault()
        const name = event.target.name;
        const value = event.target.value;
        if (event.target.name === 'status' && event.target.value == 0 && this.state.locEmployees > 0) {
            console.log('Status Inactive', event.target.name, event.target.value);
            this.setState({
                confirmPromptShow: true,
                editShow: false
            })
        }
        else {
            this.setState({
                editData: {
                    ...this.state.editData, [name]: value
                }
            })
        }
    }

    confirmClose = (status) => {
        console.log('confirm prompt', status);
        if (status) {
            this.setState({
                editData: {
                    ...this.state.editData, ['status'] : 0
                },
                editShow: true,
                confirmPromptShow: false
            })
        }
        else {
            this.setState({
                editData: {
                    ...this.state.editData, ['status'] : 1
                },
                editShow: true,
                confirmPromptShow: false
            })
        }
    }

    handleEditSubmit = (event) => {

        let datas = this.state.editData;
        datas.orgId = this.state.orgId;
        datas.salaryDate = this.state.editData.salaryDate;

        // console.log('Form Data',datas);
        const apiUrl = config.API_URL + '/location/edit/' + this.state.editLocation;
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        // console.log('headers => ', headers);
        axios.post(apiUrl, datas, { headers: headers })
            .then(res => {
                this.refreshData();
                if (res.status == 200) {
                    toast.success(res.data.message);
                    setTimeout(function () {
                        toast.dismiss()
                    }, 2000)
                    this.setState({ editShow: false })
                }
                else {
                    toast.error(res.data.message);
                    setTimeout(function () {
                        toast.dismiss()
                    }, 2000)
                }
                // console.log('POST response',res);
            })
    }

    editPopup = (id, count) => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/organization/location/' + id, { headers: { Authorization: bearer } })
            .then(r => {
                const rowData = r.data.locations.rows[0]
                this.setState({ 
                    editData: {
                        salaryDate: rowData.salaryDate!='null' ? Moment(new Date(rowData.salaryDate).toISOString()).toDate() : Moment().toDate(),
                        locationName: rowData.locationName,  
                        locationAddress: rowData.locationAddress,  
                        status: rowData.status
                    },
                    editShow: true, 
                    editLocation: id,
                    locEmployees: count
                })
                // this.setState({ editShow: true, editLocation: id })

                console.log('Api result', this.state.editData);
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }

    onTimechange = (name, time) => {
        console.log('Time Change', name, time)
        this.setState({
            form: {
                ...this.state.form, [name]: time
            }
        })
    }

    validateForm() {
        let fields = this.state.fields[0];
        let validations = {};
        let isFormValid = true;
        if (fields) {
            console.log('Payroll Fields', fields);
            for (var key in fields) {
                if (
                    this.refs[key].value == "" ||
                    typeof this.refs[key].value == "undefined" ||
                    this.refs[key].value == null
                ) {
                    validations[key] = "Please enter " + fields[key];
                    isFormValid = false;
                }
            }
            console.log('validations ============> ', validations);
            this.setState({ validateFields: validations });
            return isFormValid;
        }
    }

    handleSubmit = (event) => {
        console.log('Form Data', this.state.form);
        let datas = this.state.form;
        datas.orgId = this.state.orgId;
        datas.salaryDate = this.state.salaryDate;
        
        console.log('Form Data', datas);
        const apiUrl = config.API_URL + '/organization/locations/add';
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        if (this.validateForm()) {

            axios.post(apiUrl, datas, { headers: headers })
                .then(res => {
                    this.refreshData();
                    if (res.status == 200) {
                        toast.success(res.data.message);
                        setTimeout(function () {
                            toast.dismiss()
                        }, 2000)
                        this.setState({
                            'show': false
                        });
                    }
                    else {
                        toast.error(res.data.message);
                        setTimeout(function () {
                            toast.dismiss()
                        }, 2000)
                    }
                })
        }
    }
    
    onChangeSalaryDate = (salaryDate) =>
    this.setState({ 
        salaryDate,
        validateFields: {
            ...this.state.validateFields, ['salaryDate']: ""
        }
    });
    onChangeSalaryDate1 = (salaryDate) =>
    this.setState({ 
        editData:{
            ...this.state.editData,
            salaryDate:salaryDate
        }    
     });
    render() {

        return (
            <>
                <ToastContainer />
                <Card className="card d-block p-1 mb-4 shadow-sm">
                    <div className="d-flex justify-content-between  mb-4 ">
                        <h4 className="font-16 pl-3">Work Location</h4>

                    </div>

                    <Table className="leaveTable">
                        <thead>
                            <tr>
                                 <th>Location ID</th> 
                                <th>Work Location Name</th>
                                <th>Address</th>
                                {/* <th>Start Time</th>
                                <th>End Time</th> */}
                                <th>Salary Disbursement Date</th>
                                {this.state.role != 'broker-admin' && this.state.role != 'broker-primary' ? (<>
                                    <th>Employee count</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </>) : ''}
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map((data, key) => {
                                if (data !== null) {
                                    return (
                                        <tr key={key}>

                                            <td>{data.id}</td>
                                            <td>{data.locationName}</td>
                                            <td>{data.locationAddress === null ? '' : data.locationAddress}</td>
                                            {/* <td>{data.startTime}</td>
                                            <td>{data.endTime}</td> */}
                                            <td>{data.salaryDate ? Moment(data.salaryDate).format(config.DATE_FORMAT) : ''}</td>
                                            {this.state.role != 'broker-admin' && this.state.role != 'broker-primary' ? (<>
                                                <td>{data.empCount}</td>
                                                <td>{data.status == 1 ? 'Active' : 'Inactive'}</td>
                                                <td><span onClick={this.editPopup.bind(this, data.locId,data.empCount)}><i><FaEdit /></i> </span></td>
                                            </>) : ''}
                                        </tr>
                                    )
                                }
                            })
                            }
                        </tbody>
                    </Table>
                </Card>
                <div className="form-group row pt-2 ">
                    <div className="col-lg-12 text-left">
                        <span className="addNewButton" onClick={this.handleShow}> <i className="icon-plus icons"></i> Add New</span>
                    </div>
                </div>

                
                {this.state.confirmPromptShow ? <ConfirmPrompt empNo={this.state.locEmployees} type="location" confirmClose={this.confirmClose} confirmPromptShow={this.state.confirmPromptShow}></ConfirmPrompt> : ''}


                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Work Location</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleSubmit(this.state) }}>
                            <fieldset>

                                <label htmlFor="locationName" className="mb-0">Work Location</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="locationName" name="locationName" onChange={this.handleChange} ref="locationName" className="form-control" required="" />
                                        <div class="errMsg">{this.state.validateFields['locationName']}</div>
                                    </div>
                                </div>
                                <label htmlFor="locationAddress" className="mb-0">Address</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <textarea className="form-control" name="locationAddress" ref="locationAddress" onChange={this.handleChange}></textarea>
                                        <div class="errMsg">{this.state.validateFields['locationAddress']}</div>
                                    </div>
                                </div>

                                {/* <div className="row mb-3">
                                <div className="col-lg-6">
                                <label htmlFor="startTime" className="mb-0">Start Time</label>
                                <TimePicker className="form-control" name="startTime" onChange={this.onTimechange.bind(this, 'startTime')} disableClock="true" value="10:00" />
                                </div>
                                <div className="col-lg-6">
                                <label htmlFor="startTime" className="mb-0">End Time</label>
                                <TimePicker className="form-control" name="endTime" onChange={this.onTimechange.bind(this, 'endTime')} disableClock="true" value="10:00" />
                                </div>
                            </div> */}
                                <label htmlFor="locationAddress" className="mb-0">Salary Date</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <DatePicker
                                            showYearDropdown
                                            dropdownMode="scroll"
                                            className="form-control"
                                            dateFormat={config.DP_INPUT_DATE_FORMAT}
                                            selected={this.state.salaryDate}
                                            value={this.state.salaryDate}
                                            name="salaryDate"
                                            ref="salaryDate"
                                            onChange={this.onChangeSalaryDate}
                                            autoComplete="off"
                                        />
                                        <div class="errMsg">{this.state.validateFields['salaryDate']}</div>
                                        
                                    </div>
                                </div>

                                <label htmlFor="grade" className="mb-0">Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select className="form-control custom-select" onChange={this.handleChange} name="status" ref="status">
                                            <option selected value=''>Select Status</option> <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                        <div class="errMsg">{this.state.validateFields['status']}</div>
                                    </div>
                                </div>


                            </fieldset>
                            <Button variant="outline-primary mr-2" onClick={this.handleClose}>
                                Close
                        </Button>
                            <Button type="submit" variant="primary">
                                Save
                        </Button>
                        </Form>

                    </Modal.Body>
                </Modal>

                <Modal show={this.state.editShow} onHide={this.handleEditClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Work Location</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleEditSubmit(this.state) }}>
                            <fieldset>

                                <label htmlFor="locationName" className="mb-0">Work Location</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="locationName" value={this.state.editData.locationName} name="locationName" onChange={e => this.handleEditChange(e)} className="form-control" required="" />
                                    </div>
                                </div>
                                <label htmlFor="locationAddress" className="mb-0">Address</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <textarea className="form-control" value={this.state.editData.locationAddress} name="locationAddress" onChange={this.handleEditChange}></textarea>
                                    </div>
                                </div>
                                <label htmlFor="locationAddress" className="mb-0">Salary Date</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <DatePicker
                                            showYearDropdown
                                            dropdownMode="scroll"
                                            className="form-control"
                                            /* minDate={Moment().toDate()} */
                                            dateFormat={config.DP_INPUT_DATE_FORMAT}
                                            selected={this.state.editData.salaryDate}
                                            value={this.state.editData.salaryDate}
                                            name="salaryDate"
                                            onChange={this.onChangeSalaryDate1}
                                            autoComplete="off"
                                        />
                                        <div className="errMsg">
                                           {/*  {this.state.validateFields.date_of_resignation} */}
                                        </div>
                                    </div>
                                </div>

                                <label htmlFor="status" className="mb-0">Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select name="status" value={this.state.editData.status} className="form-control custom-select" onChange={e=>this.handleEditChange(e)}>
                                            <option selected value=''>Select Status</option> <option value="1" selected={this.state.editData.status && this.state.editData.status == 1 ? 'selected' : ''}>Active</option>
                                            <option value="0" selected={this.state.editData.status && this.state.editData.status == 0 ? 'selected' : ''}>Inactive</option>
                                        </select>
                                    </div>
                                </div>

                            </fieldset>
                            <Button variant="outline-primary mr-2" onClick={this.handleEditClose}>
                                Close
                        </Button>
                            <Button type="submit" variant="primary" onClick={this.handleEditClose}>
                                Save
                        </Button>
                        </Form>

                    </Modal.Body>
                </Modal>
            </>
        )
    }

}

export default WorkLocation;
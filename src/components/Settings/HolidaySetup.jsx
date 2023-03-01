import React, { Component } from 'react';
import { Modal, Button, Card, Table, Form } from "react-bootstrap";
import axios from 'axios';
import Moment from 'moment';
import moment from "react-moment";
import momentDurationFormatSetup from "moment-duration-format";
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import config from '../../config/config';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { MdVisibility } from 'react-icons/md';
import { TablePagination } from 'react-pagination-table';
const BEARER_TOKEN = localStorage.getItem("userData");

class HolidaySetup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: '',
            addShow: '',
            editShow: '',
            data: [],
            form: [],
            holidays: [],
            leaves: [],
            leavesCount: '',
            holidaysCount: '',
            selectedFile: '',
            editHoliday: '',
            editLeave: '',
            editLeaveShow: false,
            imgSrc: '',
            token: localStorage.getItem("userData"),
            orgId: localStorage.getItem("orgId"),
            role: localStorage.getItem("roleSlug")
        }
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData = () => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/leaves/' + this.state.orgId + '?page=settings', { headers: { Authorization: bearer } })
            .then(r => {
                this.setState({
                    leaves: r.data.leaves.rows,
                    leavesCount: r.data.leaves.count
                })
            })
            .catch((error) => {
                console.log("API ERR:", error);
                console.error(error);
                // res.json({ error: error });
            })

        axios.get(config.API_URL + '/holidays/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                this.setState({
                    holidays: r.data.holidays.rows,
                    holidaysCount: r.data.holidays.count,
                })
            })
            .catch((error) => {
                console.log("API ERR:", error);
                console.error(error);
                // res.json({ error: error });
            })
    }

    handleShow = () => {
        console.log('close button')
        this.setState({ show: true })
    };

    handleClose = () => {
        console.log('close button')
        this.setState({ show: false })
    };

    handleEditLeaveShow = () => {
        console.log('close button')
        this.setState({ editLeaveShow: true })
    };

    handleEditLeaveClose = () => {
        console.log('close button')
        this.setState({ editLeaveShow: false })
    };

    handleAddShow = () => {
        console.log('close button')
        this.setState({ addShow: true })
    };

    handleAddClose = () => {
        console.log('close button')
        this.setState({ addShow: false })
    };

    handleEditShow = () => {
        console.log('close button')
        this.setState({ editShow: true })
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
            }
        })
    }

    dateChange = (name, date) => {
        // console.log('BirthDate', name,date,Moment(date).format(config.INPUT_DATE_FORMAT))
        this.setState({
            form: {
                ...this.state.form, [name]: date
            }
        })
        this.state.form[name] = date;
    }

    handleSubmit = (event) => {
        console.log('Form Data', this.state.form);
        let datas = this.state.form;
        datas.orgId = this.state.orgId;
        console.log('Form Data', datas);
        const apiUrl = config.API_URL + '/leave/add';
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

    handleAddSubmit = (event) => {
        let datas = this.state.form;
        const apiUrl = config.API_URL + '/add-holiday-master';
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer
        }

        const formData = new FormData();

        // Update the formData object 
        // formData.append(
        //     'image',
        //     this.state.selectedFile
        // );

        for (var key in datas) {
            formData.append(key, datas[key]);
        }

        // console.log('headers => ', headers);
        axios.post(apiUrl, formData, { headers: headers })
            .then(res => {
                this.refreshData();
                console.log('POST response', res);
            })

        const toasts = "Updated Successfully"
        toast.success('Updated Successfully');
        setTimeout(function () {
            toast.dismiss()
        }, 2000)
        this.setState({ addshow: false })
    }

    uploadFile = (event) => {
        var bearer = 'Bearer ' + BEARER_TOKEN;

        const headers = {
            "Authorization": bearer,
        };

        this.state.selectedFile = event.target.files[0];
        // Details of the uploaded file 
        console.log('Selected file', this.state.selectedFile);

        let reader = new FileReader();

        reader.onloadend = () => {
            // console.log('Load end', reader.result);
            this.setState({
                imgSrc: reader.result,
                form: {
                    ...this.state.form, ['image']: this.state.selectedFile
                }
            });
            // console.log('Image src state', this.state.imgSrc);
        }

        reader.readAsDataURL(event.target.files[0])
    }

    addHoliday = (id) => {
        let datas = {
            holidayId: id
        };
        const apiUrl = config.API_URL + '/map-holiday-org';
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

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
    }

    addLeave = (id) => {
        let datas = {
            brokerLeaveId: id,
            orgId: this.state.orgId
        };
        const apiUrl = config.API_URL + '/map-leave-org';
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

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


    }

    editHoliday = (id) => {

        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        axios.get(config.API_URL + '/holidays/' + this.state.orgId + '?holidayId=' + id, { headers: { Authorization: bearer } })
            .then(r => {
                this.setState({
                    form: r.data.holidays.rows[0],
                    editShow: true,
                    editHoliday: id
                })
            })
            .catch((error) => {
                console.log("API ERR:", error);
                console.error(error);
                // res.json({ error: error });
            })
    }

    editLeave = (id) => {

        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        axios.get(config.API_URL + '/leaves/' + this.state.orgId + '?leaveId=' + id, { headers: { Authorization: bearer } })
            .then(r => {
                this.setState({
                    form: r.data.leaves.rows[0],
                    editLeaveShow: true,
                    editLeave: id
                })
            })
            .catch((error) => {
                console.log("API ERR:", error);
                console.error(error);
                // res.json({ error: error });
            })
    }

    handleEditHolidaySubmit = () => {
        let datas = this.state.form;
        const apiUrl = config.API_URL + '/edit-holiday-master/' + this.state.editHoliday;
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer
        }

        const formData = new FormData();

        // if(this.state.selectedFile){
        //         formData.append(
        //                 'image',
        //                 this.state.selectedFile
        //             );
        // }

        for (var key in datas) {
            formData.append(key, datas[key]);
        }

        // Update the formData object 
        console.log('File Edit', formData);
        axios.post(apiUrl, formData, { headers: headers })
            .then(res => {
                this.refreshData();
                console.log('POST response', res);
            })

        // const toasts = "Updated Successfully"
        toast.success('Updated Successfully');
        setTimeout(function () {
            toast.dismiss()
        }, 2000)

    }

    handleEditLeaveSubmit = () => {
        let datas = this.state.form;
        datas.orgId = this.state.orgId;
        const apiUrl = config.API_URL + '/leave/edit-leave/' + this.state.editLeave;
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        axios.post(apiUrl, datas, { headers: headers })
            .then(res => {
                this.refreshData();
                console.log('POST response', res);
            })

        // const toasts = "Updated Successfully"
        toast.success('Updated Successfully');
        setTimeout(function () {
            toast.dismiss()
        }, 2000)

    }


    daysDiff = (DOJ, today) => {
        var totalMonths = parseInt(Moment(today).diff(Moment(DOJ), 'days'));
        var totalDuration = Moment.duration(totalMonths, "days").format();
        totalDuration = totalDuration.replace('days', '');
        console.log('TotalDuration', totalDuration);
        return totalDuration;
    }

    render() {
        const leaves = this.state.leaves;
        const fieldsCount = this.state.leavesCount;
        console.log('leaves', leaves);
        if (leaves) {
            leaves.map((item, key) => {
                if(item !== null){
                    let status = item.status ? 'Active' : 'Inactive';
                    item.itemStatus = status;
                    if (item.isMaster === true && this.state.role != 'broker-admin' && this.state.role != 'broker-primary') {
                        item.action = <a class="btn btn-primary btn-edit" onClick={this.addLeave.bind(this, item.id)}>Add to Organization</a>
                    }
                    else {
                        item.action = <a class="btn btn-primary btn-edit" onClick={this.editLeave.bind(this, item.id)}>Edit</a>
                    }
                }
            })
        }
        console.log('length', fieldsCount)
        const Header = ["Leave Name", "Leave Type", "Leave Quota", "Status", "Action"];

        const holidays = this.state.holidays;
        const holidaysCount = this.state.holidaysCount;
        if (holidays) {

            holidays.map((item, key) => {
                item.startDate = Moment(item.startDate).format(config.DATE_FORMAT);
                item.endDate = Moment(item.endDate).format(config.DATE_FORMAT);
                item.day = Moment(item.startDate).format('dddd');
                item.daysDiff = this.daysDiff(item.startDate, item.endDate);
                console.log('Days Diff', item.daysDiff);
                if (item.daysDiff > 0) {
                    item.day = Moment(item.startDate).format('dddd') + ' - ' + Moment(item.endDate).format('dddd');
                    item.dateRange = Moment(item.startDate).format(config.DATE_FORMAT) + ' - ' + Moment(item.endDate).format(config.DATE_FORMAT);
                }
                else {
                    item.day = Moment(item.startDate).format('dddd');
                    item.dateRange = Moment(item.startDate).format(config.DATE_FORMAT);
                }
                let status = item.status ? 'Active' : 'Inactive';
                item.itemStatus = status;
                if (item.orgId == '' && this.state.role != 'broker-admin' && this.state.role != 'broker-primary') {
                    item.action = <a class="btn btn-primary btn-edit" onClick={this.addHoliday.bind(this, item.id)}>Add to Organization</a>
                }
                else{
                    item.action = <a class="btn btn-primary btn-edit" onClick={this.editHoliday.bind(this, item.id)}>Edit</a>
                }
            });
        }

        const holidaysHeader = ["Day", "Date", "Holiday Name", "Action"];


        return (
            <>
                <ul id="tabsJustified" className="nav nav-tabs nav-fil rounded-sm customTabul">
                    <li className="nav-item">
                        <a href="#Leavetype" data-target="#Leavetype" data-toggle="tab" className="nav-link active">Leave Type</a>
                    </li>
                    <li className="nav-item">
                        <a href="#Holidays" data-target="#Holidays" data-toggle="tab" className="nav-link">Holidays</a>
                    </li>

                </ul>
                <ToastContainer />
                <div id="tabsJustifiedContent" className="tab-content py-1">
                    <div className="tab-pane fade active show" id="Leavetype">
                        <Card className="card d-block p-1 mb-4 shadow-sm">
                            <span className="anchor" id="formComplex"></span>
                            <div className="my-4" />

                            <div div className="d-flex justify-content">
                                <div className="col-lg-9">
                                    {/* <p className="font-16">Give your Employees Acess Levels to determine their access to information in HRMS</p> */}
                                </div>
                            </div>

                            <div className=" mt-4  pr-3">
                                <div className="col-lg-12">

                                    {fieldsCount > 0 ? (
                                        <TablePagination
                                            title=""
                                            subTitle=""
                                            headers={Header}
                                            data={leaves}
                                            columns="leaveName.leaveType.annualQuota.itemStatus.action"
                                            perPageItemCount={10}
                                            totalCount={fieldsCount}
                                            paginationClassName="pagination-status"
                                            className="react-pagination-table"
                                            arrayOption={[["size", 'all', ' ']]}
                                        />
                                    ) : 'No Data Found'}

                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-lg-12 text-left ">
                                    <span className="addNewButton pl-3" onClick={this.handleShow}> <i className="icon-plus icons"></i> Add New</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="tab-pane fade" id="Holidays">
                        <Card className="card d-block p-1 mb-4 shadow-sm">
                            <span className="anchor" id="formComplex"></span>
                            <div className="my-4" />

                            <div div className="d-flex justify-content">
                                <div className="col-lg-9">
                                    {/* <p className="font-16">Give your Employees Acess Levels to determine their access to information in HRMS</p> */}
                                </div>

                                <div className="col-lg-3">

                                </div>
                            </div>

                            <div className=" mt-4  pr-3">
                                <div className="col-lg-12">

                                    {holidaysCount > 0 ? (
                                        <TablePagination
                                            title=""
                                            subTitle=""
                                            headers={holidaysHeader}
                                            data={holidays}
                                            columns="day.dateRange.holidayName.action"
                                            perPageItemCount={10}
                                            totalCount={holidaysCount}
                                            paginationClassName="pagination-status"
                                            className="react-pagination-table"
                                            arrayOption={[["size", 'all', ' ']]}
                                        />
                                    ) : 'No Data Found'}

                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-lg-12 text-left">
                                    <span className="addNewButton pl-3" onClick={this.handleAddShow}> <i className="icon-plus icons"></i> Add New</span>
                                </div>
                            </div>
                        </Card>

                    </div>
                </div>



                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Leave</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleSubmit(this.state) }}>
                            <fieldset>
                                <label htmlFor="leaveName" className="mb-0">Leave Name</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="leaveName" onChange={this.handleChange} name="leaveName" className="form-control" required="" />
                                    </div>
                                </div>

                                <label htmlFor="leaveType" className="mb-0">Leave Type</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select className="form-control custom-select" name="leaveType" onChange={this.handleChange}>
                                        <option value="">--Select--</option>
                                            <option value="Annually">Annually</option>
                                            <option value="Monthly">Monthly</option>
                                        </select>
                                    </div>
                                </div>

                                <label htmlFor="annualQuota" className="mb-0">Leave Quota</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="annualQuota" name="annualQuota" onChange={this.handleChange} className="form-control" required="" />
                                    </div>
                                </div>


                                <label htmlFor="status" className="mb-0">Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select className="form-control custom-select" name="status" onChange={this.handleChange}>
                                            <option selected value=''>Select Status</option> <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </fieldset>
                            <Button variant="outline-primary mr-2" onClick={this.handleClose}>
                                Close
                        </Button>
                            <Button type="submit" variant="primary" onClick={this.handleClose}>
                                Save
                        </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Modal show={this.state.editLeaveShow} onHide={this.handleEditLeaveClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Leave</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleEditLeaveSubmit(this.state) }}>
                            <fieldset>
                                <label htmlFor="leaveName" className="mb-0">Leave Name</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="leaveName" onChange={this.handleChange} name="leaveName" className="form-control" value={this.state.form.leaveName} required="" />
                                    </div>
                                </div>

                                <label htmlFor="leaveType" className="mb-0">Leave Type</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select className="form-control custom-select" name="leaveType" onChange={this.handleChange}>
                                            <option value="">--Select--</option>
                                            <option value="Annually" selected={this.state.form.leaveType === 'Annually' ? 'selected' : ''}>Annually</option>
                                            <option value="Monthly" selected={this.state.form.leaveType === 'Monthly' ? 'selected' : ''}>Monthly</option>
                                        </select>
                                    </div>
                                </div>

                                <label htmlFor="annualQuota" className="mb-0">Leave Quota</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="annualQuota" name="annualQuota" onChange={this.handleChange} className="form-control" value={this.state.form.annualQuota} required="" />
                                    </div>
                                </div>


                                <label htmlFor="status" className="mb-0">Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select className="form-control custom-select" value={this.state.form.status} name="status" onChange={this.handleChange}>
                                            <option value=''>Select Status</option>
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </fieldset>
                            <Button variant="outline-primary mr-2" onClick={this.handleEditLeaveClose}>
                                Close
                        </Button>
                            <Button type="submit" variant="primary" onClick={this.handleEditLeaveClose}>
                                Save
                        </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Modal show={this.state.addShow} onHide={this.handleAddClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Holiday</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleAddSubmit(this.state) }}>
                            <fieldset>
                                <label htmlFor="leaveName" className="mb-0">Holiday Name</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="holidayName" onChange={this.handleChange} name="holidayName" className="form-control" required="" />
                                    </div>
                                </div>

                                <label htmlFor="startDate" className="mb-0">Start Date</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <DatePicker showYearDropdown dropdownMode="scroll" dateFormat={config.DP_INPUT_DATE_FORMAT} className="form-control" selected={Moment().toDate()} onChange={this.dateChange.bind(this, "startDate")} value={this.state.form.startDate ? Moment(new Date(this.state.form.startDate)).format(config.INPUT_DATE_FORMAT) : ''} name="startDate" autoComplete="off" />
                                    </div>
                                </div>

                                <label htmlFor="endDate" className="mb-0">End Date</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <DatePicker showYearDropdown dropdownMode="scroll" dateFormat={config.DP_INPUT_DATE_FORMAT} className="form-control" selected={Moment().toDate()} onChange={this.dateChange.bind(this, "endDate")} value={this.state.form.endDate ? Moment(new Date(this.state.form.endDate)).format(config.INPUT_DATE_FORMAT) : ''} name="endDate" autoComplete="off" />
                                    </div>
                                </div>

                                <label htmlFor="companyAddress" className="mb-0">Holiday Image</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <ul className="myinfoListing">
                                            <li>
                                                <label>Upload Image </label>
                                                <span>

                                                    <label for="upload" className="squireUpload">
                                                        {this.state.imgSrc === '' ? (
                                                            <small>Your Company Logo</small>
                                                        ) : (
                                                                <img src={this.state.imgSrc} width="150"></img>
                                                            )}
                                                        <input type="file" name="image" id="upload" onChange={this.uploadFile} />
                                                    </label>

                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div> 

                                <label htmlFor="status" className="mb-0">Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select className="form-control custom-select" name="status" onChange={this.handleChange}>
                                            <option selected value=''>Select Status</option> <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </fieldset>
                            <Button variant="outline-primary mr-2" onClick={this.handleAddClose}>
                                Close
                        </Button>
                            <Button type="submit" variant="primary" onClick={this.handleAddClose}>
                                Save
                        </Button>
                        </Form>
                    </Modal.Body>
                </Modal>


                <Modal show={this.state.editShow} onHide={this.handleEditClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Holiday</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleEditHolidaySubmit(this.state) }}>
                            <fieldset>
                                <label htmlFor="leaveName" className="mb-0">Holiday Name</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="holidayName" onChange={this.handleChange} name="holidayName" className="form-control" value={this.state.form.holidayName} required="" />
                                    </div>
                                </div>

                                <label htmlFor="startDate" className="mb-0">Start Date</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <DatePicker showYearDropdown dropdownMode="scroll" dateFormat={config.DP_INPUT_DATE_FORMAT} className="form-control" selected={Moment().toDate()} onChange={this.dateChange.bind(this, "startDate")} value={this.state.form.startDate ? Moment(new Date(this.state.form.startDate)).format(config.INPUT_DATE_FORMAT) : ''} name="startDate" autoComplete="off" />
                                    </div>
                                </div>

                                <label htmlFor="endDate" className="mb-0">End Date</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <DatePicker showYearDropdown dropdownMode="scroll" dateFormat={config.DP_INPUT_DATE_FORMAT} className="form-control" selected={Moment().toDate()} onChange={this.dateChange.bind(this, "endDate")} value={this.state.form.endDate ? Moment(new Date(this.state.form.endDate)).format(config.INPUT_DATE_FORMAT) : ''} name="endDate" autoComplete="off" />
                                    </div>
                                </div>

                         <label htmlFor="companyAddress" className="mb-0">Holiday Image</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <ul className="myinfoListing">
                                            <li>
                                                <label>Upload Image </label>
                                                <span>

                                                    <label for="upload" className="squireUpload">
                                                        {!this.state.form.image ? (
                                                            <small>Your Company Logo</small>
                                                        ) : (
                                                                <img src={!this.state.imgSrc ? config.BASE_URL + '/' + this.state.form.image : this.state.imgSrc} width="150"></img>
                                                            )}
                                                        <input type="file" name="image" id="upload" onChange={this.uploadFile} />
                                                    </label>

                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div> 

                                <label htmlFor="status" className="mb-0">Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select className="form-control custom-select" name="status" onChange={this.handleChange}>
                                            <option selected value=''>Select Status</option>
                                            <option value="1" selected={this.state.form.active ? 'selected' : ''}>Active</option>
                                            <option value="0" selected={!this.state.form.active ? 'selected' : ''}>Inactive</option>
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

export default HolidaySetup;
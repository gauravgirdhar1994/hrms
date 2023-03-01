import React, { Component } from "react";
// import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { Modal, Button, Form, Card, Table } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import Moment from 'moment';
import { Redirect } from "react-router-dom";
import DatePicker from "react-datepicker";
import { FaEdit, FaEye, FaCheck, FaSleigh, FaStar } from 'react-icons/fa';
import axios from 'axios';
import config from '../../src/config/config';


const BEARER_TOKEN = localStorage.getItem("userData");

class AddEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: '',
            data: [],
            form: [],
            redirect: false,
            validateFields: {},
            orgId: localStorage.getItem('orgId'),
            bloodGroup:config.blood_group,
            bloodGroupOpt:'',
            role: localStorage.getItem('role')
        };
        this.handleClose = this.handleClose.bind(this);
    }

    handleShow = () => {
        console.log('close button')
        this.setState({ show: true })
    };

    handleAddShow = () => {
        console.log('close button')
        this.setState({ addShow: true })
    };

    handleClose = () => {
        console.log('close button')
        this.setState({ show: false })
    };

    handleAddClose = () => {
        console.log('close button')
        this.setState({ addShow: false })
    };

    handleChange = (event) => {

        const name = event.target.name;
        const value = event.target.value;
        const type = event.target.type;
        console.log('Select Type', this.refs[name].value)
        this.setState({
            data: {
                ...this.state.data, [name]: value
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
        this.state.form[name] = date
        console.log('Date change  ' + name, this.state.form[name]);
    }


    componentDidMount() {
        this.refreshData();
    }

    refreshData = () => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/employee/access/list/' + this.state.orgId + "/3?role=" + this.state.role, { headers: { Authorization: bearer } })
            .then(r => {
                this.setState({ basicFields: r.data.fields.rows, basicFieldCount: r.data.fields.count })
                console.log('Api result', this.state.basicFields);

            })
            .catch((error) => {
                console.log("API ERR: ", error);
                console.error(error);
                // res.json({ error: error });
            });
        axios.get(config.API_URL + '/employee/access/list/' + this.state.orgId + "/7?role=" + this.state.role, { headers: { Authorization: bearer } })
            .then(r => {
                console.log('Api result', r);
                this.setState({ contactFields: r.data.fields.rows, contactFieldsCount: r.data.fields.count })

            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
        axios.get(config.API_URL + '/employee/access/list/' + this.state.orgId + "/11?role=" + this.state.role, { headers: { Authorization: bearer } })
            .then(r => {
                console.log('Api result', r);
                this.setState({ employmentFields: r.data.fields.rows, empFieldsCount: r.data.fields.count })

            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
        axios.get(config.API_URL + '/common/countries', { headers: { Authorization: bearer } })
            .then(r => {

                if (r.status == 200) {
                    var arrCountry = [];
                    var arrNationality = [];
                    var arrGender = [];
                    var arrStatus = [];
                    var gender = {
                        0: {
                            "id": "M",
                            "value": "Male"
                        },
                        1: {
                            "id": "F",
                            "value": "Female"
                        },
                        length: 2
                    };
                    var status = {
                        0: {
                            "id": "1",
                            "value": "Active"
                        },
                        1: {
                            "id": "0",
                            "value": "Inactive"
                        },
                        length: 2
                    };

                    for (var k = 0; k < r.data.Countries.length; k++) {
                        arrCountry.push(<option key={r.data.Countries[k].id} value={r.data.Countries[k].id}> {r.data.Countries[k].country} </option>);
                        arrNationality.push(<option key={r.data.Countries[k].id} value={r.data.Countries[k].id}> {r.data.Countries[k].nationality} </option>);
                    }
                    console.log('Gender', gender.length);
                    for (var i = 0; i < gender.length; i++) {
                        console.log('Gender', gender[i]);
                        arrGender.push(<option key={gender[i].id} value={gender[i].id}>{gender[i].value}</option>);
                    }
                    for (var i = 0; i < status.length; i++) {
                        //  console.log('Gender',gender[i]);
                        arrStatus.push(<option key={status[i].id} value={status[i].id}>{status[i].value}</option>);
                    }
                    this.setState({ country: arrCountry, nationality: arrNationality, gender: arrGender, status: arrStatus });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
        axios.get(config.API_URL + '/common/positions/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                console.log('Positions Response', r);
                if (r.status == 200) {
                    var arrTen = [];
                    for (var k = 0; k < r.data.Positions.length; k++) {
                        arrTen.push(<option key={r.data.Positions[k].id} value={r.data.Positions[k].id}> {r.data.Positions[k].positionName} </option>);
                    }
                    this.setState({ positionId: arrTen });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
        axios.get(config.API_URL + '/common/departments/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                console.log('Positions Response', r);
                if (r.status == 200) {
                    var arrTen = [];
                    for (var k = 0; k < r.data.Departments.length; k++) {
                        arrTen.push(<option key={r.data.Departments[k].id} value={r.data.Departments[k].id}> {r.data.Departments[k].departmentName} </option>);
                    }
                    this.setState({ deptId: arrTen });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
        axios.get(config.API_URL + '/common/locations/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                console.log('Positions Response', r);
                if (r.status == 200) {
                    var arrTen = [];
                    for (var k = 0; k < r.data.Locations.length; k++) {
                        arrTen.push(<option key={r.data.Locations[k].id} value={r.data.Locations[k].id}> {r.data.Locations[k].locationName} </option>);
                    }
                    this.setState({ workLocation: arrTen });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
        axios.get(config.API_URL + '/common/employmentType/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                console.log('Positions Response', r);
                if (r.status == 200) {
                    var arrTen = [];

                    for (var k = 0; k < r.data.EmploymentType.length; k++) {
                        arrTen.push(<option key={r.data.EmploymentType[k].id} value={r.data.EmploymentType[k].id}> {r.data.EmploymentType[k].empType} </option>);
                    }

                    this.setState({ employmentType: arrTen });
                    console.log('Status', this.state.employmentType);
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
        axios.get(config.API_URL + '/common/accessRoles/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                console.log('Positions Response', r);
                if (r.status == 200) {
                    var arrTen = [];
                    for (var k = 0; k < r.data.accessRoles.length; k++) {
                        arrTen.push(<option key={r.data.accessRoles[k].id} value={r.data.accessRoles[k].id}> {r.data.accessRoles[k].roleName} </option>);
                    }
                    this.setState({ accessRoles: arrTen });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
        axios.get(config.API_URL + '/organization/managers/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {

                if (r.status == 200) {
                    var arrTen = [];
                    for (var k = 0; k < r.data.managers.count; k++) {
                        arrTen.push(<option key={r.data.managers.rows[k].id} value={r.data.managers.rows[k].id}> {r.data.managers.rows[k].firstname} {r.data.managers.rows[k].lastname}</option>);
                    }
                    this.setState({ supervisorId: arrTen, attendanceManager: arrTen });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
        axios.get(config.API_URL + '/organization/managers/' + this.state.orgId + '?role=hr', { headers: { Authorization: bearer } })
            .then(r => {

                if (r.status == 200) {
                    var arrTen = [];
                    for (var k = 0; k < r.data.managers.count; k++) {
                        arrTen.push(<option key={r.data.managers.rows[k].id} value={r.data.managers.rows[k].id}> {r.data.managers.rows[k].firstname} {r.data.managers.rows[k].lastname}</option>);
                    }
                    this.setState({ hrManager: arrTen });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
            var arrBloodGroups = [];
            this.state.bloodGroup.map((obj_index, arr_index) => {
                console.log('blood group',obj_index,arr_index)
                arrBloodGroups.push(<option key={arr_index} value={obj_index}> {obj_index} </option>);
            })
            this.setState({bloodGroup: arrBloodGroups});
    }

    handleChange = (event) => {

        const name = event.target.name;
        const value = event.target.value;
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        this.setState({
            form: {
                ...this.state.form, [name]: value
            },
            validateFields: {
                ...this.state.validateFields, [name]: ''
            }

        })


        if (name === 'email' || name === 'personalEmail') {

            if (reg.test(value) === false) {
                // console.log('Email check', name, reg.test(value));
                this.setState({
                    validateFields: {
                        ...this.state.validateFields, [name]: 'Please enter a valid email'
                    }
                })
            }
            else {
                this.setState({
                    validateFields: {
                        ...this.state.validateFields, [name]: ''
                    }
                })
            }
        }

        if (name === 'phoneNumber' || name === 'alternateNumber') {
            console.log('Phone Number', name, value.length)
            if (value.length > 12) {
                this.setState({
                    validateFields: {
                        ...this.state.validateFields, [name]: 'Phone Number is invalid'
                    }
                })
            }
        }

        // console.log('Input event',name, value);  
        // console.log('Input event',this.state.form);  

    }

    handleSubmit = (event) => {
        // console.log('Form Data', this.state.data);
        let datas = {};
        datas.personalInfo = this.state.form;
        datas.personalInfo.orgId = this.state.orgId;

        const apiUrl = config.API_URL + '/employee/add';
        var bearer = 'Bearer ' + BEARER_TOKEN;
        const headers = {
            "Authorization": bearer,
        }
        // console.log('headers => ', headers);
        if (this.validateForm()) {
            axios.post(apiUrl, datas, { headers: headers })
                .then(res => {
                    this.refreshData();
                    console.log('POST response', res);
                    if (res.data.success === false) {
                        console.log('Add employee error');
                        toast.error(res.data.message);
                        setTimeout(function () {
                            toast.dismiss()
                        }, 2000)
                    }
                    if (res.data.success === true) {
                        toast.success(res.data.message);
                        setTimeout(function () {
                            toast.dismiss()
                        }, 2000)
                        this.setState({ show: false });
                        this.setState({ redirect: true });
                    }
                })
        }

    }

    showToastMessage(toastMessage) {
        toast(toastMessage, { autoClose: 3000 })
    }

    validateForm() {
        let basicFields = this.state.basicFields;
        let contactFields = this.state.contactFields;
        let employmentFields = this.state.employmentFields;
        let validations = {};
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let isFormValid = true;

        basicFields.map((data, key) => {
            if (data !== null && data.required) {
                if (
                    this.state.form[data.fieldName] == "" ||
                    typeof this.state.form[data.fieldName] == "undefined"
                ) {
                    validations[data.fieldName] = "Please enter " + data.fieldTitle;
                    isFormValid = false;
                }
            }
        })
        contactFields.map((data, key) => {
            if (data !== null && data.required) {
                if (
                    this.state.form[data.fieldName] == "" ||
                    typeof this.state.form[data.fieldName] == "undefined"
                ) {
                    validations[data.fieldName] = "Please enter " + data.fieldTitle;
                    isFormValid = false;
                }
            }
        })
        employmentFields.map((data, key) => {
            if (data !== null && data.required) {
                if (
                    this.state.form[data.fieldName] == "" ||
                    typeof this.state.form[data.fieldName] == "undefined"
                ) {
                    validations[data.fieldName] = "Please enter " + data.fieldTitle;
                    isFormValid = false;
                }
            }
        })

        if (reg.test(this.state.form.email) === false) {
            validations["email"] = "Please enter a valid email";
            isFormValid = false;
        }
        if (reg.test(this.state.form.personalEmail) === false) {
            validations["personalEmail"] = "Please enter a valid email";
            isFormValid = false;
        }

        console.log('validations ============> ', validations);
        this.setState({ validateFields: validations });
        return isFormValid;
    }


    render() {
        if (this.state.redirect) {
            this.setState({ redirect: false });
            return <Redirect to={{
                pathname: "/employees",
                // state:{ticketMessage: "Your ticket has been submitted succeefully!"},
            }} />
        }
        let inputFields;
        let contactFields;
        let empFields;
        console.log('Basic Fields', this.state.basicFields)
        inputFields = this.state.basicFields && this.state.basicFieldCount > 0 ? this.state.basicFields : '';
        contactFields = this.state.contactFields && this.state.contactFieldsCount > 0 ? this.state.contactFields : '';
        empFields = this.state.employmentFields && this.state.empFieldsCount > 0 ? this.state.employmentFields : '';
        return (
            <>
                <div className="p-2 flex-fill d-flex flex-column page-fade-enter-done">
                    <ToastContainer className="right" position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnVisibilityChange
                        draggable
                        pauseOnHover />
                    <Card className="card d-block p-1 mb-4 pt-4 pl-4 pr-4 pb-4 shadow-sm">
                        <div className="d-flex justify-content-between  mb-4">
                            <h4 className="font-16">Add Employee</h4>
                        </div>
                        <Form onSubmit={event => { event.preventDefault(); this.handleSubmit(this.state) }}>



                            <ul className="myinfoListing addEmployeeForm">
                                <h5>Personal Info</h5>
                                {this.state.basicFieldCount > 0 ? inputFields.map((inputField, index) => {
                                    // console.log('InputField', inputField, index)
                                    switch (inputField.fieldType) {
                                        case "text": return <li><label htmlFor={inputField.fieldName}>{inputField.fieldTitle} {inputField.required ? (<i title="Required Field"><FaStar /></i>) : ''}</label><span><input type="text" className="form-control" onChange={this.handleChange} id={inputField.fieldName} name={inputField.fieldName} disabled={inputField.view == 1 && inputField.update == 0 ? 'disabled' : ''} value={this.state.form[inputField.fieldName]} /><div class="errMsg">{this.state.validateFields[inputField.fieldName]}</div></span> </li>;

                                        case "date": return <li><label htmlFor={inputField.fieldName}>{inputField.fieldTitle} {inputField.required ? (<i title="Required Field"><FaStar /></i>) : ''}</label><span><DatePicker showYearDropdown autoComplete="off" dateFormat={config.DP_INPUT_DATE_FORMAT} dropdownMode="scroll" selected={this.state.form[inputField.fieldName]} className="form-control" value={this.state.form[inputField.fieldName]} onChange={this.dateChange.bind(this, inputField.fieldName)} disabled={inputField.view == 1 && inputField.update == 0 ? 'disabled' : ''} name={inputField.fieldName} id={inputField.fieldName} /><div class="errMsg">{this.state.validateFields[inputField.fieldName]}</div></span> </li>;

                                        case "textarea": return <li><label htmlFor={inputField.fieldName}>{inputField.fieldTitle} {inputField.required ? (<i title="Required Field"><FaStar /></i>) : ''}</label><span><textarea type="text" value={this.state.form[inputField.fieldName]} id={inputField.fieldName} name={inputField.fieldName} disabled={inputField.view == 1 && inputField.update == 0 ? 'disabled' : ''} onChange={this.handleChange} className="form-control" required="" /><div class="errMsg">{this.state.validateFields[inputField.fieldName]}</div></span> </li>;

                                        case "select": return <li><label htmlFor={inputField.fieldName}>{inputField.fieldTitle} {inputField.required ? (<i title="Required Field"><FaStar /></i>) : ''}</label><span><select className="form-control custom-select" disabled={inputField.view == 1 && inputField.update == 0 ? 'disabled' : ''} onChange={this.handleChange} name={inputField.fieldName} value={this.state.form[inputField.fieldName]}><option disabled selected>Select {inputField.fieldTitle}</option>{this.state[inputField.fieldName] ? this.state[inputField.fieldName] : ''}</select><div class="errMsg">{this.state.validateFields[inputField.fieldName]}</div></span> </li>;
                                    }
                                })
                                    : ''
                                }
                            </ul>
                            <hr></hr>
                            <ul className="myinfoListing addEmployeeForm">
                                <h5>Contact Info</h5>
                                {this.state.contactFieldsCount > 0 ? contactFields.map((inputField, index) => {
                                    // console.log('InputField', inputField, index)
                                    switch (inputField.fieldType) {
                                        case "text": return <li><label htmlFor={inputField.fieldName}>{inputField.fieldTitle} {inputField.required ? (<i title="Required Field"><FaStar /></i>) : ''}</label><span><input type="text" className="form-control" onChange={this.handleChange} id={inputField.fieldName} name={inputField.fieldName} disabled={inputField.view == 1 && inputField.update == 0 ? 'disabled' : ''} value={this.state.form[inputField.fieldName]} /><div class="errMsg">{this.state.validateFields[inputField.fieldName]}</div></span> </li>;

                                        case "date": return <li><label htmlFor={inputField.fieldName}>{inputField.fieldTitle} {inputField.required ? (<i title="Required Field"><FaStar /></i>) : ''}</label><span><DatePicker showYearDropdown autoComplete="off" dateFormat={config.DP_INPUT_DATE_FORMAT} dropdownMode="scroll" selected={this.state.form[inputField.fieldName]} className="form-control" value={this.state.form[inputField.fieldName]} onChange={this.dateChange.bind(this, inputField.fieldName)} disabled={inputField.view == 1 && inputField.update == 0 ? 'disabled' : ''} name={inputField.fieldName} id={inputField.fieldName} /><div class="errMsg">{this.state.validateFields[inputField.fieldName]}</div></span> </li>;

                                        case "textarea": return <li><label htmlFor={inputField.fieldName}>{inputField.fieldTitle} {inputField.required ? (<i title="Required Field"><FaStar /></i>) : ''}</label><span><textarea type="text" value={this.state.form[inputField.fieldName]} id={inputField.fieldName} name={inputField.fieldName} disabled={inputField.view == 1 && inputField.update == 0 ? 'disabled' : ''} onChange={this.handleChange} className="form-control" required="" /><div class="errMsg">{this.state.validateFields[inputField.fieldName]}</div></span> </li>;

                                        case "select": return <li><label htmlFor={inputField.fieldName}>{inputField.fieldTitle} {inputField.required ? (<i title="Required Field"><FaStar /></i>) : ''}</label><span><select className="form-control custom-select" disabled={inputField.view == 1 && inputField.update == 0 ? 'disabled' : ''} onChange={this.handleChange} name={inputField.fieldName} value={this.state.form[inputField.fieldName]}><option disabled selected>Select {inputField.fieldTitle}</option>{this.state[inputField.fieldName] ? this.state[inputField.fieldName] : ''}</select><div class="errMsg">{this.state.validateFields[inputField.fieldName]}</div></span> </li>;
                                    }
                                })
                                    : ''
                                }
                            </ul>
                            <hr></hr>
                            <ul className="myinfoListing addEmployeeForm">
                                <h5>Employment Info</h5>
                                {this.state.empFieldsCount > 0 ? empFields.map((inputField, index) => {
                                    // console.log('InputField', inputField, index)
                                    switch (inputField.fieldType) {
                                        case "text": return <li><label htmlFor={inputField.fieldName}>{inputField.fieldTitle} {inputField.required ? (<i title="Required Field"><FaStar /></i>) : ''}</label><span><input type="text" className="form-control" onChange={this.handleChange} id={inputField.fieldName} name={inputField.fieldName} disabled={inputField.view == 1 && inputField.update == 0 ? 'disabled' : ''} value={this.state.form[inputField.fieldName]} /><div class="errMsg">{this.state.validateFields[inputField.fieldName]}</div></span> </li>;

                                        case "date": return <li><label htmlFor={inputField.fieldName}>{inputField.fieldTitle} {inputField.required ? (<i title="Required Field"><FaStar /></i>) : ''}</label><span><DatePicker showYearDropdown autoComplete="off" dateFormat={config.DP_INPUT_DATE_FORMAT} dropdownMode="scroll" selected={this.state.form[inputField.fieldName]} className="form-control" value={this.state.form[inputField.fieldName]} onChange={this.dateChange.bind(this, inputField.fieldName)} disabled={inputField.view == 1 && inputField.update == 0 ? 'disabled' : ''} name={inputField.fieldName} id={inputField.fieldName} /><div class="errMsg">{this.state.validateFields[inputField.fieldName]}</div></span> </li>;

                                        case "textarea": return <li><label htmlFor={inputField.fieldName}>{inputField.fieldTitle} {inputField.required ? (<i title="Required Field"><FaStar /></i>) : ''}</label><span><textarea type="text" value={this.state.form[inputField.fieldName]} id={inputField.fieldName} name={inputField.fieldName} disabled={inputField.view == 1 && inputField.update == 0 ? 'disabled' : ''} onChange={this.handleChange} className="form-control" required="" /><div class="errMsg">{this.state.validateFields[inputField.fieldName]}</div></span> </li>;

                                        case "select": return <li><label htmlFor={inputField.fieldName}>{inputField.fieldTitle} {inputField.required ? (<i title="Required Field"><FaStar /></i>) : ''}</label><span><select className="form-control custom-select" disabled={inputField.view == 1 && inputField.update == 0 ? 'disabled' : ''} onChange={this.handleChange} name={inputField.fieldName} ref={inputField.fieldName} value={this.state.form[inputField.fieldName]}><option disabled selected>Select {inputField.fieldTitle}</option>{this.state[inputField.fieldName] ? this.state[inputField.fieldName] : ''}</select><div class="errMsg">{this.state.validateFields[inputField.fieldName]}</div></span> </li>;
                                    }
                                })
                                    : ''
                                }
                                <li>
                                    <label htmlFor="accessRole">Access Role</label>
                                    <span><select className="form-control custom-select" onChange={this.handleChange} ref="supervisorId" name="accessRole">
                                        <option disabled selected>Select Role</option>{this.state.accessRoles}
                                    </select><div class="errMsg">{this.state.validateFields['accessRole']}</div></span> </li>
                            </ul>
                            <div className="text-center">
                                <Button variant="outline-primary mr-2" onClick={this.handleClose}>
                                    Close
                            </Button>
                                <Button type="submit" variant="primary" onClick={this.handleClose}>
                                    Save
                            </Button>
                            </div>
                        </Form>
                    </Card>

                </div>

            </>
        );
    }
}

export default AddEmployee;

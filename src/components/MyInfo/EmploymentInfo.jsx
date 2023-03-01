import React, { Component } from 'react';
// import userDetail from '../../services/userDetail'
import { connect } from "react-redux";
import { fetchData } from "../../action/fetchData";
import { editData } from "../../action/editData";

import { Modal, Form, Button } from "react-bootstrap"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loader from '../../loader.gif';
import axios from 'axios';
import Moment from 'moment';
import config from '../../config/config';
import DatePicker from "react-datepicker";
import FormComponent from "../MyInfo/FormComponent";
import DataLoading from "../../components/Loaders/DataLoading";
const BEARER_TOKEN = localStorage.getItem("userData");

class EmploymentInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            data: [],
            form: [],
            item: [],
            fields: [],
            response: "",
            positions: [],
            locations: [],
            locations1: [],
            managers: [],
            hrManager: [],
            empType: [],
            basicFields: [],
            departments: [],
            gender: config.GENDER,
            status: config.STATUS,
            gender_option: [],
            status_option: [],
            arrEmpType: [],
            token: localStorage.getItem("userData"),
            orgId: localStorage.getItem("orgId"),
            editPermission: false,
            viewPermission: false,
            accessRole: [],
            roleIds: [],
            grade : []
        }
        this.getPositions = this.getPositions.bind(this);
        this.getLocations = this.getLocations.bind(this);
        this.getEmpType = this.getEmpType.bind(this);
        this.getDepartments = this.getDepartments.bind(this);
        this.getGender = this.getGender.bind(this);
        this.getStatus = this.getStatus.bind(this);
        this.getManagers = this.getManagers.bind(this);
        this.getAccessRoles = this.getAccessRoles.bind(this);
    }

    componentDidMount() {
        this.refreshData();
        this.getPositions();
        this.getLocations();
        this.getEmpType();
        this.getDepartments();
        this.getGender();
        this.getStatus();
        this.getGrades();
        this.getManagers();
        this.getAccessRoles();
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/field-access-list?menuId=11', { headers: { Authorization: bearer } })
            .then(r => {
                if (r.status == 200) {
                    console.log('fieldList', r.data.fieldList);
                    this.setState({ basicFields: r.data.fieldList });
                    r.data.fieldList.map((inputField, index) => {
                        if(inputField.view === 1){
                            this.setState({
                                viewPermission: true
                            })
                        }
                        if((inputField.update === 1 || inputField.updateApproval === 1) && inputField.view === 1){
                            this.setState({
                                editPermission: true
                            })
                        }
                    })
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
            });
    }

    refreshData() {
        let empId = '';
        if (this.props.editId) {
            empId = this.props.editId;
        }
        else {
            empId = localStorage.getItem("employeeId")
        }
        const apiUrl = config.API_URL + '/employee/view/' + empId;
        //console.log('Employee data url', apiUrl)
        var bearer = 'Bearer ' + localStorage.getItem("userData");
        axios.get(apiUrl, { headers: { Authorization: bearer } })
            .then((r) => {
                console.log("Api result", r);
                this.setState({ item: r.data });
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }

    componentDidUpdate(prevProps, prevState) {
        //          Object.entries(this.props).forEach(([key, val]) =>
        //        prevProps[key] !== val && console.log(`Prop '${key}' changed`)
        //         );
        //        if (this.state) {
        //          Object.entries(this.state).forEach(([key, val]) =>
        //            prevState[key] !== val && console.log(`State '${key}' changed`)
        //          );
        //        }
        //fetchData();
    }

    handleChange = (event) => {
        console.log('Select Change');
        const name = event.target.name;
        const value = event.target.value;
        console.log('Textarea name', name)
        console.log('Textarea value', value)
        this.setState({
            form: {
                ...this.state.form, [name]: value
            }
        })
    }

    onChange = (name, date) => {
        // console.log(name,date,config.INPUT_DATE_FORMAT);
        this.setState({
            form: {
                ...this.state.form, [name]: (date) ? Moment(new Date(date)).format(config.INPUT_DATE_FORMAT) : ''
            }
        })
    }

    handleSubmit = (event) => {
        // console.log('Form Data',this.state.form);
        let datas = this.state.form;
        // console.log('Form Data',datas);
        // datas.birthDate = this.state.birthDate;
        event.preventDefault();
        let empId = '';
        if (this.props.editId) {
            empId = this.props.editId;
        }
        else {
            empId = localStorage.getItem("employeeId")
        }
        datas.empId = empId;
        const apiUrl = config.API_URL + '/employee/edit/personal/' + empId;
        var bearer = 'Bearer ' + this.state.token;
        if (Object.keys(datas).length >= 1) {
            var bearer = 'Bearer ' + this.state.token;
            const headers = {
                "Authorization": bearer,
                "Content-Type": "application/json"
            }

            // console.log('headers => ', headers);
            axios.post(apiUrl, datas, { headers: headers })
                .then(res => {
                    this.refreshData();
                    toast.success(res.data.message);
                    setTimeout(function () {
                        toast.dismiss()
                    }, 2000)
                    this.setState({ show: true })
                    console.log('POST response', res);
                })
            // this.setState({ show: true, response: 'success' });
        } else {
            this.setState({ show: true });
        }
    }

    handleEdit = () => { this.setState({ show: false }) };
    handleCencil = () => { this.setState({ show: true }) };
    getPositions() {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/common/positions/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                //console.log('Positions Response', r);
                if (r.status == 200) {
                    var arrTen = [];
                    for (var k = 0; k < r.data.Positions.length; k++) {
                        arrTen.push(<option key={r.data.Positions[k].id} value={r.data.Positions[k].id}> {r.data.Positions[k].positionName} </option>);
                    }
                    this.setState({ positions: arrTen });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }

    getGrades() {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/common/grades/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                //console.log('EmpType Response', r);
                if (r.status == 200) {
                    var arrTen = [];
                    var arrGrades = [];
                    for (var k = 0; k < r.data.Grades.length; k++) {
                        arrGrades.push(<option key={r.data.Grades[k].id} value={r.data.Grades[k].grade}> {r.data.Grades[k].displayName} </option>);
                        arrGrades[r.data.Grades[k].grade] = r.data.Grades[k].id;
                    }
                    //console.log('EmpType',arrTen);
                    this.setState({ grade : arrGrades, gradeIds : r.data.idsArr  });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }
    getLocations() {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/common/locations/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                //console.log('Location Response', r);
                if (r.status == 200) {
                    var arrTen = [];
                    var locations1 = [];
                    for (var k = 0; k < r.data.Locations.length; k++) {
                        arrTen.push(<option key={r.data.Locations[k].locationId} value={r.data.Locations[k].locationId}> {r.data.Locations[k].locationName} </option>);
                        locations1[r.data.Locations[k].locationName] = r.data.Locations[k].locationId;
                    }
                    this.setState({ locations: arrTen, locations1: locations1 });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }

    getEmpType() {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/common/employmentType/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                //console.log('EmpType Response', r);
                if (r.status == 200) {
                    var arrTen = [];
                    var arrEmpType = [];
                    for (var k = 0; k < r.data.EmploymentType.length; k++) {
                        arrTen.push(<option key={r.data.EmploymentType[k].id} value={r.data.EmploymentType[k].id}> {r.data.EmploymentType[k].empType} </option>);
                        arrEmpType[r.data.EmploymentType[k].empType] = r.data.EmploymentType[k].id;
                    }
                    //console.log('EmpType',arrTen);
                    this.setState({ empType: arrTen, arrEmpType: arrEmpType });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }
    getManagers() {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/organization/managers/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                //console.log('EmpType Response', r);
                if (r.status == 200) {
                    var arrTen = [];
                    for (var k = 0; k < r.data.managers.count; k++) {
                            if(this.props.editId){
                                if(r.data.managers.rows[k].id != this.props.editId){
                                        arrTen.push(<option key={r.data.managers.rows[k].id} selected={this.state.data ? (this.state.data.supervisorId == r.data.managers.rows[k].id ? 'selected' : '') : ''} value={r.data.managers.rows[k].id}> {r.data.managers.rows[k].firstname} {r.data.managers.rows[k].lastname} {r.data.managers.rows[k].position ? "("+r.data.managers.rows[k].position+")" : '' }</option>);
                                }
                            }
                            else{
                                if(r.data.managers.rows[k].id != localStorage.getItem("employee")){
                                        arrTen.push(<option key={r.data.managers.rows[k].id} selected={this.state.data ? (this.state.data.supervisorId == r.data.managers.rows[k].id ? 'selected' : '') : ''} value={r.data.managers.rows[k].id}> {r.data.managers.rows[k].firstname} {r.data.managers.rows[k].lastname} {r.data.managers.rows[k].position ? "("+r.data.managers.rows[k].position+")" : '' }</option>);
                                }
                            }
                      }
                    //console.log('EmpType',arrTen);
                    this.setState({ managers: arrTen });
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
                            if(r.data.managers.rows[k].id != localStorage.getItem("employeeId")){
                                arrTen.push(<option key={r.data.managers.rows[k].id} value={r.data.managers.rows[k].id}> {r.data.managers.rows[k].firstname} {r.data.managers.rows[k].lastname} "(" {r.data.managers.rows[k].hrms_position.position} ")"</option>);
                            }
                    }
                    this.setState({ hrManager: arrTen });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }
    getAccessRoles() {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/common/accessRoles/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                //     console.log('Positions Response', r);
                if (r.status == 200) {
                    let accessRoles = r.data.accessRoles.map((item, key) =>
                        <option key={item.id} value={item.id} selected={this.state.currRole == item.id ? 'selected' : ''}>{item.roleName}</option>
                    );
                    this.setState({ accessRole: accessRoles, roleIds: r.data.idsArr });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }
    getDepartments() {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/common/departments/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                console.log('department Response', r);
                if (r.status == 200) {
                    var arrTen = [];
                    for (var k = 0; k < r.data.Departments.length; k++) {
                        arrTen.push(<option key={r.data.Departments[k].id} value={r.data.Departments[k].id}> {r.data.Departments[k].displayName} </option>);
                    }
                    this.setState({ departments: arrTen });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }
    getGender() {
        var arrTen = [];

        Object.keys(this.state.gender).map((obj_index, arr_index) => {
            //console.log('gender',obj_index,arr_index)
            arrTen.push(<option key={arr_index} value={obj_index}> {this.state.gender[obj_index]} </option>);
        })
        //console.log('gender',arrTen);
        this.setState({ gender_option: arrTen });
    }
    getStatus() {
        var arrTen = [];

        Object.keys(this.state.status).map((obj_index, arr_index) => {
            //console.log('gender',obj_index,arr_index)
            arrTen.push(<option key={arr_index} value={obj_index}> {this.state.status[obj_index]} </option>);
        })
        //console.log('gender',arrTen);
        this.setState({ status_option: arrTen });
    }
    render() {
        const { item } = this.state;

        if (item) {
            let inputFields = [];
            if (this.state.basicFields && this.state.basicFields.length > 0) {
                inputFields = this.state.basicFields;
            }
            // var employmentType = (item.personal && item.personal.employmentType) ? item.personal.employmentType : '';
            // var workLocation = item.personal.workLocation ? item.personal.workLocation : '';
            // item.personal.employmentType = this.state.arrEmpType[employmentType] ? this.state.arrEmpType[employmentType] : employmentType;
            // item.personal.workLocation = this.state.locations1[workLocation] ? this.state.locations1[workLocation] : workLocation
            if (this.state.item && item.personal) {
                inputFields.map((inputField, index) => {
                    if (item.personal[inputField.fieldName] == 0 && inputField.fieldName !== 'status') {
                        item.personal[inputField.fieldName] = '';
                    }

                    if (inputField.fieldType === 'date') {
                        item.personal['alias-' + inputField.fieldName] = item.personal[inputField.fieldName] ? Moment(item.personal[inputField.fieldName]).format(config.DATE_FORMAT) : '';
                    }

                    if (inputField.fieldName === 'workLocation') {
                        item.personal['alias-' + inputField.fieldName] = item.personal['locationName'];
                    }
                    if (inputField.fieldName === 'positionId') {
                        item.personal['alias-' + inputField.fieldName] = item.personal['position'];
                    }
                    if (inputField.fieldName === 'deptId') {
                        item.personal['alias-' + inputField.fieldName] = item.personal['department'];
                    }
                    if (inputField.fieldName === 'supervisorId') {
                        item.personal['alias-' + inputField.fieldName] = item.personal.supervisorId == 0 ? '' : item.personal.reportingManager;
                    }
                    if (inputField.fieldName === 'employmentType') {
                        item.personal['alias-' + inputField.fieldName] = item.personal.empType;
                    }
                    if (inputField.fieldName === 'accessRole') {
                        item.personal['alias-' + inputField.fieldName] = item.personal.roleName;
                    }
                    if (inputField.fieldName === 'attendanceManager') {
                        item.personal['alias-' + inputField.fieldName] = item.personal.attendanceManager == 0 ? '' : item.personal.attManager;
                    }
                    if (inputField.fieldName === 'hrManager') {
                        item.personal['alias-' + inputField.fieldName] = item.personal.hrManager == 0 ? '' : item.personal.hrName;
                    }
                    if (inputField.fieldName === 'status') {
                        item.personal['alias-' + inputField.fieldName] = item.personal.status == 1 ? 'Active' : 'Inactive';
                    }
                });
                // console.log('Data Item Render after Update', this.state.item);
            }
            return (
                <div>
                    <ToastContainer className="right" position="top-right"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnVisibilityChange
                        draggable
                        pauseOnHover />
                    <div className="col-md-12 mx-auto">
                        <Form onSubmit={this.handleSubmit}>
                            {this.state.show ? (
                                <>
                                    <div className="card d-block p-xl-3 p-2 h-100 shadow-sm">
                                    {this.state.editPermission ? (<a onClick={this.handleEdit} className="card-edit-btn">
                                            <i className="icon-pencil icons align-middle mr-1"></i>
                                        </a>) : ''}
                                        <div className="row pl-3 pr-3">

                                            {inputFields ? (
                                                <div className="my-4">
                                                    <h6>Employment Information </h6>
                                                    {this.state.viewPermission ? (
                                                    <div className="row mt-4  pr-3">
                                                        <div className="col-lg-12">

                                                            <ul className="myinfoListing">
                                                                {inputFields.map((inputField, index) => {
                                                                    if (inputField.view === 0) {
                                                                        var hideLabel = 'hide';
                                                                    }
                                                                    else {
                                                                        var hideLabel = '';
                                                                    }
                                                                    if (item.personal) {
                                                                        return <li className={hideLabel}>
                                                                            <label>{inputField.fieldTitle}</label>
                                                                            <span>{item.personal['alias-' + inputField.fieldName] ? item.personal['alias-' + inputField.fieldName] : item.personal[inputField.fieldName]}</span>
                                                                        </li>
                                                                    }
                                                                    else {
                                                                        return <li className={hideLabel}>
                                                                            <label>{inputField.fieldTitle}</label>
                                                                            <span></span>
                                                                        </li>
                                                                    }
                                                                })}

                                                            </ul>
                                                            </div>
                                                        </div>) : (
                                                            <div className="row mt-4 pr-3">
                                                                <div className="col-lg-12">
                                                                    <h2>You do not have the permission to view this information.</h2>
                                                                </div>
                                                            </div>
                                                        )}
                                                    
                                                </div>
                                            ) : <DataLoading />}

                                        </div>
                                    </div>

                                </>
                            ) : (
                                    <>
                                        <div className="card d-block p-xl-3 p-2  h-100 shadow-sm">
                                            <h6>Employment Information </h6>
                                            <div className="row mt-4 edit-basicinfo">
                                                <div className="col-sm-12 pl-3 pr-3">
                                                    <FormComponent menuId="11" item={item.personal} handleChange={this.handleChange} dateChange={this.onChange} positionId={this.state.positions} workLocation={this.state.locations} supervisorId={this.state.managers} attendanceManager={this.state.managers} accessRole={this.state.accessRole} hrManager={this.state.hrManager} employmentType={this.state.empType} grade={this.state.grade} deptId={this.state.departments} gender={this.state.gender_option} status={this.state.status_option}></FormComponent>
                                                </div>
                                            </div>
                                            {/* <Button variant="primary" type="submit" >
                                        Apply
                                    </Button> */}
                                        </div>


                                        <div className="form-group row pt-5 edit-basicinfo">
                                            <div className="col-lg-12 text-center">
                                                <input type="reset" className="btn btn-outline-primary mr-2" onClick={this.handleCencil} value="Cancel" />
                                                <input type="submit" className="btn btn-primary" value="Save" />
                                            </div>
                                        </div>
                                    </>
                                )}
                        </Form>
                    </div>
                </div>
            )
        }
        return (
            <div className="col-md-12 mx-auto py-2">
                <div className="card d-block p-xl-3 p-2  h-100 shadow-sm">
                    <DataLoading></DataLoading>
                </div>
            </div>

        );
    }
}

const mapStateToProps = state => ({
    item: state.datas.item
});

export default connect(mapStateToProps, { fetchData, editData })(EmploymentInfo);

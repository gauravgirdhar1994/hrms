import React, { Component } from 'react';
import { Modal, Button, Card, Table } from "react-bootstrap"
import axios from 'axios';
import Moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import config from '../../config/config';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { MdVisibility } from 'react-icons/md';
import AccessTabsComponent from '../Settings/AccessTabsComponent';
import { TablePagination } from 'react-pagination-table';
import SeeDashboard from './SeeDashboard'
import MenuAccess from './MenuAccess'
const BEARER_TOKEN = localStorage.getItem("userData");

class UserManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: '',
            data: [],
            form: [],
            showAccess: true,
            showRoles: [],
            employeeCount: '',
            currEmployee: '',
            currRole: '',
            token: localStorage.getItem("userData"),
            orgId: localStorage.getItem("orgId"),
            dashboardMenu: [],
            forOther: 0,
            menuList: [],
            selectedMenu: []
        }
        this.getDashboardFields = this.getDashboardFields.bind(this);
        this.handForOther = this.handForOther.bind(this);
    }

    componentDidMount() {
        this.refreshData(this.state.currRole);
        this.getDashboardFields(this.state.currRole);
        this.getMenuField(this.state.currRole);
    }

    refreshData = (roleId = '') => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        let apiUrl = '';
        if (roleId === '') {
            apiUrl = config.API_URL + '/employee/access/list/' + this.state.orgId + "/0";
        }
        else {
            apiUrl = config.API_URL + '/employee/access/list/' + this.state.orgId + "/0?role=" + roleId;
        }
        axios.get(apiUrl, { headers: { Authorization: bearer } })
            .then(r => {
                console.log('Api result', r);
                this.setState({ employees: r.data.employees.rows, employeeCount: r.data.employees.count, roles: r.data.accessRoles.rows, fieldTabs: r.data.fieldTabs.rows, fields: r.data.fields })
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

    handForOther = (value) => {

        this.setState({ forOther: value });


    }

    changeView = () => {
        this.setState({ 'showAccess': !this.state.showAccess })
    };

    changeRole = (event) => {
        this.setState({ 'currRole': event.target.value }, this.refreshData(event.target.value))
        this.getDashboardFields(event.target.value);
        this.getMenuField(event.target.value);
    };

    showRoles = (name, value) => {

        this.setState({
            showRoles: {
                ...this.state.showRoles, [name]: !this.state.showRoles[name]
            },
            currEmployee: name
        })
    }

    assignRole = (event) => {
        const assignData = {};
        assignData.orgId = this.state.orgId;
        assignData.empId = this.state.currEmployee;
        assignData.roleId = event.target.value;

        const apiUrl = config.API_URL + '/employee/changeRole';
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        // console.log('headers => ', headers);
        axios.post(apiUrl, assignData, { headers: headers })
            .then(res => {
                this.setState({
                    showRoles: {
                        ...this.state.showRoles, [this.state.currEmployee]: !this.state.showRoles[this.state.currEmployee]
                    }
                })
                this.refreshData();
                console.log('POST response', res);
            })


    }
    getDashboardFields(role_id) {
        const bearer = 'bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/employee/access/list/' + this.state.orgId + '/13?role=' + role_id, { headers: { Authorization: bearer } })
            .then(r => {
                if (r.status == 200 && r.data.success == true) {
                    this.setState({ dashboardMenu: r.data.fields.rows })
                }
            })
    }
    getMenuField(role_id) {
        const bearer = 'bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/employee/menu/list/' + this.state.orgId + '?role=' + role_id, { headers: { Authorization: bearer } })
            .then(r => {
                if (r.status == 200 && r.data.success == true) {
                    this.setState({ menuList: r.data.Menu, selectedMenu: r.data.menuId })
                }
            })
    }
    render() {
        let roles = '';
        let accessRoles = '';
        const { employeeCount } = this.state;
        const { employees } = this.state;
        const Header = ["Employee Name", "Access Role"];
        console.log("for other dsadasdasd", this.state.forOther);

        if (this.state.roles) {
            roles = this.state.roles.map((item, key) =>
                <option key={item.id} value={item.id} selected={this.state.currRole == item.id ? 'selected' : ''}>{item.roleName}</option>
            );
            accessRoles = this.state.roles.map((item, key) =>
                <option key={item.id} value={item.id} selected={this.state.currRole == item.id ? 'selected' : ''}>{item.roleName}</option>
            );
        }

        return (
            <>
                <ToastContainer />
                {this.state.showAccess ? (
                    <Card className="card d-block p-1 mb-4 shadow-sm">
                        <span className="anchor" id="formComplex"></span>
                        <div className="my-4" />

                        <div div className="d-flex justify-content">
                            <div className="col-lg-9">
                                <p className="font-16">Give your Employees Acess Levels to determine their access to information in HRMS</p>
                            </div>

                            <div className="col-lg-3">
                                <select className="form-control custom-select" onChange={this.changeRole}>
                                    <option value="">--Select--</option>
                                    {roles}
                                </select>
                            </div>
                        </div>

                        <div div className="d-flex justify-content">
                            <div className="col-lg-12">
                                {/* <a href="/employees/add" class="btn btn-primary mr-4">Add Employee</a> */}
                                <input onClick={this.changeView} type="button" disabled={this.state.currRole === '' ? 'disabled' : ''} class="btn btn-secondary" value="Access Level Setting" />
                            </div>
                        </div>

                        <div className=" mt-4  pr-3">
                            <div className="col-lg-12">
                                {employeeCount > 0 ? (
                                    <Table className="leaveTable listview">
                                        <thead>
                                            <tr>
                                                <th>Employee Name</th>
                                                <th>Access Level</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.employees.map((data, key) => {
                                                if (data !== null) {
                                                    return (
                                                        <tr key={key}>
                                                            <td>{data.empName}</td>
                                                            <td>{this.state.showRoles[data.empId] ? (<select className="form-control custom-select" onChange={this.assignRole}><option value="">--Select--</option>{accessRoles}</select>) : (<span onClick={this.showRoles.bind(this, data.empId)}>{data.role}</span>)}</td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                            }
                                        </tbody>
                                    </Table>
                                ) : 'No Data Found'}
                            </div>
                        </div>
                    </Card>

                ) : (
                    <Card className="card d-block p-1 mb-4 shadow-sm">
                        <a onClick={this.changeView} className="pl-3 pt-3" style={{ cursor: "pointer" }}><i className="mr-4"><FaArrowLeft /></i>{this.state.currRole ? this.state.currRole == 2 ? "HR Access Level" : this.state.currRole == 3 ? "Employee Access Level" : this.state.currRole == 5 ? "Super Admin Access Level" : '' : ''}</a>
                        <div className="my-4" />

                        <div div className="d-flex justify-content">
                            <div className="col-lg-12">
                                {/* <p className="font-16">this access level allows employees in the US to view, edit (with or without approval) some of their own information</p> */}
                            </div>
                        </div>

                        <div div className="d-flex justify-content">
                            <div className="col-lg-12">
                                <ul id="tabsJustified" className="nav nav-tabs nav-fill bg-magenta rounded-sm">
                                    <li className="nav-item">
                                        <a href="#seeAbout" data-target="#seeAbout" data-toggle="tab" className="nav-link active" onClick={() => this.handForOther(0)}>See About Themeselves
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#seeAbout" data-target="#seeAbout" data-toggle="tab" className="nav-link" onClick={() => this.handForOther(1)}>See About Others
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#seeDashboard" data-target="#seeDashboard" data-toggle="tab" className="nav-link">See on Dashboard</a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#seeMenuItem" data-target="#seeMenuItem" data-toggle="tab" className="nav-link">See Menu Access</a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div id="tabsJustifiedContent" className="tab-content py-1">
                            <div className="tab-pane fade active show" id="seeAbout">
                                <div className=" mt-4  pr-3">
                                    <div className="pl-4 pr-4">

                                        <AccessTabsComponent roleId={this.state.currRole} forOther={this.state.forOther} activeTab={1} />

                                    </div>
                                </div>
                            </div>
                            {/* <div className="tab-pane fade" id="seeAboutOther">
                                    <div className=" mt-4  pr-3">
                                        <div className="pl-4 pr-4">
                                           
                                                <AccessTabsComponent roleId={this.state.currRole} forOther={this.state.forOther}/>
                                           
                                        </div>
                                    </div>
                                </div> */}

                            {/*<div className="tab-pane fade" id="seeAboutOther">
                                    <div className=" mt-4  pr-3">
                                        <div className="pl-4 pr-4">
                                           
                                                <AccessTabsComponent roleId={this.state.currRole} forOther="1"/>
                                           
                                        </div>
                                    </div>
                </div>*/}


                            <div className="tab-pane fade " id="seeDashboard">
                                <SeeDashboard dashboardMenu={this.state.dashboardMenu} getDashboardFields={this.getDashboardFields} currRole={this.state.currRole} />
                            </div>
                            <div className="tab-pane fade" id="seeMenuItem">
                                <MenuAccess masterMenu={this.state.menuList} seletedMenu={this.state.selectedMenu} currRole={this.state.currRole} />
                            </div>
                        </div>
                    </Card>
                )}

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Custom Access Level</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <fieldset>
                            <label htmlFor="instituteName" className="mb-0">Select Employee</label>
                            <div className="row mb-3">
                                <div className="col-lg-12">
                                    <select value="" className="form-control custom-select">
                                        <option value="">Ashles Admas</option>
                                        <option value="">Ashles Admas</option>
                                        <option value="">Ashles Admas</option>
                                        <option value="">Ashles Admas</option>
                                        <option value="">Ashles Admas</option>
                                        <option value="">Ashles Admas</option>
                                    </select>

                                </div>
                            </div>

                        </fieldset>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.props.onHide}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.props.onHide}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>

            </>
        )
    }

}

export default UserManagement;
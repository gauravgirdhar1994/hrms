import React, { Component } from 'react';
import { Modal, Button, Card, Table, Form } from "react-bootstrap";
import axios from 'axios';
import Moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import config from '../../config/config';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ConfirmPrompt from './ConfirmPrompt';
const BEARER_TOKEN = localStorage.getItem("userData");
class Department extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: '',
            editShow: false,
            data: [],
            editData: [],
            formDate: [],
            form: [],
            managers: [],
            editDept: '',
            deptEmployees: '',
            token: localStorage.getItem("userData"),
            orgId: localStorage.getItem("orgId"),
            role: localStorage.getItem("roleSlug"),
            fields: [{ "departmentName": "Department Name", "displayName": "Display Name", "status": "Status" }],
            validateFields: {},
            confirmPromptShow : false
        }
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData = () => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/departments/list?orgId=' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                console.log('Api result', r);
                this.setState({ data: r.data.departments.rows })
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
                    this.setState({ managers: arrTen });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }

    handleShow = () => {
        console.log('close button')
        this.setState({ show: true, validateFields: {} })
    };

    handleClose = () => {
        console.log('close button')
        this.setState({ show: false, validateFields: {} })
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
                }
            })
        
    }

    handleEditChange = (event) => {
        // console.log('Input event',this.props.item);   
        const name = event.target.name;
        const value = event.target.value;
        console.log('Status Inactive', event.target.name, event.target.value);
        if (event.target.name === 'status' && event.target.value == 0 && this.state.deptEmployees > 0) {
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

    handleSubmit = (event) => {
        console.log('Form Data', this.state.form);
        let datas = this.state.form;
        datas.orgId = this.state.orgId;
        console.log('Form Data', datas);
        const apiUrl = config.API_URL + '/department/add';
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        // console.log('headers => ', headers);
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
        // console.log('Form Data',datas);
        const apiUrl = config.API_URL + '/department/edit/' + this.state.editDept;
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
        axios.get(config.API_URL + '/department/view/' + id, { headers: { Authorization: bearer } })
            .then(r => {

                this.setState({ editData: r.data.Departments.rows[0] })
                this.setState({ editShow: true, editDept: id, deptEmployees: count })

                console.log('Api result', this.state.editData);
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }

    render() {
        const departments = this.state.data;
        // console.log('Departments',departments);

        return (
            <>
                <ToastContainer />
                <Card className="card d-block p-1 mb-4 shadow-sm">
                    <div className="d-flex justify-content-between  mb-4 ">
                        <h4 className="font-16 pl-3">Department</h4>

                    </div>

                    <Table className="leaveTable listview">
                        <thead>
                            <tr>
                                <th>Department ID</th>
                                <th>Department</th>
                                <th>Sub Department</th>
                                <th>Display Name</th>
                                {this.state.role != 'broker-admin' && this.state.role != 'broker-primary' ? (<>
                                    <th>Employee count</th>
                                    {/* <th>HR Manager</th> */}
                                    <th>Status</th>
                                    
                                </>) : ''}
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map((data, key) => {
                                if (data !== null) {
                                    return (
                                        <tr key={key}>
                                            <td>{data.id}</td>
                                            <td>{data.departmentName}</td>
                                            <td>{data.subDepartmentName.length > 0 ? data.subDepartmentName.map((subData, key) => {
                                                return (

                                                    <span>{subData.departmentName}</span>

                                                )
                                            }) : ''}</td>
                                            {data.subDepartmentName.length > 0 ? (
                                                <td>{data.subDepartmentName.map((subData, key) => {
                                                    return (

                                                        <span>{subData.displayName}</span>

                                                    )

                                                })}
                                                </td>)
                                                : (<><td>{data.displayName}</td></>)}
                                            {this.state.role != 'broker-admin' && this.state.role != 'broker-primary' ? (<>
                                                {data.subDepartmentName.length > 0 ? (
                                                    <td>{data.subDepartmentName.map((subData, key) => {
                                                        return (

                                                            <span>{subData.empCount}</span>

                                                        )

                                                    })}
                                                    </td>)
                                                    : (<><td>{data.empCount}</td></>)}
                                                {/* {data.subDepartmentName.length > 0 ? (
                                                    <td>{data.subDepartmentName.map((subData, key) => {
                                                        return (

                                                            <span>{subData.deptManager}</span>

                                                        )

                                                    })}
                                                    </td>)
                                                    : (<><td>{data.deptManager}</td></>)} */}

                                                <td>{data.subDepartmentName.length > 0 ? data.subDepartmentName.map((subData, key) => {
                                                    return (

                                                        <span>{subData.status == 1 ? 'Active' : 'Inactive'}</span>

                                                    )
                                                }) : data.status == 1 ? 'Active' : 'Inactive'}</td>
                                                
                                            </>) : ''}
                                            {data.subDepartmentName.length > 0 ? (
                                                    <td>{data.subDepartmentName.map((subData, key) => {
                                                        return (

                                                            <span onClick={this.editPopup.bind(this, subData.id, data.empCount)}><i><FaEdit /></i> </span>

                                                        )
                                                    })}</td>) : (<><td><span onClick={this.editPopup.bind(this, data.id, data.empCount)}><i><FaEdit /></i> </span></td></>)}
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

                {this.state.confirmPromptShow ? <ConfirmPrompt empNo={this.state.deptEmployees} type="department" confirmClose={this.confirmClose} confirmPromptShow={this.state.confirmPromptShow}></ConfirmPrompt> : ''}

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Department</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleSubmit(this.state) }}>
                            <fieldset>
                                <label htmlFor="departmentName" className="mb-0">Department</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="departmentName" ref="departmentName" name="departmentName" placeholder="Ex: Accounts, IT, HR" className="form-control" required="" onChange={this.handleChange} />
                                        <div class="errMsg">{this.state.validateFields['departmentName']}</div>
                                    </div>
                                </div>
                                <label htmlFor="parentDeptId" className="mb-0">Parent Department</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select name="parentDeptId" className="form-control custom-select" onChange={this.handleChange}>
                                            <option selected disabled>Select Parent Department</option>
                                            {this.state.data.map((data, key) => {
                                                if (data !== null) {
                                                    return (
                                                        <option key={data.id} value={data.id}>{data.departmentName}</option>
                                                    )
                                                }
                                            })
                                            }
                                        </select>
                                    </div>
                                </div>
                                <label htmlFor="displayName" className="mb-0">Display Name</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="displayName" name="displayName" ref="displayName" onChange={this.handleChange} placeholder="Ex: Accounts" className="form-control" required="" />
                                        <div class="errMsg">{this.state.validateFields['displayName']}</div>
                                    </div>
                                </div>
                                {/* {this.state.role != 'broker-admin' && this.state.role != 'broker-primary' ? (
                                    <>
                                <label htmlFor="displayName" className="mb-0">HR Mangaer</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select name="manager" className="form-control custom-select" onChange={this.handleChange}>
                                            <option selected disabled>Select Manager</option>
                                            {this.state.managers}
                                        </select>
                                    </div>
                                </div></>) : ''} */}
                                <label htmlFor="grade" className="mb-0">Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select name="status" ref="status" className="form-control custom-select" onChange={this.handleChange}>
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
                        <Modal.Title>Edit Department</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleEditSubmit(this.state) }}>
                            <fieldset>
                                <label htmlFor="departmentName" className="mb-0">Department</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="departmentName" name="departmentName" placeholder="Ex: Service Internataional pvt ltd" value={this.state.editData.departmentName} className="form-control" required="" onChange={this.handleEditChange} />
                                    </div>
                                </div>
                                <label htmlFor="parentDeptId" className="mb-0">Parent Department</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select name="parentDeptId" className="form-control custom-select" onChange={this.handleEditChange}>
                                            <option selected disabled>Select Parent Department</option>
                                            {this.state.data.map((data, key) => {
                                                if (data !== null) {
                                                    return (
                                                        <option key={data.id} value={data.id} selected={this.state.editData.parentDeptId && this.state.editData.parentDeptId == data.id ? 'selected' : ''}>{data.departmentName}</option>
                                                    )
                                                }
                                            })
                                            }
                                        </select>
                                    </div>
                                </div>
                                {/* {this.state.role != 'broker-admin' && this.state.role != 'broker-primary' ? (
                                    <>
                                <label htmlFor="manager" className="mb-0">HR Mangaer</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select name="manager" className="form-control custom-select" onChange={this.handleEditChange}>
                                            <option selected disabled>Select Manager</option>
                                            {this.state.managers}
                                        </select>
                                    </div>
                                </div></>) : ''} */}
                                <label htmlFor="displayName" className="mb-0">Display Name</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="displayName" name="displayName" onChange={this.handleEditChange} placeholder="Ex: Accounts" value={this.state.editData.displayName} className="form-control" required="" />
                                    </div>
                                </div>
                                <label htmlFor="grade" className="mb-0">Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select name="status" value={this.state.editData.status} className="form-control custom-select" onChange={this.handleEditChange}>
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

export default Department;
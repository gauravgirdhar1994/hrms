import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { Modal, Button, Card, Table, Form } from "react-bootstrap"
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { FaEdit, FaTrash } from 'react-icons/fa';
import config from "../config/config";
const BEARER_TOKEN = localStorage.getItem("userData");
class AdminUser extends Component {
    constructor() {
        super();
        this.state = {
            show: '',
            editShow: false,
            data: [],
            editData: [],
            formDate: [],
            form: [],
            editPosition: '',
            token: localStorage.getItem("userData"),
            orgId: localStorage.getItem("orgId"),
            role: localStorage.getItem("roleSlug"),
            fields: [{ "positionName": "Designation Name", "displayName": "Display Name", "status": "Status" }],
            validateFields: {},
            division: ["Admin", "Operater"],
            desgEmployees: '',
            confirmPromptShow: false
        };

    }

    componentDidMount() {
        console.log('role', this.state.role)
        this.refreshData();
    }

    refreshData = () => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/employees/listAdminUser', { headers: { Authorization: bearer } })
            .then(r => {
                console.log('Api result', r);
                this.setState({ data: r.data.employees.rows })
                console.log(this.state.data)
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    };


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

    editPopup = async (id) => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        await axios.get(config.API_URL + '/employee/view/' + id, { headers: { Authorization: bearer } })
            .then(r => {

                this.setState({ editData: r.data.personal })
                this.setState({ editShow: true, editPosition: id })

                console.log('Api EDIT result', this.state.editData);
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    };
    handleEditChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            editData: {
                ...this.state.editData, [name]: value
            }
        })
    };

    handleEditSubmit = (event) => {

        let datas = this.state.editData;
        datas.orgId = this.state.orgId;
        console.log('Form Data', datas);
        const apiUrl = config.API_URL + '/employees/update/adminUser';
        var bearer = 'Bearer ' + BEARER_TOKEN;
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

    handleChange = (event) => {
        // console.log('Input event',this.props.item);   
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            form: {
                ...this.state.form, [name]: value
            },
        })
    }

    handleSubmit = (event) => {
        let datas = this.state.form;
        datas.orgId = this.state.orgId;
        console.log('Form Data', datas);
        const apiUrl = config.API_URL + '/employees/createAdminUser';
        var bearer = 'Bearer ' + BEARER_TOKEN;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        if (!!datas.email) {
            axios.post(apiUrl, datas, { headers: headers })
                .then(res => {

                    if (res.status == 200) {
                        toast.success(res.data.message);
                        this.refreshData();
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
        } else {
            toast.error('Data not correct');
            setTimeout(function () {
                toast.dismiss()
            }, 2000)
        }
    }

    render() {

        return (
            <>
                <ToastContainer />
                <Card className="card d-block p-2 mb-4 shadow-sm">
                    <div className="d-flex justify-content-between  mb-4 ">
                        <h4 className="font-16 pl-3">Admin Users List</h4>

                    </div>

                    <Table className="leaveTable">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>User Name</th>
                                <th>User Email</th>
                                <th>Division</th>
                                {/* {this.state.role != 'broker-admin' && this.state.role != 'broker-primary' ? (<>
                                    <th>Employee count</th>


                                </>) : ''} */}
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map((data, key) => {
                                if (data !== null) {
                                    return (
                                        <tr key={key}>
                                            <td>{data.id}</td>
                                            <td>{data.firstname + ' ' + data.lastname}</td>
                                            <td>{data.email}</td>
                                            <td>{data.division === 'NULL' ? '' : data.division}</td>
                                            {/* {this.state.role != 'broker-admin' && this.state.role != 'broker-primary' ? (<>
                                                <td>{data.empCount}</td>


                                            </>) : ''} */}
                                            <td>{data.status == 1 ? 'Active' : 'Inactive'}</td>
                                            <td><span onClick={this.editPopup.bind(this, data.id)}><i><FaEdit /></i> </span></td>
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


                {/* {this.state.confirmPromptShow ? <ConfirmPrompt empNo={this.state.desgEmployees} type="position" confirmClose={this.confirmClose} confirmPromptShow={this.state.confirmPromptShow}></ConfirmPrompt> : ''} */}

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Admin User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleSubmit(this.state) }}>
                            <fieldset>
                                <div className="row mb-3">
                                    <div className="col-lg-6">
                                        <label htmlFor="firstName" className="mb-0">First Name</label>
                                        <input type="text" id="firstName" onChange={this.handleChange} name="firstName" className="form-control" required="" />

                                    </div>
                                    <div className="col-lg-6">
                                        <label htmlFor="lastName" className="mb-0">Last Name</label>
                                        <input type="text" id="lastName" onChange={this.handleChange} name="lastName" className="form-control" required="" />
                                    </div>
                                </div>
                                <label htmlFor="email" className="mb-0">Email</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="email" onChange={this.handleChange} name="email" className="form-control" required="" />
                                    </div>
                                </div>
                                <label htmlFor="email" className="mb-0">Phone Number</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="phoneNumber" onChange={this.handleChange} name="phoneNumber" className="form-control" required="" />
                                    </div>
                                </div>
                                <label htmlFor="division" className="mb-0">Division</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        {/* <input type="text" id="division" onChange={this.handleChange} name="division" className="form-control" required=""></input> */}
                                        <select name="division" className="form-control custom-select" onChange={this.handleChange} required="">
                                            <option selected value=''>Select Status</option>
                                            {
                                                this.state.division.map((data, key) => {
                                                    if (data !== null) {
                                                        return (
                                                            <option key={data} value={data}>{data}</option>
                                                        )
                                                    }
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                                <label htmlFor="status" className="mb-0">Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select name="status" className="form-control custom-select" onChange={this.handleChange}>
                                            <option selected value=''>Select Status</option>
                                            <option value="1" selected={this.state.editData.status && this.state.editData.status == 1 ? 'selected' : ''}>Active</option>
                                            <option value="0" selected={this.state.editData.status && this.state.editData.status == 0 ? 'selected' : ''}>Inactive</option>
                                        </select>
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
                        <Modal.Title>Edit Admin Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleEditSubmit(this.state) }}>
                            <fieldset>
                                <div className="row mb-3">
                                    <div className="col-lg-6">
                                        <label htmlFor="firstName" className="mb-0">First Name</label>
                                        <input type="text" id="firstName" onChange={this.handleEditChange} name="firstName" value={this.state.editData.firstname} className="form-control" required="" ></input>
                                    </div>
                                    <div className="col-lg-6">
                                        <label htmlFor="lastName" className="mb-0">Last Name</label>
                                        <input type="text" id="lastName" onChange={this.handleEditChange} name="lastName" value={this.state.editData.lastname} className="form-control" required="" ></input>
                                    </div>
                                </div>
                                {/* <label htmlFor="email" className="mb-0">Email</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="email" onChange={this.handleEditChange} name="email" className="form-control" value={this.state.editData.email} required="" />
                                    </div>
                                </div> */}
                                <label htmlFor="division" className="mb-0">Division</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="division" onChange={this.handleEditChange} name="division" className="form-control" value={this.state.editData.division} required=""></input>
                                    </div>
                                </div>
                                <label htmlFor="status" className="mb-0">Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select name="status" className="form-control custom-select" value={this.state.editData.status} onChange={this.handleEditChange}>
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
        );
    }
}

export default AdminUser;

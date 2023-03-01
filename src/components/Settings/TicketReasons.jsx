import React, { Component } from 'react';
import { Modal, Button, Card, Table, Form } from "react-bootstrap";
import axios from 'axios';
import Moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import config from '../../config/config';
import { FaEdit, FaTrash } from 'react-icons/fa';
const BEARER_TOKEN = localStorage.getItem("userData");
class TicketReasons extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: '',
            data: [],
            ticketTypeList: [],
            form: [],
            editType: '',
            editData: [],
            token: localStorage.getItem("userData"),
            orgId: localStorage.getItem("orgId"),
            fields: [{ 'reason': 'Reason', 'status': 'Status' }],
            validateFields: {}
        }
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData = () => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/setting/ticket-reasons/list', { headers: { Authorization: bearer } })
            .then(r => {
                // console.log('Ticket status', r);
                this.setState({ data: r.data.ticketReasonsList })
            })
            .catch((error) => {
                console.error(error);
            });
    }

    editPopup = (id) => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/setting/ticket-reason/view/' + id, { headers: { Authorization: bearer } })
            .then(r => {

                this.setState({ editData: r.data.ticketReasonDetail })
                this.setState({ editShow: true, editType: id })

                console.log('Api result', this.state.editData);
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }
    handleShow = () => {
        console.log('close button')
        this.setState({ form: [], show: true })
    };

    handleClose = () => {
        console.log('close button')
        this.setState({ show: false })
    };
    handleEditClose = () => {
        console.log('close button')
        this.setState({ editShow: false })
    };
    handleEditChange = (event) => {
        // console.log('Input event',this.props.item);   
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            editData: {
                ...this.state.editData, [name]: value
            }
        })
    }
    handleEditSubmit = (event) => {
        event.preventDefault();
        let datas = this.state.editData;
        datas.orgId = this.state.orgId;
        console.log('Form Data',datas);
        const apiUrl = config.API_URL + '/setting/ticket-reasons/update';
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }
        if (this.validateEditForm()) {
            // console.log('headers => ', headers);
            axios.put(apiUrl, datas, { headers: headers })
                .then(res => {
                    console.log('res ===> ', res);
                    if (res.data.success) {
                        this.refreshData();
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
                })
        }
    }
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
        // console.log('Form Data', datas);
        const apiUrl = config.API_URL + '/setting/ticket-reasons/add';
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        // console.log('headers => ', headers);
        if (this.validateForm()) {
            axios.post(apiUrl, datas, { headers: headers })
                .then(res => {
                    if (res.data.success) {
                        // const toasts = "Updated Successfully"
                        toast.success(res.data.message);
                        setTimeout(function () {
                            toast.dismiss()
                        }, 2000)
                        this.setState({ show: false });
                        this.refreshData();
                    } else {
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
            console.log('this.state.form', this.state.form, fields);
            for (var key in fields) {
                if (
                    this.state.form[key] == "" ||
                    typeof this.state.form[key] == "undefined"
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
    validateEditForm() {
        let fields = this.state.fields[0];
        let validations = {};
        let isFormValid = true;
        // console.log('this.state.form', this.state.editData, fields);
        for (var key in fields) {
            if (
                this.state.editData[key] === "" ||
                typeof this.state.editData[key] == "undefined"
            ) {
                validations[key] = "Please enter " + fields[key];
                isFormValid = false;
            }
        }
        console.log('validations ============> ', validations);
        this.setState({ validateFields: validations });
        return isFormValid;
    }

    render() {

        // console.log('this.state.default_status =====> ', this.state.form.default_status);
        // console.log('this.state.editData.display_in_list ==> ', this.state.editData.display_in_list, (this.state.editData && this.state.editData.display_in_list === 0))
        return (
            <>

                <Card className="card d-block p-1 mb-4 shadow-sm">
                    <div className="d-flex justify-content-between  mb-4 ">
                        <h4 className="font-16 pl-3">Exit Reason</h4>
                    </div>
                    {this.state.data ? (
                        <Table className="leaveTable">
                            <thead>
                                <tr>
                                    {/* <th>ID</th> */}
                                    <th>Exit Reason</th>
                                    {/* <th>Ticket Type</th> */}
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>

                                {this.state.data.map((data, key) => {
                                    if (data !== null) {
                                        return (
                                            <tr key={key}>
                                                {/* <td>{data.id}</td> */}
                                                <td>{data.reason}</td>
                                                {/* <td>{data.ticket_type !== 0 ? data.ticket_type_name : 'Default'}</td> */}
                                                <td>{data.status == 1 ? 'Active' : 'Inactive'}</td>
                                                <td>

                                                    <span onClick={this.editPopup.bind(this, data.id)}>
                                                        <i><FaEdit /></i>
                                                    </span>


                                                </td>
                                            </tr>
                                        )
                                    }
                                })
                                }

                            </tbody>
                        </Table>
                    ) : <Table>
                            <tbody>No Data Found</tbody>
                        </Table>}

                </Card>

                <div className="form-group row pt-2 ">
                    <div className="col-lg-12 text-left">
                        <span className="addNewButton" onClick={this.handleShow}> <i className="icon-plus icons"></i> Add New</span>
                    </div>
                </div>


                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Reason</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleSubmit(this.state) }}>
                            <fieldset>
                                <label htmlFor="status_name" className="mb-0">Exit Reason</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="reason" onChange={this.handleChange} name="reason" placeholder="Ex: Exit Reason" className="form-control" required="" />
                                        <div class="errMsg">{this.state.validateFields['reason']}</div>
                                    </div>
                                </div>

                                <label htmlFor="active" className="mb-0">Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select className="form-control custom-select" onChange={this.handleChange} name="status">
                                            <option selected disabled>Select Status</option> <option value="1">Active</option>
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
                        <Modal.Title>Edit Reason</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleEditSubmit}>
                            <fieldset>

                                <label htmlFor="status_name" className="mb-0">Exit Reason</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="reason" onChange={this.handleEditChange} name="reason" placeholder="Ex: Reason" value={this.state.editData.reason} className="form-control" required="" />
                                        <div class="errMsg">{this.state.validateFields['reason']}</div>
                                    </div>
                                </div>



                                <label htmlFor="grade" className="mb-0">Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select name="status" className="form-control custom-select" onChange={this.handleEditChange}>
                                            <option value="">Select Status</option> <option value="1" selected={this.state.editData && this.state.editData.status === 1 ? 'selected' : ''}>Active</option>
                                            <option value="0" selected={this.state.editData && this.state.editData.status === 0 ? 'selected' : ''}>Inactive</option>
                                        </select>
                                        <div class="errMsg">{this.state.validateFields['status']}</div>
                                    </div>
                                </div>
                            </fieldset>
                            <Button variant="outline-primary mr-2" onClick={this.handleEditClose}>
                                Close
                            </Button>
                            <Button type="submit" variant="primary" onClick={this.handleEditSubmit}>
                                Save
                            </Button>
                        </Form>

                    </Modal.Body>
                </Modal>

            </>


        )
    }

}

export default TicketReasons;
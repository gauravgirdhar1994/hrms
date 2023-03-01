import React, { Component } from 'react';
import { Modal, Button, Card, Table, Form } from "react-bootstrap";
import axios from 'axios';
import Moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import config from '../../config/config';
import { FaEdit, FaTrash } from 'react-icons/fa';
const BEARER_TOKEN = localStorage.getItem("userData");
class TicketType extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: '',
            data: [],
            form: [],
            editType: '',
            editData: [],
            token: localStorage.getItem("userData"),
            orgId: localStorage.getItem("orgId"),
            priorityList: [
                {id: 1, text: 'Low'},
                {id: 2, text: 'Medium'},
                {id: 3, text: 'High'},
                {id: 4, text: 'Critical'}
            ],
            fields: [{ "ticket_type_name": "Ticket Type", "due_days": "Due Days", "ticket_type_status": "Status", "priority" : "Priority", "display_in_list" : "Display in List" }],
            validateFields: {},
        }
    }

    componentDidMount() {
        this.refreshData();
    }

    validateForm() {
        let fields = this.state.fields[0];
        let validations = {};
        let isFormValid = true;
        if (fields) {
        //     console.log('Payroll Fields', fields);
            for (var key in fields) {
                if (
                        this.state.form[key] == "" ||
                        typeof this.state.form[key] == "undefined" ||
                        this.state.form[key] == null
                ) {
                    validations[key] = fields[key];
                    isFormValid = false;
                }
            }
            console.log('validations ============> ', validations);
            this.setState({ validateFields: validations });
            return isFormValid;
        }
    }

    refreshData = () => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/setting/ticket-type/list', { headers: { Authorization: bearer } })
            .then(r => {
                console.log('Ticket Type', r);
                this.setState({ data: r.data.ticketTypes })
            })
            .catch((error) => {
                console.error(error);
            });
    }
    editPopup = (id) => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/setting/ticket-type/view/' + id, { headers: { Authorization: bearer } })
            .then(r => {

                this.setState({ editData: r.data.ticketTypesDetails })
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
    handleEditChange = (event) => {
        console.log(event.target.name, event.target.value);   
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            editData: {
                ...this.state.editData, [name]: value
            }
        })
    }
    handleEditSubmit = (event) => {

        let datas = this.state.editData;
        datas.orgId = this.state.orgId;
        console.log('Form Data',datas);
        const apiUrl = config.API_URL + '/setting/ticket-type/update';
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        // console.log('headers => ', headers);
        axios.put(apiUrl, datas, { headers: headers })
            .then(res => {
                this.refreshData();
                console.log('res ===> ', res);
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
            validateFields: {
                ...this.state.validateFields, [name]: ""
            }
        })
    }

    handleSubmit = (event) => {
        console.log('Form Data', this.state.form);
        let datas = this.state.form;
        datas.orgId = this.state.orgId;
        console.log('Form Data', datas);
        const apiUrl = config.API_URL + '/setting/ticket-type/add';
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
    getPriority(priority){
        let priorityText = "";
        if(priority==1){
            priorityText = "Low";
        } else if(priority==2){
            priorityText = "Medium";
        } else if(priority==3){
            priorityText = "High";
        } else if(priority==4){
            priorityText = "Critical";
        }
        return priorityText;
    }
    render() {

        // console.log('this.state.editData =====> ', this.state.editData);
        // console.log('this.state.editData.display_in_list ==> ', this.state.editData.display_in_list, (this.state.editData && this.state.editData.display_in_list === 0))
        return (
            <>

                <Card className="card d-block p-1 mb-4 shadow-sm">
                    <div className="d-flex justify-content-between  mb-4 ">
                        <h4 className="font-16 pl-3">Ticket Type</h4>
                    </div>
                    <Table className="leaveTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ticket Type</th>
                                {/* <th>Slug</th> */}
                                <th>Due Days</th>
                                <th>Priority</th>
                                <th>Display in list</th>
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
                                            <td>{data.ticket_type_name}</td>
                                            {/* <td>{data.ticket_slug_name}</td> */}
                                            <td>{data.due_days}</td>
                                            <td>{this.getPriority(data.priority)}</td>
                                            <td>{data.display_in_list == 1 ? 'Yes' : 'No'}</td>
                                            <td>{data.ticket_type_status == 1 ? 'Active' : 'Inactive'}</td>
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
                </Card>

                <div className="form-group row pt-2 ">
                    <div className="col-lg-12 text-left">
                        <span className="addNewButton" onClick={this.handleShow}> <i className="icon-plus icons"></i> Add New</span>
                    </div>
                </div>


                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Ticket Type</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleSubmit(this.state) }}>
                            <fieldset>
                                <label htmlFor="ticket_type_name" className="mb-0">Ticket Type</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" ref="ticket_type_name" id="ticket_type_name" onChange={this.handleChange} name="ticket_type_name" placeholder="Ex: Ticket Type" className="form-control" required="" />
                                        <div class="errMsg">{this.state.validateFields['ticket_type_name'] ? 'Please enter the '+this.state.validateFields['ticket_type_name'] : ''}</div>
                                    </div>
                                </div>

                                {/* <label htmlFor="ticket_slug_name" className="mb-0">Slug Name</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="ticket_slug_name" onChange={this.handleChange} name="ticket_slug_name" placeholder="Slug Name" className="form-control" required="" />
                                    </div>
                                </div> */}


                                <label htmlFor="due_days" className="mb-0">Due Days</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="due_days" ref="due_days" onChange={this.handleChange} name="due_days" placeholder="Due Days" className="form-control" required="" />
                                    </div>
                                    <div class="errMsg">{this.state.validateFields['due_days'] ? 'Please enter the '+this.state.validateFields['due_days'] : ''}</div>
                                </div>

                                <label htmlFor="due_days" className="mb-0">Priority</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select className="form-control" ref="priority" onChange={this.handleChange} name="priority">
                                            <option selected>Select Priority</option>
                                            {
                                                this.state.priorityList.map(priority => {
                                                    return <option value={priority.id}>{priority.text}</option>
                                                })
                                            }
                                        </select>
                                        <div class="errMsg">{this.state.validateFields['priority'] ? 'Please select the '+this.state.validateFields['priority'] : ''}</div>
                                    </div>
                                </div>

                                <label htmlFor="display_in_list" className="mb-0">Display in List</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select className="form-control custom-select" ref="display_in_list" onChange={this.handleChange} name="display_in_list">
                                            <option selected>Select Display in List</option> 
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                        <div class="errMsg">{this.state.validateFields['display_in_list'] ? 'Please select the '+this.state.validateFields['display_in_list'] : ''}</div>
                                    </div>
                                </div>

                                <label htmlFor="ticket_type_status" className="mb-0">Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select className="form-control custom-select" ref="status" onChange={this.handleChange} name="ticket_type_status">
                                            <option selected >Select Status</option> <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                        <div class="errMsg">{this.state.validateFields['ticket_type_status'] ? 'Please select the '+this.state.validateFields['ticket_type_status'] : ''}</div>
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
                        <Modal.Title>Edit Ticket Type</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleEditSubmit(this.state) }}>
                            <fieldset>

                                <label htmlFor="ticket_type_name" className="mb-0">Ticket Type</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="ticket_type_name" onChange={this.handleEditChange} name="ticket_type_name" placeholder="Ex: Employee Type" value={this.state.editData.ticket_type_name} className="form-control" required="" />
                                    </div>
                                </div>
                                {/* <label htmlFor="ticket_slug_name" className="mb-0">Slug Name</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="ticket_slug_name" onChange={this.handleEditChange} name="ticket_slug_name" placeholder="Display Name" value={this.state.editData.ticket_slug_name} className="form-control" disabled={true} />
                                    </div>
                                </div> */}
                                <label htmlFor="due_days" className="mb-0">Due Days</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="due_days" onChange={this.handleEditChange} name="due_days" placeholder="Display Name" value={this.state.editData.due_days} className="form-control" />
                                    </div>
                                </div>
                                <label htmlFor="due_days" className="mb-0">Priority</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select className="form-control" onChange={this.handleEditChange} name="priority">
                                            <option disabled>Select Priority</option>
                                            {
                                                this.state.priorityList.map(priority => {
                                                    return <option value={priority.id} selected={this.state.editData.priority==priority.id?true:false}>{priority.text}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                                <label htmlFor="grade" className="mb-0">Display in List</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select name="display_in_list" className="form-control custom-select" onChange={this.handleEditChange}>
                                            <option value="">Select Status</option> <option value="1" selected={this.state.editData.display_in_list && this.state.editData.display_in_list === 1 ? 'selected' : ''}>Yes</option>
                                            <option value="0" selected={this.state.editData && this.state.editData.display_in_list === 0 ? 'selected' : ''}>No</option>
                                        </select>
                                    </div>
                                </div>

                                <label htmlFor="grade" className="mb-0">Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select name="ticket_type_status" className="form-control custom-select" onChange={this.handleEditChange}>
                                            <option value="">Select Status</option> <option value="1" selected={this.state.editData.ticket_type_status && this.state.editData.ticket_type_status === 1 ? 'selected' : ''}>Active</option>
                                            <option value="0" selected={this.state.editData && this.state.editData.ticket_type_status === 0 ? 'selected' : ''}>Inactive</option>
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

export default TicketType;
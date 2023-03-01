import React, { Component } from 'react';
import { Modal, Button, Card, Table, Form } from "react-bootstrap";
import axios from 'axios';
import Moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import config from '../../config/config';
import { FaEdit, FaTrash } from 'react-icons/fa';
const BEARER_TOKEN = localStorage.getItem("userData");
class TicketStatus extends Component {
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
            orgId: localStorage.getItem("orgId")
        }
    }

    componentDidMount() {
        this.refreshData();
        this.getTicketTypeList();
    }

    refreshData = () => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/setting/ticket-status/list', { headers: { Authorization: bearer } })
            .then(r => {
                console.log('Ticket status', r);
                this.setState({ data: r.data.ticketStatusList })
            })
            .catch((error) => {
                console.error(error);
            });
    }
    getTicketTypeList = () => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/setting/ticket-status/ticket-type-list', { headers: { Authorization: bearer } })
            .then(r => {
                console.log('Ticket status', r);
                this.setState({ ticketTypeList: r.data.ticketTypeList })
            })
            .catch((error) => {
                console.error(error);
            });
    }
    editPopup = (id) => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/setting/ticket-status/view/' + id, { headers: { Authorization: bearer } })
            .then(r => {

                this.setState({ editData: r.data.ticketStatusDetail })
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

        let datas = this.state.editData;
        datas.orgId = this.state.orgId;
        // console.log('Form Data',datas);
        const apiUrl = config.API_URL + '/setting/ticket-status/update';
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

        if (name == "default_status") {
            this.setState({
                form: {
                    ...this.state.form,
                    ticket_type: event.target.checked?0:''
                }
            })
        } else {
            this.setState({
                form: {
                    ...this.state.form, [name]: value
                }
            })
        }
    }

    handleSubmit = (event) => {
        console.log('Form Data', this.state.form);
        let datas = this.state.form;
        datas.orgId = this.state.orgId;
        console.log('Form Data', datas);
        const apiUrl = config.API_URL + '/setting/ticket-status/add';
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        // console.log('headers => ', headers);
        axios.post(apiUrl, datas, { headers: headers })
            .then(res => {
                if (res.data.success) {
                    // const toasts = "Updated Successfully"
                    /*   toast.success(res.data.message);
                      setTimeout(function () {
                          toast.dismiss()
                      }, 2000)
                      this.setState({ show: false }) */
                    this.refreshData();
                } else {
                    alert(res.data.message);
                }
            })
    }
    render() {

        console.log('this.state.default_status =====> ', this.state.form.default_status);
        // console.log('this.state.editData.display_in_list ==> ', this.state.editData.display_in_list, (this.state.editData && this.state.editData.display_in_list === 0))
        return (
            <>

                <Card className="card d-block p-1 mb-4 shadow-sm">
                    <div className="d-flex justify-content-between  mb-4 ">
                        <h4 className="font-16 pl-3">Ticket Status</h4>
                    </div>
                    <Table className="leaveTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ticket Status</th>
                                <th>Ticket Type</th>
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
                                            <td>{data.status_name}</td>
                                            <td>{data.ticket_type !== 0 ? data.ticket_type_name : 'Default'}</td>
                                            <td>{data.active == 1 ? 'Active' : 'Inactive'}</td>
                                            <td>
                                                {data.ticket_type !== 0 ?
                                                    (
                                                        <span onClick={this.editPopup.bind(this, data.id)}>
                                                            <i><FaEdit /></i>
                                                        </span>
                                                    ) : (
                                                        ''
                                                    )
                                                }
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
                        <Modal.Title>Add Status</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleSubmit(this.state) }}>
                            <fieldset>
                                <label htmlFor="status_name" className="mb-0">Ticket Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="status_name" onChange={this.handleChange} name="status_name" placeholder="Ex: Ticket Status" className="form-control" required="" />
                                    </div>
                                </div>

                                <label htmlFor="ticket_type" className="mb-0">Ticket Type</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select name="ticket_type" className="form-control custom-select" onChange={this.handleChange} disabled={this.state.form.ticket_type === 0 ? true : false}>
                                            <option value="" selected={this.state.form.ticket_type === 0 ? true : false}>Select Ticket Type</option>
                                            {this.state.ticketTypeList && this.state.ticketTypeList.map(ticket_type => {
                                                return (
                                                    <option value={ticket_type.id}>{ticket_type.ticket_type_name}</option>
                                                )
                                            }
                                            )}
                                        </select>
                                    </div>
                                </div>


                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <label htmlFor="default_status" className="mb-0">Make Default</label>
                                        <input 
                                            type="checkbox" 
                                            id="default_status" 
                                            onChange={this.handleChange} 
                                            name="default_status" 
                                            style={{marginLeft: "10px"}}/>
                                    </div>
                                </div>

                                <label htmlFor="active" className="mb-0">Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select className="form-control custom-select" onChange={this.handleChange} name="active">
                                            <option selected disabled>Select Status</option> <option value="1">Active</option>
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
                <Modal show={this.state.editShow} onHide={this.handleEditClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Status</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleEditSubmit(this.state) }}>
                            <fieldset>

                                <label htmlFor="status_name" className="mb-0">Ticket Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="status_name" onChange={this.handleEditChange} name="status_name" placeholder="Ex: Status" value={this.state.editData.status_name} className="form-control" required="" />
                                    </div>
                                </div>

                                <label htmlFor="ticket_slug_name" className="mb-0">Ticket Type</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select name="ticket_type" className="form-control custom-select" onChange={this.handleEditChange} disabled={this.state.editData.ticket_type === 0 ? true : false}>
                                            <option value="" selected={this.state.editData.ticket_type === "" ? true : false}>Select Ticket Type</option>
                                            {this.state.ticketTypeList && this.state.ticketTypeList.map(ticket_type => {
                                                return (
                                                    <option value={ticket_type.id} selected={this.state.editData.ticket_type === ticket_type.id ? true : false}>{ticket_type.ticket_type_name}</option>
                                                )
                                            }
                                            )}
                                        </select>
                                    </div>
                                </div>

                                {/* <label htmlFor="due_days" className="mb-0">Make Default</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="checkbox" id="due_days" onChange={this.handleEditChange} name="due_days" placeholder="Display Name" className="form-control" checked={this.state.editData.ticket_type===0?true:false}/>
                                    </div>
                                </div> */}

                                <label htmlFor="grade" className="mb-0">Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select name="active" className="form-control custom-select" onChange={this.handleEditChange}>
                                            <option value="">Select Status</option> <option value="1" selected={this.state.editData.active && this.state.editData.active === 1 ? 'selected' : ''}>Active</option>
                                            <option value="0" selected={this.state.editData && this.state.editData.active === 0 ? 'selected' : ''}>Inactive</option>
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

export default TicketStatus;
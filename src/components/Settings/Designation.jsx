import React, { Component } from 'react';
import { Modal, Button, Card, Table, Form } from "react-bootstrap"
import axios from 'axios';
import Moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import config from '../../config/config';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ConfirmPrompt from './ConfirmPrompt';
const BEARER_TOKEN = localStorage.getItem("userData");

class Designation extends Component {
    constructor(props) {
        super(props);

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
            desgEmployees: '',
            confirmPromptShow : false
        }
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData = () => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/designations/list?orgId='+this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                console.log('Api result', r);
                this.setState({ data: r.data.positions.rows })
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
        console.log('Status Inactive', event.target.name, event.target.value, this.state.desgEmployees);
        if (event.target.name === 'status' && event.target.value == 0 && this.state.desgEmployees > 0) {
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
        datas.orgId=this.state.orgId;
        // console.log('Form Data',datas);
        const apiUrl = config.API_URL+'/designation/edit/'+this.state.editPosition;
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        // console.log('headers => ', headers);
        axios.post(apiUrl, datas, {headers: headers})
            .then(res => {
                this.refreshData();
                if(res.status == 200){
                    toast.success(res.data.message);
                    setTimeout(function(){
                        toast.dismiss()
                    },2000)
                    this.setState({editShow: false})
                }
                else{
                    toast.error(res.data.message);
                    setTimeout(function(){
                        toast.dismiss()
                    },2000)
                }
                // console.log('POST response',res);
        })
    }
    
    editPopup = (id, count) => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL+'/designations/view/'+id, { headers: { Authorization: bearer }})
        .then(r => {

            this.setState({editData : r.data.Positions.rows[0]})
            this.setState({editShow: true, editPosition: id, desgEmployees: count})
            
            console.log('Api result',this.state.editData);
        })
        .catch((error) => {
            console.log("API ERR: ");
            console.error(error);
            // res.json({ error: error });
        });
    }

    handleSubmit = (event) => {
        console.log('Form Data', this.state.form);
        let datas = this.state.form;
        datas.orgId=this.state.orgId;
        console.log('Form Data', datas);
        const apiUrl = config.API_URL + '/designation/add';
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

    render() {


        return (
            <>
            <ToastContainer/>
                <Card className="card d-block p-1 mb-4 shadow-sm">
                    <div className="d-flex justify-content-between  mb-4 ">
                        <h4 className="font-16 pl-3">Designation</h4>

                    </div>

                    <Table className="leaveTable">
                        <thead>
                            <tr>
                                 <th>Designation ID</th>
                                <th>Designation Name</th>
                                <th>Display Name</th>
                                <th>Description</th>
                                {this.state.role != 'broker-admin' && this.state.role != 'broker-primary' ? ( <>
                                <th>Employee count</th>
                                
                                
                                </>) : ''}
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
                                            <td>{data.positionName}</td>
                                            <td>{data.displayName}</td>
                                            <td>{data.description === 'NULL' ? '' : data.description}</td>
                                            {this.state.role != 'broker-admin' && this.state.role != 'broker-primary' ? ( <>
                                            <td>{data.empCount}</td>
                                            

                                            </>) : ''}
                                            <td>{data.status == 1 ? 'Active' : 'Inactive'}</td>
                                            <td><span onClick={this.editPopup.bind(this, data.id, data.empCount)}><i><FaEdit /></i> </span></td>
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


                {this.state.confirmPromptShow ? <ConfirmPrompt empNo={this.state.desgEmployees} type="position" confirmClose={this.confirmClose} confirmPromptShow={this.state.confirmPromptShow}></ConfirmPrompt> : ''}

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Designation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleSubmit(this.state) }}>
                            <fieldset>
                                <label htmlFor="positionName" className="mb-0">Designation</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="positionName" onChange={this.handleChange} name="positionName" ref="positionName" className="form-control" required="" />
                                        <div class="errMsg">{this.state.validateFields['positionName']}</div>
                                    </div>
                                </div>
                                <label htmlFor="displayName" className="mb-0">Display Name</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="displayName" onChange={this.handleChange} name="displayName" ref="displayName" className="form-control" required="" />
                                        <div class="errMsg">{this.state.validateFields['displayName']}</div>
                                    </div>
                                </div>
                                <label htmlFor="description" className="mb-0">Description</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <textarea type="text" id="description" onChange={this.handleChange} name="description" className="form-control" required=""></textarea>
                                    </div>
                                </div>
                                <label htmlFor="status" className="mb-0">Status</label>
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
                        <Modal.Title>Edit Designation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleEditSubmit(this.state) }}>
                            <fieldset>
                                <label htmlFor="positionName" className="mb-0">Designation</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="positionName" onChange={this.handleEditChange} name="positionName" value={this.state.editData.positionName} className="form-control" required="" />
                                    </div>
                                </div>
                                <label htmlFor="displayName" className="mb-0">Display Name</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="displayName" onChange={this.handleEditChange} name="displayName" className="form-control" value={this.state.editData.displayName} required="" />
                                    </div>
                                </div>
                                <label htmlFor="description" className="mb-0">Description</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <textarea type="text" id="description" onChange={this.handleEditChange} name="description" className="form-control" value={this.state.editData.description} required=""></textarea>
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
        )
    }

}

export default Designation;
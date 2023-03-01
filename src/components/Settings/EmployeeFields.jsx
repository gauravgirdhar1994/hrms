import React, { Component } from 'react';
import { Modal, Button, Card, Table, Form } from "react-bootstrap";
import axios from 'axios';
import Moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import config from '../../config/config';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { MdVisibility } from 'react-icons/md';
import { TablePagination } from 'react-pagination-table';
const BEARER_TOKEN = localStorage.getItem("userData");
class EmployeeFields extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: '',
            data: [],
            form: [],
            roles: [],
            fieldTabs: [],
            fields: [],
            editShow: false,
            editData: [],
            fieldtypes: ['text','select','date','textarea','phone-text','number-format'],
                
            token: localStorage.getItem("userData")
        }
    }

    componentDidMount() {
        console.log('Refresh Data');
        this.refreshData(0);
    }

    editField = (id) => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/fields/0?fieldId='+id, { headers: { Authorization: bearer } })
            .then(r => {
                // console.log('Api result', r);
                this.setState({
                    editData: r.data.fields.rows[0], 
                    editShow: true,
                    editField: id     
                })
                console.log('Employee Fields', this.state.data)
            })
            .catch((error) => {
                console.log("API ERR: ",error);
                console.error(error);
                // res.json({ error: error });
            });
    }

    refreshData = (accessId = 0) => {
        console.log('Refresh Data');
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/fields/'+accessId, { headers: { Authorization: bearer } })
            .then(r => {
                // console.log('Api result', r);
                this.setState({
                    fields: r.data.fields.rows,    
                    fieldTabs: r.data.fieldTabs.rows,    
                    roles: r.data.accessRoles.rows,    
                })
                console.log('Employee Fields', this.state.data)
            })
            .catch((error) => {
                console.log("API ERR: ",error);
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
    
    filterRoles = (event) => {
        const value = event.target.value;
        this.refreshData(value);
    } 

    handleEditClose = () => {
        console.log('close button')
        this.setState({ editShow: false })
    };

    handleEditSubmit = (event) => {
        // console.log('Form Data', this.state.form);
        let datas = this.state.editData;
        
        const apiUrl = config.API_URL + '/fields/edit/'+this.state.editField;
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
        setTimeout(function(){
            toast.dismiss()
        },2000)
        this.setState({ show: false })
    }

    render() {
        console.log('Roles',this.state.roles);
        const roles = this.state.roles.map((item, key) =>
            <option key={item.id} value={item.id}>{item.roleName}</option>
        );
        const fields = this.state.fields;
        const fieldsCount = fields.length;

        const fieldTabs = this.state.fieldTabs.map((item, key) =>
            <option key={item.id} selected={this.state.editData.menuId == item.id ? 'selected' : ''} value={item.id}>{item.name}</option>
        );

        const fieldTypes = this.state.fieldtypes.map((item, key) =>
            <option key={key} selected={this.state.editData.fieldType === item ? 'selected' : ''} value={item}>{item}</option>
        );

        fields.map((field,key)=>{
            fields[key].action = <a onClick={()=> this.editField(field.id)} className="btn btn-primary">Edit</a>
        });
        // console.log('length',fieldsCount)
        const Header = ["Field Name", "Field Type", "Section", "Actions"];
        return (
            <>
                <Card className="card d-block p-1 mb-4 shadow-sm">
                    <span className="anchor" id="formComplex"></span>
                    <div className="my-4" />                   

                    <div div className="d-flex justify-content">
                        <div className="col-lg-9">
                        <p className="font-16"></p>
                        </div>

                        {/* <div className="col-lg-3">
                        <select className="form-control custom-select" onChange={this.filterRoles}>
                        <option selected value="0">All</option>
                        {roles}
                        </select>
                        </div> */}
                    </div>

                    <div className=" mt-4  pr-3">
                        <div className="col-lg-12">
                        {fieldsCount > 0 ? (
                         <TablePagination
                            title=""
                            subTitle=""
                            headers={ Header }
                            data={ fields } 
                            columns="fieldTitle.fieldType.tabName.action"
                            perPageItemCount={ 10 }
                            totalCount={ fieldsCount }
                            paginationClassName="pagination-status"
                            className="react-pagination-table table-bordered"
                            arrayOption={ [["size", 'all', ' ']] }
                        /> 
                        ) : 'No Data Found'}    
                        
                    </div>
                </div>
                </Card>
                {this.state.editData ? (
                    <>
                    <Modal show={this.state.editShow} onHide={this.handleEditClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Field</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form onSubmit={event => {event.preventDefault(); this.handleEditSubmit(this.state)}}>
                        <fieldset>
                            <label htmlFor="fieldTitle" className="mb-0">Field Title</label>
                            <div className="row mb-3">
                                <div className="col-lg-12">
                                    <input type="text" id="fieldTitle" name="fieldTitle" value={this.state.editData.fieldTitle} className="form-control" required="" onChange={this.handleEditChange} />
                                </div>
                            </div>
                            
                            <label htmlFor="section" className="mb-0">Section</label>
                            <div className="row mb-3">
                                <div className="col-lg-12">
                                <select name="menuId" className="form-control custom-select" onChange={this.handleEditChange}>
                                        <option selected disabled>Select Section</option>
                                        {fieldTabs}
                                </select>
                                </div>
                            </div>
                            <label htmlFor="displayName" className="mb-0">Field Type</label>
                            <div className="row mb-3">
                            <div className="col-lg-12">
                                <select name="fieldType" className="form-control custom-select" onChange={this.handleEditChange}>
                                        <option selected disabled>Select Section</option>
                                        {fieldTypes}
                                </select>
                                </div>
                            </div>
                            <label htmlFor="displayName" className="mb-0">Field Position</label>
                            <div className="row mb-3">
                                <div className="col-lg-12">
                                    <input type="text" id="fieldPosition" name="fieldPosition" value={this.state.editData.fieldPosition} className="form-control" required="" onChange={this.handleEditChange} />
                                </div>
                            </div>
                            <label htmlFor="grade" className="mb-0">Required Field</label>
                            <div className="row mb-3">
                                <div className="col-lg-12">
                                    <select name="is_mandatory" className="form-control custom-select" onChange={this.handleEditChange}>
                                         <option selected value=''>Select Option</option> <option value="1" selected={this.state.editData && this.state.editData.is_mandatory == 1 ? 'selected' : ''}>Yes</option>
                                        <option value="0" selected={this.state.editData && this.state.editData.is_mandatory == 0 ? 'selected' : ''}>No</option>
                                    </select>
                                </div>
                            </div>
                            <label htmlFor="grade" className="mb-0">Status</label>
                            <div className="row mb-3">
                                <div className="col-lg-12">
                                    <select name="status" className="form-control custom-select" onChange={this.handleEditChange}>
                                         <option selected value=''>Select Status</option> <option value="1" selected={this.state.editData && this.state.editData.status == 1 ? 'selected' : ''}>Active</option>
                                        <option value="0" selected={this.state.editData && this.state.editData.status == 0 ? 'selected' : ''}>Inactive</option>
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
                ) : ''}
                
                <div className="row mb-3">
                                <div className="col-lg-12 text-center">
                                    <span className="addNewButton" > <i className="icon-plus icons"></i> Add New Field</span>
                                </div>
                            </div>
           
            </>
        )
    }
}

export default EmployeeFields;
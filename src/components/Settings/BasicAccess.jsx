import React, { Component, useState } from 'react';
import { Modal, Button, Card, Table, Form } from "react-bootstrap"
import axios from 'axios';
import Moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import TimePicker from 'react-time-picker';
import config from '../../config/config';
import { FaEdit, FaEye, FaEyeSlash, FaCheck, FaStar } from 'react-icons/fa';
import ReactTooltip from "react-tooltip";
const BEARER_TOKEN = localStorage.getItem("userData");

class BasicAccess extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: '',
            basicFieldCount: [],
            basicFields: [],
            contactFields: [],
            contactFieldsCount: [],
            employmentFields: [],
            dependentFields: [],
            employmentFieldsCount: [],
            dependentFieldsCount: [],
            showButtons: [],
            form: [],
            token: localStorage.getItem("userData"),
            orgId: localStorage.getItem("orgId"),
            place: "top",
            type: "dark",
            effect: "float",
            condition: false,
            currentTabValue:0
        }
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData = () => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        console.log(this.props);
        axios.get(config.API_URL + '/employee/access/list/' + this.state.orgId+"/3?role="+this.props.roleId+"&for_other="+this.props.forOther, { headers: { Authorization: bearer } })
            .then(r => {
                console.log('Api result', r);
                this.setState({ basicFields: r.data.fields.rows, basicFieldCount: r.data.fields.count })
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
            axios.get(config.API_URL + '/employee/access/list/' + this.state.orgId+"/7?role="+this.props.roleId+"&for_other="+this.props.forOther, { headers: { Authorization: bearer } })
            .then(r => {
                console.log('Api result', r);
                this.setState({ contactFields: r.data.fields.rows, contactFieldsCount: r.data.fields.count })
            
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
            axios.get(config.API_URL + '/employee/access/list/' + this.state.orgId+"/11?role="+this.props.roleId+"&for_other="+this.props.forOther, { headers: { Authorization: bearer } })
            .then(r => {
                console.log('Api result', r);
                this.setState({ employmentFields: r.data.fields.rows, employmentFieldsCount: r.data.fields.count,currentTabValue:this.props.forOther })
                 
            })
            
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });

            axios.get(config.API_URL + '/employee/access/list/' + this.state.orgId+"/15?role="+this.props.roleId+"&for_other="+this.props.forOther, { headers: { Authorization: bearer } })
            .then(r => {
                console.log('Api result', r);
                this.setState({ dependentFields: r.data.fields.rows, dependentFieldsCount: r.data.fields.count,currentTabValue:this.props.forOther })
                 
            })
            
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }
    
    showButtons = (name, value) => {
      
        this.setState({
            showButtons: {
                ...this.state.showButtons, [name]: !this.state.showButtons[name]
            }
        })
    }

    handleShow = () => {
        console.log('close button')
        this.setState({ show: true })
    };

    handleClose = () => {
        console.log('close button')
        this.setState({ show: false })
    };
    

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        console.log('Input event',name,value);   
        this.setState({
            form: {
                ...this.state.form, [name]: value
            }
        })
    }

    assignRole = (id,name,fieldName,value) => {
        console.log('Assign Role', id,name,fieldName);
        const assignData = {};
        assignData.orgId = this.state.orgId;
        assignData.fieldId = id;
        assignData.roleId = this.props.roleId;
        assignData.for_others = this.props.forOther;
        assignData.create = 0;
        assignData.delete = 0;
        
        if(name == 'update'){
            assignData.view = 1;
            assignData.update = 1;
            assignData.updateApproval = 0;
        } 
        if(name == 'view'){
            assignData.view = 1;
            assignData.update = 0;
            assignData.updateApproval = 0;
        } 
        if(name == 'approval'){
            assignData.view = 1;
            assignData.update = 1;
            assignData.updateApproval = 1;
        }
        if(name == 'hide'){
            assignData.view = 0;
            assignData.update = 0;
            assignData.updateApproval = 0;
        }
        if(name == 'required'){
            assignData.required = value;
        }
        
        const apiUrl = config.API_URL + '/setting/save-field-setting';
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        // console.log('headers => ', headers);
        axios.post(apiUrl, assignData, { headers: headers })
            .then(res => {
                this.setState({
                    showButtons: {
                        ...this.state.showButtons, [fieldName]: !this.state.showButtons[fieldName]
                    }
                })
                this.refreshData();
                console.log('POST response', res);
        })

         
    }

    render() {
        if(this.state.currentTabValue != this.props.forOther){
            this.refreshData();
        }
        
        console.log("basic Access state",this.state);
        const { place, type, effect } = this.state;
        
        return (
            <>
                <ToastContainer/>
                <Card className="card d-block p-1 mb-4 shadow-sm">
                    <div className="d-flex justify-content-between  mb-4 ">
                        <h4 className="font-16 pl-3">Basic Info</h4>

                    </div>

                    <Table className="leaveTable listview">
                        <thead>
                            <tr>
                                <th>Field Name</th>
                                <th>Access Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.basicFields.map((data, key) => {
                                if (data !== null) {
                                    return (
                                        <tr key={key}>
                                            <td>{data.fieldTitle} {data.required ? ( <i title="Required Field"><FaStar/></i> ) : ''}</td>
                                            <td><span onClick={this.showButtons.bind(this, data.fieldName)}>{data.editRights}</span> {this.state.showButtons[data.fieldName] ? ( <span className="pull-right"><i title="No Access" onClick={this.assignRole.bind(this, data.fieldId, 'hide', data.fieldName)}><FaEyeSlash /></i><i title="View Only" onClick={this.assignRole.bind(this, data.fieldId, 'view', data.fieldName)}><FaEye /></i> <i title="View and Update" onClick={this.assignRole.bind(this, data.fieldId, 'update', data.fieldName)}><FaEdit /></i><i title="Update after Approval" onClick={this.assignRole.bind(this, data.fieldId, 'approval', data.fieldName)}><FaCheck /></i><i title="Mark Required" onClick={this.assignRole.bind(this, data.fieldId, 'required', data.fieldName, !data.required)}><FaStar /></i></span> ) : ''}</td>
                                        </tr>
                                    )
                                }
                            })
                            }
                        </tbody>
                    </Table>
                    <ReactTooltip />
                </Card>
            
                <Card className="card d-block p-1 mb-4 shadow-sm">
                    <div className="d-flex justify-content-between  mb-4 ">
                        <h4 className="font-16 pl-3">Contact Info</h4>

                    </div>

                    <Table className="leaveTable">
                        <thead>
                            <tr>
                                <th>Field Name</th>
                                <th>Access Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.contactFields.map((data, key) => {
                                if (data !== null) {
                                    return (
                                        <tr key={key}>
                                            <td>{data.fieldTitle} {data.required ? ( <i title="Required Field"><FaStar/></i> ) : ''}</td>
                                            <td><span onClick={this.showButtons.bind(this, data.fieldName)}>{data.editRights}</span> {this.state.showButtons[data.fieldName] ? ( <span className="pull-right"><i title="No Access" onClick={this.assignRole.bind(this, data.fieldId, 'hide', data.fieldName)}><FaEyeSlash /></i><i title="View Only" onClick={this.assignRole.bind(this, data.fieldId, 'view', data.fieldName)}><FaEye /></i> <i title="View and Update" onClick={this.assignRole.bind(this, data.fieldId, 'update', data.fieldName)}><FaEdit /></i><i title="Update after Approval" onClick={this.assignRole.bind(this, data.fieldId, 'approval', data.fieldName)}><FaCheck /></i><i title="Mark Required" onClick={this.assignRole.bind(this, data.fieldId, 'required', data.fieldName, !data.required)}><FaStar /></i></span> ) : ''}</td>
                                        </tr>
                                    )
                                }
                            })
                            }
                        </tbody>
                    </Table>
                </Card>
                
                <Card className="card d-block p-1 mb-4 shadow-sm">
                    <div className="d-flex justify-content-between  mb-4 ">
                        <h4 className="font-16 pl-3">Employment Info</h4>

                    </div>

                    <Table className="leaveTable">
                        <thead>
                            <tr>
                                <th>Field Name</th>
                                <th>Access Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.employmentFields.map((data, key) => {
                                if (data !== null) {
                                    return (
                                        <tr key={key}>
                                            <td>{data.fieldTitle} {data.required ? ( <i title="Required Field"><FaStar/></i> ) : ''}</td>
                                            <td><span onClick={this.showButtons.bind(this, data.fieldName)}>{data.editRights}</span> {this.state.showButtons[data.fieldName] ? ( <span className="pull-right"><i title="No Access" onClick={this.assignRole.bind(this, data.fieldId, 'hide', data.fieldName)}><FaEyeSlash /></i><i title="View Only" onClick={this.assignRole.bind(this, data.fieldId, 'view', data.fieldName)}><FaEye /></i> <i title="View and Update" onClick={this.assignRole.bind(this, data.fieldId, 'update', data.fieldName)}><FaEdit /></i><i title="Update after Approval" onClick={this.assignRole.bind(this, data.fieldId, 'approval', data.fieldName)}><FaCheck /></i><i title="Mark Required" onClick={this.assignRole.bind(this, data.fieldId, 'required', data.fieldName, !data.required)}><FaStar /></i></span> ) : ''}</td>
                                        </tr>
                                    )
                                }
                            })
                            }
                        </tbody>
                    </Table>
                </Card>

                <Card className="card d-block p-1 mb-4 shadow-sm">
                    <div className="d-flex justify-content-between  mb-4 ">
                        <h4 className="font-16 pl-3">Dependent Info</h4>

                    </div>

                    <Table className="leaveTable">
                        <thead>
                            <tr>
                                <th>Field Name</th>
                                <th>Access Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.dependentFields.map((data, key) => {
                                if (data !== null) {
                                    return (
                                        <tr key={key}>
                                            <td>{data.fieldTitle} {data.required ? ( <i title="Required Field"><FaStar/></i> ) : ''}</td>
                                            <td><span onClick={this.showButtons.bind(this, data.fieldName)}>{data.editRights}</span> {this.state.showButtons[data.fieldName] ? ( <span className="pull-right"><i title="No Access" onClick={this.assignRole.bind(this, data.fieldId, 'hide', data.fieldName)}><FaEyeSlash /></i><i title="View Only" onClick={this.assignRole.bind(this, data.fieldId, 'view', data.fieldName)}><FaEye /></i> <i title="View and Update" onClick={this.assignRole.bind(this, data.fieldId, 'update', data.fieldName)}><FaEdit /></i><i title="Update after Approval" onClick={this.assignRole.bind(this, data.fieldId, 'approval', data.fieldName)}><FaCheck /></i><i title="Mark Required" onClick={this.assignRole.bind(this, data.fieldId, 'required', data.fieldName, !data.required)}><FaStar /></i></span> ) : ''}</td>
                                        </tr>
                                    )
                                }
                            })
                            }
                        </tbody>
                    </Table>
                </Card>

            </>
        )
    }

}

export default BasicAccess;
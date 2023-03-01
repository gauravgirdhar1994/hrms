import React, { Component } from 'react';
import { Modal, Button, Card, Table, Form } from"react-bootstrap";
import axios from 'axios';
import Moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import config from '../../config/config';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { MdVisibility } from 'react-icons/md';
import { TablePagination } from 'react-pagination-table';
const BEARER_TOKEN = localStorage.getItem("userData");

class Approvals extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: '',
            data: [],
            form: [],
            roles: [],
            fieldTabs: [],
            fields: [],
            selectShow: '', 
            approvalId: 1,
            role: 0,
            selectManager: '', 
            token: localStorage.getItem("userData")
        }
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData = (tabId = 1,roleId = 0) => {
        // console.log('Refresh Data');
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/approvals/managers/list/'+tabId+'/'+roleId, { headers: { Authorization: bearer } })
            .then(r => {
                this.setState({
                    managers: r.data.managers.rows,    
                    approvals: r.data.approvals.rows,
                    roles: r.data.accessRoles.rows,   
                    accessRole: r.data.accessRole,
                    showManagers: true,
                    selectShow: true
                })
            })
            .catch((error) => {
                console.log("API ERR:",error);
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
    
    assignManager = (event) => {
        console.log('Manager Form Data', event);
        let datas = {};
        datas.orgId=this.state.orgId;
        datas.status = 1;
        datas.empId = localStorage.getItem("employeeId");
        datas.managerId = event.target.value;
        datas.approvalId = this.state.approvalId;
        
        const apiUrl = config.API_URL + '/approvals/managers/add';
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
           "Authorization": bearer,
           "Content-Type":"application/json"
        }
        console.log('Form Data', datas);
        // console.log('headers => ', headers);
        axios.post(apiUrl, datas, { headers: headers })
            .then(res => {
                this.refreshData(this.state.approvalId, this.state.role);
                console.log('POST response', res);
        })

        const toasts ="Updated Successfully"
        toast.success('Updated Successfully');
        setTimeout(function(){
            toast.dismiss()
        },2000)
        this.setState({ show: false })
    }
    

    selectShow = () => {
        this.setState({
            selectShow:!this.state.selectShow
        })
    }
    
    changeTab = (id) => {
        console.log('Tab change event',id)
        this.setState({
            approvalId: id
        }, () => {
            this.refreshData(this.state.approvalId, this.state.role)
        })
    }
    
    showManagers = (event) => {
        console.log('Show Managers');
        this.refreshData(1,event.target.value);
        this.setState({
            showManagers: true
        })
    }
    
    render() {
       
        const roles = this.state.roles.map((item, key) =>
            <option key={item.id} value={item.id} selected={this.state.accessRole === item.id ? 'selected' : ''}>{item.roleName}</option>
        );
        let managers = {};
        if(this.state.managers){
            // console.log('Render Data Roles', this.state.managers);
            managers = this.state.managers.map((item, key) =>
                <option key={item.id} value={item.id} selected={item.selected ? 'selected' : ''}>{item.firstname} {item.lastname}</option>
            );
        }
       
        return (
            <>
             <ul id="tabsJustified" className="nav nav-tabs nav-fil rounded-sm customTabul">
                <li className="nav-item">
                    <a href="#Time" data-target="#Time" data-toggle="tab" onClick={() => this.changeTab(1)} className="nav-link active">Time off requests</a>
                </li>
                <li className="nav-item">
                    <a href="#Employ" data-target="#Employ" data-toggle="tab" onClick={() => this.changeTab(2)} className="nav-link">Employment Status</a>
                </li>
                <li className="nav-item">
                    <a href="#job" data-target="#job" data-toggle="tab" onClick={() => this.changeTab(3)} className="nav-link">Job information</a>
                </li>
                <li className="nav-item">
                    <a href="#comp" data-target="#comp" data-toggle="tab" onClick={() => this.changeTab(4)} className="nav-link">Compensation</a>
                </li>
       
            </ul>

            <div id="tabsJustifiedContent" className="tab-content py-1">
                 <div className="tab-pane fade active show" id="Time">
                 <Card className="card d-block pt-3 pb-5 pl-3 pr-3 pb-3 mb-4 shadow-sm">                          
                         <div className="my-4" />                   

                            <div div className="d-flex justify-content">
                                <div className="col-lg-9">
                                <p className="font-16">Manager (Report To)</p>

                                <div className="row mb-3">
                                    <div className="col-lg-12 text-left">
                                        <span className="addNewButton pl-3" onClick={this.selectShow}> <i className="icon-plus icons"></i> Add New</span>
                                    </div>
                               </div>

                            </div>
                            </div>

                           
                            
                            <div className="mt-4  pr-3">
                                <div className="row">
                            { this.state.selectShow &&    
                                <div className="col-lg-4">
                                    <select className="form-control custom-select" onChange={this.showManagers}>
                                        {roles}
                                    </select>                                
                                </div>
                            }  
                            { this.state.showManagers &&    
                                <div className="col-lg-4">
                                    <select className="form-control custom-select" onChange={this.assignManager}>
                                    <option selected disabled>Select Manager</option>
                                       {managers}
                                    </select>                                
                                </div>
                            }  
                              </div>
                            </div>
                        
                        </Card>
                 </div>
                 <div className="tab-pane fade" id="Employ">
                 <Card className="card d-block pt-3 pb-5 pl-3 pr-3 pb-3 mb-4 shadow-sm">                          
                         <div className="my-4" />                   

                            <div div className="d-flex justify-content">
                                <div className="col-lg-9">
                                <p className="font-16">Manager 2 (Report To)</p>

                                <div className="row mb-3">
                                    <div className="col-lg-12 text-left">
                                        <span className="addNewButton pl-3" onClick={this.selectShow}> <i className="icon-plus icons"></i> Add New</span>
                                    </div>
                               </div>

                            </div>
                            </div>

                            <div className="mt-4 pr-3">
                                <div className="row">
                            { this.state.selectShow &&    
                                <div className="col-lg-4">
                                    <select className="form-control custom-select" onChange={this.showManagers}>
                                        {roles}
                                    </select>                                
                                </div>
                            }  
                            { this.state.showManagers &&    
                                <div className="col-lg-4">
                                    <select className="form-control custom-select" onChange={this.assignManager}>
                                    <option selected disabled>Select Manager</option>
                                       {managers}
                                    </select>                                
                                </div>
                            }  
                              </div>
                            </div>
                        
                        </Card>
                 </div>


                 <div className="tab-pane fade" id="job">
                 <Card className="card d-block pt-3 pb-5 pl-3 pr-3 pb-3 mb-4 shadow-sm">                          
                         <div className="my-4" />                   

                            <div div className="d-flex justify-content">
                                <div className="col-lg-9">
                                <p className="font-16">Manager 3 (Report To)</p>

                                <div className="row mb-3">
                                    <div className="col-lg-12 text-left">
                                        <span className="addNewButton pl-3" onClick={this.selectShow}> <i className="icon-plus icons"></i> Add New</span>
                                    </div>
                               </div>

                            </div>
                            </div>

                            <div className="mt-4  pr-3">
                                <div className="row">
                            { this.state.selectShow &&    
                                <div className="col-lg-4">
                                    <select className="form-control custom-select" onChange={this.showManagers}>
                                        {roles}
                                    </select>                                
                                </div>
                            }  
                            { this.state.showManagers &&    
                                <div className="col-lg-4">
                                    <select className="form-control custom-select" onChange={this.assignManager}>
                                    <option selected disabled>Select Manager</option>
                                       {managers}
                                    </select>                                
                                </div>
                            }  
                              </div>
                            </div>
                        
                        </Card>
                 </div>

                 <div className="tab-pane fade" id="comp">
                 <Card className="card d-block pt-3 pb-5 pl-3 pr-3 pb-3 mb-4 shadow-sm">                          
                         <div className="my-4" />                   

                            <div div className="d-flex justify-content">
                                <div className="col-lg-9">
                                <p className="font-16">Manager (Report To)</p>

                                <div className="row mb-3">
                                    <div className="col-lg-12 text-left">
                                        <span className="addNewButton pl-3" onClick={this.selectShow}> <i className="icon-plus icons"></i> Add New</span>
                                    </div>
                               </div>

                            </div>
                            </div>

                            <div className="mt-4  pr-3">
                                <div className="row">
                            { this.state.selectShow &&    
                                <div className="col-lg-4">
                                    <select className="form-control custom-select" onChange={this.showManagers}>
                                        {roles}
                                    </select>                                
                                </div>
                            }  
                            { this.state.showManagers &&    
                                <div className="col-lg-4">
                                    <select className="form-control custom-select" onChange={this.assignManager}>
                                    <option selected disabled>Select Manager</option>   
                                       {managers}
                                    </select>                                
                                </div>
                            }  
                              </div>
                            </div>
                        
                        </Card>
                 </div>


                </div>
            </>
        )
    }
}

export default Approvals;
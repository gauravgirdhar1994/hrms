import React, { Component } from 'react';
import { Card, Row, Table, Button } from "react-bootstrap"
import { FaPhoneAlt, FaLocationArrow } from "react-icons/fa";
import { IoIosMailOpen } from "react-icons/io";
import config from '../../config/config';
import moment from 'moment';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import MyTeamPastLeave from './MyTeamPastLeave'
const BEARER_TOKEN = localStorage.getItem("userData");
// const orgId = localStorage.getItem("orgId");
class MyTeamLeave extends Component {
    constructor(props)
    {
        super(props);
        this.state = {locations:this.props.locations,leaveType:this.props.leaveType,
            leaveStatus:this.props.leaveStatus,'leaves':this.props.leaves, selval:{},rowsPendingLength:0,
            leave_status:this.props.leave_status,loading:false,leave_type_id:'',locationId:'',rowsPending:[],
            pendingFilter:{},loadingI:{}}
        this.ApproveRejectLeave = this.ApproveRejectLeave.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.OnChangeCheckBox = this.OnChangeCheckBox.bind(this);
        this.ApproveRejectedSel = this.ApproveRejectedSel.bind(this);
        //this.checkedSelectAll = this.checkedSelectAll.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.search = this.search.bind(this);
     }
    componentDidMount()
    {        

    }
    componentDidUpdate(prevProps) {
         if(prevProps.locations !== this.props.locations) {
            this.setState({locations:this.props.locations})
        }
        if(prevProps.leaveType !== this.props.leaveType) {
            this.setState({leaveType:this.props.leaveType})
        }
        if(prevProps.leaveStatus !== this.props.leaveStatus) {
            this.setState({leaveStatus:this.props.leaveStatus})
        }
        if(prevProps.leave_status !== this.props.leave_status) {
            this.setState({leave_status:this.props.leave_status})
        }
        if(prevProps.leaves !== this.props.leaves) {
            this.setState({leaves:this.props.leaves})
        }

    }
    ApproveRejectLeave(e,obj,action)
    {
        try
        {
            //console.log(this.state,action)
            var loadingIObj = [];
            this.setState({'loadingI':obj.id})
           const bearer = 'bearer ' + BEARER_TOKEN;
           var finalData={}
           finalData.ticket_id=obj.id;
           finalData.description=action;
           finalData.ticket_status=this.state.leave_status[action];
           finalData.opened_by=obj.opened_by;
           finalData.assigned_to=obj.assigned_to;
            axios.post(config.API_URL+'/ticket/reply',finalData,{ headers: { Authorization: bearer }})
            .then(r=>{
                if(r.status==200 && r.data.success==true)
                {
                   this.props.getAllLeave();
                   this.setState({loading:false})
                }
                else
                {
                   // console.log('else')
                    toast.error('Something went wrong,Please try again.');
                            setTimeout(() => {
                                 toast.dismiss()
                              }, 2000)
                            this.setState({loading:false,loadingI:false})
                }
            })
            .catch(error => { 
                //console.log('catch axios')
                    toast.error('Something went wrong,Please try again.');
                            setTimeout(() => {
                                 toast.dismiss()
                              }, 2000)
                            this.setState({loading:false,loadingI:false})
            })
        }catch(e)
        {
             //console.log('catch')
            toast.error('Something went wrong,Please try again.');
                            setTimeout(() => {
                                 toast.dismiss()
                              }, 2000)
                this.setState({loading:false,loadingI:false})
        }
        
    }
    selectAll(e)
    {
        //console.log(e)
        if(this.state.leaves.length>0)
        {
            //console.log(document.getElementsByClassName('hrms_control__indicator'));
            var allElements =  document.getElementsByClassName('hrms_control__indicator');
          // this.setState({checked_all:e.target.checked})
           for(var i=1;i<Object.keys(allElements).length>0; i++)
           {
              allElements[i].previousSibling.checked=!e.target.checked;
              allElements[i].click();
           }
        }
    }
    OnChangeCheckBox(e,obj)
    {
        var new_obj = this.state.selval;
        //console.log(e.target.checked,obj)
        if(e.target.checked)
        {            
            new_obj[obj.id] = obj
            this.setState({selval:new_obj});
            //console.log(this.state.leaves,this.state.leaves.length,this.state.selval,Object.keys(this.state.selval).length)
            if(this.state.rowsPendingLength==Object.keys(this.state.selval).length)
            {
                 document.getElementById('select_all').checked = true
            }
        }
        else
        {
            delete new_obj[obj.id];
            this.setState({selval:new_obj});
             document.getElementById('select_all').checked = false
        }
       // this.checkedSelectAll();
       
    }
    ApproveRejectedSel(e,action)
    {
       // this.state.loading = true;
        this.setState({loading:true})
         Object.keys(this.state.selval).map((id)=>{
            this.ApproveRejectLeave(null,this.state.selval[id],action);
         })
    }
    handleChange(e)
    {
        var name = e.target.name;
        var value = e.target.value;
        var obj = {}
        obj[name] = value;
        //console.log(obj);
        var filter=this.state.pendingFilter;
        if(value!='')
        {
            filter[name]=value;
        }
        else
        {
            if(filter[name])
            {
                delete filter[name]
            }
        }
       // console.log('filter',filter);
        obj['pendingFilter'] = filter;
        this.setState(obj);
    }
    search()
    {
         
        
        if((this.props.leaves.length>0) && Object.keys(this.state.pendingFilter).length>0)
        {
           var result = [];
           
           this.state.pendingFilter['ticket_status'] = 8;
          // console.log('pendingFilter',this.state.pendingFilter)
            for (var i=0;i<this.props.leaves.length;i++){
                var condition = false;
                for (var prop in this.state.pendingFilter) {
                    //console.log(this.props.leaves[i].hasOwnProperty(prop),prop,this.props.leaves[i][prop],this.state.pendingFilter[prop])
                    if (this.props.leaves[i].hasOwnProperty(prop) && this.props.leaves[i][prop] == this.state.pendingFilter[prop]) {
                        
                       condition=true;
                    }
                    else
                    {
                         condition=false;
                        break;
                    }
                    
                }
                if(condition)
                {
                    result.push(this.props.leaves[i])
                }
            }
            //console.log(result);
            this.setState({leaves:result});
        }
        else
        {
            this.setState({leaves:this.props.leaves});
        }
    }
    // checkedSelectAll()
    // {
    //     if(this.state.leaves.length>0)
    //     {
    //         //console.log(document.getElementsByClassName('hrms_control__indicator'));
    //         var allElements =  document.getElementsByClassName('employee_checked_pen');
    //         var checked = true;
    //        for(var i=1;i<Object.keys(allElements).length>0; i++)
    //        {
    //           if(!allElements[i].checked){
    //             checked = false
    //             break;
    //           }
    //        }
    //        if(!checked)
    //        {
    //          document.getElementById('select_all').checked = false
    //        }
    //        else
    //        {
    //             document.getElementById('select_all').checked = true
    //        }
    //     }
    //     else
    //     {
    //         document.getElementById('select_all').checked = false
    //     }
    // }
    render()
    {
  
        var rowsPending=[];
        var rowsPast=[];
        var rowPastArr=[];
        //console.log('render',this.state.leaves);
        if(this.state.leaves.length>0)
        {
        for(var i=0;i<this.state.leaves.length;i++)
        {
           // console.log('loop',i)
           let obj = this.state.leaves[i];
           if(this.state.leaves[i].ticket_status_text=='Pending')
           {
                       rowsPending.push(<tr>
                                <td>
                                <label className="hrms_control hrms_checkbox">
                                        <input type="checkbox" name="employee_pen" className='employee_checked_pen' onChange={(e)=>this.OnChangeCheckBox(e,obj)}/>
                                        <i className="hrms_control__indicator"></i>
                                </label> 
                                </td>
                                <td>{this.state.leaves[i].openedByUser}</td>
                                <td>{this.state.leaves[i].locationName}</td>
                                <td>
                                    {(this.state.leaves[i].start_date?moment(new Date(this.state.leaves[i].start_date)).format(config.DATE_FORMAT):'N/A')}
                                    <small></small>
                                </td>
                                <td>{this.state.leaves[i].leave_type}</td>
                                <td>{this.state.leaves[i].ticket_status_text}</td>
                                {(this.state.loadingI==this.state.leaves[i].id)?<td>Loading...</td>:<td><a href="javascript:void(0)" onClick={(e)=>this.ApproveRejectLeave(e,obj,'approved')}>Approve</a>/<a href="javascript:void(0)" onClick={(e)=>this.ApproveRejectLeave(e,obj,'rejected')}>Reject</a></td>}
                            </tr>)
           }
           else
           {
                rowsPast.push(<tr>
        
                                <td>{this.state.leaves[i].openedByUser}</td>
                                <td>{this.state.leaves[i].locationName}</td>
                                <td>
                                 {(this.state.leaves[i].start_date?moment(new Date(this.state.leaves[i].start_date)).format(config.DATE_FORMAT):'N/A')}<small>No. of day {this.state.leaves[i].number_of_days}</small>
                                </td>
                                <td>{this.state.leaves[i].leave_type}</td>
                                <td>{this.state.leaves[i].ticket_status_text}</td>
                            </tr>)
                rowPastArr.push(this.state.leaves[i]);
            }
        }
        this.state.rowsPendingLength = rowsPending.length
        this.state.rowsPending = rowsPending
       // this.setState({rowsPending:rowsPending})
        }
        else
        {
            this.state.rowsPendingLength = rowsPending.length
            this.state.rowsPending = rowsPending
        }
        //console.log('rows1',rows1)
        return(
                    <>
                    <ToastContainer className="right" position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    draggable
            />
                    <div className="customTab">
                    <ul id="tabsJustified" className="nav nav-tabs nav-fil rounded-sm customTabul">
                        <li className="nav-item">
                            <a href="#Approval" data-target="#Approval" data-toggle="tab" className="nav-link active">Leave Approval</a>
                        </li>
                        <li className="nav-item">
                            <a href="#past" data-target="#past" data-toggle="tab" className="nav-link">Past Leave Request</a>
                        </li>
                        {/*<li className="nav-item">
                            <a href="#report" data-target="#report" data-toggle="tab" className="nav-link">Report</a>
                        </li> */}           
                    </ul>
                </div>




                <div id="tabsJustifiedContent" className="tab-content py-1">
                    <div className="tab-pane fade active show" id="Approval">

                    <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
                           
                            <Row>
                                {/*<div className="col-sm-3 pb-3">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label for="ticket_type">Department</label>
                                        </div>
                                        <div className="col-sm-12">
                                            <select value className="form-control">
                                                <option value="">Department</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>*/}
                                <div className="col-sm-3 pb-3">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label for="priority">Location</label>
                                        </div>
                                        <div className="col-sm-12">
                                            <select value={this.state.locationId} name='locationId' className="form-control custom-select" onChange={this.handleChange}>
                                                <option value="">Select Location</option>
                                                {this.state.locations}
                                            </select>
                                        </div>
                                    </div>
                                </div>




                                <div className="col-sm-3 pb-3">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label for="priority">Leave Type</label>
                                        </div>
                                        <div className="col-sm-12">
                                            <select value={this.state.leave_type_id} name='leave_type_id' className="form-control custom-select" onChange={this.handleChange}>
                                                <option value="">Leave Type</option>
                                                {this.state.leaveType}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/*<div className="col-sm-3 pb-3">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label for="priority">Leave Status</label>
                                        </div>
                                        <div className="col-sm-12">
                                            <select value className="form-control">
                                                <option value="">Leave Status</option>

                                            </select>
                                        </div>
                                    </div>
                                </div>*/}
                            </Row>

                            <div className="form-group row pt-5 edit-basicinfo">
                                <div className="col-lg-12 text-center">
                                    <Button type="submit" variant="primary" onClick={this.search}>
                                        Search
                        </Button>
                                </div>
                            </div>
                        </Card>


                        {/*<div className="form-group row pt-5 edit-basicinfo">
                                <div className="col-lg-12 text-left">
                                <Button type="submit" variant="primary mr-5" name='approve' id='approve' onClick={(e)=>this.ApproveRejectedSel(e,'approved')}>
                                        Approve
                                    </Button>
                                    <Button type="submit" variant="primary" name='reject' id='reject' onClick={(e)=>this.ApproveRejectedSel(e,'rejected')}>
                                        Reject
                                    </Button>
                                </div>
                            </div>*/}
                        <Card className="card d-block pl-3 pt-3 pr-3 pb-3 mt-2 shadow-sm">
                    <Table className="leaveTable" id='leave_table'>
                        <thead>
                            <tr>
                                <th>
                                <label className="hrms_control hrms_checkbox">
                                        <input type="checkbox" name="select_all" id='select_all'  onChange={this.selectAll}/>
                                        <i className="hrms_control__indicator"></i>
                                </label> 
                                </th>
                                <th>Employee</th>
                                <th>Location</th>
                                <th>Leave Date</th>
                                <th>Leave Type</th>
                                <th>Status</th>
                                <th>Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {(!this.state.loading)?this.state.rowsPending:'Loading...'}
                        </tbody>
                    </Table>
                </Card>

                    </div>

                    <div className="tab-pane fade " id="past">
                        <MyTeamPastLeave locations={this.state.locations} leaveType={this.state.leaveType} leaveStatus={this.state.leaveStatus} pastLeave={rowsPast} pastLeaveArr={rowPastArr} />
                    </div>

                    <div className="tab-pane fade" id="report">
                    </div>
                </div>
                </>
            )
    }
}
export default MyTeamLeave

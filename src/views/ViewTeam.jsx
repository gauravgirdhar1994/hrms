import React, { Component } from 'react';
import { Card, Row, Table, Button } from "react-bootstrap"
import { FaPhoneAlt, FaLocationArrow } from "react-icons/fa";
import { IoIosMailOpen } from "react-icons/io";
import axios from 'axios';
import config from '../config/config';
import MyTeam from '../components/ViewTeam/MyTeam'
import MyTeamLeave from '../components/ViewTeam/MyTeamLeave'
import ImageGridLoader from '../components/Loaders/ImageGridLoader';
const BEARER_TOKEN = localStorage.getItem("userData");
const orgId = localStorage.getItem("orgId");
class ViewTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: '',
            emp_id: localStorage.getItem("employeeId"),
            roleSlug: localStorage.getItem("roleSlug"),
            team_arr:[],
            'loading':false,
            'locations':[],
            'leaveType':[],
            'leaveStatus':[],
            'leaves':[],
            'leave_status':{},
            'active_tab' : 'team'
        }
        this.getTeamAndReportingManager = this.getTeamAndReportingManager.bind(this);
        this.getLocations  = this.getLocations.bind(this);
        this.getLeaveType = this.getLeaveType.bind(this);
        this.getLeaveStatus = this.getLeaveStatus.bind(this);
        this.getAllLeave = this.getAllLeave.bind(this);
    }
    
    componentDidMount()
    {
        this.getTeamAndReportingManager();
        this.getLocations();
        this.getLeaveType();
        this.getLeaveStatus();
        this.getAllLeave();
        let url = this.props.location.search;
        const urlParams = new URLSearchParams(url);

        if(urlParams.get('activeTab')){
            this.setState({
                active_tab : urlParams.get('activeTab')
            })
        }
    }
    getTeamAndReportingManager()
    {
        this.setState({'loading':true});
        var bearer = 'bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL+'/employee/team/'+this.state.emp_id,{ headers: { Authorization: bearer }})
       .then(r => {
          
           if (r.status==200 && r.data.success) {
            //console.log('r',r)
                this.setState({team_arr:r.data,'loading':false})
           }

       })
       .catch((error) => {
           console.log("API ERR: ");
           console.error(error);
           this.setState({'loading':false});
       });
    }
    getLocations()
    {
        const bearer = 'bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL+'/common/locations/'+orgId,{ headers: { Authorization: bearer }})
        .then(r=>{
            if(r.status==200 && (r.data.Locations && r.data.Locations.length>0))
            {
                //console.log('locations',r.data.Locations);
                var loptions = r.data.Locations.map((obj)=>{
                    return <option value={obj.locationId}>{obj.locationName}</option>
                })
               // console.log('options',loptions)
                this.setState({locations:loptions})
            }
        })
    }
    getLeaveType()
    {
          const bearer = 'bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL+'/leave-type-all',{ headers: { Authorization: bearer }})
        .then(r=>{
            if(r.status==200 && r.data.success==true && r.data.LeaveType.length>0)
            {
                //console.log('locations',r.data.Locations);
                var options = r.data.LeaveType.map((obj)=>{
                    return <option value={obj.id}>{obj.leaveName}</option>
                })
               // console.log('options',loptions)
                this.setState({leaveType:options})
            }
        })
    }
    getLeaveStatus()
    {
        const bearer = 'bearer ' + BEARER_TOKEN;
        var leave_status = {};
        axios.get(config.API_URL+'/leave-status-all',{ headers: { Authorization: bearer }})
        .then(r=>{
            if(r.status==200 && r.data.success==true && r.data.LeaveStatus.length>0)
            {
                //console.log('locations',r.data.Locations);
                var options = r.data.LeaveStatus.map((obj)=>{
                    if(obj.status_name=='Approved' || obj.status_name=='Rejected')
                    {

                    }
                    leave_status[(obj.status_name).toLowerCase()] = obj.id
                    return <option value={obj.id}>{obj.status_name}</option>
                })
                //console.log('leave_status',leave_status)
                this.setState({LeaveStatus:options,leave_status:leave_status})
            }
        })
    }
    getAllLeave()
    {
        const bearer = 'bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL+'/ticket/list/LEAVE_REQ',{ headers: { Authorization: bearer }})
        .then(r=>{
            if(r.status==200 && r.data.success==true && r.data.ticketDetails.rows.length>0)
            {
                this.setState({leaves:r.data.ticketDetails.rows})
            }
        })
    }
    render() {
        return (

            <>
        <div className="p-4 flex-fill d-flex flex-column page-fade-enter-done">
                <div className="customTab">
                    <ul id="tabsJustified" className="nav nav-tabs nav-fill bg-magenta rounded-sm">
                        <li className="nav-item">
                            <a href="#myTeam" data-target="#myTeam" data-toggle="tab" className={this.state.active_tab === 'team' ? "nav-link active" : "nav-link" }>My Team</a>
                        </li>
                        {/* <li className="nav-item">
                            <a href="#Leave" data-target="#Leave" data-toggle="tab" className={this.state.active_tab === 'leave' ? "nav-link active" : "nav-link" }>Leave</a>
                        </li> */}
                        {/*<li className="nav-item">
                            <a href="#Attendance" data-target="#Attendance" data-toggle="tab" className="nav-link">Attendance</a>
                        </li>
                        <li className="nav-item">
                            <a href="#ProfileApproved" data-target="#ProfileApproved" data-toggle="tab" className="nav-link">Profile Approved</a>
                        </li>*/}
                    </ul>
                </div>
                <div id="tabsJustifiedContent" className="tab-content py-1">
                    <div className={this.state.active_tab === 'team' ? "tab-pane fade active show" : "tab-pane fade"} id="myTeam">
                        {!this.state.loading?<MyTeam team_arr={this.state.team_arr}/>:<ImageGridLoader/>}                        
                    </div>
                    {this.state.roleSlug != "employee" ? (
                    <div className={this.state.active_tab === 'leave' ? "tab-pane fade active show" : "tab-pane fade"} id="Leave">
                        <MyTeamLeave locations={this.state.locations} leaveType={this.state.leaveType} leaveStatus={this.state.LeaveStatus} leaves={this.state.leaves} leave_status={this.state.leave_status} getAllLeave={this.getAllLeave}/>
                    </div>) : ''}
                    {/*<div className="tab-pane fade " id="Attendance">
                        Attencance
                                    </div>
                    <div className="tab-pane fade " id="ProfileApproved">
                        Profile Approved
                                    </div>*/}
                </div>            

</div>


            </>
        );
    }
}

export default ViewTeam;
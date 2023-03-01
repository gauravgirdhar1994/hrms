import React, { Component } from 'react';
import AccountSetup from '../components/Settings/AccountSetup';
import UserManagement from '../components/Settings/UserManagement';
import EmployeeFields from '../components/Settings/EmployeeFields';
import Approvals from '../components/Settings/Approvals';
import HolidaySetup from '../components/Settings/HolidaySetup';
import EmployeeGrades from '../components/Settings/EmployeeGrades';

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            role: localStorage.getItem('roleSlug')
        }
    }
    render() {
        return (
            <div className="p-4 flex-fill d-flex flex-column page-fade-enter-done">

                <h4 className="mb-2 font-16 pl-3"> Settings</h4>

                <div className="col-lg-12">
                {this.state.role != 'broker-admin' && this.state.role != 'broker-primary' ? (
                    <>
                    <ul id="tabsJustified" className="nav nav-tabs nav-fill bg-magenta rounded-sm">
                        <li className="nav-item">
                            <a href="#accountSetup" data-target="#accountSetup" data-toggle="tab" className="nav-link active">Account Setup</a>
                        </li>
                        <li className="nav-item">
                            <a href="#userManagement" data-target="#userManagement" data-toggle="tab" className="nav-link">User Management</a>
                        </li>
                        {/* <li className="nav-item">
                            <a href="#employeefield" data-target="#employeefield" data-toggle="tab" className="nav-link">Employee Fields</a>
                        </li> */}
                        {/* <li className="nav-item">
                                                        <a href="#approvals" data-target="#approvals" data-toggle="tab" className="nav-link">Approvals</a>
                                                    </li> */}
                        <li className="nav-item">
                            <a href="#holidaySetpu" data-target="#holidaySetpu" data-toggle="tab" className="nav-link">Leave Type & Holiday</a>
                        </li>
                    </ul>

                    <div id="tabsJustifiedContent" className="tab-content py-1">
                        <div className="tab-pane fade active show" id="accountSetup">
                            <div className="list-group">
                                <AccountSetup />
                            </div>
                        </div>
                        <div className="tab-pane fade" id="userManagement">
                            <div className="list-group">
                                <UserManagement />
                            </div>
                        </div>
                        {/* <div className="tab-pane fade" id="employeefield">
                            <div className="list-group">
                                <EmployeeFields />
                            </div>
                        </div> */}
                        
                        {/* <div className="tab-pane fade" id="approvals">
                                                        <div className="list-group"> 
                                                           <Approvals />                                                           
                                                          </div>
                                                        </div> */}

                        <div className="tab-pane fade" id="holidaySetpu">
                            <div className="list-group">
                                <HolidaySetup />
                            </div>
                        </div>
                        
                    </div>
                    </>
                ) : (
                    <>
                    <ul id="tabsJustified" className="nav nav-tabs nav-fill bg-magenta rounded-sm">
                        <li className="nav-item">
                            <a href="#accountSetup" data-target="#accountSetup" data-toggle="tab" className="nav-link active">Account Setup</a>
                        </li>
                        
                        <li className="nav-item">
                            <a href="#holidaySetpu" data-target="#holidaySetpu" data-toggle="tab" className="nav-link">Leave Type & Holiday</a>
                        </li>
                    </ul>

                    <div id="tabsJustifiedContent" className="tab-content py-1">
                        <div className="tab-pane fade active show" id="accountSetup">
                            <div className="list-group">
                                <AccountSetup />
                            </div>
                        </div>
                        <div className="tab-pane fade" id="holidaySetpu">
                            <div className="list-group">
                                <HolidaySetup />
                            </div>
                        </div>
                        
                    </div>
                    </>
                )}
                </div>
            </div>
        )
    }

}

export default Settings
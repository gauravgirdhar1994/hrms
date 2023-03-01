import React, { Component } from 'react';
import AccounInfo from './AccountInfo'
import Department from './Department'
import Designation from './Designation'
import WorkLocation from './WorkLocation'
import WorkSchedule from './WorkSchedule'
import EmployeeType from './EmployeeType'
import BasicAccess from './BasicAccess'
import VisaAccess from './VisaAccess';
import JobAccess from './JobAccess';
import EducationAccess from './EduationAccess';
import SalaryBreakup from './SalaryBreakup';
import Passport from './Passport';
import Emirate from './Emirates';
import BankDetails from './BankDetails';
import DependentInfo from './DependentInfo';

class AccessTabscomponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: props.activeTab
        }
    }

    setActiveTab = (id) => {
        this.setState({ activeTab: id });
    }

    render() {

        console.log('Active Tab', this.state.activeTab);
        return (
            <>
                <div className="customTab">
                    <ul id="tabsJustified" className="nav nav-tabs nav-fil rounded-sm customTabul">
                        <li className="nav-item" onClick={() => this.setActiveTab(1)}>
                            <a href="#Basic" data-target="#Basic" data-toggle="tab" className="nav-link active">Basic</a>
                        </li>
                        <li className="nav-item" onClick={() => this.setActiveTab(2)}>
                            <a href="#Education" data-target="#Education" data-toggle="tab" className="nav-link">Education</a>
                        </li>
                        <li className="nav-item" onClick={() => this.setActiveTab(3)}>
                            <a href="#Visa" data-target="#Visa" data-toggle="tab" className="nav-link">Visa</a>
                        </li>
                        <li className="nav-item" onClick={() => this.setActiveTab(4)}>
                            <a href="#Passport" data-target="#Passport" data-toggle="tab" className="nav-link">Passport</a>
                        </li>
                        <li className="nav-item" onClick={() => this.setActiveTab(5)}>
                            <a href="#Emirate" data-target="#Emirate" data-toggle="tab" className="nav-link">Emirate</a>
                        </li>
                        <li className="nav-item" onClick={() => this.setActiveTab(6)}>
                            <a href="#Job" data-target="#Job" data-toggle="tab" className="nav-link">Job</a>
                        </li>
                        <li className="nav-item" onClick={() => this.setActiveTab(7)}>
                            <a href="#salaryBreakup" data-target="#salaryBreakup" data-toggle="tab" className="nav-link">Salary Breakup</a>
                        </li>
                        <li className="nav-item" onClick={() => this.setActiveTab(8)}>
                            <a href="#bankDetails" data-target="#bankDetails" data-toggle="tab" className="nav-link">Bank Details</a>
                        </li>
                        <li className="nav-item" onClick={() => this.setActiveTab(9)}>
                            <a href="#dependentInfo" data-target="#dependentInfo" data-toggle="tab" className="nav-link">Dependent Information</a>
                        </li>
                    </ul>
                </div>



                <div id="tabsJustifiedContent" className="tab-content py-1">
                    <div className="tab-pane fade active show" id="Basic">
                        <div className="list-group">
                            {this.state.activeTab == 1 ? <BasicAccess roleId={this.props.roleId} forOther={this.props.forOther} /> : ''}
                        </div>
                    </div>
                    <div className="tab-pane fade" id="Education">
                        <div className="list-group">
                            {this.state.activeTab == 2 ? <EducationAccess roleId={this.props.roleId} forOther={this.props.forOther} /> : ''}

                        </div>
                    </div>
                    <div className="tab-pane fade" id="Visa">
                        <div className="list-group">
                            {this.state.activeTab == 3 ? <VisaAccess roleId={this.props.roleId} forOther={this.props.forOther} /> : ''}
                        </div>
                    </div>
                    <div className="tab-pane fade" id="Passport">
                        <div className="list-group">
                            {this.state.activeTab == 4 ? <Passport roleId={this.props.roleId} forOther={this.props.forOther} /> : ''}
                        </div>
                    </div>
                    <div className="tab-pane fade" id="Emirate">
                        <div className="list-group">
                            {this.state.activeTab == 5 ? <Emirate roleId={this.props.roleId} forOther={this.props.forOther} /> : ''}
                        </div>
                    </div>
                    <div className="tab-pane fade" id="Job">
                        <div className="list-group">
                            {this.state.activeTab == 6 ? <JobAccess roleId={this.props.roleId} forOther={this.props.forOther} /> : ''}
                        </div>
                    </div>
                    <div className="tab-pane fade" id="salaryBreakup">
                        <div className="list-group">
                            {this.state.activeTab == 7 ? <SalaryBreakup roleId={this.props.roleId} forOther={this.props.forOther} /> : ''}
                        </div>
                    </div>
                    <div className="tab-pane fade" id="bankDetails">
                        <div className="list-group">
                            {this.state.activeTab == 8 ? <BankDetails roleId={this.props.roleId} forOther={this.props.forOther} /> : ''}
                        </div>
                    </div>
                    <div className="tab-pane fade" id="dependentInfo">
                        <div className="list-group">
                            {this.state.activeTab == 9 ? <DependentInfo roleId={this.props.roleId} forOther={this.props.forOther} /> : ''}
                        </div>
                    </div>
                </div>

            </>
        )
    }

}

export default AccessTabscomponent;
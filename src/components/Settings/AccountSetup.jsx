import React, { Component } from "react";
import AccounInfo from "./AccountInfo";
import Department from "./Department";
import Designation from "./Designation";
import WorkLocation from "./WorkLocation";
import WorkSchedule from "./WorkSchedule";
import EmployeeType from "./EmployeeType";
import TicketType from "./TicketType";
import TicketStatus from "./TicketStatus";
import TicketReasons from "./TicketReasons";
import EmployeeGrades from "./EmployeeGrades";
import EmailTemplates from "./emailTemplates";

class AccountSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: localStorage.getItem("roleSlug"),
      activeTab: 1
    };
  }

  setActiveTab = (id) => {
    this.setState({ activeTab: id });
  }

  render() {
    console.log("Current Role", localStorage);

    return (
      <div>
        {this.state.role != "broker-admin" &&
          this.state.role != "broker-primary" ? (
          <>
            <div className="customTab">
              <ul
                id="tabsJustified"
                className="nav nav-tabs nav-fil rounded-sm customTabul"
              >
                <li className="nav-item" onClick={() => this.setActiveTab(1)}>
                  <a
                    href="#Accountinfo"
                    data-target="#Accountinfo"
                    data-toggle="tab"
                    className="nav-link active"
                  >
                    Account info
                  </a>
                </li>
                <li className="nav-item" onClick={() => this.setActiveTab(2)}>
                  <a
                    href="#Department"
                    data-target="#Department"
                    data-toggle="tab"
                    className="nav-link"
                  >
                    Department
                  </a>
                </li>
                <li className="nav-item" onClick={() => this.setActiveTab(3)}>
                  <a
                    href="#Designation"
                    data-target="#Designation"
                    data-toggle="tab"
                    className="nav-link"
                  >
                    Designation
                  </a>
                </li>
                <li className="nav-item" onClick={() => this.setActiveTab(4)}>
                  <a
                    href="#WorkLocation"
                    data-target="#WorkLocation"
                    data-toggle="tab"
                    className="nav-link"
                  >
                    Work Location
                  </a>
                </li>

                <li className="nav-item" onClick={() => this.setActiveTab(5)}>
                  <a
                    href="#WorkSchedule"
                    data-target="#WorkSchedule"
                    data-toggle="tab"
                    className="nav-link"
                  >
                    Work Schedule
                  </a>
                </li>
                <li className="nav-item" onClick={() => this.setActiveTab(6)}>
                  <a
                    href="#EmployeeType"
                    data-target="#EmployeeType"
                    data-toggle="tab"
                    className="nav-link"
                  >
                    Employment Type
                  </a>
                </li>
                <li className="nav-item" onClick={() => this.setActiveTab(7)}>
                  <a
                    href="#EmployeeGrades"
                    data-target="#EmployeeGrades"
                    data-toggle="tab"
                    className="nav-link"
                  >
                    Employee Grades
                  </a>
                </li>
                <li className="nav-item" onClick={() => this.setActiveTab(8)}>
                  <a
                    href="#TicketType"
                    data-target="#TicketType"
                    data-toggle="tab"
                    className="nav-link"
                  >
                    Ticket Type
                  </a>
                </li>
                <li className="nav-item" onClick={() => this.setActiveTab(9)}>
                  <a
                    href="#TicketStatus"
                    data-target="#TicketStatus"
                    data-toggle="tab"
                    className="nav-link"
                  >
                    Ticket Status
                  </a>
                </li>
                <li className="nav-item" onClick={() => this.setActiveTab(10)}>
                  <a
                    href="#TicketReasons"
                    data-target="#TicketReasons"
                    data-toggle="tab"
                    className="nav-link"
                  >
                    Exit Reasons
                  </a>
                </li>
              </ul>
            </div>

            <div id="tabsJustifiedContent" className="tab-content py-1">
              <div className="tab-pane fade active show" id="Accountinfo">
                <div className="list-group">
                  {this.state.activeTab == 1 ? <AccounInfo /> : ''}
                </div>
              </div>
              <div className="tab-pane fade" id="Department">
                <div className="list-group">
                  {this.state.activeTab == 2 ? <Department /> : ''}
                </div>
              </div>
              <div className="tab-pane fade" id="Designation">
                <div className="list-group">
                  {this.state.activeTab == 3 ? <Designation /> : ''}
                </div>
              </div>
              <div className="tab-pane fade" id="WorkLocation">
                <div className="list-group">
                  {this.state.activeTab == 4 ? <WorkLocation /> : ''}
                </div>
              </div>
              <div className="tab-pane fade" id="WorkSchedule">
                <div className="list-group">
                  {this.state.activeTab == 5 ? <WorkSchedule /> : ''}
                </div>
              </div>
              <div className="tab-pane fade" id="EmployeeType">
                <div className="list-group">
                  {this.state.activeTab == 6 ? <EmployeeType /> : ''}
                </div>
              </div>
              <div className="tab-pane fade" id="EmployeeGrades">
                <div className="list-group">
                  {this.state.activeTab == 7 ? <EmployeeGrades /> : ''}
                </div>
              </div>
              <div className="tab-pane fade" id="TicketType">
                <div className="list-group">
                  {this.state.activeTab == 8 ? <TicketType /> : ''}
                </div>
              </div>
              <div className="tab-pane fade" id="TicketStatus">
                <div className="list-group">
                  {this.state.activeTab == 9 ? <TicketStatus /> : ''}
                </div>
              </div>
              <div className="tab-pane fade" id="TicketReasons">
                <div className="list-group">
                  {this.state.activeTab == 10 ? <TicketReasons /> : ''}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="customTab">
              <ul
                id="tabsJustified"
                className="nav nav-tabs nav-fil rounded-sm customTabul"
              >
                <li className="nav-item">
                  <a
                    href="#Department"
                    data-target="#Department"
                    data-toggle="tab"
                    className="nav-link active"
                  >
                    Department
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#Designation"
                    data-target="#Designation"
                    data-toggle="tab"
                    className="nav-link"
                  >
                    Designation
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    href="#EmployeeType"
                    data-target="#EmployeeType"
                    data-toggle="tab"
                    className="nav-link"
                  >
                    Employee Type
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#EmployeeGrades"
                    data-target="#EmployeeGrades"
                    data-toggle="tab"
                    className="nav-link"
                  >
                    Employee Grades
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#TicketType"
                    data-target="#TicketType"
                    data-toggle="tab"
                    className="nav-link"
                  >
                    Ticket Type
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#TicketStatus"
                    data-target="#TicketStatus"
                    data-toggle="tab"
                    className="nav-link"
                  >
                    Ticket Status
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#WorkSchedule"
                    data-target="#WorkSchedule"
                    data-toggle="tab"
                    className="nav-link small"
                  >
                    Work Schedule
                  </a>
                </li>
                {/* <li className="nav-item">
                            <a href="#emailTemplates" data-target="#emailTemplates" data-toggle="tab" className="nav-link small">Email Templates</a>
                        </li> */}
              </ul>
            </div>

            <div id="tabsJustifiedContent" className="tab-content py-1">
              <div className="tab-pane fade active show" id="Department">
                <div className="list-group">
                  <Department />
                </div>
              </div>
              <div className="tab-pane fade" id="Designation">
                <div className="list-group">
                  <Designation />
                </div>
              </div>

              <div className="tab-pane fade" id="EmployeeType">
                <div className="list-group">
                  <EmployeeType />
                </div>
              </div>
              <div className="tab-pane fade" id="EmployeeGrades">
                <div className="list-group">
                  <EmployeeGrades />
                </div>
              </div>
              <div className="tab-pane fade" id="TicketType">
                <div className="list-group">
                  <TicketType />
                </div>
              </div>
              <div className="tab-pane fade" id="TicketStatus">
                <div className="list-group">
                  <TicketStatus />
                </div>
              </div>
              <div className="tab-pane fade" id="WorkSchedule">
                <div className="list-group">
                  <WorkSchedule />
                </div>
              </div>
              <div className="tab-pane fade" id="emailTemplates">
                {/* <div className="list-group">
                            <EmailTemplates />
                        </div> */}
              </div>
              {/* <div className="tab-pane fade" id="TicketType">
                        <div className="list-group">
                            <TicketType />
                        </div>
                    </div> */}
            </div>
          </>
        )}
      </div>
    );
  }
}

export default AccountSetup;

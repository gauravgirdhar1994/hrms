import React, { Component } from "react";
import { Col } from "reactstrap";
import { Card } from "react-bootstrap";
import moment from "moment";

class EmployeeDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getSupervisor(lable, name) {
    if (name != null) {
      return (
        <li>
          <label>{lable}</label>
          <span>{name}</span>
        </li>
      );
    } else {
      return "";
    }
  }
  yearsDiff(d1, d2) {
    let date1 = new Date(d1);
    let date2 = new Date(d2);
    let yearsDiff = date2.getFullYear() - date1.getFullYear();
    return yearsDiff;
  }
  getYearsAndMonths(d1) {
    let date1 = new Date(d1); // joininig date
    let date2 = new Date();   // current date
    let years = this.yearsDiff(d1, date2);
    let months = (years * 12) + (date2.getMonth() - date1.getMonth());
    return months > 12 ? parseInt(months / 12) + ' Years, ' + months % 12 + ' Month(s)' : months + " Month(s)";
  }
  render() {
    const empDetails = this.props.empDetails;
    const supervisorList = this.props.supervisorList ? this.props.supervisorList[0] : {};
    // console.log("supervisorList11111111 ===> ", supervisorList);
    return (
      <>
       
          <Card className="card filterList d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
            <h4 className="font-16 hblack  border-none">Employee Details</h4>
            <ul className="emp-Exit-listing">
              <li>
                <label>Time in Organization</label>
                <span>{empDetails.joiningDate !== null ? this.getYearsAndMonths(empDetails.joiningDate):""}</span>
              </li>
              <li>
                <label>Employed Since</label>
                <span>
                  {empDetails.joiningDate !== null
                    ? moment(empDetails.joiningDate).format("MMM DD, YYYY")
                    : ""}
                </span>
              </li>
            </ul>

            <ul className="emp-Exit-listing">
              <h4 className="font-16 hblack border-none">
                My Supervisor Info
              </h4>
              {supervisorList && this.getSupervisor(
                "Supervisor1",
                supervisorList.supervisorName1
              )}
              {supervisorList && this.getSupervisor(
                "Supervisor2",
                supervisorList.supervisorName2
              )}
              {supervisorList && this.getSupervisor(
                "Attendance Manager",
                supervisorList.attendanceManagerName
              )}
              {supervisorList && this.getSupervisor(
                "HR Manager", 
                supervisorList.hrManagerName
              )}
            </ul>
          </Card>
       
      </>
    );
  }
}

export default EmployeeDetails;

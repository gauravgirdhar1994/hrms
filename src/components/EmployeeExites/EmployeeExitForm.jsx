import React, { Component } from "react";
import { Table, Row, Col } from "reactstrap";
import { Card } from "react-bootstrap";
import DatePicker from "react-datepicker";
import moment from "moment";
import axios from "axios";
import config from "../../../src/config/config";
const BEARER_TOKEN = "Bearer " + localStorage.getItem("userData");

class EmployeeExitForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date_of_resignation: moment().toDate(),
      date_of_lwd: "",
      reason: "",
      comment: "",
      validateFields: {},
      showAlertMessage: false,
      empDetails: {},
      exitDetails: {},
      managerDetails: {},
      disableButtons: false,
      supervisorId: ''
    };
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.withDrawResignation = this.withDrawResignation.bind(this);
  }
  componentDidMount() {
    this.setState({
      empDetails: this.props.empDetails,
      exitDetails: this.props.exitDetails,
      managerDetails: this.props.managerDetails,
      supervisorId: this.props.supervisorId,
      NDCListDetails: this.props.NDCListDetails,
      exitReasonList: this.props.exitReasonList
    });
  }
  loadAlertMessage() {
    if (this.state.showAlertMessage) {
      return (
        <div className="withdrowReg text-center">
          <p>{this.state.alertMessage}</p>
        </div>
      );
    } else {
      return "";
    }
  }
  onChangeResignDate = (date_of_resignation) =>
    this.setState({ date_of_resignation });
  onChangeLWDDate = (date_of_lwd) => this.setState({ date_of_lwd });
  onChangeHandler(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  validateForm() {
    let fields = this.state.validateFields;
    let validations = {};
    let isFormValid = true;

    if (
      this.state.date_of_resignation == "" ||
      typeof this.state.date_of_resignation == "undefined"
    ) {
      validations["date_of_resignation"] =
        "Please add date of your resignation";
      isFormValid = false;
    }
    if (
      this.state.date_of_lwd == "" ||
      typeof this.state.date_of_lwd == "undefined"
    ) {
      validations["date_of_lwd"] = "Please add your last working date";
      isFormValid = false;
    }
    if (this.state.reason == "" || typeof this.state.reason == "undefined") {
      validations["reason"] = "Please select reason for your resignation";
      isFormValid = false;
    }
    if (this.state.comment == "" || typeof this.state.comment == "undefined") {
      validations["comment"] = "Please add comment";
      isFormValid = false;
    }
    this.setState({ validateFields: validations });
    return isFormValid;
  }
  onSubmitHandler(e) {
    e.preventDefault();
    if (this.validateForm()) {
      this.setState({disableButtons:true});
      const form = e.target;
      let formdata = {};
      formdata.date_of_resignation = this.state.date_of_resignation;
      formdata.date_of_lwd = this.state.date_of_lwd;
      formdata.reason = this.state.reason;
      formdata.comment = this.state.comment;
      formdata.supervisorId = this.state.supervisorId;

      console.log('formdata ===> ', formdata);
      const headers = {
        Authorization: BEARER_TOKEN,
        "Content-Type": "application/json",
      };
      const s = axios
        .post(config.API_URL + "/exit/add", formdata, {
          headers: headers,
        })
        .then((res) => {
          if (res.data.success) {
            this.setState({
              date_of_resignation: "",
              date_of_lwd: "",
              reason: "",
              comment: "",
              exitDetails: res.data.empData.empExitDetails,
              managerDetails: res.data.empData.managerDetails,
              showAlertMessage: true,
              alertMessage: "Resignation has been successfully submitted!",
              disableButtons: false
            });
          } else {
            alert(res.data.message);
          }
        });
    }
  }
  withDrawResignation(e) {
    this.setState({ disableButtons: true });
    const headers = {
      Authorization: BEARER_TOKEN,
      "Content-Type": "application/json",
    };
    const s = axios
      .put(
        config.API_URL + "/exit/withdraw",
        {},
        {
          headers: headers,
        }
      )
      .then((res) => {
        if (res.data.success) {
          this.setState({
            exitDetails: null,
            managerDetails: null,
            showAlertMessage: true,
            alertMessage: "Resignation has been successfully withdrawn!",
            disableButtons: false,
          });
        } else {
          alert(res.data.message);
          this.setState({
            disableButtons: false,
          });
        }
      })
      .catch((error) => {
        this.setState({
          disableButtons: false,
        });
        alert("Something went wrong, please try again.");
      });
  }
  cancelResignation(e){
    if(this.props.roleName=='EMPLOYEE'){
      this.props.initiateResign(false);
    }
  }

  loadExitForm() {
    return (
      <Row>
        <Col>
          <Card className="card filterList d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
            <h4 className="font-16 hblack  border-none">Resignation Request</h4>
            <form name="resignForm" onSubmit={(e) => this.onSubmitHandler(e)}>
              <Row>
                <div className="col-sm-6 pb-3">
                  <div className="row">
                    <div className="col-sm-4">
                      <label htmlFor="ticket_type">
                        Select Date of Resignation
                      </label>
                    </div>
                    <div className="col-sm-6">
                      <DatePicker
                        showYearDropdown
                        dropdownMode="scroll"
                        minDate={moment().toDate()}
                        className="form-control"
                        dateFormat={config.DP_INPUT_DATE_FORMAT}
                        selected={this.state.date_of_resignation}
                        value={this.state.date_of_resignation}
                        name="date_of_resignation"
                        onChange={this.onChangeResignDate}
                        autoComplete="off"
                      />
                      <div className="errMsg">
                        {this.state.validateFields.date_of_resignation}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 pb-3">
                  <div className="row">
                    <div className="col-sm-4">
                      <label htmlFor="ticket_type">Select Date of LWD</label>
                    </div>
                    <div className="col-sm-6">
                      <DatePicker
                        showYearDropdown
                        dropdownMode="scroll"
                        minDate={moment().toDate()}
                        className="form-control"
                        dateFormat={config.DP_INPUT_DATE_FORMAT}
                        selected={this.state.date_of_lwd}
                        value={this.state.date_of_lwd}
                        name="date_of_lwd"
                        onChange={this.onChangeLWDDate}
                        autoComplete="off"
                      />
                      <div class="errMsg">
                        {this.state.validateFields.date_of_lwd}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 pb-3">
                  <div className="row">
                    <div className="col-sm-4">
                      <label htmlFor="ticket_type">Select Reason</label>
                    </div>
                    <div className="col-sm-6">
                      <select
                        className="form-control"
                        name="reason"
                        id="reason"
                        onChange={(e) => this.onChangeHandler(e)}
                      >
                        <option value="">Select Reason</option>
                        {this.state.exitReasonList.map(reason => {
                          return <option value={reason.id}>{reason.reason}</option>
                        })}
                      </select>
                      <div class="errMsg">
                        {this.state.validateFields.reason}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 pb-3">
                  <div className="row">
                    <div className="col-sm-4">
                      <label htmlFor="ticket_type">Comment</label>
                    </div>
                    <div className="col-sm-6">
                      <textarea
                        placeholder=""
                        className="form-control"
                        name="comment"
                        onChange={(e) => this.onChangeHandler(e)}
                        value={this.state.comment}
                      ></textarea>
                      <div class="errMsg">
                        {this.state.validateFields.comment}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 text-center">
                  <input
                    type="reset"
                    className="btn btn-outline-primary mr-2"
                    value="Cancel"
                    onClick={(e) => this.cancelResignation(e)}
                  />
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="Submit"
                    onClick={(e) => this.onSubmitHandler(e)}
                  />
                </div>
              </Row>
            </form>
          </Card>
        </Col>
      </Row>
    );
  }
  loadExitFormDetails() {
    const exitDetails = this.state.exitDetails;
    const managerDetails = this.state.managerDetails;
    console.log('managerDetails ===> ', exitDetails);

    return (
      <Row>
        <Col>
          <Card className="card ticketList d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
            <h4 className="font-16 hblack bold">Resignation Request</h4>
            <ul className="empExit">
              <li className="d-flex">
                <div>
                  <label>Date of Resignation</label>
                  <span>
                    {moment(exitDetails.date_of_resignation).format(
                      "MMM DD, YYYY"
                    )}
                  </span>
                </div>
                <div>
                  <label>Expected LWD</label>
                  <span>
                    {moment(exitDetails.date_of_lwd).format("MMM DD, YYYY")}
                  </span>
                </div>
                <div>
                  <label>Status</label>
                  <span className="">
                    {exitDetails.exit_status == 0 ? "Pending" : "Approved"}
                  </span>
                </div>
                <div>
                  <label>Separation Reason</label>
                  <span>{typeof exitDetails.reasonText=="undefined"?"":exitDetails.reasonText}</span>
                </div>
              </li>
              <li className="d-flex">
                <div>
                  <label>Comments</label>
                  <span>{exitDetails.comments}</span>
                </div>
              </li>
            </ul>
          </Card>
          <Card className="card ticketList d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
            <h4 className="font-16 hblack bold">Manager Details</h4>
            <ul className="empExit">
              <li className="d-flex">
                <div>
                  <label>Approved Resignation Date</label>
                  <span>
                    {managerDetails.date_of_resignation
                      ? moment(managerDetails.date_of_resignation).format(
                        "MMM DD, YYYY"
                      )
                      : "Pending"}
                  </span>
                </div>
                <div>
                  <label>Approved LWD</label>
                  <span>
                    {managerDetails.date_of_lwd
                      ? moment(managerDetails.date_of_lwd).format(
                        "MMM DD, YYYY"
                      )
                      : "Pending"}
                  </span>
                </div>
              </li>
            </ul>
          </Card>
          {managerDetails.ndc_status === 0 && exitDetails.exit_status == 0 && (
            <div className="col-lg-12 text-center">
              <input
                type="submit"
                className="btn btn-primary"
                value={
                  this.state.disableButtons
                    ? "Please wait.."
                    : "Withdraw Resignation"
                }
                onClick={(e) => this.withDrawResignation(e)}
                disabled={this.state.disableButtons}
              />
            </div>
          )}
        </Col>
      </Row>
    );
  }
  renderNDCList() {
    console.log('this.state.NDCListDetails ==========> ', this.state.NDCListDetails);
    if (typeof this.state.NDCListDetails !== undefined && this.state.NDCListDetails.length > 0) {
      return (
        this.state.NDCListDetails.map((exit) => {
          return (
            <tr>
              <td>{exit.empName}</td>
              <td>{exit.empDeparment}</td>
              <td>{exit.ndc_status == 1 ? "Approved" : (exit.ndc_status == 2 ? "Retained" : "Pending")}</td>
              <td>{exit.comments}</td>
              <td>
                <span className="bold">
                  {moment(exit.created_at).format(
                    "MMM DD, YYYY"
                  )}
                </span>
              </td>
              {/* <td>
                {this.loadAttachments(exit.attachments)}
              </td> */}
            </tr>
          );
        })
      )
    } else {
      return (
        <tr>
          <td>No NDC Available</td>
        </tr>
      )
    }
  }
  loadNDCDetails() {
    return (
      <Row>
        <Col>
          <Card className="card filterList d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
            <h4 className="font-16 hblack  border-none">
              No Due Certificate (NDC) List
            </h4>

            <Table className=" table leaveTable ">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Approve Status</th>
                  <th>Comments</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tbody>
                {this.renderNDCList()}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    );
  }
  render() {
    const empDetails = this.state.empDetails;
    return (
      <>
        <Row>
          <Col>
            {this.loadAlertMessage()}
            <Card className="card ticketList d-block pl-4 pr-4 pt-4 pb-4 br-3 mb-4 shadow-sm card card">
              <h4 className="font-16 hblack  bold">Employee Details</h4>

              <ul className="empExit">
                <li className="d-flex">
                  <div>
                    <label>Employee Name</label>
                    <span>{empDetails.empName}</span>
                  </div>
                  <div>
                    <label>Location</label>
                    <span>{empDetails.workLocation}</span>
                  </div>
                  {/* <div>
                    <label>Resignation Date</label>
                    <span>{empDetails.date_of_resignation!=null?moment(empDetails.date_of_resignation).format('MMM DD, YYYY'):"-"}</span>
                  </div> */}
                  <div>
                    <label>Contact Number</label>
                    <span className="">{empDetails.phoneNumber}</span>
                  </div>
                </li>
              </ul>
            </Card>
          </Col>
        </Row>
        {!this.state.exitDetails && this.loadExitForm()}
        {this.state.exitDetails && this.loadExitFormDetails()}
        {this.state.NDCListDetails && this.loadNDCDetails()}
      </>
    );
  }
}

export default EmployeeExitForm;

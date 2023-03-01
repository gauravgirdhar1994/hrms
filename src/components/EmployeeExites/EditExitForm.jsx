import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { Card, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import moment from "moment";
import axios from "axios";
import config from "../../../src/config/config";
const BEARER_TOKEN = "Bearer " + localStorage.getItem("userData");

class EditExitForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date_of_resignation: "",
      date_of_lwd: "",
      reason: "",
      comments: "",
      attachments: "",
      exit_status: 0,
      hr_approval: 0,
      validateFields: {},
      showAlertMessage: false,
      empDetails: {},
      exitDetails: {},
      managerDetails: {},
      exitReasonList: [],
      disableButtons: false,
      supervisorId: "",
      isLoaded: false,
      exit_id: '',
      exit_emp_id: '',
      viewDetail: false,
      editDetail: false
    };
    this.onChangeHandler1 = this.onChangeHandler1.bind(this);
    this.loadExitForm = this.loadExitForm.bind(this);
    this.onChangeResignDate1 = this.onChangeResignDate1.bind(this);
    this.editExitApproval = this.editExitApproval.bind(this);
    this.cancelSubmit = this.cancelSubmit.bind(this);
  }
  componentDidMount() {
    console.log("this.props.empDetails ====> ", this.props.exitDetails);
    this.setState({
      empDetails: this.props.empDetails,
      exitDetails: this.props.exitDetails,
      managerDetails: this.props.managerDetails,
      NDCListDetails: this.props.NDCListDetails,
      supervisorId: this.props.supervisorId,
      exitReasonList: this.props.exitReasonList,
      isLoaded: true,
      date_of_resignation: moment(
        new Date(this.props.exitDetails.date_of_resignation).toISOString()
      ).toDate(),
      date_of_lwd: moment(
        new Date(this.props.exitDetails.date_of_lwd).toISOString()
      ).toDate(),
      reason: this.props.exitDetails.reason_of_exit,
      reasonText: this.props.exitDetails.reasonText,
      comments: this.props.exitDetails.comments,
      exit_status: this.props.managerDetails.ndc_status, // pending
      hr_approval: this.props.managerDetails.hr_approval == null ? 0 : this.props.managerDetails.hr_approval,
      exit_id: this.props.exitDetails.id,
      exit_emp_id: this.props.exitDetails.empId,
      disableButtons: false,
      viewDetail: this.props.NDCListDetails.length > 0 ? true : false
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
  onChangeResignDate1 = (date_of_resignation) =>
    this.setState({ date_of_resignation });
  onChangeLWDDate1 = (date_of_lwd) => this.setState({ date_of_lwd });
  onChangeHandler1(e) {
    if (e.target.name == "attachments") {
      this.validateImageExt(e.target.files[0]);
      this.setState({ attachments: e.target.files[0] });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  }
  validateImageExt(image) {
    console.log('image===>', image);
    let imgVal = image.name.toLowerCase(),
      regex = new RegExp("(.*?)\.(png|PNG|jpg|JPG|jpeg|JPEG|pdf)$");
    let isImage = true;
    let message = "";
    console.log('image===>', image);
    if (!(regex.test(imgVal))) {
      message = 'Please upload PDF, JPG or PNG file only.';
      isImage = false;
    }
    this.setState({
      validateFields: {
        ...this.state.validateFields,
        attachments: message
      }
    });
    return isImage;
  }
  validateForm() {
    let fields = this.state.validateFields;
    let validations = {};
    let isFormValid = true;
    // console.log('this.state =====> ', (this.state.exit_status===0));
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
    if (this.state.comments == "" || typeof this.state.comments == "undefined") {
      validations["comments"] = "Please add comments";
      isFormValid = false;
    }
    if (this.state.exit_status === "" || typeof this.state.exit_status == "undefined") {
      validations["exit_status"] = "Please select status";
      isFormValid = false;
    }
    if (this.state.attachments != "") {
      if (!this.validateImageExt(this.state.attachments)) {
        isFormValid = false;
        validations["attachments"] = 'Please upload PDF, JPG or PNG file only.';
      }
    }
    this.setState({ validateFields: validations });
    return isFormValid;
  }
  onSubmitHandler(e) {
    e.preventDefault();
    this.setState({ disableButtons: true });
    if (this.validateForm()) {
      const form = e.target;
      // let formdata = {};
      let formdata = new FormData();
      formdata.append("date_of_resignation", this.state.date_of_resignation);
      formdata.append("date_of_lwd", this.state.date_of_lwd);
      formdata.append("reason", this.state.reason);
      formdata.append("comments", this.state.comments);
      formdata.append("supervisorId", this.state.supervisorId);
      formdata.append("exit_status", this.state.exit_status);
      formdata.append("exit_id", this.state.exit_id);
      formdata.append("exit_emp_id", this.state.exit_emp_id);
      formdata.append("atype", !this.state.editDetail ? 1 : 2);
      formdata.append("attachments", this.state.attachments);


      console.log("formdata ===> ", formdata);
      const headers = {
        Authorization: BEARER_TOKEN,
        "Content-Type": "multipart/form-data",
      };
      const API_END_POINT = !this.state.editDetail ? "/exit/approve" : "/exit/update-approval";

      const s = axios
        .post(config.API_URL + API_END_POINT, formdata, {
          headers: headers,
        })
        .then((res) => {
          if (res.data.success) {
            let text = this.state.exit_status == 1 ? 'approved' : (this.state.exit_status == 2 ? 'retained' : 'submitted');
            this.setState({
              NDCListDetails: res.data.NDCListDetails,
              showAlertMessage: true,
              alertMessage: "Resignation request has been successfully " + text + "!",
              disableButtons: false,
              viewDetail: true,
              reasonText: res.data.reasonText,
            });
          } else {
            alert(res.data.message);
          }
        });
    }
    this.setState({ disableButtons: false });
  }

  loadExitForm() {
    const exitDetails = this.state.exitDetails;
    return (
      <Row>
        <Col>
          <Card className="card filterList d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
            <h4 className="font-16 hblack  border-none">Resignation Request</h4>
            <form name="resignForm" /* onSubmit={(e) => this.onSubmitHandler(e)} */>
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
                        /* minDate={moment().toDate()} */
                        className="form-control"
                        dateFormat={config.DP_INPUT_DATE_FORMAT}
                        selected={this.state.date_of_resignation}
                        value={this.state.date_of_resignation}
                        name="date_of_resignation"
                        onChange={this.onChangeResignDate1}
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
                        onChange={this.onChangeLWDDate1}
                        autoComplete="off"
                      />
                      <div className="errMsg">
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
                        onChange={(e) => this.onChangeHandler1(e)}
                      >
                        <option value="">Select Reason</option>
                        {this.state.exitReasonList.map(reason => {
                          return <option value={reason.id} selected={this.state.reason == reason.id ? true : false}>{reason.reason}</option>
                        })}
                      </select>
                      <div className="errMsg">
                        {this.state.validateFields.reason}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 pb-3">
                  <div className="row">
                    <div className="col-sm-4">
                      <label htmlFor="ticket_type">Comments</label>
                    </div>
                    <div className="col-sm-6">
                      <textarea
                        placeholder=""
                        className="form-control"
                        name="comments"
                        onChange={(e) => this.onChangeHandler1(e)}
                        value={this.state.comments}
                      >
                        {this.state.comments}
                      </textarea>
                      <div className="errMsg">
                        {this.state.validateFields.comments}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 pb-3">
                  <div className="row">
                    <div className="col-sm-4">
                      <label htmlFor="ticket_type">Status</label>
                    </div>
                    <div className="col-sm-6">
                      <select
                        className="form-control"
                        name="exit_status"
                        id="exit_status"
                        onChange={(e) => this.onChangeHandler1(e)}
                      >
                        <option value="">Select Status</option>
                        <option
                          value="0"
                          selected={this.state.exit_status == 0 ? true : false}
                        >
                          Pending
                        </option>
                        <option
                          value="1"
                          selected={this.state.exit_status == 1 ? true : false}
                        >
                          Approved
                        </option>
                        <option
                          value="2"
                          selected={this.state.exit_status == 2 ? true : false}
                        >
                          Retained
                        </option>
                        <option
                          value="3"
                          selected={this.state.exit_status == 3 ? true : false}
                        >
                          Rejected
                        </option>
                      </select>

                      <div className="errMsg">
                        {this.state.validateFields.exit_status}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 pb-3">
                  <div className="row">
                    <div className="col-sm-4">
                      <label htmlFor="ticket_type">Upload Document</label>
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="file"
                        name="attachments" className="custom-input-file"
                        onChange={(e) => this.onChangeHandler1(e)}
                      />
                      <div className="errMsg">
                        {this.state.validateFields.attachments}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 text-center">
                  <input
                    type="reset"
                    className="btn btn-outline-primary mr-2"
                    value="Cancel"
                    onClick={(e) => this.cancelSubmit(e)}
                    disabled={this.state.disableButtons}
                  />
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value={this.state.disableButtons ? "Submitting" : "Submit"}
                    onClick={(e) => this.onSubmitHandler(e)}
                    disabled={this.state.disableButtons}
                  />
                </div>
              </Row>
            </form>
          </Card>
        </Col>
      </Row>
    );
  }
  editExitApproval() {
    this.setState({ editDetail: true, viewDetail: false })
  }
  cancelSubmit(e) {
    // e.preventDefault()
    this.setState({ editDetail: false, viewDetail: this.state.editDetail ? true : false })
  }
  loadManagerComments() {
    return (
      <Row>
        <Col>
          <Card className="card filterList d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
            <h4 className="font-16 hblack  border-none">Resignation Request</h4>
            <Row>
              <div className="col-sm-6 pb-3">
                <div className="row">
                  <div className="col-sm-4">
                    <label htmlFor="ticket_type">
                      Date of Resignation
                      </label>
                  </div>
                  <div className="col-sm-6">
                    {moment(this.state.date_of_resignation).format('MMM DD, YYYY')}
                  </div>
                </div>
              </div>
              <div className="col-sm-6 pb-3">
                <div className="row">
                  <div className="col-sm-4">
                    <label htmlFor="ticket_type">Date of LWD</label>
                  </div>
                  <div className="col-sm-6">
                    {moment(this.state.date_of_lwd).format('MMM DD, YYYY')}
                  </div>
                </div>
              </div>
              <div className="col-sm-6 pb-3">
                <div className="row">
                  <div className="col-sm-4">
                    <label htmlFor="ticket_type">Reason</label>
                  </div>
                  <div className="col-sm-6">
                    {this.state.reasonText}
                  </div>
                </div>
              </div>
              <div className="col-sm-6 pb-3">
                <div className="row">
                  <div className="col-sm-4">
                    <label htmlFor="ticket_type">Comments</label>
                  </div>
                  <div className="col-sm-6">
                    {this.state.comments}
                  </div>
                </div>
              </div>
              <div className="col-sm-6 pb-3">
                <div className="row">
                  <div className="col-sm-4">
                    <label htmlFor="ticket_type">Status</label>
                  </div>
                  <div className="col-sm-6">
                    {this.state.exit_status == 1 ? "Approved" : (this.state.exit_status == 2 ? "Retained" : "Pending")}
                  </div>
                </div>
              </div>
              {
                this.state.hr_approval == 0 ? (
                  <div className="col-lg-12 text-center">
                    <input
                      type="submit"
                      className="btn btn-primary"
                      value={this.state.disableButtons ? "Editing" : "Edit"}
                      onClick={(e) => this.editExitApproval(e)}
                      disabled={this.state.disableButtons}
                    />
                  </div>

                ) : ('')
              }
            </Row>
          </Card>
        </Col>
      </Row>
    );
  }
  loadAttachments(image) {
    if (image != null) {
      return (
        <>
          <a href={config.BASE_URL + '/upload/tickets/' + image} alt={image} target="_blank">View Doc</a>
        </>
      );
    } else {
      return "";
    }
  }
  renderNDCList() {
    // console.log('this.state.NDCListDetails ==========> ', this.state.NDCListDetails);
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
              <td>
                {this.loadAttachments(exit.attachments)}
              </td>
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
                  <th>Action</th>
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
    console.log('editDetail ===> ', this.state.editDetail, this.state.viewDetail);
    const empDetails = this.state.empDetails;
    const exitDetails = this.state.exitDetails;
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
                    <span>{empDetails.date_of_resignation !== null
                      ? moment(empDetails.date_of_resignation).format("MMM DD, YYYY")
                      : "-"}</span>
                  </div> */}
                  {/* <div>
                    <label>Resignation Status</label>
                    <span>{empDetails.emp_status !== null
                      ?  empDetails.emp_status === 0 ? 'Pending' : empDetails.emp_status === 1 ? 'Approved' : ''
                      : ''}</span>
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

        {this.state.isLoaded && !this.state.viewDetail && this.state.editDetail && this.loadExitForm()}
        {this.state.isLoaded && !this.state.viewDetail && !this.state.editDetail && this.loadExitForm()}
        {this.state.isLoaded && this.state.viewDetail && this.loadManagerComments()}
        {this.state.isLoaded && this.loadNDCDetails()}
      </>
    );
  }
}

export default EditExitForm;

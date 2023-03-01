import React, { Component } from "react";
import { Row, Col, Table } from "reactstrap";
import { Modal, Button, Card, Form } from "react-bootstrap"
import DatePicker from "react-datepicker";
import moment from "moment";
import axios from "axios";
import config from "../../../src/config/config";
const BEARER_TOKEN = "Bearer " + localStorage.getItem("userData");

class EmployeeExitForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeExitDetails: [],
      empDetails: {},
      exitDetails: {},
      managerDetails: {},
      supervisorId: "",
      role: localStorage.getItem("roleSlug"),
      show: false,
      btnDisable: false,
      visaCancelForm: {
        date_of_lwd: '',
        orgId: '',
        empId: '',
        exitId: ''
      },
      validateFields: {}
    };
  }
  componentDidMount() {
    this.setState({
      empDetails: this.props.empDetails,
      employeeExitDetails: this.props.employeeExitDetails,
      supervisorId: this.props.supervisorId,
    });
  }
  editExitDetails(orgId, empId, exitId) {
    // console.log('exitId ======> ', exitId);
    this.props.loadEditExitForm(orgId, empId, exitId);
  }
  addLWDandUploadVisaCancelation(orgId, empId, exitId, date_of_lwd) {
    // console.log(' moment(date_of_lwd).format(config.DP_INPUT_DATE_FORMAT) ===> ', moment(date_of_lwd).format(config.DP_INPUT_DATE_FORMAT))
    this.setState({
      show: true,
      visaCancelForm: {
        orgId,
        empId,
        exitId,
        date_of_lwd: moment(new Date(date_of_lwd).toISOString()).toDate()
      }
    })
  }
  loadActionButton(exit) {
    if (this.state.role == 'hr') {
      if (exit.hr_approval == 1) {
        return (
          <a href={config.BASE_URL + '/upload/tickets/' + exit.visa_for_cancellation} alt={exit.visa_for_cancellation} target="_blank">View Doc</a>
        )
      } else {
        return (
          <span
            className="pnk"
            onClick={() => this.addLWDandUploadVisaCancelation(exit.orgId, exit.empId, exit.exitId, exit.date_of_lwd)}
            style={{ cursor: "pointer" }}
          >
            Upload Doc
          </span>
        )
      }
    } else {
      return (
        <span
          className="pnk"
          onClick={() => this.editExitDetails(exit.orgId, exit.empId, exit.exitId)}
          style={{ cursor: "pointer" }}
        >
          View
        </span>
      )
    }
  }
  loadExitLists() {
    console.log('this.props.employeeExitDetails.length=====>', this.props.employeeExitDetails.length);
    if (this.props.employeeExitDetails.length > 0) {
      return this.props.employeeExitDetails.map((exit) => {
        return (
          <tr>
            <td>{exit.empname}</td>
            <td>{"-"}</td>
            <td>{exit.supervisor}</td>
            <td>
              <span className="bold">
                {moment(exit.date_of_resignation).format(
                  "DD-MMM-YYYY"
                )}
              </span>
            </td>
            <td>
              <span className="bold">
                {moment(exit.date_of_lwd).format("DD-MMM-YYYY")}
              </span>
            </td>
            <td>{exit.exit_status == 1 ? "Approved" : (exit.exit_status == 2 ? "Retained" : (exit.exit_status == 3 ? "Withdrawn" : "Pending"))}</td>
            <td>{exit.ndc_status == 1 ? "All Clear" : "Pending"}</td>
            <td>
              {this.loadActionButton(exit)}
            </td>
          </tr >
        );
      })
    } else {
      return <tr><td colSpan="8">No Record Found.</td></tr>
    }
  }
  onChangeLWDDate1 = (date_of_lwd) => this.setState({
    visaCancelForm: {
      ...this.state.visaCancelForm,
      date_of_lwd
    }
  });

  loadEmployeeExitList() {
    return (
     
          <Card className="card filterList d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
            <h4 className="font-16 hblack  border-none">
              Resignation List for My Team
            </h4>
            
            <Table responsive className=" table leaveTable ">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>HR Manager</th>
                  <th>Supervisor 1</th>
                  <th>Date of Resignation</th>
                  <th>Expected LWD</th>
                  <th>Resignation Status</th>
                  <th>NDC Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {this.loadExitLists()}

              </tbody>
            </Table>
           
          </Card>
       
    );
  }
  handleShow = () => {
    this.setState({ show: true })
  };
  handleClose = () => {
    this.setState({ show: false })
  };

  handleInputs(e) {
    /* this.setState({
      visaCancelForm: {
        ...this.state.visaCancelForm,
        attachments: e.target.files[0]
      }
    });
  } */
    if (e.target.name == "attachments") {
      this.validateImageExt(e.target.files[0]);
      this.setState({
        visaCancelForm: {
          ...this.state.visaCancelForm,
          attachments: e.target.files[0]
        }
      });
    } else {
      this.setState({
        visaCancelForm: {
          ...this.state.visaCancelForm,
          [e.target.name]: e.target.value
        }
      });
    }
  }
  validateImageExt(image) {
    console.log('image===>', image);
    let imgVal = image.name.toLowerCase(),
      regex = new RegExp("(.*?)\.(png|jpg|jpeg|pdf)$");
    let isImage = true;
    let message = "";
    console.log('Image validation ===> ', !(regex.test(imgVal)))
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
    console.log('attachments ====> ', message)
    return isImage;
  }
  validateForm() {
    const data = this.state.visaCancelForm;
    console.log('data ===> ', data)
    let isValid = true;
    let validation = {};
    if (data.date_of_lwd == ''
    || data.date_of_lwd === null
    || typeof data.date_of_lwd == "undefined"
     ) {
      isValid = false;
      validation.date_of_lwd = 'Please enter the date of last working day'
    }
    if (data.attachments == '' || typeof data.attachments == "undefined") {
      isValid = false;
      validation.attachments = 'Please upload VISA cancellation document.'
    } else if(this.state.validateFields.attachments!=''){
      isValid = false;
      validation.attachments = 'Please upload PDF, JPG or PNG file only.'
    }
    this.setState({ validateFields: validation })
    return isValid;
  }
  onSubmitHandler(e) {
    e.preventDefault();
    this.setState({ disableButtons: true });
    if (this.validateForm()) {
      const form = e.target;
      let formdata = new FormData();
      formdata.append("date_of_lwd", this.state.visaCancelForm.date_of_lwd);
      formdata.append("exit_id", this.state.visaCancelForm.exitId);
      formdata.append("exit_emp_id", this.state.visaCancelForm.empId);
      formdata.append("attachments", this.state.visaCancelForm.attachments);


      console.log("formdata ===> ", formdata);
      const headers = {
        Authorization: BEARER_TOKEN,
        "Content-Type": "multipart/form-data",
      };

      const s = axios
        .post(config.API_URL + '/exit/update-hr-approval', formdata, {
          headers: headers,
        })
        .then((res) => {
          if (res.data.success) {
            let text = this.state.exit_status == 1 ? 'approved' : (this.state.exit_status == 2 ? 'retained' : 'submitted');
            this.setState({
              showAlertMessage: true,
              alertMessage: res.data.message,
              disableButtons: false,
              show: false
            });
            this.props.getEmployeeDetail();
          } else {
            alert(res.data.message);
          }
        });
    }
    this.setState({ disableButtons: false });
  }
  loadVisaCancellationPopUp() {
    // console.log('this.state ===.> ,, ', this.state.visaCancelForm)
    return (
      <Modal show={this.state.show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={e => this.onSubmitHandler(e)}>

            <div className="row mb-3 mt-2">
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
                  selected={this.state.visaCancelForm.date_of_lwd}
                  value={this.state.visaCancelForm.date_of_lwd}
                  name="date_of_lwd"
                  onChange={this.onChangeLWDDate1}
                  autoComplete="off"
                />
                <div className="errMsg">
                  {this.state.validateFields.date_of_lwd}
                </div>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-sm-4">
                <label for="attachments">Visa Cancellation Document</label>
              </div>
              <div class="col-sm-6">
                <input
                  type="file"
                  name="attachments" className="custom-input-file"
                  onChange={(e) => this.handleInputs(e)}
                />
                <div class="errMsg">
                  {this.state.validateFields.attachments}
                </div>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-sm-12" style={{ textAlign: "center" }}>
                <Button variant="outline-primary mr-2" onClick={this.handleClose} disabled={this.state.btnDisable}>
                  Close
              </Button>
                <Button type="submit" variant="primary" onClick={e => this.onSubmitHandler(e)} disabled={this.state.btnDisable}>
                  Save
              </Button>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    )
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
  render() {
    console.log('validateFields ====> ', this.state.validateFields);
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
                    <span>{empDetails.date_of_resignation !== null
                      ? moment(empDetails.date_of_resignation).format("MMM DD, YYYY")
                      : "-"}</span>
                  </div>
                  <div>
                    <label>Resignation Status</label>
                    <span>{empDetails.exit_status !== null
                      ?  empDetails.exit_status === 0 ? 'Pending' : empDetails.exit_status === 1 ? 'Approved' : ''
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

        {this.state.employeeExitDetails && this.loadEmployeeExitList()}

        {this.state.role == 'hr' && this.loadVisaCancellationPopUp()}
      </>
    );
  }
}

export default EmployeeExitForm;

/* eslint-disable */
import React, { Component } from "react";
import { Row, Col, Card, Table } from "reactstrap";
import { FaArrowLeft } from 'react-icons/fa';
import axios from "axios";
import EmployeDetails from "../components/EmployeeExites/EmployeeDetail";
import EmployeeExitForm from "../components/EmployeeExites/EmployeeExitForm";
import EmployerPanel from "../components/EmployeeExites/EmployerPanel";
import EditExitForm from "../components/EmployeeExites/EditExitForm";
import config from "../../src/config/config";
const BEARER_TOKEN = "Bearer " + localStorage.getItem("userData");

class EmployeeExits extends Component {
  constructor() {
    super();
    this.state = {
      empDetails: [],
      exitDetails: {},
      managerDetails: {},
      NDCListDetails: [],
      supervisorList: {},
      exitReasonList: [],
      editExitForm: false,
      supervisorId: "",
      isLoading: true,
      showAlertMessage: true,
      roleName: "",
      goback: false
    };
    this.loadEditExitForm = this.loadEditExitForm.bind(this);
    this.goBackToListPage = this.goBackToListPage.bind(this);
    this.initiateResign = this.initiateResign.bind(this);
    this.getEmployeeDetail = this.getEmployeeDetail.bind(this);
  }
  componentDidMount() {
    this.getEmployeeDetail();
  }
  getEmployeeDetail() {
    const options = {
      method: "GET",
      headers: {
        Authorization: BEARER_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    fetch(config.API_URL + "/exit/employee-details", options)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(
            "data.empData.managerDetails===>",
            data.empData.managerDetails
          );
          this.setState({
            ...this.state,
            empDetails: data.empData.empDetails[0],
            exitDetails: data.empData.empExitDetails,
            managerDetails: data.empData.managerDetails,
            employeeExitDetails: data.empData.employeeExitDetails,
            NDCListDetails: data.empData.NDCListDetails,
            supervisorList: data.empData.supervisorList,
            exitReasonList: data.empData.exitReasons,
            isLoading: false,
            roleName: data.empData.empDetails[0].roleName,
            supervisorId: data.empData.empDetails[0].supervisorId,
          });
        } else {
          this.setState({
            ...this.state,
            empDetails: [],
            exitDetails: {},
            managerDetails: {},
            supervisorList: {},
            supervisorId: "",
            exitReasonList: [],
            isLoading: false,
            roleName: "",
          });
        }
      });
  }
  renderExitFormDetails() {
    console.log('is users111111 => ', this.state.roleName, (this.state.roleName === "SUPERVISOR"))
    if (this.state.editExitForm) {
      console.log('this.state.exitDetails ====> ', this.state.exitDetails);
      return (
        <div className="col-sm-9">
          <EditExitForm
            empDetails={this.state.empDetails}
            exitDetails={this.state.exitDetails}
            managerDetails={this.state.managerDetails}
            supervisorId={this.state.supervisorId}
            showAlertMessage={this.state.showAlertMessage}
            NDCListDetails={this.state.NDCListDetails}
            roleName={this.state.roleName}
            initiateResign={this.initiateResign}
            exitReasonList={this.state.exitReasonList}
          />
        </div>
      );
    } else {
      console.log('is users => ', this.state.roleName, (this.state.roleName === "SUPERVISOR"))
      if (this.state.roleName === "SUPERVISOR") {
        return (
          <div className="col-sm-9">
            <EmployerPanel
              empDetails={this.state.empDetails}
              employeeExitDetails={this.state.employeeExitDetails}
              supervisorId={this.state.supervisorId}
              loadEditExitForm={this.loadEditExitForm}
              roleName={this.state.roleName}
              getEmployeeDetail={this.getEmployeeDetail}
            />
          </div>
        );
      } else {
        return (
          <div className="col-sm-9">
            <EmployeeExitForm
              empDetails={this.state.empDetails}
              exitDetails={this.state.exitDetails}
              managerDetails={this.state.managerDetails}
              supervisorId={this.state.supervisorId}
              showAlertMessage={this.state.showAlertMessage}
              NDCListDetails={this.state.NDCListDetails}
              roleName={this.state.roleName}
              initiateResign={this.initiateResign}
              exitReasonList={this.state.exitReasonList}
            />
          </div>
        );
      }
    }
  }

  loadEditExitForm(orgId, empId, exitId) {
    this.setState({
      isLoading: true,
    });
    const options = {
      method: "GET",
      headers: {
        Authorization: BEARER_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json",
      }
    };
    fetch(config.API_URL + "/exit/edit-details/" + orgId + "/" + empId + "/" + exitId, options)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          this.setState({
            ...this.state,
            empDetails: data.empData.empDetails[0],
            exitDetails: data.empData.empExitDetails,
            managerDetails: data.empData.managerDetails,
            employeeExitDetails: data.empData.employeeExitDetails,
            supervisorList: data.empData.supervisorList,
            NDCListDetails: data.empData.NDCList,
            isLoading: false,
            editExitForm: true,
            roleName: data.empData.empDetails[0].roleName,
            supervisorId: data.empData.empDetails[0].supervisorId,
            goback: true
          });
        } else {
          this.setState({
            ...this.state,
            empDetails: [],
            exitDetails: {},
            managerDetails: {},
            supervisorList: {},
            NDCListDetails: [],
            supervisorId: "",
            isLoading: false,
            // roleName: "",
            goback: false
          });
        }
      });
  }
  initiateResign(initiate = true) {
    this.setState({ roleName: initiate ? 'EMPLOYEE' : 'SUPERVISOR' })
  }
  loadExitFormDetailsOnPageLand() {
    return (
      <>
        <div className="col-sm-3">
          <EmployeDetails
            empDetails={this.state.empDetails}
            supervisorList={this.state.supervisorList}
            roleName={this.state.roleName}
            initiateResign={this.initiateResign}
          />
        </div>
        {this.renderExitFormDetails()}
      </>
    );
  }
  goBackToListPage() {
    this.setState({ editExitForm: false, goback: false })
    this.getEmployeeDetail();
  }
  render() {
    let formData = "Loading..";
    if (!this.state.isLoading) {
      formData = this.loadExitFormDetailsOnPageLand();
    }
    console.log('rolename', this.state.roleName);
    return (

     <>
        <Row>
          <div className="col-sm-12" style={{marginBottom:"10px"}}>
            <Col style={{paddingRight:"0px"}}>
              <h4>
                Employee Exit
                {this.state.roleName === "SUPERVISOR" && (
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="Initiate Resignation"
                    disabled={this.state.empDetails.exit_status === 0 || this.state.empDetails.exit_status === 1 ? 'disabled' : ''}
                    style={{float:"right"}}
                    onClick={(e) => this.initiateResign(e)}
                  />
                )}
              </h4>
              {this.state.goback && (<span
                className="font-16 block pointer margin-bottom-20"
                onClick={(e) => this.goBackToListPage(e)}
              >
                {" "}
                <FaArrowLeft /> Go Back{" "}
              </span>
              )}
            </Col>
          </div>
          {formData}
        </Row>
      </>
    );
  }
}

export default EmployeeExits;

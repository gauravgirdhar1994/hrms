
import React, { Component } from 'react'
import { Modal, Button, Card, Table, Form, Row } from "react-bootstrap";
import axios from 'axios';
import config from '../../config/config';
import { ToastContainer, toast } from 'react-toastify';
import { Redirect } from "react-router-dom";

class DepartmentTagging extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      orgId: localStorage.getItem("orgId"),
      token: localStorage.getItem("userData"),
      redirect: false,
      positions: [],
      locations: [],
      managers: [],
      empType: [],
      departments: [],
      validateFields: {},
      dropdowns: ['positionId','deptId','supervisorId','workLocation','employmentType'],
      fields: [{'basic' : 'Basic' , 'accommodation' : 'Accommodation', 'other' : 'Other', 'transportation' : 'Transportation', 'telephone' : 'Telephone Expenses'}]

    }
    this.getPositions = this.getPositions.bind(this);
    this.getLocations = this.getLocations.bind(this);
    this.getEmpType = this.getEmpType.bind(this);
    this.getDepartments = this.getDepartments.bind(this);
    this.getManagers = this.getManagers.bind(this);

  }

  handleShow = () => {
    this.setState({ show: true })
  };

  handleClose = () => {

    this.setState({ show: false })
  };

  handleChange = (event) => {
    // console.log('Input event', event.target.value);
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      data: {
        ...this.state.data, [name]: value
      },
      validateFields: {
        ...this.state.validateFields, [name]: ''
      }
    })
  }

  componentDidMount = () => {
    if (this.props.id) {
      this.refreshData();
    }
  }

  refreshData() {
    var bearer = 'Bearer ' + this.state.token;
    let apiUrl = '';
    if (this.props.id) {
      apiUrl = config.API_URL + '/employee/onboarding/list/' + this.state.orgId + "?id=" + this.props.id + "&tab=2";
    }

    axios.get(apiUrl, { headers: { Authorization: bearer } })
      .then(r => {
        this.setState({ data: r.data.onboardingData.rows[0], dataCount: r.data.onboardingData.count })
        this.getPositions();
        this.getLocations();
        this.getEmpType();
        this.getDepartments();
        this.getManagers();
      })
      .catch((error) => {
        console.log("API ERR: ", error);
        console.error(error);
        // res.json({ error: error });
      });
  }

  handleSubmit = () => {

    let datas = this.state.data;
    datas.orgId = this.state.orgId;
    console.log('Form Data',this.refs);

    if(this.state.dropdowns){
      this.state.dropdowns.map((item,key)=>{
        console.log('Dropdown Item', item);
          datas[item] = this.refs[item].value;
      })
    }
    const apiUrl = config.API_URL + '/employee/onboarding/edit/' + this.props.id + "?tab=2";
    var bearer = 'Bearer ' + this.state.token;
    const headers = {
      "Authorization": bearer,
      "Content-Type": "application/json"
    }

    // console.log('headers => ', headers);
    if (this.validateForm()) {
    axios.post(apiUrl, datas, { headers: headers })
      .then(res => {
        if (res.status == 200) {
          toast.success(res.data.message);
          setTimeout(function () {
            toast.dismiss()
          }, 2000)
          this.props.setActiveTab(3);
        }
        else {
          toast.error(res.data.message);
          setTimeout(function () {
            toast.dismiss()
          }, 2000)
        }
        // console.log('POST response',res);
      })
    }
  }

  getPositions() {
    var bearer = 'Bearer ' + this.state.token;
    axios.get(config.API_URL + '/common/positions/' + this.state.orgId, { headers: { Authorization: bearer } })
      .then(r => {
        //console.log('Positions Response', r);
        if (r.status == 200) {
          var arrTen = [];
          for (var k = 0; k < r.data.Positions.length; k++) {
            arrTen.push(<option key={r.data.Positions[k].id} selected={this.state.data ? (this.state.data.positionId === r.data.Positions[k].id ? 'selected' : '') : ''} value={r.data.Positions[k].id}> {r.data.Positions[k].positionName} </option>);
          }
          this.setState({ positions: arrTen });
        }
      })
      .catch((error) => {
        console.log("API ERR: ");
        console.error(error);
        // res.json({ error: error });
      });
  }
  getLocations() {
    var bearer = 'Bearer ' + this.state.token;
    axios.get(config.API_URL + '/common/locations/' + this.state.orgId, { headers: { Authorization: bearer } })
      .then(r => {
        //console.log('Location Response', r);
        if (r.status == 200) {
          var arrTen = [];
          var locations1 = [];
          for (var k = 0; k < r.data.Locations.length; k++) {
            arrTen.push(<option key={r.data.Locations[k].locationId} selected={this.state.data ? (this.state.data.workLocation == r.data.Locations[k].id ? 'selected' : '') : ''} value={r.data.Locations[k].locationId}> {r.data.Locations[k].locationName} </option>);
            locations1[r.data.Locations[k].locationName] = r.data.Locations[k].locationId;
          }
          this.setState({ locations: arrTen, locations1: locations1 });
        }
      })
      .catch((error) => {
        console.log("API ERR: ");
        console.error(error);
        // res.json({ error: error });
      });
  }

  getEmpType() {
    var bearer = 'Bearer ' + this.state.token;
    axios.get(config.API_URL + '/common/employmentType/' + this.state.orgId, { headers: { Authorization: bearer } })
      .then(r => {
        //console.log('EmpType Response', r);
        if (r.status == 200) {
          var arrTen = [];
          var arrEmpType = [];
          for (var k = 0; k < r.data.EmploymentType.length; k++) {
            arrTen.push(<option key={r.data.EmploymentType[k].id} selected={this.state.data ? (this.state.data.employmentType == r.data.EmploymentType[k].id ? 'selected' : '') : ''} value={r.data.EmploymentType[k].id}> {r.data.EmploymentType[k].empType} </option>);
          }
          //console.log('EmpType',arrTen);
          this.setState({ empType: arrTen });
        }
      })
      .catch((error) => {
        console.log("API ERR: ");
        console.error(error);
        // res.json({ error: error });
      });
  }
  getManagers() {
    var bearer = 'Bearer ' + this.state.token;
    axios.get(config.API_URL + '/organization/managers/' + this.state.orgId, { headers: { Authorization: bearer } })
      .then(r => {
        //console.log('EmpType Response', r);
        if (r.status == 200) {
          var arrTen = [];
          for (var k = 0; k < r.data.managers.count; k++) {
                if(this.props.editId){
                        if(r.data.managers.rows[k].id != this.props.editId){
                                arrTen.push(<option key={r.data.managers.rows[k].id} selected={this.state.data ? (this.state.data.supervisorId == r.data.managers.rows[k].id ? 'selected' : '') : ''} value={r.data.managers.rows[k].id}> {r.data.managers.rows[k].firstname} {r.data.managers.rows[k].lastname} {r.data.managers.rows[k].position ? "("+r.data.managers.rows[k].position+")" : '' }</option>);
                        }
                    }
                    else{
                        if(r.data.managers.rows[k].id != localStorage.getItem("employee")){
                                arrTen.push(<option key={r.data.managers.rows[k].id} selected={this.state.data ? (this.state.data.supervisorId == r.data.managers.rows[k].id ? 'selected' : '') : ''} value={r.data.managers.rows[k].id}> {r.data.managers.rows[k].firstname} {r.data.managers.rows[k].lastname} {r.data.managers.rows[k].position ? "("+r.data.managers.rows[k].position+")" : '' }</option>);
                        }
                    }
          }
          //console.log('EmpType',arrTen);
          this.setState({ managers: arrTen });
        }
      })
      .catch((error) => {
        console.log("API ERR: ");
        console.error(error);
        // res.json({ error: error });
      });
  }
  getDepartments() {
    var bearer = 'Bearer ' + this.state.token;
    axios.get(config.API_URL + '/common/departments/' + this.state.orgId, { headers: { Authorization: bearer } })
      .then(r => {
        console.log('department Response', r);
        if (r.status == 200) {
          var arrTen = [];
          for (var k = 0; k < r.data.Departments.length; k++) {
            arrTen.push(<option key={r.data.Departments[k].id} selected={this.state.data ? (this.state.data.deptId == r.data.Departments[k].id ? 'selected' : '') : ''} value={r.data.Departments[k].id}> {r.data.Departments[k].displayName} </option>);
          }
          this.setState({ departments: arrTen });
        }
      })
      .catch((error) => {
        console.log("API ERR: ");
        console.error(error);
        // res.json({ error: error });
      });
  }

  gotoList = () => {
    this.setState({ redirect: true });
  }

  validateForm() {
    let fields = this.state.fields[0];
    let validations = {};
    let isFormValid = true;
    if(fields){
      console.log('Payroll Fields', fields);
      for(var key in fields){
        if (
            this.state.data[key] == "" ||
            typeof this.state.data[key] == "undefined"
        ) {
            validations[key] = "Please enter " + fields[key];
            isFormValid = false;
        }
    }
    console.log('validations ============> ', validations);
    this.setState({ validateFields: validations });
    return isFormValid;
    }
  }

  render() {

    if (this.state.redirect) {
      this.setState({ redirect: false });
      return <Redirect to={{
          pathname: "/employee/on-boarding/list",
          // state:{ticketMessage: "Your ticket has been submitted succeefully!"},
      }} />
  }
  
    let totalCTC = 0;
    let incentive = 0;
    if (this.state.data) {
      if (this.state.data.incentiveType == 1) {
        incentive += this.state.data.incentive;
      }
      if (this.state.data.incentiveType == 2) {
        incentive += Number(this.state.data.incentive * 12);
      }
      if (this.state.data.incentiveType == 3) {
        incentive += Number(this.state.data.incentive * 3);
      }
      if (this.state.data.incentiveType == 4) {
        incentive += Number(this.state.data.incentive * 6);
      }
      totalCTC += Number(this.state.data.basic) + Number(this.state.data.accommodation) + Number(this.state.data.other) + Number(this.state.data.transportation) + Number(this.state.data.telephone);
      // totalCTC += Number(this.state.data.basic) + Number(this.state.data.accommodation) + Number(this.state.data.other) + Number(this.state.data.transportation) + Number(this.state.data.telephone) + Number(incentive);
    }
    
    return (
      <>
        <ToastContainer />
        <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
          
          <Row>
          <div className="col-md-6">
            <h4 className="mb-4">Department/Payroll Tagging</h4>
          </div>
          <div className="col-md-6">
            <h4 className="mb-4 font-16 float-right status-block">Status <span>{config.ONBOARDING_STATUS[this.state.data.status]}</span></h4>
          </div>
          </Row>
          <Row>
            <div className="col-sm-5 pb-3">
              <div className="row">
                <div className="col-sm-4">
                  <label for="ticket_type">Designation</label>
                </div>
                <div className="col-sm-8">
                  <select ref="positionId" name="positionId" value={this.state.data ? this.state.data.positionId : ''} onChange={this.handleChange} className="form-control custom-select">
                    <option selected disabled>Select</option>
                    {this.state.positions}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-sm-5 pb-3">
              <div className="row">
                <div className="col-sm-4">
                  <label for="priority">Report To</label>
                </div>
                <div className="col-sm-8">
                  <select ref="supervisorId" name="supervisorId" value={this.state.data ? this.state.data.supervisorId : ''} onChange={this.handleChange} className="form-control custom-select">
                    <option selected disabled>Select</option>
                    {this.state.managers}
                  </select>
                </div>
              </div>
            </div>
          </Row>

          <Row>
            <div className="col-sm-5 pb-3">
              <div className="row">
                <div className="col-sm-4">
                  <label for="ticket_type">Department</label>
                </div>
                <div className="col-sm-8">
                  <select ref="deptId" name="deptId" value={this.state.data ? this.state.data.deptId : ''} onChange={this.handleChange} className="form-control cutom-select">
                    <option selected disabled>Select</option>
                    {this.state.departments}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-sm-5 pb-3">
              <div className="row">
                <div className="col-sm-4">
                  <label for="priority">Work Location</label>
                </div>
                <div className="col-sm-8">
                  <select ref="workLocation" name="workLocation" value={this.state.data ? this.state.data.workLocation : ''} onChange={this.handleChange} className="form-control custom-select">
                    <option selected disabled>Select</option>
                    {this.state.locations}
                  </select>
                </div>
              </div>
            </div>
          </Row>

          <h4 className="mt-4 mb-4">Payroll Information</h4>



          <Row>
            <div className="col-sm-5 pb-3">
              <div className="row">
                <div className="col-sm-4">
                  <label for="ticket_type">Employee Type</label>
                </div>
                <div className="col-sm-8">
                  <select ref="employmentType" name="employmentType" value={this.state.data ? this.state.data.employmentType : ''} onChange={this.handleChange} className="form-control custom-select">
                    <option selected disabled>Select</option>
                    {this.state.empType}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-sm-5 pb-3">
              <div className="row">
                <div className="col-sm-4">
                  <label for="priority">Basic</label>
                </div>
                <div className="col-sm-8">
                  <input type="text" name="basic" value={this.state.data ? this.state.data.basic : ''} onChange={this.handleChange} className="form-control" />
                  <div class="errMsg">{this.state.validateFields['basic']}</div>
                </div>

              </div>
            </div>
          </Row>



          <Row>
            <div className="col-sm-5 pb-3">
              <div className="row">
                <div className="col-sm-4">
                  <label for="ticket_type">Accommodation</label>
                </div>
                <div className="col-sm-8">
                  <input type="text" name="accommodation" value={this.state.data ? this.state.data.accommodation : ''} onChange={this.handleChange} className="form-control" />
                  <div class="errMsg">{this.state.validateFields['accommodation']}</div>
                </div>
              </div>
            </div>
            <div className="col-sm-5 pb-3">
              <div className="row">
                <div className="col-sm-4">
                  <label for="priority">Transportation</label>
                </div>
                <div className="col-sm-8">
                  <input type="text" name="transportation" value={this.state.data ? this.state.data.transportation : ''} onChange={this.handleChange} className="form-control" />
                  <div class="errMsg">{this.state.validateFields['transportation']}</div>
                </div>

              </div>
            </div>
          </Row>



          <Row>
            <div className="col-sm-5 pb-3">
              <div className="row">
                <div className="col-sm-4">
                  <label for="ticket_type">Telephone Expenses</label>
                </div>
                <div className="col-sm-8">
                  <input type="text" name="telephone" value={this.state.data ? this.state.data.telephone : ''} onChange={this.handleChange} className="form-control" />
                  <div class="errMsg">{this.state.validateFields['telephone']}</div>
                </div>
              </div>
            </div>
            <div className="col-sm-5 pb-3">
              <div className="row">
                <div className="col-sm-4">
                  <label for="priority">Other</label>
                </div>
                <div className="col-sm-8">
                  <input type="text" name="other" value={this.state.data ? this.state.data.other : ''} onChange={this.handleChange} className="form-control" />
                  <div class="errMsg">{this.state.validateFields['other']}</div>
                </div>

              </div>
            </div>
          </Row>
          {/* <Row>
            <div className="col-sm-5 pb-3">
              <div className="row">
                <div className="col-sm-4">
                  <label for="ticket_type">Incentive</label>
                </div>
                <div className="col-sm-8">
                  <input type="text" name="incentive" value={this.state.data ? this.state.data.incentive : ''} onChange={this.handleChange} className="form-control" />
                </div>
              </div>
            </div>
            <div className="col-sm-5 pb-3">
              <div className="row">
                <div className="col-sm-4">
                  <label for="priority">Incentive Type</label>
                </div>
                <div className="col-sm-8">
                  <select ref="incentiveType" name="incentiveType" value={this.state.data ? this.state.data.incentiveType : ''} onChange={this.handleChange} className="form-control custom-select" >
                    <option selected disabled>Select</option>
                    <option value="1" selected={this.state.data && this.state.data.incentiveType == 1 ? 'selected' : ''}>Anually</option>
                    <option value="2" selected={this.state.data && this.state.data.incentiveType == 2 ? 'selected' : ''}>Monthly</option>
                    <option value="3" selected={this.state.data && this.state.data.incentiveType == 3 ? 'selected' : ''}>Quarterly</option>
                    <option value="4" selected={this.state.data && this.state.data.incentiveType == 4 ? 'selected' : ''}>Half Yearly</option>
                  
                  </select>
                </div>

              </div>
            </div>
          </Row> */}
          
          <h4 className="mt-4">Total Monthly Salary: AED {totalCTC > 0 ? Math.round(totalCTC).toLocaleString() : ''}</h4>
          
        </Card>
       
        <div className="form-group row pt-5 edit-basicinfo">
          <div className="col-lg-12 text-center">
            <input
              type="reset"
              className="btn btn-outline-primary mr-2"
              value="Cancel" onClick={this.gotoList}
            />
            <Button type="submit" variant="primary" onClick={this.handleSubmit}>
              Save
            </Button>
          </div>
        </div>
      </>
    );
  }
}

export default DepartmentTagging;
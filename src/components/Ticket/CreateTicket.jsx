/* eslint-disable */
import React, { Component } from "react";
import axios from "axios";
import { Col, Card, Row } from "reactstrap";
// import { withRouter } from "react-router";
import { Redirect } from "react-router-dom";
import DatePicker from "react-datepicker";
import moment from 'moment';
import config from "../../config/config";
const TICKET_API_URL = config.API_URL + "/ticket/add";
const TICKET_GET_ASSIGNEE_API_URL = config.API_URL + "/ticket/get-assignee/";
const TICKET_GET_PRIORITY_API_URL = config.API_URL + "/ticket/get-priority/";
const BEARER_TOKEN = "Bearer " + localStorage.getItem("userData");
const TICKET_TYPE_LEAVE = 1;

class CreateTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assigneeName: "",
      assigneeId: "",
      isTicketTypeLeave: false,
      validateFields: {},
      redirect: false,
      ticketPriority: {}
    };
    this.handleInputs = this.handleInputs.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.props.showToastMessage('Hello Toast Message!');
  }
  onChangeEndDate = end_date => this.setState({ end_date })
  onChangeStartDate = start_date => this.setState({ start_date })
  handleInputs(e) {
    // console.log(e.target.name,e.target.value);
    const { name, value } = e.target;
    let validationFieldsError = {};
    if (name == "ticket_type") {
      this.assignPriority(value);
      this.getAssigneeNameDueDate(value);
    } else if (name == "priority") {
      this.setState({ priority: value });
    } else if (name == "ticket_title") {
      this.setState({ ticket_title: value });
    } else if (name == "due_date") {
      this.setState({ due_date: value });
    } else if (name == "description") {
      this.setState({ description: value });
    } else if (name == "attachments") {
      this.setState({ attachments: e.target.files[0] });
    } else if (name == "start_date") {
      this.setState({ start_date: value });
    } else if (name == "end_date") {
      this.setState({ end_date: value });
    }
    // this.validateForm();
  }

  assignPriority(ticketType){
    const options = {
      method: "GET",
      headers: {
        Authorization: BEARER_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    fetch(TICKET_GET_PRIORITY_API_URL + ticketType, options)
      .then((response) => response.json())
      .then((data) => {
        console.log('Priority Response', data)
        this.setState({
          priority : data.priority 
        });
      });
  }
  
  getAssigneeNameDueDate(ticketType) {
    this.state;
    const options = {
      method: "GET",
      headers: {
        Authorization: BEARER_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    fetch(TICKET_GET_ASSIGNEE_API_URL + ticketType, options)
      .then((response) => response.json())
      .then((data) => {
        let assigneeId = "";
        let assigneeName = "";
        if (data.success) {
          assigneeId = data.ticketAssignee[0].assignee;
          assigneeName = data.ticketAssignee[0].assigneeName;
        }

        const currentState = { ...this.state };
        this.setState({
          ticket_type: ticketType,
          assigneeId: assigneeId,
          assigneeName: assigneeName,
          due_date: this.getDueDate(ticketType),
          isTicketTypeLeave: TICKET_TYPE_LEAVE == ticketType ? true : false,
          // validateFields:{

          // }
        });
      });
  }
  getDueDate(ticketType) {
    const { ticketTypes } = { ...this.props };
    const dueDate = ticketTypes.filter((tType) => tType.id == ticketType);
    return dueDate[0].due_date;
  }

  handleSubmit(e) {
    e.preventDefault();
    // return <Redirect to='/my-tickets'/>
    if (this.validateForm()) {
      //console.log("state data ==========> ", this.state);
      const form = e.target;
      let formdata = new FormData();
      formdata.append("ticket_type", this.state.ticket_type);
      formdata.append("priority", this.state.priority);
      formdata.append("title", this.state.ticket_title);
      formdata.append("due_date", this.state.due_date);
      formdata.append("description", this.state.description);
      formdata.append("attachments", this.state.attachments);
      if (this.state.start_date) {
        formdata.append("start_date", this.state.start_date);
      }
      if (this.state.end_date) {
        formdata.append("end_date", this.state.end_date);
      }
      formdata.append("assigned_to", this.state.assigneeId);
      formdata.append("status", 0);
      formdata.append("ticket_category", 0);

      const headers = {
        Authorization: BEARER_TOKEN,
        // "Content-Type": "multipart/form-data"
      };
      const s = axios.post(TICKET_API_URL, formdata, { headers: headers }).then((res) => {
        //console.log(res);
        //console.log(res.data);
        // this.props.showToastMessage('Your ticket has been submitted succeefully!');
        // history.push('/mytickets');
        if(res.data.success){  
/*           this.props.history.push({
            pathname: "my-tickets",
            ticketMessage: "Your ticket has been submitted succeefully!",
          }); */
          
          // return 1;
          this.setState({redirect: true});
        } else {
          alert(res.data.message);
        }
      });
      //console.log('s      ===========+++++> ', s);
      

    }
  }

  validateForm() {
    let fields = this.state.validateFields;
    let validations = {};
    let isFormValid = true;
    console.log(
      "this.state.ticket_type ============> ",
      this.state.ticket_type
    );
    if (
      this.state.ticket_type == "" ||
      typeof this.state.ticket_type == "undefined"
    ) {
      console.log("hello");
      validations["ticket_type"] = "Please select ticket type";
      isFormValid = false;
    }
    if (
      this.state.priority == "" ||
      typeof this.state.priority == "undefined"
    ) {
      validations["priority"] = "Please select priority";
      isFormValid = false;
    }
    if (
      this.state.ticket_title == "" ||
      typeof this.state.ticket_title == "undefined"
    ) {
      validations["ticket_title"] = "Please add ticket title";
      isFormValid = false;
    }
    if (
      this.state.description == "" ||
      typeof this.state.description == "undefined"
    ) {
      validations["description"] = "Please add ticket description";
      isFormValid = false;
    }
    if (this.state.ticket_type == 1) {
      if (
        this.state.start_date == "" ||
        typeof this.state.start_date == "undefined"
      ) {
        validations["start_date"] = "Please select leave start date";
        isFormValid = false;
      }
      if (
        this.state.end_date == "" ||
        typeof this.state.end_date == "undefined"
      ) {
        validations["end_date"] = "Please select leave end date";
        isFormValid = false;
      }
      if (this.state.start_date > this.state.end_date) {
        validations["start_date"] =
          "Start date cannot be greater than end date date";
        isFormValid = false;
      }
    }
    if (
      this.state.assigneeId == "" ||
      typeof this.state.assigneeId == "undefined"
    ) {
      validations["ticket_assignee"] = "No assignee available";
      isFormValid = false;
    }
    // console.log('validations ============> ', validations);
    this.setState({ validateFields: validations });
    return isFormValid;
  }

  loadTicketType(ticketType) {
    return <option value={ticketType.id}>{ticketType.ticket_type_name}</option>;
  }

  loadLeaveStartEndDateFields() {
    const { isTicketTypeLeave, validateFields } = this.state;
    // const isTicketTypeLeave = true;
    if (isTicketTypeLeave) {
      return (
        <Row>
          <div class="col-sm-6 pb-3">
            <div class="row">
              <div class="col-sm-3">
                <label for="start_date">Start Date</label>
              </div>
              <div class="col-lg-5 col-md-12 ">
                <DatePicker showYearDropdown dropdownMode= "scroll"
                  minDate={moment().toDate()}
                  className="form-control"
                  selected={this.state.start_date}
                  value={this.state.start_date}
                  name="start_date"
                  onChange={this.onChangeStartDate}
                  autoComplete="off"
                  dateFormat={config.DP_INPUT_DATE_FORMAT}
                />
                <div class="errMsg">{this.state.validateFields.start_date}</div>
              </div>
            </div>
          </div>
          <div class="col-sm-6 pb-3">
            <div class="row">
              <div class="col-sm-3">
                <label for="end_date">End Date</label>
              </div>
              <div class="col-lg-5 col-md-12 ">
                <DatePicker showYearDropdown dropdownMode= "scroll"
                  minDate={moment(this.props.start_date).toDate()}
                  className="form-control"
                  selected={this.state.end_date}
                  value={this.state.end_date}
                  name="end_date"
                  onChange={this.onChangeEndDate}
                  autoComplete="off"
                  dateFormat={config.DP_INPUT_DATE_FORMAT}
                />
                <div class="errMsg">{this.state.validateFields.end_date}</div>
              </div>
            </div>
          </div>
        </Row>
      );
    } else {
      return "";
    }
  }

  render() {

    if(this.state.redirect){
      this.setState({redirect:false});
      return <Redirect to={{
          pathname: "my-tickets",
          state:{ticketMessage: "Your ticket has been submitted succeefully!"},
        }}/>
    }

    const {
      ticketTypes,
      ticketsPriorities,
      isLoading,
      validateFields,
    } = this.props;
    let ticketList = "";
    if (ticketTypes.length > 0) {
      ticketList = ticketTypes.map((ticketType) => {
        return this.loadTicketType(ticketType);
      });
    }
    // console.log("validateFields => ", validateFields);
    //   return ticketList;
    console.log("this.state  ==========> ", this.state);
    return (
      <Col>
      <h4 className="font-16  mb-2">Create Tickets </h4>
        <form encType="multipart/form-data" onSubmit={this.handleSubmit}>
          <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
            <Row>
              <div class="col-sm-6 pb-3">
                <div class="row">
                  <div class="col-lg-5 col-md-12 ">
                    <label for="ticket_type">Select Ticket Type</label>
                  </div>
                  <div class="col-lg-7 col-md-12">
                    <select
                      class="form-control custom-select"
                      name="ticket_type"
                      id="ticket_type"
                      onChange={(e) => this.handleInputs(e)}
                    >
                      <option value="">Select ticket type</option>
                      {ticketList}
                    </select>
                    <div class="errMsg">
                      {this.state.validateFields.ticket_type}
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-sm-6 pb-3">
                <div class="row">
                  <div class="col-lg-5 col-md-12 ">
                    <label for="priority">Priority</label>
                  </div>
                  <div class="col-lg-7 col-md-12">
                    <select
                      class="form-control custom-select"
                      name="priority"
                      id="priority"
                      value={this.state.priority}
                      disabled={this.state.priority ? 'disabled' : ''}
                      onChange={(e) => this.handleInputs(e)}
                    >
                      <option value="">Select priority</option>
                      <option value="1">Low</option>
                      <option value="2">Medium</option>
                      <option value="3">High</option>
                      <option value="4">Critical</option>
                    </select>
                    <div class="errMsg">
                      {this.state.validateFields.priority}
                    </div>
                  </div>
                </div>
              </div>
            </Row>

            <Row>
              <div class="col-sm-6 pb-3">
                <div class="row">
                  <div class="col-lg-5 col-md-12 ">
                    <label for="ticket_title">Title</label>
                  </div>
                  <div class="col-lg-7 col-md-12">
                    <input
                      type="text"
                      name="ticket_title"
                      class="form-control"
                      id="ticket_title"
                      onChange={(e) => this.handleInputs(e)}
                    ></input>
                    <div class="errMsg">
                      {this.state.validateFields.ticket_title}
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-sm-6 pb-3">
                <div class="row">
                  <div class="col-lg-5 col-md-12 ">
                    <label for="due_date">Due Date</label>
                  </div>
                  <div class="col-lg-7 col-md-12">
                    <input
                      type="text"
                      name="due_date"
                      className="form-control"
                      id="due_date"
                      readOnly="true"
                      value={this.state.due_date}
                    ></input>
                    <div class="errMsg">
                      {this.state.validateFields.due_date}
                    </div>
                  </div>
                </div>
              </div>
            </Row>

            {this.loadLeaveStartEndDateFields()}

            <Row>
              <div class="col-sm-6 pb-3">
                <div class="row">
                  <div class="col-lg-5 col-md-12 ">
                    <label for="attachments">Attachement</label>
                  </div>
                  <div class="col-lg-7 col-md-12">
                    {/* <label class="custom-file-upload"> */}
                      <input
                        type="file"
                        name="attachments" className="custom-input-file"
                        onChange={(e) => this.handleInputs(e)}
                      />
                      {/* <i class="fa fa-cloud-upload"></i> */}
                    {/* </label> */}
                    <div class="errMsg">
                      {this.state.validateFields.attachments}
                    </div>
                  </div>
                </div>
              </div>
            </Row>

            <Row>
              <div class="col-sm-12 pb-3">
                <label for="description">Description</label>
              </div>
              <div class="col-sm-12 pb-3">
                <textarea
                  type="text"
                  class="form-control textHeight"
                  name="description"
                  id="description"
                  onChange={(e) => this.handleInputs(e)}
                ></textarea>
                <div class="errMsg">
                  {this.state.validateFields.description}
                </div>
              </div>
            </Row>

            <Row>
              <div class="col-sm-6 pb-3">
                <div class="row">
                  <div class="col-lg-5 col-md-12 ">
                    <label for="ticket_status">Status</label>
                  </div>
                  <div class="col-lg-7 col-md-12">
                    <select
                      class="form-control"
                      name="ticket_status"
                      id="ticket_status"
                    >
                      <option value="0">Pending</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-sm-6 pb-3">
                <div class="row">
                  <div class="col-lg-5 col-md-12 ">
                    <label for="ticket_assignee">Assigned To</label>
                  </div>
                  <div class="col-lg-7 col-md-12">
                    {/* <select
                      class="form-control"
                      name="ticket_assignee_opt"
                      id="ticket_assignee_opt"
                    >
                      <option value="1">{this.state.assigneeName}</option>
                    </select> */}
                    <input
                      type="text"
                      name="ticket_assignee_opt"
                      className="form-control"
                      id="ticket_assignee_opt"
                      readOnly="true"
                      value={this.state.assigneeName}
                    ></input>
                    <input
                      type="hidden"
                      name="ticket_assignee"
                      id="ticket_assignee"
                      value={this.state.assigneeId}
                    ></input>
                    <div class="errMsg">
                      {this.state.validateFields.ticket_assignee}
                    </div>
                  </div>
                </div>
              </div>
            </Row>

            <div class="form-group row pt-5 edit-basicinfo">
              <div class="col-lg-12 text-center">
                <input
                  type="reset"
                  class="btn btn-outline-primary mr-2"
                  value="Cancel"
                />
                <input type="submit" class="btn btn-primary" value="Create" />
              </div>
            </div>
          </Card>
        </form>
      </Col>
    );
  }
}

// export default withRouter(CreateTicket);
export default CreateTicket;

/* eslint-disable */
import React, { Component } from "react";
import { Col, Card, Row, Table } from "reactstrap";
import config from "../../config/config";
import { fetchData } from "../../action/fetchData";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import loader from "../../loader.gif";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
//import Moment from "moment";
import { Progress } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import ConfirmPrompt from '../Settings/ConfirmPrompt';
import { IoIosCard, IoIosCloudDownload } from "react-icons/io";
const BEARER_TOKEN = localStorage.getItem("userData");

class Insurer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isurer: [],
      insurance: [],
      insurer: "",
      selectlogo: null,
      selectFile: null,
      insurarId: 0,
      insuranceName: "",
      deductable: "",
      coverage: "",
      status:"",
      id: 0,
      showInsurer: false,
      showInsurance: false,
      categoryData: [],
      categoryId: "",
      fields: [{ insurer: "Company Name" }],
            validateFields: [],
            confirmPromptShow: false,
            planCount: '',
    };
    this.myRef = React.createRef();
  }

  componentDidMount() {
    const apiUrl = config.API_URL + "/insurance/insurar-list";
    var bearer = "Bearer " + BEARER_TOKEN;
    axios
      .get(apiUrl, { headers: { Authorization: bearer } })
      .then((r) => {
        if (r.status == 200) {
          this.setState({ isurer: r.data.insurerList });
        }
      })
      .catch((error) => {
        console.log("API ERR: ");
        console.error(error);
        // res.json({ error: error });
      });
    const url = config.API_URL + "/insurance/insurance-list";
    axios
      .get(url, { headers: { Authorization: bearer } })
      .then((r) => {
        if (r.status == 200) {
          this.setState({ insurance: r.data.insuranceData });
        }
      })
      .catch((error) => {
        console.log("API ERR: ");
        console.error(error);
        // res.json({ error: error });
      });

    const baseUrl = config.API_URL + "/insurance/network-category";
    axios
      .get(baseUrl, { headers: { Authorization: bearer } })
      .then((r) => {
        if (r.status == 200) {
          this.setState({ categoryData: r.data.networkCategory });
        }
      })
      .catch((error) => {
        console.log("API ERR: ");
        console.error(error);
        // res.json({ error: error });
      });
  }

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if (event.target.name === 'status' && event.target.value != '' && event.target.value == 0 && this.state.planCount > 0) {
        console.log('Status Inactive', event.target.name, event.target.value);
        this.setState({
            confirmPromptShow: true,
            editShow: false
        })
    }
    else {
        this.setState({
                [name]: value,
        })
    }
  };

  validateForm() {
    let fields = this.state.fields[0];
    let validations = {};
    let isFormValid = true;
    if (fields) {
      //   console.log('Payroll Fields', fields);
      for (var key in fields) {
        if (this.state[key] == "" || typeof this.state[key] == "undefined") {
          validations[key] = fields[key];
          isFormValid = false;
        }
      }
      // console.log('validations ============> ', validations);
      this.setState({ validateFields: validations });
      return isFormValid;
    }
  }
        
  confirmClose = (status) => {
        console.log('confirm prompt', status);
        if (status) {
            this.setState({
                status : 0,
                editShow: true,
                confirmPromptShow: false
            })
        }
        else {
            this.setState({
                status: 1,
                editShow: true,
                confirmPromptShow: false
            })
        }
    }

  checkMimeType = (event) => {
    //getting file object
    let files = event.target.files;
    //define message container
    let err = [];
    // list allow mime type
    const types = ["image/png"];
    // loop access array
    for (var x = 0; x < files.length; x++) {
      // compare file type find doesn't matach
      if (types.every((type) => files[x].type !== type)) {
        // create error message and assign to container
        err[x] = files[x].type + " is not a supported format\n";
      }
    }
    for (var z = 0; z < err.length; z++) {
      // if message not same old that mean has error
      // discard selected file
      toast.error(err[z]);
      event.target.value = null;
    }
    return true;
  };

  checkMimeTypeInsurance = (event) => {
    //getting file object
    let files = event.target.files;
    //define message container
    let err = [];
    // list allow mime type
    const types = ["application/pdf"];
    // loop access array
    for (var x = 0; x < files.length; x++) {
      // compare file type find doesn't matach
      if (types.every((type) => files[x].type !== type)) {
        // create error message and assign to container
        err[x] = files[x].type + " is not a supported format\n";
      }
    }
    for (var z = 0; z < err.length; z++) {
      // if message not same old that mean has error
      // discard selected file
      toast.error(err[z]);
      event.target.value = null;
    }
    return true;
  };

  maxSelectFile = (event) => {
    let files = event.target.files;
    if (files.length > 1) {
      const msg = "Only 1 can be uploaded at a time";
      event.target.value = null;
      toast.warn(msg);
      return false;
    }
    return true;
  };
  checkFileSize = (event) => {
    let files = event.target.files;
    let size = 5000000;
    let err = [];
    for (var x = 0; x < files.length; x++) {
      if (files[x].size > size) {
        err[x] = files[x].type + "is too large, please pick a smaller file\n";
      }
    }
    for (var z = 0; z < err.length; z++) {
      // if message not same old that mean has error
      // discard selected file
      toast.error(err[z]);
      event.target.value = null;
    }
    return true;
  };
  onChangeHandler = (event) => {
    var files = event.target.files;
    console.log(files);
    if (
      this.maxSelectFile(event) &&
      this.checkMimeType(event) &&
      this.checkFileSize(event)
    ) {
      // if return true allow to setState
      this.setState({
        selectlogo: files,
        loaded: 0,
      });
    }
  };

  onChangeInsuranceFile = (event) => {
    var files = event.target.files;
    console.log(files);
    if (
      this.maxSelectFile(event) &&
      this.checkMimeTypeInsurance(event) &&
      this.checkFileSize(event)
    ) {
      // if return true allow to setState
      this.setState({
        selectFile: files,
        loaded: 0,
      });
    }
  };

  onClickHandler = () => {
    console.log(this.state.selectlogo);
    const data = new FormData();
    if (
      this.state.id == 0 &&
      this.state.selectlogo &&
      this.state.insurer != ""
    ) {
      data.append("logo", this.state.selectlogo[0]);
      data.append("insurarProvider", this.state.insurer);
      data.append("id", this.state.id);
      data.append("status", this.state.status);
    } else if (this.state.id > 0 && this.state.insurer != "") {
      if (this.state.selectlogo) {
        data.append("logo", this.state.selectlogo[0]);
      }
      data.append("insurarProvider", this.state.insurer);
      data.append("id", this.state.id);
      data.append("status", this.state.status);
    } else {
      // alert("Please provide required fields");
      // return false;
    }

    var bearer = "Bearer " + BEARER_TOKEN;
    const options = {
      method: "POST",
      headers: {
        Authorization: bearer,
      },
      body: data,
    };
    //   fetch(BaseURL, options)
    if (this.validateForm()) {
      fetch(config.API_URL + "/insurance/add-insurer", options)
        .then((res) => res.json())
        .then((res) => {
          this.componentDidMount();
          this.setState({
            insurer: "",
            selectlogo: null,
            id: 0,
            showInsurer: false,
            status: ""
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    this.componentDidMount();
  };

  onInsuranceEdit = (id) => {
    setTimeout(() => {
      window.scrollTo({
        top: this.myRef.current.offsetTop,
        behavior: "smooth",
      });

      console.log("djdlldf", top);
    }, 100);

    this.onShowInsuranceForm();

    let editData = [];
    this.state.insurance.map((obj) => {
      if (obj.id === id) {
        editData.push(obj);
      }
    });
    this.setState({
      id: id,
      insuranceName: editData[0].insuranceName,
      insurarId: editData[0].insurarId,
      deductable: editData[0].deductable,
      coverage: editData[0].coverage,
      insuranceDesc: editData[0].insuranceDesc,
      status: editData[0].status,
    });
  };

  onInsururEdit = (id) => {
    setTimeout(() => {
      window.scrollTo({
        top: this.myRef.current.offsetTop,
        behavior: "smooth",
      });

      console.log("djdlldf", top);
    }, 100);
    this.onShowInsurerForm();
    let editData = [];
    this.state.isurer.map((obj) => {
      if (obj.id === id) {
              editData.push(obj);
              this.setState({
                      planCount : obj.planCount
              })
      }
    });

    this.setState({
      id: id,
      insurer: editData[0].insurarProvider,
      status: editData[0].status,
    });
  };

  onChangeHandler = (event) => {
    var files = event.target.files;
    console.log(files);
    if (
      this.maxSelectFile(event) &&
      this.checkMimeType(event) &&
      this.checkFileSize(event)
    ) {
      // if return true allow to setState
      this.setState({
        selectlogo: files,
        loaded: 0,
      });
    }
  };

  onClickInsuranceHandler = () => {
    const Insurancedata = new FormData();
    Insurancedata.append("insuranceName", this.state.insuranceName);
    Insurancedata.append("insurarId", this.state.insurarId);
    Insurancedata.append("insuranceDesc", this.state.insuranceDesc);
    if (this.state.selectFile) {
      Insurancedata.append("insuranceDoc", this.state.selectFile[0]);
    }
    Insurancedata.append("deductable", this.state.deductable);
    Insurancedata.append("coverage", this.state.coverage);
    Insurancedata.append("categoryId", this.state.categoryId);
    Insurancedata.append("id", this.state.id);
    console.log(Insurancedata);

    var bearer = "Bearer " + BEARER_TOKEN;
    const options = {
      method: "POST",
      headers: {
        Authorization: bearer,
      },
      body: Insurancedata,
    };
    //   fetch(BaseURL, options)
    fetch(config.API_URL + "/insurance/add-new-insurance", options)
      .then((res) => res.json())
      .then((res) => {
        this.componentDidMount();
        this.setState({
          insurer: "",
          selectlogo: null,
          selectFile: null,
          insurarId: 0,
          insuranceName: "",
          deductable: "",
          coverage: "",
          id: 0,
          insuranceDesc: "",
          showInsurance: false,
          categoryId: "",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addDefaultSrc(ev) {
    ev.target.src = config.DEFAULT_ORG_IMG_URL;
  }

  onShowInsurerForm = () => {
    this.setState({ showInsurer: true, status: "", insurer: "" });
  };

  onHideInsurerForm = () => {
    this.setState({ showInsurer: false });
  };

  onShowInsuranceForm = () => {
    this.setState({ showInsurance: true });
  };

  render() {
    return (
      <Col>
        <h4>Add Insurer </h4>
        {/* <ul id="tabsJustified" className="nav nav-tabs nav-fill bg-magenta rounded-sm">
                <li className="nav-item">
                        <a href="#Tab2" data-target="#Tab2" data-toggle="tab" className="nav-link active">Insurance Company Detail</a>
                    </li>
                    <li className="nav-item">
                        <a href="#Tab1" data-target="#Tab1" data-toggle="tab" className="nav-link">Insurance Plan Detail</a>
                    </li>
                   
                </ul> */}
        <div id="tabsJustifiedContent" className="tab-content py-1">
          <div className="tab-pane fade show active" id="Tab2">
            <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-1  shadow-sm">
              <Table className="leaveTable">
                <thead>
                  <tr>
                    <th>Logo</th>
                    <th>Insurer Name</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.isurer.map((obj) => {
                    return (
                      <tr>
                        <td>
                          <img
                            src={
                              obj.logo ? config.BASE_URL + "/" + obj.logo : ""
                            }
                            height="40"
                            width="40"
                            onError={this.addDefaultSrc}
                          ></img>
                        </td>
                        <td>{obj.insurarProvider}</td>
                        <td>{obj.status ? "Active" : "Inactive"}</td>
                        <td>
                          <input
                            type="reset"
                            className="btn btn-primary mr-2"
                            onClick={this.onInsururEdit.bind(this, obj.id)}
                            value="Edit"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card>

            <div
              ref={this.myRef}
              onClick={this.onShowInsurerForm}
              class="form-group row pt-2 mb-4 "
            >
              <div class="col-lg-12 text-left">
                <span class="addNewButton">
                  {" "}
                  <i class="icon-plus icons"></i> Add New Insurer
                </span>
              </div>
            </div>

            <Card
              className="card topFilter pl-4 pr-4 pt-3 pb-3 br-3 mb-1 shadow-sm"
              style={this.state.showInsurer ? {} : { display: "none" }}
            >
              <Row>
                <div class="col-sm-4 pb-3">
                  <div class="row">
                    <div class="col-sm-5">
                      <label for="ticket_type">Company Name</label>
                    </div>
                    <div class="col-sm-6">
                      <input
                        type="text"
                        name="insurer"
                        className="form-control"
                        onChange={this.handleChange}
                        value={this.state.insurer}
                      />
                      <div class="errMsg">
                        {" "}
                        {this.state.validateFields["insurer"]
                          ? "Please enter the " +
                            this.state.validateFields["insurer"]
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-sm-4 pb-3">
                  <div class="row">
                    <div class="col-sm-3">
                      <label for="priority">Logo</label>
                    </div>
                    <div class="col-sm-5">
                      {/* <label htmlFor="logo"> */}
                      <input
                        type="file"
                        className="custom-input-file"
                        onChange={this.onChangeHandler}
                        accept="image/png"
                      />
                      {/* </label> */}
                      {/* <div class="errMsg">{this.state.validateFields['logo']}</div> */}
                    </div>
                  </div>
                </div>
                <div class="col-sm-4 pb-3">
                  <div class="row">
                    <div class="col-sm-3">
                      <label for="priority">Status</label>
                    </div>
                    <div class="col-sm-5">
                      <select
                        name="status"
                        className="form-control custom-select"
                        value={this.state.status}
                        onChange={this.handleChange}
                      >
                        <option value="">
                          Select Status
                        </option>{" "}
                        <option
                          value="1"
                          selected={
                            this.state.status && this.state.status == 1
                              ? "selected"
                              : ""
                          }
                        >
                          Active
                        </option>
                        <option
                          value="0"
                          selected={
                            this.state.status && this.state.status == 0
                              ? "selected"
                              : ""
                          }
                        >
                          Inactive
                        </option>
                      </select>
                      <div class="errMsg">
                        {" "}
                        {this.state.validateFields["status"]
                          ? "Please Select the  " +
                            this.state.validateFields["status"]
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
                                            </Row>
                                            
                                            {this.state.confirmPromptShow ? <ConfirmPrompt empNo={this.state.planCount} tabType="Insurers" confirmClose={this.confirmClose} confirmPromptShow={this.state.confirmPromptShow}></ConfirmPrompt> : ''}

              <div class="form-group row pt-5 edit-basicinfo">
                <div class="col-lg-10 text-center">
                  <input
                    type="submit"
                    class="btn btn-primary"
                    value="Save"
                    onClick={this.onClickHandler}
                  />
                  <input
                    type="button"
                    class="btn btn-outline-primary ml-2"
                    value="Cancel"
                    onClick={this.onHideInsurerForm}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Col>
    );
  }
}

export default Insurer;

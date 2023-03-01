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

class insuranceMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isurer: [],
      coverageRecord: [],
      deductableRecord: [],
      copayRecord: [],
      featuresRecord: [],
      insurer: "",
      selectfile: null,
      insurarId: 0,
      insuranceName: "",
      deductable: "",
      coverage: "",
      id: 0,
      showInsurer: false,
      showInsurance: false,
      category: [],
            networkList: [],
            confirmPromptShow: false,
            planCount: '',
      categoryData: [],
      categoryId: 0,
      showCoverage: false,
      status: "",
      showDeductable: false,
      coverageId: 0,
            deductableId: 0,
      tabType: "",
      coverageDescription: "",
      deductableDesc: "",
      showCopay: false,
      copay: "",
      copayDesc: "",
      copayId: 0,
      showFeature: false,
      featureId: 0,
      isCompare: 0,
      showBenifit: false,
      networkshow: [],
      networkId: 0,
      benifit: "",
      benifitRecord: [],
      terretorialLimit: "",
      copayOnOp: "",
      copayOnIp: "",
      copayOnPharmacy: "",
      waitingPeriod: "",
      coverageFields: [
        { coverage: "Coverage", coverageDescription: "Coverage Description" },
      ],
      deductibleFields: [
        { deductable: "Deductible", deductableDesc: "Deductible Description" },
      ],
      copayFields: [{ copay: "Copay", copayDesc: "Copay Description" }],
      featureFields: [
        { feature: "Feature Title", featureDesc: "Feature Description" },
      ],
      validateFields: {},
    };
    this.myRef = React.createRef();
  }

  componentDidMount() {
    const apiUrl = config.API_URL + "/insurance/insurance-master-data";
    var bearer = "Bearer " + BEARER_TOKEN;
    axios
      .get(apiUrl, { headers: { Authorization: bearer } })
      .then((r) => {
        if (r.status == 200) {
          this.setState({
            coverageRecord: r.data.coverageData,
            deductableRecord: r.data.deductibleData,
            copayRecord: r.data.copayData,
            featuresRecord: r.data.featuresData,
            benifitRecord: r.data.benifitData,
          });
        }
      })
      .catch((error) => {
        console.log("API ERR: ");
        console.error(error);
        // res.json({ error: error });
      });
    const url = config.API_URL + "/insurance/network-category";

    axios
      .get(url, { headers: { Authorization: bearer } })
      .then((r) => {
        if (r.status == 200) {
          this.setState({ category: r.data.networkCategory });
        }
      })
      .catch((error) => {
        console.log("API ERR: ");
        console.error(error);
        // res.json({ error: error });
      });

    const mainurl = config.API_URL + "/insurance/netowork-list";
    var bearer = "Bearer " + BEARER_TOKEN;
    axios
      .get(mainurl, { headers: { Authorization: bearer } })
      .then((r) => {
        if (r.status == 200) {
          console.log(r.data);
          this.setState({ networkList: r.data.NetworkList });
          console.log("sdasdsadasdsdsa", this.state.networkList);
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
          console.log("Dropdown value", event.target.name, event.target.value, this.state.planCount);
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

  validateForm(type) {
    let fields = [];
    let validations = {};
    let isFormValid = true;
    if (fields) {
      // console.log('Payroll Fields', fields);
      if (type === "coverage") {
        fields = this.state.coverageFields[0];
      }
      if (type === "deductible") {
        fields = this.state.deductibleFields[0];
      }
      if (type === "copay") {
        fields = this.state.copayFields[0];
      }
      if (type === "features") {
        fields = this.state.featureFields[0];
      }
      for (var key in fields) {
        if (this.state[key] == "" || typeof this.state[key] == "undefined") {
          validations[key] = fields[key];
          isFormValid = false;
        }
      }
      console.log("validations ============> ", validations);
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
    const types = [
      "text/csv",
      "application/vnd.ms-excel",
      "text/x-csv",
      "text/plain",
    ];
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
    console.log(this.maxSelectFile(event));
    console.log(this.checkMimeType(event));
    console.log(this.checkFileSize(event));
    if (
      this.maxSelectFile(event) &&
      this.checkMimeType(event) &&
      this.checkFileSize(event)
    ) {
      // if return true allow to setState
      this.setState({
        selectfile: files,
        loaded: 0,
      });
      console.log(this.state.selectfile);
    }
  };

  onClickHandler = () => {
    console.log(this.state.selectfile);
    if (
      this.state.selectfile == null &&
      this.state.coverageId == 0 &&
      this.state.deductableId == 0 &&
      this.state.copayId == 0 &&
      this.state.categoryId == 0 &&
      this.state.networkId == 0 &&
      this.state.benifit == ""
    ) {
      alert("please provide all fields");
      return false;
    }
    const data = new FormData();
    data.append("premiumSheet", this.state.selectfile[0]);
    data.append("coverageId", this.state.coverageId);
    data.append("deductableId", this.state.deductableId);
    data.append("copayId", this.state.copayId);
    data.append("categoryId", this.state.categoryId);
    data.append("networkId", this.state.networkId);
    data.append("id", this.state.id);
    data.append("terretorialLimit", this.state.terretorialLimit);
    data.append("copayOnOp", this.state.copayOnOp);
    data.append("copayOnIp", this.state.copayOnIp);
    data.append("copayOnPharmacy", this.state.copayOnPharmacy);
    data.append("waitingPeriod", this.state.waitingPeriod);
    data.append("benifit", this.state.benifit);
    console.log(data);

    var bearer = "Bearer " + BEARER_TOKEN;
    const options = {
      method: "POST",
      headers: {
        Authorization: bearer,
      },
      body: data,
    };
    //   fetch(BaseURL, options)
    fetch(config.API_URL + "/insurance/add-benifit-data", options)
      .then((res) => res.json())
      .then((res) => {
        toast.success(res.message);
        setTimeout(function() {
          toast.dismiss();
        }, 5000);
        this.componentDidMount();
        this.setState({
          selectfile: null,
          coverageId: 0,
          deductableId: 0,
          copayId: 0,
          categoryId: 0,
          networkId: 0,
          id: 0,
          benifit: "",
          terretorialLimit: "",
          copayOnIp: "",
          copayOnOp: "",
          copayOnPharmacy: "",
          waitingPeriod: "",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onCoverageEdit = (id) => {
    setTimeout(() => {
      window.scrollTo({
        top: this.myRef.current.offsetTop,
        behavior: "smooth",
      });

      console.log("djdlldf", top);
    }, 100);

    this.onShowCoverageForm();

    let editData = [];
    this.state.coverageRecord.map((obj) => {
      if (obj.id === id) {
              editData.push(obj);
              this.setState({
                      planCount: obj.planCount
              })
      }
    });
    this.setState({
      coverageId: id,
      coverage: editData[0].coverage,
      coverageDescription: editData[0].description,
            validateFields: [],
      tabType: "Coverage",
      status: editData[0].status
    });
  };

  onDeductableEdit = (id) => {
    setTimeout(() => {
      window.scrollTo({
        top: this.myRef.current.offsetTop,
        behavior: "smooth",
      });

      console.log("djdlldf", top);
    }, 100);

    this.onShowDeductableForm();

    let editData = [];
    this.state.deductableRecord.map((obj) => {
      if (obj.id === id) {
              editData.push(obj);
              this.setState({
                planCount: obj.planCount
        })
      }
    });
    this.setState({
      deductableId: id,
      deductable: editData[0].deductible,
      deductableDesc: editData[0].description,
            validateFields: [],
            status: editData[0].status,
      tabType: "Deductible"
    });
  };

  onCopayEdit = (id) => {
    setTimeout(() => {
      window.scrollTo({
        top: this.myRef.current.offsetTop,
        behavior: "smooth",
      });

      console.log("djdlldf", top);
    }, 100);

    this.onShowCopayForm();

    let editData = [];
    this.state.copayRecord.map((obj) => {
      if (obj.id === id) {
              editData.push(obj);
              this.setState({
                planCount: obj.planCount
        })
      }
    });
    this.setState({
      copayId: id,
      copay: editData[0].copay,
      copayDesc: editData[0].description,
            validateFields: [],
            status: editData[0].status,
      tabType: "Copay"
    });
  };

  onBenifitEdit = (id) => {
    this.onShowBenifitForm();

    let editData = [];
    this.state.benifitRecord.map((obj) => {
      if (obj.id === id) {
              editData.push(obj);
              this.setState({
                planCount: obj.planCount
        })
      }
    });
    this.setState({
      id: id,
      coverageId: editData[0].coverageId,
      deductableId: editData[0].dedutableId,
      copayId: editData[0].copayId,
      benifit: editData[0].name,
      terretorialLimit: editData[0].terretorialLimit,
      copayOnIp: editData[0].copayOnIp,
      copayOnOp: editData[0].copayOnOp,
      copayOnPharmacy: editData[0].copayOnPharmacy,
      waitingPeriod: editData[0].waitingPeriod,
      validateFields: [],
      status: editData[0].status,
    });
    let network = [];
    let catId = 0;
    this.state.networkList.map((obj) => {
      if (obj.id == editData[0].networkId) {
        this.setState({ categoryId: obj.categoryId, networkId: obj.id });
        catId = obj.categoryId;
      }
      if (obj.categoryId === catId) {
        const list = { id: obj.id, name: obj.networkName };
        network.push(list);
      }
    });
    this.setState({ networkshow: network });
  };

  onFeaturesEdit = (id) => {
    setTimeout(() => {
      window.scrollTo({
        top: this.myRef.current.offsetTop,
        behavior: "smooth",
      });

      console.log("djdlldf", top);
    }, 100);

    this.onShowFeatureForm();

    let editData = [];
    this.state.featuresRecord.map((obj) => {
      if (obj.id === id) {
              editData.push(obj);
              this.setState({
                planCount: obj.planCount
        })
      }
    });
    this.setState({
      featureId: id,
      feature: editData[0].featureName,
      isCompare: editData[0].isCompare,
      featureDesc: editData[0].description,
            validateFields: [],
            status: editData[0].status,
      tabType: "Features"
    });
  };

  onClickCoverageForm = () => {
    var url = config.API_URL + "/insurance/add-master-data";
    var bearer = "Bearer " + BEARER_TOKEN;
    var data = {};
    // if(this.state.coverage == "" && this.state.coverageDescription == ""){
    //   // alert("Please fill required fields");
    //   return false;
    // }
    data.name = this.state.coverage;
    data.description = this.state.coverageDescription;
    data.id = this.state.coverageId;
    data.status = this.state.status;
    data.type = "coverage";
    console.log("Coverage Data", data);
    const headers = {
      Authorization: bearer,
      // "Content-Type": "multipart/form-data"
    };
    if (this.validateForm("coverage")) {
      axios.post(url, data, { headers: headers }).then((res) => {
        if (res.status == 200 && res.data.success) {
          toast.success(res.data.message);
          setTimeout(function() {
            toast.dismiss();
          }, 2000);
          this.componentDidMount();
          this.setState({
            coverage: "",
            coverageDescription: "",
            coverageId: 0,
            showCoverage: false,
            
          });
        }
      });
    }
  };

  onClickDeductableForm = () => {
    var url = config.API_URL + "/insurance/add-master-data";
    var bearer = "Bearer " + BEARER_TOKEN;
    var data = {};
    // if(this.state.deductable == "" && this.state.deductableDesc == ""){
    //   alert("Please fill required fields");
    //   return false;
    // }
    data.name = this.state.deductable;
    data.description = this.state.deductableDesc;
    data.id = this.state.deductableId;
    data.status = this.state.status;
    data.type = "deductable";

    const headers = {
      Authorization: bearer,
      // "Content-Type": "multipart/form-data"
    };
    if (this.validateForm("deductible")) {
      axios.post(url, data, { headers: headers }).then((res) => {
        if (res.status == 200 && res.data.success) {
          toast.success(res.data.message);
          setTimeout(function() {
            toast.dismiss();
          }, 2000);
          this.componentDidMount();
          this.setState({
            deductable: "",
            deductableDesc: "",
            deductableId: 0,
            showDeductable: false,
            status: ""
          });
        }
      });
    }
  };

  onClickCopay = () => {
    var url = config.API_URL + "/insurance/add-master-data";
    var bearer = "Bearer " + BEARER_TOKEN;
    var data = {};
    // if(this.state.copay == "" && this.state.copayDesc == ""){
    //   alert("Please fill required fields");
    //   return false;
    // }
    data.name = this.state.copay;
    data.description = this.state.copayDesc;
    data.id = this.state.copayId;
    data.status = this.state.status;
    data.type = "copay";

    const headers = {
      Authorization: bearer,
      // "Content-Type": "multipart/form-data"
    };
    if (this.validateForm("copay")) {
      axios.post(url, data, { headers: headers }).then((res) => {
        if (res.status == 200 && res.data.success) {
          toast.success(res.data.message);
          setTimeout(function() {
            toast.dismiss();
          }, 2000);
          this.componentDidMount();
          this.setState({
            copay: "",
            copayDesc: "",
            copayId: 0,
            showCopay: false,
            status: ""
          });
        }
      });
    }
  };

  onClickFeature = () => {
    var url = config.API_URL + "/insurance/add-master-data";
    var bearer = "Bearer " + BEARER_TOKEN;
    var data = {};
    //     if (this.state.feature == "" && this.state.featureDesc == "") {
    //       alert("Please fill required fields");
    //       return false;
    //     }
    data.name = this.state.feature;
    data.description = this.state.featureDesc;
    data.id = this.state.featureId;
    data.status = this.state.status;
    data.isCompare = this.state.isCompare;
    data.type = "features";

    const headers = {
      Authorization: bearer,
      // "Content-Type": "multipart/form-data"
    };
    if (this.validateForm("features")) {
      axios.post(url, data, { headers: headers }).then((res) => {
        if (res.status == 200 && res.data.success) {
          toast.success(res.data.message);
          setTimeout(function() {
            toast.dismiss();
          }, 2000);
          this.componentDidMount();
          this.setState({
            feature: "",
            featureDesc: "",
            featureId: 0,
            isCompare: false,
            showFeature: false,
            status: ""
            
          });
        }
      });
    }
  };

  addDefaultSrc(ev) {
    ev.target.src = config.DEFAULT_ORG_IMG_URL;
  }

  onShowCoverageForm = () => {
    this.setState({
      coverage: "",
      coverageDescription: "",
      coverageId: 0,
      showCoverage: true,
      validateFields: [],
      status: ""
    });
  };

  onShowDeductableForm = () => {
    this.setState({
      deductable: "",
      deductableDesc: "",
      deductableId: 0,
      showDeductable: true,
      validateFields: [],
      status: ""
      
    });
  };

  onShowInsuranceForm = () => {
    this.setState({ showInsurance: true, validateFields: [] });
  };

  onShowFeatureForm = () => {
    this.setState({
      feature: "",
      featureDesc: "",
      featureId: 0,
      isCompare: false,
      showFeature: true,
      validateFields: [],
      status: ""
    });
  };

  onShowCopayForm = () => {
    this.setState({
      copay: "",
      copayDesc: "",
      copayId: 0,
      showCopay: true,
      validateFields: [],
      status: ""
    });
  };
  onShowBenifitForm = () => {
    this.setState({ showBenifit: true, validateFields: [] });
  };

  onHideCoverageForm = () => {
    this.setState({ showCoverage: false, validateFields: [] });
  };

  onHideDeductableForm = () => {
    this.setState({ showDeductable: false, validateFields: [] });
  };

  onHideInsuranceForm = () => {
    this.setState({ showInsurance: false, validateFields: [] });
  };

  onHideFeatureForm = () => {
    this.setState({ showFeature: false, validateFields: [] });
  };

  onHideCopayForm = () => {
    this.setState({ showCopay: false, validateFields: [] });
  };
  onHideBenifitForm = () => {
    this.setState({ showBenifit: false, validateFields: [] });
  };

  render() {
    return (
      <Col>
        <ToastContainer
          className="right"
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
        <h4>Add Insurance Master Data </h4>
        <ul
          id="tabsJustified"
          className="nav nav-tabs nav-fill bg-magenta rounded-sm"
        >
          <li className="nav-item">
            <a
              href="#Tab1"
              data-target="#Tab1"
              data-toggle="tab"
              className="nav-link active"
            >
              Coverage
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#Tab2"
              data-target="#Tab2"
              data-toggle="tab"
              className="nav-link "
            >
              Deductible
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#Tab3"
              data-target="#Tab3"
              data-toggle="tab"
              className="nav-link"
            >
              Copay
            </a>
          </li>
          {/*<li className="nav-item">
                        <a href="#Tab4" data-target="#Tab4" data-toggle="tab" className="nav-link">Benefit Premium</a>
        </li>*/}
          <li className="nav-item">
            <a
              href="#Tab5"
              data-target="#Tab5"
              data-toggle="tab"
              className="nav-link"
            >
              Features
            </a>
          </li>
        </ul>
        <div id="tabsJustifiedContent" className="tab-content py-1">
          <div className="tab-pane fade active show" id="Tab1">
            <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-1  shadow-sm">
              <Table className="leaveTable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Coverage</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.coverageRecord.map((obj) => {
                    return (
                      <tr>
                        <td>{obj.id}</td>
                        <td>{obj.coverage}</td>
                        <td>{obj.description}</td>
                        <td>{obj.status ? "Active" : "Inactive"}</td>
                        <td>
                          <input
                            type="reset"
                            className="btn btn-primary mr-2"
                            onClick={this.onCoverageEdit.bind(this, obj.id)}
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
              onClick={this.onShowCoverageForm}
              class="form-group row pt-2 mb-4 "
            >
              <div class="col-lg-12 text-left">
                <span class="addNewButton">
                  {" "}
                  <i class="icon-plus icons"></i> Add New Coverage
                </span>
              </div>
            </div>

            <Card
              className="card topFilter pl-4 pr-4 pt-3 pb-3 br-3 mb-1 shadow-sm"
              style={this.state.showCoverage ? {} : { display: "none" }}
            >
              <Row>
                <div class="col-sm-4 pb-3">
                  <div class="row">
                    <div class="col-sm-4">
                      <label for="ticket_type">Coverage</label>
                    </div>
                    <div class="col-sm-8">
                      <input
                        type="text"
                        name="coverage"
                        className="form-control"
                        onChange={this.handleChange}
                        value={this.state.coverage}
                      />
                      <div class="errMsg">
                        {" "}
                        {this.state.validateFields["coverage"]
                          ? "Please Enter " +
                            this.state.validateFields["coverage"]
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-sm-4 pb-3">
                  <div class="row">
                    <div class="col-sm-4">
                      <label for="priority">Description</label>
                    </div>
                    <div class="col-sm-8">
                      <textarea
                        placeholder="Please write the description here"
                        name="coverageDescription"
                        className="form-control"
                        onChange={this.handleChange}
                        value={this.state.coverageDescription}
                      />
                      <div class="errMsg">
                        {" "}
                        {this.state.validateFields["coverageDescription"]
                          ? "Please Enter " +
                            this.state.validateFields["coverageDescription"]
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-sm-4 pb-3">
                  <div class="row">
                    <div class="col-sm-4">
                      <label for="priority">Status</label>
                    </div>
                    <div class="col-sm-8">
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

              <div class="form-group row pt-5 edit-basicinfo">
                <div class="col-lg-10 text-center">
                  <input
                    type="submit"
                    class="btn btn-primary"
                    value="Save"
                    onClick={this.onClickCoverageForm}
                  />
                  <input
                    type="button"
                    class="btn btn-outline-primary ml-2"
                    value="Cancel"
                    onClick={this.onHideCoverageForm}
                  />
                </div>
              </div>
            </Card>
          </div>
          <div className="tab-pane fade" id="Tab2">
            <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-1  shadow-sm">
              <Table className="leaveTable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Deductible</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.deductableRecord.map((obj) => {
                    return (
                      <tr>
                        <td>{obj.id}</td>
                        <td>{obj.deductible}</td>
                        <td>{obj.description}</td>
                        <td>{obj.status ? "Active" : "Inactive"}</td>
                        <td>
                          <input
                            type="reset"
                            className="btn btn-primary mr-2"
                            onClick={this.onDeductableEdit.bind(this, obj.id)}
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
              onClick={this.onShowDeductableForm}
              class="form-group row pt-2 mb-4 "
            >
              <div class="col-lg-12 text-left">
                <span class="addNewButton">
                  {" "}
                  <i class="icon-plus icons"></i> Add New Deductible
                </span>
              </div>
            </div>

            <Card
              className="card topFilter pl-4 pr-4 pt-3 pb-3 br-3 mb-1 shadow-sm"
              style={this.state.showDeductable ? {} : { display: "none" }}
            >
              <Row>
                <div class="col-sm-4 pb-3">
                  <div class="row">
                    <div class="col-sm-3">
                      <label for="ticket_type">Deductible</label>
                    </div>
                    <div class="col-sm-5">
                      <input
                        type="text"
                        name="deductable"
                        className="form-control"
                        onChange={this.handleChange}
                        value={this.state.deductable}
                      />
                      <div class="errMsg">
                        {" "}
                        {this.state.validateFields["deductable"]
                          ? "Please Enter " +
                            this.state.validateFields["deductable"]
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-sm-4 pb-3">
                  <div class="row">
                    <div class="col-sm-3">
                      <label for="priority">Description</label>
                    </div>
                    <div class="col-sm-8">
                      <textarea
                        placeholder="Please write the description here."
                        name="deductableDesc"
                        className="form-control"
                        onChange={this.handleChange}
                        value={this.state.deductableDesc}
                      />
                      <div class="errMsg">
                        {" "}
                        {this.state.validateFields["deductableDesc"]
                          ? "Please Enter " +
                            this.state.validateFields["deductableDesc"]
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-sm-4 pb-3">
                  <div class="row">
                    <div class="col-sm-4">
                      <label for="priority">Status</label>
                    </div>
                    <div class="col-sm-8">
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

              <div class="form-group row pt-5 edit-basicinfo">
                <div class="col-lg-10 text-center">
                  <input
                    type="submit"
                    class="btn btn-primary"
                    value="Save"
                    onClick={this.onClickDeductableForm}
                  />
                  <input
                    type="button"
                    class="btn btn-outline-primary ml-2"
                    value="Cancel"
                    onClick={this.onHideDeductableForm}
                  />
                </div>
              </div>
            </Card>
          </div>
          <div className="tab-pane fade" id="Tab3">
            <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-1  shadow-sm">
              <Table className="leaveTable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Copay</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.copayRecord.map((obj) => {
                    return (
                      <tr>
                        <td>{obj.id}</td>
                        <td>{obj.copay}</td>
                        <td>{obj.description}</td>
                        <td>{obj.status ? "Active" : "Inactive"}</td>
                        <td>
                          <input
                            type="reset"
                            className="btn btn-primary mr-2"
                            onClick={this.onCopayEdit.bind(this, obj.id)}
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
              onClick={this.onShowCopayForm}
              class="form-group row pt-2 mb-4 "
            >
              <div class="col-lg-12 text-left">
                <span class="addNewButton">
                  {" "}
                  <i class="icon-plus icons"></i> Add New Copay
                </span>
              </div>
            </div>

            <Card
              className="card topFilter pl-4 pr-4 pt-3 pb-3 br-3 mb-1 shadow-sm"
              style={this.state.showCopay ? {} : { display: "none" }}
            >
              <Row>
                <div class="col-sm-4 pb-3">
                  <div class="row">
                    <div class="col-sm-3">
                      <label for="ticket_type">Copay</label>
                    </div>
                    <div class="col-sm-5">
                      <input
                        type="text"
                        name="copay"
                        className="form-control"
                        onChange={this.handleChange}
                        value={this.state.copay}
                      />
                      <div class="errMsg">
                        {" "}
                        {this.state.validateFields["copay"]
                          ? "Please Enter " + this.state.validateFields["copay"]
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-sm-4 pb-3">
                  <div class="row">
                    <div class="col-sm-3">
                      <label for="priority">Description</label>
                    </div>
                    <div class="col-sm-8">
                      <textarea
                        placeholder="Please write the description here."
                        name="copayDesc"
                        className="form-control"
                        onChange={this.handleChange}
                        value={this.state.copayDesc}
                      />
                      <div class="errMsg">
                        {" "}
                        {this.state.validateFields["copayDesc"]
                          ? "Please Enter " +
                            this.state.validateFields["copayDesc"]
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-sm-4 pb-3">
                  <div class="row">
                    <div class="col-sm-4">
                      <label for="priority">Status</label>
                    </div>
                    <div class="col-sm-8">
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

              <div class="form-group row pt-5 edit-basicinfo">
                <div class="col-lg-10 text-center">
                  <input
                    type="submit"
                    class="btn btn-primary"
                    value="Save"
                    onClick={this.onClickCopay}
                  />
                  <input
                    type="button"
                    class="btn btn-outline-primary ml-2"
                    value="Cancel"
                    onClick={this.onHideCopayForm}
                  />
                </div>
              </div>
            </Card>
          </div>
          {/*<div className="tab-pane fade" id="Tab4">
                    <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-1  shadow-sm">
                    <Table className="leaveTable">
                        <thead>
                            <tr>
                               
                                <th>ID</th>
                                <th>Coverage</th>
                                <th>Deductible</th>
                                <th>Copay</th>
                                <th>Network</th>
                                <th>Benefit</th>
                                <th>Status</th>
                                <th>Action</th>

                            </tr>
                        </thead>
                        <tbody>
                         {this.state.benifitRecord.map(obj => {
                             return (
                              <tr>
                                
                             <td>{obj.id}</td>
                             <td>{obj.coverage}</td>
                             <td>{obj.deductible}</td>
                             <td>{obj.copay}</td>
                             <td>{obj.networkName}</td>
                             <td>{obj.name}</td>
                             <td>{(obj.status)?'Active':'Inactive'}</td>
                             <td><input type="reset" className="btn btn-primary mr-2" onClick={this.onBenifitEdit.bind(this, obj.id)} value="Edit" /></td>
                            </tr>
                             )
                         })}
                            </tbody>
                            </Table>


                        </Card>
                        <div ref={this.myRef} onClick={this.onShowBenifitForm} class="form-group row pt-2 mb-4 "><div class="col-lg-12 text-left"><span class="addNewButton"> <i class="icon-plus icons"></i> Add New Benefit</span></div></div>




                        <Card className="card topFilter pl-4 pr-4 pt-3 pb-3 br-3 mb-1 shadow-sm" style={(this.state.showBenifit)?{}:{display:'none'}}>
                            <Row>
                            <div class="col-sm-5 pb-3">
                                    <div class="row">
                                        <div class="col-sm-5">
                                            <label for="ticket_type">Coverage</label>
                                        </div>
                                        <div class="col-sm-5">
                                            <select name="coverageId" className="form-control" onChange={this.handleChange} value={this.state.coverageId}>
                                            <option value="">Select Coverage</option>
                                            {this.state.coverageRecord.map(obj => {
                                             return (
                                             <option value={obj.id}>{obj.coverage}</option>
                                           )
                                          })}
                                           </select>
                                        </div>
                                    </div>
                                </div>
                            <div class="col-sm-5 pb-3">
                                    <div class="row">
                                        <div class="col-sm-5">
                                            <label for="ticket_type">Deductible</label>
                                        </div>
                                        <div class="col-sm-5">
                                        <select name="deductableId" className="form-control" onChange={this.handleChange} value={this.state.deductableId}>
                                            <option value="">Select Deductable</option>
                                            {this.state.deductableRecord.map(obj => {
                                             return (
                                             <option value={obj.id}>{obj.deductible}</option>
                                           )
                                          })}
                                           </select>

                                        </div>
                                    </div>
                                </div>
                            <div class="col-sm-5 pb-3">
                                    <div class="row">
                                        <div class="col-sm-5">
                                            <label for="ticket_type">Copay</label>
                                        </div>
                                        <div class="col-sm-5">
                                        <select name="copayId" className="form-control" onChange={this.handleChange} value={this.state.copayId}>
                                            <option value="">Select Copay</option>
                                            {this.state.copayRecord.map(obj => {
                                             return (
                                             <option value={obj.id}>{obj.copay}</option>
                                           )
                                          })}
                                           </select>

                                        </div>
                                    </div>
                                </div>
                            <div class="col-sm-5 pb-3">
                                    <div class="row">
                                        <div class="col-sm-5">
                                            <label for="ticket_type">TPA</label>
                                        </div>
                                        <div class="col-sm-5">
                                        <select name="categoryId" className="form-control" onChange={this.handleChange} value={this.state.categoryId}>
                                            <option value="">Select TPA</option>
                                            {this.state.category.map(obj => {
                                             return (
                                             <option value={obj.id}>{obj.categoryName}</option>
                                           )
                                          })}
                                           </select>

                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-5 pb-3">
                                    <div class="row">
                                        <div class="col-sm-5">
                                            <label for="ticket_type">Network</label>
                                        </div>
                                        <div class="col-sm-5">
                                        <select name="networkId" className="form-control" onChange={this.handleChange} value={this.state.networkId}>
                                            <option value="">Select Network</option>
                                            {this.state.networkshow.map(obj => {
                                             return (
                                             <option value={obj.id}>{obj.name}</option>
                                           )
                                          })}
                                           </select>

                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-5 pb-3">
                                    <div class="row">
                                        <div class="col-sm-5">
                                            <label for="ticket_type">Benefit Name</label>
                                        </div>
                                        <div class="col-sm-5">
                                            <input type="text" name="benifit" className="form-control" onChange={this.handleChange} value={this.state.benifit} />

                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-5 pb-3">
                                    <div class="row">
                                        <div class="col-sm-5">
                                            <label for="ticket_type">Territorial Limit 	</label>
                                        </div>
                                        <div class="col-sm-5">
                                            <input type="text" name="terretorialLimit" className="form-control" onChange={this.handleChange} value={this.state.terretorialLimit} />

                                        </div>
                                    </div>
                                </div>

                                <div class="col-sm-5 pb-3">
                                    <div class="row">
                                        <div class="col-sm-5">
                                            <label for="ticket_type">Co pay on OP	</label>
                                        </div>
                                        <div class="col-sm-5">
                                            <input type="text" name="copayOnOp" className="form-control" onChange={this.handleChange} value={this.state.copayOnOp} />

                                        </div>
                                    </div>
                                </div>

                                <div class="col-sm-5 pb-3">
                                    <div class="row">
                                        <div class="col-sm-5">
                                            <label for="ticket_type">CO pay ON IP	</label>
                                        </div>
                                        <div class="col-sm-5">
                                            <input type="text" name="copayOnIp" className="form-control" onChange={this.handleChange} value={this.state.copayOnIp} />

                                        </div>
                                    </div>
                                </div>

                                <div class="col-sm-5 pb-3">
                                    <div class="row">
                                        <div class="col-sm-5">
                                            <label for="ticket_type">CO pay and limit on Pharmacy		</label>
                                        </div>
                                        <div class="col-sm-5">
                                            <input type="text" name="copayOnPharmacy" className="form-control" onChange={this.handleChange} value={this.state.copayOnPharmacy} />

                                        </div>
                                    </div>
                                </div>

                                <div class="col-sm-5 pb-3">
                                    <div class="row">
                                        <div class="col-sm-5">
                                            <label for="ticket_type">P & C waiting period</label>
                                        </div>
                                        <div class="col-sm-5">
                                            <input type="text" name="waitingPeriod" className="form-control" onChange={this.handleChange} value={this.state.waitingPeriod} />

                                        </div>
                                    </div>
                                </div>

                                <div class="col-sm-5 pb-3">
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <label for="priority">Premium Sheet</label>
                                        </div>
                                        <div class="col-sm-5">
                                            { <label htmlFor="logo"> }
                                                <input type="file" className="custom-input-file" onChange={this.onChangeHandler} />
                                            { </label> }

                                        </div>
                                    </div>
                                </div>
                            </Row>

                            <div class="form-group row pt-5 edit-basicinfo">
                                <div class="col-lg-10 text-center"><input type="submit" class="btn btn-primary" value="Save" onClick={this.onClickHandler} /></div>
                            </div>
                        </Card>
                    
                    </div>*/}
          <div className="tab-pane fade" id="Tab5">
            <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-1  shadow-sm">
              <Table className="leaveTable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Features</th>
                    {/* <th>Is Compare</th> */}
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.featuresRecord.map((obj) => {
                    return (
                      <tr>
                        <td>{obj.id}</td>
                        <td>{obj.featureName}</td>
                        {/* <td>{(obj.isCompare)?"True":"False"}</td> */}
                        <td>{obj.description}</td>
                        <td>{obj.status ? "Active" : "Inactive"}</td>
                        <td>
                          <input
                            type="reset"
                            className="btn btn-primary mr-2"
                            onClick={this.onFeaturesEdit.bind(this, obj.id)}
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
              onClick={this.onShowFeatureForm}
              class="form-group row pt-2 mb-4 "
            >
              <div class="col-lg-12 text-left">
                <span class="addNewButton">
                  {" "}
                  <i class="icon-plus icons"></i> Add New Feature
                </span>
              </div>
                                    </div>
                                    
                                    {this.state.confirmPromptShow ? <ConfirmPrompt empNo={this.state.planCount} tabType={this.state.tabType} confirmClose={this.confirmClose} confirmPromptShow={this.state.confirmPromptShow}></ConfirmPrompt> : ''}

            <Card
              className="card topFilter pl-4 pr-4 pt-3 pb-3 br-3 mb-1 shadow-sm"
              style={this.state.showFeature ? {} : { display: "none" }}
            >
              <Row>
                <div class="col-sm-4 pb-3">
                  <div class="row">
                    <div class="col-sm-3">
                      <label for="ticket_type">Feature Title</label>
                    </div>
                    <div class="col-sm-5">
                      <input
                        type="text"
                        name="feature"
                        className="form-control"
                        onChange={this.handleChange}
                        value={this.state.feature}
                      />
                      <div class="errMsg">
                        {" "}
                        {this.state.validateFields["feature"]
                          ? "Please Enter " +
                            this.state.validateFields["feature"]
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-sm-4 pb-3">
                  <div class="row">
                    <div class="col-sm-3">
                      <label for="priority">Description</label>
                    </div>
                    <div class="col-sm-8">
                      <textarea
                        placeholder="Please write the description here."
                        name="featureDesc"
                        className="form-control"
                        onChange={this.handleChange}
                        value={this.state.featureDesc}
                      />
                      <div class="errMsg">
                        {" "}
                        {this.state.validateFields["featureDesc"]
                          ? "Please Enter " +
                            this.state.validateFields["featureDesc"]
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
              
                <div class="col-sm-4 pb-3">
                  <div class="row">
                    <div class="col-sm-4">
                      <label for="priority">Status</label>
                    </div>
                    <div class="col-sm-8">
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

              <div class="form-group row pt-5 edit-basicinfo">
                <div class="col-lg-10 text-center">
                  <input
                    type="submit"
                    class="btn btn-primary"
                    value="Save"
                    onClick={this.onClickFeature}
                  />
                  <input
                    type="button"
                    class="btn btn-outline-primary ml-2"
                    value="Cancel"
                    onClick={this.onHideFeatureForm}
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

export default insuranceMain;

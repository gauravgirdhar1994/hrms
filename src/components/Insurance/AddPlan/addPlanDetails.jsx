/* eslint-disable */
import React, { Component } from "react";
import { Col, Card, Row, Table } from "reactstrap";
import config from "../../../config/config";
/* 
import { fetchData } from "../../action/fetchData"; */
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
// import loader from "../../loader.gif";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
//import Moment from "moment";
import { Progress } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { IoIosCard, IoIosCloudDownload } from "react-icons/io";
const BEARER_TOKEN = localStorage.getItem("userData");
class AddPlan extends Component {
  constructor(props) {
    console.log("AddPlan Called");
    super(props);
    this.state = {
      gradeList: [],
      formData: props.planDetails ? props.planDetails : {},
      planId: props.planId,
      fields: [
        {
          insurarId: "Company",
          insuranceName: "Plan Name",
          insuranceDesc: "Plan Description",
          annual_aggr_limit: "Annual Financial Limit",
          plan_document: "Table of Benefits",
	},
      ],
      reupload : false,
      validateFields: {},
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.getGradeList();
  }

  reupload(){
	  this.setState({
		  reupload : true
	  })
  }
  getGradeList() {
    var bearer = "Bearer " + BEARER_TOKEN;
    const options = {
      method: "GET",
      headers: {
        Authorization: bearer,
      },
    };
    //   fetch(BaseURL, options)
    fetch(config.API_URL + "/insurance/plan/grades", options)
      .then((res) => res.json())
      .then((res) => {
        console.log("result => ", res.gradeList);
        if (res.success) {
          this.setState({
            gradeList: res.gradeList,
          });
          // this.props.changeTabs(2, res.planId)
        }
        // alert(res.message);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handleChange = (event) => {
    const name = event.target.name;
    var value = "";
    if (name == "forWebsite") {
      value = event.target.checked ? 1 : 0;
    } else {
      value = event.target.value;
    }
    this.setState({
      formData: {
        ...this.state.formData,
        [name]: value,
      },
      validateFields: {
        ...this.state.validateFields,
        [name]: "",
      },
    });
  };
  onChangeInsuranceFile = (event) => {
    const name = event.target.name;
    var files = event.target.files;
    console.log(files);
    if (
      this.maxSelectFile(event) &&
      this.checkMimeTypeInsurance(event) &&
      this.checkFileSize(event)
    ) {
      // if return true allow to setState
      this.setState({
        formData: {
          ...this.state.formData,
          [name]: files,
        },
      });
    }
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
  onClickInsuranceHandler = () => {
    console.log("this.state ==> ", this.state.formData);
    const Insurancedata = new FormData();
    Insurancedata.append("insuranceName", this.state.formData.insuranceName);
    Insurancedata.append("insurarId", this.state.formData.insurarId);
    Insurancedata.append("insuranceDesc", this.state.formData.insuranceDesc);
    if (this.state.formData.plan_document) {
      Insurancedata.append(
        "insuranceDoc",
        this.state.formData.plan_document[0]
      );
    }
    if (this.state.formData.grade) {
      Insurancedata.append("grade", this.state.formData.grade);
    }

    if (this.state.formData.forWebsite) {
      Insurancedata.append("forWebsite", this.state.formData.forWebsite);
    }
    Insurancedata.append(
      "annual_aggr_limit",
      this.state.formData.annual_aggr_limit
    );
    Insurancedata.append("categoryId", this.state.categoryId);
    Insurancedata.append("id", this.state.planId);

    var bearer = "Bearer " + BEARER_TOKEN;
    const options = {
      method: "POST",
      headers: {
        Authorization: bearer,
      },
      body: Insurancedata,
    };
    //   fetch(BaseURL, options)
    if (this.validateForm()) {
      fetch(config.API_URL + "/insurance/plan/add-new", options)
        .then((res) => res.json())
        .then((res) => {
          // this.componentDidMount();
          console.log("result => ", res.planId, res.success, res.message);
          if (res.success) {
            this.setState({
              planId: res.planId,
            });
            this.props.changeTabs(2, res.planId);
            // localStorage.setItem('planId',res.planId);
          }
          alert(res.message);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  validateForm() {
    let fields = this.state.fields[0];
    let validations = {};
    let isFormValid = true;
    if (fields) {
      console.log("Payroll Fields", fields);
      for (var key in fields) {
        if (
          this.state.formData[key] == "" ||
	  typeof this.state.formData[key] == "undefined"
	  ||  this.state.formData[key] == null
        ) {
          validations[key] = fields[key];
          isFormValid = false;
        }
      }
      console.log("validations ============> ", validations);
      this.setState({ validateFields: validations });
      return isFormValid;
    }
  }
  render() {
    console.log("[formData]", this.state.formData);
    return (
      <div style={{ marginTop: "20px" }}>
        <Row>
          <div class="col-sm-6 pb-3">
            <div class="row">
              <div class="col-sm-4">
                <label for="ticket_type">
                  Insurance Provider <span className="text-danger">*</span>
                </label>
              </div>
              <div class="col-sm-8">
                <select
                  class="form-control custom-select"
                  name="insurarId"
                  onChange={this.handleChange}
                >
                  <option value="">Select Insurance Provider</option>
                  {this.props.isurer.map((a) => {
                    return (
                      <option
                        value={a.id}
                        selected={
                          a.id == this.state.formData.insurarId ? true : false
                        }
                      >
                        {a.insurarProvider}
                      </option>
                    );
                  })}
                </select>
                <div class="errMsg">
                 {this.state.validateFields["insurarId"] ? 'Please select the '+ this.state.validateFields["insurarId"]: ''}
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-6 pb-3">
            <div class="row">
              <div class="col-sm-4">
                <label for="priority">
                  Plan Name <span className="text-danger">*</span>
                </label>
              </div>
              <div class="col-sm-8">
                <input
                  type="text"
                  name="insuranceName"
                  className="form-control"
                  onChange={this.handleChange}
                  value={this.state.formData.insuranceName}
                />
                <div class="errMsg">

                 {this.state.validateFields["insuranceName"] ? 'Please enter the '+ this.state.validateFields["insuranceName"]: ''}
                </div>
              </div>
            </div>
          </div>

          <div class="col-sm-6 pb-3">
            <div class="row">
              <div class="col-sm-4">
                <label for="ticket_type">
                  Write the plan description{" "}
                  <span className="text-danger">*</span>
                </label>
              </div>
              <div class="col-sm-8">
                <textarea
                  placeholder="Please write the description here."
                  name="insuranceDesc"
                  className="form-control"
                  onChange={this.handleChange}
                  value={this.state.formData.insuranceDesc}
                />
                <div class="errMsg">

                {this.state.validateFields["insuranceDesc"] ? 'Please enter the '+ this.state.validateFields["insuranceDesc"]: ''}
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-6 pb-3">
            <div class="row">
              <div class="col-sm-4">
                <label for="priority">
                  Table of Benefits <span className="text-danger">*</span>
                </label>
              </div>
              <div class="col-sm-8">
                {/* <label className="uploadCustom" htmlFor="logo"> */}
		  {this.state.reupload ? (
			  <>
			   <input
			   type="file"
			   name="plan_document"
			   className="custom-input-file"
			   onChange={this.onChangeInsuranceFile}
			   accept="application/pdf"
			 />
			 <div class="errMsg">
         {this.state.validateFields["plan_document"] ? 'Please upload the '+ this.state.validateFields["plan_document"]: ''}
			 </div>
			 
			 <span className="block"> * PDF file only max size 5MB</span>
			 <span
			   className="block"
			   style={{
			     marginTop: "10px",
			   }}
			 >
			</span>
			</>
		  ) : (
		this.state.planId ? (
			<>
                    <a
		      target="_blank"
		      className="mr-2"
                      href={
                        config.BASE_URL + "/" + this.state.formData.insuranceDoc
                      }
                    >
                      View Document 
                    </a>
				|
		    <a
		    className="ml-3"
		    href="javascript:void(0)"
                     onClick={()=>this.reupload()}
                    >
                      Re-upload 
                    </a>
		    </>
                  ) : (
                    <>
			   <input
			   type="file"
			   name="plan_document"
			   className="custom-input-file"
			   onChange={this.onChangeInsuranceFile}
			   accept="application/pdf"
			 />
			 <div class="errMsg">
       {this.state.validateFields["plan_document"] ? 'Please upload the '+ this.state.validateFields["plan_document"]: ''}
			 </div>
			 
			 <span className="block"> * PDF file only max size 5MB</span>
			 <span
			   className="block"
			   style={{
			     marginTop: "10px",
			   }}
			 >
			</span>
			</>
                  )
		  )}
              </div>
            </div>
          </div>
          {/* <div class="col-sm-6 pb-3">
                        <div class="row">
                            <div class="col-sm-4">
                                <label for="ticket_type">Grade</label>
                            </div>
                            <div class="col-sm-8">
                                <select class="form-control custom-select" name="grade" onChange={(e) => this.handleChange(e)}>
                                    <option value="">Select Grade</option>
                                    {this.state.gradeList.map(a => {
                                        return (
                                            <option value={a.id} selected={this.state.formData.grade == a.id ? true : false}>{a.displayName} ({a.grade})</option>
                                        )
                                    })}
                                </select>

                            </div>
                        </div>
                    </div> */}
        </Row>
        <Row>
          {/* <div class="col-sm-6 pb-3">
                        <div class="row">
                            <div class="col-sm-4">
                                <label for="priority">For Website</label>
                            </div>
                            <div class="col-sm-8">
                                <label className="hrms_control hrms_checkbox">
                                    <input type="checkbox" name="forWebsite" onChange={this.handleChange} checked={this.state.formData.forWebsite == 1 ? true : false} />
                                    <i className="hrms_control__indicator"></i>
                                </label>
                            </div>
                        </div>
                    </div> */}
        </Row>

        <Row>
          <div class="col-sm-6 pb-3">
            <div class="row">
              <div class="col-sm-4">
                <label for="priority">
                  Annual Financial Limit <span className="text-danger">*</span>
                </label>
              </div>
              <div class="col-sm-8">
                <input
                  type="text"
                  name="annual_aggr_limit"
                  className="form-control"
                  onChange={this.handleChange}
                  value={this.state.formData.annual_aggr_limit}
                />
                <div class="errMsg">
                  {this.state.validateFields["annual_aggr_limit"] ? 'Please enter the '+ this.state.validateFields["annual_aggr_limit"]: ''}
                </div>
              </div>
            </div>
          </div>
        </Row>
        <Row>
          <div class="col-sm-12 pb-3 text-center">
            <input
              type="submit"
              class="btn btn-secondary"
              value="Cancel"
              onClick={(e) => this.props.goBackToPlans(e)}
            />
            <input
              type="submit"
              class="btn btn-primary"
              value="Save & continue"
              onClick={this.onClickInsuranceHandler}
              style={{ marginLeft: "10px" }}
            />
          </div>
        </Row>
      </div>
    );
  }
}

export default AddPlan;

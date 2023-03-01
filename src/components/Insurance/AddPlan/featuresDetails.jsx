/* eslint-disable */
import React, { Component } from "react";
import { Col, Card, Row, Table } from "reactstrap";
import config from "../../../config/config";
import { Modal, Form, Button } from "react-bootstrap";
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
class FeaturesDeails extends Component {
  constructor(props) {
                       super(props);
                       this.state = {
                         loading: false,
                         featureLoading: false,
                         show: false,
                         planId: props.planId,
                         id: "",
                         formData: [],
                         featuresList: [],
                           featuresMasterList: [],
                           fields: [
                            {
                              feature: "Feature",
                              status: "Status",
                              description: "Description",
                            },
                          ],
                          reupload : false,
                          validateFields: {},
                       };
                     }
  componentDidMount() {
    this.getFeaturesList();
    this.getFeatureMasterList();
  }
  getFeatureMasterList() {
    var bearer = "Bearer " + BEARER_TOKEN;
    const options = {
      method: "GET",
      headers: {
        Authorization: bearer,
      },
    };
    this.setState({
      featureLoading: true,
    });
    //   fetch(BaseURL, options)
    fetch(config.API_URL + "/insurance/plan/master-data/features", options)
      .then((res) => res.json())
      .then((res) => {
        // this.componentDidMount();
        if (res.success) {
          this.setState({
            featuresMasterList: res.featuresMasterList,
            featureLoading: false,
          });
          // console.log('res.covMapList ===> ', res.covMapList)
          // console.log('res.mappingList ===> ', this.state.mappingList)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getFeaturesList() {
    var bearer = "Bearer " + BEARER_TOKEN;
    const options = {
      method: "GET",
      headers: {
        Authorization: bearer,
      },
    };
    this.setState({
      loading: true,
    });
    //   fetch(BaseURL, options)
    fetch(
      config.API_URL + "/insurance/plan/list-features/" + this.state.planId,
      options
    )
      .then((res) => res.json())
      .then((res) => {
        // this.componentDidMount();
        if (res.success) {
          this.setState({
            featuresList: res.features,
            loading: false,
            show: false,
          });
          // console.log('res.covMapList ===> ', res.covMapList)
          // console.log('res.mappingList ===> ', this.state.mappingList)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handleClose = () => {
    this.setState({ show: false });
  };
  onShowModal = () => {
    this.setState({ show: true, formData: {}, id: "" });
  };
  changeHander = (e) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [e.target.name]: e.target.value,
      },
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log("state ===> ", this.state.formData);
    console.log("this.planId ==> ", this.state.planId);
    let Insurancedata = {};
    Insurancedata.feature = this.state.formData.feature;
    Insurancedata.description = this.state.formData.description;
    Insurancedata.status = this.state.formData.status;
    Insurancedata.planId = this.state.planId;
    Insurancedata.id = this.state.id;
    console.log(Insurancedata);

    var bearer = "Bearer " + BEARER_TOKEN;
      if (this.validateForm()) {
        axios
      .post(config.API_URL + "/insurance/plan/add-features", Insurancedata, {
        headers: {
          Authorization: "Bearer " + BEARER_TOKEN,
        },
      })
      .then((res) => {
        if (res.data.success) {
          this.getFeaturesList();
        }
        alert(res.data.message);
      })
      .catch((error) => {
        console.log("ALLOW ===> ", error);
        // reject(error)
        // this.setState({ disableBtn: false });
      });
    }
    
  };
  onFeatureEdit(featureId) {
    this.state.featuresList.map((list) => {
      if (featureId === list.id) {
        this.setState({
          id: featureId,
          formData: list,
          show: true,
        });
      }
    });
  }
  loadList() {
    console.log("this.state.featuresList ======> ", this.state.featuresList);
    if (!this.state.loading) {
      if (this.state.featuresList.length > 0) {
        let sno = 1;
        return this.state.featuresList.map((list) => {
          return (
            <tr>
              <td>{sno++}</td>
              <td>{list.featureName}</td>
              <td>{list.description}</td>
              <td>{list.status_text}</td>
              <td>
                <input
                  type="reset"
                  data={list.id}
                  className="btn btn-primary mr-2"
                  onClick={() => this.onFeatureEdit(list.id)}
                  value="Edit"
                />
              </td>
            </tr>
          );
        });
      } else {
        return (
          <tr>
            <td>No Record Found</td>
          </tr>
        );
      }
    } else {
      return (
        <tr>
          <td>Loading</td>
        </tr>
      );
    }
  }
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
  loadFeatureMasterList() {
    let list = "";
    if (!this.state.featureLoading) {
      list = this.state.featuresMasterList.map((obj) => {
        return (
          <option
            value={obj.id}
            selected={this.state.formData.feature == obj.id ? true : false}
          >
            {obj.featureName}
          </option>
        );
      });
    }
    return list;
  }
  render() {
    console.log("this.state.formData.feature ===> ", this.state.formData);
    return (
      <>
        <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-1  shadow-sm">
          <h4>Add Features</h4>

          <Table className="leaveTable">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Feature</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{this.loadList()}</tbody>
          </Table>
        </Card>

        <div onClick={this.onShowModal} class="form-group row pt-2 mb-5 ">
          <div class="col-lg-12 text-left">
            <span class="addNewButton">
              {" "}
              <i class="icon-plus icons"></i> Add New
            </span>
          </div>
        </div>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Features</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleSubmit}>
              <div className="row mt-4 edit-basicinfo">
                <div className="col-sm-6 pb-3">
                  <select
                    className="form-control custom-select"
                    id="feature"
                    name="feature"
                    onChange={this.changeHander}
                  >
                    <option value="">Select Feature</option>
                    {this.loadFeatureMasterList()}
                  </select>
                  <div class="errMsg">
                    {this.state.validateFields["feature"]
                      ? "Please select the " +
                        this.state.validateFields["feature"]
                      : ""}
                  </div>
                </div>
                <div className="col-sm-6 pb-3">
                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    onChange={this.changeHander}
                    placeHolder="add description"
                    value={this.state.formData.description}
                  />
                  <div class="errMsg">
                    {this.state.validateFields["description"]
                      ? "Please enter the " +
                        this.state.validateFields["description"]
                      : ""}
                  </div>
                </div>

                <div className="col-sm-6 pb-3">
                  <select
                    className="form-control custom-select"
                    id="status"
                    name="status"
                    onChange={this.changeHander}
                  >
                    <option value="">Status</option>
                    <option
                      value="1"
                      selected={this.state.formData.status == 1 ? true : false}
                    >
                      Active
                    </option>
                    <option
                      value="2"
                      selected={this.state.formData.status == 2 ? true : false}
                    >
                      In-active
                    </option>
                  </select>
                  <div class="errMsg">
                    {this.state.validateFields["status"]
                      ? "Please select the " +
                        this.state.validateFields["status"]
                      : ""}
                  </div>
                </div>

                <div className="col-sm-12 pb-3">
                  <Button
                    variant="secondary"
                    className="mr-2"
                    type="reset"
                    onClick={this.handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={this.handleSubmit}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default FeaturesDeails;

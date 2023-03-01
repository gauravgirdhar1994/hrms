/* eslint-disable */
import React, { Component } from "react";
import { Col, Card, Row, Table } from "reactstrap";
import config from "../../config/config";
import { fetchData } from "../../action/fetchData";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import loader from "../../loader.gif";
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from "axios";
//import Moment from "moment";
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import { IoIosCard, IoIosCloudDownload } from "react-icons/io";
const BEARER_TOKEN = localStorage.getItem("userData");

import PlanList from './PlanList'
import AddNewPlan from './AddNewPlan'

class InsuranceGrade extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isurer: [],
      insurance: [],
      insurer: '',
      selectlogo: null,
      selectFile: null,
      insurarId: 0,
      insuranceName: '',
      deductable: '',
      coverage: '',
      id: 0,
      showInsurer: false,
      showInsurance: false,
      categoryData: [],
      categoryId: '',
      grades: [],
      gradesCount: '',
      organizations: [],
      organizationsCount: '',
      selectedOrg: '',
      organizationsDD: [],
      gradesDD: [],
      selectedGrade: '',
      selectedPlan: '',
      orgId: localStorage.getItem('orgId'),
      token: localStorage.getItem('userData'),
      planGrades: [],
      plansList: [],
      selectedInsurar: '',
      filteredInsurar: [],
      selectedInsurance: '',
      loading: false
    };
    this.myRef = React.createRef()
    this.onInsuranceEdit = this.onInsuranceEdit.bind(this)
    this.onHideInsuranceForm = this.onHideInsuranceForm.bind(this)
  }

  componentDidMount() {
    const apiUrl = config.API_URL + '/insurance/insurar-list';
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
    const url = config.API_URL + '/insurance/plan/list';
    axios
      .get(url, { headers: { Authorization: bearer } })
      .then((r) => {
        if (r.status == 200) {
          this.setState({ insurance: r.data.policyList });

        }
      })
      .catch((error) => {
        console.log("API ERR: ");
        console.error(error);
        // res.json({ error: error });
      });

    const baseUrl = config.API_URL + '/insurance/network-category';
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
    var bearer = 'Bearer ' + BEARER_TOKEN;
    var orgList = [];
    axios.get(config.API_URL + '/organizations/list', { headers: { Authorization: bearer } })
      .then(r => {
        this.setState({
          organizations: r.data.organizations.rows,
          organizationsCount: r.data.organizations.count
        })
        if (this.state.organizations) {
          this.state.organizations.map((org, index) => {
            if (index == 0) {
              this.setState({
                selectedOrg: org.id
              })
            }
            orgList.push(<option key={org.id} value={org.id}> {org.orgName} </option>);
          })
          this.setState({
            organizationsDD: orgList
          });
        }

      })
      .catch((error) => {
        console.log("API ERR:", error);
        console.error(error);
        // res.json({ error: error });
      })

    let gradesList = [];
    axios.get(config.API_URL + '/employee/grade-list/' + this.state.orgId, { headers: { Authorization: bearer } })
      .then(r => {
        this.setState({
          grades: r.data.grades.rows,
          gradesCount: r.data.grades.count
        })
        if (this.state.grades) {
          this.state.grades.map((org, index) => {
            if (index == 0) {
              this.setState({
                selectedGrade: org.id
              })
            }
            gradesList.push(<option key={org.id} value={org.id}> {org.grade} </option>);
          })
          this.setState({
            gradesDD: gradesList
          });
        }
      })
      .catch((error) => {
        console.log("API ERR:", error);
        console.error(error);
        // res.json({ error: error });
      })

  }

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    })
  }


  checkMimeType = (event) => {
    //getting file object
    let files = event.target.files
    //define message container
    let err = []
    // list allow mime type
    const types = ['image/png']
    // loop access array
    for (var x = 0; x < files.length; x++) {
      // compare file type find doesn't matach
      if (types.every(type => files[x].type !== type)) {
        // create error message and assign to container   
        err[x] = files[x].type + ' is not a supported format\n';
      }
    };
    for (var z = 0; z < err.length; z++) {// if message not same old that mean has error 
      // discard selected file
      toast.error(err[z])
      event.target.value = null
    }
    return true;
  }

  checkMimeTypeInsurance = (event) => {
    //getting file object
    let files = event.target.files
    //define message container
    let err = []
    // list allow mime type
    const types = ['application/pdf']
    // loop access array
    for (var x = 0; x < files.length; x++) {
      // compare file type find doesn't matach
      if (types.every(type => files[x].type !== type)) {
        // create error message and assign to container   
        err[x] = files[x].type + ' is not a supported format\n';
      }
    };
    for (var z = 0; z < err.length; z++) {// if message not same old that mean has error 
      // discard selected file
      toast.error(err[z])
      event.target.value = null
    }
    return true;
  }


  maxSelectFile = (event) => {
    let files = event.target.files
    if (files.length > 1) {
      const msg = 'Only 1 can be uploaded at a time'
      event.target.value = null
      toast.warn(msg)
      return false;
    }
    return true;
  }
  checkFileSize = (event) => {
    let files = event.target.files
    let size = 5000000
    let err = [];
    for (var x = 0; x < files.length; x++) {
      if (files[x].size > size) {
        err[x] = files[x].type + 'is too large, please pick a smaller file\n';
      }
    };
    for (var z = 0; z < err.length; z++) {// if message not same old that mean has error 
      // discard selected file
      toast.error(err[z])
      event.target.value = null
    }
    return true;
  }
  onChangeHandler = event => {
    var files = event.target.files
    console.log(files);
    if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkFileSize(event)) {
      // if return true allow to setState
      this.setState({
        selectlogo: files,
        loaded: 0
      })
    }
  }

  onChangeInsuranceFile = event => {
    var files = event.target.files
    console.log(files);
    if (this.maxSelectFile(event) && this.checkMimeTypeInsurance(event) && this.checkFileSize(event)) {
      // if return true allow to setState
      this.setState({
        selectFile: files,
        loaded: 0
      })
    }
  }

  onClickHandler = () => {
    console.log(this.state.selectlogo);
    const data = new FormData()
    if (this.state.selectlogo) {
      data.append('logo', this.state.selectlogo[0])
    }
    data.append('insurarProvider', this.state.insurer)
    data.append('id', this.state.id);
    console.log(data);

    var bearer = 'Bearer ' + BEARER_TOKEN;
    const options = {
      method: 'POST',
      headers: {
        'Authorization': bearer
      },
      body: data
    };
    //   fetch(BaseURL, options)
    fetch(config.API_URL + "/insurance/add-insurer", options).then(res => res.json()).then(res => {
      this.componentDidMount();
      this.setState({
        insurer: '',
        selectlogo: null,
        id: 0,
        showInsurer: false
      })
    })
      .catch(error => { console.log(error) })
    this.componentDidMount();
  }

  onInsuranceEdit = (id) => {
    var bearer = 'Bearer ' + BEARER_TOKEN;
    const options = {
      method: 'GET',
      headers: {
        'Authorization': bearer
      }
    };
    //   fetch(BaseURL, options)
    fetch(config.API_URL + "/insurance/plan/edit/" + id, options).then(res => res.json()).then(res => {
      console.log('res.data.planDetails ====> ', res.planDetails);
      this.setState({
        planDetails: res.planDetails,
        showInsurance: true
      })
    })
      .catch(error => { console.log(error) })

  }

  changeOrg = (event) => {
    console.log('Org Change ' + event);
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value,
      loading: true
    }, () => {
      var bearer = 'Bearer ' + BEARER_TOKEN;
      const url = config.API_URL + '/insurance/plan-grade/' + this.state.selectedOrg;
      axios
        .get(url, { headers: { Authorization: bearer } })
        .then((r) => {
          if (r.status == 200) {
            this.setState({
              planGrades: r.data.planGrades,
              plansList: r.data.plansList,
              loading: false
            });
          }
        })
        .catch((error) => {
          console.log("API ERR: ");
          console.error(error);
          // res.json({ error: error });
        });
    })
  }

  changeGrade = (gradeId, event) => {
    console.log('Grade Change', gradeId, event);
    const name = event.target.name;
    const planId = event.target.value;
    this.setState({
      selectedGrade: gradeId,
      selectedPlan: planId
    }, () => {
      this.mapGrade();
    })
  }

  mapGrade = () => {
    let datas = {
      planId: this.state.selectedPlan,
      orgId: this.state.selectedOrg,
      gradeId: this.state.selectedGrade
    };
    console.log('datas ==> ', datas);
    const apiUrl = config.API_URL + '/map-org-plan-grade';
    var bearer = 'Bearer ' + this.state.token;
    const headers = {
      "Authorization": bearer,
      "Content-Type": "application/json"
    }
    // console.log('headers => ', headers);
    axios.post(apiUrl, datas, { headers: headers })
      .then(res => {
        // this.refreshData();
        toast.success(res.data.message);
        setTimeout(function () {
          toast.dismiss()
        }, 2000)
        this.setState({
          loading: true
        }, () => {
          var bearer = 'Bearer ' + BEARER_TOKEN;
          const url = config.API_URL + '/insurance/plan-grade/' + this.state.selectedOrg;
          axios
            .get(url, { headers: { Authorization: bearer } })
            .then((r) => {
              if (r.status == 200) {
                this.setState({
                  planGrades: r.data.planGrades,
                  plansList: r.data.plansList,
                  loading: false
                });
              }
            })
            .catch((error) => {
              console.log("API ERR: ");
              console.error(error);
              // res.json({ error: error });
            });
        });
        this.setState({ show: true })
        console.log('POST response', res);
      })

  }

  onChangeHandler = event => {
    var files = event.target.files
    console.log(files);
    if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkFileSize(event)) {
      // if return true allow to setState
      this.setState({
        selectlogo: files,
        loaded: 0
      })
    }
  }

  onClickInsuranceHandler = () => {

    const Insurancedata = new FormData()
    Insurancedata.append('insuranceName', this.state.insuranceName)
    Insurancedata.append('insurarId', this.state.insurarId)
    Insurancedata.append('insuranceDesc', this.state.insuranceDesc)
    if (this.state.selectFile) {
      Insurancedata.append('insuranceDoc', this.state.selectFile[0])
    }
    Insurancedata.append('deductable', this.state.deductable)
    Insurancedata.append('coverage', this.state.coverage)
    Insurancedata.append('categoryId', this.state.categoryId)
    Insurancedata.append('id', this.state.id);
    console.log(Insurancedata);

    var bearer = 'Bearer ' + BEARER_TOKEN;
    const options = {
      method: 'POST',
      headers: {
        'Authorization': bearer
      },
      body: Insurancedata
    };
    //   fetch(BaseURL, options)
    fetch(config.API_URL + "/insurance/plan/add-new", options).then(res => res.json()).then(res => {
      this.componentDidMount();
      this.setState({
        insurer: '',
        selectlogo: null,
        selectFile: null,
        insurarId: 0,
        insuranceName: '',
        deductable: '',
        coverage: '',
        id: 0,
        insuranceDesc: '',
        showInsurance: false,
        categoryId: ''
      })
    })
      .catch(error => { console.log(error) })

  }


  addDefaultSrc(ev) {
    ev.target.src = config.DEFAULT_ORG_IMG_URL
  }

  onShowInsurerForm = () => {
    this.setState({ showInsurer: true });
  }
  onHideInsuranceForm = () => {
    this.setState({ showInsurance: false, planDetails: [] });
  }
  onShowInsuranceForm = () => {
    this.setState({ showInsurance: true });
  }
  getUnique(arr, index) {
    const unique = arr
      .map(e => e[index])

      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the dead keys & store unique objects
      .filter(e => arr[e]).map(e => arr[e]);

    return unique;
  }
  loadGradePlanDetails() {
    this.state.filteredInsurar = this.getUnique(this.state.plansList, 'insurarProvider');
    console.log(this.state.filteredInsurar);
    if (this.state.loading) {
      return <tr><td colSpan="2">Loading</td></tr>
    } else {
      if (this.state.planGrades.length > 0) {
        return this.state.planGrades.map(sub => {
          {
            this.state.plansList.map(plan => {
              if (plan.planId == sub.planId) {
                this.state.selectedInsurar = plan.insurarProvider;
                console.log('neww ' + this.state.selectedInsurar)
              }
            })
          }
          return (
            <tr>

              <td>{sub.grade}</td>
              <td>
                <select name="selectedGrade" className="form-control" onChange={(e) => this.changeGrade(sub.id, e)}>
                  <option value="">Select Provider</option>
                  {this.state.filteredInsurar.map((plan, index) => {

                    return <option key={plan.planId} value={plan.planId} selected={plan.insurarProvider == this.state.selectedInsurar ? 'selected' : ''}> {plan.insurarProvider} </option>
                  })}
                </select>
              </td>
              <td>
                <select name="selectedGrade" className="form-control" onChange={(e) => this.changeGrade(sub.id, e)}>
                  <option value="">Select Plan</option>
                  {this.state.plansList.map((plan) => {
                    if (this.state.selectedInsurar == plan.insurarProvider) {
                      console.log('inside ' + this.state.selectedInsurar)
                      return <option key={plan.planId} value={plan.planId} selected={plan.planId == sub.planId ? 'selected' : ''}> {plan.insuranceName} </option>
                    }
                  })}
                </select>
              </td>
            </tr>
          )
        })
      } else {
        return <tr><td colSpan="2">No Records Available</td></tr>
      }
    }
  }
  // loadGradePlanDetails() {
  //   console.log(this.getUnique(this.state.plansList, 'insurarProvider'));
  //   if (this.state.loading) {
  //     return <tr><td colSpan="2">Loading</td></tr>
  //   } else {
  //     if (this.state.planGrades.length > 0) {
  //       return this.state.planGrades.map(sub => {
  //         return (
  //           <tr>

  //             <td>{sub.grade}</td>
  //             <td>
  //               <select name="selectedGrade" className="form-control" onChange={(e) => this.changeGrade(sub.id, e)}>
  //                 <option value="">Select Provider</option>
  //                 {this.state.plansList.map((plan, index) => {

  //                   return <option key={plan.planId} value={plan.planId} selected={plan.planId == sub.planId ? 'selected' : ''}> {plan.insurarProvider} </option>
  //                 })}
  //               </select>
  //             </td>
  //             <td>
  //               <select name="selectedGrade" className="form-control" onChange={(e) => this.changeGrade(sub.id, e)}>
  //                 <option value="">Select Plan</option>
  //                 {this.state.plansList.map((plan, index) => {
  //                   return <option key={plan.planId} value={plan.planId} selected={plan.planId == sub.planId ? 'selected' : ''}> {plan.insuranceName} </option>
  //                 })}
  //               </select>
  //             </td>
  //           </tr>
  //         )
  //       })
  //     } else {
  //       return <tr><td colSpan="2">No Records Available</td></tr>
  //     }
  //   }
  // }
  render() {
    return (

      <Col>
        <ToastContainer />

        <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-1 shadow-sm">
          <Row>
            <div className="col-md-3">
              <label className="mb-3 mt-1">Select Organization</label>
            </div>
            <div className="col-md-6">
              <select className="form-control mb-3" onChange={this.changeOrg} name="selectedOrg">
                <option value="">-Select-</option>
                {this.state.organizationsDD}
              </select>
            </div>
          </Row>
          <Table className="leaveTable mt-2">
            <thead>
              <tr>
                <th>Grades</th>
                <th>Provider</th>
                <th>Plan</th>
              </tr>
            </thead>
            <tbody>
              {this.loadGradePlanDetails()}
            </tbody>
          </Table>
        </Card>
      </Col>
    );
  }
}

export default InsuranceGrade;

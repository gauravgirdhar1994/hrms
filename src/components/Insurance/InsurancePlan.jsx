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
import AlertBox from "../../components/AlertBox/AlertBox";
const BEARER_TOKEN = localStorage.getItem("userData");

import PlanList from './PlanList'
import AddNewPlan from './AddNewPlan'

class InsurancePlan extends Component {
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
      alertMessage: '', showAlertBox: false,
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
      /* console.log('this.props.location ===> ', this.props.location)
      if (typeof this.props.location != 'undefined') {
        if (typeof this.props.location.state != 'undefined') {
          console.log('this.props ==> alert', this.props, this.props.location.state.message);
          this.setState({ 
            alertMessage: this.props.location.state.message, 
            showAlertBox: true 
          });
        }
      } */
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
    fetch(config.API_URL + "/insurance/plan/edit/"+id, options).then(res => res.json()).then(res => {
      console.log('res.data.planDetails ====> ', res.planDetails);
      this.setState({
        planDetails: res.planDetails,
        showInsurance: true
      })
    })
      .catch(error => { console.log(error) })

  }

  changeOrg = (event) => {
    console.log('Org Change');
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    }, () => {
    var bearer = 'Bearer ' + BEARER_TOKEN;
    const url = config.API_URL + '/insurance/insurance-list?orgId='+this.state.selectedOrg;
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
    })
  }

  changeGrade = (planId, event) => {
    console.log('Grade Change', planId, event);
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      selectedGrade: value,
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
        var bearer = 'Bearer ' + BEARER_TOKEN;
        const url = config.API_URL + '/insurance/insurance-list?orgId='+this.state.selectedOrg;
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
    this.setState({ showInsurance: false, planDetails:[] });
  }
  onShowInsuranceForm = () => {
    this.setState({ showInsurance: true });
  }
  render() {
    return (
      
      <Col>
      {/* <ToastContainer/> */}
            {this.state.showAlertBox && (
              <AlertBox 
                showDialogMessage={this.state.alertMessage}/>
            )}
       
                {this.state.showInsurance ? (
                <AddNewPlan
                    isurer={this.state.isurer}
                    planDetails={this.state.planDetails}
                    goBackToPlans={this.onHideInsuranceForm}
                />
                ) : (  
                    <PlanList
                    insurance={this.state.insurance}
                    onShowInsuranceForm={this.onShowInsuranceForm}
                    myRef={this.myRef}
                    onInsuranceEdit={this.onInsuranceEdit}
                    />
                )}
      </Col>
    );
  }
}

export default InsurancePlan;

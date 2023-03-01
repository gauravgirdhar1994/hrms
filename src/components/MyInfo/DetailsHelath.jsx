import React, { Component } from "react";
import { Modal, Form, Button, Card, Table } from "react-bootstrap";
import config from "../../config/config";
import { fetchData } from "../../action/fetchData";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import loader from "../../loader.gif";
import axios from "axios";
import Moment from "moment";
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import DataLoading from '../../components/Loaders/DataLoading';
import DownloadHealthCard from "../../components/Documents/downloadHealthCard";
import { IoIosCard, IoIosCloudDownload } from "react-icons/io";
import Network from './Network';
const BEARER_TOKEN = localStorage.getItem("userData");

class DetailsHealth extends Component {
        constructor(props) {
                super(props);
                this.state = {
                        show: false,
                        data: [],
                        form: [],
                        response: "",
                        token: localStorage.getItem("userData"),
                        Insurance: {},
                        dependent: [],
                        title: '',
                        claimTicketType: 0,
                        travelTicketType: 0,
                        ticketType: 0,
                        selectedFile: null,
                        description: '',
                        hoshow: false,
                        hospitalList: [],
                        pharmacyList: [],
                        clinicList: [],
                        hospitalCount: 0,
                        pharmacyCount: 0,
                        clinicCount: 0,
                        employeeData: [],
                        employeeEmiratData: {},
                        insuranceCoversData: [],
                        downloadHealthCard: false,
                        claimPriority: 0,
                        travelPriority: 0,
                        priority: 0,
                        relationship: { 'S': "Spouse", "P": "Parent", "C": "Child", 's': "Spouse", "p": "Parent", "c": "Child" },
                        gender: { 'M': 'Male', 'F': 'Female', 'm': 'Male', 'f': 'Female' },
                        employeeData: []
                };
        }

        componentDidMount() {
                const apiUrl = config.API_URL + "/insurance/insurance-dependent-details";
                var bearer = "Bearer " + BEARER_TOKEN;
                axios
                        .get(apiUrl, { headers: { Authorization: bearer } })
                        .then((r) => {
                                if (r.status == 200) {
                                        //var arrInsuranceData = [];
                                        //var arrDependentData = [];
                                        if (
                                                r.data.getInsuranceData.length > 0
                                        ) {
                                                this.setState({
                                                        Insurance: r.data.getInsuranceData[0],
                                                        employeeData: r.data.getEmpDetails,
                                                        employeeEmiratData: r.data.employeeEmiratData,
                                                        insuranceCoversData: r.data.planCoversData
                                                });
                                                if (r.data.getDependentData.length > 0) {
                                                        this.setState({
                                                                dependent: r.data.getDependentData,
                                                        })
                                                }
                                                this.getTicketsData()

                                        }
                                }
                        })
                        .catch((error) => {
                                console.log("API ERR: ");
                                console.error(error);
                                // res.json({ error: error });
                        });
        }

        getTicketsData = () => {
                const apiUrl = config.API_URL + "/ticket/types?_q=all";
                var bearer = "Bearer " + BEARER_TOKEN;
                axios
                        .get(apiUrl, { headers: { Authorization: bearer } })
                        .then((r) => {
                                console.log(r.data);
                                if (r.status == 200) {
                                        if (r.data.ticketTypes.length > 0) {
                                                r.data.ticketTypes.map(obj => {
                                                        if (obj.ticket_slug_name == 'INS_CLM') {
                                                                this.setState({ claimTicketType: obj.id, claimPriority: obj.priority });
                                                        } else if (obj.ticket_slug_name == 'TRAVEL_REQ') {
                                                                this.setState({ travelTicketType: obj.id, travelPriority: obj.priority });
                                                        }
                                                })
                                        }
                                        this.loadNetworkHospital()
                                }
                        })
                        .catch((error) => {
                                console.log("API ERR: ");
                                console.log(error);
                                // res.json({ error: error });
                        });
        }

        handleChange = (event) => {
                const name = event.target.name;
                const value = event.target.value;
                this.setState({
                        [name]: value
                });
        }

        handlehoShow = () => {
                this.setState({ hoshow: true });
        }

        handleDownloadClose = () => {

                this.setState({ downloadShow: false, downloadHealthCard: false })
        };

        downloadHealthCard = (id) => {
                console.log('Download Health Card');
                this.setState({
                        downloadHealthCard: true,
                        selectedEmp: id,
                        downloadShow: true
                })
        }


        loadNetworkHospital = () => {

                const networkUrl = config.API_URL + "/insurance/hospital-list";
                var bearer = "Bearer " + BEARER_TOKEN;
                axios
                        .get(networkUrl, { headers: { Authorization: bearer } })
                        .then((r) => {
                                if (r.status == 200) {
                                        //var arrInsuranceData = [];
                                        //var arrDependentData = [];

                                        this.setState({
                                                hospitalCount: r.data.hospitalList.length,
                                                pharmacyCount: r.data.pharmacyList.length,
                                                clinicCount: r.data.clinicList.length,
                                                hospitalList: r.data.hospitalList,
                                                pharmacyList: r.data.pharmacyList,
                                                clinicList: r.data.clinicList
                                        });
                                        console.log(this.state);

                                }
                        })
                        .catch((error) => {
                                console.log("API ERR: ");
                                console.log(error);
                                // res.json({ error: error });
                        });
        }

        checkMimeType = (event) => {
                //getting file object
                let files = event.target.files
                //define message container
                let err = []
                // list allow mime type
                const types = ['image/png', 'image/jpeg', 'image/gif', 'application/pdf']
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
        addDefaultSrc(ev) {
                ev.target.src = config.DEFAULT_ORG_IMG_URL
        }

        checkFileSize = (event) => {
                let files = event.target.files
                let size = 2000000
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
                                selectedFile: files,
                                loaded: 0
                        })
                }
        }

        onClickHandler = () => {
                console.log(this.state.selectedFile);
                const data = new FormData()
                data.append('attachments', this.state.selectedFile)
                data.append('ticket_type', this.state.ticketType)
                data.append('title', this.state.title)
                data.append('priority', this.state.priority)
                data.append('description', this.state.description)
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
                fetch(config.API_URL + "/ticket/add", options).then(res => res.json()).then(res => {
                        this.handleClose();
                        toast.success('Your Claim request has been generated and the same has been assigned to the relevant team. To check the status of your ticket, please check the same under Tickets');
                        setTimeout(function () {
                                toast.dismiss()
                        }, 10000)
                        this.setState({
                                selectedFile: null,
                                ticketType: 0,
                                description: ''
                        })

                })
                        .catch(error => { console.log(error) });

        }


        handleShow = (event) => {
                let name = event.target.name;
                if (name == 'claimRequest') {
                        this.setState({ title: "Raise a Claim Request", ticketType: this.state.claimTicketType, priority: this.state.claimPriority })
                } else {
                        this.setState({ title: "Raise a Travel Request", ticketType: this.state.travelTicketType, priority: this.state.travelPriority })
                }
                this.setState({ show: true });
        };

        handleClose = () => {
                console.log("close button");
                this.setState({ show: false });
        };

        handleHoClose = () => {
                this.setState({ hoshow: false });
        }

        numberWithCommas = (rec) => {
                return rec.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        render() {
                console.log(this.state.Insurance);
                if (this.state.Insurance.id > 0) {
                        return (
                                <>

                                        <div className="insuranceDetails pl-4 pb-4 pt-4 pr-4">
                                                <ToastContainer className="right" position="top-right"
                                                        autoClose={5000}
                                                        hideProgressBar={false}
                                                        newestOnTop={false}
                                                        closeOnClick
                                                        rtl={false}
                                                        pauseOnVisibilityChange
                                                        draggable
                                                        pauseOnHover />
                                                <div className="row mt-3 wow fadeInUp pt-2">
                                                        <div className="col-xl col-sm-6 pb-3">
                                                                <div className="card d-block p-xl-3 p-2  h-100 shadow-sm">
                                                                        <div className="healthcardBox">
                                                                                <div className="logoWithText">
                                                                                        <div className="LogoBox">
                                                                                                <img src={config.BASE_URL + '/' + this.state.Insurance.logo} height="80" width="80" onError={this.addDefaultSrc} />
                                                                                                <span>{this.state.Insurance.insuranceName}</span>
                                                                                        </div>


                                                                                        <div className="LogoBox">
                                                                                                <img src={config.BASE_URL + '/' + this.state.Insurance.cat_logo} height="80" width="80" onError={this.addDefaultSrc} />
                                                                                                <span className="text-right">{this.state.Insurance.categoryName}</span>
                                                                                        </div>

                                                                                </div>

                                                                                <div className="date startDateEnd">
                                                                                        <div>
                                                                                                <span>
                                                                                                        Start Date :{" "}
                                                                                                        {(this.state.Insurance.startDate) ? Moment(this.state.Insurance.startDate).format(config.DATE_FORMAT
                                                                                                        ) : ''}
                                                                                                </span>

                                                                                                <span>
                                                                                                        End Date :{" "}
                                                                                                        {(this.state.Insurance.endDate) ? Moment(this.state.Insurance.endDate).format(
                                                                                                                config.DATE_FORMAT
                                                                                                        ) : ''}
                                                                                                </span>
                                                                                                <div>
                                                                                                        <div className="idcard">
                                                                                                                Card Number : {" "}
                                                                                                                <span> {this.state.Insurance.cardId}</span><br />
                                                                                                                Call Center : {" "} <span>{this.state.Insurance.callCenterNumber}</span>
                                                                                                                <div style={{ marginTop: "10px" }}>
                                                                                                                        <button className="btn btn-sm btn-outline-primary" onClick={() => this.downloadHealthCard(this.state.employeeData.id)}>Download Cards</button>
                                                                                                                </div>
                                                                                                        </div>
                                                                                                </div>
                                                                                        </div>


                                                                                        <div className="cardDetils">
                                                                                                <span style={{ 'cursor': 'pointer' }} class="textHeading margin-bottom-20"> <a href={config.BASE_URL + '/' + this.state.Insurance.insuranceDoc} target="_blank" download>Table of benefit ( PDF )</a> </span>
                                                                                                <span style={{ 'cursor': 'pointer' }} onClick={this.handlehoShow} class="textHeading">Network - {this.state.Insurance.networkName}</span>
                                                                                                <ul>
                                                                                                        <li style={{ 'cursor': 'pointer' }} onClick={this.handlehoShow} >Hospitals ({this.state.hospitalCount}) </li>
                                                                                                        <li style={{ 'cursor': 'pointer' }} onClick={this.handlehoShow} >Pharmacies ({this.state.pharmacyCount})</li>
                                                                                                        <li style={{ 'cursor': 'pointer' }} onClick={this.handlehoShow} >Clinics ({this.state.clinicCount})</li>
                                                                                                </ul>
                                                                                        </div>



                                                                                </div>


                                                                        </div>
                                                                </div>

                                                        </div>

                                                        <div className="col-xl col-sm-6 pb-3 cardDetils">
                                                                <div className="card d-block p-xl-3 p-2  h-100 shadow-sm">
                                                                        <div className="row">
                                                                                <div className="col-sm-6 margin-bottom-20">
                                                                                        <span className="textHeading">Annual Financial Limit </span>
                                                                                        <span>AED {this.numberWithCommas(this.state.Insurance.annual_aggr_limit)}</span>
                                                                                </div>

                                                                                <div className="col-sm-6 margin-bottom-20">
                                                                                        <span className="textHeading"> Max Annual Limit for P&C </span>
                                                                                        <span> {this.numberWithCommas(this.state.Insurance.terretorialLimit)}</span>
                                                                                </div>

                                                                                <div className="col-sm-6 margin-bottom-20">
                                                                                        <span className="textHeading"> Territorial Limit  </span>
                                                                                        <span> {this.state.Insurance.coverage}</span>
                                                                                </div>


                                                                                <div className="col-sm-6 margin-bottom-20">
                                                                                        <span className="textHeading">Deductible</span>
                                                                                        <span> {this.state.Insurance.deductible}</span>
                                                                                </div>

                                                                                <div className="col-sm-6 margin-bottom-20">
                                                                                        <span className="textHeading">Copay on OP</span>
                                                                                        <span> {this.state.Insurance.copayOnOp}</span>
                                                                                </div>

                                                                                <div className="col-sm-6 margin-bottom-20">
                                                                                        <span className="textHeading" >Copay ON IP</span>
                                                                                        <span>{this.state.Insurance.copayOnIp}</span>
                                                                                </div>

                                                                                <div className="col-sm-6 margin-bottom-20">
                                                                                        <span className="textHeading" >Copay and limit on Pharmacy</span>
                                                                                        <span>{this.state.Insurance.copayOnPharmacy}</span>

                                                                                </div>
                                                                                {this.state.insuranceCoversData.map(obj => {
                                                                                        if (obj.cover_type == 1) {
                                                                                                return (
                                                                                                        <div className="col-sm-6 margin-bottom-20">
                                                                                                                <span className="textHeading">Dental Cover </span>
                                                                                                                <span>{obj.description}</span>
                                                                                                        </div>
                                                                                                )
                                                                                        }

                                                                                        if (obj.cover_type == 2) {
                                                                                                return (
                                                                                                        <div className="col-sm-6 margin-bottom-20">
                                                                                                                <span className="textHeading">Maternity Cover  </span>
                                                                                                                <span>{obj.description}</span>
                                                                                                        </div>
                                                                                                )
                                                                                        }

                                                                                        if (obj.cover_type == 3) {
                                                                                                return (
                                                                                                        <div className="col-sm-6 margin-bottom-20">
                                                                                                                <span className="textHeading">Optical Cover  </span>
                                                                                                                <span>{obj.description}</span>
                                                                                                        </div>
                                                                                                )
                                                                                        }



                                                                                })}

                                                                                <div className="col-sm-6 margin-bottom-20">
                                                                                        <span className="textHeading">P & C waiting period  </span>
                                                                                        <span>{this.state.Insurance.waitingPeriod}</span>
                                                                                </div>




                                                                        </div>
                                                                </div>
                                                        </div>
                                                </div>






                                                <div className="row">
                                                        {/* <div className="col-sm-9">
            <h4 className="font-weight-light mt-5 m2-4 font-16 pl-3">
              {" "}
              See Network
            </h4>

            <div className="pl-3">
              <a href="">Hospitals(66)</a> <a href="">Pharmacies(33)</a>{" "}
              <a href="">Clainics(56)</a>{" "}
            </div>
          </div> */}
                                                        {/* <div className="col-sm-3">
            <h4 className="font-weight-light mt-5 m2-4 font-16 pl-3">
              {" "}
              Includes
            </h4>
            <h4 className="font-weight-light m2-4 font-16 pl-3">
              {" "}
              <span>Dental</span> ,<span>Optical</span>
            </h4>
          </div> */}
                                                </div>
                                                {this.state.dependent.length > 0 ? (
                                                        <>
                                                                <h4 className="mt-5 m2-4 font-16 pl-3">
                                                                        View Member list
                                                                </h4>

                                                                <Card className="card d-block p-3 mb-4 shadow-sm">
                                                                        <Table className="leaveTable listview tableIns">
                                                                                <thead>
                                                                                        <tr>
                                                                                                <th>Name</th>
                                                                                                <th>Relationship</th>
                                                                                                <th>Gender</th>
                                                                                                <th>Emirates ID</th>
                                                                                                <th>Birth Date</th>
                                                                                                <th>Card ID</th>
                                                                                        </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                        <tr>
                                                                                                <td>{this.state.employeeData.firstname} {this.state.employeeData.lastname}</td>
                                                                                                <td>EMPLOYEE</td>
                                                                                                {console.warn('Happy Dtaa ' + this.state.employeeData.gender)}
                                                                                                <td>{this.state.employeeData.gender ? this.state.gender[this.state.employeeData.gender] ? this.state.gender[this.state.employeeData.gender].toUpperCase() : '' : ''}</td>
                                                                                                <td>{this.state.employeeEmiratData.eidNo}</td>
                                                                                                <td>{(this.state.employeeData.birthDate) ? Moment(this.state.employeeData.birthDate).format(config.DATE_FORMAT) : ''}</td>
                                                                                                <td> {this.state.Insurance.cardId}</td>
                                                                                        </tr>
                                                                                        {this.state.dependent.map((val) => {
                                                                                                return (
                                                                                                        <tr>
                                                                                                                <td>{val.firstname} {val.lastname}</td>
                                                                                                                <td> {this.state.relationship[val.relationship.toUpperCase()].toUpperCase()}</td>
                                                                                                                <td>{this.state.gender[val.gender.toUpperCase()].toUpperCase()} </td>
                                                                                                                <td>{val.emiratesId}</td>
                                                                                                                <td>{Moment(val.birthDate).format(config.DATE_FORMAT)}</td>
                                                                                                                <td>{val.cardId}</td>
                                                                                                        </tr>
                                                                                                );
                                                                                        })}
                                                                                </tbody>
                                                                        </Table>
                                                                </Card> </>) : ''}
                                        </div>

                                        <Network show={this.state.hoshow} onHide={this.handleHoClose} />
                                        <div className="form-group row pt-5 edit-basicinfo">
                                                <div className="col-lg-12 text-center">
                                                        <input
                                                                type="reset"
                                                                className="btn btn-outline-primary mr-2"
                                                                onClick={this.handleShow}
                                                                value="Raise a Claim"
                                                                name="claimRequest"
                                                        />
                                                        <input
                                                                type="submit"
                                                                className="btn btn-primary"
                                                                value="Request Travel Certificate"
                                                                name="travelRequest"
                                                                onClick={this.handleShow}
                                                        />
                                                </div>
                                        </div>

                                        <Modal show={this.state.show} onHide={this.handleClose}>
                                                <Modal.Header closeButton>
                                                        <Modal.Title>{this.state.title}</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                        <fieldset>
                                                                <label htmlFor="instituteName" className="mb-0">
                                                                        Enter  Details
                                                                </label>
                                                                <div className="row mb-3">
                                                                        <div className="col-lg-12">
                                                                                <textarea
                                                                                        className="form-control"
                                                                                        placeholder="Details...."
                                                                                        name="description"
                                                                                        onChange={this.handleChange}
                                                                                        value={this.state.description}
                                                                                        rows="10"
                                                                                ></textarea>
                                                                        </div>
                                                                </div>
                                                                <label className="mb-0">Upload document</label>
                                                                <div className="row mb-3">
                                                                        <div className="col-lg-12">
                                                                                <label htmlFor="fileupload" className="fullWidth">
                                                                                        <input
                                                                                                type="file"
                                                                                                id="fileupload"
                                                                                                name="fileupload"
                                                                                                placeholder="Ex: image"
                                                                                                className="form-control"
                                                                                                required=""
                                                                                                onChange={this.onChangeHandler}
                                                                                        />
                                                                                </label>
                                                                        </div>
                                                                </div>
                                                        </fieldset>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                        <Button variant="secondary" onClick={this.handleClose}>
                                                                Close
                                                        </Button>
                                                        <Button variant="primary" onClick={this.onClickHandler}>
                                                                Save Changes
                                                        </Button>
                                                </Modal.Footer>
                                        </Modal>
                                        {this.state.downloadHealthCard ? (
                                                <DownloadHealthCard empId={this.state.selectedEmp} show={this.state.downloadShow} onHide={this.handleDownloadClose}></DownloadHealthCard>
                                        ) : ''}
                                </>
                        );
                }
                return (
                        <> <div className="col-md-12 mx-auto py-2" >
                                <div className="card d-block p-xl-3 p-2  h-100 shadow-sm">
                                        Currently No Insurance given to this employee
                                </div>
                        </div> </>
                )
        }
}

export default DetailsHealth;

import React, { Component } from 'react';
import { Modal, Form, Button, Card, Table } from "react-bootstrap";
import config from '../../config/config';
import { fetchData } from "../../action/fetchData";
import 'react-toastify/dist/ReactToastify.css';
import loader from '../../loader.gif';
import axios from 'axios';
import Moment from 'moment';
import DatePicker from "react-datepicker";
const BEARER_TOKEN = localStorage.getItem("userData");

class Health extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show:false,
            data : [], 
            form: [],
            response:"", 
            token: localStorage.getItem("userData"),
            Insurance:[],
            dependent:[]
        }
    }

    componentDidMount(){
       const apiUrl = config.API_URL+'/insurance/insurance-dependent-details';
       var bearer = 'Bearer ' + BEARER_TOKEN;
       axios.get(apiUrl,{ headers: { Authorization: bearer }})
       .then(r => {
          
        if (r.status == 200) {
            //var arrInsuranceData = [];
            //var arrDependentData = [];
            if(r.data.getInsuranceData.length > 0 && r.data.getDependentData.length > 0){
                this.setState({Insurance : r.data.getInsuranceData, dependent:r.data.getDependentData });
                console.log('insurance data',this.state.Insurance);
            }

            
        }
    })
    .catch((error) => {
        console.log("API ERR: ");
        console.error(error);
        // res.json({ error: error });
    });
    }

    handleShow = () => {
        console.log('close button')
        this.setState({ show: true })
    };

    handleClose = () => {
        console.log('close button')
        this.setState({ show: false })
    };


    render() {
        return (

            <>
                <h4 className="mb-4 font-16 pl-3">My Info - Helth Insurance</h4>
                <ul id="tabsJustified" className="nav nav-tabs nav-fill bg-magenta rounded-sm">
                    <li className="nav-item">
                        <a href="#Insurance" data-target="#Insurance" data-toggle="tab" className="nav-link active">Insurance</a>
                    </li>
                    <li className="nav-item">
                        <a href="#TableBefefits" data-target="#TableBefefits" data-toggle="tab" className="nav-link">Table of Benefits</a>
                    </li>
                    <li className="nav-item">
                        <a href="#hospitals" data-target="#hospitals" data-toggle="tab" className="nav-link"> Holpitals &  Pharamacy</a>
                    </li>
                </ul>

                <div id="tabsJustifiedContent" className="tab-content py-1">


                    <div className="tab-pane fade active show" id="Insurance">
                        <Card className="card d-block p-1 mb-4 shadow-sm">

                            <Table className="leaveTable listview">
                                <thead>
                                    <tr>
                                        <td colSpan="6"><h4>Health</h4></td>
                                    </tr>
                                    <tr>
                                        <th>Benefit</th>
                                        <th>Effective</th>
                                        <th>Coverage</th>
                                        <th>Employee Pays</th>
                                        <th>Company Pays</th>
                                        <th>Frequency</th>
                                    </tr>
                                </thead>
                                <tbody>
                                
                                {this.state.Insurance.map(obj => {
                                    
                                  return(
                                    <tr>
                                        <td>
                                            <div className="brancLogo"> <img src="/assets/logo.png" title="logo" alt="" logo></img></div>
                                        <span>{obj.insuranceName}</span>
                                        </td>
                                        <td> {Moment(obj.startDate).format(config.DATE_FORMAT)}</td>
                                        <td>Employee / Family </td>
                                        <td>N/A</td>
                                        <td>N/A</td>
                                        <td>N/A</td>
                                    </tr>
                                  )
                                })}

                                </tbody>
                            </ Table>
                        </Card>

                        <Card className="card d-block p-1 mb-4 shadow-sm">
                            <h6>Dependants</h6>

                            <Table className="leaveTable listview">
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
                                   
                                   {this.state.dependent.map(val =>{

                                   return (
                                    <tr>
                                        <td>
                                            {val.name}
                                </td>
                                        <td> {val.relationship.toUpperCase()}</td>
                                        <td>{val.gender.toUpperCase()} </td>
                                        <td>{val.emiratesId}</td>
                                        <td>{Moment(val.birthDate).format(config.DATE_FORMAT)}</td>
                                        <td>{val.cardId}</td>
                                    </tr>
                                   )
                                   })}
                                </tbody>
                            </ Table>
                            <div className="form-group row pt-2 pl-2">
                                <div className="col-lg-12 text-left">
                                    <span className="addNewButton" onClick={this.handleShow}> <i className="icon-plus icons"></i> Add New</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="tab-pane fade " id="TableBefefits">
                        <Card className="card d-block p-1 mb-4 shadow-sm pl-3 pr-3">
                        <h6 className="pl-3 pt-3 pb-3">Health</h6>
                        <ul className="insuranceCard col-sm-12">
                            <li>
                                <span className="col-sm-4">
                                <div className="logoBox"><img src="/assets/logo.png" /></div> 
                                <div>
                                    Orient basic NEMED
                                    <small>Max Annual Limit for P&C </small>
                                    <small>AED 75000</small>
                                    </div>
                                    </span>
                                <span className="col-sm-4">
                                    <div>Coverage</div>
                                    <small>UAE Excluding Abu dhabi </small>
                                </span>
                                <span className="col-sm-4">
                                    <div>hospital Network</div>
                                    <small className="blue">View All</small>
                                </span>
                            </li>
                        </ul>

                        <h6 className="pl-3 pt-3 pb-3">Dental</h6>
                        <ul className="insuranceCard col-sm-12">
                            <li>
                            <span className="col-sm-4">
                                    <div className="logoBox"><img src="/assets/logo.png" /></div> 
                                <div>
                                    Orient basic NEMED
                                    <small>Max Annual Limit for P&C </small>
                                    <small>AED 75000</small>
                                    </div>
                                    </span>
                                    <span className="col-sm-4">
                                    <div>Coverage</div>
                                    <small>UAE Excluding Abu dhabi </small>
                                </span>
                                <span className="col-sm-4">
                                    <div>hospital Network</div>
                                    <small>Clinics 555</small>
                                    <small className="blue">View All</small>
                                </span>
                            </li>
                        </ul>

                        </Card>
                    </div>













                    <div className="tab-pane fade" id="hospitals">
                    <Card className="card d-block p-1 mb-4 shadow-sm pl-3 pr-3">                     


                        <ul className="insuranceCard col-sm-12">
                            <li>
                                <span className="col-sm-4">

                                <div className="logoBox"><img src="/assets/logo.png" /></div> 
                                 <div>
                                    Orient basic NEMED
                                    <small>Max Annual Limit for P&C </small>
                                    <small>AED 75000</small>
                                    </div>
                                </span>

                                <span className="col-sm-8">

                                </span>
                            </li>
                        </ul>

                        


                       
                        </Card>
                    </div>
                </div>























                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Department</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <fieldset>
                            <label htmlFor="instituteName" className="mb-0">First Name</label>
                            <div className="row mb-3">
                                <div className="col-lg-12">
                                    <input type="text" id="firstname" name="Firstname" placeholder="Ex: Sanjeev " className="form-control" required="" />
                                </div>
                            </div>
                            <label htmlFor="degree" className="mb-0">Last Name</label>
                            <div className="row mb-3">
                                <div className="col-lg-12">
                                    <input type="text" id="lastName" name="lastName" placeholder="Ex: kumar" className="form-control" required="" />
                                </div>
                            </div>
                            <label htmlFor="study" className="mb-0">Date of Birth</label>
                            <div className="row mb-3">
                                <div className="col-lg-12">
                                    <input type="date" id="dob" name="Dob" placeholder="Ex: 22-05-1990" className="form-control" required="" />
                                </div>
                            </div>
                            <label htmlFor="grade" className="mb-0">Gender</label>
                            <div className="row mb-3">
                                <div className="col-lg-12">
                                    <select className="form-control custom-select">
                                        <option value="1">Male</option>
                                        <option value="1">Female</option>
                                    </select>
                                </div>
                            </div>
                            <label htmlFor="grade" className="mb-0">RelationShip</label>
                            <div className="row mb-3">
                                <div className="col-lg-12">
                                    <select className="form-control custom-select">
                                        <option value="1">relationship</option>
                                    </select>
                                </div>
                            </div>
                            <label htmlFor="study" className="mb-0">EMI Rates ID</label>
                            <div className="row mb-3">
                                <div className="col-lg-12">
                                    <input type="text" id="emirates" name="emirate" placeholder="Ex: 22-05-1990" className="form-control" required="" />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-lg-12 text-center">
                                    <span className="addNewButton" onClick={this.handleShow}> <i className="icon-plus icons"></i> Add Sub Department</span>
                                </div>
                            </div>

                        </fieldset>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.props.onHide}>
                            Close
            </Button>
                        <Button variant="primary" onClick={this.props.onHide}>
                            Save Changes
            </Button>
                    </Modal.Footer>
                </Modal>


            </>
        );
    }
}

export default Health;


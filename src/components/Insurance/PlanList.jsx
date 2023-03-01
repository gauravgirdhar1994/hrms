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
class PlanList extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <>
                <h4>Insurance Plans </h4>
                <Card className="card topFilter pl-4 pr-4 pt-3 pb-3 br-3 mb-1 shadow-sm ddddd" style={(this.props.showInsurance) ? { display: 'none !important' } : {}}>
                    <Table className="leaveTable">
                        <thead>
                            <tr>
                                <th>Insurance Provider</th>
                                <th>Plan Name</th>
                                <th>Description</th>
                                {/* <th>Grade</th>
                                <th>For Website</th> */}
                                <th>Status</th>
                                <th>View Document</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.insurance.map(sub => {
                                return (
                                    <tr>
                                        <td>{sub.insurarProvider}</td>
                                        <td>{sub.insuranceName}</td>
                                        <td>{sub.insuranceDesc}</td>
                                        {/* <td>{sub.grade}</td>
                                        <td>{sub.forWebsite==1?"Yes":"No"}</td> */}
                                        <td>{(sub.status) ? 'Active' : 'Inactive'}</td>
                                        <td><a target="_blank" href={config.BASE_URL+'/'+sub.insuranceDoc}>View Document</a></td>
                                        <td>
                                            <input type="reset" data={sub.id} className="btn btn-primary mr-2" onClick={() => this.props.onInsuranceEdit(sub.id)} value="Edit" />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Card>

                <div ref={this.props.myRef} onClick={this.props.onShowInsuranceForm} class="form-group row pt-2 mb-5 " style={(this.props.showInsurance) ? { display: 'none' } : {}}><div class="col-lg-12 text-left"><span class="addNewButton"> <i class="icon-plus icons"></i> Create New Insurance Plan</span></div></div>
            </>
        )
    }
}

export default PlanList; 
import React, { Component } from 'react';
// import { Row, Col, Card, Table } from 'reactstrap';
import axios from "axios";
import Moment from "moment";
import { Modal, Button } from "react-bootstrap";
import UploadDependent from '../../components/Dependent/UploadDependent';
import DateRangePicker from 'react-daterange-picker';
import moment from 'moment-range';
import { ExportReactCSV } from '../../views/ExportReactCSV';
import config from '../../config/config';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import UploadLeave from './UploadLeave';
import { CSVLink } from 'react-csv';
const BEARER_TOKEN = localStorage.getItem("userData");

class ImportLeaveFile extends Component {
    constructor() {
        super();
        this.state = {
            show: false,
            data: [],
            orgId: localStorage.getItem('orgId'),
            exportData: [],
            leaveData: [],
            headers: [],

        };
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        localStorage.setItem('attendanceMonth', value);
    }
    handleClose = () => this.setState({ show: false });
    handleShow = () => this.setState({ show: true });

    componentDidMount() {

        this.refreshData();

    }

    refreshData() {
        axios.get(config.API_URL + '/leaves/' +
            this.state.orgId, { headers: { Authorization: 'bearer ' + BEARER_TOKEN } })
            .then(r => {
                console.log(r.data.leaves.rows);
                if (r.status == 200) {

                    this.setState({ leaveData: r.data.leaves.rows });
                    this.getCountries();
                }
            }).catch((error) => {
                console.log("API ERR: ");
                console.error(error);
            });
    }

    getCountries() {
        var bearer = "Bearer " + BEARER_TOKEN;
        axios
            .get(
                config.API_URL +
                "/common/employees/" +
                this.state.orgId,
                { headers: { Authorization: bearer } }
            )
            .then((r) => {
                // console.log("Api result", r);
                let exportData = [];
                this.setState({ data: r.data.Employees }, () => {
                    if (Object.keys(this.state.data).length > 0) {
                        console.log('aaa ', this.state.leaveData);
                        this.state.data.map((data, key) => {
                            console.log('Export Data', data);
                            exportData[key] = {};
                            exportData[key]['Employee Code'] = data.empCode ? data.empCode : '';
                            exportData[key]['Employee Name'] = data.firstname + ' ' + data.lastname;
                            for (var i in this.state.leaveData) {
                                if (this.state.leaveData[i].status == 1) {
                                    if (this.state.leaveData[i].orgId == this.state.orgId) {
                                        if (this.state.leaveData[i].leaveName != "LWP") {
                                            let m = ('Previous ' + this.state.leaveData[i].leaveName + ' ' + 'Balance');
                                            exportData[key][m] = 0;
                                        }
                                    }
                                }
                            }
                        })
                        this.setState({
                            exportData: exportData
                        })
                    }
                });
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }
    render() {
        console.log('Leave Export Data', this.state.exportData);
        return (
            <>


                <div className="pb-5 text-center"> <input type="button" onClick={this.handleShow} class="btn btn-primary mr-2" value="Import Leave Balance" /> <span className="downloadHere">If you don’t have the format <CSVLink data={this.state.exportData} filename='Employee_Leave_Balance.csv'>Download here</CSVLink></span></div>

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Leave Balance Import</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>


                        <div className="row mb-1">
                            <div className="col-lg-4"> <label htmlFor="Location" className="mb-2">Upload *</label></div>
                            <div className="col-lg-8"> <UploadLeave onReferesh={this.props.onReloadData} /></div>
                        </div>

                        <label htmlFor="Location" className="mb-2 mt-2 text-right">File type - csv size 5 MB only</label>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default ImportLeaveFile;

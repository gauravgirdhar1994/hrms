import React, { Component } from 'react';
// import { Row, Col, Card, Table } from 'reactstrap';
import { Modal, Button } from "react-bootstrap"
import UploadAttendance from '../../components/Attendance/UploadAttendance';
import DateRangePicker from 'react-daterange-picker';
import moment from 'moment-range';
import config from '../../config/config'
var months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
var year = new Date().getFullYear();
class ImportFile extends Component {
    constructor() {
        super();
        this.state = {
            show: false
        };
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
         localStorage.setItem('attendanceMonth',value);
    }
    handleClose = () => this.setState({ show: false });
    handleShow = () => this.setState({ show: true });
    render() {

        return (
            <>
                <p className="">Attendance Import is used to import employee monthly attendance that helps in calculating working days and loss of pay days while running payrolls.</p>
                <div className="pb-5 text-center"> <input type="button" onClick={this.handleShow} class="btn btn-primary mr-2" value="Import Attendance" /> <span className="downloadHere">If you don’t have the format <a href={config.BASE_URL+''+'/uploads/sample/UserAttendance.csv'} download>download here</a></span></div>



                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Attendance Import</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className="row mb-4">
                            <div className="col-lg-4">Month</div>
                            <div className="col-lg-8">
                            <div className="offset-md-3 col-md-6">
                                <select className="form-control custom-select" name="month" value={this.state.month} onChange={this.handleChange}>
                                    <option value="">Select Month</option>
                                    {months.map(function (key, obj) {
                                        return (
                                            <option value={obj}>{key + ' ' + year} </option>
                                        )
                                    })};
                               </select>
                               </div>
                            </div>
                        </div>

                        <div className="row mb-1">
                            <div className="col-lg-4"> <label htmlFor="Location" className="mb-2">Upload *</label></div>
                            <div className="col-lg-8"> <UploadAttendance month={this.state.month} onReferesh={this.props.onReloadData} /></div>
                        </div>

                        <label htmlFor="Location" className="mb-2 mt-2 text-right">File type - csv size 5 MB only</label>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default ImportFile;
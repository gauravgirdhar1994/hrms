import React, { Component } from 'react';
import { Modal, Button, Card, Table, Form } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import config from '../config/config';
import { TablePagination } from 'react-pagination-table';
import { FaFilter } from 'react-icons/fa';

class Payslips extends Component {
    constructor(props) {
        super(props);

        this.state = {
            token: localStorage.getItem("userData"),
            orgId: localStorage.getItem("orgId"),
            data: {},
            dataCount: 0,
            showFilters: false,
            departments: {},
            locations: {},
            selectedFile: '',
            imgSrc: '',
            show: false,
            selectedTicket: '',
            ticketEmp: '',
            selectedDepartment: '',
            selectedLocation: ''
        }
    }
    componentDidMount() {
        this.refreshData();
    }

    showFilters = () => {
        this.setState({ showFilters: !this.state.showFilters });
    }
    
    handleClose = () => {
        console.log('close button')
        this.setState({ show: false })
    };

    refreshData = () => {
        var bearer = 'Bearer ' + this.state.token;
        var apiUrl = config.API_URL + '/salary-certificates/' + this.state.orgId;
        if (this.state.selectedDepartment) {
            apiUrl = config.API_URL + '/salary-certificates/' + this.state.orgId + '?department=' + this.state.selectedDepartment;
        }
        if (this.state.selectedLocation) {
            apiUrl = config.API_URL + '/salary-certificates/' + this.state.orgId + '?location=' + this.state.selectedLocation;
        }
        if (this.state.selectedDepartment && this.state.selectedLocation) {
            apiUrl = config.API_URL + '/salary-certificates/' + this.state.orgId + '?department=' + this.state.selectedDepartment + '&location=' + this.state.selectedLocation;
        }
        axios.get(apiUrl, { headers: { Authorization: bearer } })
            .then(r => {
                console.log('Api result', r);
                if (r.data.ticketDetails) {
                    this.setState({ data: r.data.ticketDetails.tickets.rows, dataCount: r.data.ticketDetails.tickets.count })
                }
                else {
                    this.setState({ data: '', dataCount: 0 })
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });

        axios.get(config.API_URL + '/common/departments/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                console.log('Positions Response', r);
                if (r.status == 200) {
                    var arrTen = [];
                    for (var k = 0; k < r.data.Departments.length; k++) {
                        arrTen.push(<option key={r.data.Departments[k].id} selected={this.state.selectedDepartment && this.state.selectedDepartment == r.data.Departments[k].id ? 'selected' : ''} value={r.data.Departments[k].id}> {r.data.Departments[k].departmentName} </option>);
                    }
                    this.setState({ departments: arrTen });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });

        axios.get(config.API_URL + '/common/locations/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                console.log('Positions Response', r);
                if (r.status == 200) {
                    var arrTen = [];
                    for (var k = 0; k < r.data.Locations.length; k++) {
                        arrTen.push(<option key={r.data.Locations[k].id} selected={this.state.selectedLocation && this.state.selectedLocation == r.data.Locations[k].id ? 'selected' : ''} value={r.data.Locations[k].id}> {r.data.Locations[k].locationName} </option>);
                    }
                    this.setState({ locations: arrTen });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }

    changeDepartment = event => {
        this.setState({ selectedDepartment: event.target.value });
    }

    changeLocation = event => {
        this.setState({ selectedLocation: event.target.value });
    }

    applyfilter = () => {
        console.log('Apply filter');
        this.refreshData();
        this.setState({ showFilters: false });
    }

    showUploadPopup = (ticketId, empId) => {
        console.log('UPload event', empId, ticketId)
        this.setState({
            selectedTicket: ticketId,
            ticketEmp: empId, 
            show: true
        });
    }

    uploadSalarySlip = (event, ticketId, empId) => {
        var bearer = 'Bearer ' + this.state.token;

        const headers = {
            "Authorization": bearer
        };

        this.state.selectedFile = event.target.files[0];
        // Details of the uploaded file 
        console.log('Selected file', this.state.selectedFile);

        let reader = new FileReader();

        reader.onloadend = () => {
            console.log('Load end', reader.result);
            this.setState({
                imgSrc: reader.result
            });
            // console.log('Image src state', this.state.imgSrc);
        }

        reader.readAsDataURL(event.target.files[0]);
        
        const formData = new FormData();

        // Update the formData object 
        formData.append(
            'file',
            this.state.selectedFile
        );
        formData.append('orgId', this.state.orgId);
        formData.append('empCode', this.state.ticketEmp);
        formData.append('ticketId', this.state.selectedTicket);

        axios.post(config.API_URL + "/upload/SalaryCertificate", formData, { headers: headers }).then(res => {
            toast.success(res.data.message);
            this.refreshData();
            setTimeout(function(){
                toast.dismiss()
            },2000)
            this.setState({ show: false });
        });
    }

    render() {
        let tickets = {};
        console.log('Data Count', this.state.dataCount);
        if (this.state.dataCount > 0) {
            tickets = this.state.data;
            console.log('Tickets ITem', tickets)
            for (let key in tickets) {
                if(tickets[key].ticket_status_text !== 'Approved'){
                    tickets[key].action = <a href="javascript:void(0)" onClick={() => this.showUploadPopup(tickets[key].id, tickets[key].empCode)}>Upload</a>;
                }
                else{
                    tickets[key].action = <label>Uploaded</label>;
                }
                
            }
        }
        const Header = ["Employee Id", "Employee Name", "Department", "Location", "Action"];
        return (
            <>
            <div className="pl-4 pr-4 flex-fill d-flex flex-column page-fade-enter-done">
                <Card className="card d-block p-1 mb-4 shadow-sm">
                <ToastContainer className="right" position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnVisibilityChange
                        draggable
                        pauseOnHover />
                    <span className="anchor" id="formComplex"></span>
                    <div className="my-4" />
                    <div div className="d-flex">
                        <div className="col-lg-6">
                            <h3>Salary Certificate Requests</h3>
                        </div>
                        <div className="col-lg-6">
                            <span className="filter-icon pull-right" onClick={this.showFilters}><i><FaFilter /></i></span>
                            {this.state.showFilters ?
                                <Card className="cardFilter">
                                    <p><b>Apply Filters</b></p>
                                    <label>Department</label>
                                    <select name="departmentFilter" onChange={this.changeDepartment} className="form-control custom-select">
                                        <option selected disabled>Select Department</option>
                                        {this.state.departments}
                                    </select>
                                    <label className="mt-10">Location</label>
                                    <select name="locationFilter" onChange={this.changeLocation} className="form-control custom-select">
                                        <option selected disabled>Select Location</option>
                                        {this.state.locations}
                                    </select>

                                    <Button type="submit" className="mt-10" variant="primary" onClick={this.applyfilter}>
                                        Apply Changes
                                    </Button>
                                </Card>
                                : ''}
                        </div>
                    </div>

                    <div className=" mt-4  pr-3">
                        <div className="col-lg-12">
                            {this.state.dataCount > 0 ? (
                                <TablePagination
                                    title=""
                                    subTitle=""
                                    headers={Header}
                                    data={tickets}
                                    columns="empCode.openedByUser.department.location.action"
                                    perPageItemCount={10}
                                    totalCount={this.state.dataCount}
                                    paginationClassName="pagination-status"
                                    className="react-pagination-table"
                                    arrayOption={[["size", 'all', ' ']]}
                                />
                            ) : 'No Data Found'}

                        </div>
                    </div>
                </Card>

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Upload Salary Certificate</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>


                        <ul className="myinfoListing">
                            <li>
                                <label>Upload File </label>
                                <span>
                                    <label for="uploadId" className="squireUpload">

                                        <small>Upload</small>
                                        <input type="file" ref="file" name="logo" id="uploadId" onChange={this.uploadSalarySlip} />
                                    </label>
                                </span>
                            </li>
                        </ul>

                        <Button variant="outline-primary mr-2" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button type="submit" variant="primary" onClick={this.handleClose}>
                            Upload
                        </Button>
                       
                    </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
            </div>
            </>
        );
    }
}

export default Payslips;
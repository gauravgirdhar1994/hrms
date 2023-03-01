import React, { Component } from 'react';
import { Col, Card, Row, Table, Button } from "reactstrap";
import loader from "../../loader.gif";
import axios from "axios";
import Moment from "moment";
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import { IoIosCard, IoIosCloudDownload } from "react-icons/io";
import DataTable from "react-data-table-component";
import DataTableLoader from '../../components/Loaders/DataTableLoader';
import config from '../../config/config';
const BEARER_TOKEN = localStorage.getItem("userData");
const employee = localStorage.getItem('employeeId');
var months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
var year = new Date().getFullYear();
class CreateSalary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attendanceList: [],
            month: Moment().month() - 1,
            salaryMoth:'',
            locationData:{},
            buttonText:'Generate Salary',
            processSalaryButton:true
        }
    }

    componentDidMount() {
        const baseurl = config.API_URL + '/employee/locationDetails';
        var bearer = "Bearer " + BEARER_TOKEN;
        axios
            .get(baseurl, { headers: { Authorization: bearer } })
            .then((r) => {
                if (r.status == 200) {
                    this.setState({ locationData: r.data.locationData, salaryMoth: r.data.locationData.salaryDate });

                }


            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        if(name == 'month'){
            if (parseInt(value) < Moment().month() - 1) {
                this.setState({buttonText:' View Salary',processSalaryButton:false});
            } else if (parseInt(value) > Moment().month())
                this.setState({buttonText:' Can not Generate Salary',processSalaryButton:false});
            else{
                this.setState({buttonText:' Generate Salary',processSalaryButton:true});
            }
        }
        this.setState({ [name]: value });
    }

    genrateAttendanceResult() {
        const generateMonth = this.state.month;
        if (generateMonth < Moment().month()) {
            const apiUrl = config.API_URL + '/payroll/process-monthly-salary?month='+generateMonth;
            var bearer = "Bearer " + BEARER_TOKEN;
            axios
                .get(apiUrl, { headers: { Authorization: bearer } })
                .then((r) => {
                    if (r.status == 200 && r.data.employeeSalaryData) {

                        this.setState({ attendanceList: r.data.employeeSalaryData });
                        if (r.data.employeeSalaryData.length > 0) {
                            this.setState({ salaryMonth: r.data.employeeSalaryData[0].month });
                        }
                    }

                    toast.success(r.data.message);
                    setTimeout(function () {
                        toast.dismiss()
                    }, 3000)

                })
                .catch((error) => {
                    console.log("API ERR: ");
                    console.error(error);
                    // res.json({ error: error });
                });
        } else {
            alert("You can not generate salary for future month");
        }
    }

    processedSalary(){
      if(window.confirm('Click on yes, In case you are sure all the employees attendance is correctly captured')){
          sessionStorage.setItem('salaryProcessMonth', this.state.month);
        window.location.href = '/payroll/salary-list';
      } 
      
    }



    render() {

        if (this.state.salaryMoth != '') {
            return (
                <>

                    <div className="card d-block  shadow-sm text-center pb-50 mb-5">
                        <ToastContainer className="right" position="top-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClic
                            rtl={false}
                            pauseOnVisibilityChange
                            draggable
                            pauseOnHover />
                        <h4>Salary Processing date is {Moment(this.state.salaryMoth, 'YYYY-MM-DD').format('D') + 'th'} of every month</h4>

                        <p>Before Generate salary Please make sure you have uploaded Attendance for this month.</p>
                        <select className="form-control custom-select mb-4 col-md-6" name="month" value={this.state.month} onChange={this.handleChange}>
                            <option value="">Select Month</option>
                            {months.map(function (key, obj) {
                                return (
                                    <option value={obj}>{key + ' ' + year} </option>
                                )
                            })};
                        </select>
                        <div className="onboardingRequest" onClick={() => this.genrateAttendanceResult()}> <span>+</span>{this.state.buttonText}</div>
                    </div>

                    {(this.state.attendanceList.length > 0) ? (
                        <Card className="card d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
                            <Table className="onboardingTable mt-5">
                                <thead>
                                    <tr>
                                        <th>Employee Code</th>
                                        <th>Employee Name</th>
                                        <th>Salary Month</th>
                                        <th>Total Working Days</th>
                                        <th>Total Holidays</th>
                                        <th>Total Present</th>
                                        <th>Total Absent</th>
                                        <th>Total Leave</th>
                                        <th>Status</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.attendanceList.map(obj => {

                                        return (
                                            <tr>
                                                <td>{obj.empCode}</td>
                                                <td>{obj.firstname + ' ' + obj.lastname}</td>
                                                <td>{Moment(obj.salaryMonth).format('MMMM YYYY')}</td>
                                                <td>{obj.totalWorking}</td>
                                                <td>{obj.totalHoliday}</td>
                                                <td>{obj.totalPresent}</td>
                                                <td>{obj.totalLWP}</td>
                                                <td>{obj.totalLeave}</td>
                                                <td>{(obj.status) ? 'Processed' : 'Pending'}</td>
                                            </tr>
                                        )
                                    })}

                                </tbody>
                            </Table>
                            {(this.state.processSalaryButton) ? (
                                <>
                                    <Button className="btn btn-primary mr-2" onClick={() => this.processedSalary()}>Salary Processing</Button>
                                    <span>By clicking on this button its lead to insert LWP for Absent Do you want to processed salary</span></>
                            ) : ''}

                        </Card>) : ''}

                </>



            );
        } else {
            return (
                <center>Please set the salary disbursement date first</center>
            );
        }
    }
}

export default CreateSalary;
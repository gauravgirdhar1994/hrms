import React, { Component } from "react";
// import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { Modal, Button, Form, Card, Table } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import { FaEdit, FaEye, FaCheck, FaExclamationTriangle, FaCheckSquare } from 'react-icons/fa';
import { parseISO } from 'date-fns';
import Loader from 'react-loader-spinner'
import { ExportReactCSV } from './ExportReactCSV'
import ExportMasterData from './ExportMasterData'
// import DataTable from "react-data-table-component";
import { css } from 'emotion';
import DataTable from "react-bs-datatable";
import DataTableLoader from '../components/Loaders/DataTableLoader';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'
import axios from 'axios';
import DatePicker from "react-datepicker";
import config from '../../src/config/config';
import UploadHealthCard from '../components/Documents/UploadHealthCard';
import DownloadHealthCard from "../components/Documents/downloadHealthCard";
import validator from "validator";
var CryptoJS = require("crypto-js");
var role_id = localStorage.getItem("role");


const BEARER_TOKEN = localStorage.getItem("userData");

class Employees extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employees: [],
            employees_all: {},
            employeesCount: "",
            exportData: [],
            show: '',
            data: [],
            form: { "fromExpiry": moment().toDate(), "toExpiry": moment().toDate() },
            addShow: '',
            downloadShow: '',
            csvShow: '',
            employeesArr: [],
            showToast: true,
            showPopUp: false,
            errorFilePath: '',
            brokerOrg: localStorage.getItem('orgId'),
            orgId: localStorage.getItem('orgId'),
            organization_option: <option value=''>Select Organization</option>,
            search: '',
            filetitle: 'employees',
            sampleFilePath: 'uploads/sample/employee-import-sample.csv',
            uploadHealthCard: false,
            downloadHealthCard: false,
            selectedEmp: '',
            positions: [],
            locations: [],
            importData: [],
            locations1: [],
            managers: [],
            hrManager: [],
            empType: [],
            basicFields: [],
            departments: [],
            genderArr: { 'M': 'Male', 'F': 'Female' },
            dropdowns: { 'deptId': 'departmentIds', 'grade': 'gradeIds', 'positionId': 'positionIds', 'workLocation': 'locationIds', 'accessRole': 'roleIds', 'issuing_emirate': 'emirateIds', 'maritalStatus': 'mStatusIds', 'bloodGroup': 'bloodGroupIds', 'visaType': 'visaTypeIds', 'supervisorId': 'managerIds', 'country': 'countryIds', 'nationality': 'nationalityIds', 'empType': 'empTypeIds', 'issuing_country': 'countryIds', 'gender': 'genderIds' },
            status: config.STATUS,
            gender_option: [],
            status_option: [],
            arrEmpType: [],
            filterQuery: { "deptId": "", "positionId": "", "workLocation": "", "status": "", "gender": "", "employmentType": "", "expiryDocument": "" },
            filterString: '',
            fileName: 'employees',
            employmentType: [],
            deptId: [],
            positionId: [],
            workLocation: [],
            country: [],
            nationality: [],
            supervisorId: [],
            gender: [],
            accessRole: [],
            importError: '',
            errorCount: '',
            importErrorCount: '',
            empCount: '',
            visaTypeArr: ['Tourist/Visit Visa', 'E-Visa for GCC Residents', 'Student Visa', 'Employment Visa'],
            visa_type: [],
            visaIssuingCountry: [],
            passportIssuingCountry: [],
            issuing_emirate: [],
            showcountError: false,
            submitwithErrors: false,
            validateFields: [],
            emirateArr: ['Abu Dhabi', 'Ajman', 'Dubai', 'Fujairah', 'Ras Al Khaimah', 'Sharjah', 'Umm Al Quwain'],
            blood_group: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            bloodGroup: [],
            marital_status: ['Married', 'Single', 'Divorced', 'Separated'],
            maritalStatus: [],
            gradesList: [],
            grade: [],
            partialErrorCount: '',
            showLoader: false,
            currentRows: 0,
            departmentIds: [],
            gradeIds: [],
            positionIds: [],
            locationIds: [],
            roleIds: [],
            emirateIds: ['Abu Dhabi', 'Ajman', 'Dubai', 'Fujairah', 'Ras Al Khaimah', 'Sharjah', 'Umm Al Quwain'],
            mStatusIds: ['Married', 'Single', 'Divorced', 'Separated'],
            bloodGroupIds: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            visaTypeIds: ['Tourist/Visit Visa', 'E-Visa for GCC Residents', 'Student Visa', 'Employment Visa'],
            managerIds: [],
            countryIds: [],
            nationalityIds: [],
            empTypeIds: [],
            genderIds: ['M', 'F'],
            role: localStorage.getItem("roleSlug"),
        };
        this.handleClose = this.handleClose.bind(this);
        this.handleDownloadClose = this.handleDownloadClose.bind(this);
        this.getOrganizationList = this.getOrganizationList.bind(this);
        this.getEmployees = this.getEmployees.bind(this);
        this.searchEmployee = this.searchEmployee.bind(this);
        this.changeSearch = this.changeSearch.bind(this);
        this.refreshData = this.refreshData.bind(this);
        this.dateChange = this.dateChange.bind(this);
        this.checkSelectValue = this.checkSelectValue.bind(this);
        this.applyExpiryDocumentFilter = this.applyExpiryDocumentFilter.bind(this);
    }

    handlePreviewChange = (e, index, key, inputField) => {
        console.log('Import Data change', this.state.importData, index, key, inputField, e);
        const { importData, validateFields } = this.state;
        const updatedHeaders = importData;
        updatedHeaders[index][key]['importValue'] = e.target.value;
        validateFields[index][e.target.name] = "";

        console.log('Updated Headers', updatedHeaders);
        this.setState({
            importData: updatedHeaders,
            validateFields: validateFields
        })
    }

    handlePhoneChange = (value, country, e, formattedValue, name, index, key) => {

        let phonevalue = formattedValue;
        const { importData } = this.state;
        const updatedHeaders = importData;
        updatedHeaders[index][key]['importValue'] = formattedValue;
        console.log('Updated Headers', updatedHeaders);
        this.setState({
            importData: updatedHeaders
        })
    }

    datePreviewChange = (name, index, key, inputField, date) => {
        console.log('Date change', name, date, index, key, inputField);
        const { importData } = this.state;
        const updatedHeaders = importData;
        updatedHeaders[index][key]['importValue'] = (date) ? date : '';
        console.log('Updated Headers', updatedHeaders);
        this.setState({
            importData: updatedHeaders
        })
    }

    hideCountError = () => {
        this.setState({
            showcountError: false
        })
    }

    hideLoader = () => {
        this.setState({
            showLoader: false
        })
    }

    submitwithoutErrors = () => {
        this.setState({
            submitwithErrors: true,
            showcountError: false
        }, () => {
            this.submitImportData();
        })
    }

    submitImportData = () => {
        let datas = this.state.importData;
        // datas.orgId = this.state.orgId;
        var bearer = 'Bearer ' + BEARER_TOKEN;
        this.setState({
            showLoader: true,
            processData: true
        });
        const headers = {
            "Authorization": bearer
        };

        var inputFields = [];
        let currentRows = 1;
        if (this.state.importData) {
            var dataCount = Object.keys(this.state.importData).length;
            inputFields = Object.values(this.state.importData);
            let validateFields = {};
            let importErrorCount = 0;
            let partialErrorCount = 0;
            // console.log('Data Count', inputFields);
            inputFields.map((field, index) => {
                validateFields[index] = [];
                var currentField = Object.values(field);
                //   console.log('Current Field', importErrorCount);      
                this.setState({
                    currentRows: currentRows
                }, () => {
                    currentField.map((inputField, key) => {
                        // if(inputField.fieldName === 'sponsor'){
                        console.log('Upload Input field Sponsor', inputField);
                        // }
                        if ((!inputField.importValue || inputField.importValue === undefined) && inputField.fieldName !== undefined) {
                            console.log('empty value', inputField.fieldName);
                            importErrorCount = importErrorCount + 1;
                            console.log('InputField', importErrorCount);
                            if (!inputField.is_mandatory && inputField.importRequired) {
                                console.log('InputField', importErrorCount);
                                importErrorCount = importErrorCount - 1;
                                partialErrorCount = importErrorCount + 1;
                            }

                            validateFields[index][inputField.fieldName] = inputField.fieldTitle;
                        }
                        else {
                            validateFields[index][inputField.fieldName] = '';
                        }
                        // console.log('Check select value', this.checkSelectValue(inputField), inputField.fieldName);                      
                        if (!this.checkSelectValue(inputField) && this.checkSelectValue(inputField) !== undefined) {
                            console.log('errorcount check value');
                            importErrorCount = importErrorCount + 1;
                        }
                    })
                    if (index == dataCount - 1) {
                        console.log('Set errorcount', index, importErrorCount, partialErrorCount);
                        this.setState({
                            importErrorCount: importErrorCount,
                            partialErrorCount: partialErrorCount,
                            validateFields: validateFields
                        }, () => {
                            console.log('ValidateFields', this.state.partialErrorCount, this.state.importErrorCount, this.state.submitwithErrors);

                            if (!this.state.submitwithErrors) {
                                console.log('Partial Count', this.state.partialErrorCount);
                                if (this.state.partialErrorCount > 0 && this.state.importErrorCount == 0) {
                                    console.log('shoe count error');
                                    this.setState({
                                        showcountError: true
                                    })
                                    return false;
                                }
                            }
                            console.log('Final Error count', this.state.importErrorCount);
                            if (this.state.importErrorCount == 0) {
                                axios.post(config.API_URL + "/employee/submitImportData", datas, { headers: headers }).then(res => {
                                    console.log('POST response', res);
                                    if (res.data.success) {
                                        this.refreshData();
                                        toast.success(res.data.message);
                                        setTimeout(function () {
                                            toast.dismiss()
                                        }, 2000)
                                        this.setState({
                                            csvShow: false, importData: [], importError: true, errorCount: res.data.errorCtr, empCount: res.data.empCount, showLoader: false,
                                            processData: false
                                        })
                                    }
                                    else {
                                        this.refreshData();
                                        toast.error(res.data.message);
                                        setTimeout(function () {
                                            toast.dismiss()
                                        }, 2000)
                                        this.setState({
                                            errorFilePath: res.data.filePath, importError: true, importData: [], errorCount: res.data.errorCtr, empCount: res.data.empCount, showLoader: false,
                                            processData: false
                                        })
                                    }

                                });

                            }
                            else {
                                this.setState({
                                    showLoader: false
                                })
                            }
                        })
                        currentRows++;
                    }
                })

            })

            // // Request made to the backend api 
            // // Send formData object 

        }
    }

    handleShow = () => {

        this.setState({ show: true })
    };

    handleErrorClose = () => {

        this.setState({ importError: false })
    };

    handleAddShow = () => {

        this.setState({ addShow: true })
    };

    handleCSVShow = () => {
        this.setState({ csvShow: true, errorFilePath: '' })
    };

    cancelImport = () => {
        this.setState({ csvShow: false, errorFilePath: '', importData: [] })
    }

    handleClose = () => {

        this.setState({ show: false, uploadHealthCard: false })
    };

    handleDownloadClose = () => {

        this.setState({ downloadShow: false, downloadHealthCard: false })
    };

    handleAddClose = () => {

        this.setState({ addShow: false })
    };

    handleCSVClose = () => {

        this.setState({ csvShow: false })
    };

    handleChange = (event) => {
        // console.log('Input event',this.props.item);   
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            data: {
                ...this.state.data, [name]: value
            }
        })
    }

    componentDidMount() {
        if (role_id == 1) {
            this.getOrganizationList();
        }
        this.refreshData();
        this.getPositions();
        this.getLocations();
        this.getEmpType();
        this.getDepartments();
        this.getGender();
        this.getStatus();
        this.getCountries();
        this.getManagers();
        this.getGrades();
        this.getAccessRoles();
    }

    setexportData = () => {
        console.log('Set Export Data', this.state.employeesCount);

    }

    dateChange = (name, date) => {
        // console.log('BirthDate', name,date,Moment(date).format('MM/DD/YYYY'))
        this.setState({
            form: {
                ...this.state.form, [name]: (date) ? date : ''
            }
        })
        // this.state.form[name] = (date)?date:'';
    }

    refreshData = () => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        // console.log('URl Params', this.props.match.params);
        var visa = this.props.match.params.visa;
        var insurance = this.props.match.params.insurance;
        var apiUrl = config.API_URL + '/employees/list?orgId=' + this.state.orgId + this.state.filterString;

        if (visa) {

            apiUrl = config.API_URL + '/employees/list?orgId=' + this.state.orgId + '&visa=true&month=' + visa;
        }

        if (insurance) {
            apiUrl = config.API_URL + '/employees/list?orgId=' + this.state.orgId + '&insurance=true&month=' + insurance;
        }


        axios.get(apiUrl, { headers: { Authorization: bearer } })
            .then(r => {
                // console.log('Post Response', r.data.employees.rows);
                if (r.data.employees.count > 0) {
                    this.setState({
                        employees: r.data.employees.rows,
                        employeesCount: r.data.employees.count,
                        employees_all: r.data.employees.rows
                    }, () => {
                        if (this.state.employeesCount > 0) {
                            let employeesArr = [];
                            this.state.employees.map((data, key) => {
                                if (data && data.empDetails) {
                                    employeesArr[key] = [];

                                    this.state.exportData[key] = {};
                                    this.state.exportData[key]['Employee Name'] = data.empDetails.personal.name;
                                    this.state.exportData[key]['Employee Code'] = data.empDetails.personal.empCode;
                                    this.state.exportData[key]['Official Email'] = data.empDetails.personal.email;
                                    this.state.exportData[key]['Phone Number'] = data.empDetails.personal.phoneNumber;
                                    this.state.exportData[key]['Employment Type'] = data.empDetails.personal.employmentType;
                                    if (data !== null) {
                                        if (data.empDetails.personal.emp_insurance == null || data.empDetails.personal.emp_insurance == "") {
                                            data.empDetails.personal.employee_insurance = 'No'

                                        }
                                        else {
                                            data.empDetails.personal.employee_insurance = 'Yes'
                                        }
                                        if (data.empDetails.personal.status == 1) {
                                            data.empDetails.personal.empStatus = 'Active'
                                        }
                                        else {
                                            data.empDetails.personal.empStatus = 'Inactive'
                                        }

                                        if (data.empDetails.visa === null) {
                                            data.empDetails.visa = {};
                                            data.empDetails.visa.visaExpiryDate = '';
                                        }

                                        // console.log('Insurance Details',key, data.empDetails.personal.emp_insurance);
                                        if (data.empDetails.personal.emp_insurance !== null && data.empDetails.personal.emp_insurance.org_insurance && data.empDetails.personal.emp_insurance.org_insurance.insuranceName) {
                                            data.empDetails.personal.insuranceName = data.empDetails.personal.emp_insurance.org_insurance.insuranceName;
                                        }
                                        else {
                                            data.empDetails.personal.insuranceName = '';
                                        }

                                        if (data.empDetails.personal.emp_insurance !== null && data.empDetails.personal.emp_insurance.org_insurance && data.empDetails.personal.emp_insurance.org_insurance.insuranceName) {
                                            data.empDetails.personal.insuranceName = data.empDetails.personal.emp_insurance.org_insurance.insuranceName;
                                        }
                                        else {
                                            data.empDetails.personal.insuranceName = '';
                                        }

                                        if ((this.state.brokerOrg > 0)) {
                                            if (data.empDetails.personal.emp_insurance !== null && data.empDetails.personal.emp_insurance.endDate) {
                                                //     console.log('Insurance Expiry', data.empDetails.personal.emp_insurance.endDate);
                                                data.empDetails.personal.emp_insurance_endDate = moment(data.empDetails.personal.emp_insurance.endDate).format(config.DATE_FORMAT)
                                                //     console.log('Insurance Expiry', data.empDetails.personal.emp_insurance_endDate);
                                            }
                                            else {
                                                data.empDetails.personal.emp_insurance_endDate = '';
                                            }

                                            if (data.empDetails.visa !== null && data.empDetails.visa.visaExpiryDate) {

                                                data.empDetails.personal.visaExpiryDateNew = moment(data.empDetails.visa.visaExpiryDate).format(config.DATE_FORMAT);
                                                //     console.log('Visa Expiry Date', data.empDetails.personal.visaExpiryDate);
                                            }

                                            else {
                                                data.empDetails.visa = {};
                                                data.empDetails.personal.visaExpiryDate = '';
                                            }
                                            if (data.empDetails.passport !== null && data.empDetails.passport.passportExpiryDate) {
                                                // console.log('Visa Expiry Date', data.empDetails.visa.visaExpiryDate);
                                                data.empDetails.passport.passportExpiryDate = moment(data.empDetails.passport.passportExpiryDate).format(config.DATE_FORMAT);
                                            }
                                            else {
                                                data.empDetails.passport = {};
                                                data.empDetails.passport.passportExpiryDate = '';
                                            }
                                            // console.log('Emirate Details', data.empDetails.emirate);
                                            if (data.empDetails.emirate !== null && data.empDetails.emirate.emirateExpiryDate) {
                                                //     console.log('Emirate Details Expiry Date', data.empDetails.emirate.emirateExpiryDate);
                                                data.empDetails.emirate.emirateExpiryDate = moment(data.empDetails.emirate.emirateExpiryDate).format(config.DATE_FORMAT);
                                            }
                                            else {
                                                // console.log('Empty Emirate Details');
                                                data.empDetails.emirate = {};
                                                data.empDetails.emirate.emirateExpiryDate = '';
                                            }


                                            if (data.empDetails.personal.emp_insurance !== null && data.empDetails.personal.emp_insurance !== "") {
                                                if (data.healthCard == true) {
                                                    // console.log('HealthCard', data.id, data.healthCard);
                                                    data.empDetails.personal.healthCard = <button className="btn btn-sm btn-outline-primary" onClick={() => this.downloadHealthCard(data.empDetails.personal.id)}>Download</button>
                                                }
                                                else {

                                                    data.empDetails.personal.healthCard = <button className="btn btn-sm btn-outline-primary" onClick={() => this.uploadHealthCard(data.empDetails.personal.id)}>Upload</button>
                                                }

                                            }
                                            else {
                                                data.empDetails.personal.healthCard = '';
                                            }


                                            if (data.empDetails.personal.id) {
                                                data.empDetails.personal.action = <a className="btn btn-sm btn-outline-primary" href={'/my-info/edit/' + this.enc(data.empDetails.personal.id.toString())}>Edit</a>;
                                            }
                                            else {
                                                data.empDetails.personal.action = '';
                                            }

                                            if (data.empDetails.personal.phoneNumber == 0) {
                                                data.empDetails.personal.phoneNumber = '';
                                            }
                                        }
                                        this.state.exportData[key]['Status'] = data.empDetails.personal ? data.empDetails.personal.status : '';
                                        this.state.exportData[key]['Insurance'] = data.empDetails.personal ? data.empDetails.personal.emp_insurance : '';
                                        this.state.exportData[key]['Insurance Plan'] = data.empDetails.personal ? data.empDetails.personal.insuranceName : '';
                                        this.state.exportData[key]['Insurance Expiry'] = data.empDetails.personal ? data.empDetails.personal.emp_insurance_endDate : '';
                                        this.state.exportData[key]['Visa Expiry'] = data.empDetails.visa ? data.empDetails.visa.visaExpiryDate : '';
                                        this.state.exportData[key]['Passport Expiry'] = data.empDetails.passport ? data.empDetails.passport.passportExpiryDate : '';
                                        this.state.exportData[key]['Emirate Expiry'] = data.empDetails.emirate ? data.empDetails.emirate.emirateExpiryDate : '';
                                        this.state.exportData[key]['Passport Documents'] = data.passportDocs ? data.passportDocs.join(",") : '';
                                        this.state.exportData[key]['Visa Documents'] = data.visaDocs ? data.visaDocs.join(",") : '';
                                        this.state.exportData[key]['Emirate Documents'] = data.emirateDocs ? data.emirateDocs.join(",") : '';
                                        if (data.empDetails.personal) {
                                            for (var index in data.empDetails.personal) {
                                                employeesArr[key][index] = data.empDetails.personal[index];
                                                if (key === this.state.employeesCount - 1) {
                                                    this.setState({
                                                        employeesArr: employeesArr
                                                    })
                                                }
                                            }
                                        }
                                        if (data.empDetails.visa) {
                                            // console.log('Visa Details', data.empDetails.visa);
                                            for (var index in data.empDetails.visa) {
                                                //     console.log('Visa Details', index);
                                                employeesArr[key][index] = data.empDetails.visa[index];
                                                if (key === this.state.employeesCount - 1) {
                                                    this.setState({
                                                        employeesArr: employeesArr
                                                    })
                                                }
                                            }
                                        }
                                    }
                                }

                            })
                        }
                    })
                }

                this.getPositions();
                this.getLocations();
                this.getEmpType();
                this.getDepartments();
                this.getGender();
                this.getStatus();

            })
            .catch((error) => {
                //console.log("API ERR:", error);
                // console.error(error);
                // res.json({ error: error });
            })
    }

    getAccessRoles() {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/common/accessRoles/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                //     console.log('Positions Response', r);
                if (r.status == 200) {
                    let accessRoles = r.data.accessRoles.map((item, key) =>
                        <option key={item.id} value={item.id} selected={this.state.currRole == item.id ? 'selected' : ''}>{item.roleName}</option>
                    );
                    this.setState({ accessRole: accessRoles, roleIds: r.data.idsArr });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }

    getManagers() {
        axios.get(config.API_URL + '/common/employees/' + this.state.orgId, { headers: { Authorization: 'bearer ' + BEARER_TOKEN } })
            .then(r => {
                if (r.status == 200) {
                    var arrTen = [];
                    for (var k = 0; k < r.data.Employees.length; k++) {
                        arrTen.push(<option key={r.data.Employees[k].id} value={r.data.Employees[k].id}> {r.data.Employees[k].firstname} {r.data.Employees[k].lastname} {r.data.Employees[k].position ? "(" + r.data.Employees[k].position + ")" : ''}</option>);
                    }
                    //console.log('EmpType',arrTen);
                    this.setState({ supervisorId: arrTen, managerIds: r.data.idsArr });
                }
            }).catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }

    getCountries() {
        axios.get(config.API_URL + '/common/countries', { headers: { Authorization: 'bearer ' + BEARER_TOKEN } })
            .then(r => {

                if (r.status == 200) {
                    var arrCountry = [];
                    var arrNationality = [];
                    var arrCountry1 = [];

                    for (var k = 0; k < r.data.Countries.length; k++) {
                        arrCountry.push(<option key={r.data.Countries[k].id} value={r.data.Countries[k].id}> {r.data.Countries[k].country} </option>);
                        arrNationality.push(<option key={r.data.Countries[k].id} value={r.data.Countries[k].id}> {r.data.Countries[k].nationality} </option>);
                        arrCountry1[r.data.Countries[k].id] = r.data.Countries[k].country;
                    }
                    this.setState({ country: arrCountry, visaIssuingCountry: arrCountry, passportIssuingCountry: arrCountry, nationality: arrNationality, countryIds: r.data.idsArr, nationalityIds: r.data.idsArr });
                }
            }).catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }

    getPositions() {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/common/positions/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                //console.log('Positions Response', r);
                if (r.status == 200) {
                    var arrTen = [];
                    for (var k = 0; k < r.data.Positions.length; k++) {
                        arrTen.push(<option key={r.data.Positions[k].id} value={r.data.Positions[k].id}> {r.data.Positions[k].positionName} </option>);
                    }
                    this.setState({ positions: arrTen, positionId: arrTen, positionIds: r.data.idsArr });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }
    getLocations() {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/common/locations/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                //console.log('Location Response', r);
                if (r.status == 200) {
                    var arrTen = [];
                    var locations1 = [];
                    for (var k = 0; k < r.data.Locations.length; k++) {
                        arrTen.push(<option key={r.data.Locations[k].locationId} value={r.data.Locations[k].locationId}> {r.data.Locations[k].locationName} </option>);
                        locations1[r.data.Locations[k].locationName] = r.data.Locations[k].locationId;
                    }
                    this.setState({ locations: arrTen, locations1: locations1, workLocation: arrTen, locationIds: r.data.idsArr });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }

    getEmpType() {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/common/employmentType/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                //console.log('EmpType Response', r);
                if (r.status == 200) {
                    var arrTen = [];
                    var arrEmpType = [];
                    for (var k = 0; k < r.data.EmploymentType.length; k++) {
                        arrTen.push(<option key={r.data.EmploymentType[k].id} value={r.data.EmploymentType[k].id}> {r.data.EmploymentType[k].empType} </option>);
                        arrEmpType[r.data.EmploymentType[k].empType] = r.data.EmploymentType[k].id;
                    }
                    //console.log('EmpType',arrTen);
                    this.setState({ empType: arrTen, employmentType: arrTen, arrEmpType: arrEmpType, empTypeIds: r.data.idsArr });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }

    getGrades() {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/common/grades/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                //console.log('EmpType Response', r);
                if (r.status == 200) {
                    var arrTen = [];
                    var arrGrades = [];
                    for (var k = 0; k < r.data.Grades.length; k++) {
                        arrGrades.push(<option key={r.data.Grades[k].id} value={r.data.Grades[k].grade}> {r.data.Grades[k].displayName} </option>);
                        arrGrades[r.data.Grades[k].grade] = r.data.Grades[k].id;
                    }
                    //console.log('EmpType',arrTen);
                    this.setState({ grade: arrGrades, gradeIds: r.data.idsArr });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }

    getDepartments() {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/common/departments/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                // console.log('department Response', r);
                if (r.status == 200) {
                    var arrTen = [];
                    for (var k = 0; k < r.data.Departments.length; k++) {
                        arrTen.push(<option key={r.data.Departments[k].id} value={r.data.Departments[k].id}> {r.data.Departments[k].displayName} </option>);
                    }
                    this.setState({ departments: arrTen, deptId: arrTen, departmentIds: r.data.idsArr });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }

    getGender() {
        var arrTen = [];
        var arrVisa = [];
        var arrVisaEmirates = [];
        var arrBloodGroup = [];
        var arrMaritalStatus = [];

        Object.keys(this.state.genderArr).map((obj_index, arr_index) => {
            //console.log('gender',obj_index,arr_index)
            arrTen.push(<option key={arr_index} value={obj_index}> {this.state.genderArr[obj_index]} </option>);
        })

        Object.keys(this.state.visaTypeArr).map((visa_index, visa_arr_index) => {
            // console.log('visa type', visa_index, visa_index);
            arrVisa.push(<option key={visa_arr_index} value={this.state.visaTypeArr[visa_index]}>{this.state.visaTypeArr[visa_index]}</option>)
        })

        Object.keys(this.state.emirateArr).map((visa_index, visa_arr_index) => {
            console.log('emirates array', visa_index, visa_arr_index);
            arrVisaEmirates.push(<option key={visa_arr_index} value={this.state.emirateArr[visa_index]}>{this.state.emirateArr[visa_index]}</option>)
        })

        Object.keys(this.state.blood_group).map((index, arr_index) => {
            // console.log('visa type', visa_index, visa_index);
            arrBloodGroup.push(<option key={arr_index} value={this.state.blood_group[index]}>{this.state.blood_group[index]}</option>)
        })
        Object.keys(this.state.marital_status).map((index, arr_index) => {
            // console.log('visa type', visa_index, visa_index);
            arrMaritalStatus.push(<option key={arr_index} value={this.state.marital_status[index]}>{this.state.marital_status[index]}</option>)
        })
        //console.log('gender',arrTen);
        this.setState({ gender_option: arrTen, gender: arrTen, visa_type: arrVisa, issuing_emirate: arrVisaEmirates, bloodGroup: arrBloodGroup, maritalStatus: arrMaritalStatus });
    }
    getStatus() {
        var arrTen = [];

        Object.keys(this.state.status).map((obj_index, arr_index) => {
            //console.log('gender',obj_index,arr_index)
            arrTen.push(<option key={arr_index} value={obj_index}> {this.state.status[obj_index]} </option>);
        })
        //console.log('gender',arrTen);
        this.setState({ status_option: arrTen });
    }

    showEditPopup = (id, value) => {
        localStorage.setItem('editEmployee', id);
        var bearer = 'Bearer ' + BEARER_TOKEN;
    }

    handleAddChange = (event) => {

        const name = event.target.name;
        const value = event.target.value;
        // console.log('Input event',name, value);  
        // console.log('Input event',this.state.form);  
        this.setState({
            form: {
                ...this.state.form, [name]: value
            }
        })

    }

    handleSubmit = (event) => {
        console.log('Form Data', this.state.data);
        let datas = this.state.data;
        console.log('Form Data', datas);
        const apiUrl = config.API_URL + '/employee/edit/' + this.state.employeeId;
        var bearer = 'Bearer ' + BEARER_TOKEN;
        const headers = {
            "Authorization": bearer,
        }
        const formData = new FormData();

        // Update the formData object 
        formData.append(
            'file',
            this.state.selectedFile
        );

        for (var key in datas) {
            formData.append(key, datas[key]);
        }

        // console.log('headers => ', headers);
        axios.post(apiUrl, formData, { headers: headers })
            .then(res => {
                this.refreshData();
                console.log('POST response', res);
            })

        const toasts = "Updated Successfully"
        toast.success('Updated Successfully');
        setTimeout(function () {
            toast.dismiss()
        }, 2000)
        this.setState({ show: false })
    }

    showToastMessage(toastMessage) {
        toast(toastMessage, { autoClose: 3000 })
    }

    handleAddSubmit = (event) => {
        console.log('Form Data', this.state.form);
        let datas = this.state.form;
        console.log('Form Data', datas);
        const apiUrl = config.API_URL + '/organization/add';
        var bearer = 'Bearer ' + BEARER_TOKEN;
        const headers = {
            "Authorization": bearer,
        }

        const formData = new FormData();

        // Update the formData object 
        formData.append(
            'file',
            this.state.selectedFile
        );

        for (var key in datas) {
            formData.append(key, datas[key]);
        }

        // console.log('headers => ', headers);
        axios.post(apiUrl, formData, { headers: headers })
            .then(res => {
                console.log('POST response', res);
                if (res.data.success === true) {
                    // const toasts = "Updated Successfully"
                    toast.success(res.data.message);
                    setTimeout(function () {
                        toast.dismiss()
                    }, 2000)
                    this.refreshData();
                    this.setState({ show: false })
                    setTimeout(function () {
                        toast.dismiss()
                    }, 2000)
                }
                else {
                    toast.error(res.data.message);
                }
            })
            .catch(error => {
                console.log('Error API', error);
            })
    }

    uploadCSV = (event) => {
        var bearer = 'Bearer ' + BEARER_TOKEN;

        const headers = {
            "Authorization": bearer
        };

        this.state.selectedFile = event.target.files[0];
        this.setState({
            showLoader: true
        });
        // Details of the uploaded file 
        console.log('Selected file', this.state.selectedFile);

        const formData = new FormData();

        // Update the formData object 
        formData.append(
            'file',
            this.state.selectedFile
        );

        formData.append('orgId', this.state.orgId);
        // Request made to the backend api 
        // Send formData object 
        axios.post(config.API_URL + "/employee/bulkImport", formData, { headers: headers }).then(res => {
            // console.log('POST response', res);
            if (res.data.success) {
                this.refreshData();
                toast.success(res.data.message);
                setTimeout(function () {
                    toast.dismiss()
                }, 2000);
                try {
                    this.setState({ csvShow: false, importData: res.data.importData }, () => {
                        console.log('aaaaaaaaaaaaaaaa');
                        var inputFields = [];
                        let currentRows = 1;
                        if (this.state.importData) {
                            var dataCount = Object.keys(this.state.importData).length;
                            inputFields = Object.values(this.state.importData);
                            let validateFields = {};
                            let importErrorCount = 0;
                            let partialErrorCount = 0;
                            // console.log('Data Count', inputFields);
                            inputFields.map((field, index) => {
                                var currentField = Object.values(field);
                                console.log('daaattaaa' + currentField);
                                validateFields[index] = [];
                                this.setState({
                                    currentRows: currentRows
                                }, () => {
                                    currentField.map((inputField, key) => {
                                        if (inputField.fieldName === 'sponsor') {
                                            console.log('Upload Input field Sponsor', inputField);
                                        }
                                        if ((!inputField.importValue || inputField.importValue === undefined) && inputField.fieldName !== undefined) {
                                            // console.log('Set errorcount', index, importErrorCount);
                                            console.log('empty value', inputField.fieldName, index);
                                            importErrorCount = importErrorCount + 1;
                                            // console.log('InputField', importErrorCount);
                                            if (!inputField.is_mandatory && inputField.importRequired) {
                                                console.log('InputField', importErrorCount);
                                                importErrorCount = importErrorCount - 1;
                                                partialErrorCount = importErrorCount + 1;
                                            }

                                            console.log('aaaaaaaaaaaaaaaa');
                                            validateFields[index][inputField.fieldName] = inputField.fieldTitle;
                                            console.log('empty value Validate fields', validateFields[index][inputField.fieldName]);
                                        }
                                        else {
                                            validateFields[index][inputField.fieldName] = '';

                                            if (inputField.fieldName === 'basic' || inputField.fieldName === 'accommodation' || inputField.fieldName === 'transportation' || inputField.fieldName === 'telephone' || inputField.fieldName === 'other') {
                                                if (validator.isInt(inputField.importValue)) {
                                                    validateFields[index][inputField.fieldName] = '';
                                                } else {
                                                    validateFields[index][inputField.fieldName] = inputField.fieldTitle;
                                                }
                                            }
                                            if (inputField.fieldName === 'email' || inputField.fieldName === 'personalEmail') {
                                                if (validator.isEmail(inputField.importValue)) {
                                                    validateFields[index][inputField.fieldName] = '';
                                                } else {
                                                    validateFields[index][inputField.fieldName] = inputField.fieldTitle;
                                                }
                                            }
                                        }


                                        // console.log('Check select value', this.checkSelectValue(inputField), inputField.fieldName);                      
                                        if (!this.checkSelectValue(inputField) && this.checkSelectValue(inputField) !== undefined) {
                                            console.log('errorcount check value');
                                            importErrorCount = importErrorCount + 1;
                                        }
                                    })
                                    if (index == dataCount - 1) {

                                        this.setState({
                                            importErrorCount: importErrorCount,
                                            partialErrorCount: partialErrorCount,
                                            validateFields: validateFields,
                                            showLoader: false
                                        }, () => {
                                            console.log('ValidateFields', this.state.validateFields);
                                        })
                                    }
                                })
                                currentRows++;
                                console.log('Current Rows', currentRows);

                            })

                        }
                    })
                } catch (error) {
                    this.refreshData();
                    toast.error(error);
                    setTimeout(function () {
                        toast.dismiss()
                    }, 2000);
                    this.setState({ errorFilePath: res.data.filePath });
                }
            }
            else {
                this.refreshData();
                toast.error(res.data.message);
                setTimeout(function () {
                    toast.dismiss()
                }, 2000)
                this.setState({ errorFilePath: res.data.filePath })
            }

        });

    }
    hidePopup = () => {
        this.setState({ csvShow: false })
    }
    getOrganizationList() {

        axios.get(config.API_URL + '/organizations/list')
            .then(res => {
                //console.log(res.data.employees.rows);
                if (res.data.organizations.rows.length > 0) {
                    let organization_option = res.data.organizations.rows.map((obj, index) => {
                        return <option value={obj.id} key={index}>{obj.orgName}</option>
                    })
                    var blankOption = <option value=''>Select Organization</option>
                    organization_option.unshift(blankOption);
                    this.setState({ organization_option: organization_option })
                }
            })
    }
    getEmployees(e) {
        this.setState({ 'orgId': e.target.value }, function () {
            this.refreshData();
        });

    }
    enc(plainText) {
        var b64 = CryptoJS.AES.encrypt(plainText, config.secret_key).toString();
        var e64 = CryptoJS.enc.Base64.parse(b64);
        var eHex = e64.toString(CryptoJS.enc.Hex);
        return eHex;
    }
    searchEmployee(text) {
        //console.log(text)
        // var advanceLoanArr = this.state.advanceLoanArr;
        if (text && text.length > 2 && this.state.employees_all.length > 0) {
            //var search = this.state.advanceLoanArr.filter(x => x.name.toLowerCase().includes(text.toLowerCase()))
            //this.setState({advanceLoanArr:search});
            text = text.toLowerCase()
            var result = this.state.employees_all.filter(function (v, i) {
                //console.log(v['empDetails']['personal']);
                var item1 = v['empDetails']['personal']['firstname'] ? v['empDetails']['personal']['firstname'].toLowerCase().includes(text) : '';
                var item2 = v['empDetails']['personal']['lastname'] ? v['empDetails']['personal']['lastname'].toLowerCase().includes(text) : '';
                var item3 = v['empDetails']['personal']['empCode'] ? v['empDetails']['personal']['empCode'].toLowerCase().includes(text) : ''
                var item4 = v['empDetails']['personal']['email'] ? v['empDetails']['personal']['email'].toLowerCase().includes(text) : '';
                var item5 = v['empDetails']['personal']['employmentType'] ? v['empDetails']['personal']['employmentType'].toLowerCase().includes(text) : '';
                var item6 = v['empDetails']['personal']['status'] ? config.STATUS[v['empDetails']['personal']['status']].toLowerCase().includes(text) : '';
                var item7 = v['empDetails']['personal']['phoneNumber'].includes(text) ? v['empDetails']['personal']['phoneNumber'].includes(text) : '';
                return (item1 || item2 || item3 || item4 || item7 || item5 || item6);
            })
            //console.log('result',result);
            this.setState({ employees: result });
        }
        else {
            //this.state.employees = this.props.employees;
            this.setState({ employees: this.state.employees_all });
        }
        //this.getItems();
    }
    changeSearch(e) {
        this.setState({ search: e.target.value });
        this.searchEmployee(e.target.value)
    }

    uploadHealthCard = (id) => {
        console.log('Upload Health Card');
        this.setState({
            uploadHealthCard: true,
            selectedEmp: id,
            show: true
        })
    }

    downloadHealthCard = (id) => {
        console.log('Download Health Card');
        this.setState({
            downloadHealthCard: true,
            selectedEmp: id,
            downloadShow: true
        })
    }

    replacefilter(filter) {
        this.setState({
            filterQuery: {
                ...this.state.filterQuery, [filter.target.name]: ''
            },
        }, (filter) => {
            this.applyFilterInTopBar(filter)
        })
    }

    clearOrderByFilters(e) {

        console.log('clearQuery', this.state.filterQuery);
        let i = 0;
        let filterQuery = {};
        for (var key in this.state.filterQuery) {

            filterQuery[key] = "";
            this.setState({
                filterQuery,
                employeesCount: "",
                employees: ""
            })
            console.log('Key I Value', key, i);
            if (i == 6) {

                this.setState({
                    filterString: '',
                    form: {
                        ...this.state.form, ["toExpiry"]: moment().toDate(),
                        ...this.state.form, ["fromExpiry"]: moment().toDate(),
                    },
                }, () => {
                    console.log('clearQuery', this.state.filterQuery);
                    this.refreshData();
                })
                if (role_id == 1) {
                    this.setState({
                        orgId: 0
                    })
                }
            }
            i++;
        }
    }

    applyFilterInTopBar(e) {
        if (e.target.name !== 'expirydocument' && e.target.name !== 'orgId') {
            this.setState({
                filterQuery: {
                    ...this.state.filterQuery, [e.target.name]: e.target.value
                },
                exportData: [],
                employeesCount: ""
            }, () => {
                console.log('filterQuery', this.state.filterQuery);
                let filterString = '';
                let i = 0;
                for (var key in this.state.filterQuery) {
                    if (this.state.filterQuery[key] !== '') {
                        filterString += '&' + key + '=' + this.state.filterQuery[key];
                    }
                    if (key == "expiryDocument") {
                        filterString += '&fromExpiry=' + this.state.form.fromExpiry + '&toExpiry=' + this.state.form.toExpiry;
                    }
                    if (i == 6) {
                        this.setState({
                            filterString: filterString
                        }, () => {
                            this.refreshData();
                        })
                    }
                    i++;
                }
            })
        }

        if (e.target.name === 'orgId') {
            this.setState({
                orgId: e.target.value,
                exportData: [],
                employeesCount: ""
            }, () => {
                this.refreshData();
            })
        }
    }

    applyExpiryDocumentFilter = () => {
        console.log('Expiry document filter');
        this.setState({
            filterQuery: {
                ...this.state.filterQuery, ['expiryDocumentFilter']: this.refs['expiryDocument'].value
            },
            exportData: [],
            employeesCount: ""
        }, () => {
            console.log('filterQuery', this.state.filterQuery);
            let filterString = '';
            filterString += '&expiryDocument=' + this.state.filterQuery.expiryDocument + '&fromExpiry=' + this.state.form.fromExpiry + '&toExpiry=' + this.state.form.toExpiry;
            this.setState({
                filterString: filterString
            }, () => {
                this.refreshData();
            })
        })
    }

    applyExpiryFilter = (e) => {
        this.setState({
            filterQuery: {
                ...this.state.filterQuery, [e.target.name]: e.target.value
            }
        })
    }

    checkSelectValue = (inputField) => {
        let _self = this;
        let data = true;
        try {
            Object.keys(this.state.dropdowns).map((obj_index, arr_index) => {


                if (inputField.fieldName === obj_index) {
                    // if(obj_index === "issuing_emirate"){
                    //     inputField.importValue = Number(inputField.importValue)
                    // }   

                    if (inputField.importValue === undefined || !_self.state[_self.state.dropdowns[obj_index]].includes(inputField.importValue)) {
                        console.log('dept not exist', inputField.fieldName);
                        console.log('Check select value not exist', obj_index, inputField.importValue, _self.state[_self.state.dropdowns[obj_index]]);
                        data = false;
                        throw 'error';
                    }
                    else {
                        data = true;
                    }
                }
                else {
                    data = true;
                }
            })
        }
        catch (e) {
            data = false;
        }

        return data;
    }

    render() {

        // console.log('org id',this.state.orgId)

        const columns = [
            {
                title: "Employee Name",
                prop: "name",
                sortable: true,
                filterable: true
            },
            {
                title: "Employee Code",
                prop: "empCode",
                sortable: true
            },
            {
                title: "Official Email",
                prop: "email",
                sortable: true
            },
            {
                title: "Phone",
                prop: "phoneNumber",
            },
            {
                title: "Employment Type",
                prop: "empType",
            },
            {
                title: "Status",
                prop: "empStatus",
                sortable: true
            },
            {
                title: "Insurance",
                prop: "employee_insurance",
                sortable: true
            },
            {
                title: "Insurance Plan",
                prop: "insuranceName",
                sortable: true
            },
            {
                title: "Insurance Expiry",
                prop: "emp_insurance_endDate",
                sortable: true
            },
            {
                title: "Visa Expiry",
                prop: "visaExpiryDateNew",
                sortable: true
            },
            {
                title: "Health Card",
                prop: "healthCard",
                sortable: true
            },
            {
                title: "Actions",
                prop: "action",
            },
        ];


        const customStyles = {
            rows: {
                style: {
                    minHeight: '72px', // override the row height
                }
            },
            headCells: {
                style: {
                    paddingLeft: '8px', // override the cell padding for head cells
                    paddingRight: '8px',
                },
            },
            cells: {
                style: {
                    paddingLeft: '8px', // override the cell padding for data cells
                    paddingRight: '8px',
                },
            },
        };

        const onSortFunction = {
            date(columnValue) {
                // Convert the string date format to UTC timestamp
                // So the table could sort it by number instead of by string
                return moment(columnValue, 'Do MMMM YYYY').valueOf();
            }
        };

        const customLabels = {
            first: '<<',
            last: '>>',
            prev: '<',
            next: '>',
            show: 'Display',
            entries: 'rows',
            noResults: 'There is no data to be displayed'
        };

        const classes = {
            table: 'mt-4 table-responsive employees-table',
            theadCol: css`
              .table-datatable__root & {
                &.sortable:hover {
                  background: pink;
                }
              }
            `,
            tbodyRow: css`
              &:nth-of-type(even) {
                background: #eaeaea;
              }
            `,
            paginationOptsFormText: css`
              &:first-of-type {
                margin-right: 8px;
              }
              &:last-of-type {
                margin-left: 8px;
              }
            `
        };

        var inputFields = [];
        if (this.state.importData) {
            var dataCount = Object.keys(this.state.importData).length;
            inputFields = Object.values(this.state.importData);
        }

        console.log('Import error count', this.state.dropdowns)

        return (
            <>
                {dataCount > 0 && Object.keys(inputFields).length > 0 ? (
                    <div className="p-4 flex-fill d-flex flex-column page-fade-enter-done">
                        <h3>Preview Import Data</h3>
                        <p className="font-12 font-weight-bold text-danger">{this.state.importErrorCount > 0 ? 'Please fill the required fields highlighted in the table of records' : ''} </p>
                        <p>Total No. of Records : {Object.keys(inputFields).length}</p>
                        <table className="table-striped preview-table table-responsive">
                            {inputFields.map((field, index) => {
                                var currentField = Object.values(field);
                                //   console.log('Current Field', currentField);      
                                let dataHTML = currentField.map((inputField, key) => {
                                    var disabled = '';
                                    var cursor_disabled_css_class = '';
                                    var dateVal = inputField.importValue ? new Date(inputField.importValue) : '';
                                    var dateSel = inputField.importValue ? new Date(inputField.importValue) : '';
                                    // console.log('select value', inputField.importValue, parseISO(inputField.importValue));

                                    switch (inputField.fieldType) {
                                        case "text": return <th> <label htmlFor={inputField.fieldName} className="mb-0">{inputField.fieldTitle} {inputField.is_mandatory ? '*' : ''}</label><div className="row mb-3"><div className={inputField.importValue ? "col-lg-12" : inputField.is_mandatory ? "col-lg-12 error-field" : "col-lg-12"}><input type="text" id={inputField.fieldName} name={inputField.fieldName} onChange={(e) => this.handlePreviewChange(e, index, key, inputField)} placeholder="" className={"form-control"} defaultValue={inputField.importValue} required="" disabled={disabled} /><div class="errMsg">{this.state.validateFields[index] && this.state.validateFields[index][inputField.fieldName] ? 'Please enter the ' + this.state.validateFields[index][inputField.fieldName] : ''}</div></div></div> </th>;
                                        case "textarea": return <th> <label htmlFor={inputField.fieldName} className="mb-0">{inputField.fieldTitle} {inputField.is_mandatory ? '*' : ''}</label><div className="row mb-3"><div className={inputField.importValue ? "col-lg-12" : inputField.is_mandatory ? "col-lg-12 error-field" : "col-lg-12"}><textarea type="text" id={inputField.fieldName} name={inputField.fieldName} onChange={(e) => this.handlePreviewChange(e, index, key, inputField)} defaultValue={inputField.importValue} placeholder="" className={"form-control" + cursor_disabled_css_class} required="" disabled={disabled} /><div class="errMsg">{this.state.validateFields[index] && this.state.validateFields[index][inputField.fieldName] ? 'Please enter the ' + this.state.validateFields[index][inputField.fieldName] : ''}</div></div></div> </th>;
                                        case "phone-text": return <th><label htmlFor={inputField.fieldName}>{inputField.fieldTitle}</label><div className="row mb-3"><div className={inputField.importValue ? "col-lg-12" : inputField.is_mandatory ? "col-lg-12 error-field" : "col-lg-12"}><PhoneInput country={'ae'} className={"form-control"} onChange={(value, data, event, formattedValue) => this.handlePhoneChange(value, data, event, formattedValue, inputField.fieldName, index, key)} id={inputField.fieldName} name={inputField.fieldName} value={inputField.importValue} /><div class="errMsg">{this.state.validateFields[index] && this.state.validateFields[index][inputField.fieldName] ? 'Please enter the ' + this.state.validateFields[index][inputField.fieldName] : ''}</div></div></div></th>;

                                        case "select": return <th><div>{this.checkSelectValue(inputField)}</div> <label htmlFor={inputField.fieldName}>{inputField.fieldTitle} {inputField.is_mandatory ? '*' : ''}</label><div className="row mb-3"><div className={(inputField.importValue || inputField.importValue === undefined) && !this.checkSelectValue(inputField) ? "col-lg-12 error-field" : "col-lg-12"}><select className={"form-control" + cursor_disabled_css_class} value={inputField.importValue} onChange={(e) => this.handlePreviewChange(e, index, key, inputField)} ref={inputField.fieldName} name={inputField.fieldName} disabled={disabled}><option selected value=''>Select {inputField.fieldTitle}</option>{this.state[inputField.fieldName] && this.state[inputField.fieldName] !== 'undefined' && Object.keys(this.state[inputField.fieldName]).length > 0 ? Object.values(this.state[inputField.fieldName]) : ''}</select><div class="errMsg">{this.state.validateFields[index] && this.state.validateFields[index][inputField.fieldName] ? 'Please select the ' + this.state.validateFields[index][inputField.fieldName] : inputField.importValue && !this.checkSelectValue(inputField) ? 'Please select the ' + inputField.fieldTitle : ''}</div></div></div> </th>;
                                        case "date": return <th> <label htmlFor={inputField.fieldName} className="mb-0">{inputField.fieldTitle} {inputField.is_mandatory ? '*' : ''}</label><div className="row mb-3"><div className={inputField.importValue ? "col-lg-12" : inputField.is_mandatory ? "col-lg-12 error-field" : "col-lg-12"}><DatePicker autoComplete="off" showYearDropdown selected={dateSel} dateFormat={config.DP_INPUT_DATE_FORMAT} dropdownMode="scroll" className={"form-control" + cursor_disabled_css_class} onChange={this.datePreviewChange.bind(this, inputField.fieldName, index, key, inputField)} value={dateVal} name={inputField.fieldName} id={inputField.fieldName} disabled={disabled} /><div class="errMsg">{this.state.validateFields[index] && this.state.validateFields[index][inputField.fieldName] ? 'Please select the ' + this.state.validateFields[index][inputField.fieldName] : ''}</div></div></div> </th>;

                                    }

                                })
                                return <tr>{dataHTML}</tr>;
                            })
                            }
                        </table>
                        <div className="offset-md-6 col-md-6 text-center mt-4">
                            <button className="btn btn-secondary" onClick={() => this.cancelImport()}>Cancel</button>
                            <button className="btn btn-primary ml-3" onClick={() => this.submitImportData()}>Import</button>
                        </div>

                    </div>
                ) : (
                    <>
                        <main className="p-4 flex-fill d-flex flex-column">
                            <div className="flex-fill">
                                <Row>
                                    <div className="col-sm-12">
                                        <ToastContainer className="right" position="top-right"
                                            autoClose={5000}
                                            hideProgressBar={false}
                                            newestOnTop={false}
                                            closeOnClick
                                            rtl={false}
                                            pauseOnVisibilityChange
                                            draggable
                                            pauseOnHover></ToastContainer>

                                        <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
                                            <h6>
                                                <span>Filter By</span> <span onClick={e => this.clearOrderByFilters(e)} style={{ cursor: 'pointer', float: 'right', fontSize: '12px', color: '#ed0f7e' }}>CLEAR ALL</span>
                                            </h6>
                                            <div className="row">
                                                <div className="d-flex col-lg-12 col-md-12 leftSearchIcon pl-0">
                                                    {(role_id == 1) ?
                                                        <div className="col">
                                                            Organization
                                                            <select className="form-control custom-select" onChange={(e) => this.applyFilterInTopBar(e)} name='orgId' id='orgId' value={this.state.orgId}>{this.state.organization_option}</select>
                                                        </div>
                                                        : ''}
                                                    <div className="col">

                                                        Department
                                                        <select className="form-control custom-select" value={this.state.filterQuery.deptId} onChange={(e) => this.applyFilterInTopBar(e)} name='deptId' id='deptId' ><option value="" selected={this.state.filterQuery.deptId == ''}>--Select--</option>{this.state.departments}</select>
                                                    </div>
                                                    <div className="col">

                                                        Designation
                                                        <select className="form-control custom-select" value={this.state.filterQuery.positionId} onChange={(e) => this.applyFilterInTopBar(e)} name='positionId' id='positionId'><option value="" selected={this.state.filterQuery.positionId == ''}>--Select--</option>{this.state.positions}</select>
                                                    </div>
                                                    <div className="col">

                                                        Employee Type
                                                        <select className="form-control custom-select" value={this.state.filterQuery.empType} onChange={(e) => this.applyFilterInTopBar(e)} name='employmentType' id='empType'><option value="" selected={this.state.filterQuery.empType == ''}>--Select--</option>{this.state.empType}</select>
                                                    </div>
                                                    <div className="col">

                                                        Work Location
                                                        <select className="form-control custom-select" value={this.state.filterQuery.workLocation} onChange={(e) => this.applyFilterInTopBar(e)} name='workLocation' id='workLocation' ><option value="" selected={this.state.filterQuery.workLocation == ''}>--Select--</option>{this.state.locations}</select>
                                                    </div>
                                                    <div className="col">

                                                        Status
                                                        <select className="form-control custom-select" value={this.state.filterQuery.status} onChange={(e) => this.applyFilterInTopBar(e)} name='status' id='status'><option value="" selected={this.state.filterQuery.status == ''}>--Select--</option>{this.state.status_option}</select>
                                                    </div>
                                                    <div className="col">

                                                        Gender
                                                        <select className="form-control custom-select" value={this.state.filterQuery.gender} onChange={(e) => this.applyFilterInTopBar(e)} name='gender' id='gender'><option value="" selected={this.state.filterQuery.gender === '' ? 'selected' : ''}>--Select--</option>{this.state.gender_option}</select>
                                                    </div>
                                                </div>
                                            </div>

                                            <h6 className="mt-2">
                                                <span>Advanced Filter</span>
                                            </h6>
                                            <div className="row">
                                                <div className="d-flex col-lg-12 col-md-12 leftSearchIcon pl-0">
                                                    <div className="col">

                                                        Document Expiry
                                                        <select ref="expiryDocument" value={this.state.filterQuery.expiryDocument} className="form-control custom-select" onChange={(e) => this.applyExpiryFilter(e)} name='expiryDocument' id='expiryDocument' ><option value="" selected={this.state.filterQuery.expiryDocument == ''}>--Select Document--</option>
                                                            <option value="ins">Insurance</option>
                                                            <option value="visa">Visa</option>
                                                            <option value="passport">Passport</option>
                                                            <option value="emirate">Emirate</option>
                                                        </select>
                                                    </div>
                                                    <div className="col">

                                                        From
                                                        <DatePicker autoComplete="off" selected={this.state.form.fromExpiry ? this.state.form.fromExpiry : moment().toDate()} dateFormat={config.DP_INPUT_DATE_FORMAT} showYearDropdown dropdownMode="scroll" className="form-control" minDate={moment().toDate()} maxDate={this.state.form.toExpiry ? moment(this.state.form.toExpiry).toDate() : ''} onChange={this.dateChange.bind(this, 'fromExpiry')} name="fromExpiry" id="fromExpiry" />
                                                    </div>
                                                    <div className="col">

                                                        To
                                                        <DatePicker autoComplete="off" selected={this.state.form.toExpiry ? this.state.form.toExpiry : moment().toDate()} dateFormat={config.DP_INPUT_DATE_FORMAT} showYearDropdown dropdownMode="scroll" className="form-control" minDate={moment().toDate()} onChange={this.dateChange.bind(this, 'toExpiry')} name="toExpiry" id="toExpiry" />
                                                    </div>
                                                    <div className="col">
                                                        {" "}
                                                        <button disabled={this.state.form.toExpiry && this.state.filterQuery.expiryDocument ? '' : 'disabled'} className="btn btn-primary mt-4" onClick={() => this.applyExpiryDocumentFilter()}>Filter</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex col-lg-1 leftSearchIcon"></div>

                                            <div className="searchEmpBlock">
                                                {/* <input className="searchText" type="text" name='search' id='search' value={this.state.search} onChange={this.changeSearch} placeholder="Search Employee" /> */}
                                                {(this.state.brokerOrg > 0) ? <button class="btn btn-primary" onClick={this.handleCSVShow}>Bulk Import</button> : ''}
                                                <ExportReactCSV csvData={this.state.exportData} fileName={this.state.fileName} />
                                                {this.state.role != 'broker-admin' && this.state.role != 'broker-primary' ? (
                                                    <ExportMasterData></ExportMasterData>) : ''}
                                            </div>

                                        </Card>
                                        {this.state.employeesCount == 0 && this.state.employeesCount !== '' ? (<Card className="card d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm"><h3>No Records Found</h3></Card>) : (this.state.employeesCount !== 0 && this.state.employeesCount > 0 ? (
                                            <>
                                                <Card className="card d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
                                                    <div className="datascroll">

                                                        <DataTable
                                                            tableHeaders={columns}
                                                            tableBody={this.state.employeesArr}
                                                            rowsPerPage={10}
                                                            rowsPerPageOption={[5, 10, 15, 20]}
                                                            initialSort={{ prop: 'empDetails.personal.id', isAscending: true }}
                                                            onSort={onSortFunction}
                                                            labels={customLabels}
                                                            classes={classes}
                                                        />
                                                    </div>
                                                </Card></>) : <Card className="card d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm"> <DataTableLoader></DataTableLoader></Card>)}



                                        {/* <div className="form-group row pt-2 ">
                                           <div className="col-lg-12 text-left">
                                               {(this.state.brokerOrg > 0) ? <span className="addNewButton"><a href="/employees/add"><i className="icon-plus icons"></i> Add New</a></span> : ''}
                                           </div>
                                       </div> */}

                                    </div>



                                    <Modal show={this.state.addShow} onHide={this.handleAddClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Add Organization</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Form onSubmit={event => { event.preventDefault(); this.handleAddSubmit(this.state) }}>
                                                <fieldset>
                                                    <label htmlFor="orgName" className="mb-0">Registered Company Name</label>
                                                    <div className="row mb-3">
                                                        <div className="col-lg-12">
                                                            <input type="text" id="orgName" name="orgName" placeholder="Ex: Service Internataional pvt ltd" className="form-control" onChange={this.handleAddChange} required="" />
                                                        </div>
                                                    </div>
                                                    <label htmlFor="website" className="mb-0">Your Domain URL</label>
                                                    <div className="row mb-3">
                                                        <div className="col-lg-12">
                                                            <input type="text" id="website" name="website" placeholder="Ex: service.yyy.com" className="form-control" onChange={this.handleAddChange} required="" />
                                                        </div>
                                                    </div>
                                                    <label htmlFor="contactPerson" className="mb-0">Account Owners</label>
                                                    <div className="row mb-3">
                                                        <div className="col-lg-12">
                                                            <input type="text" id="contactPerson" name="contactPerson" placeholder="Ex: Lukus Adoms" className="form-control" onChange={this.handleAddChange} required="" />
                                                        </div>
                                                    </div>

                                                    <label htmlFor="contactNumber" className="mb-0">Contact Number</label>
                                                    <div className="row mb-3">
                                                        <div className="col-lg-12">
                                                            <input type="text" id="contactNumber" name="contactNumber" placeholder="Ex: 9898988989" className="form-control" onChange={this.handleAddChange} required="" />
                                                        </div>
                                                    </div>

                                                    <label htmlFor="companyAddress" className="mb-0">Contact Address</label>
                                                    <div className="row mb-3">
                                                        <div className="col-lg-12">
                                                            <input type="text" id="companyAddress" name="companyAddress" placeholder="Ex: 10th floor, control Tower, Moter City, Duvai" onChange={this.handleAddChange} className="form-control" required="" />
                                                        </div>
                                                    </div>
                                                    <label htmlFor="email" className="mb-0">Email</label>
                                                    <div className="row mb-3">
                                                        <div className="col-lg-12">
                                                            <input type="text" id="email" name="email" onChange={this.handleAddChange} className="form-control" required="" />
                                                        </div>
                                                    </div>
                                                    <label htmlFor="companyAddress" className="mb-0">Company Logo</label>
                                                    <div className="row mb-3">
                                                        <div className="col-lg-12">
                                                            <ul className="myinfoListing">
                                                                <li>
                                                                    <label>Upload Your Logo </label>
                                                                    <span>

                                                                        <label htmlFor="uploadId" className="squireUpload">
                                                                            <small>Your Company Logo</small>
                                                                            <input type="file" name="logo" id="uploadId" onChange={this.uploadLogo} />
                                                                        </label>

                                                                    </span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                </fieldset>
                                                <Button variant="outline-primary mr-2" onClick={this.handleAddClose}>
                                                    Close
                                                </Button>
                                                <Button type="submit" variant="primary" onClick={this.handleAddClose}>
                                                    Save
                                                </Button>
                                            </Form>
                                        </Modal.Body>
                                        <Modal.Footer>

                                        </Modal.Footer>
                                    </Modal>

                                    <Modal show={this.state.csvShow} onHide={this.handleCSVClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Select File to import</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body className="text-center">
                                            {/* <label>Upload CSV File</label> */}
                                            <span className="text-center">


                                                {this.state.errorFilePath ? <><h3>Error occured while importing the employees from the CSV. Please try again.</h3><p><a className="font-16" href={config.BASE_URL + '/' + this.state.errorFilePath} onClick={this.hidePopup} download>Download the error log file here.</a> </p></> :
                                                    <><label htmlFor="uploadId" className="squireUpload">
                                                        <small className="font-20">Upload Employee CSV File</small>
                                                        <input type="file" ref="file" name="logo" id="uploadId" onChange={this.uploadCSV} />
                                                    </label><p><a className="font-16" href={config.BASE_URL + '/' + this.state.sampleFilePath} download>Download the sample file for bulk import.</a> </p></>}
                                            </span>
                                        </Modal.Body>
                                    </Modal>



                                    <Modal show={this.state.importError} onHide={this.handleErrorClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Import Employees</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body className="text-center">
                                            {/* <label>Upload CSV File</label> */}
                                            <span className="text-center">
                                                {(this.state.empCount - this.state.errorCount) > 0 ? (
                                                    <p className="font-16">
                                                        <i style={{ fontSize: '40px', color: '#28a745' }}><FaCheckSquare /></i>  {this.state.empCount - this.state.errorCount} of {this.state.empCount} employee(s) successfully imported
                                                    </p>
                                                ) : ''}



                                                {this.state.errorFilePath ? <> <p className="font-16" style={{ color: '#dc3545' }}>

                                                    <i style={{ fontSize: '20px', color: '#fff', backgroundColor: '#dc3545', padding: '5px 8px', borderRadius: '5px' }}><FaExclamationTriangle /></i>    {this.state.errorCount} of {this.state.empCount} employee(s) could not be imported
                                                </p><p><a className="font-16" href={config.BASE_URL + '/' + this.state.errorFilePath} download>Download the error log file here.</a> </p></> : ''
                                                }
                                            </span>
                                        </Modal.Body>
                                    </Modal>

                                    {this.state.uploadHealthCard ? (
                                        <UploadHealthCard empId={this.state.selectedEmp} onRefresh={this.refreshData} show={this.state.show} onHide={this.handleClose}></UploadHealthCard>
                                    ) : ''}

                                    {this.state.downloadHealthCard ? (
                                        <DownloadHealthCard empId={this.state.selectedEmp} show={this.state.downloadShow} onHide={this.handleDownloadClose}></DownloadHealthCard>
                                    ) : ''}
                                </Row>
                            </div>
                        </main>
                    </>
                )}

                <Modal show={this.state.showcountError} onHide={this.hideCountError}>
                    <Modal.Header closeButton>
                        <Modal.Title>Errors in Importing</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        <div className="row mb-3">
                            <div className="col-lg-12 text-center">
                                <i style={{ fontSize: '48px', color: '#ffc107' }}><FaExclamationTriangle /></i>
                                {/* <p className="font-18">You've got errors in the imported data.</p> */}
                                <p className="font-18">Do you want to import with the partial data?</p>
                                <hr className="divider"></hr>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <button className="btn btn-secondary font-16" onClick={() => this.setState({
                                    showcountError: false
                                })}>No, I'll fix them</button>
                                <button className="btn btn-primary ml-3 font-16" onClick={() => this.submitwithoutErrors()}>Import with Errors</button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={this.state.showLoader} onHide={this.hideLoader}>
                    <Modal.Header closeButton>
                        <Modal.Title>Importing Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        <div className="row mb-3">
                            <div className="col-lg-12 text-center">
                                {this.state.processData ? (<p>Processing the data</p>) : (<p>Reading Data from the CSV File</p>)}

                                {/* <p>Imported {this.state.currentRows} rows from CSV</p> */}
                                {/* <p>Processing the</p> */}
                                {/* <p className="font-18">Do you want to immport with the partial data?</p> */}
                                <hr className="divider"></hr>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <Loader
                                    type="Grid"
                                    color="#415087"
                                    height={200}
                                    width={500}
                                // timeout={3000} //3 secs

                                />
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>


            </>
        );
    }
}

export default Employees;

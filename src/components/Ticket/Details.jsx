import React, { Component } from "react";
// import { Col, Card, Row } from "reactstrap";
import { Modal, Button, Card, Table, Form, Col, Row } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import moment from "moment";
import axios from "axios";
import ModalImage from "react-modal-image";
import { FaArrowLeft } from 'react-icons/fa';
import config from "../../../src/config/config";
import { ExportReactCSV } from '../../views/ExportReactCSV';
import { Provider } from "react-redux";
const BEARER_TOKEN = "Bearer " + localStorage.getItem("userData");

class Details extends Component {
        constructor(props) {
                super(props);
                this.state = {
                        replyForm: {
                                validation: { description: '', ticket_status: '' },
                                description: "",
                                ticket_status: "",
                                attachments: "",
                                replied_to: "",
                                opened_by: "",
                                assigned_to: "",
                                ticket_id: "",
                                settlement_amount: "",

                        },
                        exportData: [],
                        fileName: 'dependents.csv',
                        hideControl: false,
                        hideReplyForm: false,
                        isLoaded: false,
                        assigneeDepartment: '',
                        basicFields: [],
                        token: localStorage.getItem("userData"),
                        orgId: localStorage.getItem("orgId"),
                        empId: localStorage.getItem("employeeId"),
                        nationalityArr: [],
                        relationArr: { 'S': "Spouse", "P": "Parent", "C": "Child" },
                        countriesArr: [],
                        gender: { 'M': 'Male', 'F': 'Female' },
                };
                this.getTicketReplyDetails = this.getTicketReplyDetails.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);
                this.handleChange = this.handleChange.bind(this);
                this.getTicketDetails = this.getTicketDetails.bind(this);
        }
        componentDidMount() {
                const employeeId = localStorage.getItem("employeeId");
                if (this.props.isTicketDetailLoaded) {
                        this.setState({
                                replyForm: {
                                        ...this.state.replyForm,
                                        ticket_status: this.props.ticketSummaryDetails.ticketDet[0]
                                                .ticket_status,
                                        ticket_id: this.props.ticketSummaryDetails.ticketDet[0].id,
                                        opened_by: this.props.ticketSummaryDetails.ticketDet[0].opened_by,
                                        assigned_to: this.props.ticketSummaryDetails.ticketDet[0].assigned_to,
                                        assigneeDepartment: this.props.ticketSummaryDetails.ticketDet[0].assigneeDepartment
                                },
                                // hideControl:(this.props.ticketSummaryDetails.ticketDet[0].assigned_to==employeeId),
                                hideControl: true,
                                hideReplyForm:
                                        this.props.ticketSummaryDetails.ticketDet[0].closed_by !== null,
                        });
                }
                var bearer = 'Bearer ' + BEARER_TOKEN;
                axios.get(config.API_URL + '/dependent-fields')
                        .then(r => {
                                if (r.status == 200) {
                                        console.log('fieldList', r.data.fieldList);
                                        this.setState({ basicFields: r.data.fieldList });
                                }
                        })
                        .catch((error) => {
                                console.log("API ERR: ");
                                console.error(error);
                        });

                console.log('Country Data', this.state.countriesArr);
                if (this.props.ticketSummaryDetails.dependentData && Object.keys(this.props.ticketSummaryDetails.dependentData.rows).length > 0 && Object.keys(this.props.countries).length > 0) {

                        this.props.ticketSummaryDetails.dependentData.rows.map((data, key) => {
                                console.log('Export Data', data.relationship.charAt(0));
                                this.state.exportData[key] = {};
                                this.state.exportData[key]['Employee Code'] = data.empCode;
                                this.state.exportData[key]['Dependent Name'] = data.firstname + ' ' + data.lastname;
                                this.state.exportData[key]['Dependent Code'] = data.dependentCode;
                                this.state.exportData[key]['Birth Date'] = data.birthDate ? data.birthDate : '';
                                this.state.exportData[key]['Gender'] = data.gender ? this.state.gender[data.gender.toUpperCase()] : '';
                                this.state.exportData[key]['Relation'] = data.relationship ? this.state.relationArr[data.relationship.charAt(0)] : '';
                                this.state.exportData[key]['Nationality'] = data.nationality ? this.props.nationality[data.nationality] : '';
                                this.state.exportData[key]['Visa UID'] = data.visaUID ? data.visaUID : '';
                                this.state.exportData[key]['Visa File No'] = data.visaUID ? data.visa_file_no : '';
                                this.state.exportData[key]['Visa Type'] = data.visaUID ? data.visa_type : '';
                                this.state.exportData[key]['Sponsor'] = data.sponsor ? data.sponsor : '';
                                this.state.exportData[key]['Visa Issue Date'] = data.visaUID ? moment(data.visaIssueDate).format(config.DATE_FORMAT) : '';
                                this.state.exportData[key]['Visa Expiry Date'] = data.visaUID ? moment(data.visaExpiryDate).format(config.DATE_FORMAT) : '';
                                this.state.exportData[key]['Visa Issuing Emirate'] = data.issuing_emirate ? data.issuing_emirate : '';
                                this.state.exportData[key]['Visa Issuing Country'] = data.visaIssuingCountry ? this.props.countries[data.visaIssuingCountry] : '';

                                this.state.exportData[key]['Passport Number'] = data.passport_number ? data.passport_number : '';
                                this.state.exportData[key]['Passport Issue Date'] = data.visaUID ? moment(data.passportIssueDate).format(config.DATE_FORMAT) : '';
                                this.state.exportData[key]['Passport Expiry Date'] = data.visaUID ? moment(data.passportExpiryDate).format(config.DATE_FORMAT) : '';
                                this.state.exportData[key]['Passport Issuing Country'] = data.passportIssuingCountry ? this.props.countries[data.passportIssuingCountry] : '';
                                this.state.exportData[key]['Emirates Id'] = data.eidNo ? data.eidNo : '';
                                this.state.exportData[key]['Emirates Expiry Date'] = data.emirateExpiryDate ? moment(data.emirateExpiryDate).format(config.DATE_FORMAT) : '';
                        })
                }
        }
        loadAttachments(image) {

                if (image != null) {
                        return (
                                <>
                                        <a href={config.BASE_URL + '/upload/tickets/' + image} alt={image} target="_blank">View Attachments</a>
                                </>
                        );
                } else {
                        return "Not Available";
                }
        }
        handleClose = () => {
                console.log('close button')
                this.setState({ uploadshow: false })
        };
        getCountries() {
                axios.get(config.API_URL + '/common/countries', { headers: { Authorization: 'bearer ' + BEARER_TOKEN } })
                        .then(r => {

                                if (r.status == 200) {
                                        var arrCountry = [];
                                        var arrCountry1 = [];

                                        for (var k = 0; k < r.data.Countries.length; k++) {
                                                arrCountry.push(<option key={r.data.Countries[k].id} value={r.data.Countries[k].id}> {r.data.Countries[k].country} </option>);
                                                arrCountry1[r.data.Countries[k].id] = r.data.Countries[k].country;
                                        }
                                        this.setState({ Countries: arrCountry, Countries1: arrCountry1, countriesArr: r.data.countriesArr, nationalityArr: r.data.nationalityArr });
                                }
                        }).catch((error) => {
                                console.log("API ERR: ");
                                console.error(error);
                                // res.json({ error: error });
                        });
        }
        getTicketReplyDetails() {
                const ticketReplyDetail = this.props.ticketSummaryDetails.ticketReplyDetail;
                let list = "";
                if (ticketReplyDetail.length > 0) {
                        list = ticketReplyDetail.map((reply) => (
                                <Card className="card ticketList d-block pl-4 pr-4 pt-4 pb-4 br-3 mb-4 shadow-sm card card">
                                        <Row style={{ marginBottom: "10px" }}>
                                                <Col>{reply.description}</Col>
                                        </Row>
                                        <Row>
                                                <Col>Attachments: {this.loadAttachments(reply.attachments)}</Col>
                                        </Row>
                                        <Row>
                                                <Col>Replied By: {reply.replied_by}</Col>
                                                <Col>
                                                        Replied On:{" "}
                                                        {moment(reply.replied_on).format("MMM DD, YYYY hh:ss A")}
                                                </Col>
                                        </Row>
                                </Card>
                        ));
                }
                return list;
        }
        getTicketClosedBy() {
                console.log('this.props.ticketSummaryDetails.ticketDet.closed_by => ', this.props.ticketSummaryDetails.ticketDet[0].closed_by);
                if (this.props.ticketSummaryDetails.ticketDet[0].closed_by !== null) {
                        let ticketDetails = this.props.ticketSummaryDetails.ticketDet;
                        return (
                                <>
                                        <li>
                                                <label>Closed By</label>
                                                <span>
                                                        {ticketDetails[0].closedByUser}
                                                </span>
                                        </li>
                                        <li>
                                                <label>Closed On</label>
                                                <span>
                                                        {moment(ticketDetails[0].closed_on).format("MMM DD, YYYY hh:ss A")}
                                                </span>
                                        </li>
                                </>
                        );
                }
        }
        getLeaveDetails() {
                if (this.props.ticketSummaryDetails.leaveDetails.length > 0) {
                        let leaveDetails = this.props.ticketSummaryDetails.leaveDetails;
                        return (
                                <>
                                        <li>
                                                <label>Start Date</label>
                                                <span>
                                                        {moment(leaveDetails[0].start_date).format("MMM DD, YYYY")}
                                                </span>
                                        </li>
                                        <li>
                                                <label>End Date</label>
                                                <span>
                                                        {moment(leaveDetails[0].end_date).format("MMM DD, YYYY")}
                                                </span>
                                        </li>
                                        <li>
                                                <label>Number of days</label>
                                                <span>{leaveDetails[0].number_of_days}</span>
                                        </li>
                                </>
                        );
                }
        }
        profileData() {
                if (this.props.ticketSummaryDetails.profileDetails) {
                        let profileDetails = this.props.ticketSummaryDetails.profileDetails;
                        // let details = ;
                        return (
                                <>
                                        <Card className="card ticketList d-block pl-4 pr-4 pt-4 pb-4 br-3 mb-4 shadow-sm card card">
                                                <Row>
                                                        <span> Profile Data </span>
                                                        <ul className="myinfoListing ticketd">
                                                                {profileDetails.map(function (profileDetails) {
                                                                        return (
                                                                                <li>
                                                                                        <label>{profileDetails.fieldTitle}</label>
                                                                                        <span>
                                                                                                {
                                                                                                        profileDetails.fieldType == 'date' ? moment(profileDetails.fieldValue).format("MMM DD, YYYY") : profileDetails.fieldValue
                                                                                                }
                                                                                        </span>
                                                                                </li>
                                                                        )
                                                                })}
                                                        </ul>
                                                </Row>
                                        </Card>
                                </>
                        )
                }
        }
        loadEmpDocs(insuranceEmpDoc, docType) {
                let i = 1;
                if (insuranceEmpDoc.length > 0) {
                        return insuranceEmpDoc.map(doc => {
                                if (doc.documentType == docType) {
                                        return (
                                                <a style={{ marginRight: "10px" }} href={config.BASE_URL + doc.documentPath} target="_blank">View Doc {i++}</a>
                                        )
                                }
                        })
                }
        }
        insuranceEmpData() {
                if (this.props.ticketSummaryDetails.insuranceEmpDet) {
                        let insuranceEmpDet = this.props.ticketSummaryDetails.insuranceEmpDet[0];
                        let insuranceEmpDoc = this.props.ticketSummaryDetails.insuranceEmpDoc;
                        // let details = ;
                        return (
                                <>
                                        <Card className="card ticketList d-block pl-4 pr-4 pt-4 pb-4 br-3 mb-4 shadow-sm card card">
                                                <Row className="pl-4">
                                                        <span> Employee Details </span>
                                                        <ul className="myinfoListing ticketd">
                                                                <li>
                                                                        <label>Full Name</label>
                                                                        <span>{insuranceEmpDet.fullName}</span>
                                                                </li>
                                                                <li>
                                                                        <label>Employee Code</label>
                                                                        <span>{insuranceEmpDet.empCode}</span>
                                                                </li>
                                                                <li>
                                                                        <label>Email</label>
                                                                        <span>{insuranceEmpDet.email}</span>
                                                                </li>
                                                                <li>
                                                                        <label>Currently Working in UAE</label>
                                                                        <span>{insuranceEmpDet.uaeResident}</span>
                                                                </li>
                                                                <li>
                                                                        <label>Passport</label>
                                                                        <span>{this.loadEmpDocs(insuranceEmpDoc, 1)}</span>
                                                                </li>
                                                                <li>
                                                                        <label>Emirates ID</label>
                                                                        <span>{this.loadEmpDocs(insuranceEmpDoc, 21)}</span>
                                                                </li>

                                                        </ul>
                                                </Row>
                                        </Card>
                                </>
                        )
                }
        }

        insuranceEmpGradeData() {
                var key;
                if (this.props.ticketSummaryDetails.insuranceEmpDet) {
                        let insuranceEmpDet = this.props.ticketSummaryDetails.insuranceEmpDet[0];
                        let planGrade = this.props.ticketSummaryDetails.planGrades;
                        let planList = this.props.ticketSummaryDetails.plansList;
                        let planId, insName, insProvider;
                        for (key in planGrade) {
                                if (planGrade[key].grade === insuranceEmpDet.grade) {
                                        planId = planGrade[key].planId;
                                }
                        }
                        for (key in planList) {
                                if (planList[key].planId === planId) {
                                        insName = planList[key].insuranceName;
                                        insProvider = planList[key].insurarProvider;
                                }
                        }

                        return (
                                <>
                                        <Card className="card ticketList d-block pl-4 pr-4 pt-4 pb-4 br-3 mb-4 shadow-sm card card">
                                                <Row className="pl-4">
                                                        <span> Insurance Details </span>
                                                        <ul className="myinfoListing ticketd">
                                                                <li>
                                                                        <label>Employee Grade</label>
                                                                        <span>{insuranceEmpDet.grade}</span>
                                                                </li>
                                                                <li>
                                                                        <label>Insurance Plan</label>
                                                                        <span>{insName}</span>
                                                                </li>
                                                                <li>
                                                                        <label>Insurance Provider</label>
                                                                        <span>{insProvider}</span>
                                                                </li>

                                                        </ul>
                                                </Row>
                                        </Card>
                                </>
                        )
                }
        }
        showUploadPopup = (ticketId, empId) => {
                console.log('UPload event', empId, ticketId)
                this.setState({
                        selectedTicket: ticketId,
                        ticketEmp: empId,
                        uploadshow: true
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
                        setTimeout(function () {
                                toast.dismiss()
                        }, 2000)
                        this.setState({ uploadshow: false });
                });
        }

        getTicketDetails() {
                const ticketDet = this.props.ticketSummaryDetails.ticketDet;

                return (
                        <>
                                <Card className="card ticketList d-block pl-4 pr-4 pt-4 pb-4 br-3 mb-4 shadow-sm card card">

                                        <ul className="myinfoListing ticketd">
                                                <li>
                                                        <label>Ticket Type</label>
                                                        <span>{ticketDet[0].ticket_type_name}</span>
                                                </li>
                                                {this.state.orgId == 0 && (
                                                        <li>
                                                                <label>Organization</label>
                                                                <span>{ticketDet[0].orgName}</span>
                                                        </li>
                                                )}
                                                <li>
                                                        <label>Ticket Priority</label>
                                                        <span>{ticketDet[0].priority_text}</span>
                                                </li>
                                                <li>
                                                        <label>Due Date</label>
                                                        <span>
                                                                {moment(ticketDet[0].due_date).format("MMM DD, YYYY")}
                                                        </span>
                                                </li>
                                                <li>
                                                        <label>Ticket Status</label>
                                                        <span>{ticketDet[0].ticket_status_text}</span>
                                                </li>
                                                <li>
                                                        <label>Raised By</label>
                                                        <span>{ticketDet[0].openedByUser}</span>
                                                </li>
                                                <li>
                                                        <label>Raised on</label>
                                                        <span>
                                                                {moment(ticketDet[0].opened_on).format("MMM DD, YYYY hh:ss A")}
                                                        </span>
                                                </li>

                                                {this.getTicketClosedBy()}


                                                {this.getLeaveDetails()}

                                                <li>
                                                        <label>Assigned To</label>
                                                        <span>{ticketDet[0].assigneeName}</span>
                                                </li>
                                                <li>
                                                        <label>Title</label>
                                                        <span>{ticketDet[0].title}</span>
                                                </li>
                                                <li style={{ width: "100%" }}>
                                                        <label style={{ width: "15%" }}>Description</label>
                                                        <span>{ticketDet[0].description}</span>
                                                </li>
                                                {ticketDet[0].ticket_slug_name === 'SALARY_CERT' && ticketDet[0].ticket_status_text !== 'Approved' && ticketDet[0].assigned_to == this.state.empId ? (
                                                        <li style={{ width: "100%" }}>
                                                                <a href="javascript:void(0)" onClick={() => this.showUploadPopup(ticketDet[0].id, ticketDet[0].empCode)}>Upload Salary Certificate</a>
                                                        </li>
                                                ) : ''}
                                                {ticketDet[0].ticket_slug_name === 'SALARY_CERT' && ticketDet[0].ticket_status_text == 'Approved' && ticketDet[0].opened_by == this.state.empId ? (
                                                        <li style={{ width: "100%" }}>
                                                                <a href={config.BASE_URL + this.props.ticketSummaryDetails.salaryCertDet[0].docPath} target="_blank" download>Download Salary Certificate</a>

                                                        </li>
                                                ) : ''}
                                                <li>
                                                        <label /* style={{ width: "20%" }} */>Attachments</label>
                                                        <span>{this.loadAttachments(ticketDet[0].attachments)}</span>
                                                </li>

                                                {ticketDet[0].ticket_slug_name === 'ONBOARD' ? (
                                                        <li>
                                                                <label>Medical Insurance Sponsored by Company</label>
                                                                <span>{this.props.ticketSummaryDetails.insuranceEmpDet[0].medicalSponsored ? 'Yes' : 'No'}</span>
                                                        </li>
                                                ) : ''}
                                        </ul>

                                </Card>
                                {this.profileData()}
                                {this.insuranceEmpData()}
                                {this.insuranceEmpGradeData()}


                        </>
                );
        }
        handleChange(e) {
                if (e.target.name == 'settlement_amount') {
                        let regexp = /^\d+\.\d{0,2}$/;
                        if (!regexp.test(e.target.value)) {
                                this.setState({
                                        replyForm: {
                                                ...this.state.replyForm,
                                                [e.target.name]: e.target.value,
                                        },
                                });
                        }
                } else {
                        this.setState({
                                replyForm: {
                                        ...this.state.replyForm,
                                        [e.target.name]:
                                                e.target.name == "attachments" ? e.target.files[0] : e.target.value,
                                },
                        });
                }

        }
        handleSubmit(e) {
                e.preventDefault();
                // console.log("replyForm => ", this.state.replyForm);

                if (this.validateForm()) {
                        let formdata = new FormData();
                        formdata.append("ticket_id", this.state.replyForm.ticket_id);
                        formdata.append("description", this.state.replyForm.description);
                        formdata.append("attachments", this.state.replyForm.attachments);
                        formdata.append("ticket_status", this.state.replyForm.ticket_status);
                        formdata.append("opened_by", this.state.replyForm.opened_by);
                        formdata.append("assigned_to", this.state.replyForm.assigned_to);
                        formdata.append("settlement_amount", this.state.replyForm.settlement_amount);

                        const headers = {
                                Authorization: BEARER_TOKEN,
                        };
                        const s = axios
                                .post(config.API_URL + "/ticket/reply", formdata, { headers: headers })
                                .then((res) => {
                                        if (res.data.success) {
                                                // this.setState({ redirect: true });
                                                // this.props.refreshDetail("", this.state.replyForm.ticket_id);
                                                this.props.refreshListDetail();
                                                this.props.goBackToMyTickets();
                                                this.props.showToastMessage("Ticket comment added successfully.");
                                                this.setState({
                                                        replyForm: {
                                                                ...this.state.replyForm,
                                                                description: "",
                                                        },
                                                });
                                        } else {
                                                alert(res.data.message);
                                        }
                                });
                }
        }

        validateForm() {
                let validations = {};
                let isFormValid = true;
                if (
                        this.state.replyForm.ticket_status == "" ||
                        typeof this.state.replyForm.ticket_status == "undefined"
                ) {
                        validations["ticket_status"] = "Please select ticket status";
                        isFormValid = false;
                }
                if (
                        this.state.replyForm.description == "" ||
                        typeof this.state.replyForm.description == "undefined"
                ) {
                        validations["description"] = "Please enter description";
                        isFormValid = false;
                }
                console.log('validations ====> ', validations);
                this.setState({
                        replyForm: {
                                ...this.state.replyForm,
                                validation: validations,
                        }
                });
                return isFormValid;
        }
        addReplyForm() {
                // console.log("hideReplyForm====> ", this.state.hideReplyForm);
                if (this.state.hideReplyForm) {
                        return "";
                }
                console.log('this.state.assigneeDepartment =====> ', this.state.replyForm.assigneeDepartment);
                const ticketStatus = this.props.ticketSummaryDetails.ticketStatus.map(
                        (status) => (
                                <option
                                        value={status.id}
                                        selected={this.state.replyForm.ticket_status == status.id}
                                >
                                        {status.status_name}
                                </option>
                        )
                );
                // console.log("this.state.hideControl => ", this.state.hideControl);
                return (
                        <Card className="card ticketList d-block pl-4 pr-4 pt-4 pb-4 br-3 mb-4 shadow-sm card card">
                                <form name="replyForm" onSubmit={(e) => this.handleSubmit(e)}></form>
                                <div className="col-sm-12 margin-bottom-20">
                                        <Row>
                                                <div className="col-sm-12">Add Reply Description</div>
                                                <div className="col-sm-12">
                                                        <textarea
                                                                className="form-control"
                                                                placeholder="Add Description Here"
                                                                style={{ minHeight: "150px" }}
                                                                name="description"
                                                                onChange={(e) => this.handleChange(e)}
                                                        >
                                                                {this.state.replyForm.description}
                                                        </textarea>
                                                        <div className="errMsg">
                                                                {this.state.replyForm.validation.description}
                                                        </div>
                                                </div>
                                        </Row>
                                </div>

                                <div className="row pl-4 pr-4">
                                        {this.state.hideControl && (
                                                <div className="col margin-bottom-20">
                                                        <Row>
                                                                <div className="col-sm-5">Status</div>
                                                                <div className="col-sm-7">
                                                                        <select
                                                                                name="ticket_status"
                                                                                className="form-control"
                                                                                onChange={(e) => this.handleChange(e)}
                                                                        >
                                                                                <option value="">Select Status</option>
                                                                                {ticketStatus}
                                                                        </select>
                                                                        <div className="errMsg">
                                                                                {this.state.replyForm.validation.ticket_status}
                                                                        </div>
                                                                </div>
                                                        </Row>
                                                </div>
                                        )}

                                        <div className="col margin-bottom-20">
                                                <Row>
                                                        <div className="col-sm-5">Upload Image</div>
                                                        <div className="col-sm-7">
                                                                {/* <label htmlFor="uploadImage"> */}
                                                                <input
                                                                        type="file"
                                                                        name="attachments"
                                                                        className="custom-input-file"
                                                                        onChange={(e) => this.handleChange(e)}
                                                                />
                                                                {/* </label> */}
                                                        </div>
                                                </Row>
                                        </div>
                                </div>
                                {this.state.replyForm.assigneeDepartment == 'Accounts' && (
                                        <div className="col margin-bottom-20">
                                                <Row>
                                                        <div className="col-sm-5">Settlement Amount</div>
                                                        <div className="col-sm-7">
                                                                <input
                                                                        type="text"
                                                                        name="settlement_amount"
                                                                        className="form-control"
                                                                        onChange={(e) => this.handleChange(e)}
                                                                />
                                                        </div>
                                                </Row>
                                        </div>
                                )}
                                <div className="col-sm-12 text-center margin-top-20">
                                        <input
                                                type="button"
                                                class="btn btn-primary"
                                                value="Send"
                                                onClick={(e) => this.handleSubmit(e)}
                                        />
                                </div>
                        </Card>
                );
        }
        showLoading() {
                return <p>Loading...</p>;
        }
        showHeader() {
                // console.log("replyForm =======> ", this.state.replyForm);
                return (
                        <Row>
                                <Col>
                                        <h4>Ticket Details (Ticket ID: #{this.state.replyForm.ticket_id})</h4>
                                        <span
                                                className="font-16 block pointer margin-bottom-20"
                                                onClick={(e) => this.props.goBackToMyTickets(e)}
                                        >
                                                {" "}
                                                <FaArrowLeft /> Go Back{" "}
                                        </span>
                                </Col>
                        </Row>
                );
        }
        render() {
                let {
                        showHeader,
                        ticketDetail,
                        ticketReplyDetails,
                        replyForm,
                        loadingCon,
                } = "";
                if (!this.state.isLoaded) {
                        // console.log('this.props.isTicketDetailLoaded && !this.state.isLoaded =======> ', this.props.isTicketDetailLoaded ,this.state.isLoaded)
                        if (this.props.isTicketDetailLoaded) {
                                ticketDetail = this.getTicketDetails();
                                ticketReplyDetails = this.getTicketReplyDetails();
                                replyForm = this.addReplyForm();
                                showHeader = this.showHeader();
                                console.log("is Updated?");
                        } else {
                                loadingCon = this.showLoading();
                        }
                } else {
                        loadingCon = this.showLoading();
                }
                let dependentData = {};
                if (this.props.ticketSummaryDetails.dependentData) {
                        dependentData = this.props.ticketSummaryDetails.dependentData.rows;
                }

                console.log('DependentData', this.state.exportData);
                let inputFields = [];
                if (this.state.basicFields && this.state.basicFields.length > 0) {
                        inputFields = this.state.basicFields;
                }

                if (dependentData) {
                        for (var key in dependentData) {
                                inputFields.map((inputField, index) => {
                                        console.log('InputField', inputField.fieldName, dependentData[key]);
                                        if (inputField.fieldName.substring(1) === 'gender' && dependentData[key][inputField.fieldName.substring(1)]) {
                                                console.log('Change Gender', dependentData[key]);
                                                if (inputField.fieldName.substring(1) === 'gender') {
                                                        if (this.state.gender[dependentData[key][inputField.fieldName.substring(1)].toUpperCase()]) {
                                                                dependentData[key]['alias-' + inputField.fieldName] = this.state.gender[dependentData[key][inputField.fieldName.substring(1)].toUpperCase()];
                                                        }
                                                }
                                        }

                                        if (inputField.fieldType === 'date' && dependentData[key][inputField.fieldName]) {
                                                dependentData[key]['alias-' + inputField.fieldName] = dependentData[key][inputField.fieldName.substring(1)] ? moment(dependentData[key][inputField.fieldName.substring(1)]).format(config.DATE_FORMAT) : dependentData[key][inputField.fieldName] ? moment(dependentData[key][inputField.fieldName]).format(config.DATE_FORMAT) : '';
                                        }

                                        if (inputField.fieldName.substring(1) === 'nationality' && dependentData[key][inputField.fieldName.substring(1)]) {
                                                // console.log('Nationality Field Name', dependentData[key]);
                                                dependentData[key]['alias-' + inputField.fieldName] = this.props.nationality[dependentData[key][inputField.fieldName.substring(1)]];
                                        }

                                        if (inputField.fieldName === 'passportIssuingCountry' && dependentData[key][inputField.fieldName]) {
                                                // console.log('Nationality Field Name', dependentData[key]);
                                                dependentData[key]['alias-' + inputField.fieldName] = this.props.countries[dependentData[key][inputField.fieldName]];
                                        }
                                        if (inputField.fieldName === 'visaIssuingCountry' && dependentData[key][inputField.fieldName]) {
                                                // console.log('Nationality Field Name', dependentData[key]);
                                                dependentData[key]['alias-' + inputField.fieldName] = this.props.countries[dependentData[key][inputField.fieldName]];
                                        }

                                        if (inputField.fieldName === 'relationship' && dependentData[key][inputField.fieldName]) {
                                                // console.log('Nationality Field Name', dependentData[key]);
                                                dependentData[key]['alias-' + inputField.fieldName] = this.state.relationArr[dependentData[key][inputField.fieldName]];
                                        }

                                });
                        }

                        console.log('Data Item Render after Update', dependentData);
                }
                return (
                        <>
                                {this.props.ticketSummaryDetails.ticketDet[0].ticket_slug_name === 'ONBOARD' ? (
                                        <ExportReactCSV csvData={this.state.exportData} title="Export Dependents" fileName={this.state.fileName} />) : ''}
                                {showHeader}
                                {ticketDetail}
                                {(Object.keys(dependentData).length > 0) ? dependentData.map((data, key) => {
                                        return <div className="card d-block p-xl-3 p-2 mt-3 mb-3 shadow-sm">
                                                <div className="my-4" />
                                                <h6>Dependent {key + 1} Information</h6>

                                                <div className="row mt-4 pr-3">
                                                        <div className="col-lg-12">
                                                                <ul className="myinfoListing">
                                                                        {this.state.basicFields.map((inputField, index) => {

                                                                                return <li>
                                                                                        <label>{inputField.fieldTitle}</label>
                                                                                        <span>{data['alias-' + inputField.fieldName] ? data['alias-' + inputField.fieldName] : data[inputField.fieldName.substring(1)] ? data[inputField.fieldName.substring(1)] : data[inputField.fieldName]}</span>
                                                                                </li>
                                                                        })}

                                                                </ul>
                                                        </div>
                                                </div>
                                        </div>
                                }) : ''
                                }
                                {ticketReplyDetails}
                                {replyForm}
                                {loadingCon}
                                <Modal show={this.state.uploadshow} onHide={this.handleClose}>
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
                        </>
                );
        }
}

export default Details;

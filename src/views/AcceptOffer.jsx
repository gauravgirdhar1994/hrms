import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { Row, Col, Card, Table, Button, Modal, ProgressBar } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import config from '../config/config';
import axios from 'axios';
import Moment from 'moment';
import NumberFormat from 'react-number-format';
import UploadDocument from '../components/Documents/UploadDocument';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'
import DatePicker from "react-datepicker";
const BEARER_TOKEN = localStorage.getItem("userData");

class AcceptOffer extends Component {
        constructor(props) {
                super(props);
                this.state = {
                        acceptOffer: '',
                        getFields: false,
                        subDomain: '',
                        organizations: "",
                        organizationsCount: "",
                        show: false,
                        selectedFile: '',
                        selectedOfferFile: '',
                        letterUploaded: false,
                        empData: [],
                        reason: '',
                        Documents: [],
                        requiredDocuments: [],
                        value: '',
                        documentsNeeded: [],
                        AllDocuments: [],
                        selectedFile: '',
                        document: '',
                        percentage: 0,
                        invalidLink: true,
                        files: [],
                        uploadMsg: '',
                        documentImages: [],
                        currentDate: new Date(),
                        photoIndex: 0,
                        isOpen: false,
                        signedOfferLetter: false,
                        acceptUrl: '',
                        dependentCount: 1,
                        basicFields: [],
                        data: [],
                        visaSponsored: false,
                        dependentData: { 0: "" },
                        visaTypeArr: ['Tourist/Visit Visa', 'E-Visa for GCC Residents', 'Student Visa', 'Employment Visa'],
                        visa_type: [],
                        issuing_emirate: [],
                        emirateArr: ['Abu Dhabi', 'Ajman', 'Dubai', 'Fujairah', 'Ras Al Khaimah', 'Sharjah', 'Umm Al Quwain'],
                        relationshipArr: { 'S': "Spouse", "P": "Parent", "C": "Child" },
                        relationship: [],
                        genderArr: { 'M': 'Male', 'F': 'Female' },
                        dgender: [],
                        passportIssuingCountry: [],
                        visaIssuingCountry: [],
                        dnationality: [],
                        validateFields: [],
                        validations: []
                }
                this.openLightBox = this.openLightBox.bind(this);

                this.onDrop = (files) => {
                        console.log(files);
                        this.setState({ selectedFile: files }, () => {
                                this.onChangeHandler();
                        })
                };
        }

        checkMimeType = (event) => {
                //getting file object
                let files = this.state.selectedFile;
                //define message container
                let err = []
                // list allow mime type
                const types = ['image/png', 'image/jpeg', 'image/gif', 'application/pdf']
                // loop access array
                let pdfCount = 0;
                for (var x = 0; x < files.length; x++) {
                        console.log('Files', x);
                        // compare file type find doesn't matach
                        if (types.every(type => files[x].type !== type)) {
                                // create error message and assign to container   
                                err[x] = files[x].type + ' is not a supported format\n';
                        }
                        if (files[x].type === 'application/pdf') {
                                pdfCount++;
                                if (pdfCount > 1) {
                                        err[x] = 'Muliple PDFs cannot be uploaded';
                                }
                        }
                };
                for (var z = 0; z < err.length; z++) {// if message not same old that mean has error 
                        // discard selected file
                        console.log('File error', err[z]);
                        toast.error(err[z])
                        // event.target.value = null
                }
                if (err.length >= 1) {
                        return false;
                }
                return true;
        }

        addDependent = () => {
                let dependentCount = this.state.dependentCount + 1;
                this.setState({
                        dependentCount
                })
        }
        removeDependent = () => {
                let dependentCount = this.state.dependentCount - 1;
                this.setState({
                        dependentCount
                })
        }

        maxSelectFile = (event) => {
                let files = this.state.selectedFile;
                if (files.length > 3) {
                        const msg = 'Only 3 images can be uploaded at a time'
                        // event.target.value = null
                        toast.warn(msg)
                        return false;
                }
                return true;
        }

        checkFileSize = (event) => {
                let files = this.state.selectedFile;
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
                        // event.target.value = null
                }
                return true;
        }

        onChangeHandler = event => {
                let files = this.state.selectedFile;
                // console.log('File Upload',this.checkMimeType(event));
                if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkFileSize(event)) {
                        // if return true allow to setState
                        this.setState({
                                selectedFile: files,
                                loaded: 0
                        }, () => {
                                this.onClickHandler();
                        })
                }
        }

        filterArrayElementByEdit(array, value) {
                return array.filter((element) => {
                        return element.id === value;
                })
        }

        openLightBox = (id) => {
                let documentImages = this.filterArrayElementByEdit(this.state.Documents, id)[0].documentPath;
                let lightboxImages = [];
                for (var key in documentImages) {
                        let imageData = {};
                        lightboxImages.push(config.BASE_URL + documentImages[key]);
                        console.log('lightboxImages', lightboxImages);
                        if (key == documentImages.length - 1) {
                                this.setState({
                                        documentImages: lightboxImages,
                                        isOpen: true
                                })
                        }
                }
                console.log('lightBox images', documentImages);
        }

        onClickHandler = () => {
                console.log('Document TYpe', this.refs.document.value);
                const data = new FormData()
                for (var x = 0; x < this.state.selectedFile.length; x++) {
                        console.log(this.state.selectedFile[x])
                        data.append('file', this.state.selectedFile[x])
                        console.log(data);
                }
                data.append('orgId', this.state.organizations.id)
                data.append('hrmUpload', false);
                data.append('offerPage', true);
                const search = this.props.location.search;
                const params = new URLSearchParams(search);
                data.append('employeeId', params.get('id'));

                data.append('documentType', this.refs.document.value)
                const apiUrl = config.API_URL + '/employee/document/add';


                const options = {
                        onUploadProgress: (ProgressEvent) => {
                                const { loaded, total } = ProgressEvent;
                                let percent = Math.floor(loaded * 100 / total);
                                this.state.uploadMsg = `${loaded} kb of ${total}kb | ${percent}% `;
                                console.log(`${loaded} kb of ${total}kb | ${percent}% `);

                                if (percent < 100) {
                                        this.setState({ percentage: percent })
                                }
                        }
                }

                axios.post(apiUrl, data, options)
                        .then(res => {
                                this.setState({ percentage: 100 }, () => {
                                        setTimeout(() => {
                                                // this.refreshData();
                                                this.setState({ show: false, selectedFile: null, percentage: 0, uploadMsg: '', currentEmployeeId: res.data.employeeId });
                                                if (this.state.currentEmployeeId) {
                                                        this.refreshData();
                                                }
                                        }, 1000)
                                })

                                toast.success(res.data.message);
                                setTimeout(function () {
                                        toast.dismiss()
                                }, 2000)
                        })
        }

        viewDocument = (cell, row) => {
                return (
                        <button type="button" className="btn btn-sm btn-outline-danger ml-2">View Document</button>
                )
        }
        download = (cell, row) => {
                return (
                        <button type="button" className="btn btn-sm btn-outline-danger ml-2">Download</button>
                )
        }
        uploadAgain = (id) => {
                console.log('Upload Again id', id)
                // console.log('State Data', this.state.data);
                const search = this.props.location.search;
                const params = new URLSearchParams(search);
                const documentsUrl = config.API_URL + '/employee/documents/view/' + params.get('id');
                axios.get(documentsUrl)
                        .then(r => {
                                this.setState({ AllDocuments: r.data.Documents, selectedDocument: id, show: true })
                        })
                        .catch((error) => {
                                console.log("API ERR: ", error);
                                console.error(error);
                                // res.json({ error: error });
                        });
        }

        checkBox = (event) => {
                console.log('Checkbox clicked', event.target.value);
                this.setState({
                        documentsNeeded: [...this.state.documentsNeeded, event.target.value]
                });
        }

        updateDocumentsNeeded = () => {
                const datas = {};
                datas.documentsNeeded = this.state.documentsNeeded;

                const apiUrl = config.API_URL + '/employee/onboarding/edit/' + this.props.id + "?tab=1";

                var bearer = 'Bearer ' + this.state.token;

                const headers = {
                        "Authorization": bearer,
                        "Content-Type": "application/json"
                }

                axios.post(apiUrl, datas, { headers: headers })
                        .then(res => {
                                if (res.status == 200) {
                                        toast.success(res.data.message);
                                        setTimeout(function () {
                                                toast.dismiss()
                                        }, 2000)
                                        this.setState({ redirect: true })
                                }
                                else {
                                        toast.error(res.data.message);
                                        setTimeout(function () {
                                                toast.dismiss()
                                        }, 2000)
                                }
                                // console.log('POST response',res);
                        })
        }

        checkDocumentType = (row, type) => {
                // console.log('Document Type', row.documentPath.length)
                if (row.documentType === type) {
                        // console.log('Document Row', row)
                        return <tr><td>{row.documentName}{this.state.requiredDocuments.includes(row.id) ? <span className="requiredDocument">*</span> : ''}</td><td className={row.status === 'Uploaded' ? 'text-success' : 'text-danger'}>{row.status}</td><td>{row.uploadedOn !== '-' ? Moment(row.uploadedOn).format(config.DATE_FORMAT) : '-'}</td><td><span>{row.status === 'Uploaded' ? (row.documentPath.length > 1 ? <a onClick={() => this.openLightBox(row.id)} className="btn btn-sm btn-outline-danger mr-15">View Document</a> : <a href={config.BASE_URL + row.documentPath} target="_blank" className="btn btn-sm btn-outline-danger mr-15">View Document</a>) : ''}</span><span><button type="button" className="btn btn-sm btn-outline-danger mr-15" onClick={() => this.uploadAgain(row.id)}>{row.status === 'Uploaded' ? 'Upload Again' : 'Upload'} </button> </span></td></tr>;
                }
                else {
                        return '';
                }
        }

        getOrganizationData = () => {
                axios.get(config.API_URL + '/organizations/list?domain=' + this.state.subDomain)
                        .then(r => {
                                this.setState({
                                        organizations: r.data.organizations.rows[0],
                                        organizationsCount: r.data.organizations.count,

                                })
                        })
                        .catch((error) => {
                                console.log("API ERR:", error);
                                console.error(error);
                                // res.json({ error: error });
                        })
        }

        componentDidMount() {
                let host = window.location.host;
                let protocol = window.location.protocol;
                let parts = host.split(".");
                let subdomain = "";
                let partsLength = "";
                // If we get more than 3 parts, then we have a subdomain
                // INFO: This could be 4, if you have a co.uk TLD or something like that.
                if (parts[0] === 'localhost' || parts[1] === 'localhost') {
                        partsLength = 3;
                }
                if (parts[0] === config.DEFAULT_DOMAIN || parts[1] === config.DEFAULT_DOMAIN) {
                        partsLength = 4;
                }
                console.log(parts);
                if (parts.length >= partsLength) {
                        subdomain = parts[0];
                        // Remove the subdomain from the parts list
                        parts.splice(0, 1);

                        this.setState({ subDomain: subdomain });
                }
                else {
                        subdomain = config.DEFAULT_DOMAIN;

                        this.setState({ subDomain: subdomain, organizations: { id: 0, orgImage: config.VOW_FIRST_LOGO } });

                }
                const search = this.props.location.search;
                const params = new URLSearchParams(search);
                // const authority = params.get('authority'); //
                let acceptOffer = params.get('accept');
                if (acceptOffer === 'yes') {
                        this.setState({
                                acceptOffer: true,
                                acceptUrl: true
                        })
                }
                if (acceptOffer === 'no') {
                        this.setState({
                                acceptOffer: false,
                                acceptUrl: false
                        })
                }

                const apiUrl = config.API_URL + '/employee/onboarding/offerLetterStatus';

                var bearer = 'Bearer ' + this.state.token;

                const headers = {
                        "Authorization": bearer,
                        "Content-Type": "application/json"
                }
                const datas = {};
                datas.empId = params.get('id');
                datas.offerLetterStatus = params.get('accept');

                axios.post(apiUrl, datas, { headers: headers })
                        .then(res => {
                                console.log('POST response', res);
                                if (res.data.success && res.data.statusCheck) {
                                        this.setState({ empData: res.data.empData, signedOfferLetter: res.data.signedLetter, acceptOffer: res.data.acceptOffer, visaSponsored: res.data.statusCheck.visaSponsored })
                                }
                        })
                this.refreshData();

                var bearer = 'Bearer ' + BEARER_TOKEN;
                axios.get(config.API_URL + '/dependent-fields?page=accept')
                        .then(r => {
                                if (r.status == 200) {
                                        console.log('fieldList', r.data.fieldList);
                                        let validateFields = [];
                                        this.setState({ basicFields: r.data.fieldList }, () => {
                                                this.state.basicFields.map((inputField, index) => {

                                                        validateFields[inputField.fieldName] = inputField.fieldTitle;
                                                        this.setState({
                                                                validateFields
                                                        })
                                                })
                                        });
                                }
                        })
                        .catch((error) => {
                                console.log("API ERR: ");
                                console.error(error);
                        });

                this.getGender();
                this.getCountries();
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
                                        this.setState({ country: arrCountry, passportIssuingCountry: arrCountry, visaIssuingCountry: arrCountry, dnationality: arrNationality, countryIds: r.data.idsArr, nationalityIds: r.data.idsArr });
                                }
                        }).catch((error) => {
                                console.log("API ERR: ");
                                console.error(error);
                                // res.json({ error: error });
                        });
        }

        getGender() {
                var arrTen = [];
                var arrVisa = [];
                var arrVisaEmirates = [];
                var arrRelationship = [];

                Object.keys(this.state.genderArr).map((obj_index, arr_index) => {
                        //console.log('gender',obj_index,arr_index)
                        arrTen.push(<option key={arr_index} value={obj_index}> {this.state.genderArr[obj_index]} </option>);
                })

                Object.keys(this.state.visaTypeArr).map((visa_index, visa_arr_index) => {
                        console.log('visa type', visa_index, visa_index);
                        arrVisa.push(<option key={visa_arr_index} value={this.state.visaTypeArr[visa_index]}>{this.state.visaTypeArr[visa_index]}</option>)
                })

                Object.keys(this.state.emirateArr).map((visa_index, visa_arr_index) => {
                        // console.log('visa type', visa_index, visa_index);
                        arrVisaEmirates.push(<option key={visa_arr_index} value={this.state.emirateArr[visa_index]}>{this.state.emirateArr[visa_index]}</option>)
                })
                Object.keys(this.state.relationshipArr).map((visa_index, visa_arr_index) => {
                        // console.log('visa type', visa_index, visa_index);
                        arrRelationship.push(<option key={visa_arr_index} value={visa_index}>{this.state.relationshipArr[visa_index]}</option>)
                })

                //console.log('gender',arrTen);
                this.setState({ gender_option: arrTen, dgender: arrTen, visa_type: arrVisa, issuing_emirate: arrVisaEmirates, relationship: arrRelationship, getFields: true });
        }

        refreshData() {
                var bearer = 'Bearer ' + this.state.token;
                let apiUrl = '';
                const search = this.props.location.search;
                const params = new URLSearchParams(search);
                const urlToken = 'sdfsdfsdfuwewksd';
                apiUrl = config.API_URL + '/employee/onboarding/uploaderDocuments/' + urlToken + '?offer=true&empId=' + params.get('id');

                axios.get(apiUrl)
                        .then(r => {
                                if (r.data.success) {
                                        this.setState({ invalidLink: false, Documents: r.data.onboardingData.Documents, requiredDocuments: r.data.onboardingData.requiredDocuments })
                                }
                        })
                        .catch((error) => {
                                console.log("API ERR: ", error);
                                console.error(error);
                                // res.json({ error: error });
                        });
        }

        addDefaultSrc(ev) {
                ev.target.src = config.DEFAULT_ORG_IMG_URL
        }

        uploadOfferLetter = () => {
                this.setState({ offershow: true })
        }

        handleClose = () => {
                this.setState({ show: false })
        }
        handleofferClose = () => {
                this.setState({ offershow: false })
        }

        handleChange = (event) => {
                this.setState({ reason: event.target.value })
        }

        submitReason = () => {
                const search = this.props.location.search;
                const params = new URLSearchParams(search);
                let data = {};
                data.empId = params.get('id');

                var bearer = '';

                const headers = {
                        "Authorization": bearer
                };

                data.reason = this.state.reason;

                axios.post(config.API_URL + "/upload/offerLetter/" + data.empId + "?type=reason", data, { headers: headers }).then(res => {
                        // console.log('POST response', res);
                        if (res.data.success) {
                                // this.refreshData();
                                toast.success(res.data.message);
                                setTimeout(function () {
                                        toast.dismiss()
                                }, 2000)
                                this.setState({ show: false, letterUploaded: true })
                        }
                        else {
                                this.refreshData();
                                toast.error(res.data.message);
                                setTimeout(function () {
                                        toast.dismiss()
                                }, 2000)
                                // this.setState({ errorFilePath: res.data.filePath })
                        }

                });

        }


        uploadFile = (event) => {
                const search = this.props.location.search;
                const params = new URLSearchParams(search);
                let data = {};
                data.empId = params.get('id');

                var bearer = '';

                const headers = {
                        "Authorization": bearer
                };

                this.state.selectedOfferFile = event.target.files[0];
                // Details of the uploaded file 
                // console.log('Selected file', this.state.selectedFile);

                const formData = new FormData();

                // Update the formData object 
                formData.append(
                        'file',
                        this.state.selectedOfferFile
                );

                formData.append('empId', data.empId);
                // Request made to the backend api 
                // Send formData object 
                axios.post(config.API_URL + "/upload/offerLetter/" + data.empId + "?type=signed", formData, { headers: headers }).then(res => {
                        // console.log('POST response', res);
                        if (res.data.success) {
                                // this.refreshData();
                                toast.success(res.data.message);
                                setTimeout(function () {
                                        toast.dismiss()
                                }, 2000)
                                this.setState({ offershow: false, letterUploaded: true })
                        }
                        else {
                                this.refreshData();
                                toast.error(res.data.message);
                                setTimeout(function () {
                                        toast.dismiss()
                                }, 2000)
                                // this.setState({ errorFilePath: res.data.filePath })
                        }
                });
        }

        dateChange = (name, key, date) => {
                // console.log('Dependent Data', name, date, key);
                let dependentData = this.state.dependentData;
                let currentDependentData = {};
                if (dependentData[key]) {
                        currentDependentData = dependentData[key];
                }
                else {
                        currentDependentData = {};
                }

                currentDependentData[name] = date ? date : '';

                dependentData[key] = currentDependentData;

                this.setState({
                        dependentData
                })
        }

        handleDependentChange = (e, key) => {

                let dependentData = this.state.dependentData;
                let currentDependentData = {};
                if (dependentData[key]) {
                        currentDependentData = dependentData[key];
                }
                else {
                        currentDependentData = {};
                }

                currentDependentData[e.target.name] = e.target.value;

                dependentData[key] = currentDependentData;

                let validations = this.state.validations;
                if (validations[key]) {
                        validations[key][e.target.name] = "";
                }


                this.setState({
                        dependentData,
                        validations

                })
        }

        createFields = (inputField, key) => {

                // let inputField = basicFields[fieldKey];

                if (inputField.fieldType === 'text') {

                        return (
                                <div className="form-group">
                                        <label>{inputField.fieldTitle}</label>
                                        <input type="text" name={inputField.fieldName} onChange={(e) => this.handleDependentChange(e, key)} className="ml-2 form-control" placeholder={inputField.fieldTitle} />
                                        <div class="errMsg">{this.state.validations[key] && this.state.validations[key][inputField.fieldName] ? 'Please enter the ' + this.state.validations[key][inputField.fieldName] : ''}</div>
                                </div>
                        );
                }

                if (inputField.fieldType === 'select') {
                        // console.log('Fields State', this.state[inputField.fieldName], );
                        return (
                                <div className="form-group">
                                        <label>{inputField.fieldTitle}</label>
                                        <select className="form-control" name={inputField.fieldName} onChange={(e) => this.handleDependentChange(e, key)}>
                                                <option>Select</option>
                                                {this.state[inputField.fieldName]}
                                        </select>
                                        <div class="errMsg">{this.state.validations[key] && this.state.validations[key][inputField.fieldName] ? 'Please select the ' + this.state.validations[key][inputField.fieldName] : ''}</div>
                                </div>
                        );
                }

                if (inputField.fieldType === 'date') {
                        var dateVal = this.state.dependentData[key] && this.state.dependentData[key][inputField.fieldName] !== undefined ? new Date(this.state.dependentData[key][inputField.fieldName]) : '';
                        var dateSel = this.state.dependentData[key] && this.state.dependentData[key][inputField.fieldName] !== undefined ? new Date(this.state.dependentData[key][inputField.fieldName]) : '';
                        // console.log('Selected Date', this.state.dependentData[key] ? this.state.dependentData[key][inputField.fieldName] : '' );
                        return (
                                <div className="form-group">
                                        <label>{inputField.fieldTitle}</label>
                                        <DatePicker autoComplete="off" showYearDropdown dateFormat={config.DP_INPUT_DATE_FORMAT} dropdownMode="scroll" className={"form-control"} onChange={this.dateChange.bind(this, inputField.fieldName, key)} selected={dateSel} value={dateVal} name={inputField.fieldName} id={inputField.fieldName} />
                                        <div class="errMsg">{this.state.validations[key] && this.state.validations[key][inputField.fieldName] ? 'Please enter the ' + this.state.validations[key][inputField.fieldName] : ''}</div>
                                </div>
                        );
                }

                if (inputField.fieldType === 'number-format') {
                        return (
                                <div className="form-group">
                                        <label>{inputField.fieldTitle}</label>
                                        <NumberFormat format="###-####-#######-#" className={"form-control"} id={inputField.fieldName} name={inputField.fieldName} onValueChange={(values) => {
                                                const { formattedValue, value } = values;
                                                this.setState({
                                                        form: {
                                                                ...this.state.form, [inputField.fieldName]: formattedValue
                                                        }
                                                })
                                                let event = {
                                                        target: {
                                                                name: inputField.fieldName,
                                                                value: formattedValue
                                                        }
                                                };
                                                this.handleDependentChange(event, key)
                                        }} />
                                        <div class="errMsg">{this.state.validations[key] && this.state.validations[key][inputField.fieldName] ? 'Please enter the ' + this.state.validations[key][inputField.fieldName] : ''}</div>
                                </div>)
                }


        }


        submitDependent = () => {
                const search = this.props.location.search;
                const params = new URLSearchParams(search);



                let datas = {};
                datas.dependentData = this.state.dependentData;
                console.log('Submit Dependent Data', this.state.dependentData, datas);

                datas.orgId = this.state.organizations.id;
                datas.empId = params.get('id');
                const headers = {
                        "Content-Type": "application/json"
                }
                if (this.validateForm()) {
                        if (datas.dependentData) {
                                axios.post(config.API_URL + "/submit-dependent", datas, { headers: headers }).then(res => {
                                        // console.log('POST response', res);
                                        if (res.data.success) {
                                                // this.refreshData();
                                                toast.success(res.data.message);
                                                setTimeout(function () {
                                                        toast.dismiss()
                                                }, 2000)
                                                this.setState({ dependentCount: 0 })
                                        }
                                        else {
                                                this.refreshData();
                                                toast.error(res.data.message);
                                                setTimeout(function () {
                                                        toast.dismiss()
                                                }, 2000)
                                                // this.setState({ errorFilePath: res.data.filePath })
                                        }
                                });
                        }
                }


        }

        validateForm() {
                let fields = this.state.validateFields;
                let validations = {};
                let isFormValid = true;
                if (fields) {
                        console.log('Payroll Fields', fields, this.state.dependentData);

                        for (var count = 0; count < this.state.dependentCount; count++) {
                                if (!this.state.dependentData[count]) {
                                        this.state.dependentData[count] = "";
                                }
                                validations[count] = {};
                                for (var key in fields) {
                                        if (
                                                this.state.dependentData[count][key] == "" ||
                                                typeof this.state.dependentData[count][key] == "undefined"
                                        ) {
                                                validations[count][key] = fields[key];
                                                isFormValid = false;
                                        }
                                        console.log('validations ============> ', validations);
                                        this.setState({ validations: validations });

                                }
                        }
                        return isFormValid;
                }
        }



        render() {

                if (this.state.subDomain && !this.state.organizations) {
                        console.log("SubDomain", this.state.subDomain);
                        this.getOrganizationData();
                }

                if (this.state.validations) {
                        console.log('Dependent Data visa sponsored', this.state.visaSponsored);
                }

                let otherRows = {};
                let mandatoryRows = {};
                if (this.state.Documents) {
                        mandatoryRows = this.state.Documents.map(row => this.checkDocumentType(row, 1));
                        otherRows = this.state.Documents.map(row => this.checkDocumentType(row, 2));
                }
                let files = [];
                if (this.state.selectedFile) {
                        files = this.state.selectedFile.map(file => (
                                <li key={file.name}>
                                        {file.name} - {file.size} bytes
                                </li>
                        ));
                }
                const uploadPercent = this.state.percentage;
                const { photoIndex, isOpen } = this.state;
                const images = this.state.documentImages;
                // console.log('Upload Percentage', this.state.signedOfferLetter)

                const basicFields = this.state.basicFields;
                // console.log('Basic Fields', basicFields);
                return (
                        <React.Fragment>
                                <ToastContainer></ToastContainer>
                                {this.state.acceptOffer && this.state.acceptUrl ? (
                                        <>
                                                <div className="container text-center">
                                                        <img src={this.state.organizations ? config.BASE_URL + this.state.organizations.logo : ''} onError={this.addDefaultSrc} width="120" styles={{ padding: '30px' }} className="img-fluid"></img>
                                                </div>


                                                <div className="container-fluid py-4 text-center bg-blue mb-3">
                                                        <h4 className="font-weight-bold mb-0 font-22 pl-3"><strong>Welcome Onboard!</strong></h4>
                                                </div>

                                                <div className="card container topFilter d-block pl-4 pr-4 pt-3 pb-3 py-4 br-3 mb-4 mt-4 text-center shadow-sm">
                                                        <p className="font-16 fw-400 text-left">Hi {this.state.empData.firstname} {this.state.empData.lastname},</p>

                                                        {!this.state.letterUploaded && !this.state.signedOfferLetter ? (<><p className="font-16 fw-400 text-left">Thanks for accepting the offer letter! Please upload the signed offer letter.</p><button className="btn btn-primary btn-md mt-3 font-16 fw-400 text-white" onClick={this.uploadOfferLetter}>Upload signed Offer Letter</button></>) : <><p className="font-16 fw-600 font-weight-bold mt-3">Thank You.</p><p className="font-16 fw-400 mt-3">The Signed Offer letter has been uploaded successfully.</p><p className="font-16 fw-400 mt-3">Please upload the below documents to process your onboarding further.</p></>}
                                                </div>
                                                <div className="card container topFilter d-block pl-4 pr-4 pt-3 pb-3 py-4 br-3 mb-4 mt-4 shadow-sm">
                                                        <p>
                                                                Please upload the following documents to proceed with the onboarding process.
                                                        </p>
                                                        <h3 className="py-4 text-center">Upload documents</h3>
                                                        {this.state.Documents ? (
                                                                <table className="table table-striped table-bordered">
                                                                        <thead style={{ background: "#f0f8ff" }}>
                                                                                <tr>
                                                                                        {/* <td></td> */}
                                                                                        <td>Document Type</td>
                                                                                        <td>Status</td>
                                                                                        <td>Uploaded On</td>
                                                                                        <td>Actions</td>
                                                                                </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                                {mandatoryRows}
                                                                                {otherRows}
                                                                        </tbody>
                                                                </table>
                                                        ) : ''}
                                                </div>

                                        </>
                                ) : (
                                        <>
                                                <div className="">
                                                        <img src={this.state.organizations ? config.BASE_URL + this.state.organizations.logo : ''} onError={this.addDefaultSrc} width="120" styles={{ padding: '30px' }} className="img-fluid"></img>
                                                </div>


                                                <div className="container-fluid py-4 text-center bg-blue mb-3">
                                                        <h4 className="font-weight-bold mb-0 font-22 pl-3"><strong>Offer Letter Rejected</strong></h4>
                                                </div>

                                                <div className="card container topFilter d-block pl-4 pr-4 pt-3 pb-3 py-4 br-3 mb-4 mt-4 text-center shadow-sm">
                                                        {this.state.signedOfferLetter ? (
                                                                <>
                                                                        {this.state.empData.firstname ? (<p className="font-16 fw-400 text-left">Hi {this.state.empData.firstname} {this.state.empData.lastname},</p>) : ''}


                                                                        <p className="font-16 fw-400 text-left">You have already accepted the role of {this.state.empData.position} offered to you by {this.state.organizations.orgName} .</p>
                                                                </>
                                                        ) : !this.state.letterUploaded ? (
                                                                <>
                                                                        <p className="font-16 fw-400 text-left">Hi {this.state.empData.firstname} {this.state.empData.lastname},</p>

                                                                        <p className="font-16 fw-400 text-left">You have rejected the role of {this.state.empData.position} offered to you by {this.state.organizations.orgName} . Please provide a reason below for the same. </p>

                                                                        <textarea className="form-control" onChange={this.handleChange} placeholder="Enter the reason" name="reason" rows="5">
                                                                        </textarea>
                                                                        <button type="submit" className="btn btn-primary btn-md text-center mt-3 mb-3 t-3 font-16 fw-400 text-white" onClick={this.submitReason}>Submit</button>
                                                                </>
                                                        ) : <p className="font-16 fw-400 font-weight-bold mt-3">Thank You. Your response has been submitted successfully.</p>}

                                                </div>
                                        </>
                                )}


                                {this.state.visaSponsored && this.state.getFields ? (
                                        Array.from({ length: this.state.dependentCount }, (value, key) => {
                                                return <div className="card container topFilter d-block pl-4 pr-4 pt-3 pb-3 py-4 br-3 mb-4 mt-4  shadow-sm">
                                                        <p>Additionally, please fill in the dependent information also.</p>
                                                        <div className="row ml-0 mr-0 p-10 float-right">
                                                                {key === 0 ? (<button className="btn btn-primary" onClick={this.addDependent}>Add new Dependent</button>) : (<button className="btn btn-danger" onClick={this.removeDependent}>Remove Dependent</button>)}
                                                        </div>
                                                        <h3>Dependent Information</h3>
                                                        <div className="row dependentBlock">
                                                                {

                                                                        basicFields.map((inputField, index) => {
                                                                                return this.createFields(inputField, key);
                                                                        })
                                                                }
                                                        </div>


                                                </div>
                                        })
                                ) : ''}
                                {this.state.dependentCount !== 0 ? (
                                        <div className="col-md-12 mt-2 mb-2 text-center">
                                                <button onClick={() => this.submitDependent()} className="btn btn-primary">Submit</button>
                                        </div>
                                ) : ''}


                                <Modal show={this.state.offershow} onHide={this.handleofferClose}>
                                        <Modal.Header closeButton>
                                                <Modal.Title>Select File to Upload</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body className="text-center">
                                                {/* <label>Upload CSV File</label> */}
                                                <span className="text-center">
                                                        <label htmlFor="uploadId" className="squireUpload">
                                                                <small className="font-12">Upload Signed Offer Letter</small>
                                                                <input type="file" ref="file" name="logo" id="uploadId" onChange={this.uploadFile} />
                                                        </label>
                                                </span>
                                        </Modal.Body>
                                </Modal>

                                <Modal show={this.state.show} onHide={this.handleClose}>
                                        <Modal.Header closeButton>
                                                <Modal.Title>Add Document</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>

                                                <label htmlFor="Location" className="mb-0">Select Document Type *</label>
                                                <div className="row mb-1">
                                                        <div className="col-lg-12">
                                                                <select className="form-control custom-select" id="documentId" ref="document" defaultValue={this.props.selectedDocument} disabled={this.state.selectedDocument ? 'disabled' : ''} onChange={this.handleChange}>
                                                                        <option selected disabled>Select Document</option>
                                                                        {this.state.AllDocuments.map(datas => (
                                                                                <option key={datas.id} value={datas.id} selected={this.state.selectedDocument === datas.id ? 'selected' : ''}>{datas.documentName}</option>
                                                                        ))}
                                                                </select>
                                                        </div>
                                                </div>
                                                <label htmlFor="Location" className="mb-2">Upload *</label>
                                                <div style={{ height: "100px", border: "1px solid #ed0f7e" }}>

                                                        <Dropzone onDrop={this.onDrop}>
                                                                {({ getRootProps, getInputProps }) => (
                                                                        <section className="text-center h-100">
                                                                                <div {...getRootProps({ className: 'dropzone h-100' })}>
                                                                                        <input {...getInputProps()} />
                                                                                        <p><a href="javascript:void(0)" className="btn btn-xs btn-upload">Upload</a> Or drag the files here</p>
                                                                                </div>
                                                                                <aside>
                                                                                        {/* <h4>Files</h4> */}
                                                                                        {this.state.uploadMsg}
                                                                                        {/* <ul>{}</ul> */}
                                                                                </aside>
                                                                        </section>
                                                                )}
                                                        </Dropzone>

                                                        <div className="form-group">
                                                                <ToastContainer />
                                                                {uploadPercent > 0 && <ProgressBar now={uploadPercent} active label={`${uploadPercent}%`}></ProgressBar>}
                                                        </div>

                                                        {/* <button type="button" className="btn btn-primary btn-block" onClick={this.onClickHandler}>Upload</button> */}
                                                </div>
                                                <label htmlFor="Location" className="mb-2 mt-2 text-right">File type - JPG, PNG, PDF and Max size 5 MB only</label>
                                        </Modal.Body>
                                        <Modal.Footer>
                                                <Button variant="secondary" onClick={this.handleClose}>
                                                        Close
                                                </Button>
                                                <Button variant="primary" onClick={this.handleClose}>
                                                        Save Changes
                                                </Button>
                                        </Modal.Footer>
                                </Modal>

                                {
                                        isOpen && (
                                                <Lightbox
                                                        mainSrc={images[photoIndex]}
                                                        nextSrc={images[(photoIndex + 1) % images.length]}
                                                        prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                                                        onCloseRequest={() => this.setState({ isOpen: false })}
                                                        onMovePrevRequest={() =>
                                                                this.setState({
                                                                        photoIndex: (photoIndex + images.length - 1) % images.length,
                                                                })
                                                        }
                                                        onMoveNextRequest={() =>
                                                                this.setState({
                                                                        photoIndex: (photoIndex + 1) % images.length,
                                                                })
                                                        }
                                                />
                                        )
                                }
                        </React.Fragment >
                )
        }
}

export default AcceptOffer;
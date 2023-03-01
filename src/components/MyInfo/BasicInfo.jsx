import React, { Component } from 'react';
// import userDetail from '../../services/userDetail'
import { connect } from "react-redux";
import { fetchData } from "../../action/fetchData";
import { editData } from "../../action/editData";
import FormComponent from "../MyInfo/FormComponent";

import { Modal, Form, Button } from "react-bootstrap"
import { ToastContainer, toast } from 'react-toastify';
import config from '../../config/config';
// const TICKET_API_URL = config.API_URL + "/ticket/add";

import 'react-toastify/dist/ReactToastify.css';
import loader from '../../loader.gif';
import axios from 'axios';
import Moment from 'moment';
import DatePicker from "react-datepicker";
import DataLoading from '../Loaders/DataLoading';
const BEARER_TOKEN = localStorage.getItem("userData");

class BasicInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: true,
            data: [],
            item: [],
            form: [],
            response: "",
            gender : {"M" : "Male", "F" : "Female"},
            genderD: config.GENDER,
            arrNationality1: [],
            bloodGroup: [],
            arrBloodGroup: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
            marital_status:['Married', 'Single', 'Divorced', 'Separated'],
            maritalStatus : [],
            arrCountry1: [],
            country: '',
            nationality: '',
            imgSrc: '',
            basicFields: '',
            selectedFile: '',
            updateFormData: true,
            formData: {},
            bloodGroup: config.blood_group,
            bloodGroupOpt: '',
            token: localStorage.getItem("userData"),
            editPermission: false,
            viewPermission: false
        }
        // console.log(30,itemProps)
        this.handleChange = this.handleChange.bind(this);
        this.onChange = this.onChange.bind(this);

    }

    componentDidMount() {
        this.refreshData();
        var bearer = 'Bearer ' + BEARER_TOKEN;
        var arrBloodGroup = [];
        axios.get(config.API_URL + '/field-access-list?menuId=3', { headers: { Authorization: bearer } })
            .then(r => {
                if (r.status == 200) {
                    console.log('fieldList', r.data.fieldList);
                    this.setState({ basicFields: r.data.fieldList });
                    r.data.fieldList.map((inputField, index) => {
                        if(inputField.view === 1){
                            this.setState({
                                viewPermission: true
                            })
                        }
                        if((inputField.update === 1 || inputField.updateApproval === 1) && inputField.view === 1){
                            this.setState({
                                editPermission: true
                            })
                        }
                    })
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
            });

        axios.get(config.API_URL + '/common/countries', { headers: { Authorization: bearer } })
            .then(r => {

                if (r.status == 200) {
                    var arrCountry = [];
                    var arrCountry1 = [];
                    var arrNationality = [];
                    var arrNationality1 = [];
                    var arrGender = [];
                    var arrBloodGroups = [];
                    var arrMaritalStatus = [];


                    for (var k = 0; k < r.data.Countries.length; k++) {
                        arrCountry.push(<option key={r.data.Countries[k].id} value={r.data.Countries[k].id}> {r.data.Countries[k].country} </option>);
                        arrNationality.push(<option key={r.data.Countries[k].id} value={r.data.Countries[k].id}> {r.data.Countries[k].nationality} </option>);
                        arrCountry1[r.data.Countries[k].country] = r.data.Countries[k].id;
                        arrNationality1[r.data.Countries[k].nationality] = r.data.Countries[k].id;
                    }

                    Object.keys(this.state.gender).map((obj_index, arr_index) => {
                        //console.log('gender',obj_index,arr_index)
                        arrGender.push(<option key={arr_index} value={obj_index}> {this.state.gender[obj_index]} </option>);
                    })

                    
                    this.state.arrBloodGroup.map((obj_index, arr_index) => {
                        console.log('blood group', obj_index, arr_index)
                        arrBloodGroups.push(<option key={arr_index} value={obj_index}> {obj_index} </option>);
                    })
                    this.state.marital_status.map((obj_index, arr_index) => {
                        // console.log('blood group', obj_index, arr_index)
                        arrMaritalStatus.push(<option key={arr_index} value={obj_index}> {obj_index} </option>);
                    })

                    this.setState({ Countries: arrCountry, nationality: arrNationality, gender: arrGender, arrCountry1: arrCountry1, arrNationality1: arrNationality1, bloodGroup: arrBloodGroups, maritalStatus : arrMaritalStatus });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
        this.state.bloodGroup.map((value, index) => {
            //console.log('gender',obj_index,arr_index)
            arrBloodGroup.push(<option key={index} value={value}> {value} </option>);
        })
        this.setState({ bloodGroupOpt: arrBloodGroup });




    }

    componentDidUpdate(prevProps, prevState) {
        // console.log('Back to update state',this.state);
        // console.log('Back to update props',this.props);
        // console.log('Back to updated prev props',prevProps,prevState);
    }

    refreshData() {
        let empId = '';
        if (this.props.editId) {
            empId = this.props.editId;
        }
        else {
            empId = localStorage.getItem("employeeId")
        }
        const apiUrl = config.API_URL + '/employee/view/' + empId;
        //console.log('Employee data url', apiUrl)
        var bearer = 'Bearer ' + localStorage.getItem("userData");
        axios.get(apiUrl, { headers: { Authorization: bearer } })
            .then((r) => {
                console.log("Api result", r);
                this.setState({ item: r.data });
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({
            form: {
                ...this.state.form, [name]: value
            }
        })
        // if (name === 'nationality') {
        //     this.setState({
        //         form: {
        //             ...this.state.form, ['nationali']: value
        //         }
        //     })
        // }
        // if (name === 'country') {
        //     this.setState({
        //         form: {
        //             ...this.state.form, ['nationality']: value
        //         }
        //     })
        // }
    }

    onChange = (name, date) => {
        // console.log('Change BirthDate', date)
        this.setState({
            form: {
                ...this.state.form, [name]: date
            }
        })
        //console.log('Change BirthDate', this.state.form)
    }

    handleSubmit = (event) => {
        // console.log('Form Data',this.state.form);
        let datas = this.state.form;
        console.log('Form Data',datas);
        // datas.birthDate = this.state.birthDate;
        event.preventDefault();
        let empId = '';
        if (this.props.editId) {
            empId = this.props.editId;
        }
        else {
            empId = localStorage.getItem("employeeId")
        }

        const apiUrl = config.API_URL + '/employee/edit/personal/' + empId;
        var bearer = 'Bearer ' + this.state.token;
        if (Object.keys(datas).length >= 1) {
        // datas.empId = empId;
            var bearer = 'Bearer ' + this.state.token;
            const headers = {
                "Authorization": bearer,
                "Content-Type": "application/json"
            }

            // console.log('headers => ', headers);
            axios.post(apiUrl, datas, { headers: headers })
                .then(res => {
                    this.refreshData();
                    toast.success(res.data.message);
                    setTimeout(function () {
                        toast.dismiss()
                    }, 2000)
                    this.setState({ show: true })
                    console.log('POST response', res);
                })
            // this.setState({ show: true, response: 'success' });
        } else {
            this.setState({ show: true });
        }
    }

    checkMimeType = (event) => {
        //getting file object
        let files = this.state.selectedFile;
        //define message container
        let err = []
        // list allow mime type
        const types = ['image/png', 'image/jpeg']
        // loop access array
        var x = 0;
        if (types.every(type => files.type !== type)) {
            // create error message and assign to container   
            err[x] = files.type + ' is not a supported format\n';

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

    uploadLogo = (event) => {
        var bearer = 'Bearer ' + BEARER_TOKEN;

        const headers = {
            "Authorization": bearer
        };

        this.state.selectedFile = event.target.files[0];
        // Details of the uploaded file 
        console.log('Selected file', this.state.selectedFile);

        if (this.checkMimeType(event)) {
            let reader = new FileReader();

            reader.onloadend = () => {
                console.log('Load end', reader.result);
                this.setState({
                    imgSrc: reader.result
                });
                console.log('Image src state', this.state.imgSrc);
            }

            reader.readAsDataURL(event.target.files[0]);

            const formData = new FormData();

            // Update the formData object 
            formData.append(
                'file',
                this.state.selectedFile
            );

            let empId = '';
            if (this.props.editId) {
                empId = this.props.editId;
            }
            else {
                empId = localStorage.getItem("employeeId")
            }
            const apiUrl = config.API_URL + '/upload/profilePic/' + empId;

            // Request made to the backend api 
            // Send formData object 
            axios.post(apiUrl, formData, { headers: headers }).then(res => {
                console.log('POST response', res);
                this.setState({
                    form: {
                        ...this.state.form, ['profilePic']: res.data.filePath
                    }
                })
                toast.success(res.data.message);
            });
        }

    }

    handleEdit = () => { this.setState({ show: false }) };
    handleCencil = () => { this.setState({ show: true }) };

    render() {
        let item = {};
        let formData = {};
        if (this.state.item) {
            item = this.state.item;
        }

        if (item) {
            if (item.personal) {

                for (var key in item.personal) {

                    if (item.personal[key] == 0) {
                        item.personal[key] = '';
                    }
                }

            }
            else {
                item.personal = {};
            }

            var country = (item.personal && item.personal.country) ? item.personal.country : '';
            var nationality1 = item.personal.nationality ? item.personal.nationality : '';

            let inputFields = [];
            if (this.state.basicFields && this.state.basicFields.length > 0) {
                inputFields = this.state.basicFields;
            }
            // console.log('Data Item Render Before Update', this.state.item);
            if (this.state.item && item.personal) {
                inputFields.map((inputField, index) => {
                    if(item.personal[inputField.fieldName] == 0 && inputField.fieldName !== 'status'){
                        item.personal[inputField.fieldName] = '';
                    }
                    if (inputField.fieldType === 'date') {
                        item.personal['alias-'+inputField.fieldName] = item.personal[inputField.fieldName] ? Moment(item.personal[inputField.fieldName]).format(config.DATE_FORMAT) : '';
                    }
                    if (inputField.fieldName === 'gender') {
                        if (config.GENDER[item.personal[inputField.fieldName]]) {
                            item.personal['alias-' + inputField.fieldName] = config.GENDER[item.personal[inputField.fieldName]];
                        }
                    }
                    if (inputField.fieldName === 'profilePic') {
                        delete inputFields[index];
                    }
                    if (inputField.fieldName === 'country') {
                        item.personal['alias-' + inputField.fieldName] = item.personal['countryName'];
                    }
                    if (inputField.fieldName === 'nationality') {
                        item.personal['alias-' + inputField.fieldName] = item.personal['nationalityName'];
                    }

                });
                // console.log('Data Item Render after Update', this.state.item);
            }
            return (
                <div>
                    <ToastContainer className="right" position="top-right"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        draggable
                        pauseOnHover
                        limit={1}
                    />
                    <div className="col-md-12 mx-auto py-2">
                        <Form onSubmit={this.handleSubmit}>
                            {this.state.show ? (
                                <>
                                    <div className="card d-block p-xl-3 p-2  h-100 shadow-sm">

                                        {this.state.editPermission ? (<a onClick={this.handleEdit} className="card-edit-btn">
                                            <i className="icon-pencil icons align-middle mr-1"></i>
                                        </a>) : ''}

                                        <span className="anchor" id="formComplex"></span>
                                        {inputFields ? (
                                            <div className="my-4">
                                                <h6>Basic Information </h6>
                                            {this.state.viewPermission ? (
                                                <div className="row mt-4  pr-3">
                                                    <div className="col-lg-12">

                                                        <ul className="myinfoListing">
                                                            {inputFields.map((inputField, index) => {
                                                                if(inputField.view === 0){
                                                                    var hideLabel = 'hide';
                                                                }
                                                                else{
                                                                    var hideLabel = '';
                                                                }
                                                                if(item.personal){
                                                                    return <li className={hideLabel}>
                                                                        <label>{inputField.fieldTitle}</label>
                                                                        <span>{item.personal['alias-'+inputField.fieldName] ? item.personal['alias-'+inputField.fieldName] : item.personal[inputField.fieldName] }</span>
                                                                    </li>
                                                                }
                                                                else{
                                                                    return <li className={hideLabel}>
                                                                        <label>{inputField.fieldTitle}</label>
                                                                        <span></span>
                                                                    </li>
                                                                }
                                                            })}

                                                        </ul>

                                                    </div>
                                                </div>) : (
                                                
                                                    <div className="row mt-4 pr-3">
                                                    <div className="col-lg-12">
                                                        <h2>You do not have the permission to view this information.</h2>
                                                    </div>
                                                </div>
                                            )}
                                            </div>
                                        ) : <DataLoading />}
                                    </div>
                                </>
                            ) : (

                                    <>
                                        <div className="card d-block p-xl-3 p-2  h-100 shadow-sm">
                                            <h6>Basic Information </h6>
                                            <div className="row mt-4 edit-basicinfo">
                                                <div className="col-sm-12 pl-3 pr-3">
                                                    {formData && formData.personal != "undefined" ? (
                                                        <FormComponent menuId="3" country={this.state.Countries} nationality={this.state.nationality} gender={this.state.gender} item={item.personal} handleChange={this.handleChange} birthDate={this.state.form.birthDate !== undefined ? this.state.form.birthDate : item.personal.birthDate} uploadFile={this.uploadLogo} bloodGroup={this.state.bloodGroup} maritalStatus = {this.state.maritalStatus} imgSrc={this.state.imgSrc} dateChange={this.onChange}></FormComponent>
                                                    ) : ''}

                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group row pt-5 edit-basicinfo">
                                            <div className="col-lg-12 text-center">
                                                <input type="reset" className="btn btn-outline-primary mr-2" onClick={this.handleCencil} value="Cancel" />
                                                <input type="submit" className="btn btn-primary" value="Save" />
                                            </div>
                                        </div>
                                    </>
                                )}
                        </Form>
                    </div>
                </div>
            )
        }
        return (
            <div className="col-md-12 mx-auto py-2">
                <div className="card d-block p-xl-3 p-2  h-100 shadow-sm">
                    <DataLoading></DataLoading>
                </div>
            </div>

        );
    }
}


export default BasicInfo;
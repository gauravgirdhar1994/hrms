import React, { Component } from 'react';
import { connect } from "react-redux";
import { fetchData } from "../../action/fetchData";
import { editData } from "../../action/editData";
import { Modal, Form, Button } from "react-bootstrap"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loader from '../../loader.gif';
import Moment from 'moment';
import config from '../../config/config';
import DatePicker from "react-datepicker";
import FormComponent from "../MyInfo/FormComponent";
import DataLoading from "../Loaders/DataLoading";
import axios from 'axios';
const BEARER_TOKEN = localStorage.getItem("userData");

class PassportInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            data: [],
            item: [],
            form: [],
            response: "",
            Countries: [],
            Countries1: [],
            status: ['Invalid', 'Valid'],
            statusOption: [],
            token: localStorage.getItem("userData"), 
            editPermission: false,
            viewPermission: false
        }
        this.onChange = this.onChange.bind(this);
        this.getCountries = this.getCountries.bind(this);
        this.getStatus = this.getStatus.bind(this);
    }

    componentDidMount() {
        this.refreshdata();
        this.getCountries();
        this.getStatus();
    }

    refreshdata() {
        // console.log('EDit employee id', this.props.editId);
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
        axios.get(apiUrl, { headers: { Authorization: bearer }})
        .then((r) => {
            console.log("Api result", r);
            this.setState({ item: r.data });
        })
        .catch((error) => {
            console.log("API ERR: ");
            console.error(error);
            // res.json({ error: error });
        });
        axios.get(config.API_URL + '/field-access-list?menuId=5', { headers: { Authorization: bearer } })
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
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            form: {
                ...this.state.form, [name]: value
            }
        })
    }
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
                    this.setState({ Countries: arrCountry, Countries1: arrCountry1 });
                }
            }).catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }
    getStatus() {
        var optionStatus = [];
        this.state.status.map((val, index) => {
            optionStatus.push(<option key={index} value={index}>{val}</option>)
        })
        this.setState({ statusOption: optionStatus });
    }

    handleSubmit = (event) => {
        // console.log('Before Post Data', this.state.form);
        let datas = this.state.form;
        let empId = '';
        if (this.props.editId) {
            empId = this.props.editId;
        }
        else {
            empId = localStorage.getItem("employeeId")
        }
        datas.empId = empId;
        event.preventDefault();
        const { item } = this.state;
        let apiUrl = '';
        if (item.passport && item.passport.id) {

            apiUrl = config.API_URL + '/employee/edit/passport/' + item.passport.id;
        }
        else {

            apiUrl = config.API_URL + '/employee/add/passport';
        }
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }
        // this.props.editData(datas, apiUrl, bearer)
        // console.log('Post Data', this.state.form);
        if (Object.keys(datas).length >= 1) {
            axios.post(apiUrl, datas, { headers: headers }).then(res => {
                if (res.data.success) {
                    toast.success(res.data.message);
                    this.refreshdata();
                    setTimeout(function () {
                        toast.dismiss()
                    }, 2000)
                    this.setState({ show: true })
                }
                else {
                    toast.error(res.data.message);
                    this.refreshdata();
                    setTimeout(function () {
                        toast.dismiss()
                    }, 2000)
                }
            });
        }
        else {
            this.setState({ show: true })
        }

    }

    onChange = (name, date) => {
        console.log(name, date)
        this.setState({
            form: {
                ...this.state.form, [name]: date
            }
        })
    }

    handleEdit = () => { this.setState({ show: false }) };
    handleCencil = () => { this.setState({ show: true }) 
    this.refreshdata(); };
    render() {
        const { item } = this.state;
        
        if (this.props.error) {
            return <p>{this.props.error}</p>;
        }
        
        if (item) {
            let inputFields = [];
            if (this.state.basicFields && this.state.basicFields.length > 0) {
                inputFields = this.state.basicFields;
            }
            if(item.passport){
                inputFields.map((inputField, index) => {
    
                    if(item.passport[inputField.fieldName] == 0 && inputField.fieldName !== 'status'){
                        item.passport[inputField.fieldName] = '';
                    }
                    if (inputField.fieldType === 'date') {
                        item.passport['alias-'+inputField.fieldName] = item.passport[inputField.fieldName] ? Moment(item.passport[inputField.fieldName]).format(config.DATE_FORMAT) : '';
                    }
                    if (inputField.fieldName === 'status') {
                        item.passport['alias-'+inputField.fieldName] = item.passport.status == 1 ? 'Valid' : item.passport.status == 0 ? 'Invalid' : '';
                    }
                    if (inputField.fieldName === 'passportIssuingCountry') {
                        if (this.state.Countries1[item.passport.passportIssuingCountry] !== undefined) {
                            item.passport['alias-'+inputField.fieldName] = this.state.Countries1[item.passport.passportIssuingCountry];
                        }
                    }
                });
            }
            
            return (
                <div>

                    <Form onSubmit={this.handleSubmit}>
                        <div className="col-md-12 mx-auto py-2">
                            {this.state.show? (
                                <>
                                    <div className="card d-block p-xl-3 p-2  h-100 shadow-sm">
                                        {this.state.editPermission ? (<a onClick={this.handleEdit} className="card-edit-btn">
                                            <i className="icon-pencil icons align-middle mr-1"></i>
                                        </a>) : ''}
                                        <div className="my-4" />
                                        <h6>My Passport Information </h6>
                                        {this.state.viewPermission ? (
                                        <div className="row mt-4 pl-3 pr-3">
                                        
                                            <ul className="myinfoListing">
                                                {inputFields.map((inputField, index) => {
                                                    if(inputField.view === 0){
                                                        var hideLabel = 'hide';
                                                    }
                                                    else{
                                                        var hideLabel = '';
                                                    }
                                                    if(item.passport){
                                                        return <li className={hideLabel}>
                                                            <label>{inputField.fieldTitle}</label>
                                                            <span>{item.passport['alias-'+inputField.fieldName] ? item.passport['alias-'+inputField.fieldName] : item.passport[inputField.fieldName] }</span>
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

                                        </div>) : (
                                            <div className="row mt-4 pr-3">
                                                    <div className="col-lg-12">
                                                        <h2>You do not have the permission to view this information.</h2>
                                                    </div>
                                                </div>
                                        )}
                                    </div>
                                    

                                </>
                            ) : (
                                    <>
                                        <div className="card d-block p-xl-3 p-2  h-100 shadow-sm">
                                            <span className="anchor" id="formComplex"></span>
                                            <div className="my-4" />
                                            <h6>My Passport Information </h6>
                                            <div className="row mt-4 edit-basicinfo">
                                                <div className="col-sm-12 pl-3 pr-3">
                                                    <FormComponent menuId="5" passportIssuingCountry={this.state.Countries} status={this.state.statusOption} item={item.passport} handleChange={this.handleChange} dateChange={this.onChange} ></FormComponent>
                                                </div>
                                            </div>
                                            <div className="form-group row pt-5 edit-basicinfo">
                                                <div className="col-lg-12 text-center">
                                                    <input type="button" className="btn btn-outline-primary mr-2" onClick={this.handleCencil} defaultValue="Cancel" />
                                                    <input type="submit" className="btn btn-primary" defaultValue="Save" />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                        </div>
                    </Form>
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

const mapStateToProps = state => ({
    item: state.datas.item
});

export default connect(mapStateToProps, { fetchData, editData })(PassportInfo);

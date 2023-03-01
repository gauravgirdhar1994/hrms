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
import axios from 'axios';
import DatePicker from "react-datepicker";
import FormComponent from "../MyInfo/FormComponent";
import DataLoading from "../Loaders/DataLoading";
const BEARER_TOKEN = localStorage.getItem("userData");
class EmiratesId extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            data: [],
            item: [],
            form: [],
            response: "",
            status: ['Invalid', 'Valid'],
            statusOption: [],
            token: localStorage.getItem("userData"),
            editPermission: false,
            viewPermission: false
        }
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        this.refreshdata();
        this.getStatus();
    }

    refreshdata() {
        
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

        axios.get(config.API_URL + '/field-access-list?menuId=6', { headers: { Authorization: bearer } })
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
    onChange = (name, date) => {
        this.setState({
            form: {
                ...this.state.form, [name]: date
            }
        })
    }
    handleSubmit = (event) => {

        let empId = '';
        if (this.props.editId) {
            empId = this.props.editId;
        }
        else {
            empId = localStorage.getItem("employeeId")
        }

        event.preventDefault();
        const { item } = this.state;
        let apiUrl = '';
        let datas = this.state.form;
        datas.empId = empId;
        if (item.emirate && item.emirate.id) {

            apiUrl = config.API_URL + '/employee/edit/emirate/' + item.emirate.id;
        }
        else {

            apiUrl = config.API_URL + '/employee/add/emirate';
        }

        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }
        // this.props.editData(datas, apiUrl, bearer)
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
        } else {
            this.setState({ show: true })
        }
    }

    handleEdit = () => { this.setState({ show: false }) };
    handleCencil = () => { this.setState({ show: true }) };
    
    getStatus() {
        var optionStatus = [];
        var statusArr = [];
        this.state.status.map((val, index) => {
            optionStatus.push(<option key={index} value={index}>{val}</option>)
        })
        this.setState({ statusOption: optionStatus });
    }
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
            if(item.emirate){
            inputFields.map((inputField, index) => {

                if(item.emirate[inputField.fieldName] == 0 && inputField.fieldName !== 'status'){
                    item.emirate[inputField.fieldName] = '';
                }
                if (inputField.fieldType === 'date') {
                    item.emirate['alias-'+inputField.fieldName] = item.emirate[inputField.fieldName] ? Moment(item.emirate[inputField.fieldName]).format(config.DATE_FORMAT) : '';
                }

                if (inputField.fieldType === 'date') {
                    item.emirate['alias-'+inputField.fieldName] = Moment(item.emirate[inputField.fieldName]).format(config.DATE_FORMAT);
                }
                if (inputField.fieldName === 'status') {
                    item.emirate['alias-'+inputField.fieldName] = item.emirate.status == 1 ? 'Valid' : item.emirate.status == 0 ? 'Invalid' : '';
                }
            });
        }
            return (
                <div>

                    <Form onSubmit={this.handleSubmit}>
                        <div className="col-md-12 mx-auto py-2">
                            {this.state.show ? (
                                <>
                                    <div className="card d-block p-xl-3 p-2  h-100 shadow-sm">
                                        {this.state.editPermission ? (<a onClick={this.handleEdit} className="card-edit-btn">
                                            <i className="icon-pencil icons align-middle mr-1"></i>
                                        </a>) : ''}

                                        <div className="my-4" />
                                        <h6>Emirates ID </h6>
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
                                                    if(item.emirate){
                                                        return <li className={hideLabel}>
                                                            <label>{inputField.fieldTitle}</label>
                                                            <span>{item.emirate['alias-'+inputField.fieldName] ? item.emirate['alias-'+inputField.fieldName] : item.emirate[inputField.fieldName] }</span>
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
                                            <h6>Emirates ID </h6>
                                            <div className="row mt-4 edit-basicinfo">

                                                <div className="col-sm-12 pl-3 pr-3">
                                                    <FormComponent menuId="6" status={this.state.statusOption} item={item.emirate} handleChange={this.handleChange} dateChange={this.onChange}></FormComponent>
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

export default connect(mapStateToProps, { fetchData, editData })(EmiratesId);
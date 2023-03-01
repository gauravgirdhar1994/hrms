import React, { Component } from 'react';
import { connect } from "react-redux";
import { fetchData } from "../../action/fetchData";
import { editData } from "../../action/editData";
import { Modal, Form, Button } from "react-bootstrap"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loader from '../../loader.gif';
import config from '../../config/config';
import axios from 'axios';
import FormComponent from "../MyInfo/FormComponent";
import DataLoading from "../../components/Loaders/DataLoading";
const BEARER_TOKEN = localStorage.getItem("userData");
class ContactInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            data: [],
            item: [],
            response: "",
            basicFields: '',
            token: localStorage.getItem("userData"),
            editPermission: false,
            viewPermission: false,
            form : []
        }

    }

    componentDidMount() {
        this.refreshdata();
    }

    refreshdata() {
        //console.log('EDit employee id', this.props.editId);
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

        this.props.fetchData(apiUrl, bearer);
        axios.get(config.API_URL + '/field-access-list?menuId=7', { headers: { Authorization: bearer } })
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

    handleSubmit = (event) => {
        let datas = this.state.form;
        event.preventDefault();
        let empId = '';
        if (this.props.editId) {
            empId = this.props.editId;
        }
        else {
            empId = localStorage.getItem("employeeId")
        }
        // datas.empId = empId;
        const apiUrl = config.API_URL + '/employee/edit/personal/' + empId;
        var bearer = 'Bearer ' + this.state.token;
        if (Object.keys(datas).length >= 1) {
            this.props.editData(datas, apiUrl, bearer)
            if (this.props.success != "undefined") {
                this.refreshdata();
            }
            const toasts = "Updated Successfully"
            toast.success('Updated Successfully');
            setTimeout(function () {
                toast.dismiss()
            }, 2000)
        }
        this.setState({ show: true })
    }

    handleEdit = () => { this.setState({ show: false }) };
    handleCencil = () => { this.setState({ show: true }) };
    render() {
        const { item } = this.state;
        if (this.props.error) {
            return <p>{this.props.error}</p>;
        }
        let inputFields = [];
        if (this.state.basicFields && this.state.basicFields.length > 0) {
            inputFields = this.state.basicFields;
        }


        if (item) {
            if (this.state.item && item.personal) {
                inputFields.map((inputField, index) => {
                    if (item.personal[inputField.fieldName] == 0 && inputField.fieldName !== 'status') {
                        item.personal[inputField.fieldName] = '';
                    }
                    if (inputField.fieldType === 'phone-text') {
                        item.personal[inputField.fieldName] = item.personal[inputField.fieldName] ? item.personal[inputField.fieldName] : '';
                    }
                })
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
                                        <h6>Contact Information </h6>
                                        {this.state.viewPermission ? (
                                        <div className="row mt-4 pl-3 pr-3">

                                            <ul className="myinfoListing">

                                                {inputFields.map((inputField, index) => {
                                                    if (inputField.view === 0) {
                                                        var hideLabel = 'hide';
                                                    }
                                                    else {
                                                        var hideLabel = '';
                                                    }
                                                    if (item.personal) {
                                                        return <li className={hideLabel}>
                                                            <label>{inputField.fieldTitle}</label>
                                                            <span>{item.personal['alias-' + inputField.fieldName] ? item.personal['alias-' + inputField.fieldName] : item.personal[inputField.fieldName]}</span>
                                                        </li>
                                                    }
                                                    else {
                                                        return <li className={hideLabel}>
                                                            <label>{inputField.fieldTitle}</label>
                                                            <span></span>
                                                        </li>
                                                    }
                                                })
                                                }

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
                                            <h6>Contact Information </h6>


                                            <div className="row mt-4 edit-basicinfo">
                                                <div className="col-sm-12 pl-3 pr-3">
                                                    <FormComponent menuId="7" item={item.personal} handleChange={this.handleChange} ></FormComponent>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row pt-5 edit-basicinfo">
                                            <div className="col-lg-12 text-center">
                                                <input type="button" className="btn btn-outline-primary mr-2" onClick={this.handleCencil} defaultValue="Cancel" />
                                                <input type="submit" className="btn btn-primary" defaultValue="Save" />
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

export default connect(mapStateToProps, { fetchData, editData })(ContactInfo);
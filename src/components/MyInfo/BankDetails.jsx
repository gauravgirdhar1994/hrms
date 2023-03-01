import React, { Component } from "react";
import loader from "../../loader.gif";
import axios from "axios";
import Moment from "moment";
import { Form } from "react-bootstrap"
import { ToastContainer, toast } from "react-toastify";
import FormComponent from "../MyInfo/FormComponent";
import config from "../../config/config";
import DataLoading from "../../components/Loaders/DataLoading";
const BEARER_TOKEN = localStorage.getItem("userData");

class BankDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            data: [],
            token: localStorage.getItem("userData"),
            orgId: localStorage.getItem("orgId"),
            role: localStorage.getItem("roleSlug"),
            basicFields: [],
            editPermission: false,
            viewPermission: false,
            form : []
        };

    }

    componentDidMount() {
        this.refreshData();
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/field-access-list?menuId=14', { headers: { Authorization: bearer } })
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

    refreshData = () => {
        var bearer = "Bearer " + BEARER_TOKEN;
        let empId = '';
        if (this.props.editId) {
            empId = this.props.editId;
        }
        else {
            empId = localStorage.getItem("employeeId")
        }
        axios
            .get(
                config.API_URL +
                "/employee/bankDetails/" +
                empId,
                { headers: { Authorization: bearer } }
            )
            .then((r) => {
                console.log("Api result", r);
                this.setState({ data: r.data.bankData.rows[0] });
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    };

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({
            form: {
                ...this.state.form,
                [name]: value,
            },
        });
    };

    onChange = (name, date) => {
        // console.log('Change BirthDate', date)
        this.setState({
            form: {
                ...this.state.form,
                [name]: date,
            },
        });
        //console.log('Change BirthDate', this.state.form)
    };


    handleSubmit = (event) => {
        // console.log('Form Data',this.state.form);
        let datas = this.state.form;
        // console.log('Form Data',datas);
        // datas.birthDate = this.state.birthDate;
        event.preventDefault();
        let empId = this.props.editId;
        // if (this.props.editId) {
        //   empId = this.props.editId;
        // } else {
        //   empId = localStorage.getItem("employeeId");
        // }
        const apiUrl = config.API_URL + "/employee/edit/bank/" + empId;
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        // console.log('headers => ', headers);
        if (Object.keys(datas).length >= 1) {
        axios.post(apiUrl, datas, { headers: headers })
            .then(res => {
                this.refreshData();
                toast.success('Updated Successfully');
                setTimeout(function () {
                    toast.dismiss()
                }, 2000)
                this.setState({ show: true })
                console.log('POST response', res);
            })
        }
    };

    handleEdit = () => {
        this.setState({ show: false });
    };
    handleCencil = () => {
        this.setState({ show: true });
    };

    render() {
        const bankData = this.state.data;
        let inputFields = [];
        if (this.state.basicFields && this.state.basicFields.length > 0) {
            inputFields = this.state.basicFields;
        }

        return (
            <div>
                <ToastContainer
                    className="right"
                    position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    draggable
                    pauseOnHover
                    limit={1}
                />
                <div className="col-md-12 mx-auto">
                    <Form onSubmit={this.handleSubmit}>
                        {this.state.show ? (
                            <>
                                <div className="card d-block p-xl-3 p-2 h-100 shadow-sm">

                                    {this.state.editPermission ? (<a onClick={this.handleEdit} className="card-edit-btn">
                                        <i className="icon-pencil icons align-middle mr-1"></i>
                                    </a>) : ''}
                                    

                                    <span className="anchor" id="formComplex"></span>

                                    <div className="my-4" />
                                    <h6>Bank Details</h6>
                                    {this.state.viewPermission ? (
                                        <div className="row mt-4 pr-3">
                                        <div className="col-lg-12">
                                            <ul className="myinfoListing">
                                                {inputFields.map((inputField, index) => {
                                                    if (inputField.view === 0) {
                                                        var hideLabel = 'hide';
                                                    }
                                                    else {
                                                        var hideLabel = '';
                                                    }
                                                    return <li className={hideLabel}>
                                                        <label>{inputField.fieldTitle}</label>
                                                        <span>{bankData ? bankData[inputField.fieldName] : ''}</span>
                                                    </li>
                                                })}

                                            </ul>
                                        </div>
                                    </div>
                                    ) : (
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
                                        <h6>Bank Details</h6>

                                        <div className="row mt-4 edit-basicinfo">
                                            <div className="col-sm-12 pl-3 pr-3">
                                                <FormComponent
                                                    menuId="14"
                                                    item={bankData}
                                                    handleChange={this.handleChange}
                                                ></FormComponent>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="form-group row pt-5 edit-basicinfo">
                                        <div className="col-lg-12 text-center">
                                            <input
                                                type="button"
                                                className="btn btn-outline-primary mr-2"
                                                onClick={this.handleCencil}
                                                defaultValue="Cancel"
                                            />
                                            <input
                                                type="submit"
                                                className="btn btn-primary"
                                                defaultValue="Save"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                    </Form>
                </div>
            </div>
        );
        return (
            <div className="col-md-12 mx-auto py-2" >
                <div className="card d-block p-xl-3 p-2  h-100 shadow-sm">
                    <DataLoading></DataLoading>
                </div>
        </div>

        );
    }
}

export default BankDetails;

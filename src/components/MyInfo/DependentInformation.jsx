import React, { Component } from "react";
import loader from "../../loader.gif";
import axios from "axios";
import Moment from "moment";
import { Form,Modal } from "react-bootstrap"
import { ToastContainer, toast } from "react-toastify";
import FormComponent from "../MyInfo/FormComponent";
import config from "../../config/config";
import DataLoading from "../../components/Loaders/DataLoading";
import UploadDocument from '../Documents/UploadDependentDoc';
const BEARER_TOKEN = localStorage.getItem("userData");

class DependentInformation extends Component {
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
            dependentDocs : [],
            dependentDocShow : false,
            selectedDependent : '',
            selectedDocument : '',
            documentShow : false, 
            nationalityArr : [],
            relationArr : {'S' : "Spouse", "P" : "Parent", "C" : "Child"},
            visaType: ['Tourist/Visit Visa', 'E-Visa for GCC Residents', 'Student Visa', 'Employment Visa'],
            issuingEmirates : ['Abu Dhabi', 'Ajman', 'Dubai', 'Fujairah', 'Ras Al Khaimah', 'Sharjah', 'Umm Al Quwain'],
            issuing_emirate : '',
            relationship : [],
            visa_type: '',
            countriesArr : [],
            gender: {"M" : "Male",  "F" : "Female" },
            status: config.STATUS,
            gender_option: [],
            status_option: [],
            dependentCode : ''
        };
        this.refreshData = this.refreshData.bind(this);
        // this.openLightBox = this.openLightBox.bind(this);
    }

    refreshData(){
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
                "/employee/DependentInformation/" +
                empId,
                { headers: { Authorization: bearer } }
            )
            .then((r) => {
                console.log("Api result", r);
                this.setState({ data: r.data.bankData.rows });
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });

            if(this.state.selectedDependent){

                const apiUrl = config.API_URL+'/dependent/documents/view/'+this.state.selectedDependent;
                var bearer = 'Bearer ' + BEARER_TOKEN;
                axios
            .get(
                apiUrl,
                { headers: { Authorization: bearer } }
            )
            .then((r) => {
                console.log("Api result", r);
                this.setState({ dependentDocs: r.data.Documents });
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
        } 
    };

    handleDependentDocShow = () => {
            this.setState({
                dependentDocShow : false
            })
    }

    showDependentDocs = (key) => {
            console.log('Dependent data', this.state.data[key].dependentCode);
        this.setState({
                dependentDocShow : true,
                selectedDependent : this.state.data[key].dependentCode
        }, () => {
                console.log('Selected Dependent', this.state.selectedDependent);
                if(this.state.selectedDependent){

                        const apiUrl = config.API_URL+'/dependent/documents/view/'+this.state.selectedDependent;
                        var bearer = 'Bearer ' + BEARER_TOKEN;
                        axios
                    .get(
                        apiUrl,
                        { headers: { Authorization: bearer } }
                    )
                    .then((r) => {
                        console.log("Api result", r);
                        this.setState({ dependentDocs: r.data.Documents });
                    })
                    .catch((error) => {
                        console.log("API ERR: ");
                        console.error(error);
                        // res.json({ error: error });
                    });
                }
        })
    }

    componentDidMount() {
        this.refreshData();

        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/field-access-list?menuId=15', { headers: { Authorization: bearer } })
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

            this.getCountries();
            this.getGender();
            this.getStatus();
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
                    this.setState({ Countries: arrCountry, Nationalities : arrNationality, Countries1: arrCountry1, countriesArr : r.data.countriesArr, nationalityArr : r.data.nationalityArr });
                }
            }).catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }

    getGender() {
        var arrTen = [];
        var arrRel = [];
        var arrVisa = [];
        var arrEmirates = [];

        Object.keys(this.state.gender).map((obj_index, arr_index) => {
            //console.log('gender',obj_index,arr_index)
            arrTen.push(<option key={arr_index} value={obj_index}> {this.state.gender[obj_index]} </option>);
        })
        Object.keys(this.state.relationArr).map((obj_index, arr_index) => {
            //console.log('gender',obj_index,arr_index)
            arrRel.push(<option key={arr_index} value={obj_index}> {this.state.relationArr[obj_index]} </option>);
        })
        Object.keys(this.state.visaType).map((obj_index, arr_index) => {
            //console.log('gender',obj_index,arr_index)
            arrVisa.push(<option key={arr_index} value={this.state.visaType[obj_index]}> {this.state.visaType[obj_index]} </option>);
        })
        Object.keys(this.state.issuingEmirates).map((obj_index, arr_index) => {
                //console.log('gender',obj_index,arr_index)
                arrEmirates.push(<option key={arr_index} value={this.state.issuingEmirates[obj_index]}> {this.state.issuingEmirates[obj_index]} </option>);
        })
        //console.log('gender',arrTen);
        this.setState({ gender_option: arrTen, relationship : arrRel, issuing_emirate : arrEmirates, visa_type : arrVisa });
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

    handleClose = () => {
            this.setState({
                    documentShow: false
            })
    }

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
        const apiUrl = config.API_URL + "/dependent/edit/" + this.state.dependentCode;
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        // console.log('headers => ', headers);
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
    };

    handleEdit = (key) => {
        this.setState({ show: false, dependentCode : this.state.data[key].dependentCode });
    };
    handleCencil = () => {
        this.setState({ show: true });
    };

    uploadAgain = (id) => {
        // console.log('Upload Again id',id)
       this.setState({selectedDocument : id, documentShow: true});
      }

    render() {
        const bankData = this.state.data;
        let inputFields = [];
        if (this.state.basicFields && this.state.basicFields.length > 0) {
            inputFields = this.state.basicFields;
        }

        if (bankData) {
                for(var key in bankData){
                        inputFields.map((inputField, index) => {
                                console.log('InputField', inputField.fieldName);
                                if (inputField.fieldName.substring(1) === 'gender') {
                                    if (this.state.gender[bankData[key][inputField.fieldName.substring(1)].toUpperCase()]) {
                                        bankData[key]['alias-' + inputField.fieldName] = this.state.gender[bankData[key][inputField.fieldName.substring(1)].toUpperCase()];
                                    }
                                }

                                if (inputField.fieldType === 'date') {
                                        bankData[key]['alias-' + inputField.fieldName] = bankData[key][inputField.fieldName.substring(1)] ? Moment(bankData[key][inputField.fieldName.substring(1)]).format(config.DATE_FORMAT) : bankData[key][inputField.fieldName] ? Moment(bankData[key][inputField.fieldName]).format(config.DATE_FORMAT) : '';
                                    }
                                
                                if (inputField.fieldName.substring(1) === 'nationality') {
                                        // console.log('Nationality Field Name', bankData[key]);
                                        bankData[key]['alias-' + inputField.fieldName] = this.state.nationalityArr[bankData[key][inputField.fieldName.substring(1)]];
                                }

                                if (inputField.fieldName === 'visaIssuingCountry') {
                                        // console.log('Nationality Field Name', bankData[key]);
                                        bankData[key]['alias-' + inputField.fieldName] = this.state.countriesArr[bankData[key][inputField.fieldName]];
                                }
                                if (inputField.fieldName === 'passportIssuingCountry') {
                                        // console.log('Nationality Field Name', bankData[key]);
                                        bankData[key]['alias-' + inputField.fieldName] = this.state.countriesArr[bankData[key][inputField.fieldName]];
                                }

                                if (inputField.fieldName === 'relationship') {
                                        // console.log('Nationality Field Name', bankData[key]);
                                        bankData[key]['alias-' + inputField.fieldName] = this.state.relationArr[bankData[key][inputField.fieldName]];
                                }
            
                            });
                }
               
                // console.log('Data Item Render after Update', this.state.item);
            }
        
        // console.log('Bank Data', bankData);
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
                        Object.keys(bankData).length > 0 ?  
                            (<>
                           { bankData.map((data, key) => {
                                 return  <div className="card d-block p-xl-3 p-2 mt-3 h-100 shadow-sm">

                                    {this.state.editPermission ? ( <><button type="button" className="btn btn-primary uploadDocBtn" onClick={()=>this.showDependentDocs(key)}>Upload Documents</button><a onClick={()=>this.handleEdit([key])} className="card-edit-btn">
                                        <i className="icon-pencil icons align-middle mr-1"></i>
                                    </a></>) : ''}
                                    

                                    <span className="anchor" id="formComplex"></span>

                                    <div className="my-4" />
                                    <h6>Dependent {key+1} Information</h6>
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
                                                        <span>{data['alias-'+inputField.fieldName] ? data['alias-'+inputField.fieldName] : data[inputField.fieldName.substring(1)] ? data[inputField.fieldName.substring(1)] : data[inputField.fieldName] }</span>
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
                           })
                        }
                           </>)
                        : (
                                <>
                                <div className="card d-block p-xl-3 p-2 mt-3 h-100 shadow-sm">
                                <div className="row mt-4 pr-3">
                                            <div className="col-lg-12">
                                                <h2>No Dependents Added yet</h2>
                                            </div>
                                        </div>
                                </div>
                                </>
                        )

                        ) : (
                                
                                 bankData.map((data, key) => {
                                     return    <>
                                    <div className="card d-block p-xl-3 p-2 mt-3 h-100 shadow-sm">
                                        <span className="anchor" id="formComplex"></span>
                                       
                                        <div className="my-4" />
                                        <h6>Dependent Information</h6>

                                        <div className="row mt-4 edit-basicinfo">
                                            <div className="col-sm-12 pl-3 pr-3">
                                                <FormComponent
                                                    menuId="15"
                                                    item={data}
                                                    handleChange={this.handleChange}
                                                    visaIssuingCountry={this.state.Countries}
                                                    passportIssuingCountry={this.state.Countries}
                                                    dnationality={this.state.Nationalities}
                                                    dgender={this.state.gender_option} 
                                                    status={this.state.status_option}
                                                    relationship={this.state.relationship}
                                                    issuing_emirate={this.state.issuing_emirate}
                                                    visa_type={this.state.visa_type}
                                                    dateChange={this.onChange}
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
                        })
                            )}
                    </Form>
                    <Modal show={this.state.dependentDocShow} onHide={this.handleDependentDocShow}>
                                        <Modal.Header closeButton>
                                                <Modal.Title>Upload Dependent Documents</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body className="text-center">
                                        <table className="table table-striped">
                                        <thead style={{background: "#f0f8ff"}}>
                                                <tr>
                                                        <td>Document Type</td>
                                                        <td>Status</td>
                                                        <td>Uploaded On</td>
                                                        <td>Actions</td>
                                                </tr>
                                        </thead>
                                        <tbody>
                                              {this.state.dependentDocs.map((row, index) => {
                                                      return <tr><td>{row.documentName}</td><td className = {row.status === 'Uploaded' ? 'text-success' : 'text-danger'}>{row.status}</td><td>{row.uploadedOn !== '-' ? Moment(row.uploadedOn).format(config.DATE_FORMAT) : '-'}</td><td><span>{row.status === 'Uploaded' ? (row.documentPath.length > 1 ? <a onClick={()=>this.openLightBox(row.id)} className="btn btn-sm btn-outline-danger mr-15">View Document</a> : <a href={config.BASE_URL + row.documentPath} target="_blank" className="btn btn-sm btn-outline-danger mr-15">View Document</a>) : '' }</span><span><button type="button" className="btn btn-sm btn-outline-danger mr-15" onClick={() => this.uploadAgain(row.id)}>{row.status === 'Uploaded' ? 'Upload Again' : 'Upload'} </button> </span></td></tr>;
                                              })}
                                        </tbody>
                        {this.state.selectedDocument ? (<UploadDocument show={this.state.documentShow} onRefresh={this.refreshData} dependentCode={this.state.selectedDependent} selectedDocument={this.state.selectedDocument} onHide={this.handleClose}/>) : ''}
          
        </table>
                                        </Modal.Body>
                </Modal>
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

export default DependentInformation;

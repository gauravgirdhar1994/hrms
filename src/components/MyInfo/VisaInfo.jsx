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
import FormComponent  from "../MyInfo/FormComponent";
import DataLoading from "../Loaders/DataLoading";
import axios from 'axios';
const BEARER_TOKEN = localStorage.getItem("userData");
class VisaInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            data: [],
            form: [],
            item: [],
            response: "",
            token: localStorage.getItem("userData"),
            Countries:[],
            Countries1:[],
            status:['Invalid','Valid'],
            emirates: ['Abu Dhabi', 'Ajman', 'Dubai', 'Fujairah', 'Ras Al Khaimah', 'Sharjah', 'Umm Al Quwain'],
            statusOption:[],
            issuing_emirate: [],
            visa_type: [],
            basicFields: [],
            editPermission: false,
            viewPermission: false,
            visaType: ['Tourist/Visit Visa', 'E-Visa for GCC Residents', 'Student Visa', 'Employment Visa'],
        }
        this.getCountries = this.getCountries.bind(this);
        this.getStatus = this.getStatus.bind(this);

    }

    componentDidMount() {
        this.refreshdata();
        this.getCountries();
        this.getStatus();
        this.getEmirates();
        this.getVisaType();
    }

    refreshdata(){
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
        axios.get(config.API_URL + '/field-access-list?menuId=4', { headers: { Authorization: bearer }})
        .then(r => {
                if (r.status == 200) {
                    console.log('fieldList',r.data.fieldList);
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
    
    getCountries()
    {
        axios.get(config.API_URL+'/common/countries',{ headers: { Authorization: 'bearer '+BEARER_TOKEN }})
       .then(r => {
          
           if (r.status == 200) {
               var arrCountry = [];
               var arrCountry1 = [];
               
               for (var k = 0; k < r.data.Countries.length; k++) {
                   arrCountry.push(<option key={r.data.Countries[k].id} value={r.data.Countries[k].id}> {r.data.Countries[k].country} </option>);
                  arrCountry1[r.data.Countries[k].id] = r.data.Countries[k].country;
               }
               this.setState({Countries : arrCountry,Countries1:arrCountry1});
           }}) .catch((error) => {
           console.log("API ERR: ");
           console.error(error);
           // res.json({ error: error });
       });
               
               
    }
    getStatus()
    {
        var optionStatus = [];
        this.state.status.map((val,index)=>{
            optionStatus.push(<option key={index} value={index}>{val}</option> )
        })
        this.setState({statusOption : optionStatus});
    }
    getEmirates()
    {
        var optionStatus = [];
        this.state.emirates.map((val,index)=>{
            optionStatus.push(<option key={index} value={val}>{val}</option> )
        })
        this.setState({issuing_emirate : optionStatus});
    }
    getVisaType()
    {
        var optionStatus = [];
        this.state.visaType.map((val,index)=>{
            optionStatus.push(<option key={index} value={val}>{val}</option> )
        })
        this.setState({visa_type : optionStatus});
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
        let empId = this.props.editId;
        // if(this.props.editId){
        //     empId = this.props.editId;
        // }
        // else{
        //     empId = localStorage.getItem("employeeId")
        // }
        datas.empId =  empId;
        event.preventDefault();
        const { item } = this.state;
        let apiUrl = '';
        if(item.visa && item.visa.id){
          
            apiUrl = config.API_URL+'/employee/edit/visa/'+item.visa.id;
        }
        else{
           
            apiUrl = config.API_URL+'/employee/add/visa';
        }
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
          }
        // this.props.editData(datas, apiUrl, bearer)
        if(Object.keys(datas).length > 1){
        axios.post(apiUrl, datas, { headers: headers }).then(res => {
            if(res.data.success){
                toast.success(res.data.message);
                this.refreshdata();
                setTimeout(function(){
                    toast.dismiss()
                },2000)
                this.setState({ show: true })
            }
            else{
                toast.error(res.data.message);
                this.refreshdata();
                setTimeout(function(){
                    toast.dismiss()
                },2000)
            }
          });
        }
        else{
            this.setState({ show: true })
        }
                
    }
    

     onChange = (name,date) => {
        this.setState({
            form: {
                ...this.state.form, [name]: date
            }
            })
       }

    handleEdit = () => { this.setState({ show: false }) };
    handleCencil = () => { 
        this.setState({ show: true })
        this.refreshdata();
     };
    render() {
        const { item } = this.state;
       
        // console.log('EditData', editData);
        if (this.props.error) {
            return <p>{this.props.error}</p>;
        }
        
        if (item) {
           
            let inputFields = [];
            if (this.state.basicFields && this.state.basicFields.length > 0) {
                inputFields = this.state.basicFields;
            }
            if(item.visa){
                inputFields.map((inputField, index) => {
                    
                    if(item.visa[inputField.fieldName] == 0 && inputField.fieldName !== 'status'){
                        item.visa[inputField.fieldName] = '';
                    }
                    if(inputField.fieldType === 'date'){
                            console.log('Change Date format', inputField.fieldName, item.visa[item.personal[inputField.fieldName]]);
                        item.visa['alias-'+inputField.fieldName] = item.visa[inputField.fieldName] ? Moment(item.visa[inputField.fieldName]).format(config.DATE_FORMAT) : '';
                    }
                    if(inputField.fieldName === 'status'){
                        item.visa['alias-'+inputField.fieldName] = item.visa.status==1 ? 'Valid' : item.visa.status == 0 ?'Invalid' : '';
                    }
                    if(inputField.fieldName === 'visaIssuingCountry'){
                        if(this.state.Countries1[item.visa.visaIssuingCountry] !== undefined){
                            item.visa['alias-'+inputField.fieldName] = this.state.Countries1[item.visa.visaIssuingCountry];
                        }
                    }
                    if(inputField.fieldName === 'visaType'){
                            item.visa['alias-'+inputField.fieldName] = item.visa.visaType;
                    }
                    if(inputField.fieldName === 'status'){
                            item.visa['alias-'+inputField.fieldName] = item.visa.status ? 'Valid' : 'Invalid';
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
                                        <h6>My Visa Information </h6>
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
                                                if(item.visa){
                                                    return <li className={hideLabel}>
                                                        <label>{inputField.fieldTitle}</label>
                                                        <span>{item.visa['alias-'+inputField.fieldName] ? item.visa['alias-'+inputField.fieldName] : item.visa[inputField.fieldName] }</span>
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
                                            <h6>My Visa Information </h6>
                                            <div className="row mt-4 edit-basicinfo">
                                             <div className="col-sm-12 pl-3 pr-3">
                                                 {editData ? (<FormComponent menuId="4"  status = {this.state.statusOption} visaIssuingCountry={this.state.Countries} item={item.visa} handleChange={this.handleChange} dateChange={this.onChange} visa_type={this.state.visa_type} issuing_emirate={this.state.issuing_emirate}></FormComponent>) : ''}
                                                 
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
            // <div className="col-md-12 mx-auto py-2">
            //     <div className="card d-block p-xl-3</Form> p-2  h-100 shadow-sm">
            //         <DataLoading></DataLoading>
            //     </div>
            // </div>
            ''
        );
    }
}

const mapStateToProps = state => ({
    item: state.datas.item
});

export default connect(mapStateToProps, { fetchData, editData })(VisaInfo);
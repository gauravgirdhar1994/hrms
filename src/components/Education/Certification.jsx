import React, { Component } from 'react';
import { connect } from "react-redux";
import { editData } from "../../action/editData";
import {Modal, Form, Button} from "react-bootstrap"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loader from '../../loader.gif';
import {DataFetch} from '../../services/DataFetch'
import config from '../../config/config';
import AddCertification from './AddCertification';
import EditCertification from './EditCertification';
const BEARER_TOKEN = localStorage.getItem("userData");

class Certification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show:false,
            data : [], 
            addshow:false,
            response:"" ,
            DataEdit:""   
        }
      }
    
    componentDidMount(){
        //this.refreshList()
        // let empId = '';
        // if (this.props.editId) {
        //     empId = this.props.editId;
        // }
        // else {
        //     empId = localStorage.getItem("employeeId")
        // }
        let empId = this.props.editId;
        const apiUrl = config.API_URL+'/employee/info/view/certification/'+empId;
        var bearer = 'Bearer ' + BEARER_TOKEN;
        DataFetch(apiUrl, bearer).then((result) => {
            let responseJson = result;
            console.log(responseJson)
            this.setState({ data: responseJson})
        })
    }
  

    // componentDidUpdate(prevProps, prevState){
    //     this.refreshList()
    // }

    refreshList = (response) => {
        if(response){
            this.setState({ data: response.data })            
        }
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
        // let datas = this.state.form;
        // event.preventDefault();
        // const apiUrl = 'http://apihrmsuat.91wheels.com/api/employee/edit/emirate/1234567890';
        // var bearer = 'Bearer ' + 'eyJhbGciOiJIUzI1NiJ9.W3siaWQiOjEsInVzZXJuYW1lIjoiZ2F1cmF2IiwicGFzc3dvcmQiOiI1ZjRkY2MzYjVhYTc2NWQ2MWQ4MzI3ZGViODgyY2Y5OSIsInJvbGUiOjEsIm9yZ0lkIjoxLCJjcmVhdGVkQnkiOjAsInVwZGF0ZWRCeSI6MSwiY3JlYXRlZE9uIjoiMjAyMC0wNC0zMFQxOToyMDo1Ni4wMDBaIiwidXBkYXRlZE9uIjoiMjAyMC0wNC0zMFQxOToyMDo1OC4wMDBaIn1d.IqR7mfVoWTa93xl0xqCKg4Sd_Gex8CAdtZZ26E250j4';
        // this.props.editData(datas, apiUrl, bearer)
        // const toasts = "Updated Successfully"
        //         toast.success('Updated Successfully');
        // this.setState({show:true})
    }

      handleClose = () => this.setState({show:false});
      handleShow = () => this.setState({show:true});
      
      handleaddClose = () => {
        console.log(49,'handle close');
        this.setState({addshow:false});
      }    
      
      handleaddShow = () => this.setState({addshow:true});

    render() {
        const {data, DataEdit, show} = this.state;
        // console.log("certicsss", data)

        if (data && data.certificationInfo){
        return (
            <div>
                <div className="card d-block p-xl-3 p-2  h-100 shadow-sm">
                        <span className="anchor" id="formComplex"></span>
                        <div className="my-4" />
                        <div className="d-flex justify-content-between mb-1">
                            <h6>Certifications </h6>
                            <a href="javascript:void(0)" onClick={() => this.setState({addshow:true})}>+ Add Certifications</a>
                        </div>
                        {data.certificationInfo.map((datas, index) => (
                            <div className="list-item" key={index}>
                            <p><strong>{datas.instituteName}</strong></p>
                            <p className="mb-0">{datas.degree} <span></span></p>
                            <p className="mb-2">{datas.startYear} - <span>{datas.endYear} </span></p>
                            <p className="mb-0">{datas.certificationDetails ? datas.certificationDetails : ''} <span></span></p>
                            <a href="javascript:void(0)" onClick={() => this.setState({show:true,DataEdit:datas})}>Edit</a>
                            </div>
                        ))}
                </div>
                <EditCertification onHide={this.handleClose} show={this.state.show} empId={this.props.editId} data={DataEdit} func={this.refreshList} />
                <AddCertification onHideAdd={this.handleaddClose} showAdd={this.state.addshow} empId={this.props.editId} func={this.refreshList} />
            </div>
        )
    }
    return (
        <img src={loader} className="App-logo" alt="logo" />
    );
    }
}

export default Certification;

import React, { Component } from 'react';
import { connect } from "react-redux";
import { fetchData } from "../../action/fetchData";
import { editData } from "../../action/editData";
import {Modal, Form, Button} from "react-bootstrap"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loader from '../../loader.gif';
import {DataFetch} from '../../services/DataFetch'
import EditUniversity from './EditUniversity';
import AddUniversity from './AddUniversity';
import config from '../../config/config';
const BEARER_TOKEN = localStorage.getItem("userData");

class University extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show:false,
            data : [], 
            addshow:false,
            response:"" ,
            DataEdit:"" ,
            empId:localStorage.getItem("employeeId"),         
        }
      }
    
    componentDidMount(){
        // this.refreshList()
        //console.log(29,'Component Update')
        let empId = '';
        if (this.props.editId) {
            empId = this.props.editId;
        }
        else {
            empId = localStorage.getItem("employeeId")
        }
        const apiUrl = config.API_URL+'/employee/info/view/education/'+empId;
        var bearer = 'Bearer ' + BEARER_TOKEN;
        DataFetch(apiUrl, bearer).then((result) => {
            let responseJson = result;
            //console.log('refresh',responseJson)
            this.setState({ data: responseJson,empId:empId })
        })
    }

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

      handleClose = () => {
        console.log(49,'handle close');
        this.setState({show:false});
      }    
      
      handleShow = () => this.setState({show:true});
      
      handleaddClose = () => {
        console.log(49,'handle close');
        this.setState({addshow:false});
      }    
      
      handleaddShow = () => this.setState({addshow:true});
      

    render() {
        const {data, DataEdit, show} = this.state;
       // console.log('Refreshed Data',data);
        if (data && data.educationInfo){
        return (
            <div>
                <div className="card d-block p-xl-3 p-2  h-100 shadow-sm"> 
                        <span className="anchor" id="formComplex"></span>
                        <div className="my-4" />
                        <div className="d-flex justify-content-between mb-1">
                            <h6>University/School</h6>
                            <a href="javascript:void(0)" onClick={() => this.setState({addshow:true})}>+ Add Education Info</a>
                        </div>
                        {data.educationInfo.map((datas, index) => (
                            <div className="list-item" key={index}>
                            <p><strong>{datas.instituteName}</strong></p>
                            <p className="mb-0">{datas.degree} <span></span></p>
                            <p className="mb-2">{datas.startYear} - <span>{datas.endYear} </span></p>
                            <p className="mb-0">{datas.educationalDetails ? datas.educationalDetails : ''} <span></span></p>
                            <a href="javascript:void(0)" onClick={() => this.setState({show:true,DataEdit:datas})}>Edit</a>
                            </div>
                        ))}
                </div>
                    <EditUniversity onHide={this.handleClose} show={this.state.show} data={DataEdit} empId={this.state.empId} func={this.refreshList} />
                    <AddUniversity onHideAdd={this.handleaddClose} showAdd={this.state.addshow} empId={this.state.empId} func={this.refreshList} />
            </div>
        )
    }
    return (
        <img src={loader} className="App-logo" alt="logo" />
    );
    }
}

export default connect("", {editData})(University);
import React, { Component } from 'react';
import { connect } from "react-redux";
import { editData } from "../../action/editData";
import {Modal, Form, Button} from "react-bootstrap"
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import {DataFetch} from '../../services/DataFetch'
import loader from '../../loader.gif';
//import Moment from 'moment';
import config from '../../config/config';
import "react-datepicker/dist/react-datepicker.css";
import FormComponent  from "../MyInfo/FormComponent";
class EditUniversity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show:false,
            data : [], 
            response:"",
            createdBy: "",
            date:"",
            form:{
                designation: "",
                employerName:"",
                endDate: "",
                jobDetails:"",
                location: "",
                startDate: ""
            },
            token: localStorage.getItem("userData")       
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

    componentDidMount(){
        if(this.props.data){
            this.setState({
                form: this.props.data
            })
          } 
    }

    handleSubmit = () => {
        let datas = this.state.form;
        console.log('Form State Data',this.state.form);
        const apiUrl = config.API_URL+'/employee/info/edit/work/'+this.props.data.id;
        var bearer = 'Bearer ' + this.state.token;
        // this.props.editData(datas, apiUrl, bearer)
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }
        // let empId = '';
        // if(this.props.editId){
        //     empId = this.props.editId;
        // }
        // else{
        //     empId = localStorage.getItem("employeeId")
        // }
        datas.empId =  this.props.empId;
        // console.log('headers => ', headers);
        axios.post(apiUrl, datas, {headers: headers})
            .then(res => {
                console.log('POST response',res);
                this.props.func(res);
                // console.log(res.data);
        })
       // const toasts = "Updated Successfully"
                toast.success('Updated Successfully');
                setTimeout(function(){
            toast.dismiss()
        },2000)
        this.setState({show:false})
    }
     onChange = (name,date) => {
        this.setState({
            form: {
                ...this.state.form, [name]: date
            }
            })
       }

    render() {
        const { data, show, editData, response} = this.state;
        const { designation, empId, employerName, endDate, id, location, startDate} = this.state.form;
       // console.log('edit university data', this.props)
        return (
            <div>
                 <ToastContainer className="right" position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover />
                <Modal show={this.props.show} {...this.props}>
                        <Modal.Header closeButton>
                            <Modal.Title><h6>Edit Work Experience</h6></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Form onSubmit={event => {   event.preventDefault();        this.handleSubmit(this.state)      }}>
                             <FormComponent menuId="10" item={this.props.data} handleChange={this.handleChange} dateChange={this.onChange} design="design2"></FormComponent>
                            <Button variant="outline-primary mr-2" onClick={e => this.props.onHide(e)}>
                            Close
                        </Button>
                        <Button type="submit" variant="primary" onClick={e => this.props.onHide(e)}>
                            Save
                        </Button>
                        </Form>
                        </Modal.Body>
                        <Modal.Footer>
                        
                        </Modal.Footer>
                        
                </Modal>
            </div>
        )
    }
    
}

// export default WorkExp; 
const mapStateToProps = state => ({
    success:state.datas.success
  });
 
export default connect(mapStateToProps, {editData})(EditUniversity);


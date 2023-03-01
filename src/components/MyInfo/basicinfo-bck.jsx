import React, { Component } from 'react';
// import userDetail from '../../services/userDetail'
import { connect } from "react-redux";
import { fetchData } from "../../action/fetchData";

import {Modal, Form, Button} from "react-bootstrap"

class BasicInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show:true,
            data : [], 
            currentAddress:"",
            permanentAddress:"",
            country:"",
            gender:"",
            nationality:"",
            birthDate:"",
            lastname:"",
            firstname:""
        }
        
      }
    
    componentDidMount(){
        this.props.dispatch(fetchData());
    }

    componentDidUpdate(){
        const deep_value = (obj, path) => 
        path
            .replace(/\[|\]\.?/g, '.')
            .split('.')
            .filter(s => s)
            .reduce((acc, val) => acc && acc[val], obj);

        const item = this.props;
        console.log(item)
        this.setState({
            fcurrentAddress:deep_value(item, "personalInfo[0].fcurrentAddress"),
            permanentAddress:deep_value(item, "personalInfo[0].permanentAddress"),
            country:deep_value(item, "personalInfo[0].country"),
            gender:deep_value(item, "personalInfo[0].gender"),
            nationality:deep_value(item, "personalInfo[0].nationality"),
            birthDate:deep_value(item, "personalInfo[0].birthDate"),
            lastname:deep_value(item, "personalInfo[0].lastname"),
            firstname:deep_value(item, "personalInfo[0].firstname")
        })
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
    
        this.setState({
          [name]: value
        })
    }

    handleSubmit = (event) => {
        this.setState({start_date:this.props.start_date})
        let datas = this.state;
        event.preventDefault();
        const apiUrl = 'http://apihrmsuat.91wheels.com/api/employee/edit/personal/11001';
        var bearer = 'Bearer ' + 'eyJhbGciOiJIUzI1NiJ9.W3siaWQiOjEsInVzZXJuYW1lIjoiZ2F1cmF2IiwicGFzc3dvcmQiOiI1ZjRkY2MzYjVhYTc2NWQ2MWQ4MzI3ZGViODgyY2Y5OSIsInJvbGUiOjEsIm9yZ0lkIjoxLCJjcmVhdGVkQnkiOjAsInVwZGF0ZWRCeSI6MSwiY3JlYXRlZE9uIjoiMjAyMC0wNC0zMFQxOToyMDo1Ni4wMDBaIiwidXBkYXRlZE9uIjoiMjAyMC0wNC0zMFQxOToyMDo1OC4wMDBaIn1d.IqR7mfVoWTa93xl0xqCKg4Sd_Gex8CAdtZZ26E250j4';
        const options = {
          method: 'POST',
          headers:{
            'Authorization': bearer,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(datas)
        };
        console.log(datas)
        fetch(apiUrl, options)
          .then(res => {
              res.json()
              console.log(res.json)
            })
          .then(result => {
              console.log(result)
            this.setState({
              response: result
            })
            window.confirm('Lead is added successfully')
          },
          (error) => {
            this.setState({ error });
            alert('fail')
          }
        )
        //this.setState({initialState:this.initialState}); 
    }

    handleEdit = () => {this.setState({show:false})};
    handleCencil = () => {this.setState({show:true})};
    render() {
        const { currentAddress,permanentAddress,country,gender,nationality,birthDate,lastname,firstname } = this.state
        return (
            <div>
               <div className="col-md-12 mx-auto py-2">
                    {this.state.show ? (
                    <>
                    <div className="card d-block p-xl-3 p-2  h-100 shadow-sm">
                        <span className="anchor" id="formComplex"></span>
                        <div className="my-4" />
                        <h6>Basic Information </h6>
                       
                        <div className="row mt-4 pl-3 pr-3">
                            <table className="table-borderless basic-info" style={{width:"100%"}}>
                            <tbody>
                                <tr>
                                    <td>First Name</td>
                                    <td>{deep_value(item, "personalInfo[0].firstname")}</td>
                                    <td>Last Name</td>
                                    <td>{deep_value(item, "personalInfo[0].lastname")}</td>
                                </tr>
                                <tr>
                                    <td>Date of Birth</td>
                                    <td>{deep_value(item, "personalInfo[0].birthDate")}</td>
                                    <td>Nationaltiy</td>
                                    <td>{deep_value(item, "personalInfo[0].nationality")}</td>
                                </tr>
                                <tr>
                                    <td>Gender</td>
                                    <td>{deep_value(item, "personalInfo[0].gender")}</td>
                                    <td>Country</td>
                                    <td>{deep_value(item, "personalInfo[0].country")}</td>
                                </tr>
                                <tr>
                                    <td>Permanent Address</td>
                                    <td>{deep_value(item, "personalInfo[0].permanentAddress")}</td>
                                    <td>Current Address</td>
                                    <td>{deep_value(item, "personalInfo[0].currentAddress")}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                     <div className="form-group row pt-5">
                     <div className="col-lg-12 text-center">
                         <input type="reset" className="btn btn-primary mr-2" onClick={this.handleEdit} defaultValue="Edit" />
                     </div>
                     </div>
                    </>
                ) : (
                    <>
                    <div className="card d-block p-xl-3 p-2  h-100 shadow-sm">
                    <Form onSubmit={this.handleSubmit}>
                        <div className="row mt-4 edit-basicinfo">
                            <div className="col-sm-6 pb-3">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <label htmlFor="firstName">First Name</label>
                                    </div>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" id="firstName" name="firstname" onChange={this.handleChange} defaultValue={deep_value(item, "personalInfo[0].firstname")}/>
                                    </div>
                                </div>
                             </div>
                            <div className="col-sm-6 pb-3">
                                 <div className="row">
                                    <div className="col-sm-3">
                                        <label htmlFor="lastName">Last Name</label>
                                    </div>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" id="lastName" name="lastname" onChange={this.handleChange} defaultValue={deep_value(item, "personalInfo[0].lastname")}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 pb-3">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <label htmlFor="date">Date of Birth</label>
                                    </div>
                                    <div className="col-sm-9">
                                     <input type="text" className="form-control" id="birthdate" name="birthDate" onChange={this.handleChange} defaultValue={deep_value(item, "personalInfo[0].birthDate")}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 pb-3">
                                <div className="row">
                                        <div className="col-sm-3">
                                            <label htmlFor="nationality">Nationality</label>
                                        </div>
                                        <div className="col-sm-9">
                                        <select className="form-control custom-select" id="nationality" name="nationality" onChange={this.handleChange} defaultValue={deep_value(item, "personalInfo[0].nationality")}>
                                            <option>Indian</option>
                                        </select>
                                        </div>
                                    </div>
                            </div>
                            <div className="col-sm-6 pb-3">
                                <div className="row">
                                        <div className="col-sm-3">
                                            <label htmlFor="gender">Gender</label>
                                        </div>
                                        <div className="col-sm-9">
                                        <select className="form-control custom-select" name="gender" id="gender" onChange={this.handleChange} defaultValue={deep_value(item, "personalInfo[0].gender")}>
                                            <option>Male</option>
                                            <option>Female</option>
                                        </select>
                                        </div>
                                    </div>
                            </div>
                            <div className="col-sm-6 pb-3">
                                <div className="row">
                                        <div className="col-sm-3">
                                            <label htmlFor="country">Country</label>
                                        </div>
                                        <div className="col-sm-9">
                                        <select className="form-control custom-select" id="country" name="country" onChange={this.handleChange} defaultValue={deep_value(item, "personalInfo[0].country")}>
                                            <option>India</option>
                                        </select>
                                        </div>
                                    </div>
                            </div>
                            <div className="col-sm-6 pb-3">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <label htmlFor="permanentAddress">Permanent Address</label>
                                    </div>
                                    <div className="col-sm-9">
                                        <textarea type="text" name="permanentAddress" onChange={this.handleChange} defaultValue={deep_value(item, "personalInfo[0].permanentAddress")} className="form-control" id="permanentAddress"> </textarea>
                                    </div>
                                </div>
                             </div>
                             <div className="col-sm-6 pb-3">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <label htmlFor="localsAddress">Local Address</label>
                                    </div>
                                    <div className="col-sm-9">
                                        <textarea type="text" name="currentAddress" onChange={this.handleChange} defaultValue={deep_value(item, "personalInfo[0].currentAddress")} className="form-control" id="localAddress"> </textarea>
                                        &nbsp; &nbsp;  <input type="checkbox" className="form-check-input" name="rememberInput" id="rememberInput" /> <span>Same as permanent address</span>
                                    </div>
                                </div>
                             </div>
                             <Button variant="primary" type="submit" >
                                    Apply
                                </Button>
                            </div>
                            </Form>
                        </div>
                        <div className="form-group row pt-5 edit-basicinfo">
                            <div className="col-lg-12 text-center">
                                <input type="reset" className="btn btn-outline-primary mr-2" onClick={this.handleCencil} defaultValue="Cancel" />
                                <input type="button" className="btn btn-primary" defaultValue="Save" />
                            </div>
                        </div>
                        </>
                        )}
                    </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    item: state.datas.item
  });
  
export default connect(mapStateToProps)(BasicInfo);
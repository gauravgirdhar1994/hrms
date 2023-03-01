/* eslint-disable */
import React, { Component } from "react";
import { Col, Card, Row, Table } from "reactstrap";
import config from "../../../config/config";
/* import config from "../../config/config";
import { fetchData } from "../../action/fetchData"; */
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
// import loader from "../../loader.gif";
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from "axios";
//import Moment from "moment";
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import { IoIosCard, IoIosCloudDownload } from "react-icons/io";
import { Redirect } from "react-router-dom";
const BEARER_TOKEN = localStorage.getItem("userData");
class CoverDeails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            planId:props.planId,
            formData:{
                dental: null,
                dental_cover: null,
                maternity: null,
                maternity_cover: null,
                optical: null,
                optical_cover: null,
                coverChecked: false
            },
            coverDetails:[],
            redirect: false
        }
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        this.getCoverDetails()
    }
    getCoverDetails() {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        const options = {
            method: 'GET',
            headers: {
                'Authorization': bearer
            }
        };
        this.setState({
            loading: true
        })
        //   fetch(BaseURL, options)
        fetch(config.API_URL + "/insurance/plan/list-insurance-covers/" + this.state.planId, options)
            .then(res => res.json())
            .then(res => {
                // this.componentDidMount();
                if (res.success) {
                    console.log('coverDetails ====> ', res.coverDetails)

                    if(res.coverDetails.length>0){
                        let details = {}
                        for(let cover of res.coverDetails) {
                            if(cover.cover_type==1){
                                details.dental = cover.cover
                                details.dental_cover = cover.description
                            } else if(cover.cover_type==2){
                                details.maternity = cover.cover
                                details.maternity_cover = cover.description
                            } else if(cover.cover_type==3){
                                details.optical = cover.cover
                                details.optical_cover = cover.description
                            }
                        }
                        console.log('det ====> ', details)
                        /* const dentalDet = res.coverDetails[0];
                        const meternityDet = res.coverDetails[1];
                        const opticalDet = res.coverDetails[2]; */
                        this.setState({
                            formData: details,
                            loading: false,
                            show: false
                        })
                    }
                    // console.log('res.covMapList ===> ', res.covMapList)
                    // console.log('res.mappingList ===> ', this.state.mappingList)
                }
            })
            .catch(error => { console.log(error) })

    }
    handleChange = (event) => {
        const name = event.target.name;
        var value = "";
        if(name == 'dental')
        {
            value = event.target.checked?1:0  
        } else if(name == 'maternity'){
            value = event.target.checked?1:0  
        } else if(name == 'optical') {
            value = event.target.checked?1:0  
        } else { 
            value = event.target.value; }
        this.setState({
            formData: {
                ...this.state.formData,
                [name]: value
            },
            coverChecked: true
        })
    }
    handleSubmit = (e) => {
        e.preventDefault()
        console.log('state ===> ', this.state.formData)
        console.log('this.planId ==> ', this.state.planId);
        let Insurancedata = {};
        Insurancedata.dental = this.state.formData.dental
        Insurancedata.dental_cover = this.state.formData.dental_cover
        Insurancedata.maternity = this.state.formData.maternity
        Insurancedata.maternity_cover = this.state.formData.maternity_cover
        Insurancedata.optical = this.state.formData.optical
        Insurancedata.optical_cover = this.state.formData.optical_cover
        Insurancedata.planId = this.state.planId
        console.log(Insurancedata);

        var bearer = 'Bearer ' + BEARER_TOKEN;

        if (this.state.coverChecked) {
            axios.post(config.API_URL + "/insurance/plan/add-covers", Insurancedata,
            {
                headers: {
                    Authorization: 'Bearer ' + BEARER_TOKEN
                }
            })
            .then(res => {
                if (res.data.success) {
                    // this.getMappingDetailList();
                    this.setState({redirect: true});
                }
                alert(res.data.message);
            }).catch(error => {
                console.log('ALLOW ===> ', error)
                // reject(error)
                // this.setState({ disableBtn: false });
            });
        }
        else {
            alert('Please select at least one cover.');
        }
        
    }
    render() {

        if(this.state.redirect){
            this.setState({redirect:false});
            return <Redirect to={{
                pathname: "insurance",
                state:{alertMessage: "Plan details saved successfully!"},
            }}/>
        }

        console.log('formData =======> ', this.state.formData)
        const formData = this.state.formData;
        return (
            <>
                <form onSubmit={this.handleSubmit}>
                  <Row>
                    <div class="col-sm-12 pb-3">
                        <div class="row">
                            <div class="col-sm-4">
                                <input type="checkbox" name="dental" style={{marginRight:'10px'}}onChange={this.handleChange} checked={formData.dental==1?true:false}/>
                                <label for="ticket_type">Dental Cover</label>
                            </div>
                            <div class="col-sm-6">
                                <input type="text" name="dental_cover" className="form-control" onChange={this.handleChange} value={formData.dental_cover}/>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-12 pb-4">
                        <div class="row">
                            <div class="col-sm-4">
                                <input type="checkbox" name="maternity" style={{marginRight:'10px'}} onChange={this.handleChange} checked={formData.maternity==1?true:false}/>
                                <label for="ticket_type">Maternity Cover</label>
                            </div>
                            <div class="col-sm-6">
                                <input type="text" name="maternity_cover" className="form-control" onChange={this.handleChange}  value={formData.maternity_cover}/>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-12 pb-3">
                        <div class="row">
                            <div class="col-sm-4">
                                <input type="checkbox" name="optical" style={{marginRight:'10px'}} onChange={this.handleChange} checked={formData.optical==1?true:false}/>
                                <label for="ticket_type">Optical Cover</label>
                            </div>
                            <div class="col-sm-6">
                                <input type="text" name="optical_cover" className="form-control" onChange={this.handleChange}  value={formData.optical_cover}/>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-12 pb-3 text-center">
                        <input type="submit" class="btn btn-primary" value="Save & continue" onClick={this.handleSubmit} style={{ marginLeft: '10px' }} />
                    </div>
                </Row>
                </form>
            </>
        )
    }
}

export default CoverDeails; 
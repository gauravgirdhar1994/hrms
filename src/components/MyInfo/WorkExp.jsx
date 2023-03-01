import React, { Component } from 'react';
import { connect } from "react-redux";
import { editData } from "../../action/editData";
import { Modal, Form, Button } from "react-bootstrap"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import { DataFetch } from '../../services/DataFetch'
import loader from '../../loader.gif';

import "react-datepicker/dist/react-datepicker.css";
import EditWowrkExp from './EditWowrkExp';
import AddWorkExp from './AddWorkExp';
import moment from 'moment';
import Moment from "react-moment";
import momentDurationFormatSetup from "moment-duration-format";
import config from '../../config/config';
const BEARER_TOKEN = localStorage.getItem("userData");


class WorkExp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            addshow: false,
            data: [],
            response: "",
            createdBy: "",
            id: "",
            date: "",
            editData: ""
        }
    }

    componentDidMount() {
        let empId = this.props.editId;
        // if (this.props.editId) {
        //     empId = this.props.editId;
        // }
        // else {
        //     empId = localStorage.getItem("employeeId")
        // }
        const apiUrl = config.API_URL + '/employee/info/view/work/' + empId;
        var bearer = 'Bearer ' + BEARER_TOKEN;
        DataFetch(apiUrl, bearer).then((result) => {
            let responseJson = result;
            console.log(responseJson)
            this.setState({ data: responseJson })
        })
        // this.refreshList()
    }

    refreshList = (response) => {
        if(response){
            this.setState({ data: response.data })            
        }
    }
    componentDidUpdate(prevProps, prevState) {
        // this.refreshList()
    }

    monthDiff = (DOJ, today) => {
        var totalMonths =  parseInt(moment(DOJ).diff(moment(today), 'months'));      
        var totalDuration = moment.duration(totalMonths, "months").format();      
        console.log('TotalDuration', totalDuration);
        if(totalDuration.search('1y') > -1) {
            console.log('TotalDuration', totalDuration);
           totalDuration = totalDuration.replace("1y", "1 Year,");
        }
        
        if(totalDuration.search('1m') > -1){
            console.log('TotalDuration', totalDuration);
          totalDuration = totalDuration.replace("1m", "1 Month");
        }
        totalDuration = totalDuration.replace('seconds', 'years');
        // totalDuration = totalDuration.replace('-', '');
        return totalDuration;
    }

    handleShow = () => this.setState({show:true});
    
    handleClose = () => this.setState({ show: false });
    onChange = date => this.setState({ date })

    handleaddClose = () => {
        console.log(49,'handle close');
        this.setState({addshow:false});
      }    
      
    handleaddShow = () => this.setState({addshow:true});
      
    render() {
        const { data, show, editData, response } = this.state;
        if (data && data.workInfo) {
            return (
                <div>
                    <div className="card d-block p-xl-3 p-2  h-100 shadow-sm">
                        <span className="anchor" id="formComplex"></span>
                        <div className="my-4" />
                        <div className="d-flex justify-content-between mb-1">
                            <h6>Work Experience</h6>
                            <a href="javascript:void(0)" onClick={() => this.setState({ addshow: true })}>+ Add Experience</a>
                        </div>
                        {data.workInfo.map(datas => (
                            <div className="list-item" key={datas.id}>
                                <h6>{datas.designation}</h6>
                                <p><strong>{datas.employerName}</strong></p>
                                <p>{moment(datas.startDate).format(config.EXP_DATE_FORMAT)} - {moment(datas.endDate).format(config.EXP_DATE_FORMAT)} . {this.monthDiff(new Date(datas.endDate),new Date( datas.startDate))}</p>
                                <p className="mb-2">{datas.location}</p>
                                <p>{datas.jobDetails}</p>
                                <a href="javascript:void(0)" onClick={() => this.setState({ show: true, editData: datas })}>Edit</a>
                            </div>

                        ))}
                        {this.state.editData ? (
                             <EditWowrkExp onHide={this.handleClose} show={this.state.show} empId = {this.props.editId} func={this.refreshList} data={this.state.editData} />
                        ) : ''}
                       
                        <AddWorkExp onHideAdd={this.handleaddClose} showAdd={this.state.addshow} empId = {this.props.editId} func={this.refreshList}/>
                        
                    </div>
                </div>
            )
        }
        return (
            <img src={loader} className="App-logo" alt="logo" />
        );
    }
}

// export default WorkExp;

export default connect("", { editData })(WorkExp);
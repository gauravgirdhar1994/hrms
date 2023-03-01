import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Card, Table } from 'reactstrap';
import { Modal, Button, ProgressBar } from "react-bootstrap"
import moment from 'moment';
import config from '../../config/config';
// import Moment from 'react-moment';
const BEARER_TOKEN = localStorage.getItem("userData");


class LeadsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leads: [],
      loading: false
    }
  }

  componentDidMount() {
    this.getAllLeads()
  }
  getAllLeads() {
    this.setState({ loading: true })
    axios.get(config.API_URL + '/leads',
      {
        headers: {
          Authorization: 'Bearer ' + BEARER_TOKEN
        }
      })
      .then(res => {
        console.log(res)
        var leads = res.data.leads;
        this.setState({
          leads: leads,
          loading: false
        })
      }).catch(error => {
        console.log('ALLOW ===> ', error)
      });
  }
  loadTable() {
    if (!this.state.loading) {
      if (this.state.leads.length > 0) {
        return this.state.leads.map((lead) => {
          return (
            <tr>
              <td>{lead.id}</td>
              <td>{lead.sourceId==1?"Website":"Auto-generated"}</td>
              <td>{lead.subSourceId==1?"Quote Request":"Call Back"}</td>
              <td>{lead.personName}</td>
              <td>{lead.personEmail}</td>
              <td>{lead.personPhone}</td>
              <td>{this.insuranceFor(lead.insuranceFor)}</td>
              <td>{lead.campaignId==1?"Health Insurance":""}</td>
             {/*  <td>{lead.cityId}</td> */}
              <td>{(lead.status == 1) ? 'Pending' : 'Closed'}</td>
              <td>{lead.createdOn!=null?moment(lead.createdOn).format(config.HEADER_DATE_FORMAT):''}</td>
              <td>
                <span
                  className="pnk"
                  onClick={() => this.props.getLeadDetails(lead.id)}
                  style={{ cursor: "pointer" }}
                >
                  View Lead
                </span>
              </td>
            </tr>
          );
        })
      } else {
        return <tr><td colSpan="10">No Record Found.</td></tr>
      }
    } else {
      return <tr><td colSpan="10">Loading</td></tr>
    }
  }
  insuranceFor(i){
    let ifor = '';
    if(i==1){
      ifor = 'Me'
    } else if(i==2) {
      ifor = 'Couple'
    } else if(i==3) {
      ifor = 'Family'
    } else if(i==4) {
      ifor = 'Other Members'
    }  
    return ifor 
  }
  render() {
    return (
      <>
        <div className="col-md-12 mx-auto py-2">
          <Card className="card d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
            <div className="container">
              <div className="row">
                <div className="col-sm-12 pb-3">
                  <div className="row">
                    <h4 className="font-16 hblack  border-none">
                      Leads
                  </h4>
                    <Table className="leaveTable">
                      <thead>
                        <tr>
                          <th>Lead ID</th>
                          <th>Source</th>
                          <th>Sub Source</th>
                          <th>Fullname</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Insurance For</th>
                          <th>Campaign</th>
                          {/* <th>City</th> */}
                          <th>Status</th>
                          <th>Created On</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.loadTable()}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </>
    );
  }
}

export default LeadsList;
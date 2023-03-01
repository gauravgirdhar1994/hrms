import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
//import { data } from "./data"
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import {Modal, Button} from "react-bootstrap"
import config from '../../config/config';
import Moment from 'moment';
const BEARER_TOKEN = localStorage.getItem("userData");
class Ticker_raised extends Component {
    constructor(props) {
        super(props);
        this.state = {show:false,ticketRaised:[]}
      }

      handleClose = () => this.setState({show:false});
      handleShow = () => this.setState({show:true});
    
      viewTicket = (cell, row) => {
        return(
            <button type="button" className="btn btn-sm btn-outline-danger ml-2" onClick={this.handleShow}>View Ticket</button>
        )
      }
      removeTicket = (cell, row) => {
        return(
            <button type="button" className="btn btn-sm btn-outline-danger ml-2 ">Remove Ticket</button>
        )
      }
    componentDidMount() {
      this.getTicketData()
    }
    getTicketData()
    {
      var url = config.API_URL+"/ticket/list/dashboard";
      var data=[];
        fetch(url,{
            method:'get',
            withCredentials: true,
            headers: {
                  'Authorization': 'bearer '+BEARER_TOKEN,
              },
            'mode':'cors',
         }).then(res => res.json()).then(res => {             
             //console.log('ticket_raised',res);
            if(res.success==true && (res.ticketDetails.rows).length>0)
            {
                res.ticketDetails.rows.map((obj)=>{
                    data.push({id:obj.id,type:obj.ticket_type_name,title:obj.title,
                    status:obj.ticket_status_text,
                    timestamp:(obj.opened_on)?Moment(obj.opened_on).format(config.TICKET_DATE_FORMAT):'',
                    raised_by:obj.openedByUser, assigned_to:obj.assigneeName,action:'View Detail'})
                })
            }
            this.setState({ticketRaised:data});
        })
    }
    GoToTicketPage(cell,row)
    {
        return (<div><a href={config.BASE_URL_FRONTEND+'/tickets/my-tickets?edit=1&ticket_id='+row['id']}>{cell}</a></div>);
    }
      render() {
        const columnHover = (cell, row, enumObject, rowIndex) => {
    return cell
  }
        return (
        <>
        <div className="d-flex justify-content-between  mb-4 ">
            <h4 className="font-16 pl-3">Ticket Raised <span className="text-success">({this.state.ticketRaised.length})</span> </h4>
            <a href="/tickets/create-tickets" className="btn btn-sm btn-outline-danger ml-2" target="_blank">+ Raise New Ticket</a>
        </div>
        
          <BootstrapTable data={this.state.ticketRaised} striped={true} hover={true}>
          <TableHeaderColumn dataField="id" dataSort  isKey={true} dataAlign="center" >Id</TableHeaderColumn>
            <TableHeaderColumn dataField="type"  dataAlign="center" >Type</TableHeaderColumn>
            <TableHeaderColumn dataField="title" dataAlign="center" >Title</TableHeaderColumn>
            <TableHeaderColumn dataField="status" dataAlign="center" dataSort={true}>Status</TableHeaderColumn>
    
            <TableHeaderColumn dataField="timestamp" dataAlign="center" columnTitle={columnHover}>Ticked raised on</TableHeaderColumn>
            <TableHeaderColumn dataField="raised_by" dataAlign="center" >Raised By</TableHeaderColumn>
            <TableHeaderColumn dataField="assigned_to" dataAlign="center"  columnTitle={columnHover}>Assigned To</TableHeaderColumn>
            <TableHeaderColumn dataField="action" dataAlign="center" dataFormat={this.GoToTicketPage}>Action</TableHeaderColumn>
    
            {/* <TableHeaderColumn dataAlign="center" dataFormat={ this.viewTicket }></TableHeaderColumn>
            <TableHeaderColumn dataAlign="center" dataFormat={ this.removeTicket }></TableHeaderColumn> */}
          </BootstrapTable>
          <a href="/tickets/my-tickets" 
            className="btn btn-sm btn-outline-danger ml-2" 
            target="_blank"
            style={{float: "right",margin: "10px 0px"}}>View More Tickets...</a>
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={this.handleClose}>
                Save Changes
            </Button>
            </Modal.Footer>
      </Modal>
        </>
        );
      }
}

export default Ticker_raised;
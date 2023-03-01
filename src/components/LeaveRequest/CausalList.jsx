import React, { Component } from 'react';
import { Row, Col, Card, Table } from 'reactstrap';
import { Modal, Button } from "react-bootstrap";
import moment from 'moment';
import LeaveApply from '../../components/Attendance/LeaveApply';
import config from '../../config/config';
const BEARER_TOKEN = localStorage.getItem("userData");

class CausalList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      events: [],
      start_date: '',
      end_date: '',
      status: {},
      datas: []
    };
    this.withDrawLeave = this.withDrawLeave.bind(this);
    this.refreshEvent = this.refreshEvent.bind(this);
  }

  componentDidMount = () => {
    this.refreshEvent()

  }

  refreshEvent = () => {
    var url = config.API_URL + '/leave-list';
    var bearer = 'Bearer ' + BEARER_TOKEN;
    fetch(url, {
      method: 'GET',
      withCredentials: true,
      headers: {
        'Authorization': bearer,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      'mode': 'cors'
    }).then(res => res.json()).then(res => {
      console.log('casual list leave lisst', res)
      if (res.result.appliedLeaveRecord && res.result.appliedLeaveRecord.length > 0) {
        this.setState({ items: res.result.appliedLeaveRecord });
        /* this.setState({ events: this.state.events.concat(res.result.appliedLeaveRecord.map((str) => {
          return str;
        })) */
        this.setState({ status: res.result.leaveStatus });
        this.setState({
          events: res.result.appliedLeaveRecord.map((str) => {
            return str;
          })
        })
        console.log(this.state.status);
      }
      console.log("casual list data", this.state.events)
    })
      .catch(error => { console.log(error) });
  }
  handleClose = () => {
    this.setState({ show: false })
  };
  handleShow = () => this.setState({ show: true });

  roundToOne(num) {
    num = parseFloat(num);
    return +(Math.round(num + "e+1") + "e-1");
  }

  refreshDohunt = () => {
    this.props.chartRefresh();
  }

  withDrawLeave(ticket_id) {
    document.getElementById('withdraw').innerHTML = 'Processing...'
    var url = config.API_URL + "/ticket/update/leave/" + ticket_id;
    fetch(url, {
      method: 'post',
      withCredentials: true,
      headers: {
        'Authorization': 'bearer ' + BEARER_TOKEN,
      },
      'mode': 'cors',
    }).then(res => res.json()).then(res => {
      console.log('ticket/update/leave', res)
      if (res.success == true) {
        this.state.events = [];
        this.refreshEvent();
        this.refreshDohunt();

      }

    })
  }
  render() {

    return (
      <>
        <Card className="card d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
          <div className="d-flex justify-content-between  mb-4 ">
            <h4 className="font-16 pl-3">My Leaves History</h4>
            <button type="button" className="btn btn-sm btn-outline-danger ml-2" onClick={this.handleShow}>+ Raise Leave Request</button>
          </div>

          <Table className="leaveTable">
            <thead>
              <tr>
                <th>Applied On</th>
                <th>From</th>
                <th>To</th>
                <th>Leave Type</th>
                <th>No. of Days</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.state.events.map(obj => {

                return (
                  <tr>
                    <td>{obj.opened_on ? moment(obj.opened_on).format(config.DATE_FORMAT) : ''}</td>
                    <td>{obj.start_date ? moment(obj.start_date).format(config.DATE_FORMAT) : ''}</td>
                    <td>{obj.end_date ? moment(obj.end_date).format(config.DATE_FORMAT) : ''}</td>
                    <td><span className="blueText">{obj.leaveName}</span></td>
                    <td>{this.roundToOne(obj.number_of_days)} {(obj.number_of_days > 1) ? 'Days' : 'Day'}</td>

                    <td><span className={(obj.ticket_status == this.state.status['Withdrawn']) ? 'Withdraw' : ((obj.ticket_status == this.state.status['Pending']) ? 'Pending' : (obj.ticket_status == this.state.status['Approved']) ? 'Approved' : 'Rejected')}>{(obj.ticket_status == this.state.status['Withdrawn']) ? 'Withdraw' : ((obj.ticket_status == this.state.status['Pending']) ? 'Pending' : (obj.ticket_status == this.state.status['Approved']) ? 'Approved' : 'Rejected')}</span></td>
                    <td>{(obj.ticket_status == this.state.status['Pending'] && obj.ticket_status != 0) ? <button type="button" id='withdraw' className="btn btn-sm btn-outline-danger mr-15" onClick={() => this.withDrawLeave(obj.ticket_id)}>Withdraw</button> : ''}</td>
                  </tr>
                )
              })}


            </tbody>
          </Table>
        </Card>

        { /*<Modal show={this.state.show} onHide={this.handleClose}>
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
      </Modal>*/}
        <LeaveApply show={this.state.show} onHide={this.handleClose} start_date={new Date()} refreshEvent={this.props.chartRefresh} refreshList={this.refreshEvent} />
      </>
    );
  }
}

export default CausalList;

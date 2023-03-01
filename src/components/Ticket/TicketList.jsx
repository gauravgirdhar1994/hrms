import React, { Component } from "react";
import { Col, Card, Row } from "reactstrap";
import config from '../../config/config';


class TicketList extends Component {
  constructor() {
    super();
    this.state = {
      orgId: localStorage.getItem("orgId"),
    };
  }

  renderTickets(ticket) {
    return (

      <Row>

        <Card className="card ticketList d-block pl-4 pr-4 pt-4 pb-4 br-3 mb-4 shadow-sm card card">
          <div className="">
            <span className="postBy">
              Posted by - {ticket.openedByUser} {this.state.orgId == 0 ? `(${ticket.orgName})` : ''}
            </span>
          </div>

          <div className="">
            <span className="arr">{ticket.title}</span>
          </div>

          <div className="">
            <span className="forgetPunch">
              {/* {ticket.description ? ticket.description.substring(0, 50) : ''}…. <a href="javascript:void(0)" onClick={e => this.props.showTicketDetails(e, ticket.id)}>.more</a> */}

              {ticket.description ? ticket.description.substring(0, 50) : ''}…<span style={{ cursor: "pointer", color: "blue" }} onClick={e => this.props.openTicketDetails(e, ticket.id)}>.more</span>
            </span>
          </div>

          <ul>
            <li className="d-flex">
              <div>
                <span>Ticket ID</span>
                <span>{ticket.id}</span>
              </div>
              <div>
                <span>Ticket Type</span>
                <span>{ticket.ticket_type_name}</span>
              </div>
              <div>
                <span>Assigned To</span>
                <span>{ticket.assigneeName}</span>
              </div>
              <div>
                <span>Status</span>
                <span className="priority">
                  {ticket.ticket_status_text}
                </span>
              </div>
              <div>
                <span>Priority</span>
                <span className="critical">{ticket.priority_text}</span>
              </div>
              {ticket.salaryCert && ticket.opened_by == localStorage.getItem("employeeId") ? (
                <div>
                  {/* <span>Priority</span> */}
                  <span className="critical"><a href={config.BASE_URL + ticket.salaryCert} target="_blank" download>Download</a></span>
                </div>
              ) : ''}
            </li>
          </ul>
        </Card>

      </Row>

    );
  }
  showLoading() {
    return (

      <Row>
        <Card className="card ticketList d-block pl-4 pr-4 pt-4 pb-4 br-3 mb-4 shadow-sm card card">
          <div className="">Loading tickets...</div>
        </Card>
      </Row>

    );
  }
  noRecordFound = () => {
    return (

      <Row>
        <Card className="card ticketList d-block pl-4 pr-4 pt-4 pb-4 br-3 mb-4 shadow-sm card card">
          <div className="">No Ticket Found!</div>
        </Card>
      </Row>

    );
  };
  render() {
    const { isLoading, tickets } = this.props;
    let ticketList = "";
    if (isLoading) {
      ticketList = this.showLoading();
    } else {
      if (tickets.length > 0) {
        ticketList = tickets.map(ticket => {
          return this.renderTickets(ticket);
        });
      } else {
        ticketList = this.noRecordFound();
      }
    }

    return <>{ticketList}</>;
  }
}

export default TicketList;

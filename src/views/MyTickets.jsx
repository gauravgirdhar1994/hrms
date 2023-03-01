import React, { Component } from "react";
// import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { Link, useLocation, BrowserRouter as Router } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import queryString from 'query-string';
import moment from 'moment';
import axios from "axios";
import { fetchData } from "../../src/action/fetchData";
import Filter from "../components/Ticket/Filter";
import TicketList from "../components/Ticket/TicketList";
import TopFilter from "../components/Ticket/TopFilter";
import config from '../../src/config/config';
import Details from "../components/Ticket/Details";
import AlertBox from "../components/AlertBox/AlertBox";
import { cssNumber } from "jquery";


const BEARER_TOKEN = 'Bearer ' + localStorage.getItem("userData");
const ORG_ID = localStorage.getItem("orgId");

class MyTickets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMyTicketComponent: true,
      showTicketDetailComponent: false,
      isTicketDetailLoaded: false,
      tickets: {},
      ticketsTypes: [],
      ticketDetails: {},
      ticketStatus: [],
      orgList: [],
      ticketFilter: '',
      applyFilter: false,
      isLoading: true,
      showToast: true,
      showPopUp: false,
      alertMessage: '', showAlertBox: false,
      filters: {
        main: { ticket_list: 'my-tickets' },
        topFilters: { ticket_list: 'all' },
        leftFilters: {}
      },
      ticketSummaryDetails: [],
      countriesArr: [],
      nationalityArr: []
    };
    this.getTicketDetails = this.getTicketDetails.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.showTicketDetails = this.showTicketDetails.bind(this);
    this.getTicketTypesStatus = this.getTicketTypesStatus.bind(this);
    this.getTicketTypes = this.getTicketTypes.bind(this);
    this.showTicketSummaryDetails = this.showTicketSummaryDetails.bind(this);
    this.goBackToMyTickets = this.goBackToMyTickets.bind(this);
    this.refreshListDetail = this.refreshListDetail.bind(this);
  }
  showTicketDetails(e, ticket_id) {
    const TICKET_API_URL = config.API_URL + `/ticket/get-details/${ticket_id}`;
    const options = {
      method: "GET",
      headers: {
        Authorization: BEARER_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    };
    fetch(TICKET_API_URL, options)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // console.log('ticketDetails ====> ', data.ticketDetails);
          this.setState({
            showPopUp: true,
            ticketDetails: data.ticketDetails[0]
          })
        } else {
          alert('No details found.');
        }
      }
      );


  }

  handleClose() {
    this.setState({ showPopUp: false });
  }
  renderPopUp() {
    const ticketDetails = this.state.ticketDetails;
    // console.log('ticketDetails-=-=-=-> ', ticketDetails.id);
    return (
      <Modal show={this.state.showPopUp} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ticket Details: (Ticket ID: #{ticketDetails.id})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="leaveTable">
            <tbody>
              <tr>
                <td>Title Type</td>
                <td>{ticketDetails.ticket_type_name}</td>
              </tr>
              <tr>
                <td>Priority</td>
                <td>{ticketDetails.priority_text}</td>
              </tr>
              <tr>
                <td>Title</td>
                <td>{ticketDetails.title}</td>
              </tr>
              <tr>
                <td>Description</td>
                <td>{ticketDetails.description}</td>
              </tr>
              <tr>
                <td>Due Date</td>
                <td>{ticketDetails.due_date}</td>
              </tr>
              <tr>
                <td>Ticket Status</td>
                <td>{ticketDetails.ticket_status_text}</td>
              </tr>
              <tr>
                <td>Assigned To</td>
                <td>{ticketDetails.assigneeName}</td>
              </tr>
              <tr>
                <td>Raised By</td>
                <td>{ticketDetails.openedByUser}</td>
              </tr>
              <tr>
                <td>Raised On</td>
                <td>{moment(ticketDetails.opened_on).format('MMM DD, YYYY hh:ss A')}</td>
              </tr>
              <tr>
                <td>Closed By</td>
                <td>{ticketDetails.closedByUser}</td>
              </tr>
              <tr>
                <td>Closed On</td>
                <td>{ticketDetails.closed_on ? moment(ticketDetails.closed_on).format('MMM DD, YYYY hh:ss A') : ''}</td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
  componentDidMount() {


    let url = this.props.location.search;
    let params = queryString.parse(url);
    const urlParams = new URLSearchParams(url);

    if (urlParams.get('ticket_type')) {
      // console.log('filter name => ', urlParams.get('ticket_type'));
      this.setState({
        applyFilter: true,
        ticketFilter: urlParams.get('ticket_type')
      })
      const filters = {
        ticket_list: 'all',
        ticket_type: 'PROFILE_UPD'
      }
      const filterType = 'topFilters'

      this.getTicketDetails(filters, filterType);
    } else {
      this.getTicketDetails();
    }
    // console.log('params==>', params);
    if ((params.edit || params.view) && params.ticket_id) {
      /* this.setState({
        ...this.state,
        showMyTicketComponent: false,
        showTicketDetailComponent: true
      }); */
      this.showTicketSummaryDetails(true, params.ticket_id);
    }


    this.getTicketTypes();
    if (ORG_ID == 0) {
      this.getOrganizations()
    }

    if (typeof this.props.location.state != 'undefined') {
      console.log('this.props ==> alert', this.props, this.props.location.state.ticketMessage);
      this.setState({
        alertMessage: this.props.location.state.ticketMessage,
        showAlertBox: true
      });
    }
    this.getCountries();
  }
  getCountries() {
    axios.get(config.API_URL + '/common/countries', { headers: { Authorization: 'bearer ' + BEARER_TOKEN } })
      .then(r => {

        if (r.status == 200) {
          var arrCountry = [];
          var arrCountry1 = [];

          for (var k = 0; k < r.data.Countries.length; k++) {
            arrCountry.push(<option key={r.data.Countries[k].id} value={r.data.Countries[k].id}> {r.data.Countries[k].country} </option>);
            arrCountry1[r.data.Countries[k].id] = r.data.Countries[k].country;
          }
          this.setState({ countriesArr: r.data.countriesArr, nationalityArr: r.data.nationalityArr });
        }
      }).catch((error) => {
        console.log("API ERR: ");
        console.error(error);
        // res.json({ error: error });
      });
  }
  getOrganizations() {
    const TICKET_API_URL = config.API_URL + "/organizations/list";
    const options = {
      method: "GET",
      headers: {
        Authorization: BEARER_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    };
    fetch(TICKET_API_URL, options)
      .then(response => response.json())
      .then(data => {
        console.log('data => ', data);
        if (data.success) {
          this.setState({
            orgList: data.organizations.rows
          })
        } else {
          /* this.setState({
            ticketStatus: []
          }) */
        }
      }
      );
  }
  getTicketTypesStatus(ticket_type) {
    const TICKET_API_URL = config.API_URL + "/ticket/list/status/" + ticket_type;
    const options = {
      method: "GET",
      headers: {
        Authorization: BEARER_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    };
    fetch(TICKET_API_URL, options)
      .then(response => response.json())
      .then(data => {
        // console.log('data => ', data);  
        if (data.success) {
          this.setState({
            ticketStatus: data.ticketStatus
          })
        } else {
          /* this.setState({
            ticketStatus: []
          }) */
        }
      }
      );
  }
  getTicketTypes(orgId = "") {
    const TICKET_API_URL = config.API_URL + "/ticket/types?_q=all" + (orgId != "" ? "&org=" + orgId : "");
    const options = {
      method: "GET",
      headers: {
        Authorization: BEARER_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    };
    fetch(TICKET_API_URL, options)
      .then(response => response.json())
      .then(data => {
        // console.log('data => ', data);  
        if (data.success) {
          this.setState({
            ticketsTypes: data.ticketTypes
          })
        } else {
          this.setState({
            ticketsTypes: []
          })
        }
      }
      );
  }
  getQueryString(filters) {
    return Object.entries(filters).map(([key, value]) => {
      return value ? `&${key}=${value}` : '';
    }).join('');
  }
  prepareQueryString(filters, filterType) {

    // console.log('filters ========> ', filters);

    let allFilters = this.state.filters;
    console.log('allFilters==========> ', allFilters)
    let queryStr = '';

    if (filterType == 'topFilters') {
      allFilters.topFilters = filters;
    } else if (filterType == 'leftFilters') {
      allFilters.leftFilters = filters;
    } else if (filterType == 'All') {
      allFilters.topFilters = allFilters.topFilters;
      allFilters.leftFilters = allFilters.leftFilters;
    } else {
      allFilters.topFilters = { ticket_list: 'all' };
      allFilters.leftFilters = {};
      // queryStr = 'ticket_list=my-tickets';
    }

    // console.log('allFilters ========> ', allFilters);
    this.setState({ filters: allFilters });
    console.log('allFilters_topFilters =======> ', allFilters);
    if (!allFilters.topFilters.ticket_list) {
      allFilters.topFilters = { ticket_list: 'my-tickets' };
    }
    queryStr += this.getQueryString(allFilters.topFilters);
    queryStr += this.getQueryString(allFilters.leftFilters);

    // console.log('queryStr =>', queryStr );
    return queryStr;

  }
  getTicketDetails(filters = {}, filterType = '') {

    const queryStr = this.prepareQueryString(filters, filterType);

    const TICKET_API_URL = config.API_URL + `/ticket/list?${queryStr}`;
    const options = {
      method: "GET",
      headers: {
        Authorization: BEARER_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    };
    fetch(TICKET_API_URL, options)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          this.setState({
            //   ticketCount: data.ticketDetails.tickets.count,
            tickets: data.ticketDetails.tickets.rows,
            // ticketsTypes: data.ticketDetails.ticketTypes,
            isLoading: false
          })
        } else {
          this.setState({
            //   ticketCount: data.ticketDetails.tickets.count,
            tickets: {},
            // ticketsTypes: [],
            isLoading: false
          })
        }
      }
      );
  }
  showToastMessage(toastMessage) {
    /* toast(toastMessage, { autoClose: 3000 }) */
    // this.setState({alertMessage: toastMessage, showAlertBox: true})
  }
  showTicketSummaryDetails(e, ticket_id) {

    const TICKET_API_URL = config.API_URL + `/ticket/summary/${ticket_id}`;
    const options = {
      method: "GET",
      headers: {
        Authorization: BEARER_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    };
    fetch(TICKET_API_URL, options)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.success) {
          this.setState({
            ...this.state,
            showMyTicketComponent: false,
            showTicketDetailComponent: true,
            isTicketDetailLoaded: true,
            ticketSummaryDetails: data.ticketSummary
          })
        } else {
          alert('No details found.');
        }
      }
      );
  }
  goBackToMyTickets(e) {
    this.setState({
      showMyTicketComponent: true,
      showTicketDetailComponent: false
    })
  }
  refreshListDetail() {
    this.getTicketDetails({}, 'All')
  }
  render() {
    const { tickets, ticketsTypes, isLoading } = this.state;
    // console.log('this.state.sTicketDetailLoaded ======> ', this.state.isTicketDetailLoaded, this.state.ticketSummaryDetails);
    console.log('ticketFilter ===> ', this.state.ticketFilter)
    return (
      <>
        <div className="p-2 flex-fill d-flex flex-column page-fade-enter-done">
          {/* <ToastContainer className="right" position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnVisibilityChange
            draggable
            pauseOnHover /> */}
          {this.state.showAlertBox && (
            <AlertBox
              showDialogMessage={this.state.alertMessage} />
          )}

          <Row>

            {this.state.showMyTicketComponent && (
              <>
                <div className="col-lg-12">
                  <Col>
                    <h4 className="font-16  mb-2">My Ticket</h4>
                  </Col>
                </div>

                <div className="col-lg-12 pr-0">
                  <TopFilter applyFilter={this.getTicketDetails} ticketsTypes={this.state.ticketsTypes} ticketStatus={this.state.ticketStatus} ticket_filter={this.state.ticketFilter} getStatus={this.getTicketTypesStatus} setFilters={this.state.filters.topFilters} orgList={this.state.orgList} getTicketTypes={this.getTicketTypes} />
                </div>

                <div className="col-lg-4 col-md-4 col-sm-12">
                  <Filter applyFilter={this.getTicketDetails} setFilters={this.state.filters.leftFilters} />
                </div>

                <div className="col-lg-8 col-md-8 col-sm-12">
                  <TicketList showTicketDetails={this.showTicketDetails} openTicketDetails={this.showTicketSummaryDetails} isLoading={isLoading} tickets={tickets} />
                </div>
              </>
            )}

            {this.renderPopUp()}

            {this.state.showTicketDetailComponent && (
              <div className="col-sm-12">
                <Details isTicketDetailLoaded={this.state.isTicketDetailLoaded} goBackToMyTickets={this.goBackToMyTickets} ticketSummaryDetails={this.state.ticketSummaryDetails} refreshDetail={this.showTicketSummaryDetails} refreshListDetail={this.refreshListDetail} countries={this.state.countriesArr} nationality={this.state.nationalityArr} showToastMessage={this.showToastMessage} />
              </div>
            )
            }
          </Row>
        </div>
      </>
    );
  }
}

export default MyTickets;

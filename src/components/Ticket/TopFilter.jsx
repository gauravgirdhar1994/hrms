import React, { Component } from "react";
import { Col, Card } from "reactstrap";
import { Redirect } from 'react-router-dom'
const ORG_ID = localStorage.getItem("orgId");
class TopFilter extends Component {
  constructor(props) {
    super(props);
    console.log('[top filtr] ===> ', props)
    this.state = {
      ticket_list: "all",
      ticket_type: "",
      ticket_status: "",
      searchBy: "",
      redirect: false
    };
  }
  componentDidMount() {
    console.log("setFilters ===> ", this.props);
    
    
    this.setState(this.props.setFilters);
  }
  componentDidUpdate(prevProps, prevState){
    console.log('updated props', this.props)
    if(this.props.ticket_filter=='profile-update' && this.state.ticket_type==''){
      console.log("filter name ==> ", this.props.ticket_filter);
      let filterBy = {
        org: this.state.org,
        ticket_list: this.state.ticket_list,
        ticket_type: 'PROFILE_UPD',
        ticket_status: this.state.ticket_status,
        searchBy:this.state.searchBy
      };
      this.setState({ ticket_type: 'PROFILE_UPD' });
      // console.log('e.target ===> ', e.target, );
      // const ticket_type_id = e.target[e.target.selectedIndex].getAttribute('dataid')
      // this.props.getStatus(ticket_type_id);
      // this.props.applyFilter(filterBy, "topFilters");
    }
  }
  applyFilterInTopBar(e) {
    // e.preventDefault();

    // console.log("filter name ==> ", e.target.name, e.target.value);
    let filterBy = {};
    if (e.target.name == "ticket_status") {
      filterBy = {
        org: this.state.org,
        ticket_list: this.state.ticket_list,
        ticket_type: this.state.ticket_type,
        ticket_status: e.target.value,
        searchBy: this.state.searchBy != "" ? this.state.searchBy : "",
      };
      this.setState({ ticket_status: e.target.value });
    } else if (e.target.name == "ticket_type") {
      filterBy = {
        org: this.state.org,
        ticket_list: this.state.ticket_list,
        ticket_type: e.target.value,
        ticket_status: this.state.ticket_status,
        searchBy: this.state.searchBy != "" ? this.state.searchBy : "",
      };
      this.setState({ ticket_type: e.target.value });
      const ticket_type = e.target.value != "" ? e.target.value : 0;
      // console.log('e.target ===> ', e.target, );
      const ticket_type_id = e.target[e.target.selectedIndex].getAttribute('dataid')
      this.props.getStatus(ticket_type_id);
    } else if (e.target.name == "ticket_list") {
      filterBy = {
        org: this.state.org,
        ticket_list: e.target.value,
        ticket_type: this.state.ticket_type,
        ticket_status: this.state.ticket_status,
        searchBy: this.state.searchBy != "" ? this.state.searchBy : "",
      };
      this.setState({ ticket_list: e.target.value });
    } else if (e.target.name == "org") {
      filterBy = {
        org: e.target.value,
        ticket_list: this.state.ticket_list,
        ticket_type: this.state.ticket_type,
        ticket_status: this.state.ticket_status,
        searchBy: this.state.searchBy != "" ? this.state.searchBy : "",
      };
      this.setState({ org: e.target.value });
      this.props.getTicketTypes(e.target.value);
    }

    // let filterBy = this.state;
    this.props.applyFilter(filterBy, "topFilters");
  }

  handleSearchInput(e) {
    this.setState({ searchBy: e.target.value });
  }

  filterBySearch(e) {
    e.preventDefault();
    const filterBy = {
      ticket_list: this.state.ticket_list,
      ticket_type: this.state.ticket_type,
      ticket_status: this.state.ticket_status,
      searchBy: this.state.searchBy,
    };
    this.props.applyFilter(filterBy, "topFilters");
  }

  loadTicketType(ticketType) {
    return (
      <option
        value={ticketType.ticket_slug_name}
        dataid={ticketType.id}
        selected={ticketType.ticket_slug_name == this.state.ticket_type}
      >
        {ticketType.ticket_type_name}
      </option>
    );
  }
  loadTicketStatus(status) {
    return (
      <option
        value={status.id}
        selected={status.id == this.state.ticket_status}
      >
        {status.status_name}
      </option>
    );
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/tickets/my-tickets' />
    }
  }
  clearOrderByFilters() {
    if (this.state.orderBy != '' && this.state.orderByField != '') {
      if(this.props.ticket_filter!=='')
      {
        this.setState({
          redirect: true
        })
      } else {
        let filterBy = {
          ticket_list: "all",
          ticket_type: "",
          ticket_status: "",
          org: "",
          searchBy: "",
        };
        this.setState(filterBy);
        
        this.props.applyFilter(filterBy, 'topFilters');
      }
    }
  }
  loadOrgList() {
    if (ORG_ID == 0) {
      return (<div className="col">
        Organizations
        <select
          class="form-control custom-select"
          name="org"
          onChange={(e) => this.applyFilterInTopBar(e)}
        >
          <option value="all" selected={(this.state.org == '')}>
            All
        </option>
          {this.props.orgList.map(org => {
            return <option value={org.id}>{org.orgName}</option>
          })}
        </select>
      </div>
      )

    } else {
      return ""
    }
  }
  render() {
    const { ticketsTypes, ticketStatus } = this.props;
    let ticketList = "";
    if (ticketsTypes.length > 0) {
      ticketList = ticketsTypes.map((ticketType) => {
        return this.loadTicketType(ticketType);
      });
    }
    let statusList = "";
    if (ticketStatus.length > 0) {
      statusList = ticketStatus.map((status) => {
        return this.loadTicketStatus(status);
      });
    }

    return (
      <>
        <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
            <h6>
              <span>Filter By</span> <span onClick={e => this.clearOrderByFilters(e)} style={{ cursor: 'pointer', float: 'right', fontSize: '12px', color: '#ed0f7e' }}>CLEAR ALL</span>
              {this.renderRedirect()}
            </h6>
            <div className="row">
              <div className="d-flex col-lg-6 col-md-12 leftSearchIcon pl-0">

                {this.loadOrgList()}
                <div className="col">
                  {" "}
                  Tickets
                  <select
                    class="form-control custom-select"
                    name="ticket_list"
                    onChange={(e) => this.applyFilterInTopBar(e)}
                  >
                    <option value="all" selected={(this.state.ticket_list == 'all')}>
                      All
                    </option>
                    {ORG_ID != 0 && (
                      <>
                        <option value="my-tickets" selected={(this.state.ticket_list == 'my-tickets')}>
                          Raised By Me
                        </option>
                        <option value="tickets-assigned-to-me" selected={(this.state.ticket_list == 'tickets-assigned-to-me')}>
                          Assigned To Me
                        </option>
                      </>
                    )}
                  </select>
                </div>
                <div className="col">
                  {" "}
                  Ticket Types
                  <select
                    class="form-control custom-select"
                    name="ticket_type"
                    onChange={(e) => this.applyFilterInTopBar(e)}
                  >
                    <option value="" dataid="0">All</option>
                    {ticketList}
                  </select>
                </div>
                <div className="col">
                  {" "}
                  Ticket Status
                  <select
                    class="form-control custom-select"
                    name="ticket_status"
                    onChange={(e) => this.applyFilterInTopBar(e)}
                  >
                    <option value="">All</option>
                    {statusList}
                  </select>
                </div>
              </div>
              <div className="d-flex col-lg-1 leftSearchIcon"></div>

              <form
                className="searchFielter col-lg-5"
                name="search"
                onSubmit={(e) => this.filterBySearch(e)}
              >
                <div className="">
                  Search
                  <div className="row">
                    <div className="col-sm-8">
                      <input
                        class="form-control"
                        type="text"
                        name="search"
                        onChange={(e) => this.handleSearchInput(e)}
                        placeholder="Search..."
                        value={this.state.searchBy}
                      />
                    </div>
                    <div className="col-sm-3">
                      <input
                        class="btn btn-primary"
                        type="button"
                        name="search"
                        value="Search"
                        onClick={(e) => this.filterBySearch(e)}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </Card>      
      </>
    );
  }
}

export default TopFilter;

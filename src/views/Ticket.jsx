import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import Filter from '../components/Ticket/Filter';
import TicketList from '../components/Ticket/TicketList'
import TopFilter from '../components/Ticket/TopFilter'

class Ticket extends Component {
    constructor() {
        super();
      this.state = {       
        };
      }
    render() {   

        return (  
        <>
       <div className="p-2 flex-fill d-flex flex-column page-fade-enter-done"> 
        <Row>
                <div className="col-sm-12">
                    <Col>
                    <h4 className="font-weight-bold font-16  mb-2">My Ticket</h4>
                    </Col>
                </div>

                <div className="col-sm-12">
                    <TopFilter />
                </div>

                <div className="col-sm-3">
                    <Filter />

                </div>

                <div className="col-sm-9">
                   <TicketList />
                    </div>

                    </Row>
           
               </div>               
        </>
        );
    }
}

export default Ticket;
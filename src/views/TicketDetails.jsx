import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import Details from '../components/Ticket/Details';


class TicketDetails extends Component {
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
               <h2>Details Page</h2>
                        <Details />
                </Row>
           
               </div>               
        </>
        );
    }
}

export default TicketDetails;
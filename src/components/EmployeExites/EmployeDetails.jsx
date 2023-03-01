import React, { Component } from "react";
import { Row, Col, Table } from "reactstrap";
import {Card} from "react-bootstrap";

class EmployeDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <>
           
        <Row>            
          <Col>
          <div className="withdrowReg text-center">
                       <p>  Resignation has been successfully submitted! …. <span>Withdraw Resignation</span></p>
           </div>
            <Card className="card ticketList d-block pl-4 pr-4 pt-4 pb-4 br-3 mb-4 shadow-sm card card">
            <h4 className="font-16 hblack  bold">Employee Details</h4>

              <ul className="empExit">
                <li className="d-flex">
                  <div>
                    <label>Employee Name</label>
                    <span>Deepak Gupta</span>
                  </div>
                  <div>
                    <label>Location</label>
                    <span>Gurgaon</span>
                  </div>
                  <div>
                    <label>Resignation Date</label>
                    <span>-</span>
                  </div>
                  <div>
                    <label>Contact Number</label>
                    <span className="">
                    9911364374
                    </span>
                  </div>                 
                </li>
                <li className="d-flex">
                  <div>
                    <label>Employee Name</label>
                    <span>Deepak Gupta</span>
                  </div>
                  <div>
                    <label>Location</label>
                    <span>Gurgaon</span>
                  </div>
                  <div>
                    <label>Resignation Date</label>
                    <span>-</span>
                  </div>
                  <div>
                    <label>Contact Number</label>
                    <span className="">
                    9911364374
                    </span>
                  </div>                 
                </li>

                <li className="d-flex">
                  <div>
                    <label>Employee Name</label>
                    <span>Deepak Gupta</span>
                  </div>
                  <div>
                    <label>Location</label>
                    <span>Gurgaon</span>
                  </div>
                  <div>
                    <label>Resignation Date</label>
                    <span>-</span>
                  </div>
                  <div>
                    <label>Contact Number</label>
                    <span className="">
                    9911364374
                    </span>
                  </div>                 
                </li>

                <li className="d-flex">
                  <div>
                    <label>Employee Name</label>
                    <span>Deepak Gupta</span>
                  </div>
                  <div>
                    <label>Location</label>
                    <span>Gurgaon</span>
                  </div>
                  <div>
                    <label>Resignation Date</label>
                    <span>-</span>
                  </div>
                  <div>
                    <label>Contact Number</label>
                    <span className="">
                    9911364374
                    </span>
                  </div>                 
                </li>
              </ul>
            </Card>
          </Col>
          </Row>   
<Row>
  <Col>
    <Card className="card filterList d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
         <h4 className="font-16 hblack  border-none">Resignation Request</h4>
         <Row>
         <div class="col-sm-6 pb-3">
            <div class="row">
                <div class="col-sm-4">
                    <label for="ticket_type">Select Date of Resignation</label>
                </div>
                <div class="col-sm-6">
                <input type="text" name="" class="form-control cal" id="" />
                </div>
            </div>
        </div>
        <div class="col-sm-6 pb-3">
            <div class="row">
                <div class="col-sm-4">
                    <label for="ticket_type">Select Date of LWD</label>
                </div>
                <div class="col-sm-6">
                <input type="text" name="" class="form-control cal" id="" />
                </div>
            </div>
        </div>
        <div class="col-sm-6 pb-3">
            <div class="row">
                <div class="col-sm-4">
                    <label for="ticket_type">Select Reasion</label>
                </div>
                <div class="col-sm-6">
                    <select class="form-control custom-select" name="reasion" id="reasion">
                        <option value="">Select Reasion</option>
                       
                    </select>
                </div>
            </div>
        </div>
        <div class="col-sm-6 pb-3">
            <div class="row">
                <div class="col-sm-4">
                    <label for="ticket_type">Comment</label>
                </div>
                <div class="col-sm-6">
                   <textarea placeholder="" className="form-control"> </textarea>
                </div>
            </div>
        </div>       
         </Row>
    </Card>
          <Row>
            <Col>
            <Card className="card filterList d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
         <h4 className="font-16 hblack  border-none">No Due Certificate (NDC) List</h4>

         <Table className=" listview">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Created Date</th>
                                    <th>Approval Status</th>
                                    <th>Comments</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                              
                              <tr>
                                  <td>Subhash</td>
                                  <td>HR</td>
                                  <td><span className="blue2">08-May-2020</span></td>
                                  <td><span className="pending">Pending</span></td>
                                  <td>Rs. 12,500 need to be deducted for salar…</td>                                 
                              </tr>                                       

                              <tr>
                                  <td>Subhash</td>
                                  <td>HR</td>
                                  <td><span className="blue2">08-May-2020</span></td>
                                  <td><span className="pending">Pending</span></td>
                                  <td>Rs. 12,500 need to be deducted for salar…</td>                                 
                              </tr>    
                              <tr>
                                  <td>Subhash</td>
                                  <td>HR</td>
                                  <td><span className="blue2">08-May-2020</span></td>
                                  <td><span className="approved">Approved</span></td>
                                  <td>Rs. 12,500 need to be deducted for salar…</td>                                 
                              </tr>    
                              <tr>
                                  <td>Subhash</td>
                                  <td>HR</td>
                                  <td><span className="blue2">08-May-2020</span></td>
                                  <td><span className="pending">Pending</span></td>
                                  <td>Rs. 12,500 need to be deducted for salar…</td>                                 
                              </tr>    
                            </tbody>
                        </Table>
    </Card>
       </Col>
       </Row>     


    <Row>
            <Col>
            <Card className="card filterList d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
         <h4 className="font-16 hblack  border-none">Resignation List for My Team</h4>

         <Table className=" listview">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>HR Manager</th>
                                    <th>Supervisor 1</th>
                                    <th>Date of Resignation</th>
                                    <th>Expected LWD</th>
                                    <th>Resignation Status</th>
                                    <th>NDC Status</th>
                                    <th>Action</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                              
                              <tr>
                                  <td>Deepak Gupta</td> 
                                  <td>Sanjay Singh</td> 
                                  <td>Rameshwar Gupta</td> 
                                  <td><span className="bold">08-May-2020</span></td> 
                                  <td><span className="bold">07-July-2020</span></td>
                                  <td>HR Approved</td> 
                                  <td>Clear</td> 
                                  <td><span className="pnk">Clear</span></td>                              
                              </tr>                                       

                              <tr>
                              <td>Deepak Gupta</td> 
                                  <td>Sanjay Singh</td> 
                                  <td>Rameshwar Gupta</td> 
                                  <td><span className="bold">08-May-2020</span></td> 
                                  <td><span className="bold">07-July-2020</span></td>
                                  <td>HR Approved</td> 
                                  <td>Clear</td> 
                                  <td><span className="pnk">Clear</span></td>                                 
                              </tr>    
                              <tr>
                              <td>Deepak Gupta</td> 
                                  <td>Sanjay Singh</td> 
                                  <td>Rameshwar Gupta</td> 
                                  <td><span className="bold">08-May-2020</span></td> 
                                  <td><span className="bold">07-July-2020</span></td>
                                  <td>HR Approved</td> 
                                  <td>Clear</td> 
                                  <td><span className="pnk">Clear</span></td>                               
                              </tr>    
                              <tr>
                              <td>Deepak Gupta</td> 
                                  <td>Sanjay Singh</td> 
                                  <td>Rameshwar Gupta</td> 
                                  <td><span className="bold">08-May-2020</span></td> 
                                  <td><span className="bold">07-July-2020</span></td>
                                  <td>HR Approved</td> 
                                  <td>Clear</td> 
                                  <td><span className="pnk">Clear</span></td>                                 
                              </tr>    
                            </tbody>
                        </Table>
                 </Card>
            </Col>
          </Row>

    <div class="form-group row pt-5 edit-basicinfo">
            <div class="col-lg-12 text-center">
                <input type="reset" class="btn btn-outline-primary mr-2" value="Cancel" />
                <input type="submit" class="btn btn-primary" value="Submit" />
              </div>
            </div>
</Col>
</Row>
</>
         );
    }
}
 
export default EmployeDetails;
import React, { Component } from 'react';
import { Row, Col, Card, Table } from 'reactstrap';
import {Modal, Button} from "react-bootstrap"
import ImportFile from './ImportFile';
class AttendanceImport extends Component {
    constructor() {
        super();
      this.state = {       
        };
      }
    render() {   

        return (  
                <>
                <h4 className="font-16 pl-3">Attendance Import</h4>
                 <Card className="card d-block pl-3 pt-3 pb-3 br-3 mb-4 shadow-sm card">    
                <ImportFile />
        <Table className="leaveTable">
      <thead>
        <tr>
          <th>File Name</th>
          <th>Pay Period</th>   
          <th>Status</th>
          <th>Action</th>
          
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>April_2020_Attendance.csv</td>
         
          <td><span className="blueText">01-Mar-20 to 30-Mar-20</span></td>
          <td>Uploaded</td>
          <td><button type="button" class="btn btn-sm btn-outline-danger ml-2 ">Download</button></td>
        
        </tr>
        <tr>
          <td>April_2020_Attendance.csv</td>          
          <td><span className="blueText">01-Mar-20 to 30-Mar-20</span></td>
          <td>Uploaded</td>
          <td><button type="button" class="btn btn-sm btn-outline-danger ml-2 ">Download</button></td>         
        </tr>
        <tr>
          <td>April_2020_Attendance.csv</td>
         
          <td><span className="blueText">01-Mar-20 to 30-Mar-20</span></td>
          <td>Uploaded</td>
          <td><button type="button" class="btn btn-sm btn-outline-danger ml-2 ">Download</button></td>          
        </tr>
      </tbody>
    </Table>
    </Card>

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

export default AttendanceImport;
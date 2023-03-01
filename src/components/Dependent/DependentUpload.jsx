import React, { Component } from 'react';
import { Row, Col, Card, Table } from 'reactstrap';
import {Modal, Button} from "react-bootstrap"
import ImportFile from './ImportDependentFile';
import  moment from 'moment';
import { DataFetch } from '../../services/DataFetch';
import config from '../../config/config';
const BEARER_TOKEN = localStorage.getItem("userData");

class DependentUpload extends Component {
    constructor() {
        super();
      this.state = {  
        events:[]     
        };
      }
      componentDidMount(){
        this.refreshEvent()
       
    }

    refreshEvent(){
      var url = config.API_URL+"/upload-dependent-list";
      var bearer = 'Bearer ' + BEARER_TOKEN;

      fetch(url, {
              method: 'GET',
              withCredentials: true,
              headers: {
                  'Authorization': bearer,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
              },
              'mode':'cors'
          }).then(res => res.json()).then(res => {
              if (res.sheetList && res.sheetList.length > 0) {
                  this.setState({items: res.sheetList});
                  this.setState({ events: this.state.events.concat(this.state.items.map((str) => {
                    return str;
                  }))
              })
                }
              console.log(this.state.events)
          })
          .catch(error => {console.log(error)});
    }

    render() {   
       
        return (  
                <>
                <h4 className="font-16 pl-3">Dependent Import</h4>
                 <Card className="card d-block pl-3 pt-3 pb-3 br-3 mb-4 shadow-sm card">    
                <ImportFile onReloadData={this.refreshEvent} />
        <Table className="leaveTable">
      <thead>
        <tr>
          <th>File Name</th>
          {/* <th>Uploaded Month</th>    */}
          <th>Status</th>
          <th>Uploaded On</th>
          <th>Action</th>
          
        </tr>
      </thead>
      <tbody>
        {this.state.events.map(obj => {
       return (
        <tr>
          <td>{obj.fileName}</td>
         
          {/* <td><span className="blueText">{obj.month}</span></td> */}
          <td>{(obj.is_processed)?'Uploaded':'Pending'}</td>
       <td>{moment(obj.createdOn).format(config.DATE_FORMAT)}</td>
          <td><a target="_blank" href={(obj.is_processed)?config.BASE_URL+'/'+obj.uploadedFile:config.BASE_URL+'/'+obj.errorFile} class="btn btn-sm btn-outline-danger ml-2 " download>Download</a></td>
        
        </tr>
        )
       })}
        
       
      </tbody>
    </Table>
    </Card>

          <Modal size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered show={this.state.show} onHide={this.handleClose}>
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

export default DependentUpload;
import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
//import { data } from "./data"
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import {Modal, Button} from "react-bootstrap"
import UploadDocument from './UploadDocument';
import config from '../../config/config';
import {DataFetch} from '../../services/DataFetch'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import Moment from 'moment';
const BEARER_TOKEN = localStorage.getItem("userData");
class MandatoryDocuments extends Component {
    constructor(props) {
        super(props);
        //this.data = data.data;
        this.state = {show:false, data : [],documentId:'', selectedDocument:'', documentImages: [],photoIndex: 0,
        isOpen: false}
        this.refreshdata = this.refreshdata.bind(this);
        this.openLightBox = this.openLightBox.bind(this);
      }

      componentDidMount(){
        this.refreshdata()
     }
     

     refreshdata(){
         const apiUrl = config.API_URL+'/employee/documents/view/'+localStorage.getItem("employeeId");
         var bearer = 'Bearer ' + BEARER_TOKEN;
          DataFetch(apiUrl, bearer).then((result) => {
          let responseJson = result;
          console.log('Refresh Data', responseJson)
          this.setState({ data: responseJson })
      })
     }

      handleClose = () => this.setState({show:false});
      handleShow = () => this.setState({show:true, selectedDocument: ''});
    
      viewDocument = (cell, row) => {
        return(
            <button type="button" className="btn btn-sm btn-outline-danger ml-2">View Document</button>
        )
      }
      download = (cell, row) => {
        return(
            <button type="button" className="btn btn-sm btn-outline-danger ml-2">Download</button>
        )
      }
      uploadAgain = (id) => {
        // console.log('Upload Again id',id)
       this.setState({selectedDocument : id, show: true});
      }

      openLightBox = (id) => {
          let documentImages = this.state.data.Documents[id-1].documentPath;
          let lightboxImages = [];
          for(var key in documentImages){
            let imageData = {};
            lightboxImages.push(config.BASE_URL + documentImages[key]);
            console.log('lightboxImages', lightboxImages);
            if(key == documentImages.length -1){
              this.setState({
                documentImages: lightboxImages,
                isOpen: true
              })
            }
          }
          console.log('lightBox images', documentImages);
      }
      
      checkDocumentType = (row, type) => {
        // console.log('Document Type', row)
        if(row.documentType === type){
          // console.log('Document Row', row)
          return <tr><td>{row.documentName}</td><td className = {row.status === 'Uploaded' ? 'text-success' : 'text-danger'}>{row.status}</td><td>{row.uploadedOn !== '-' ? Moment(row.uploadedOn).format(config.DATE_FORMAT) : '-'}</td><td><span>{row.status === 'Uploaded' ? (row.documentPath.length > 1 ? <a onClick={()=>this.openLightBox(row.id)} className="btn btn-sm btn-outline-danger mr-15">View Document</a> : <a href={config.BASE_URL + row.documentPath} target="_blank" className="btn btn-sm btn-outline-danger mr-15">View Document</a>) : '' }</span><span><button type="button" className="btn btn-sm btn-outline-danger mr-15" onClick={() => this.uploadAgain(row.id)}>{row.status === 'Uploaded' ? 'Upload Again' : 'Upload'} </button> </span></td></tr>;
        }
        else{
          return '';
        }
      }
      
    
      render() {
        const {data} = this.state;
        // console.log('itemmm docuements----', data);

if (data && data.Documents){
  // console.log('upload show', this.state.show);
  
  const mandatoryRows = data.Documents.map(row => this.checkDocumentType(row,1));
  const otherRows = data.Documents.map(row => this.checkDocumentType(row,2));
  const { photoIndex, isOpen } = this.state;
  const images = this.state.documentImages;

  console.log('Other Rows', mandatoryRows);
        return (
        <>
        
        <div className="d-flex justify-content-between  mb-4 ">
            <h6 className=" ">Mandatory Documents <span className="text-success">({this.state.data.mandatoryDocsCount})</span> </h6>
            <button type="button" className="btn btn-sm btn-outline-danger ml-2" onClick={this.handleShow}>+ Add New Document</button>
        </div>
        
        <table className="table table-striped">
          <thead style={{background: "#f0f8ff"}}>
            <tr>
              <td>Document Type</td>
              <td>Status</td>
              <td>Uploaded On</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {mandatoryRows}
          </tbody>
          <UploadDocument show={this.state.show} onRefresh={this.refreshdata} selectedDocument={this.state.selectedDocument} onHide={this.handleClose}/>
        </table>
        
        <div className="d-flex justify-content-between  mb-4 ">
            <h6 className=" ">Other Documents <span className="text-success">({this.state.data.otherDocsCount})</span> </h6>
            {/* <button type="button" className="btn btn-sm btn-outline-danger ml-2" onClick={this.handleShow}>+ Add New Document</button> */}
        </div>
        
        <table className="table table-striped">
        <thead style={{background: "#f0f8ff"}}>
            <tr>
              <td>Document Type</td>
              <td>Status</td>
              <td>Uploaded On</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {otherRows}
          </tbody>
          {/* <UploadDocument show={this.state.show} onRefresh={this.refreshdata} onHide={this.handleClose}/> */}
        </table>
        
        {isOpen && (
          <Lightbox
            mainSrc={images[photoIndex]}
            nextSrc={images[(photoIndex + 1) % images.length]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + images.length - 1) % images.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % images.length,
              })
            }
          />
        )}
       
        
        
        
          {/* <BootstrapTable data={data.Documents} striped={true} hover={true}>
            <TableHeaderColumn dataField="documentName" isKey={true} dataAlign="center" dataSort={true}>Document Type</TableHeaderColumn>
            <TableHeaderColumn dataField="status" dataAlign="center" >Status</TableHeaderColumn>
            <TableHeaderColumn dataField="uploadedOn" dataAlign="center" >Uploaded On</TableHeaderColumn>       
            <TableHeaderColumn dataAlign="center" dataFormat={ this.viewDocument }> Actions </TableHeaderColumn>
            <TableHeaderColumn dataAlign="center" dataFormat={ this.download }></TableHeaderColumn>
            <TableHeaderColumn dataAlign="center" dataFormat={ this.uploadAgain}></TableHeaderColumn>
            <UploadDocument show={this.state.show} onRefresh={this.refreshdata} onHide={this.handleClose}/>
          </BootstrapTable> */}
       
         
          
        </>
        )}
        return (
          "Loading...."
        );
      }
}


export default MandatoryDocuments;
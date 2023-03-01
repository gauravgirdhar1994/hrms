import React, { Component } from 'react';
import { Card, Row, Table, ProgressBar, Button,Modal,Form } from "react-bootstrap";
import Dropzone from 'react-dropzone';
import { FaEdit,FaTrash } from 'react-icons/fa';
import axios from "axios";
import {BootstrapTable, TableHeaderColumn,PaginationPostion} from 'react-bootstrap-table';
//import Moment from "moment";
import { ExportReactCSV } from './ExportReactCSV'
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import { IoIosCard, IoIosCloudDownload } from "react-icons/io";
import config from '../config/config';
const BEARER_TOKEN = localStorage.getItem("userData");
var completeList = [];
const jobTypes = ['Active','Inactive'];
function onAfterSaveCell(row, cellName, cellValue) {
  var url = config.API_URL + "/insurance/Inactive-mapping-hospital";
  var bearer = 'Bearer ' + BEARER_TOKEN;
  let finalData = {};
  finalData.value = cellValue;
  finalData.id = row.id;
  const headers = {
    Authorization: bearer,
    // "Content-Type": "multipart/form-data"
  };
  axios.post(url, finalData, { headers: headers }).then((res) => {
    if(res.status == 200){
      toast.success(res.data.message);
      setTimeout(function () {
        toast.dismiss()
      }, 5000)
    }
  });
}
const cellEditProp = {
  mode: 'click',
  blurToSave: true,
  afterSaveCell: onAfterSaveCell  // a hook for after saving cell
};
class HospitalMaster extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            selectedFile: null,
            show: '',
            percentage: 0,
            uploadMsg: '',
            insurance:[],
            hospital:[],
            uploadText:'Upload',
            files: [],
            type:['Hospital','Clinic','Pharmacy'],
            emirates: ['Abu Dhabi', 'Ajman', 'Dubai', 'Fujairah', 'Ras Al Khaimah', 'Sharjah', 'Umm Al Quwain'],
            city:'',
            hospType:'',
            name: '',
            exportData : [],
            category:0,
            network:0,
          networkList: [],
            errorLogUrl : '',
          networkshow: [],
          showNetwork: false,
          uploadError : false,
          fileName: 'network-list'
            
         }
         this.onDrop = (files) => {
            console.log(files);
            this.setState({ selectedFile: files }, () => {
              this.onChangeHandler();
            })
          };
    }
  
    componentDidMount(){
        const url = config.API_URL+'/insurance/network-category';
        var bearer = "Bearer " + BEARER_TOKEN;
        axios
        .get(url, { headers: { Authorization: bearer } })
        .then((r) => {
          if (r.status == 200) {
            this.setState({insurance: r.data.networkCategory});
            
          }
          this.reloadHospitalList();
          this.reloadTPANetworkList();
      })
      .catch((error) => {
        console.log("API ERR: ");
        console.error(error);
        // res.json({ error: error });
      });
    }
    
    reloadTPANetworkList = () => {
      const apiUrl = config.API_URL+'/insurance/netowork-list';
        var bearer = "Bearer " + BEARER_TOKEN;
        axios
        .get(apiUrl, { headers: { Authorization: bearer } })
        .then((r) => {
          if (r.status == 200) {
            this.setState({networkList:r.data.NetworkList,networkshow:r.data.NetworkList});
            
          }
      })
      .catch((error) => {
        console.log("API ERR: ");
        console.error(error);
        // res.json({ error: error });
      });
    }

    reloadHospitalList = () => {
      const Searchcity = this.state.city;
      const Searchtype = this.state.hospType;
      const Searchname = this.state.name;
      const Searchnetwork = this.state.network;
      const Searchcategory = this.state.category;
      const apiUrl = config.API_URL + '/insurance/hospital-plan-master?city=' + Searchcity + '&type=' + Searchtype + '&name=' + Searchname + '&network=' + Searchnetwork + '&category=' + Searchcategory;
        var bearer = "Bearer " + BEARER_TOKEN;
        axios
        .get(apiUrl, { headers: { Authorization: bearer } })
        .then((r) => {
          let loop = [];
          if (r.status == 200) {
            if(r.data.hospitalList.length > 0){
              
              r.data.hospitalList.map(obj => {
                const h = {
                  Id:obj.hosId,
                  TpaName:obj.tpaName,
                  NetworkName:obj.networkName,
                  Type:obj.type,
                  Category:obj.category,
                  Name:obj.name,
                  Address:obj.address,
                  Phone:obj.phone,
                  Area:obj.area,
                  City:obj.city,
                  Status:(obj.hospStatus)?'Active':'Inactive',
                  Country:obj.country,
                }
                loop.push(h);
              })
            }
            this.setState({ hospital: loop }, () => {

              
              let exportData = {};
              exportData[0] = {
                    Id: 'Id',
                    TpaName: 'TPA Name',
                    NetworkName:'Network Name',
                    Type: 'Type',
                    Category:'Category',    
                    Name: 'Hospital Name',
                    Address: 'Address', 
                    Phone: 'Phone',    
                    Area: 'Area',
                    City: 'City',
                    Status:'Status',
                    Country: 'Country',
              }
              this.state.hospital.map((data, index) => {
                exportData[index + 1] = data;
              })
              this.setState({
                exportData : exportData
              })
              console.log('Map Hospital', exportData);
            });
            
          }
      })
      .catch((error) => {
        console.log("API ERR: ");
        console.error(error);
        // res.json({ error: error });
      });
    }
  
    

    handleShow = () => {       
        this.setState({ show: true, uploadError: false })
    };

    handleClose = () => {
       
        this.setState({ show: false })
    };

    handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      this.setState({
        [name]: value
      })
      
      if(name == 'category'){
        let network = [];
        this.state.networkList.map(obj => {

          if (obj.categoryId == parseInt(value)) {
            console.log('newtork object', obj);
            const list = { id: obj.id, networkName: obj.networkName };
              network.push(list);
            }
        });
        this.setState({ networkshow: network, showNetwork: true, category: value });
      }
  }

  handleSearchClick = () => {
    this.reloadHospitalList();
  }

    checkMimeType = (event) => {
        //getting file object
        let files = this.state.selectedFile;
        //define message container
        let err = []
        // list allow mime type
        const types = ['text/csv','application/vnd.ms-excel','text/x-csv','text/plain']
        // loop access array
        let pdfCount = 0;
        for (var x = 0; x < files.length; x++) {
          console.log('Files', x);
          // compare file type find doesn't matach
          if (types.every(type => files[x].type !== type)) {
            // create error message and assign to container   
            err[x] = files[x].type + ' is not a supported format\n';
          }
          if (files[x].type === 'application/pdf') {
            pdfCount++;
            if (pdfCount > 1) {
              err[x] = 'Muliple PDFs cannot be uploaded';
            }
          }
        };
        for (var z = 0; z < err.length; z++) {// if message not same old that mean has error 
          // discard selected file
          console.log('File error', err[z]);
          toast.error(err[z])
          // event.target.value = null
        }
        if (err.length >= 1) {
          return false;
        }
        return true;
      }
    
      maxSelectFile = (event) => {
        let files = this.state.selectedFile;
        if (files.length > 1) {
          const msg = 'Only 1 images can be uploaded at a time'
          // event.target.value = null
          toast.warn(msg)
          return false;
        }
        return true;
      }
    
      handleClose = () => {
        console.log('close button')
        this.setState({ show: false })
      };
    
      checkFileSize = (event) => {
        let files = this.state.selectedFile;
        let size = 2000000
        let err = [];
        for (var x = 0; x < files.length; x++) {
          if (files[x].size > size) {
            err[x] = files[x].type + 'is too large, please pick a smaller file\n';
          }
        };
        for (var z = 0; z < err.length; z++) {// if message not same old that mean has error 
          // discard selected file
          toast.error(err[z])
          // event.target.value = null
        }
        return true;
      }
    
      onChangeHandler = event => {
        let files = this.state.selectedFile;
        // console.log('File Upload',this.checkMimeType(event));
        if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkFileSize(event)) {
          // if return true allow to setState
          this.setState({
            selectedFile: files,
            loaded: 0
          }, () => {
            this.onClickHandler();
          })
        }
      }
    
      onClickHandler = () => {
        
        const data = new FormData()
        data.append('hospitalSheet', this.state.selectedFile[0])
        const apiUrl = config.API_URL + '/insurance/hospital-plan-mapping';
        var bearer = 'Bearer ' + BEARER_TOKEN;
    
        const headers = {
          "Authorization": bearer
        }
    
        const options = {
          onUploadProgress: (ProgressEvent) => {
            const { loaded, total } = ProgressEvent;
            let percent = Math.floor(loaded * 100 / total);
            this.state.uploadMsg = `${loaded} kb of ${total}kb | ${percent}% `;
            console.log(`${loaded} kb of ${total}kb | ${percent}% `);
    
            if (percent < 100) {
              this.setState({ percentage: percent })
            }
          },
          headers: headers
        }
        axios.post(apiUrl, data, options)
          .then(res => {
            this.setState({ percentage: 100 }, () => {
              setTimeout(() => {
                this.setState({ selectedFile: null, percentage: 0, uploadMsg: '' });
              }, 1000)
            })

            this.reloadHospitalList();
            this.setState({ uploadText: 'Re-upload File' });
            console.log('POST response', res);
            if (res.data.success) {
              toast.success(res.data.message);
              this.handleClose();
            }
            else {
              toast.error(res.data.message);
              
              this.setState({uploadError : true, errorLogUrl: res.data.filePath})
            }

            setTimeout(function () {
              toast.dismiss()
            }, 2000)
            this.reloadHospitalList();
          })

      }


      changeStatus(cell, row){
        if(row.hospStatus == 1){
          return "Active";
        }else{
          return "Inactive";
        }
      }



    render() { 
        const { data } = this.state;
        let files = [];
        if (this.state.selectedFile !== null) {
          files = this.state.selectedFile.map(file => (
            <li key={file.name}>
              {file.name} - {file.size} bytes
            </li>
          ));
        }
      console.log('Export Data', this.state.networkshow);
        const uploadPercent = this.state.percentage;
        return ( 
             <>
              <h4>TPA Network List </h4>
              <ToastContainer className="right" position="top-right"
                                    autoClose={5000}
                                    hideProgressBar={false}
                                    newestOnTop={false}
                                    closeOnClick
                                    rtl={false}
                                    pauseOnVisibilityChange
                                    draggable
                                    pauseOnHover />
            <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">           
            <Row className="mb-5"> 
            <div className="col-sm-3 pb-3">
                    <div className="row">
                        <div className="col-sm-12">
                            <label for="priority">Select TPA</label>
                        </div>
                        <div className="col-sm-6">
                            <select name='category' className="form-control custom-select" onChange={this.handleChange} value={this.state.category}>
                                <option value="">Select TPA</option>
                                {this.state.insurance.map(obj => {
                                    return (
                                    <option value={obj.id}>{obj.categoryName}</option>
                                    )
                                })}                               
                            </select>
                        </div>
                    </div>
                </div>
                <div className="col-sm-3 pb-3">
                    <div className="row">

                    {this.state.showNetwork ?
                      <>
                        <div className="col-sm-12">
                            <label for="priority">Select Network</label>
                        </div>
                        <div className="col-sm-6">
                          <select name='network' className="form-control custom-select" onChange={this.handleChange} value={this.state.network}>
                            <option value="">Select Network</option>
                            {this.state.networkshow.map(obj => {
                              return (
                                <option value={obj.id}>{obj.networkName}</option>
                              )
                            })}
                          </select>
                        </div></> : ""}
                    </div>
                </div>
            </Row>


            <Row>               
                <div className="col-sm-3 pb-3">
                    <div className="row">
                        <div className="col-sm-12">
                            <label for="priority">City</label>
                        </div>
                        <div className="col-sm-12">
                        <select name='city' className="form-control custom-select" onChange={this.handleChange} value={this.state.city} >
                                <option value="">Select Location</option>
                                {this.state.emirates.map((obj, index) => {
                                    return (
                                    <option value={index}>{obj}</option>
                                    )
                                })}
                               
                            </select>
                        </div>
                    </div>
                </div>

                <div className="col-sm-3 pb-3">
                    <div className="row">
                        <div className="col-sm-12">
                            <label for="priority"> Type</label>
                        </div>
                        <div className="col-sm-12">
                        <select  name='hospType' className="form-control custom-select" onChange={this.handleChange} value={this.state.hospType} >
                                <option value=""> Type</option>
                               {this.state.type.map(obj => {
                                   return (
                                   <option value={obj}>{obj}</option>
                                   )
                               })}
                            </select>
                        </div>
                    </div>
                </div>     

                <div className="col-sm-3 pb-3">
                    <div className="row">
                        <div className="col-sm-12">
                            <label for="priority">Name</label>
                        </div>
                        <div className="col-sm-12">
                        <input type="text" className="form-control" name='name' value={this.state.name} onChange={this.handleChange}>

</input>
                        </div>
                    </div>
                </div>     

                <div className="col-sm-3 pb-3">
                    <div className="row">
                        <div className="col-sm-12">
                            <label for="priority">&nbsp;</label>
                        </div>
                        <div className="col-sm-12">
                        <Button type="button" variant="primary" onClick={this.handleSearchClick}> Search </Button>
                        </div>
                    </div>
                </div>               
            </Row>           
        </Card>
           <div className="form-group row pt-5 pr-3  edit-basicinfo">
                                <div className="col-lg-12 text-right">
                                    <Button onClick={this.handleShow} type="submit" variant="primary" >
                  Import New Network Hospital    
                                    </Button>
                                   {Object.keys(this.state.exportData).length > 0 ? (<ExportReactCSV csvData={this.state.hospital} fileName={this.state.fileName} />) : ''} 
                                </div>
        </div>

            <h4 className="font-16  mb-2">Network Hospital List</h4>
            <h4 style={{textAlign : "right"}}>Total records:{Object.keys(this.state.hospital).length}</h4>
        <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm"> 
        
      <BootstrapTable title="Hospital List" data={this.state.hospital} pagination={true} striped hover cellEdit={ cellEditProp }>
      <TableHeaderColumn isKey dataField='Id'>ID</TableHeaderColumn>
      <TableHeaderColumn dataField='TpaName' editable={ false }>TPA Name</TableHeaderColumn>
      <TableHeaderColumn dataField='NetworkName' editable={ false }>Network Name</TableHeaderColumn>
      <TableHeaderColumn dataField='Type' editable={ false }>Type</TableHeaderColumn>
      <TableHeaderColumn dataField='Category' editable={ false }>Category</TableHeaderColumn>
      <TableHeaderColumn dataField='Name' editable={ false }>Hospital Name</TableHeaderColumn>
      <TableHeaderColumn dataField='Address' editable={ false }>Address</TableHeaderColumn>
      <TableHeaderColumn dataField='Phone' editable={ false }>Phone</TableHeaderColumn>
      <TableHeaderColumn dataField='Area' editable={ false }>Area</TableHeaderColumn>
      <TableHeaderColumn dataField='City' editable={ false }>City</TableHeaderColumn>
      <TableHeaderColumn dataField='Status' editable={ { type: 'select', options: { values: jobTypes } } }>Status</TableHeaderColumn>
      <TableHeaderColumn dataField='Country' editable={ false }>Country</TableHeaderColumn>
      </BootstrapTable>

        

        </Card>



        <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Upload CSV file</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <fieldset>  
                            <div style={{ padding: "50px 0", border: "1px solid #ed0f7e" }}>
                        
                                {/* <label>Upload Your File </label>
                                <input type="file" className="form-control" name="attachments" multiple onChange={this.onChangeHandler} /> */}
                                <Dropzone onDrop={this.onDrop}>
                                  {({ getRootProps, getInputProps }) => (
                                <section className="text-center h-100">
                                  <div {...getRootProps({ className: 'dropzone h-100' })}>
                              <input {...getInputProps(
                                
                              )} />
                              {this.state.uploadError ? (
                                      <span className="downloadHere">Click here to download the error file <a target="_blank" href={config.BASE_URL+'/'+this.state.errorLogUrl} download>Download error log</a></span>

                              ) : (
                                  <>
                                    <p><a href="javascript:void(0)" className="btn btn-xs btn-upload">{this.state.uploadText}</a> Or drag the files here</p>
                                    <span className="downloadHere">If you don’t have the format <a href={config.BASE_URL+''+'/uploads/sample/HospitalCateogry.csv'} download>download here</a></span>
                                <br></br>

                                    </>
                                    )}
                                    
                                      </div>
                                      <aside>
                                        {/* <h4>Files</h4> */}
                                        {this.state.uploadMsg}
                                        {/* <ul>{}</ul> */}
                                      </aside>
                                    </section>
                                  )}
                                </Dropzone>
                              </div>
                              <div className="form-group">
                                <ToastContainer />
                                {uploadPercent > 0 && <ProgressBar now={uploadPercent} active label={`${uploadPercent}%`}></ProgressBar>}
                              </div>
            
                        <label htmlFor="Location" className="mb-2 mt-2 text-right">File type - CSV and Max size 5 MB only</label>
                         </fieldset>
                           
                        </Form>
                    </Modal.Body>
                </Modal>



</>
         );
    }
}
 
export default HospitalMaster;
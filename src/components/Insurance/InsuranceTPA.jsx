/* eslint-disable */
import React, { Component } from "react";
import { Col, Card, Row, Table } from "reactstrap";
import config from "../../config/config";
import { fetchData } from "../../action/fetchData";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import loader from "../../loader.gif";
import { FaEdit,FaTrash } from 'react-icons/fa';
import axios from "axios";
//import Moment from "moment";
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import { IoIosCard, IoIosCloudDownload } from "react-icons/io";
const BEARER_TOKEN = localStorage.getItem("userData");


class InsuranceTPA extends Component {
    constructor(props) {
        super(props);
        this.state = {
          category:[],
          insurer:'',
          selectlogo:null,
          selectFile:null,
          categoryId:0,
          insuranceName:'',
          deductable:'',
          coverage:'',
          id:0,
          networkId:0,
          showTPA:false,
          showNetwork:false,
          categoryData:[],
          netoworkList:[],
          network:'',
          callCenterNumber:''
        };
        this.myRef = React.createRef() 

    }

    componentDidMount(){
      const apiUrl = config.API_URL+'/insurance/network-category';
      var bearer = "Bearer " + BEARER_TOKEN;
      axios
      .get(apiUrl, { headers: { Authorization: bearer } })
      .then((r) => {
        if (r.status == 200) {
          this.setState({category:r.data.networkCategory});
          this.getNetoworkList();
        }
    })
    .catch((error) => {
      console.log("API ERR: ");
      console.error(error);
      // res.json({ error: error });
    });
    }

    getNetoworkList(){
      const apiUrl = config.API_URL+'/insurance/netowork-list';
      var bearer = "Bearer " + BEARER_TOKEN;
      axios
      .get(apiUrl, { headers: { Authorization: bearer } })
      .then((r) => {
        if (r.status == 200) {
          console.log(r.data);
          this.setState({netoworkList:r.data.NetworkList});
          
        }
    })
    .catch((error) => {
      console.log("API ERR: ");
      console.error(error);
      // res.json({ error: error });
    });
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
          [name]: value
        })
    }

    
    checkMimeType = (event) => {
        //getting file object
        let files = event.target.files
        //define message container
        let err = []
        // list allow mime type
        const types = ['image/png']
        // loop access array
        for (var x = 0; x < files.length; x++) {
          // compare file type find doesn't matach
          if (types.every(type => files[x].type !== type)) {
            // create error message and assign to container   
            err[x] = files[x].type + ' is not a supported format\n';
          }
        };
        for (var z = 0; z < err.length; z++) {// if message not same old that mean has error 
          // discard selected file
          toast.error(err[z])
          event.target.value = null
        }
        return true;
      }

      


      maxSelectFile = (event) => {
        let files = event.target.files
        if (files.length > 1) {
          const msg = 'Only 1 can be uploaded at a time'
          event.target.value = null
          toast.warn(msg)
          return false;
        }
        return true;
      }
      checkFileSize = (event) => {
        let files = event.target.files
        let size = 5000000
        let err = [];
        for (var x = 0; x < files.length; x++) {
          if (files[x].size > size) {
            err[x] = files[x].type + 'is too large, please pick a smaller file\n';
          }
        };
        for (var z = 0; z < err.length; z++) {// if message not same old that mean has error 
          // discard selected file
          toast.error(err[z])
          event.target.value = null
        }
        return true;
      }
      onChangeHandler = event => {
        var files = event.target.files
        console.log(files);
        if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkFileSize(event)) {
          // if return true allow to setState
          this.setState({
            selectlogo: files,
            loaded: 0
          })
        }
      }

      

      onClickHandler = () => {
        console.log(this.state.selectlogo);
        if(this.state.selectlogo == null && this.state.insurer == "" && this.state.callCenterNumber == ""){
          alert("Please fill all data");
          return false;
        }
        const data = new FormData()
          if(this.state.selectlogo){
            data.append('tpaLogo', this.state.selectlogo[0])
          }
          data.append('tpaName', this.state.insurer)
          data.append('id',this.state.id);
          data.append('callCenterNumber',this.state.callCenterNumber)
          console.log(data);
        
        var bearer = 'Bearer ' + BEARER_TOKEN;
        const options = {
          method: 'POST',
          headers: {
            'Authorization': bearer
          },
          body: data
        };
        //   fetch(BaseURL, options)
        fetch(config.API_URL+"/insurance/add-edit-tpa", options).then(res => res.json()).then(res => {
          
          toast.success(res.message);
        setTimeout(function () {
          toast.dismiss()
        }, 5000)
          this.componentDidMount();   
          this.setState({
              insurer:'',
              selectlogo:null,
              id:0,
              showInsurer:false,
              callCenterNumber:''
          })
          })
          .catch(error => {console.log(error)})
        this.componentDidMount();
      }

      onClickHandlerNetwork = () => {
        var url = config.API_URL + "/insurance/add-edit-network";
        var bearer = 'Bearer ' + BEARER_TOKEN;
        let finalData = {};
        if(this.state.network == "" && this.state.categoryId == 0){
          alert("Please fill all data");
          return false;
        }
        finalData.network = this.state.network;
        finalData.categoryId = this.state.categoryId;
        finalData.id = this.state.networkId;
        const headers = {
          Authorization: bearer,
          // "Content-Type": "multipart/form-data"
        };
        axios.post(url, finalData, { headers: headers }).then((res) => {
          if(res.status == 200 && res.data.success){
            toast.success(res.data.message);
            setTimeout(function () {
              toast.dismiss()
            }, 5000)
            this.getNetoworkList();
            this.setState({
              network:'',
              categoryId:0,
              networkId:0
          })
          }

        });
      }


      onTPAEdit = (id) => {
        setTimeout(() =>{               
          window.scrollTo({
            top: this.myRef.current.offsetTop,
              behavior: 'smooth'     
          })

          console.log("djdlldf", top)
      },100)
        this.onShowTPAForm();
        let editData = [];
        this.state.category.map(obj => {
          if(obj.id === id){
            editData.push(obj);
          }
         });
        
         this.setState({
           id:id,
           insurer:editData[0].categoryName,
           callCenterNumber:editData[0].callCenterNumber
         });
        
      }

      onNetworkEdit = (id) => {
        setTimeout(() =>{               
          window.scrollTo({
            top: this.myRef.current.offsetTop,
              behavior: 'smooth'     
          })

          console.log("djdlldf", top)
      },100)

      this.onShowNetworkForm();
      let editnetworkData = [];
      this.state.netoworkList.map(obj => {
        if(obj.id === id){
          editnetworkData.push(obj);
        }
       });
      
       this.setState({
         networkId:id,
         categoryId:editnetworkData[0].categoryId,
         network:editnetworkData[0].networkName
       });

      }

      onChangeHandler = event => {
        var files = event.target.files
        console.log(files);
        if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkFileSize(event)) {
          // if return true allow to setState
          this.setState({
            selectlogo: files,
            loaded: 0
          })
        }
      }



      addDefaultSrc(ev){
        ev.target.src = config.DEFAULT_ORG_IMG_URL
      }

      onShowTPAForm = () => {
         this.setState({insurer:'',
         selectlogo:null,
         id:0,
         showInsurer:false,
         callCenterNumber:'',showTPA:true});
      }

      onHideTPAForm = () => {
        this.setState({showTPA:false});
      }

      onHideNetworkForm = () => {
        this.setState({showNetwork:false});
      }

      onShowNetworkForm = () => {
        this.setState({ network:'',
        categoryId:0,
        networkId:0,showNetwork:true});
     }
    
    


    render() {

        return (
            <Col>
                  <ToastContainer className="right" position="top-right"
           autoClose={5000}
           hideProgressBar={false}
           newestOnTop={false}
           closeOnClick
           rtl={false}
           pauseOnVisibilityChange
           draggable
           pauseOnHover />
                    <ul id="tabsJustified" className="nav nav-tabs nav-fill bg-magenta rounded-sm">
                <li className="nav-item">
                        <a href="#Tab1" data-target="#Tab1" data-toggle="tab" className="nav-link active">TPA List</a>
                    </li>
                    <li className="nav-item">
                        <a href="#Tab2" data-target="#Tab2" data-toggle="tab" className="nav-link">Network List</a>
                    </li>
                   
                </ul>
                <div id="tabsJustifiedContent" className="tab-content py-1">
                    <div className="tab-pane fade show active" id="Tab1">
                    <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-1  shadow-sm">
                    <Table className="leaveTable">
                        <thead>
                            <tr>
                               
                                <th>Logo</th>
                                <th>TPA Name</th>
                                <th>Call Center</th>
                                <th>Status</th>
                                <th>Action</th>

                            </tr>
                        </thead>
                        <tbody>
                         {this.state.category.map(obj => {
                             return (
                              <tr>
                                
                                <td><img src={(obj.logo)?config.BASE_URL+'/'+obj.logo:''} height="40" width="40" onError={this.addDefaultSrc}></img></td>
                             <td>{obj.categoryName}</td>
                             <td>{obj.callCenterNumber}</td>
                             <td>{(obj.status)?'Active':'Inactive'}</td>
                             <td><input type="reset" className="btn btn-primary mr-2" onClick={this.onTPAEdit.bind(this, obj.id)} value="Edit" /></td>
                            </tr>
                             )
                         })}
                            </tbody>
                            </Table>


                        </Card>
                        <div ref={this.myRef} onClick={this.onShowTPAForm} class="form-group row pt-2 mb-4 "><div class="col-lg-12 text-left"><span class="addNewButton"> <i class="icon-plus icons"></i> Add New TPA</span></div></div>




                        <Card className="card topFilter pl-4 pr-4 pt-3 pb-3 br-3 mb-1 shadow-sm" style={(this.state.showTPA)?{}:{display:'none'}}>
                            <Row>
                                <div class="col-sm-5 pb-3">
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <label for="ticket_type">TPA Name <span className="text-danger">*</span></label>
                                        </div>
                                        <div class="col-sm-5">
                                            <input type="text" name="insurer" className="form-control" onChange={this.handleChange} value={this.state.insurer} />

                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-5 pb-3">
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <label for="ticket_type">Call Center Number <span className="text-danger">*</span></label>
                                        </div>
                                        <div class="col-sm-5">
                                            <input type="number" name="callCenterNumber" className="form-control" onChange={this.handleChange} value={this.state.callCenterNumber} />

                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-5 pb-3">
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <label for="priority">Logo <span className="text-danger">*</span></label>
                                        </div>
                                        <div class="col-sm-5">
                                            {/* <label htmlFor="logo"> */}
                                                <input type="file" className="custom-input-file" onChange={this.onChangeHandler} accept="image/png" />
                                            {/* </label> */}

                                        </div>
                                    </div>
                                </div>
                            </Row>

                            <div class="form-group row pt-5 edit-basicinfo">
                                <div class="col-lg-10 text-center"><input type="submit" class="btn btn-primary" value="Save" onClick={this.onClickHandler} />
                                <input type="button" class="btn btn-outline-primary ml-2" value="Cancel" onClick={this.onHideTPAForm} />
                                </div>
                            </div>
                        </Card>
                        </div>
                        <div className="tab-pane fade " id="Tab2">
                    <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-1  shadow-sm">
                    <Table className="leaveTable">
                        <thead>
                            <tr>
                               
                                <th>TPA Name</th>
                                <th>Network Name</th>
                                <th>Status</th>
                                <th>Action</th>

                            </tr>
                        </thead>
                        <tbody>
                         {this.state.netoworkList.map(obj => {
                             return (
                              <tr>
                                
                                
                             <td>{obj.categoryName}</td>
                             <td>{obj.networkName}</td>
                             <td>{(obj.status)?'Active':'Inactive'}</td>
                             <td><input type="reset" className="btn btn-primary mr-2" onClick={this.onNetworkEdit.bind(this, obj.id)} value="Edit" /></td>
                            </tr>
                             )
                         })}
                            </tbody>
                            </Table>


                        </Card>
                        <div ref={this.myRef} onClick={this.onShowNetworkForm} class="form-group row pt-2 mb-4 "><div class="col-lg-12 text-left"><span class="addNewButton"> <i class="icon-plus icons"></i> Add New Network</span></div></div>




                        <Card className="card topFilter pl-4 pr-4 pt-3 pb-3 br-3 mb-1 shadow-sm" style={(this.state.showNetwork)?{}:{display:'none'}}>
                            <Row>
                                
                            <div class="col-sm-6 pb-3">
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <label for="ticket_type">TPA <span className="text-danger">*</span></label>
                                        </div>
                                        <div class="col-sm-8">
                                            <select class="form-control custom-select" name="categoryId" onChange={this.handleChange} value={this.state.categoryId}>
                                                <option value="">Select TPA</option>
                                                {this.state.category.map(a => {
                                                    return (
                                                    <option value={a.id}>{a.categoryName}</option>
                                                    )
                                                })}
                                               
                                            </select>

                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-5 pb-3">
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <label for="ticket_type">Network Name <span className="text-danger">*</span></label>
                                        </div>
                                        <div class="col-sm-5">
                                            <input type="text" name="network" className="form-control" onChange={this.handleChange} value={this.state.network} />

                                        </div>
                                    </div>
                                </div>
                                </Row>

                            <div class="form-group row pt-5 edit-basicinfo">
                                <div class="col-lg-10 text-center"><input type="submit" class="btn btn-primary" value="Save" onClick={this.onClickHandlerNetwork} />
                                <input type="button" class="btn btn-outline-primary ml-2" value="Cancel" onClick={this.onHideNetworkForm} />
                                </div>
                            </div>
                        </Card>
                        </div>
                 </div>
                 </Col>
                 
               
        );
    }
}

export default InsuranceTPA;

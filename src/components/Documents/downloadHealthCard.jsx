import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import { Modal, Button, ProgressBar } from "react-bootstrap"
import 'react-toastify/dist/ReactToastify.css';
import config from '../../config/config';
import ReactTable from '../../components/Loaders/DataLoading';
import { DataFetch } from '../../services/DataFetch'
const BEARER_TOKEN = localStorage.getItem("userData");
class DownloadHealthCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      healthCards: [],
      empData: [],
      orgId : localStorage.getItem("orgId"),
      files: []
    }

  }

  componentDidMount() {
    var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/employee/insurance/getHealthCard/'+this.props.empId, { headers: { Authorization: bearer } })
            .then(r => {
                if (r.status == 200) {
                   
                    this.setState({ healthCards: r.data.healthCard.rows, empData: r.data.empData });
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
          });
  }

  checkUrl(url) {
    if (url.indexOf('http') || url.indexOf('www')) {
      return true;
    }
    else {
      return false;
    }
  }

  render() {
    // const { data } = this.state;
    console.log('HEalth Cards', this.state.healthCards);
    this.state.show = this.props.show;
    console.log('Show Modal', this.props.show);
    if (!this.state.show) {

      return null;
    }
    
    return (
      <React.Fragment>
        <Modal show={this.state.show} onHide={this.props.onHide}>
          <Modal.Header closeButton>
          <Modal.Title>Health Card - {this.state.empData.firstname} {this.state.empData.lastname}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group files">
                    {this.state.healthCards ? (
                      <table className="table table-striped table-bordered">
                      <thead>
                      <tr>
                            <td>
                              Document
                            </td>
                            <td>
                              Action
                            </td>
                        </tr>
                      </thead>

                        <tbody>
                          {this.state.healthCards.map((card, index) => {
                            return <tr><td>File {index + 1}</td><td><a href={this.checkUrl(card.filePath) ? card.filePath : config.BASE_URL + card.filePath} class="btn btn-outline-primary btn-sm" target="_blank" download>Download</a></td></tr>
                          })
                          }
                        </tbody>
                    </table>
                    ) : <ReactTable></ReactTable>}
                      
                  </div>
                </div>
              </div>
            </div>
            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.onHide}>
              Close
            </Button>
            <Button variant="primary" onClick={this.props.onHide}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

      </React.Fragment>
    )
  }
}

export default DownloadHealthCard;




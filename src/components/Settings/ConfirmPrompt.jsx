import React, { Component } from "react";
import { Modal, Button, Card, Table, Form } from "react-bootstrap";
import { FaExclamationTriangle } from 'react-icons/fa';

class ConfirmPrompt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: localStorage.getItem("roleSlug"),
    };
  }

  render() {
    console.log("Current Role", localStorage);

    return (
      <div>
        <Modal show={this.props.confirmPromptShow} onHide={this.props.confirmClose}>
          <Modal.Header>
            <Modal.Title>
              <h6>Confirm Action</h6>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <fieldset>
              <div className="row mb-3">
                            <div className="col-lg-12 text-center">
                                                            <i style={{ fontSize: '48px', color: '#ffc107' }}><FaExclamationTriangle /></i>
                                                            
                                {this.props.type === 'department' ? (
                                    <>
                                    <p className="font-18">You've got {this.props.empNo} employees in this department.</p>
                                    <p className="font-18">Don't leave them hanging, move them to another department before making this Inactive.</p>
                                    <hr className="divider"></hr>
                                   
                                    </>
                                ) : ''}
                                {this.props.type === 'position' ? (
                                    <>
                                    <p className="font-18">You've got {this.props.empNo} employees with this designation.</p>
                                    <p className="font-18">Don't leave them hanging, remap their designation before making this Inactive.</p>
                                    <hr className="divider"></hr>
                                   
                                    </>
                                ) : ''}
                                {this.props.type === 'location' ? (
                                    <>
                                    <p className="font-18">You've got {this.props.empNo} employees in this location.</p>
                                    <p className="font-18">Don't leave them hanging, remap their location before making this Inactive.</p>
                                    <hr className="divider"></hr>
                                   
                                    </>
                                ) : ''}
                                {this.props.type === 'empType' ? (
                                    <>
                                    <p className="font-18">You've got {this.props.empNo} employees who have been assigned this employee type.</p>
                                    <p className="font-18">Don't leave them hanging, remap their employee type before making this Inactive.</p>
                                    <hr className="divider"></hr>
                                   
                                    </>
                                ) : ''}
                                {this.props.type === 'grade' ? (
                                    <>
                                        <p className="font-18">The grade is mapped to {this.props.empNo} insurance plans.</p>
                                    <p className="font-18">Do remap the plans before making this Inactive.</p>
                                    <hr className="divider"></hr>
                                   
                                    </>
                                                            ) : ''}
                                {this.props.tabType ? (
                                        <>
                                        <p className="font-18">The {this.props.tabType} is mapped to {this.props.empNo} insurance plans.</p>
                                    <p className="font-18">Do remap the plans before making this Inactive.</p>
                                    <hr className="divider"></hr>
                                   
                                    </>
                                ) : ''}
                </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <button className="btn btn-secondary font-16" onClick={() => this.props.confirmClose(0)}>Cancel</button>
                                <button className="btn btn-primary ml-3 font-16" onClick={() => this.props.confirmClose(1)}>I'll fix it</button>
                            </div>
                        </div>
             
            </fieldset>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ConfirmPrompt;

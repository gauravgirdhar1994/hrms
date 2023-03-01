import React, { Component } from 'react';
import { Row, Col, Card, Table } from 'reactstrap';
import { FaArrowLeft } from 'react-icons/fa';
import BlogsList from '../components/Blogs/Blogs';
import AddNewBlog from '../components/Blogs/AddNewBlog';
import config from '../config/config';
import axios from 'axios';
const BEARER_TOKEN = localStorage.getItem("userData");

class Blogs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showAddNew: false,
            blogDetails: {}
        }
        this.goBackToBlogList = this.goBackToBlogList.bind(this)
        this.getBlogDetails = this.getBlogDetails.bind(this)
        this.loadAlertMessage = this.loadAlertMessage.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
    }
    addNewBlog() {
        this.setState({ showAddNew: true, blogDetails: {} })
    }
    goBackToBlogList() {
        this.setState({ showAddNew: false })
    }
    getBlogDetails(blogId) {
        axios.get(config.API_URL + '/blogs/details/' + blogId,
            {
                headers: {
                    Authorization: 'Bearer ' + BEARER_TOKEN
                }
            })
            .then(res => {
                console.log(res)
                var blogDetails = res.data.blogDetails;
                this.setState({
                    blogDetails: blogDetails,
                    loading: false,
                    showAddNew: true
                })
                // resData.default = resData.url;
                // resolve(resData);
            }).catch(error => {
                console.log('ALLOW ===> ', error)
                // reject(error)
            });
    }
    loadAlertMessage(showAlertMessage, alertMessage) {
        if (showAlertMessage) {
            this.setState({
                showAddNew: false,
                showAlertMessage,
                alertMessage
            })
        }
    }
    closeAlert() {
        this.setState({
            showAlertMessage: '',
            alertMessage: false
        });
    }
    render() {
        return (
            <div className="p-2 flex-fill d-flex flex-column page-fade-enter-done">
                <Row>
                    <div className="col-sm-12" style={{ marginBottom: "10px", marginTop: "10px" }}>
                        <Col style={{ paddingRight: "0px" }}>
                            <h4>
                                Blogs
                                {!this.state.showAddNew ? (
                                    <input
                                        type="submit"
                                        className="btn btn-primary"
                                        value="Add New Blog"
                                        style={{ float: "right", marginRight: "15px" }}
                                        onClick={(e) => this.addNewBlog(e)}
                                    />
                                ) : (
                                        <span
                                            style={{ float: "right", marginRight: "15px" }}
                                            className="font-16 block pointer margin-bottom-20"
                                            onClick={(e) => this.goBackToBlogList(e)}
                                        >
                                            {" "}
                                            <FaArrowLeft /> Go Back{" "}
                                        </span>
                                    )}
                            </h4>
                        </Col>
                    </div>
                </Row>
                {this.state.showAlertMessage && (
                    <div className="col-md-12 mx-auto">
                        <div className="withdrowReg text-center">
                            <p>
                                {this.state.alertMessage}
                                <span style={{
                                        float: "right",
                                        marginRight: "18px",
                                        cursor: "pointer"
                                    }}
                                    onClick={(e) => this.closeAlert(e)}>X</span>
                            </p>
                        </div>
                    </div>
                )}
                {this.state.showAddNew ?
                    (
                        <AddNewBlog goBack={this.goBackToBlogList} blogDetails={this.state.blogDetails} loadAlertMessage={this.loadAlertMessage} />
                    ) : (
                        <BlogsList getBlogDetails={this.getBlogDetails} />
                    )
                }
            </div>
        )
    }

}

export default Blogs
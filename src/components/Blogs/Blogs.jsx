import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Card, Table } from 'reactstrap';
import { Modal, Button, ProgressBar } from "react-bootstrap"
import moment from 'moment';
import config from '../../config/config';
// import Moment from 'react-moment';
const BEARER_TOKEN = localStorage.getItem("userData");


class Blogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blogs: [],
      loading: false
    }
  }

  componentDidMount() {
    this.getAllBlogs()
  }
  getAllBlogs() {
    this.setState({ loading: true })
    axios.get(config.API_URL + '/blogs/list',
      {
        headers: {
          Authorization: 'Bearer ' + BEARER_TOKEN
        }
      })
      .then(res => {
        console.log(res)
        var allBlogs = res.data.allBlogs;
        this.setState({
          blogs: allBlogs,
          loading: false
        })
        // resData.default = resData.url;
        // resolve(resData);
      }).catch(error => {
        console.log('ALLOW ===> ', error)
        // reject(error)
      });
  }
  loadTable() {
    if (!this.state.loading) {
      if (this.state.blogs.length > 0) {
        return this.state.blogs.map((blog) => {
          return (
            <tr>
              <td>{blog.blog_title}</td>
              <td>{(blog.blog_type == 1) ? 'Blog' : 'Page'}</td>
              <td>{blog.blog_type == 2 ? (blog.page_type == 1) ? 'About Us' : 'Contact Us' : ""}</td>
              <td>{(blog.blog_published == 1) ? 'Yes' : 'No'}</td>
              <td>{(blog.blog_published_on) ? moment(blog.blog_published_on).format("MMM DD, YYYY") : '-'}</td>
              <td>{(blog.blog_status == 1) ? 'Active' : 'Inactive'}</td>
              <td>
                <span
                  className="pnk"
                  onClick={() => this.props.getBlogDetails(blog.id)}
                  style={{ cursor: "pointer" }}
                >
                  Edit
                </span>
              </td>
            </tr>
          );
        })
      } else {
        return <tr><td colSpan="5">No Record Found.</td></tr>
      }
    } else {
      return <tr><td colSpan="5">Loading</td></tr>
    }
  }
  render() {
    return (
      <>
        <div className="col-md-12 mx-auto py-2">
          <Card className="card d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
            <div className="container">
              <div className="row">
                <div className="col-sm-12 pb-3">
                  <div className="row">
                    <h4 className="font-16 hblack  border-none">
                      Blogs List
                  </h4>
                    <Table className="leaveTable">
                      <thead>
                        <tr>
                          <th>Blog Title</th>
                          {/* <th>Blog Description</th> */}
                          <th>Type</th>
                          <th>Page Type</th>
                          <th>Published</th>
                          <th>Published On</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.loadTable()}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </>
    );
  }
}

export default Blogs;
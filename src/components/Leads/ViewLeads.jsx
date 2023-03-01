import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Card, Table } from 'reactstrap';
import { Modal, Button, ProgressBar } from "react-bootstrap"
import moment from 'moment';
import config from '../../config/config';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const BEARER_TOKEN = localStorage.getItem("userData");

class Blogs extends Component {
    constructor(props) {
        super(props);
        console.log('props.blogDetails ====> ', props.blogDetails.id);
        const blogDet = typeof props.blogDetails.id != 'undefined' ? props.blogDetails : { blog_status: 1, blog_description: 'Add your description here...' }
        this.state = {
            editor: ClassicEditor,
            blog: blogDet,
            disableBtn: false,
            editMode: typeof props.blogDetails.id != 'undefined' ? true : false
        }
        this.handleInput = this.handleInput.bind(this)
    }

    componentDidMount() { }
    handleInput(e) {
        const name = e.target.name;
        let value = e.target.value;
        if (e.target.name == "blog_published") {
            value = e.target.checked ? 1 : 2
        } else if (e.target.name == "blog_cover") {
            value = e.target.files[0]
        }
        this.setState({
            blog: {
                ...this.state.blog,
                [name]: value
            }
        })
    }
    handleDescriptionInput(content) {
        this.setState({
            blog: {
                ...this.state.blog,
                blog_description: content
            }
        })
    }
    isFormValid() {
        return true;
    }
    submitHandler(e) {
        e.preventDefault()
        console.log(this.state.blog)
        if (this.isFormValid()) {
            let formData = new FormData()
            formData.append('blog_title', this.state.blog.blog_title);
            formData.append('file', this.state.blog.blog_cover);
            formData.append('blog_description', this.state.blog.blog_description);
            formData.append('blog_published', this.state.blog.blog_published);
            formData.append('blog_status', this.state.blog.blog_status);
            formData.append('blog_type', this.state.blog.blog_type);
            formData.append('page_type', this.state.blog.page_type);
            this.setState({ disableBtn: true });
            let apiUrl = '/blogs/add';
            if (typeof this.state.blog.id != 'undefined') {
                formData.append('blog_id', this.state.blog.id);
                apiUrl = '/blogs/update';
            }
            console.log('apiUrl ==> ', apiUrl);
            axios.post(config.API_URL + apiUrl, formData,
                {
                    headers: {
                        Authorization: 'Bearer ' + BEARER_TOKEN
                    }
                })
                .then(res => {
                    console.log(res)
                    // var resData = res.data;
                    // resData.default = resData.url;
                    // resolve(resData);
                    this.setState({ disableBtn: false });
                    this.props.loadAlertMessage(true, "Blog details saved successfully.")
                }).catch(error => {
                    console.log('ALLOW ===> ', error)
                    // reject(error)
                    this.setState({ disableBtn: false });
                });
        }
    }
    render() {
        console.log('this.state.blog ===> ',this.state.blog.blog_published)

        return (
            <>
                <div className="col-md-12 mx-auto py-2">
                    <div className="card d-block p-xl-3 p-2  h-100 shadow-sm">
                        <span className="anchor" id="formComplex"></span>
                        <div className="my-4" />
                        <h6>Add New Blog </h6>
                        <div className="col-lg-12">
                            <form name="blogForm" onSubmit={(e) => this.submitHandler(e)}>
                                <div className="col-lg-12">
                                    <div class="col-sm-5 mb-4">
                                        <label>Type</label>
                                        <span>
                                            <select name="blog_type" className="form-control" onChange={this.handleInput} disabled={this.state.editMode?true:false}>
                                                <option value="">Select Type</option>
                                                <option value="1" selected={this.state.blog.blog_type == 1 ? true : false}>Blog</option>
                                                <option value="2" selected={this.state.blog.blog_type == 2 ? true : false}>Page</option>
                                            </select>
                                        </span>
                                    </div>
                                </div>
                                {this.state.blog.blog_type == 2 && (
                                    <div className="col-lg-12">
                                        <div class="col-sm-5 mb-4">
                                            <label>Page Type</label>
                                            <span>
                                                <select name="page_type" className="form-control" onChange={this.handleInput} disabled={this.state.editMode?true:false}>
                                                    <option value="">Select Type</option>
                                                    <option value="1" selected={this.state.blog.page_type == 1 ? true : false}>About Us</option>
                                                    <option value="2" selected={this.state.blog.page_type == 2 ? true : false}>Contact Us</option>
                                                </select>
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className="col-lg-12">
                                    <div class="col-sm-12 mb-4">
                                        <label>Title</label>
                                        <span>
                                            <input type="text" class="form-control" id="blog_title" name="blog_title" placeHolder="Add blog title.." onChange={this.handleInput} value={this.state.blog.blog_title} />
                                        </span>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div class="col-sm-5 mb-4">
                                        <label>Upload Cover Image</label>
                                        <span>
                                            <input type="file" className="custom-input-file" id="blog_cover" name="blog_cover" onChange={this.handleInput} />
                                        </span>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div class="col-sm-12 mb-4">
                                        <label>Descrition</label>
                                        <span>
                                            <CKEditor
                                                editor={this.state.editor}
                                                data={this.state.blog.blog_description}
                                                onInit={editor => {
                                                    // You can store the "editor" and use when it is needed.
                                                    console.log('Editor is ready to use!', editor);
                                                    editor.plugins.get('FileRepository').createUploadAdapter = function (loader) {
                                                        return new UploadAdapter(loader);
                                                    };
                                                }}
                                                onChange={(event, editor) => {
                                                    const data = editor.getData();
                                                    this.handleDescriptionInput(data);
                                                    // console.log({ event, editor, data });
                                                    // console.log(this.state.content);
                                                }}
                                                onBlur={editor => {
                                                    console.log('Blur.', editor);
                                                }}
                                                onFocus={editor => {
                                                    console.log('Focus.', editor);
                                                }}
                                            />
                                        </span>
                                    </div>
                                </div>
                                {this.state.blog.blog_type == 1 && (
                                    <div className="col-lg-12">
                                        <div class="col-sm-5 mb-4">
                                            <label>Publish Blog</label>
                                            <span>
                                                <input type="checkbox" className="form-control" id="blog_published" name="blog_published" style={{ width: "auto", height: "auto" }} onChange={this.handleInput} checked={this.state.blog.blog_published == 1 ? true : false} />
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className="col-lg-12">
                                    <div class="col-sm-5 mb-4">
                                        <label>Status</label>
                                        <span>
                                            <select name="blog_status" className="form-control" onChange={this.handleInput}>
                                                <option value="">Select Status</option>
                                                <option value="1" selected={this.state.blog.blog_status == 1 ? true : false}>Active</option>
                                                <option value="2" selected={this.state.blog.blog_status == 2 ? true : false}>Inactive</option>
                                            </select>
                                        </span>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div class="col-sm-5 mb-4">
                                        <input
                                            type="reset"
                                            class="btn btn-outline-primary mr-2"
                                            onClick={(e) => this.props.goBack(e)}
                                            value="Cancel" disabled={this.state.disableBtn} />
                                        <input
                                            type="submit"
                                            class="btn btn-primary"
                                            value={this.state.editMode ? "Update" : "Create"}
                                            onSubmit={(e) => this.submitHandler(e)}
                                            disabled={this.state.disableBtn} />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

class UploadAdapter {
    constructor(loader) {
        // Save Loader instance to update upload progress.
        this.loader = loader;
    }

    upload() {
        const dataN = new FormData();
        return new Promise((resolve, reject) => {
            this.loader['file'].then(
                (data) => {
                    dataN.append('file', data);
                    axios.post(config.API_URL + '/blogs/upload-image', dataN,
                        {
                            headers: {
                                Authorization: 'Bearer ' + BEARER_TOKEN
                            }
                        })
                        .then(res => {
                            console.log(res)
                            var resData = res.data;
                            resData.default = resData.url;
                            resolve(resData);
                        }).catch(error => {
                            console.log('ALLOW ===> ', error)
                            reject(error)
                        });
                });
        })
    }

    abort() {
        // Reject promise returned from upload() method.
    }
}
export default Blogs;
import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Card, Table } from 'reactstrap';
import { Modal, Button, ProgressBar } from "react-bootstrap"
import moment from 'moment';
import config from "../../../config/config";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const BEARER_TOKEN = localStorage.getItem("userData");

class HighlightsDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editor: ClassicEditor,
            description: "",
            highlightId: "",
            planId: props.planId
        }
    }
    componentDidMount() {
        this.getHighlight()
    }
    getHighlight() {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        const options = {
            method: 'GET',
            headers: {
                'Authorization': bearer
            }
        };
        this.setState({
            loading: true
        })
        //   fetch(BaseURL, options)
        fetch(config.API_URL + "/insurance/plan/list-highlights/" + this.state.planId, options)
            .then(res => res.json())
            .then(res => {
                // this.componentDidMount();
                if (res.success) {
                    this.setState({
                        description: res.highlightContent.highlight,
                        highlightId: res.highlightContent.id
                    })
                    // console.log('res.covMapList ===> ', res.covMapList)
                    // console.log('res.mappingList ===> ', this.state.mappingList)
                }
            })
            .catch(error => { console.log(error) })

    }
    handleDescriptionInput = (content) => {
        this.setState({
            description: content
        })
    }
    handleSubmit = (e) => {
        e.preventDefault()
        console.log('state ===> ', this.state)
        console.log('this.planId ==> ', this.state.planId);
        let Insurancedata = {};
        Insurancedata.highlight = this.state.description
        Insurancedata.planId = this.state.planId
        Insurancedata.highlightId = this.state.highlightId
        
        console.log(Insurancedata);

        var bearer = 'Bearer ' + BEARER_TOKEN;

        axios.post(config.API_URL + "/insurance/plan/add-highlights", Insurancedata,
            {
                headers: {
                    Authorization: 'Bearer ' + BEARER_TOKEN
                }
            })
            .then(res => {
                alert(res.data.message);
            }).catch(error => {
                console.log('ALLOW ===> ', error)
                // reject(error)
                // this.setState({ disableBtn: false });
            });


    }
    render() {
        return (
            <>
                <form name="highlightForm" onSubmit={this.handleSubmit}>
                    <Row>
                        <div className="col-lg-12">
                            <div class="col-sm-12 mb-4">
                                <label>Description</label>
                                <span>
                                    <CKEditor
                                        editor={this.state.editor}
                                        data={this.state.description}
                                        onInit={editor => {
                                            // You can store the "editor" and use when it is needed.
                                            console.log('Editor is ready to use!', editor);
                                            /* editor.plugins.get('FileRepository').createUploadAdapter = function (loader) {
                                                return new UploadAdapter(loader);
                                            }; */
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
                    </Row>
                    <Row>
                        <div class="col-sm-12 pb-3 text-center">
                            <input type="submit" class="btn btn-primary" value="Save & continue" onClick={this.handleSubmit} style={{ marginLeft: '10px' }} />
                        </div>
                    </Row>
                </form>
            </>
        )
    }
}

export default HighlightsDetails; 
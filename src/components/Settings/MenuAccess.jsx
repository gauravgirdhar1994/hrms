import React, { Component } from 'react';
import { Modal, Button, Card, Table, Form } from "react-bootstrap"
import axios from 'axios';
import Moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import config from '../../config/config';
const BEARER_TOKEN = localStorage.getItem("userData");
//const ORG_ID = localStorage.getItem("orgId");
class MenuAccess extends Component {
    constructor(props) {
        super(props);
        this.state = { masterMenu: this.props.masterMenu, currRole: this.props.currRole, selectedMenu: this.props.seletedMenu, menuId: [] }

    }
    componentDidMount() {

    }
    componentDidUpdate(prevProps) {

    }

    handleSubmit = (event) => {
        event.preventDefault()
        console.log(this.state.selectedMenu);
        let datas = {};
        datas.selectMenu = this.state.selectedMenu;
        datas.roleId = this.state.currRole;
        const apiUrl = config.API_URL + '/setting/save-menu-data';
        var bearer = 'Bearer ' + BEARER_TOKEN;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        // console.log('headers => ', headers);
        axios.post(apiUrl, datas, { headers: headers })
            .then(res => {
                if (res.status == 200) {
                    toast.success(res.data.message);
                    setTimeout(function () {
                        toast.dismiss()
                    }, 2000)
                    //this.setState({ editShow: false })
                }
            })

        // console.log(datas);
    }

    handleCheckElement = (event) => {
        console.log('Check Element', event.target.value);
        let val = parseInt(event.target.value);
        let selmenu = this.state.selectedMenu;

        if (event.target.checked) {
            if (selmenu.indexOf(val) == -1) {

                selmenu.push(val);
            }
        }
        else {
            console.log('Uncheck');

            if (selmenu.indexOf(val) > -1) {
                const index = selmenu.indexOf(val);
                console.log("index", index);
                if (index > -1) {
                    selmenu.splice(index, 1);
                }
                //selmenu.remove(event.target.value);
            }
        }
        // console.log(day.id);

        console.log('all days ==> ', selmenu);
        // this.setState({})

        this.setState({
            ...this.state,
            selectedMenu: selmenu
        })
        // console.log('Form State', this.state.form);
        // console.log('Form State', this.state.form);
    }

    createMenuChecks(data, key, check) {
        let labelcheck = '';
        console.log('Check label', data, key, check);
        if (check) {
            labelcheck += '<label class="hrms_control hrms_checkbox">';
            labelcheck += data.menuName;
            labelcheck += '<input type="checkbox" name="menuId[]"'
            labelcheck += 'value=' + data.id + ' checked="checked" onChange=' + this.handleCheckElement + ' />';
            labelcheck += '<i class="hrms_control__indicator"></i></label>';
            labelcheck += '<div class="innerMenu">';
            data.subMenu.map((subMenu, index) => {
                if (this.state.selectedMenu.indexOf(subMenu.id) > -1) {

                    labelcheck += '<label class="hrms_control hrms_checkbox">';
                    labelcheck += subMenu.menuName;
                    labelcheck += '<input type="checkbox" name="menuId[]"'
                    labelcheck += 'value=' + subMenu.id + ' checked="checked" onChange=' + this.handleCheckElement + ' />';
                    labelcheck += '<i class="hrms_control__indicator"></i></label>';

                } else {

                    labelcheck += '<label class="hrms_control hrms_checkbox">' + subMenu.menuName;
                    labelcheck += ' <input type="checkbox" name="day" value=' + subMenu.id + ' onChange=' + this.handleCheckElement + ' /> <i class="hrms_control__indicator"></i></label>';

                }

            })
            labelcheck += '</div>';
        }
        else {

            labelcheck += '<label class="hrms_control hrms_checkbox">' + data.menuName;
            labelcheck += ' <input type="checkbox" name="day" value=' + data.id + ' onChange=' + this.handleCheckElement + ' /> <i class="hrms_control__indicator"></i></label>';
            labelcheck += '<div class="innerMenu">';
            data.subMenu.map((subMenu, index) => {
                if (this.state.selectedMenu.indexOf(subMenu.id) > -1) {

                    labelcheck += '<label class="hrms_control hrms_checkbox">';
                    labelcheck += subMenu.menuName;
                    labelcheck += '<input type="checkbox" name="menuId[]"'
                    labelcheck += 'value=' + subMenu.id + ' checked="checked" onChange=' + this.handleCheckElement + ' />';
                    labelcheck += '<i class="hrms_control__indicator"></i></label>';

                } else {

                    labelcheck += '<label class="hrms_control hrms_checkbox">' + subMenu.menuName;
                    labelcheck += ' <input type="checkbox" name="day" value=' + subMenu.id + ' onChange=' + this.handleCheckElement + ' /> <i class="hrms_control__indicator"></i></label>';

                }

            })
            labelcheck += '</div>';

        }
        console.log('Label check', labelcheck)
        return labelcheck;
    }

    renderSubMenu = (data) => {
        return data.subMenu.map((subMenu, index) => {
            if (this.state.selectedMenu.indexOf(subMenu.id) > -1) {

                return <label className="hrms_control hrms_checkbox">{subMenu.menuName}
                    <input type="checkbox" name="menuId[]" value={subMenu.id} checked="checked" onChange={this.handleCheckElement} />
                    <i className="hrms_control__indicator"></i>
                </label>


            } else {

                return <label className="hrms_control hrms_checkbox">{subMenu.menuName}
                    <input type="checkbox" name="day" value={subMenu.id} onChange={this.handleCheckElement} />
                    <i className="hrms_control__indicator"></i>
                </label>


            }
        })
    }

    render() {

        return (
            <>

                <div className="row text-center">
                    <ul className="myinfoListing">
                        <li>
                            <div className="scheduleCheck">
                                <div>Menu List</div>
                                <Form onSubmit={event => { event.preventDefault(); this.handleSubmit(this.state) }}>
                                    <div className="checkboxGroup">
                                        {this.state.masterMenu.map((data, key) => {
                                            if (this.state.selectedMenu.indexOf(data.id) > -1) {
                                                return (
                                                    <>
                                                        <label className="hrms_control hrms_checkbox">{data.menuName}
                                                            <input type="checkbox" name="menuId[]" value={data.id} checked="checked" onChange={this.handleCheckElement} />
                                                            <i className="hrms_control__indicator"></i>
                                                        </label>
                                                        <div className="innerMenu">
                                                        { this.renderSubMenu(data) }
                                                        </div>
                                                        
                                                    </>
                                                )
                                            } else {

                                                return (
                                                    <>
                                                        <label className="hrms_control hrms_checkbox">{data.menuName}
                                                            <input type="checkbox" name="day" value={data.id} onChange={this.handleCheckElement} />
                                                            <i className="hrms_control__indicator"></i>
                                                        </label>
                                                        <div className="innerMenu">
                                                        { this.renderSubMenu(data) }
                                                        </div>
                                                        
                                                    </>
                                                )
                                            }

                                        })
                                        }
                                    </div>
                                </Form>

                            </div>
                        </li>

                        <Button type="submit" variant="primary" onClick={this.handleSubmit}>
                            Save
                                </Button>

                    </ul>

                </div>



            </>
        )
    }
}
export default MenuAccess;
/* eslint-disable */
import React, { Component } from "react";
import { Col, Card, Row, Table } from "reactstrap";
/* import config from "../../config/config";
import { fetchData } from "../../action/fetchData"; */
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
// import loader from "../../loader.gif";
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from "axios";
//import Moment from "moment";
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import { IoIosCard, IoIosCloudDownload } from "react-icons/io";
const BEARER_TOKEN = localStorage.getItem("userData");
class NetworkDeails extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <>
                <Table className="leaveTable">
                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>TPA</th>
                            <th>Network</th>
                            <th>Benifit</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>No Record Found</td></tr>
                    </tbody>
                </Table>                
            </>
        )
    }
}

export default NetworkDeails; 
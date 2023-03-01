/* eslint-disable */
import React, { Component } from "react";
import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import CreateTicketComponent from "../components/Ticket/CreateTicket";
import config from "../../src/config/config";

const TICKET_API_URL = config.API_URL + "/ticket/types";
const BEARER_TOKEN = "Bearer " + localStorage.getItem("userData");

class CreateTicket extends Component {
  constructor() {
    super();
    this.state = {
      ticketTypes: [],
      ticketsPriorities: [
        { id: 1, priority: "Low" },
        { id: 2, priority: "Medium" },
        { id: 3, priority: "High" },
        { id: 4, priority: "Critical" }
      ],
      isLoading: true
    };
  }
  componentDidMount() {
    const options = {
      method: "GET",
      headers: {
        Authorization: BEARER_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }; 
    fetch(TICKET_API_URL, options)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          this.setState({
            ...this.state,
            ticketTypes: data.ticketTypes,
            isLoading: false
          });
        } else {
          this.setState({
            ...this.state,
            ticketTypes: [],
            isLoading: false
          });
        }
      });
  }
  showToastMessage(toastMessage){
    console.log('check 1')
    toast(toastMessage, { autoClose: 3000 })
  }
  render() {
    const { ticketTypes, ticketsPriorities, isLoading } = this.state;
    return (
      <div>
        <ToastContainer className="right" position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover />

        <CreateTicketComponent
          ticketTypes={ticketTypes}
          ticketsPriorities={ticketsPriorities}
          isLoading={isLoading}
          showToastMessage={this.showToastMessage}
        />
      </div>
    );
  }
}

export default CreateTicket;

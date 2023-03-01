import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import BrokerSchedule from './WorkSchedule/BrokerSchedule'
import OrgSchedule from './WorkSchedule/OrgSchedule'

class AccountSetup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            role: localStorage.getItem("roleSlug")
        }
    }

    componentDidMount() {
    }

    render() {
        // console.log('this.state.role ====> ', this.state.role);
        return (
            <>

                <ToastContainer />
                {
                    this.state.role == 'broker-admin'
                    || this.state.role == 'broker-primary' ? (
                        <BrokerSchedule />
                    ) : (
                        <OrgSchedule />
                    )
                }
            </>
        )
    }

}

export default AccountSetup;
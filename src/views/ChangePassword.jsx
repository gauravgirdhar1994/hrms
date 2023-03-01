import React, { Component } from 'react';
import { ChangePasswordForm } from '../components/Forms';

class ChangePassword extends Component {
    render() {
        let urlToken = this.props.match.params.token;
        console.log('tatti', urlToken)
        return (
            <div>
                <ChangePasswordForm token={urlToken} />
            </div>
        );
    }
}

export default ChangePassword;
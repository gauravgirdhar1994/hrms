import React, { Component } from 'react';
import { ResetPasswordForm } from '../components/Forms';

class ResetPassword extends Component {
    render() {
        let urlToken = this.props.match.params;
        // console.log('tatti', urlToken)
        return (
            <div>
                <ResetPasswordForm />
            </div>
        );
    }
}

export default ResetPassword;
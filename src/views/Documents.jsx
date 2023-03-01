import React, { Component } from 'react';
import MandatoryDocuments from '../components/Documents/MandatoryDocuments';
import UserInfo from '../components/UserInfo';



class Documents extends Component {
    render() {
        
        return (
            <div>
                <UserInfo />
                <h4 className="mb-0 font-16 pl-3">My Info - Documents</h4>
                <div className="col-md-12 mx-auto py-2">
                    <div className="card d-block p-xl-3 p-2  h-100 shadow-sm">
                        <MandatoryDocuments />
                    </div>
                </div>
            </div>
        );
    }
}

export default Documents;
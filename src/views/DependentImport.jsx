import React, { Component } from 'react';
import  DependentUpload from '../components/Dependent/DependentUpload';
class DependentImport extends Component {
    render() {
        return (
            <div className="p-4 flex-fill d-flex flex-column page-fade-enter-done">
                <DependentUpload />
            </div>
        );
    }
}

export default DependentImport;
import React, { Component } from 'react';
import InsuranceImport from '../components/MyInfo/InsuranceImport';

class InsuranceImportData extends Component {
    render() { 
        return (
            <div className="p-4 flex-fill d-flex flex-column page-fade-enter-done">
                
                <h4 className="mb-4 font-16 pl-3"> Health Insurance Import Data</h4>               
                        
                                               <InsuranceImport />
                                        </div>
        )
    }

}

export default InsuranceImportData
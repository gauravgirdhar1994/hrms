import React from 'react';
import { Wrapper } from '../components';
import config from '../config/config';
import axios from 'axios';
class viewImportData extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {token:localStorage.getItem("userData")}
        
    }
    componentDidMount()
    {
        console.log('View Import Data');
    }
   
    render(){
        return (
                <div className="p-4 flex-fill d-flex flex-column page-fade-enter-done">
                        <h3>Preview Import Data</h3>
                </div>
        );
    }
}

export default viewImportData;

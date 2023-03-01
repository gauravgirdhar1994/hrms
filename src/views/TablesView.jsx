import React from 'react';
import { Wrapper, DataTable } from '../components';

class TablesView extends React.Component{
    
    render(){
        return (
            <Wrapper>
                <div className="row">
                    <div className="col-12">
                        <div className="card card-body mb-4">
                            <h3 className="font-weight-light mb-3">DataTables</h3>
                            <DataTable />
                        </div>
                    </div>
                </div>
            </Wrapper>
        );
    }
}

export default TablesView;

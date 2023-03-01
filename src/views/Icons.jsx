import React from 'react';
import { Wrapper, IconsLinear, IconsSimpleLine } from '../components';

class Icons extends React.Component{
    render(){
        return (
            <Wrapper>
                <main className="flex-fill">
                    <div className="row">
                        <div className="col-12">
                            <h4 className="font-weight-light mb-3">Linear Icons</h4>
                            <IconsLinear />
                            <h4 className="font-weight-light my-3">Simple Line Icons</h4>
                            <IconsSimpleLine />
                        </div>
                    </div>
                </main>
            </Wrapper>
        );
    }
}

export default Icons;

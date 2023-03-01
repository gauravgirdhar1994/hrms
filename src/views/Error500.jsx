import React from 'react';
import { Wrapper } from '../components';

class Error500 extends React.Component{
    render(){
        return (
            <Wrapper>
                <div className="row flex-grow-1 align-items-center text-center mt-n5">
                    <div className="col">
                        <h1 className="display-2 font-weight-bold mb-0">500<br/><span className="lnr lnr-poop"></span></h1>
                        <h6 className="text-uppercase">Server Error</h6>
                        <p className="text-muted">
                            An unexpected error occured, or <br />
                            the server may be down. Try again soon.
                        </p>
                        <a href="./" className="btn btn-lg btn-primary">Reload <span className="lnr lnr-redo"></span></a>
                    </div>
                </div>
            </Wrapper>
        );
    }
}

export default Error500;

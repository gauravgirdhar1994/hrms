import React, { Component } from 'react';

class Leaves extends Component {
    render() {
        const { date, dateto, name, days } = this.props;
        return (
            <>
                <div className="col-lg-12 pb-2 " >
                    <div className="justify-content-between d-flex pb-2" style={{borderBottom:"1px solid #ccc"}}>
                                        <div className="d-flex">
                                            <div className="bg-green pr-2 pl-2 text-center rounded-sm pt-1 pb-1" style={{color:"#fff", backgroundColor:"#F9804F", fontSize:"10px"}}>{date}</div>
                                            <div>
                                                <p className="m-0 ml-3" style={{color:"#233774", fontSize:"12px"}}>{dateto}</p>
                                                <p className="m-0 ml-3" style={{color:"#233774", fontSize:"10px"}}>{name}</p>
                                            </div>
                                        </div>
                                        <div style={{color:"#F8709E", fontSize:"10px"}} >
                                            {days}
                                        </div>
                                    </div>
                                    </div>
            </>
        );
    }
}

{/* <div className="col-lg-12 d-flex pb-4 justify-content-between">
<div className="d-flex">
    <div>20 <br />APR</div>
    <div>
        <p>20 to 25 Apr 20</p>
        <p>Raj kumar</p>
    </div>
</div>
<div>
    5 Days
</div>
</div> */}

export default Leaves;
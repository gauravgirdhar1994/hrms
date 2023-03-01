import React, { Component } from 'react';
import { Row, Col, Card } from 'reactstrap';
import { Doughnut } from 'react-chartjs-2';


class DoughnutChart extends Component {
    constructor() {
        super();
        this.state = { };
      }
    render() {
                const data = canvas => {
                                return {
                      labels: [this.props.tooltipText,this.props.tooltipText],              
                      datasets: [
                        {
                         backgroundColor: [this.props.color, "#cccccc"],
                          data: [this.props.data,100-this.props.data]
                        }
                      ]
                    };
                  };

        return (  
            <React.Fragment>
                                  
                    <Col sm="3" md="6" xs="12" lg="3" className="p-4 py-3">
                        <Card className="card d-block p-1 h-100 shadow-sm">
                            <Row className="card-body p-xl-3 p-2 d-flex flex-column">
                                <h4 className=" mb-4 font-16 pl-3">{this.props.title}</h4>
                                <div className="doughnutcenter">
                                <div class="pie-chart-container"><span className="bold font-60">{this.props.count}</span><p className="font-14 color-grey">{this.props.text}</p></div>
                                    <Doughnut
                                        data={data}
                                        options={{
                                            cutoutPercentage: this.props.percentage,
                                            legend: {
                                                display: false,
                                            }
                                        }}
                                        width={150} height={150}
                                    />
                                </div>
                                <div className="liveInfo mt-3 pl-3 pr-3">
                                {this.props.title !== 'LWP' ? 
                                <div class="justify-content-between d-flex pb-3">
                                    <span>{this.props.available}</span>  <span>{this.props.availablenumber}</span>
                                </div> : ""}
                                <div class="justify-content-between d-flex pb-3">
                                    <span>{this.props.consumed}</span>  <span>{this.props.consumednumber}</span>
                                </div>
                                <div class="justify-content-between d-flex pb-3">
                                <span>{this.props.accured}</span>  <span>{this.props.accurednumber}</span>
                                </div>
                                {this.props.title !== 'LWP' ? 
                                <div class="justify-content-between d-flex ">
                                <span>{this.props.annual}</span>  <span>{this.props.annualnumber}</span> 
                                </div>: ""}
                                </div> 
                            </Row>
                        </Card>
                    </Col>
            </React.Fragment>

        );
    }
}

export default DoughnutChart;
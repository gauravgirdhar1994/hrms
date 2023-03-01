import React, { Component } from 'react';
import { Row } from 'reactstrap';
import CausalList from './CausalList';
import DoughnutChart from './Doughnut';
import { DataFetch } from '../../services/DataFetch';
import config from '../../config/config';
const BEARER_TOKEN = localStorage.getItem("userData");
const doughutColor = ['#233774','#097342','#047288','#a51a0e','#9e7b05',,'#ed0f7e'];
class CasualLeaves extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
      datas: [],
      response: "",
    }
  }

  componentDidMount() {
    //this.refreshList()
    const apiUrl = config.API_URL+'/leave-list';
    var bearer = 'Bearer ' + BEARER_TOKEN
    DataFetch(apiUrl, bearer).then((result) => {
      let responseJson = result;
      console.log('jlkjkljlkjkljlkjlkj', responseJson)
      this.setState({ datas: responseJson.result.leaveArray })
    })
  }

  refreshComponent = () => {
    this.componentDidMount();
  }

  roundToOne(num) {
    num  = parseFloat(num);    
    return +(Math.round(num + "e+1")  + "e-1");
}
  render() {
    if (this.state.datas) {
      var events = [];
      let data = {};
      var calculatePercentage = 0;
      this.state.datas.map((str,key) => {
         
         calculatePercentage = Math.round(str.availLeave / str.totalLeave * 100);
         
        str.calculatePercentage  = calculatePercentage;
        events.push(str);
      })
     
      console.log(events); 
     



      return (
        <React.Fragment>
          {/* Manage Leave Stats */}
          <Row className="py-3 leaverequest" >
            {events.map((obj,x) => {
              return (
              (obj.leaveName !== 'LWP' ?
                <DoughnutChart
                  key="1"
                  title={obj.leaveName}
                  available="Available"
                  availablenumber={this.roundToOne(obj.balanceLeave)}
                  consumed="Consumed"
                  consumednumber={this.roundToOne(obj.availLeave)}
                  accured="Accrued so far"
                  accurednumber="0"
                  annual="Leave Quota"
                  annualnumber={obj.annualQuota}
                  percentage="85"
                  count={this.roundToOne(obj.balanceLeave)}
                  text="Days Available"
                  tooltipText="leave percentage"
                  data={obj.calculatePercentage}
                  color={doughutColor[x]}
                /> : "")
              )
              x++;
            })}

          </Row>

          <CausalList chartRefresh={this.refreshComponent}/>

        </React.Fragment>

      );
    }
    return (
      <> loading... </>
    )
  }

}

export default CasualLeaves;
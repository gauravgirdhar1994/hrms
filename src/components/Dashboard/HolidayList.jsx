import React, { Component } from 'react';
import config from '../../config/config';
import Moment from 'moment';
import {Table} from 'reactstrap';
class HolidayList extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {HolidayListsArr:this.props.HolidayListsArr}
    }
    render()
    {
    	var items = this.props.HolidayListsArr.map((obj)=>{
    		return <tr>
	    			<td>{obj.holidayName}</td>
	    			<td>{obj.date+' '+obj.month+' '+obj.year}</td>   
	    			<td>{obj.day}</td>
	    		 </tr>
    	})

    	return(
    		<Table className="onboardingTable">
          <thead>
             <th>Name</th>
              <th>Date</th>
              <th>Day</th>
          </thead>
          <tbody>      
            {items}            
          </tbody>
        </Table>
    		)
    }
}
export default HolidayList;
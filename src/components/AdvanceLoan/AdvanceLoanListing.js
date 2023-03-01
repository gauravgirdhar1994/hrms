import React from 'react';
import { Card, Table } from 'reactstrap';
import moment from 'moment';
import config from '../../config/config';
var roleSlug = localStorage.getItem("roleSlug");
class AdvanceLoanListing extends React.Component{
	constructor(props)
	{
		super(props);
		this.state = {'items':[],advanceLoanArr:this.props.advanceLoanArr,search:''}
		this.getItems = this.getItems.bind(this);
    this.editLoan = this.editLoan.bind(this);
    this.searchEmployee = this.searchEmployee.bind(this);
    this.changeSearch = this.changeSearch.bind(this);
	}
	componentDidUpdate(prevProps) {
		//console.log('componentDidUpdate items',this.state.advanceLoanArr,prevProps.advanceLoanArr,this.props.advanceLoanArr);
        if(prevProps.advanceLoanArr !== this.props.advanceLoanArr) {
        	//console.log('componentDidUpdate items in')
          //this.setState({advanceLoanArr: this.props.advanceLoanArr});
          this.state.advanceLoanArr = this.props.advanceLoanArr;
          this.getItems();
        }
        
    }
    componentDidMount()
    {
    	//console.log('componentDidMount items',this.state.advanceLoanArr);
    	this.getItems();
    }
    getItems()
    {
    	//console.log('items',this.state.advanceLoanArr);
    	// if(this.state.advanceLoanArr.length>0)
    	// {
    		var balance = 0;
	    	var items = this.state.advanceLoanArr.map((obj)=>{
          var paid_date = (obj.paid_date)?moment(new Date(obj.paid_date)).format(config.DATE_FORMAT):''
          var created_on = moment(new Date(obj.createdOn)).format(config.DATE_FORMAT)
	    		if(obj.transaction_categ=='1')
	    		{
	    			balance+=obj.amount;
	    		}
	    		else if(obj.transaction_categ=='0')
	    		{
	    			balance=balance-obj.amount;
	    		}
	    		return <tr>
	    			<td>{obj.firstname+' '+obj.lastname}</td>
	    			<td>{(obj.schedule_period_month && obj.schedule_period_year)?config.months[obj.schedule_period_month-1]+', '+obj.schedule_period_year:''}</td>  
            <td>{created_on}</td> 
	    			<td>{paid_date}</td>
	    			<td>{obj.payble_months}</td>     
	    			<td>{obj.amount}</td>              
		            <td>{config.transaction_categ_arr[obj.transaction_categ]}</td>              
		            <td>{config.STATUS[obj.status]}</td>  
		            {(config.advance_loan_role_id_allow.indexOf(roleSlug)!=-1)?<td><a href='javascript:void(0)' onClick={(e)=>this.editLoan(e,obj)}>Edit</a></td> :''}
	    		 </tr>
	    	})
	    	this.setState({'items':items})
        
    //	}
    	//console.log('new items',items);
    }
    editLoan(e,obj)
    {
      obj.paid_date = (obj.paid_date)?new Date(obj.paid_date):'';
      this.props.editLoan(obj);
    }
searchEmployee(text)
{
  console.log(text)
 // var advanceLoanArr = this.state.advanceLoanArr;
  if(text && text.length>2 && this.state.advanceLoanArr.length>0)
  {
    var search = this.state.advanceLoanArr.filter(x => x.name.toLowerCase().includes(text.toLowerCase()))
    //this.setState({advanceLoanArr:search});
    this.state.advanceLoanArr = search;
  }
  else
  {
    this.state.advanceLoanArr = this.props.advanceLoanArr;
    //this.setState({advanceLoanArr:advanceLoanArr});
  }
  this.getItems();
}
changeSearch(e)
{
  this.setState({search:e.target.value});
  this.searchEmployee(e.target.value)
}
	render()
	{
		return (
			<Card className="card d-block pl-3 pt-3 pr-3 pb-3 mt-5 shadow-sm">
                <div className="d-flex jcs aic mb-4">
                    <h3 className="font-16 blackB ">Advance Loan History</h3>
                   {/* <input className="searchText" type="text" name='search' id='search' value={this.state.search} onChange={this.changeSearch} placeholder="Search Employee Name" />*/}
                </div>
            <Table className="onboardingTable">
          <thead>
              <th>Employee Name</th>
              <th>Schedule Period</th>
              <th>Created On</th>
              <th>Approval Date</th>
              <th>No. of months</th>
              <th>Advance Loan Amount</th>
              <th>Transaction Type</th>
              <th>Status</th>
              {(config.advance_loan_role_id_allow.indexOf(roleSlug)!=-1)?<th>Action</th>:''}
          </thead>
          <tbody>      
            {this.state.items}     
            
          </tbody>
        </Table>
        </Card>
		)
	}
}
export default AdvanceLoanListing;
import React from 'react';
import moment from 'moment';
import config from '../../config/config';
import {Form, Button} from "react-bootstrap"
import DatePicker from "react-datepicker";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
const BEARER_TOKEN = localStorage.getItem("userData");
var role_id = localStorage.getItem("role");
class AddLoan extends React.Component{
	constructor(props) 
	{
		super(props);
        var fields = {emp_id:this.props.emp_id,amount:'',paid_date:'',schedule_period_month:'',
        schedule_period_year:'',payble_months:'',notes:'',
        transaction_categ:'1',status:'1',loan_id:0}
		this.state = {advanceLoanRow:this.props.advanceLoanRow,...fields,
            employee_option:<option value=''>Select Employee</option>,
            month_option:<option value=''>Select Month</option>,
         status_option:<option value=''>Select Status</option>}
        if(Object.keys(this.props.advanceLoanRow).length>0)
        {

           Object.keys(fields).map((key)=>{
            if(this.props.advanceLoanRow[key])
            {
                this.state[key] = this.props.advanceLoanRow[key];
            }
           })
        }
        //console.log('call constructer')
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getEmployeeList = this.getEmployeeList.bind(this);
        this.getMonthOption = this.getMonthOption.bind(this);
        //this.getTransactionType = this.getTransactionType.bind(this);
        this.getStatus = this.getStatus.bind(this);
	}
    componentDidMount()
    {
        // if(config.advance_loan_role_id_allow.indexOf(role_id)!=-1)
        // {
        //     this.getEmployeeList();
        // }
        // else{
        //     this.setState({emp_id:localStorage.getItem("employeeId")})
        // }
        this.getMonthOption();
        //this.getTransactionType();
        this.getStatus();
    }
	componentDidUpdate(prevProps) {
		console.log(prevProps.advanceLoanRow,this.props.advanceLoanRow);

        if(prevProps.advanceLoanRow !== this.props.advanceLoanRow) {
        	this.setState({advanceLoanRow:this.props.advanceLoanRow})
        }
        if(prevProps.emp_id !== this.props.emp_id) {
        	this.setState({emp_id:this.props.emp_id})
        }
        
    }
    handleSubmit()
    {
        const employeeId = localStorage.getItem("employeeId");
         const headers = {
            "Authorization": 'bearer '+BEARER_TOKEN,
        }
       // console.log(this.state.paid_date,moment(new Date(this.state.paid_date)));
        var finalData = {
            emp_id:this.state.emp_id,
            amount:this.state.amount,
            paid_date:this.state.paid_date,
            schedule_period_month:this.state.schedule_period_month,
            schedule_period_year:this.state.schedule_period_year,
            payble_months:this.state.payble_months,
            notes:this.state.notes,
            transaction_categ:this.state.transaction_categ,
            status:this.state.status,
            createdBy:employeeId,
            updatedBy:employeeId,
            loan_id:this.state.loan_id
        }
         //console.log(finalData);
         axios.post(config.API_URL+'/payroll/add-advance-loan',finalData,{headers: headers})
            .then(res => {
                    if(res.status==200 && res.data.success==true)
                    {
                        // toast.success('Save Successfully');
                        //   setTimeout(() => {
                        //      toast.dismiss()
                        //     this.props.handleClose();
                        //   }, 2000)
                        this.props.handleClose();
                          this.props.getAdvanceLoan();
                    }
                    else
                    {
                        toast.error('Something went wrong,Please try again.');
                        setTimeout(() => {
                             toast.dismiss()
                          }, 2000)
                    }

                })
    }
    handleChange=(event)=>
    {
       //console.log(event)
        var name = event.target.name;
        var val = event.target.value;
        var obj = {[name]:val}
          //console.log(obj)
        this.setState(obj);
    }
    dateChange = (date, name) => {
        //console.log(moment(new Date(date)))
        var obj = {[name]:date}
        //console.log(obj);
        this.setState(obj);
    }
    getEmployeeList()
    {
        const headers = {
            "Authorization": 'bearer '+BEARER_TOKEN,
        }
        var orgId = localStorage.getItem("orgId");
        axios.get(config.API_URL+'/employees/list?orgId='+orgId,{headers: headers})
            .then(res => {
                //console.log(res.data.employees.rows);
                if(res.data.employees.rows.length>0)
                {
                    let employee_option = res.data.employees.rows.map((obj,index)=>{
                        return <option value={obj.id} key={index}>{obj.empDetails.personal.firstname+' '+obj.empDetails.personal.lastname}</option>
                    })
                    var blankOption = <option value=''>Select Employee</option>
                    employee_option.unshift(blankOption);
                    this.setState({employee_option:employee_option})
                }
                })
    }
    getMonthOption()
    {
        let month_option = config.months.map((name,index)=>{
            return <option value={index+1} key={index}>{name}</option>
        })
          var blankOption = <option value=''>Select Month</option>
          month_option.unshift(blankOption);
          this.setState({month_option:month_option})
    }
    // getTransactionType()
    // {
    //     let transac_type_option = Object.keys(config.transaction_categ_arr).map((index)=>{
    //         return <option value={index} key={index}>{config.transaction_categ_arr[index]}</option>
    //     })
    //       var blankOption = <option value=''>Select Transaction Type</option>
    //       transac_type_option.unshift(blankOption);
    //       this.setState({transac_type_option:transac_type_option})
    // }
    getStatus()
    {
        //console.log(Object.keys(config.STATUS),config.STATUS,config);
        let status_option = Object.keys(config.STATUS).map((index)=>{
            //console.log(index);
            return <option value={index} key={index}>{config.STATUS[index]}</option>
        })
          var blankOption = <option value=''>Select Status</option>
          status_option.unshift(blankOption);
          this.setState({status_option:status_option})
    }
    render()
    {
        //console.log('render addloan')
        var disabled_cls='';
        var disabled = false;
        if(this.state.loan_id>0 && this.state.transaction_categ=='1')
        {
            disabled = true;
            disabled_cls = ' disable-pointer'
        }
    	return(
           
    		<Form onSubmit={event => {   event.preventDefault();        this.handleSubmit()      }}>
              <ToastContainer className="right" position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    draggable
            />
                        <fieldset>
                        {/* {config.advance_loan_role_id_allow.indexOf(role_id)!=-1?<><label htmlFor="emp_id" className="mb-0">Employee Name</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select className="form-control custom-select" onChange={this.handleChange} name='emp_id' id='emp_id' value={this.state.emp_id}>{this.state.employee_option}</select>
                                    </div>
                                </div></>:''} */}
                                <label htmlFor="amount" className="mb-0">{(this.state.transaction_categ=='0')?'Deduction Amount':'Advance Loan Amount'}</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="amount" name="amount" onChange={this.handleChange}  value={this.state.amount} className={"form-control"+disabled_cls} disabled={disabled} required="" />
                                    </div>
                                </div>
                                <label htmlFor="paid_date" className="mb-0">{(this.state.transaction_categ=='0')?'Deduction':'Approval'} Date</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <DatePicker autoComplete="off" selected={this.state.paid_date} dateFormat={config.DP_INPUT_DATE_FORMAT} className={"form-control"+disabled_cls} value={this.state.paid_date}  onChange={(date)=>this.dateChange(date,'paid_date')} name='paid_date' id='paid_date' disabled={disabled} />
                                    </div>
                                </div>
                                {this.state.transaction_categ=='1'?
                                <>
                                <div className="row">
                                <div className="col-sm-6">
                                    <label htmlFor="schedule_period_month" className="mb-0">Schedule Period Month</label>
                                    <div className="row mb-3">
                                        <div className="col-lg-12">
                                            <select className="form-control custom-select" onChange={this.handleChange} name='schedule_period_month' id='schedule_period_month' value={this.state.schedule_period_month}>{this.state.month_option}</select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <label htmlFor="schedule_period_year" className="mb-0">Schedule Period Year</label>
                                    <div className="row mb-3">
                                        <div className="col-lg-12">
                                        <select className="form-control custom-select" onChange={this.handleChange} name='schedule_period_year' id='schedule_period_year' value={this.state.schedule_period_year}>
                                            <option value=''>Select Year</option>
                                            <option value={moment(new Date()).format('YYYY')}>{moment(new Date()).format('YYYY')}</option>
                                            <option value={parseInt(moment(new Date()).format('YYYY'))+1}>{parseInt(moment(new Date()).format('YYYY'))+1}</option>
                                        </select>
                                        </div>
                                    </div>
                                </div>
                                </div>
                                <label htmlFor="payble_months" className="mb-0">Total No. of Months</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="payble_months" name="payble_months" onChange={this.handleChange} value={this.state.payble_months}  className="form-control" required="" />
                                    </div>
                                </div></>:''
                                }   
                                <label htmlFor="notes" className="mb-0">Additional Notes</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                       <input type="text" id="notes" name="notes" onChange={this.handleChange} value={this.state.notes}  className="form-control" required="" />
                                    </div>
                                </div>
                               {/*} <label htmlFor="transaction_categ" className="mb-0">Transaction Type</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select className="form-control custom-select" onChange={this.handleChange} name='transaction_categ' id='transaction_categ' value={this.state.transaction_categ}>{this.state.transac_type_option}</select>
                                    </div>
                                </div>*/}
                                 <label htmlFor="status" className="mb-0">Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select className="form-control custom-select" onChange={this.handleChange} name='status' id='status' value={this.state.status}>{this.state.status_option}</select>
                                    </div>
                                </div>
                            </fieldset>
                          
                        <Button type="submit" variant="primary" >
                            Save
                        </Button>
                            <span className="ml-3 font-weight-bold">Monthly EMI: AED {(this.state.amount != '') && (this.state.payble_months != "")?Math.round(this.state.amount / this.state.payble_months):'0'}</span>
                        </Form>
        )
    }
}
export default AddLoan;
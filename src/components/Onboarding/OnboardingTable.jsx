
import React, { Component} from 'react'
import { Row, Col, Card, Table } from 'reactstrap';
import axios from 'axios';
import Moment from 'moment'; 
import config from '../../config/config';
import { TablePagination } from 'react-pagination-table';
import OnboardingRequest from '../Onboarding/OnboardingRequest'
import OnboardingTab from '../Onboarding/OnboardingTab';
import TableLoader from '../Loaders/TableLoader';

class OnboardingTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            dataCount: '',
            showData: false,
            orgId: localStorage.getItem("orgId"),
            token: localStorage.getItem("userData"),
            EditBoarding: false, 
            editBoardingId: ''
        };
        this.EditBoarding = this.EditBoarding.bind(this);
    }
    
    componentDidMount = () => {
        this.refreshData();
    }
    
    refreshData(){
        var bearer = 'Bearer ' + this.state.token;
        let apiUrl = '';
        if(this.state.EditBoarding){
            apiUrl = config.API_URL + '/employee/onboarding/list/' + this.state.orgId+"?id="+this.state.editBoardingId+"?tab=1";
        }
        else{
            apiUrl = config.API_URL + '/employee/onboarding/list/' + this.state.orgId+"?tab=1&list=true";
        }
        axios.get(apiUrl, { headers: { Authorization: bearer } })
            .then(r => {
                this.setState({ data: r.data.onboardingData.rows, dataCount: r.data.onboardingData.count }, ()=>{
                    let tickets = this.state.data;
                    if (this.state.dataCount > 0) {
                        tickets = this.state.data;
                        for (let key in tickets) {
                            tickets[key].action = <a href="javascript:void(0)" onClick={() => this.EditBoarding(tickets[key].id)}>Edit</a>;
                            console.log('Ticket Status', isNaN(tickets[key].status), tickets[key].status);
                            tickets[key].status = config.ONBOARDING_STATUS && !isNaN(tickets[key].status) ? config.ONBOARDING_STATUS[tickets[key].status] : '';
                            console.log('Ticket Status', tickets[key].status);
                            tickets[key].createdOn = Moment(tickets[key].createdOn).format(config.DATE_FORMAT);
                            tickets[key].estimatedJoiningDate = tickets[key].estimatedJoiningDate ? Moment(tickets[key].estimatedJoiningDate).format(config.DATE_FORMAT) : '';
                            if(key == this.state.dataCount-1){
                                this.setState({
                                    data : tickets,
                                    showData : true
                                })
                            }
                        }

                        
                    }
                })
                

            })
            .catch((error) => {
                console.log("API ERR: ",error);
                console.error(error);
                // res.json({ error: error });
        });
    }
    
    EditBoarding = (id) => {
        this.setState({EditBoarding : true, editBoardingId: id})
    }

    
    render() { 
        let tickets = this.state.data;
        console.log('Data Count', this.state.dataCount);
        
        const Header = ["Employee Name","Email", "Added On", "Estimate Joining Date", "Department", "Designation", "Work Location", "Status", "Action"];
        return ( 
            <>
            {!this.state.EditBoarding ? (
            <div>
                 <h4 className="font-16  mb-2">New Onboarding</h4>
            <Card className="card d-block p-5 mt-2 shadow-sm">
                {/* <div className="d-flex jcs aic">
                    <h3 className="font-16 blackB ">New Onboarding</h3>
                  
                </div> */}
                <div className="col-sm-12">
                    <OnboardingRequest />
                </div>
            </Card>

            <h4 className="font-weight-bold font-16  mt-5">Onboarding History</h4>
            
            {/* <div className="d-flex jcs aic mb-4">
                    <h3 className="font-16 blackB "></h3>
                     </div> */}
                {this.state.dataCount == 0 && this.state.dataCount !== '' ? (<Card className="card d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm"><h3>No Records Found</h3></Card>) : this.state.dataCount !== 0 && this.state.dataCount > 0 && this.state.showData? (
                    <Card className="card d-block pl-3 pt-1 pr-3 pb-3 mt-1 shadow-sm">
                                <TablePagination
                                    title=""
                                    subTitle=""
                                    headers={Header}
                                    data={tickets}
                                    columns="name.personalEmail.createdOn.estimatedJoiningDate.department.position.workLocation.status.action"
                                    perPageItemCount={10}
                                    totalCount={this.state.dataCount}
                                    paginationClassName="pagination-status"
                                    className="react-pagination-table mt-3 py-3"
                                    arrayOption={[["size", 'all', ' ']]}
                                />
                           </Card> ) : <TableLoader></TableLoader>
                }
            </div>) : <OnboardingTab setId={this.EditBoarding} editBoarding={this.state.editBoardingId} editData={this.state.data}/>
    }</>
         );
    }
}
 
export default OnboardingTable;
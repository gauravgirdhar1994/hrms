import SearchView from './SearchView';
import FormsView from './FormsView';
import TablesView from './TablesView';
import Icons from './Icons';
import Faq from './Faq';
import Error500 from './Error500';
import NotFound from './NotFound';
import Personal from './Personal';
import Documents from './Documents';
import Login from './Login';
import ChangePassword from './ChangePassword';
import ResetPassword from './ResetPassword';
import Attendance from './Attendance'
import LeaveRequest from './LeaveRequest'
import AttendanceImport from './AttendanceImport'
import DependentImport from './DependentImport'
import MyTickets from './MyTickets'
import CreateTicket from './CreateTicket'
import Ticket from './Ticket'
import Onboarding from './Onboarding'
import OnboardingTab from '../components/Onboarding/OnboardingTab';
import Settings from './Settings'
import Organizations from './Organizations'
import Employees from './Employees'
import AddEmployee from './AddEmployee'
import HealthInsurance from './HealthInsurance'
import HealthDetails from './HealthDetails'
import InsuranceImportData from './InsuranceImportData'
import Insurance from './InsurancePlan'
import InsuranceGrade from './InsuranceGrade'
import EmployeeExits from './EmployeeExits'
import SalaryUpload from './SalaryUpload'
import Payslips from './Payslips'
import AdvanceLoan from './AdvanceLoan'
import SalaryList from './SalaryList'
import Salarygenrate from './Salarygenrate'
import Network from './Network'
import UploadEmployeeDocument from './UploadEmployeeDocument'
import ViewTeam from './ViewTeam'
import Incentive from './Incentive'
import HospitalList from './HospitalList'
import HospitalPlanView from './HospitalPlanView'
import HospitalUpload from './HospitalUpload'
import SalarySlip from './SalarySlip'
import AcceptOffer from './AcceptOffer'
import WPS from './WPS'
import Gratuity from './Gratuity'
import Blogs from './Blogs'
import InsuranceMaster from './InsuranceMaster'
import AdminUser from './AdminUser';
import InsuranceCategory from './InsuranceCategory'
import AddFaq from './AddFaq'
import UploadMOL from './UploadMOL';
import Insurer from './Insurer';
import Leads from './leads/leads';

let Dashboards = {};
Dashboards['Dashboard'] = require('./dashboards/Dashboard').default;

export {
    Dashboards,
    SearchView,
    FormsView,
    TablesView,
    Icons,
    Login,
    Faq,
    Error500,
    NotFound,
    Personal,
    Documents,
    Attendance,
    LeaveRequest,
    AttendanceImport,
    DependentImport,
    MyTickets,
    CreateTicket,
    ChangePassword,
    ResetPassword,
    Ticket,
    Onboarding,
    AdminUser,
    Settings,
    Organizations,
    Employees,
    AddEmployee,
    HealthInsurance,
    HealthDetails,
    InsuranceImportData,
    Insurance,
    EmployeeExits,
    SalaryUpload,
    Payslips,
    AdvanceLoan,
    OnboardingTab,
    SalaryList,
    Salarygenrate,
    Network,
    UploadEmployeeDocument,
    ViewTeam,
    Incentive,
    HospitalList,
    HospitalPlanView,
    HospitalUpload,
    SalarySlip,
    AcceptOffer,
    WPS,
    Gratuity,
    Blogs,
    InsuranceCategory,
    AddFaq,
    UploadMOL,
    Insurer,
    InsuranceMaster,
    Leads,
    InsuranceGrade
};
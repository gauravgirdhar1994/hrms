import { Dashboards, Personal, SearchView, Documents, Login, FormsView, TablesView, Faq, AddFaq, Icons, Error500, NotFound, Attendance, AttendanceImport, LeaveRequest, MyTickets, CreateTicket, ChangePassword, ResetPassword, Ticket, Onboarding, Settings, HealthInsurance, HealthDetails, InsuranceImportData, Organizations, Employees, Insurance, AddEmployee, EmployeeExits, SalaryUpload, Payslips, AdvanceLoan, SalaryList, Salarygenrate, Network, OnboardingTab, UploadEmployeeDocument, ViewTeam, Incentive, HospitalList, HospitalPlanView, HospitalUpload, SalarySlip, AcceptOffer, WPS, Gratuity, Blogs, InsuranceCategory, UploadMOL, Insurer, InsuranceMaster, Leads, InsuranceGrade, DependentImport, AdminUser } from './views';
import LeaveImport from './views/leads/LeaveImport';

var routes = [
    { path: "/", name: "Home", component: Dashboards['Dashboard'], showInNav: false },
    // { path: "/home", name: "Dashboard 1", component: Dashboards['Dashboard'], showInNav: false, layout: 'Layout1' },
    { path: "/dashboard", name: "Dashboard", component: Dashboards['Dashboard'], showInNav: true, icon: "icon-home icons align-middle mr-1", layout: 'Layout1' },
    { path: "/login", name: "Layout 2", component: Login, showInNav: false, layout: 'Layout2' },
    { path: "/reset-password/:token", name: "Layout 2", component: ChangePassword, showInNav: false, layout: 'Layout2' },
    { path: "/uploadDocument/:token", name: "Layout 3", component: UploadEmployeeDocument, showInNav: false, layout: 'Layout3' },
    { path: "/accept-offer", name: "Layout 3", component: AcceptOffer, showInNav: false, layout: 'Layout3' },
    { path: "/upload-mol", name: "Layout 3", component: UploadMOL, showInNav: false, layout: 'Layout3' },
    { path: "/forgot-password", name: "Layout 2", component: ResetPassword, showInNav: false, layout: 'Layout2' },
    {
        path: "/charts", name: "My Info", component: Personal, showInNav: true, icon: "icon-exclamation icons align-middle mr-1",
        children: [
            { path: "/my-info/personal", name: "Personal", component: Personal },
            { name: "Attendance", path: "/my-info/attendance", component: Attendance },
            { name: "Leave Request", path: "/my-info/leaverequest", component: LeaveRequest },
            { name: "Health Insurance", path: "/my-info/home3", component: Dashboards['Dashboard'] },
            { name: "Docuemnts", path: "/my-info/documents", component: Documents }
        ]
    },

    // { path: "/ticket", name: "ticket", component: Ticket, showInNav: true, icon:"icon-exclamation icons align-middle mr-1", 
    //         children:[
    //             {name:"Ticket", path:"/ticket", component: Ticket}

    //         ]
    // },
    { path: "/search", name: "Employees", component: SearchView, showInNav: true, icon: "icon-user icons align-middle mr-1" },
    {
        path: "/todo-tickets", name: "To Do/Tickets", component: AttendanceImport, showInNav: true, icon: "icon-paper-clip icons align-middle mr-1",
        children: [
            { name: "My Tickets", path: "/mytickets", component: MyTickets },
            { name: "Create Ticket", path: "/createticket", component: CreateTicket },
        ]
    },
    {
        path: "/payroll", name: "Payroll", component: AttendanceImport, showInNav: true, icon: "icon-wallet icons align-middle mr-1",
        children: [
            { name: "Attendance Import", path: "/attendanceimport", component: AttendanceImport },
            { name: "Payslips", path: "/payslips", component: Payslips }

        ]
    },
    //  { path: "/employe-exits", name: "Employee Exits", component: MyTickets, showInNav: true, icon:"icon-wallet icons align-middle mr-1" },
    //  { path: "/employe-exits", name: "Employee Exits", component: Settings, showInNav: true, icon:"icon-user-unfollow icons align-middle mr-1" },


    { path: "/settings", name: "settings", component: Settings, showInNav: true, icon: "icon-settings icons align-middle mr-1" },
    { path: "/organizations", name: "organizations", component: Organizations, showInNav: true, icon: "icon-users icons align-middle mr-1" },
    { path: "/employees", name: "employees", component: Employees, showInNav: true, icon: "icon-users icons align-middle mr-1" },
    { path: "/employees/visa/:visa", name: "employees", component: Employees, showInNav: true, icon: "icon-users icons align-middle mr-1" },
    { path: "/employees/insurance/:insurance", name: "employees", component: Employees, showInNav: true, icon: "icon-users icons align-middle mr-1" },
    { path: "/icons", name: "Icons", component: Icons, showInNav: false, icon: "icon-puzzle icons mr-1" },
    { path: "/my-info/personal", name: "Personal", component: Personal, showInNav: false },
    { path: "/my-info/edit/:id", name: "Personal", component: Personal, showInNav: false },
    { path: "/my-info/leave-request", name: "LeaveRequest", component: LeaveRequest, showInNav: false },
    { path: "/my-info/attendance", name: "Attendance", component: Attendance, showInNav: false },
    { path: "/employees/add", name: "Add Employee", component: AddEmployee, showInNav: false },
    { path: "/tickets/my-tickets", name: "My Tickets", component: MyTickets, showInNav: false },
    { path: "/tickets/create-tickets", name: "Create Ticket", component: CreateTicket, showInNav: false },
    { path: "/payroll/payslips", name: "Payslips", component: Payslips, showInNav: false },
    { path: "/payroll/attendance-import", name: "Attendance Import", component: AttendanceImport, showInNav: false },
    { path: "/my-info/documents", name: "Documents", component: Documents, showInNav: false },
    { name: "Health Insurance", path: "/my-info/health-insurance", component: HealthInsurance, showInNav: false },
    { name: "Health details", path: "/my-info/health-details", component: HealthDetails, showInNav: false },
    { name: "Insurance Import", path: "/insurance-import", component: InsuranceImportData, showInNav: false },

    {
        name: "Insurance", path: "/insurance", component: Insurance, showInNav: true, icon: "icon-wallet icons align-middle mr-1",
        children: [
            { name: "Insurer", path: "/insurer", component: Insurer },
            { name: "Insurance List", path: "/insurance", component: Insurance },
        ]
    },
    { name: "Insurer", path: "/insurer", component: Insurer, showInNav: false },
    { name: "Insurance Master", path: '/insurance/master', component: InsuranceMaster, showInNav: true },
    { name: "Insurance Grade", path: '/insurance/grade', component: InsuranceGrade, showInNav: true },
    { name: "Employee Exits", path: "/employee-exit", component: EmployeeExits, showInNav: true },
    { name: "Salary Import", path: "/salary-import", component: SalaryUpload, showInNav: true },
    { path: "/payroll/advance-loan", name: "Advance Loan", component: AdvanceLoan, showInNav: false },
    { name: "On boarding", path: "/employee/on-boarding/list", component: Onboarding, showInNav: true },
    { name: "On boarding", path: "/employee/admin-new-user", component: AdminUser, showInNav: true },
    { name: "On boarding", path: "/employee/on-boarding/new", component: OnboardingTab, showInNav: false },
    { name: "On boarding", path: "/employee/on-boarding", component: Onboarding, showInNav: true },
    { name: "Salary List", path: "/payroll/salary-list", component: SalaryList, showInNav: true },
    { name: "Salary Genrate", path: "/payroll/salary-generate", component: Salarygenrate, showInNav: true },
    { name: "Pay Slip", path: '/payroll/payslip', component: SalarySlip, showInNav: true },
    { name: "View Team", path: "/employee/view-team", component: ViewTeam, showInNav: true },
    { name: "Import Dependent Data", path: "/employee/dependent-import", component: DependentImport, showInNav: true },



    // {name:"On boarding", path:"/employee/on-boarding",component:Onboarding,showInNav: true},

    //  {name:"Employee Exits ", path:"/employe-exits", component:EmployExits, showInNav: true},

    { path: "/payroll/incentive", name: "Incentive", component: Incentive, showInNav: true },
    { path: "/hospital/plan-wise-hospital", name: "Hospital Plan", component: HospitalPlanView, showInNav: true },
    { path: "/hospital/upload-list", name: "Hospital upload", component: HospitalUpload, showInNav: true },
    { path: "/hospital/master-list", name: "Hospital list", component: HospitalList, showInNav: true },
    { path: "/hospital/tpa-list", name: 'TPA List', component: InsuranceCategory, showInNav: true },
    { path: "/payroll/wps", name: "WPS Calculate", component: WPS, showInNav: true },
    { path: "/payroll/gratuity", name: "Gratuity Estimator", component: Gratuity, showInNav: true },
    { path: "/view-team", name: "ViewTeam", component: ViewTeam, showInNav: true },
    { path: "/dependent-import", name: "Import Dependent Data", component: DependentImport, showInNav: true },
    { path: "/leave-balance", name: "Import Leave Balance", component: LeaveImport, showInNav: true },
    { path: "/network", name: "Network", component: Network, showInNav: true },
    { path: "/blogs", name: "Blogs", component: Blogs, showInNav: true, icon: "icon-wallet icons align-middle mr-1" },
    {
        name: "Lead Management", path: "/leads", component: Leads, showInNav: true, icon: "icon-wallet icons align-middle mr-1",
        children: [
            { name: "Manage Leads", path: "/leads", component: Leads }
        ]
    },
    { name: "Lead Management", path: "/leads", component: Leads, showInNav: false },
    { path: "/faq", name: "FAQ", component: Faq, showInNav: false },
    { path: "/faq/faq-list", name: "FaqList", component: Faq, showInNav: false },
    { path: "/faq/add-faq", name: "AddFaq", component: AddFaq, showInNav: false },
    { path: "/faq/edit-faq/:id", name: "AddFaq", component: AddFaq, showInNav: false },
    { path: "/notfound", name: "Error 404", component: NotFound, showInNav: false },
    { path: "/500", name: "Error 500", component: Error500, showInNav: false },
    { path: "/*", name: "NotFound", component: NotFound }
];

export {
    routes
};

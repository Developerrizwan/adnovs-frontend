import React from "react";
import { Redirect } from "react-router-dom";

//Dashboard
import DashboardCrm from "../pages/DashboardCrm";

//AuthenticationInner pages
import BasicSignIn from "../pages/AuthenticationInner/Login/BasicSignIn";
import CoverSignIn from "../pages/AuthenticationInner/Login/CoverSignIn";
import BasicSignUp from "../pages/AuthenticationInner/Register/BasicSignUp";
import CoverSignUp from "../pages/AuthenticationInner/Register/CoverSignUp";
import BasicPasswReset from "../pages/AuthenticationInner/PasswordReset/BasicPasswReset";

import CoverPasswReset from "../pages/AuthenticationInner/PasswordReset/CoverPasswReset";
import BasicLockScreen from "../pages/AuthenticationInner/LockScreen/BasicLockScr";
import CoverLockScreen from "../pages/AuthenticationInner/LockScreen/CoverLockScr";
import BasicLogout from "../pages/AuthenticationInner/Logout/BasicLogout";
import CoverLogout from "../pages/AuthenticationInner/Logout/CoverLogout";
import BasicSuccessMsg from "../pages/AuthenticationInner/SuccessMessage/BasicSuccessMsg";
import CoverSuccessMsg from "../pages/AuthenticationInner/SuccessMessage/CoverSuccessMsg";
import BasicTwosVerify from "../pages/AuthenticationInner/TwoStepVerification/BasicTwosVerify";
import CoverTwosVerify from "../pages/AuthenticationInner/TwoStepVerification/CoverTwosVerify";
import Basic404 from "../pages/AuthenticationInner/Errors/Basic404";
import Cover404 from "../pages/AuthenticationInner/Errors/Cover404";
import Alt404 from "../pages/AuthenticationInner/Errors/Alt404";
import Error500 from "../pages/AuthenticationInner/Errors/Error500";

import BasicPasswCreate from "../pages/AuthenticationInner/PasswordCreate/BasicPasswCreate";
import CoverPasswCreate from "../pages/AuthenticationInner/PasswordCreate/CoverPasswCreate";
import Offlinepage from "../pages/AuthenticationInner/Errors/Offlinepage";

//login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";

// User Profile
import UserProfile from "../pages/Authentication/user-profile";

import Companies from "../views/Companies";
import Users from "../views/Users";
import Groups from "../views/Groups";
import Locations from "../views/Locations";
import Devices from "../views/Devices";
import Servers from "../views/Servers";
import AddServer from "../views/Servers/AddServer";
import EditServer from "../views/Servers/EditServer";
import Project from "../views/Project";
import Ticket from "../views/Ticket";
import Plans from "../views/Plans";
import CouponManagement from "../views/CouponManagement";
import Admin from "../views/Admin";
// import AddProject from "../views/Project/AddProject";
import Team from "../views/Team";
import Client from "../views/Client";
import UserManagement from "../views/UserManagement";
import SubscriptionManagement from "../views/SubscriptionManagement";
import AddProject from "../views/Project/AddProject";
import ViewProject from "../views/Project/ViewProject";
import Report from "../views/Project/Report";
import Success from "../views/Plans/Success";
import AddTicket from "../views/Ticket/CreateInvoice";
import Jobs from "../views/Jobs";
import Vouchers from "../views/Vouchers";
import JournalVoucher from "../views/Vouchers/JournalVoucher";
import PaymentVoucher from "../views/Vouchers/PaymentVoucher";
import ReceiptVoucher from "../views/Vouchers/ReceiptVoucher";
import Invoices from "../views/Invoices";
import Purchase from "../views/Invoices/Purchase";
import Sales from "../views/Invoices/Sales";
import ResetPassword from "../pages/AuthenticationInner/ResetPassword";
import ResetSuccessful from "../pages/AuthenticationInner/ResetPassword/ResetSuccessful";
import RegisterSuccessful from "../pages/AuthenticationInner/Register/RegisterSuccessful";
import AddJobs from "../views/Jobs/AddJob";
// import EditJobs from "../views/Jobs/EditJob";
import AddUser from "../views/UserManagement/AddUser";
import EditUser from "../views/UserManagement/EditUser";
import AllVouchers from "../views/Vouchers/AllVouchers";
import DebitVoucher from "../views/Vouchers/DebitVoucher";
import CreditVoucher from "../views/Vouchers/CreditVoucher";
import TaxInvoice from "../views/TaxInvoice/TaxInvoice";
import TaxInvoiceSecond from "../views/TaxInvoice/TaxInvoiceSecond";
import ChartOfAccounts from "../views/ChartOfAccounts";
import AddCOA from "../views/ChartOfAccounts/AddCOA";
import CreateNewJob from "../views/Jobs/CreateNewJob";

const authProtectedRoutes = [
  { path: "/dashboard", component: DashboardCrm },
  { path: "/index", component: DashboardCrm },

  { path: "/devices", component: Devices },
  { path: "/locations", component: Locations },
  { path: "/servers/edit/:serverId/", component: EditServer },
  { path: "/servers/add", component: AddServer },
  { path: "/servers", component: Servers },
  { path: "/users", component: Users },
  { path: "/groups", component: Groups },
  { path: "/companies", component: Companies },
  { path: "/team", component: Team },
  { path: "/client", component: Client },
  { path: "/jobs", component: Jobs },
  { path: "/jobs/add", component: AddJobs },
  { path: "/jobs/createjob", component: CreateNewJob },
  // { path: "/jobs/edit/:jobId/", component: EditJobs },
  { path: "/coa", component: ChartOfAccounts },
  { path: "/add-coa", component: AddCOA },
  { path: "/vouchers", component: Vouchers },
  { path: "/all-vouchers", component: AllVouchers },
  { path: "/journal-voucher", component: JournalVoucher },
  { path: "/payment-voucher", component: PaymentVoucher },
  { path: "/receipt-voucher", component: ReceiptVoucher },
  { path: "/debit-voucher", component: DebitVoucher },
  { path: "/credit-voucher", component: CreditVoucher },
  { path: "/user-management/add", component: AddUser },
  { path: "/user-management/edit/:userId", component: EditUser },
  { path: "/user-management", component: UserManagement },
  { path: "/invoices", component: Invoices },
  { path: "/invoices/add", component: Sales },
  { path: "/purchase", component: Purchase },
  // { path: "/sales", component: Sales},
  { path: "/project", component: Project },
  { path: "/project/add", component: AddProject },
  { path: "/project/:projectId/", component: ViewProject },
  { path: "/report/:reportId", component: Report },
  { path: "/ticket", component: Ticket },
  { path: "/ticket/add", component: AddTicket },
  { path: "/plans/success", component: Success },
  { path: "/plans", component: Plans },
  { path: "/couponmanagement", component: CouponManagement },
  { path: "/admin", component: Admin },
  { path: "/subscriptionmanagement", component: SubscriptionManagement },

  // { path: "/project/add", component: AddProject },

  //User Profile
  { path: "/profile", component: UserProfile },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "*",
    exact: true,
    component: () => <Redirect to="/dashboard" />,
  },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: Logout },
  { path: "/login", component: CoverSignIn },
  { path: "/reset-password", component: ResetPassword },
  { path: "/reset-password-successful", component: ResetSuccessful },
  { path: "/forgot-password", component: ForgetPasswordPage },
  { path: "/register", component: Register },

  //AuthenticationInner pages
  { path: "/auth-signin-basic", component: BasicSignIn },
  { path: "/auth-signin-cover", component: CoverSignIn },
  { path: "/auth-signup-basic", component: BasicSignUp },
  { path: "/auth-signup-cover", component: CoverSignUp },
  { path: "/register-successful", component: RegisterSuccessful },
  { path: "/auth-pass-reset-basic", component: BasicPasswReset },
  { path: "/auth-pass-reset-cover", component: CoverPasswReset },
  { path: "/auth-lockscreen-basic", component: BasicLockScreen },
  { path: "/auth-lockscreen-cover", component: CoverLockScreen },
  { path: "/auth-logout-basic", component: BasicLogout },
  { path: "/auth-logout-cover", component: CoverLogout },
  { path: "/auth-success-msg-basic", component: BasicSuccessMsg },
  { path: "/auth-success-msg-cover", component: CoverSuccessMsg },
  { path: "/auth-twostep-basic", component: BasicTwosVerify },
  { path: "/auth-twostep-cover", component: CoverTwosVerify },
  { path: "/auth-404-basic", component: Basic404 },
  { path: "/auth-404-cover", component: Cover404 },
  { path: "/auth-404-alt", component: Alt404 },
  { path: "/auth-500", component: Error500 },

  { path: "/auth-pass-change-basic", component: BasicPasswCreate },
  { path: "/auth-pass-change-cover", component: CoverPasswCreate },
  { path: "/auth-offline", component: Offlinepage },

  { path: "/tax-invoice", component: TaxInvoice },
  { path: "/tax-invoice-second", component: TaxInvoiceSecond },
];

export { authProtectedRoutes, publicRoutes };

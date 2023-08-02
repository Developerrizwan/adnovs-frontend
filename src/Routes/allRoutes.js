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
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";

// User Profile
import UserProfile from "../pages/Authentication/user-profile";

import Users from "../views/Users";
import Project from "../views/Project";
import Admin from "../views/Admin";
import Client from "../views/Client";
import UserManagement from "../views/UserManagement";
import AddProject from "../views/Project/AddProject";
import ViewProject from "../views/Project/ViewProject";
import Report from "../views/Project/Report";
import Jobs from "../views/Jobs";
import Vouchers from "../views/Vouchers";
import JournalVoucher from "../views/Vouchers/JournalVoucher";
import Invoices from "../views/Invoices";
import Purchase from "../views/Invoices/Purchase";
import Sales from "../views/Invoices/Sales";
import ResetPassword from "../pages/AuthenticationInner/ResetPassword";
import ResetSuccessful from "../pages/AuthenticationInner/ResetPassword/ResetSuccessful";
import RegisterSuccessful from "../pages/AuthenticationInner/Register/RegisterSuccessful";
import AddJobs from "../views/Jobs/AddJob";
import AddUser from "../views/UserManagement/AddUser";
import EditUser from "../views/UserManagement/EditUser";
import TaxInvoice from "../views/TaxInvoice/TaxInvoice";
import TaxInvoiceSecond from "../views/TaxInvoice/TaxInvoiceSecond";
import ChartOfAccounts from "../views/ChartOfAccounts";
import AddCOA from "../views/ChartOfAccounts/AddCOA";
import CostEntry from "../views/Cost Entry";
import AddCostEntry from "../views/Cost Entry/AddCostEntry";
import AddCharge from "../views/Charge/AddCharge";
import Charge from "../views/Charge";
import CreateNewJob from "../views/Jobs/CreateNewJob";
import Organization from "../views/Organization";
import AddOrganization from "../views/Organization/AddOrganization";

const authProtectedRoutes = [
  { path: "/dashboard", component: DashboardCrm },
  { path: "/index", component: DashboardCrm },
  { path: "/users", component: Users },
  { path: "/client", component: Client },
  { path: "/jobs", component: Jobs },
  { path: "/jobs/add", component: AddJobs },
  { path: "/jobs/createjob", component: CreateNewJob },
  { path: "/organization", component: Organization },
  { path: "/organization/add", component: AddOrganization },
  { path: "/coa/add", component: AddCOA },
  { path: "/coa", component: ChartOfAccounts },
  { path: "/cost-entry/add", component: AddCostEntry },
  { path: "/cost-entry", component: CostEntry },
  { path: "/charge/add", component: AddCharge },
  { path: "/charge", component: Charge },
  { path: "/voucher/:voucherId", component: JournalVoucher },
  { path: "/vouchers", component: Vouchers },
  { path: "/user-management/add", component: AddUser },
  { path: "/user-management/edit/:userId", component: EditUser },
  { path: "/user-management", component: UserManagement },
  { path: "/invoices", component: Invoices },
  { path: "/invoices/:invoicesId", component: Sales },
  { path: "/purchase", component: Purchase },
  { path: "/project", component: Project },
  { path: "/project/add", component: AddProject },
  { path: "/project/:projectId/", component: ViewProject },
  { path: "/report/:reportId", component: Report },
  { path: "/admin", component: Admin },
  { path: "/profile", component: UserProfile },
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
  { path: "/tax-invoice-second/:invoiceId", component: TaxInvoiceSecond },
];

export { authProtectedRoutes, publicRoutes };

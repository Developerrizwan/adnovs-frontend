import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const Navdata = () => {
  const history = useHistory();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isSettings, setIsSettings] = useState(false);
  const [isMaster, setMaster] = useState(false);
  const [isJobs, setJobs] = useState(false);
  const [isVouchers, setVouchers] = useState(false);
  const [isInvoices, setInvoices] = useState(false);
  const [isFinance, setFinance] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  const [isReports, setIsReports] = useState(false);
  const [isAccountDetails, setIsAccountDetails] = useState(false);
  const [isCoa, setIsCoa] = useState(false);
  const [isCoag, setIsCoag] = useState(false);
  const [isCostEntry, setIsCostEntry] = useState(false);
  const [isCharge, setIsCharge] = useState(false);
  const [isUserManagement, setisUserManagement] = useState(false);
  const [isOrganization, setIsOrganization] = useState(false);
  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  // ────────────────────────────────────────────────
  // NEW STATE — only for the new "New Reports" section
  // ────────────────────────────────────────────────
  const [isNewReports, setIsNewReports] = useState(false);

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Dashboard") {
      setIsDashboard(false);
    }

    if (iscurrentState !== "Settings") {
      setIsSettings(false);
    }

    if (iscurrentState !== "Masters") {
      setMaster(false);
    }
    if (iscurrentState !== "UserManagement") {
      setisUserManagement(false);
    }
    if (iscurrentState !== "Organization") {
      setIsOrganization(false);
    }
    if (iscurrentState !== "Company") {
      setIsCompany(false);
    }
    if (iscurrentState !== "Account Details") {
      setIsAccountDetails(false);
    }

    if (iscurrentState !== "Coa") {
      setIsCoa(false);
    }
    if (iscurrentState !== "Coag") {
      setIsCoag(false);
    }
    if (iscurrentState !== "cost-entry") {
      setIsCostEntry(false);
    }
    if (iscurrentState !== "charge") {
      setIsCharge(false);
    }
    if (iscurrentState !== "reports") {
      setIsReports(false);
    }

    if (iscurrentState !== "Invoices") {
      setInvoices(false);
    }

    if (iscurrentState !== "Finance") {
      setFinance(false);
    }

    if (iscurrentState !== "Shipment") {
      setJobs(false);
    }

    // ────────────────────────────────────────────────
    // NEW — reset new reports state when not active
    // ────────────────────────────────────────────────
    if (iscurrentState !== "NewReports") {
      setIsNewReports(false);
    }

    if (iscurrentState === "Widgets") {
      history.push("/widgets");
      document.body.classList.add("twocolumn-panel");
    }
  }, [
    history,
    iscurrentState,
    isDashboard,
    isCompany,
    isAccountDetails,
    isUserManagement,
    isCoa,
    isCostEntry,
    isCharge,
    isOrganization,
    isMaster,
    isFinance,
    isJobs,
    isInvoices,
  ]);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "ri-dashboard-2-line",
      src: "/dashboard-sidebar.png",
      link: "/dashboard",
      stateVariables: isDashboard,
      roles: ["superadmin", "admin", "user"],
    },
    {
      id: "jobs",
      label: "Shipment",
      icon: "ri-customer-service-line",
      link: "/jobs",
      src: "/jobs-sidebar.png",
      stateVariables: isJobs,
      roles: ["superadmin", "admin", "user"],
    },
    {
      id: "finance",
      label: "Finance",
      icon: "ri-bank-line",
      src: "/jobs-sidebar.png",
      stateVariables: isFinance,
      roles: ["superadmin", "admin", "user"],
      click: function (e) {
        e.preventDefault();
        setFinance(!isFinance);
        setIscurrentState("Finance");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "vouchers",
          label: "Vouchers",
          icon: "ri-folder-chart-line",
          link: "/vouchers",
          src: "/voucher-sidebar.png",
          stateVariables: isVouchers,
          roles: ["superadmin", "admin", "user"],
        },
        {
          id: "invoices",
          label: "Invoices",
          icon: "ri-ticket-line",
          link: "/invoices",
          src: "/invoices-sidebar.png",
          stateVariables: isInvoices,
          roles: ["superadmin", "admin", "user"],
        },
        {
          id: "coag",
          label: "COA Groups",
          icon: "ri-line-chart-fill",
          link: "/coag",
          stateVariables: isCoag,
          roles: ["superadmin", "admin", "user"],
        },
        {
          id: "charge",
          label: "Charge",
          icon: "ri-money-dollar-box-line",
          link: "/charge",
          stateVariables: isCharge,
          roles: ["superadmin", "admin", "user"],
        },
        {
          id: "coa",
          label: "Chart of Accounts",
          icon: "ri-line-chart-fill",
          link: "/coa",
          stateVariables: isCoa,
          roles: ["superadmin", "admin", "user"],
        },
        {
          id: "cost-entry",
          label: "Cost Entry",
          icon: "ri-wallet-3-line",
          link: "/cost-entry",
          stateVariables: isCostEntry,
          roles: ["superadmin", "admin", "user"],
        },

        {
          id: "reports",
          label: "Reports",
          icon: "ri-folders-line",
          link: "/reports",
          src: "/account.png",
          stateVariables: isReports,
          roles: ["superadmin", "admin", "user"],
        },
      ],
    },
    {
      id: "masters",
      label: "Masters",
      icon: "ri-admin-line",
      src: "/jobs-sidebar.png",
      stateVariables: isMaster,
      roles: ["superadmin", "admin", "user"],
      click: function (e) {
        e.preventDefault();
        setMaster(!isMaster);
        setIscurrentState("Masters");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "Account Details",
          label: "Account Details",
          icon: "ri-coupon-5-line",
          link: "/account-details",
          src: "/account.png",
          stateVariables: isAccountDetails,
          roles: ["admin"],
        },
        {
          id: "Organization",
          label: "Organization",
          icon: "ri-team-line",
          link: "/organization",
          src: "/team.png",
          stateVariables: isOrganization,
          roles: ["superadmin", "admin", "user"],
        },
        {
          id: "Branch",
          label: "Branch",
          icon: "ri-git-branch-line",
          link: "/branch",
          src: "/account.png",
          stateVariables: isCompany,
          roles: ["admin"],
        },
        {
          id: "user-management",
          label: "User Management",
          icon: "ri-account-circle-line",
          link: "/user-management",
          src: "/users-sidebar.png",
          stateVariables: isUserManagement,
          roles: ["superadmin", "admin", "user"],
        },
        {
          id: "Company",
          label: "Company",
          icon: "ri-secure-payment-line",
          link: "/company",
          src: "/account.png",

          stateVariables: isCompany,
          roles: ["admin"],
        },
      ],
    },

    // ────────────────────────────────────────────────
    // NEW TOP-LEVEL ITEM ADDED HERE
    // ────────────────────────────────────────────────
    {
      id: "new-reports",
      label: "New Reports",
      icon: "ri-file-list-3-line",           // ← you can change the icon later
      stateVariables: isNewReports,
      roles: ["superadmin", "admin", "user"],
      click: function (e) {
        e.preventDefault();
        setIsNewReports(!isNewReports);
        setIscurrentState("NewReports");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "ledger-statement",
          label: "Ledger Statement",
          icon: "ri-book-open-line",
          link: "/ledger-statement",              // consistent with /reports
          roles: ["superadmin", "admin", "user"],
        },
        // {
        //   id: "trial-balance",
        //   label: "Trial Balance",
        //   icon: "ri-balance-scale-line",
        //   link: "/trail",
        //   roles: ["superadmin", "admin", "user"],
        // },
        // {
        //   id: "account-statement",
        //   label: "Account Statement",
        //   icon: "ri-file-chart-line",
        //   link: "/organization-statement",
        //   roles: ["superadmin", "admin", "user"],
        // },
        {
          id: "accounts-receivable",
          label: "Accounts Receivable",
          icon: "ri-arrow-down-circle-fill",
          link: "/accounts-receivable",
        },
        {
          id: "accounts-payable",
          label: "Accounts Payable",
          icon: "ri-arrow-up-circle-fill",
          link: "/accounts-payable",
        },
        {
          id: "trail-balance",
          label: "Trial Balance",
          icon: "ri-balance-scale-line",
          link: "/trail-balance",
        }
      ],
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
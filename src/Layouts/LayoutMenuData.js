import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const Navdata = () => {
  const history = useHistory();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isSettings, setIsSettings] = useState(false);
  const [isTeam, setIsTeam] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isProject, setIsProject] = useState(false);
  const [isTicket, setIsTicket] = useState(false);
  const [isPlans, setIsPlans] = useState(false);
  const [isMyAccount, setisMyAccount] = useState(false);
  const [isCoa, setIsCoa] = useState(false);
  const [isCostEntry, setIsCostEntry] = useState(false);
  const [isCharge, setIsCharge] = useState(false);
  const [isUserManagement, setisUserManagement] = useState(false);
  const [isCouponManagement, setisCouponManagement] = useState(false);
  const [isPaymentManagement, setisPaymentManagement] = useState(false);
  const [isSubscriptionManagement, setisSubscriptionManagement] =
    useState(false);
  const [iscurrentState, setIscurrentState] = useState("Dashboard");
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

    if (iscurrentState !== "Team") {
      setIsTeam(false);
    }
    if (iscurrentState !== "Client") {
      setIsClient(false);
    }
    if (iscurrentState !== "Project") {
      setIsProject(false);
    }
    if (iscurrentState !== "Ticket") {
      setIsTicket(false);
    }
    if (iscurrentState !== "Plans") {
      setIsPlans(false);
    }
    if (iscurrentState !== "MyAccount") {
      setisMyAccount(false);
    }
    if (iscurrentState !== "UserManagement") {
      setisUserManagement(false);
    }
    if (iscurrentState !== "CouponManagement") {
      setisCouponManagement(false);
    }
    if (iscurrentState !== "PaymentManagement") {
      setisPaymentManagement(false);
    }
    if (iscurrentState !== "SubscriptionManagement") {
      setisSubscriptionManagement(false);
    }
    if (iscurrentState !== "Coa") {
      setIsCoa(false);
    }
    if (iscurrentState !== "cost-entry") {
      setIsCostEntry(false);
    }
    if (iscurrentState !== "charge") {
      setIsCharge(false);
    }

    if (iscurrentState === "Widgets") {
      history.push("/widgets");
      document.body.classList.add("twocolumn-panel");
    }
  }, [
    history,
    iscurrentState,
    isDashboard,
    isClient,
    isTeam,
    isProject,
    isTicket,
    isPlans,
    isMyAccount,
    isUserManagement,
    isCouponManagement,
    isPaymentManagement,
    isSubscriptionManagement,
    isCoa,
    isCostEntry,
    isCharge,
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
    // {
    //   id: "team",
    //   label: "Team",
    //   icon: "ri-team-line",
    //   link: "/team",
    //   src: "/team.png",
    //   stateVariables: isTeam,
    //   roles: ["superadmin", "admin", "user"],
    // },
    {
      id: "jobs",
      label: "Jobs",
      icon: "ri-customer-service-line",
      link: "/jobs",
      src: "/jobs-sidebar.png",
      stateVariables: isClient,
      roles: ["superadmin", "admin", "user"],
    },
    {
      id: "vouchers",
      label: "Vouchers",
      icon: "ri-folder-chart-line",
      link: "/vouchers",
      src: "/voucher-sidebar.png",
      stateVariables: isProject,
      roles: ["superadmin", "admin", "user"],
    },
    {
      id: "invoices",
      label: "Invoices",
      icon: "ri-ticket-line",
      link: "/invoices",
      src: "/invoices-sidebar.png",
      stateVariables: isTicket,
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
      id: "charge",
      label: "Charge",
      icon: "ri-money-dollar-box-line",
      link: "/charge",
      stateVariables: isCharge,
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

    // {
    //   id: "profile",
    //   label: "Users",
    //   icon: "ri-account-circle-line",
    //   link: "/profile",
    //   src: "/account.png",
    //   stateVariables: isMyAccount,
    //   roles: ["superadmin", "admin", "user"],
    // },
    {
      id: "user-management",
      label: "User Management",
      icon: "ri-account-circle-line",
      link: "/user-management",
      src: "/users-sidebar.png",
      stateVariables: isMyAccount,
      roles: ["superadmin", "admin", "user"],
    },

    // {
    //   id: "plans",
    //   label: "Plans",
    //   icon: "ri-money-dollar-circle-line",
    //   link: "/plans",
    //   src: "/plan.png",
    //   stateVariables: isPlans,
    //   roles: ["superadmin", "admin", "user"],
    // },
    // {
    //   id: "subscriptionmanagement",
    //   label: "Subscription Management",
    //   icon: "ri-money-dollar-box-line",
    //   link: "/subscriptionmanagement",
    //   src: "/subscription.png",
    //   stateVariables: isSubscriptionManagement,
    //   roles: ["superadmin", "admin"],
    // },
    // {
    //   id: "admin",
    //   label: "Payment Management",
    //   icon: "ri-secure-payment-line",
    //   link: "/admin",
    //   src: "/payment.png",
    //   stateVariables: isPaymentManagement,
    //   roles: ["superadmin", "admin"],
    // },
    // {
    //   id: "couponmanagement",
    //   label: "Coupon Management",
    //   icon: "ri-coupon-5-line",
    //   src: "/coupon.png",
    //   link: "/couponmanagement",
    //   stateVariables: isCouponManagement,
    //   roles: ["superadmin", "admin"],
    // },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;

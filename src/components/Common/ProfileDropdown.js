import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

//import images
import avatar1 from "../../assets/images/users/user-dummy-img.jpg";

const ProfileDropdown = () => {
  const { user } = useSelector((state) => ({
    user: state.Login.user,
  }));

  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      if (!isEmpty(user)) {
        obj.first_name = user?.first_name;
        localStorage.removeItem("authUser");
        localStorage.setItem("authUser", JSON.stringify(obj));
      }

      setUserName(obj?.first_name);
    }
  }, [user]);

  //Dropdown Toggle
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };
  return (
    <React.Fragment>
      <Dropdown
        isOpen={isProfileDropdown}
        toggle={toggleProfileDropdown}
        className="ms-sm-3 header-item "
      >
        <DropdownToggle tag="button" type="button" className="btn">
          <span className="d-flex align-items-center">
            <img
              className="rounded-circle header-profile-user"
              src={avatar1}
              alt="Header Avatar"
            />
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text ">
                {userName?.charAt(0)?.toUpperCase() + userName?.slice(1)}
              </span>
              {/* <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                Founder
              </span> */}
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <h6 className="dropdown-header">Welcome {userName}!</h6>
          <DropdownItem href="/profile">
            <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle">Profile</span>
          </DropdownItem>

          {/* <DropdownItem href="/pages-faqs">
            <i className="mdi mdi-lifebuoy text-muted fs-16 align-middle me-1"></i>{" "}
            <span className="align-middle">Help</span>
          </DropdownItem> */}
          <div className="dropdown-divider"></div>

          <DropdownItem href="/logout">
            <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{" "}
            <span className="align-middle" data-key="t-logout">
              Logout
            </span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;

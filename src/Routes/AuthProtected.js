import React, { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { setAuthorization } from "../helpers/api_helper";
import { useDispatch, useSelector } from "react-redux";

import { useProfile } from "../components/Hooks/UserHooks";

import { logoutUser } from "../store/actions";

const AuthProtected = (props) => {
  // const dispatch = useDispatch();
  // const { userProfile, loading, token } = useSelector((state) => ({
  //   loading: state.Login.loading,
  //   token: state.Login.jwt,
  //   userProfile: state.Login.jwt,
  // }));

  // useEffect(() => {
  //   if (userProfile && !loading && token) {
  //     setAuthorization(token);
  //   } else if (!userProfile && loading && !token) {
  //     dispatch(logoutUser());
  //   }
  // }, [token, userProfile, loading, dispatch]);

  /*
    redirect is un-auth access protected routes via url
    */

  // if (!userProfile && loading && !token) {
  //   return (
  //     <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
  //   );
  // }

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return (
          <>
            {" "}
            <Component {...props} />{" "}
          </>
        );
      }}
    />
  );
};

export { AuthProtected, AccessRoute };

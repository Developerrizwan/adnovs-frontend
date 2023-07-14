import jwt from "jwt-decode";

import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  RESET_LOGIN_FLAG,
  REGISTER_PUBLIC_USER,
} from "./actionTypes";

const initialState = {
  jwt: localStorage.getItem("jwt"),
  jwtRefresh: localStorage.getItem("jwtRefresh"),
  // user: localStorage.getItem("jwt")
  //   ? jwt(localStorage.getItem("jwt"))["username"]
  //   : null,
  error: "",
  loading: false,
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOGIN_SUCCESS:
      state = {
        ...state,
        jwt: action.payload.token,
        jwtRefresh: action.payload.token,
        // user: action.payload.type
        //   ? action.payload.name
        //   : action.payload.token
        //   ? jwt(action.payload.access)["username"]
        //   : null,
        error: "",
        loading: false,
      };
      break;
    case LOGOUT_USER:
      state = { ...state, isUserLogout: false };
      break;
    case LOGOUT_USER_SUCCESS:
      state = { ...state, isUserLogout: true };
      break;
    case API_ERROR:
      state = {
        ...state,
        error: action.payload,
        loading: false,
        isUserLogout: false,
      };
      break;
    case RESET_LOGIN_FLAG:
      state = {
        ...state,
        error: null,
      };
      break;
    case REGISTER_PUBLIC_USER:
      state = {
        ...state,
        loading: true,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default login;

import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import API from "../../../helpers/API";
import jwt from "jwt-decode";
// Login Redux States
import {
  LOGIN_USER,
  LOGOUT_USER,
  SOCIAL_LOGIN,
  REGISTER_PUBLIC_USER,
} from "./actionTypes";
import { apiError, loginSuccess, logoutUserSuccess } from "./actions";

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import { postSocialLogin } from "../../../helpers/fakebackend_helper";
import NotificationManager from "../../../components/Common/NotificationManager";
import apiAuth from "../../../helpers/ApiAuth";

const fireBaseBackend = getFirebaseBackend();

const postJwtLogin = async (email, password) =>
  await API.post("/api/signin/", {
    email: email,
    password: password,
  })
    .then((authUser) => authUser.data)
    .catch((error) => {
      if (error.response.status === 401) {
        return { message: "Incorrect Credentials" };
      } else if (error.response.status === 400) {
        return { message: error.response.data.Error };
      }
      return error;
    });

const postGetGoogleToken = async (gtoken) =>
  await API.post("/api/get-token", {
    gtoken: gtoken,
  })
    .then((authUser) => authUser.data)
    .catch((error) => {
      if (error.response.status === 401) {
        return { message: "Incorrect Credentials" };
      }
      return error;
    });

function* loginUser({ payload: { user, history, type } }) {
  // history.push("/dashboard")
  try {
    if (type) {
      const loginUser = yield call(postGetGoogleToken, user.credential);
      if (!loginUser.message) {
        sessionStorage.setItem("authUser", JSON.stringify(loginUser));
        localStorage.setItem("authUser", JSON.stringify(loginUser));
        localStorage.setItem("jwt", loginUser.token);
        localStorage.setItem("jwtRefresh", loginUser.token);

        // localStorage.setItem("dark_mode", loginUser.profile.dark_mode);

        // localStorage.setItem("profile_pic", loginUser.profile.profile_pic);
        yield put(loginSuccess(loginUser));

        history.push("/dashboard");
      } else {
        yield put(apiError(loginUser.message));
      }
    } else {
      const loginUser = yield call(postJwtLogin, user.email, user.password);
      if (!loginUser.message) {
        sessionStorage.setItem("authUser", JSON.stringify(loginUser));
        localStorage.setItem("authUser", JSON.stringify(loginUser));
        localStorage.setItem("jwt", loginUser.token);
        localStorage.setItem("jwtRefresh", loginUser.token);

        // localStorage.setItem("dark_mode", loginUser.profile.dark_mode);

        // localStorage.setItem("profile_pic", loginUser.profile.profile_pic);
        yield put(loginSuccess(loginUser));

        history.push("/dashboard");
      } else {
        yield put(apiError(loginUser.message));
      }
    }
  } catch (error) {
    yield put(apiError(error));
  }
}

function* logoutUser() {
  try {
    sessionStorage.removeItem("authUser");
    localStorage.clear();
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.logout);
      yield put(logoutUserSuccess(LOGOUT_USER, response));
    } else {
      yield put(logoutUserSuccess(LOGOUT_USER, true));
    }
  } catch (error) {
    yield put(apiError(LOGOUT_USER, error));
  }
}

function* socialLogin({ payload: { data, history, type } }) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend();
      const response = yield call(fireBaseBackend.socialLoginUser, data, type);
      sessionStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginSuccess(response));
    } else {
      const response = yield call(postSocialLogin, data);
      sessionStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginSuccess(response));
    }
    history.push("/dashboard");
  } catch (error) {
    yield put(apiError(error));
  }
}

const postJwtPublicUser = async (
  // username,
  password,
  email,
  first_name,
  last_name,
  company_name,
  company_email,
  company_address,
  state,
  country,
  mobile
) =>
  await API.post("/api/signup/", {
    // username: username,
    password: password,
    email: email,
    first_name: first_name,
    last_name: last_name,
    company_name: company_name,
    company_email: company_email,
    company_address: company_address,
    state: state,
    country: country,
    mobile: mobile,
  })
    .then((authUser) => authUser)
    .catch((error) => {
      if (error.response.status === 401) {
        return { message: "Incorrect Credentials" };
      } else if (error.response.status === 400) {
        return { message: error.response.data.Error };
      }
      return error;
    });

function* registerPublicUser({ payload: { user, history } }) {
  console.log("xsjjdjxs", user);
  try {
    const regUser = yield call(
      postJwtPublicUser,
      user.password,
      user.email,
      user.first_name,
      user.last_name,
      user.company_name,
      user.company_email,
      user.company_address,
      user.state,
      user.mobile,
      user.country
      // user.username,
    );
    // console.log(regUser, "regUser");
    // console.log(regUser.response, "regUser response");
    if (regUser?.message) {
      yield put(apiError(regUser.message));
    } else {
      NotificationManager.success(
        "",
        "Registered successfully.",
        3000,
        null,
        null,
        ""
      );
      history.push("/login");
    }
  } catch (error) {
    yield put(apiError(error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeLatest(SOCIAL_LOGIN, socialLogin);
  yield takeEvery(LOGOUT_USER, logoutUser);
  yield takeEvery(REGISTER_PUBLIC_USER, registerPublicUser);
}

export default authSaga;

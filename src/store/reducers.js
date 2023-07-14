import { combineReducers } from "redux";

// Front
import Layout from "./layouts/reducer";

// Authentication
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import Profile from "./auth/profile/reducer";

//Calendar
import Calendar from "./calendar/reducer";
//Chat
import chat from "./chat/reducer";

//Form advanced
import changeNumber from "./formAdvanced/reducer";

//Crm
import Crm from "./crm/reducer";

//Mailbox
import Mailbox from "./mailbox/reducer";

const rootReducer = combineReducers({
    // public
    Layout,
    Login,
    Account,
    ForgetPassword,
    Profile,
    Calendar,
    chat,
    changeNumber,
    Crm,
    Mailbox
});

export default rootReducer;
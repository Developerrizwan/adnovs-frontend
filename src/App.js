import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
//import Scss
import "./assets/scss/themes.scss";

//imoprt Route
import Route from "./Routes";

// Fake Backend
// import fakeBackend from "./helpers/AuthType/fakeBackend";

// Activating fake backend
// fakeBackend();

function App() {
  
  return (
    <React.Fragment>
      <ToastContainer />
      <Route />
    </React.Fragment>
  );
}

export default App;

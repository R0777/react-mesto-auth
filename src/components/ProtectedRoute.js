import React from 'react';
import { Route, Redirect } from "react-router-dom";
import Header from "./Header"

const ProtectedRoute = ({ component: Component, ...props  }) => {
  return (
    <Route>
      {
        () => props.loggedIn === true ? <><Header loginText={props.loginText} link={props.link} signOut={props.signOut} userData={props.userData} /><Component {...props} /></> : <Redirect to="/sign-in" />
      }
    </Route>
)}

export default ProtectedRoute;

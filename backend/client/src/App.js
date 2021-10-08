import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Component/Home";
import SignIn from "./Component/SignIn";
import SignUp from "./Component/SignUp";
import Conversections from "./Component/Conversections";
import AdminDashboard from "./Component/AdminDashboard";
const App = ()=>{
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/signin">
          <SignIn />
        </Route>
        <Route exact path="/signup">
          <SignUp />
        </Route>
        <Route exact path="/conversection">
          <Conversections />
        </Route>
        <Route exact path="/admin">
          <AdminDashboard />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;

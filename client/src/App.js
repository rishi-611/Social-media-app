import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Route exact path="/" component={Landing}></Route>
      <Route exact path="/register" component={Register} />
      <Route exact path="/login" component={Login} />
    </BrowserRouter>
  );
};

export default App;

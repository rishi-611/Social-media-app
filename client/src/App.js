import React, { useEffect } from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from "./components/layout/Alert";
import store from "./store";
import { loadUser } from "./actions/auth";
import Logout from "./components/auth/Logout";
import PrivateRoute from "./components/routing/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import ProfileForm from "./components/Profile/ProfileForm";
import AddEducation from "./components/Profile/AddEducation";
import AddExperience from "./components/Profile/AddExperience";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profiles/Profile";
import Posts from "./components/posts/Posts";
import Post from "./components/posts/Post";
import setAuthToken from "./utils";

// this avoids bugs caused by profile getting loaded before user
// useEffect of child comes before useEffect of parent
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  // set global auth header and user, when app renders first
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <BrowserRouter>
      <Navbar />
      <Route exact path="/" component={Landing}></Route>
      <section className="container">
        <Alert />
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/profiles" component={Profiles} />
          <Route exact path="/profiles/:id" component={Profile} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <PrivateRoute path="/profileForm" component={ProfileForm} />
          <PrivateRoute path="/addEducation" component={AddEducation} />
          <PrivateRoute path="/addExperience" component={AddExperience} />
          <PrivateRoute path="/posts/:id" component={Post} />
          <PrivateRoute path="/posts" component={Posts} />
        </Switch>
      </section>
    </BrowserRouter>
  );
};

export default App;

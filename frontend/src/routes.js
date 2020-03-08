import React, { useState } from 'react';
import './App.css';

import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import GlitchHop from './pages/GlitchHop/GlitchHop';
import LoginPage from './pages/LoginRegister/pages/LoginPage';
import RegisterPage from './pages/LoginRegister/pages/RegisterPage';
import RootRedirect from './components/RootRedirect';
import Dashboard from './pages/Dashboard/Dashboard';
import { sendLogout } from './services/api';


export default function Routes() {
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  return (
    <Router>
      <Route path="/" exact component={RootRedirect}/>

      <Route path="/login" exact component={LoginPage}/>
      <Route path="/logout" exact>
        {!hasLoggedOut ? (async ()=> {await sendLogout(); setHasLoggedOut(true)}) && 'a' : <Redirect to="/"/>}
      </Route>
      <Route path="/register" exact component={RegisterPage}/>
      <Route path="/welcome" exact component={GlitchHop}/> {/* TODO: remove debug route */}
      <Route path="/dashboard" exact component={Dashboard}/> {/* TODO: remove debug route */}

      
      {/* TODO: 404 page */}
    </Router>
  );
}

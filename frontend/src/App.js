import React from 'react';
import './App.css';

import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import GlitchHop from './pages/GlitchHop/GlitchHop';
import LoginPage from './pages/LoginRegister/pages/LoginPage';
import RegisterPage from './pages/LoginRegister/pages/RegisterPage';
import { currentSession } from './services/session-manager';
import RootRedirect from './components/RootRedirect';


function App() {
  return (
    <Router>
      <Route path="/" exact component={RootRedirect}/>

      <Route path="/login" exact component={LoginPage}/>
      <Route path="/register" exact component={RegisterPage}/>
      <Route path="/welcome" exact component={GlitchHop}/>
      {/* TODO: 404 page */}
    </Router>
  );
}

export default App;

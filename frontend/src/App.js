import React from 'react';
import './App.css';

import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import Login from './pages/Login/Login';
import GlitchHop from './pages/GlitchHop/GlitchHop';
import Register from './pages/Register/Register';


function App() {
  return (
    <Router>
      <Route path="/" exact>
        <Redirect to="/login"/>
      </Route>

      <Route path="/login" exact component={Login}/>
      <Route path="/register" exact component={Register}/>
      <Route path="/welcome" exact component={GlitchHop}/>
      {/* TODO: 404 page */}
    </Router>
  );
}

export default App;

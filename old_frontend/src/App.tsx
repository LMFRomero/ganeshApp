import React from 'react';

import Routes from './routes';


export default function App() {

  //At this point, if there was a sessionID stored on cookie 'ganesh', it's loaded in curentSession.sessionID
  //If not, currentSession.sessionID is null, meaning there's no session stored

  return (
    <Routes/>
  );
}
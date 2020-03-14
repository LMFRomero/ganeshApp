import React from 'react';
import {useCookies} from 'react-cookie';

import Routes from './routes';
import { createSession, currentSession } from './services/session-manager';


export default function App() {
  //Get cookie management functions from App (this must be inside a react component)
  const [cookies, setCookie, removeCookie] = useCookies(['ganesh']);

  //Create a null session inside currentSession object
  createSession({cookies, setCookie, removeCookie});

  //Read session from cookie, if there is one
  currentSession.loadSessionFromCookie();

  //At this point, if there was a sessionID stored on cookie 'ganesh', it's loaded in curentSession.sessionID
  //If not, currentSession.sessionID is null, meaning there's no session stored

  return (
    <Routes/>
  );
}
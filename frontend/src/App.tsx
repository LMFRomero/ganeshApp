import React from 'react';
import {useCookies} from 'react-cookie';

import Routes from './routes';
import { createSession, currentSession } from './services/session-manager';


export default function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['ganesh']);
  createSession({cookies, setCookie, removeCookie});
  currentSession.loadSessionFromCookie();

  return (
    <Routes/>
  );
}
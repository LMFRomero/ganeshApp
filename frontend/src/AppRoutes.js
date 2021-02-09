import { Box } from '@material-ui/core'
import { Switch, Route, Redirect, useLocation } from 'react-router-dom'

/* General Components */
import Header from './components/Header/Header'
import PageNotFound from './pages/PageNotFound/PageNotFound'

/* Routes - Unauthenticated User*/
import Home from './pages/UnauthenticatedPages/Home/Home'
import Login from './pages/UnauthenticatedPages/Login/Login'
import Register from './pages/UnauthenticatedPages/Register/Register'
import ForgotPassword from './pages/UnauthenticatedPages/ForgotPassword/ForgotPassword'

/* Routes - Authenticated User*/
import Timeline from './pages/AuthenticatedPages/Timeline/Timeline'
import MyAccount from './pages/AuthenticatedPages/MyAccount/MyAccount'
import Meeting from './pages/AuthenticatedPages/Meeting/Meeting'
import RegisterMeeting from './pages/AuthenticatedPages/RegisterMeeting/RegisterMeeting'
import EditMeeting from './pages/AuthenticatedPages/EditMeeting/EditMeeting'

/* Routes - Coordinator Pages*/
import RegisterAnnounce from './pages/CoordinatorPages/RegisterAnnounce/RegisterAnnounce'

function PrivateRoute({children, component: RenderComponent, ...rest}) {
  const isAuthenticated = () => true

  return (
    <Route {...rest} render={( props => 
      isAuthenticated() ? (
        <>
          <Header/>
          { children }
        </>
      ) : (
        <Redirect to="/" />
      )
    )}/>
  )
}

function AppRoutes() {

  // List of all private paths to add the HaveMenu class in <Box>
  const privatePaths = ['/reunioes', '/comunicados', '/minha-conta', 
    '/criar-reuniao', '/editar-reuniao/', '/criar-comunicado', '/reuniao/']
  const currentLocation = useLocation();
  
  return(
    <Box className={`RouterComponent ${ privatePaths.find((v) => currentLocation.pathname.indexOf(v) == 0) ? "HaveMenu" : ""}`}>
        <Switch>

          {/* Routes - Unauthenticated User*/}
          <Route exact path="/" component={Home}/>
          <Route path="/login"  component={Login}/>
          <Route path="/criar-conta" component={Register}/>
          <Route path="/recuperar-senha/:recoverToken" component={ForgotPassword}/>
          <Route path="/recuperar-senha" component={ForgotPassword}/>
          
          {/* Rotas - Authenticated User*/}
          <PrivateRoute path="/reunioes"><Timeline variant="meetings"/></PrivateRoute>
          <PrivateRoute path="/comunicados"><Timeline variant="announces"/></PrivateRoute>
          <PrivateRoute path="/minha-conta"><MyAccount/></PrivateRoute>
          <PrivateRoute path="/criar-reuniao"><RegisterMeeting/></PrivateRoute>
          <PrivateRoute path="/reuniao/:meetingId"><Meeting/></PrivateRoute>
          <PrivateRoute path="/editar-reuniao/:meetingId"><EditMeeting/></PrivateRoute>
          
          {/* Routes - Coordinator Pages*/}
          <PrivateRoute path="/criar-comunicado"><RegisterAnnounce/></PrivateRoute>

          {/* Página 404 */}
          <Route path="*" component={PageNotFound}/>
        </Switch>
    </Box>
  )
}
  
export default AppRoutes
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
import Fronts from './pages/AuthenticatedPages/Fronts/Fronts'

/* Routes - Coordinator Pages*/
import RegisterAnnounce from './pages/CoordinatorPages/RegisterAnnounce/RegisterAnnounce'
import EditAnnounce from './pages/CoordinatorPages/EditAnnounce/EditAnnounce'
import RegisterFront from './pages/CoordinatorPages/RegisterFront/RegisterFront'
import EditFront from './pages/CoordinatorPages/EditFront/EditFront'

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
  const privatePaths = ['/minha-conta', '/reunioes', '/reuniao/', '/criar-reuniao', '/editar-reuniao/', 
    '/comunicados', '/criar-comunicado', '/editar-comunicado/', 
    '/frentes', '/criar-frente', '/editar-frente/']
  const currentLocation = useLocation();
  
  return(
    <Box className={`RouterComponent ${ privatePaths.find((v) => currentLocation.pathname.indexOf(v) === 0) ? "HaveMenu" : ""}`}>
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
          <PrivateRoute path="/frentes"><Fronts/></PrivateRoute>
          
          {/* Routes - Coordinator Pages*/}
          <PrivateRoute path="/criar-comunicado"><RegisterAnnounce/></PrivateRoute>
          <PrivateRoute path="/editar-comunicado/:announceId"><EditAnnounce/></PrivateRoute>
          <PrivateRoute path="/criar-frente"><RegisterFront/></PrivateRoute>
          <PrivateRoute path="/editar-frente/:frontId"><EditFront/></PrivateRoute>

          {/* Página 404 */}
          <Route path="*" component={PageNotFound}/>
        </Switch>
    </Box>
  )
}
  
export default AppRoutes
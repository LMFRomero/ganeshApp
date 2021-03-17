import { Box } from '@material-ui/core'
import { Switch, Route, Redirect, useLocation } from 'react-router-dom'
import { authService } from './services/authService'

/* General Components */
import Header from './components/Header/Header'
import PageNotFound from './pages/PageNotFound/PageNotFound'
import DefaultForm from './pages/DefaultForm/DefaultForm'

/* Routes - Unauthenticated User*/
import Home from './pages/UnauthenticatedPages/Home/Home'
import Login from './pages/UnauthenticatedPages/Login/Login'
import Register from './pages/UnauthenticatedPages/Register/Register'
import ForgotPassword from './pages/UnauthenticatedPages/ForgotPassword/ForgotPassword'

/* Routes - Authenticated User*/
import Timeline from './pages/AuthenticatedPages/Timeline/Timeline'
import UserAccount from './pages/AuthenticatedPages/UserAccount/UserAccount'
import Meeting from './pages/AuthenticatedPages/Meeting/Meeting'
import Fronts from './pages/AuthenticatedPages/Fronts/Fronts'

/* Routes - Coordinator Pages*/
import Users from './pages/CoordinatorPages/Users/Users'
import Requests from './pages/CoordinatorPages/Requests/Requests'

function AppRoutes(props) {

  // List of all private paths to add the HaveMenu class in <Box>
  const currentLocation = useLocation();
  const privatePaths = ['/minha-conta', '/reunioes', '/reuniao/', '/criar-reuniao', '/editar-reuniao/', 
    '/comunicados', '/criar-comunicado', '/editar-comunicado/', '/usuario/',
    '/frentes', '/criar-frente', '/editar-frente/', '/usuarios', '/solicitacoes']
  
  function PublicRoute({children, component: RenderComponent, ...rest}) {  
    return (
      <Route {...rest} render={((p) => {
        if(authService.isAuthenticated()) 
          return ( <Redirect to="/reunioes"/> )
        
        if(!props.darkTheme) 
          props.handleTheme(true)
        
        return ( children)
      })}/>
    )
  }
  
  function PrivateRoute({children, component: RenderComponent, ...rest}) {
    const isAuthenticated = () => true
  
    return (
      <Route {...rest} render={( p => 
        isAuthenticated() ? (
          <>
            <Header darkTheme={props.darkTheme} handleTheme={props.handleTheme}/>
            { children }
          </>
        ) : (
          <Redirect to="/" />
        )
      )}/>
    )
  }

  return(
    <Box className={`RouterComponent ${ privatePaths.find((v) => currentLocation.pathname.indexOf(v) === 0) ? "HaveMenu" : "PublicPage"}`}>
      <Switch>

        {/* Routes - Unauthenticated User*/}
        <PublicRoute exact path="/"><Home/></PublicRoute>
        <PublicRoute path="/login"><Login/></PublicRoute>
        <PublicRoute path="/criar-conta"><Register/></PublicRoute>
        <PublicRoute path="/recuperar-senha/:recoverToken"><ForgotPassword/></PublicRoute>
        <PublicRoute path="/recuperar-senha"><ForgotPassword/></PublicRoute>
        
        {/* Rotas - Authenticated User*/}
        <PrivateRoute path="/reunioes/:frontSlug/:pageNumber"><Timeline variant="meetings"/></PrivateRoute>
        <PrivateRoute path="/reunioes/:pageNumber"><Timeline variant="meetings"/></PrivateRoute>
        <PrivateRoute path="/reunioes"><Timeline variant="meetings"/></PrivateRoute>

        <PrivateRoute path="/comunicados"><Timeline variant="announces"/></PrivateRoute>
        <PrivateRoute path="/minha-conta"><UserAccount variant="my-account"/></PrivateRoute>
        <PrivateRoute path="/criar-reuniao"><DefaultForm variant="register-meeting"/></PrivateRoute>
        <PrivateRoute path="/editar-reuniao/:meetingId"><DefaultForm variant="edit-meeting"/></PrivateRoute>
        <PrivateRoute path="/reuniao/:meetingId"><Meeting/></PrivateRoute>
        <PrivateRoute path="/frentes"><Fronts/></PrivateRoute>
        
        {/* Routes - Coordinator Pages*/}
        <PrivateRoute path="/criar-comunicado"><DefaultForm variant="register-announce"/></PrivateRoute>
        <PrivateRoute path="/editar-comunicado/:announceId"><DefaultForm variant="edit-announce"/></PrivateRoute>
        <PrivateRoute path="/criar-frente"><DefaultForm variant="register-front"/></PrivateRoute>
        <PrivateRoute path="/editar-frente/:frontId"><DefaultForm variant="edit-front"/></PrivateRoute>
        <PrivateRoute path="/usuario/:userId"><UserAccount variant="coordinator"/></PrivateRoute>
        <PrivateRoute path="/usuarios"><Users/></PrivateRoute>
        <PrivateRoute path="/solicitacoes"><Requests/></PrivateRoute>

        {/* Página 404 */}
        <Route exact path="/404" component={PageNotFound}/>
        <Redirect path="*" to="/404"/>
      </Switch>
    </Box>
  )
}
  
export default AppRoutes
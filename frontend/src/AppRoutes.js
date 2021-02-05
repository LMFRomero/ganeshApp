import { Box } from '@material-ui/core'
import { Switch, Route, Redirect, useLocation } from 'react-router-dom'

/* General Components */
import Header from './components/Header/Header'
import PageNotFound from './pages/PageNotFound/PageNotFound'

/* Routes - Unauthenticated User*/
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'

function PrivateRoute({component: RenderComponent, ...rest}) {
  const isAuthenticated = () => true

  return (
    <Route {...rest} render={( props => 
      isAuthenticated() ? (
        <>
          <Header/>
          <RenderComponent {...props}/>
        </>
      ) : (
        <Redirect to="/" />
      )
    )}/>
  )
}

function AppRoutes() {

  // List of all private paths to add the HaveMenu class in <Box>
  const privatePaths = ['/teste']
  const currentLocation = useLocation();
  
  return(
    <Box className={`RouterComponent ${ privatePaths.find((v) => v == currentLocation.pathname) ? "HaveMenu" : ""}`}>
        <Switch>

          {/* Rotas - Unauthenticated User*/}
          <Route exact path="/" component={Home}/>
          <Route path="/login"  component={Login}/>
          <Route path="/criar-conta" component={Register}/>
          <Route path="/recuperar-senha/:recoverToken" component={ForgotPassword}/>
          <Route path="/recuperar-senha" component={ForgotPassword}/>
          
          <PrivateRoute path="/teste" component={Register}/>

          {/* Página 404 */}
          <Route path="*" component={PageNotFound}/>
        </Switch>
    </Box>
  )
}
  
export default AppRoutes
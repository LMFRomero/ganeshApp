import { Box } from '@material-ui/core'
import { Switch, Route, Redirect } from 'react-router-dom'

import Header from './components/Header/Header'

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

    return(
      <Box className="RouterComponent">
          <Switch>

            {/* Rotas - Unauthenticated User*/}
            <Route exact path="/" component={Home}/>
            <Route path="/login" component={Login}/>
            <Route path="/criar-conta" component={Register}/>
            <Route path="/recuperar-senha/:recoverToken" component={ForgotPassword}/>
            <Route path="/recuperar-senha" component={ForgotPassword}/>
            
            <PrivateRoute path="/teste" component={Register}/>

            {/* Página 404 */}
            {/* <Route path="*"/> */}
          </Switch>
      </Box>
    )
  }
  
export default AppRoutes
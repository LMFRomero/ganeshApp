import {Switch, Route, useParams} from 'react-router-dom'


/* Rotas - Unauthenticated User*/
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'

function AppRoutes() {

    return(
      <main className="MainComponent">
          <Switch>

            {/* Rotas - Unauthenticated User*/}
            <Route exact path="/" component={Home}/>
            <Route path="/login" component={Login}/>
            <Route path="/criar-conta" component={Register}/>
            <Route path="/recuperar-senha/:recoverToken" component={ForgotPassword}/>
            <Route path="/recuperar-senha" component={ForgotPassword}/>
            


            {/* Página 404 */}
            {/* <Route path="*"/> */}
          </Switch>
      </main>
    )
  }
  
export default AppRoutes
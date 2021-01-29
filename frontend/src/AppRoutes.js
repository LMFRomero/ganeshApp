import {Switch, Route} from 'react-router-dom'


/* Rotas - Unauthenticated User*/
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'

function AppRoutes() {
    return(
      <main className="MainComponent">
          <Switch>

            {/* Rotas - Unauthenticated User*/}
            <Route exact path="/" component={Home}/>
            <Route path="/fazer-login" component={Login}/>
            <Route path="/criar-conta" component={Register}/>


            {/* Página 404 */}
            {/* <Route path="*"/> */}
          </Switch>
      </main>
    )
  }
  
export default AppRoutes
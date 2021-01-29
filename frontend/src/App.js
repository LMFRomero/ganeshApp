import CssBaseline from '@material-ui/core/CssBaseline'
import './App.css'

import { BrowserRouter } from 'react-router-dom'

import Header from './components/Header/Header'
import AppRoutes from './AppRoutes'

function App() {
  return (
    <div className="App">

      {/* CSS Normalizer - fix browser visual inconsistencies  */}
      <CssBaseline />

      <BrowserRouter>
        {/* <Header/> */}
        <AppRoutes/>
      </BrowserRouter>
      
    </div>
  )
}

export default App

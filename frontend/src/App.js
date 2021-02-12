import { useEffect, useState, useMemo} from 'react'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles';
import './App.css'

import AppRoutes from './AppRoutes'
import { DarkTheme, LightTheme } from './Themes'

function App() {

  const [darkTheme, handleTheme] = useState(localStorage.getItem('darkTheme') === "true")
  const theme = useMemo(() => createMuiTheme((darkTheme) ? DarkTheme : LightTheme), [darkTheme])

  useEffect(() => {
    localStorage.setItem('darkTheme',darkTheme)
  }, [darkTheme])

  return (
    <div className={`App ${(darkTheme)?'Dark':'Light'}-Theme`}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppRoutes darkTheme={darkTheme} handleTheme={handleTheme}/>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  )
}

export default App

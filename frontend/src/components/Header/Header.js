import { AppBar, Toolbar, Typography } from '@material-ui/core'
import './Header.css'

function Header() {
  return(
      <AppBar className="HeaderComponent" position="sticky">
        <Toolbar>
          <Typography variant="h6">
            Ganesh - Segurança da Informação
          </Typography>
        </Toolbar>
      </AppBar>
  )
}

export default Header
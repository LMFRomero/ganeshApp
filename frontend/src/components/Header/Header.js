import React, { useState } from 'react';
import { useHistory, Link as RouterLink, useLocation } from 'react-router-dom';
import { AppBar, Box, Divider, Drawer, Hidden, IconButton, Toolbar, Typography } from '@material-ui/core'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import './Header.css'

import MenuIcon from '@material-ui/icons/Menu';
import SunIcon from '@material-ui/icons/WbSunny';
import MoonIcon from '@material-ui/icons/NightsStay';
import ScheduleIcon from '@material-ui/icons/Schedule';
import FlagIcon from '@material-ui/icons/Flag';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import PersonIcon from '@material-ui/icons/Person';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GroupIcon from '@material-ui/icons/Group';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import GaneshSidebarImg from '../../assets/images/Ganesh500x500.png'
import GaneshHeaderImg from '../../assets/images/GaneshBranco64x64.png'

import { authService } from '../../services/authService'

const menuItems = [
  { text: "Reuniões",     link: "/reunioes",      icon: () => <ScheduleIcon/> },
  { text: "Comunicados",  link: "/comunicados",   icon: () => <AnnouncementIcon/> },
  { text: "Frentes",      link: "/frentes",       icon: () => <FlagIcon/> },
  { text: "Minha Conta",  link: "/minha-conta",   icon: () => <PersonIcon/> },
]

const menuItemsCoordinators = [
  { text: "Solicitações", link: "/solicitacoes",  icon: () => <PersonAddIcon/> },
  { text: "Usuários",     link: "/usuarios",      icon: () => <GroupIcon/> },
]

const exitItem = { text: "Sair", link: "/logout", icon: () => <ExitToAppIcon/> }

function Header(props) {

  const history = useHistory()
  const currentLocation = useLocation();
  const [ drawerVisible, setDrawerVisible ] = useState(false)

  const handleLogout = () => {
    authService.logout()
    .then(function() {
      toggleDrawer(false)
      history.push('/')
    })
  }

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) 
      return;
    setDrawerVisible(open)
  };

  const renderListItem = (item) => {
    return(
      <ListItem button onClick={toggleDrawer(false)} key={item.text} 
        component={RouterLink} to={item.link}
        selected={ currentLocation.pathname.indexOf(item.link) > -1 }>
          <ListItemIcon> { item.icon() }</ListItemIcon>
          <ListItemText primary={ item.text } />
      </ListItem>
    )
  }

  const renderLogoutItem = (item) => {
    return(
      <ListItem button onClick={handleLogout} key={item.text} >
          <ListItemIcon> { item.icon() }</ListItemIcon>
          <ListItemText primary={ item.text } />
      </ListItem>
    )
  }

  const drawerContent = () => {
    return (
      <Box className="DrawerContent">
        <img src={GaneshSidebarImg} alt="Logo do Ganesh - Grupo de Extensão do ICMC"/>
        
        <Divider/>
        
        <List>
          { menuItems.map((item, index) => renderListItem(item)) }
          { menuItemsCoordinators.map((item, index) => renderListItem(item)) }
          { renderLogoutItem(exitItem) }
        </List>
      </Box>
    )
  }

  return(
      <>
        {/* Header AppBar */}
        <AppBar className="HeaderComponent" position="sticky">
          <Toolbar>
            
            <RouterLink to="/reunioes">
              <img className="HeaderLogo" src={GaneshHeaderImg} alt="Ganesh - Grupo de Extensão USP ICMC"/>
            </RouterLink>

            <Typography variant="h6" style={{flexGrow: 1 }}>
              Ganesh - ICMC
            </Typography>

            {/* darkTheme={props.darkTheme} handleTheme={props.handleTheme} */}
            {props.darkTheme && 
            <IconButton color="inherit" aria-label="menu" onClick={() => props.handleTheme(false)}>
              <MoonIcon />
            </IconButton>
            }

            {!props.darkTheme && 
            <IconButton color="inherit" aria-label="menu" onClick={() => props.handleTheme(true)}>
              <SunIcon />
            </IconButton>
            }

            <Hidden mdUp implementation="css">
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
            </Hidden>

          </Toolbar>
        </AppBar>

        {/* Desktop permanent menu */}
        <Hidden mdUp implementation="css">
          <Drawer className="SideMenu" anchor="left" 
              open={drawerVisible} onClose={toggleDrawer(false)}>
                {drawerContent()}
          </Drawer>
        </Hidden>

        {/* Mobile Temporary menu */}
        <Hidden smDown implementation="css">
          <Drawer className="SideMenu" anchor="left" variant="permanent"
              open={drawerVisible} onClose={toggleDrawer(false)}>
                {drawerContent()}
          </Drawer>
        </Hidden>
    </>
  )
}

export default Header
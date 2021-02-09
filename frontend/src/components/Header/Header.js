import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import './Header.css'

import { AppBar, Box, Divider, Drawer, Hidden, IconButton, Toolbar, Typography } from '@material-ui/core'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'

import MenuIcon from '@material-ui/icons/Menu';
import ScheduleIcon from '@material-ui/icons/Schedule';
import GroupIcon from '@material-ui/icons/Group';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import GaneshLogo from '../../assets/images/GaneshLogo.png'

const menuItems = [
    { text: "Reuniões",     link: "/reunioes",     icon: () => <ScheduleIcon/> },
    { text: "Comunicados",  link: "/comunicados",  icon: () => <AnnouncementIcon/> },
    { text: "Frentes",      link: "/frentes",      icon: () => <GroupIcon/> },
    { text: "Minha Conta",  link: "/minha-conta",  icon: () => <PersonIcon/> },
    { text: "Sair",         link: "/logout",       icon: () => <ExitToAppIcon/> },
]

function Header() {

  const [ drawerVisible, setDrawerVisible ] = useState(false)

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) 
      return;
    setDrawerVisible(open)
  };

  const drawerContent = () => {
    return (
      <Box className="DrawerContent">
        <img src={GaneshLogo} alt="Logo do Ganesh - Grupo de Extensão do ICMC"/>
        
        <Divider/>
        
        <List>
          { menuItems.map((item, index) => (
              <ListItem button onClick={toggleDrawer(false)} key={item.text} component={RouterLink} to={item.link}>
                  <ListItemIcon> { item.icon() }</ListItemIcon>
                  <ListItemText primary={ item.text } />
              </ListItem>
          ))}
        </List>
      </Box>
    )
  }

  return(
      <>
        {/* Header AppBar */}
        <AppBar className="HeaderComponent" position="sticky">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>

            <Typography variant="h6">
              Ganesh App
            </Typography>
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
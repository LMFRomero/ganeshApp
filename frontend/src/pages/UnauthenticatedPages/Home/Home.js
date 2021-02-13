import { Box, Container, Grid, Button, Typography } from '@material-ui/core'
import './Home.css'

import { Link as RouterLink } from 'react-router-dom';

import GaneshHomeImg from '../../../assets/images/Ganesh500x500.png'
import OrDivider from '../../../components/OrDivider/OrDivider'

function Home(){
  return(
    <Box className="HomePage" flexGrow={1} component="main">
      <Container fixed>
        <Grid container spacing={6} justify="center">
          
          {/* Logo - Ganesh App */}
          <Grid item xs={12} md={5} className="HomeLogo">
            <img src={GaneshHomeImg} alt="Logo do Ganesh - Grupo de Extensão do ICMC"/>
          </Grid>
          
          {/* Form Selection Buttons */}
          <Grid item xs={12} md={5} justify="center" className="HomeWelcome" >
            <Typography variant="h5" align="center">
              <strong>Bem vindo ao Ganesh App!</strong>
            </Typography>
            
            <Typography align="center">
              Sistema para uso interno para membros, <br/> selecione uma opção para continuar.
            </Typography>

            <Typography align="center">
              <Button className="BtnLogin" variant="contained" size="large" color="primary" 
                component={RouterLink} to="/login">
                <strong>Entrar no sistema</strong>
              </Button>
            </Typography>
            
            <OrDivider/>

            <Typography align="center">
              <Button className="BtnRegister" variant="contained" size="large" color="secondary"
                component={RouterLink} to="/criar-conta" style={{marginTop: 0}}>
                <strong>Criar nova conta</strong>
              </Button>
            </Typography>
          </Grid>
          
        </Grid>
      </Container>
    </Box>
  )
}

export default Home
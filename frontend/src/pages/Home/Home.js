import { Box, Container, Grid, Button, Typography } from '@material-ui/core'
import './Home.css'

import { Link as RouterLink } from 'react-router-dom';

import GaneshLogo from '../../assets/images/GaneshLogo.png'
import OrDivider from '../../components/OrDivider/OrDivider'

function Home(){
  return(
    <Box className="HomePage" flexGrow={1}>
      <Container fixed>
        <Grid container spacing={6} justify="center">
          
          {/* Logo - Ganesh App */}
          <Grid item xs={12} md={5} className="HomeLogo">
            <img src={GaneshLogo}/>
          </Grid>
          
          {/* Form Selection Buttons */}
          <Grid item xs={12} md={5} justify="center" className="HomeWelcome" >
            
            <Typography variant="h5" align="center">
              <strong>Bem vindo ao Ganesh App!</strong>
            </Typography>
            
            <Typography align="center">
              Sistema para uso interno para membros e ex-membros, <br/> selecione uma das opção para continuar.
            </Typography>

            <Typography align="center">
              <Button className="BtnEntrar" variant="contained" size="large" color="primary" 
                component={RouterLink} to="/fazer-login">
                <strong>Entrar no sistema</strong>
              </Button>
            </Typography>
            
            <OrDivider/>

            <Typography align="center">
              <Button className="BtnCadastrar" variant="contained" size="large" color="secondary"
                component={RouterLink} to="/criar-conta">
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
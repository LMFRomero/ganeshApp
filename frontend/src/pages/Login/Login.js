import { Box, Container, Grid, Button, Typography } from '@material-ui/core'
import { TextField } from '@material-ui/core'
import './Login.css'

import { Link as RouterLink } from 'react-router-dom';

import OrDivider from '../../components/OrDivider/OrDivider'

function Login(){
  return(
    <Box className="LoginPage" flexGrow={1}>
      <Container fixed>
        <Grid container spacing={6} justify="center">
          <Grid item xs={12}>

            <form classname="LoginForm">
              <Typography variant="h5" align="center">
                <strong>Entrar no Ganesh App</strong>
              </Typography>
              
              <TextField variant="outlined" fullWidth label="E-mail" required/>
              
              <TextField variant="outlined" fullWidth label="Senha" type="password" required/>
              
              <Button variant="contained" size="large" fullWidth color="primary">
                <strong>Entrar</strong>
              </Button>

              <Typography align="center">
                <RouterLink to="/recuperar-senha">Esqueceu a senha? Clique aqui.</RouterLink>
              </Typography>

              <OrDivider/>

              <Button variant="contained" size="large" fullWidth color="secondary"
                component={RouterLink} to="/criar-conta">
                <strong>Criar nova conta</strong>
              </Button>

            </form>

          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Login
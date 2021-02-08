import { Box, Container, Grid, Button, Typography } from '@material-ui/core'
import { TextField } from '@material-ui/core'
import './ForgotPassword.css'

import { Link as RouterLink, useParams } from 'react-router-dom';

import OrDivider from '../../../components/OrDivider/OrDivider'


function ForgotPassword(){

  let { recoverToken } = useParams()

  const requestToken = () => {
    return(
      <>
        <Typography variant="h5" align="center">
          <strong>Esqueceu sua senha?</strong>
        </Typography>
        
        <TextField variant="outlined" fullWidth label="E-mail" required/>
        
        <Typography variant="caption" align="left">
          Insira o e-mail utilizado no cadastro e te enviaremos um link 
          para criar uma nova senha de acesso.  
        </Typography>

        <Button variant="contained" size="large" fullWidth color="secondary">
          <strong>Solicitar link</strong>
        </Button>
      </>
    )
  }

  const changePassword = () => {
    return(
      <>
        <Typography variant="h5" align="center">
          <strong>Cadastrar nova senha</strong>
        </Typography>
        
        <TextField variant="outlined" fullWidth label="Nova Senha" type="password" required/>
        
        <TextField variant="outlined" fullWidth label="Confirmar Senha" type="password" required/>

        <Button variant="contained" size="large" fullWidth color="secondary">
          <strong>Alterar senha</strong>
        </Button>
      </>
    )
  }

  return(
    <Box className="ForgotPasswordPage" flexGrow={1} component="main">
      <Container fixed>
        <Grid container spacing={6} justify="center">

          <Grid item xs={12} md={4}>
            <form classname="ForgotPasswordForm">
              
              {/* Show the form based on the URL parameter */}
              { recoverToken ? changePassword() : requestToken() }

              <OrDivider/>

              <Button variant="contained" size="large" fullWidth color="primary"
                component={RouterLink} to="/login">
                <strong>Voltar ao login</strong>
              </Button>

            </form>
          </Grid>

        </Grid>
      </Container>
    </Box>
  )
}

export default ForgotPassword
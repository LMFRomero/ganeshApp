import { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Container, Grid, Button, Typography } from '@material-ui/core'
import { TextField } from '@material-ui/core'
import './ForgotPassword.css'

import SnackAlerts from '../../../components/SnackAlerts/SnackAlerts';
import OrDivider from '../../../components/OrDivider/OrDivider'
import { authService } from '../../../services/authService'


function ForgotPassword(){

  let { recoverToken } = useParams()

  const [submitDisabled, setSubmitDisabled] = useState(false)
  const [formSuccess, setFormSuccess]       = useState('')
  const [formErrors, setFormErrors]         = useState({})
  const [formData, setFormData]             = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData({...formData, [name]: value})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    setFormErrors({})
    setFormSuccess({})

    if( recoverToken ) {

      if(formData.password !== formData.repeatPassword) {
        setFormErrors({ repeatPassword: "As senhas não são iguais!" })
        return
      }

      authService.resetPassword(formData.password, recoverToken)
      .then(   function(s) { setFormSuccess(s) })
      .catch(  function(e) { setFormErrors(e) })     
      .finally(function( ) { setSubmitDisabled(false) })
    
    } else {  
      authService.recoverLink(formData.email)
      .then(   function(s) { setFormSuccess(s) })
      .catch(  function(e) { setFormErrors(e) })     
      .finally(function( ) { setSubmitDisabled(false) })
    }
  }

  const requestToken = () => {
    return(
      <>
        <Typography variant="h5" align="center" gutterBottom>
          <strong>Esqueceu sua senha?</strong>
        </Typography>
        
        <TextField type="email" variant="outlined" fullWidth label="E-mail" name="email" value={formData.email}
          required inputProps={{maxLength:64}} error={formErrors.email} onChange={handleChange} />
        
        <Typography variant="caption" align="left">
          Insira o e-mail utilizado no cadastro e te enviaremos um link 
          para criar uma nova senha de acesso.  
        </Typography>

        <Button variant="contained" size="large" fullWidth color="secondary"
          type="submit" disabled={submitDisabled}>
          <strong>Solicitar link</strong>
        </Button>
      </>
    )
  }

  const changePassword = () => {
    return(
      <>
        <Typography variant="h5" align="center" gutterBottom>
          <strong>Cadastrar nova senha</strong>
        </Typography>
        
        <TextField type="password" variant="outlined" fullWidth label="Senha" name="password" value={formData.password}
          required inputProps={{maxLength:64}} error={formErrors.password} onChange={handleChange} />
        
        <TextField type="password" variant="outlined" fullWidth label="Confirmar senha" name="repeatPassword" value={formData.repeatPassword}
          required inputProps={{maxLength:64}} error={formErrors.repeatPassword} onChange={handleChange} />

        <Button variant="contained" size="large" fullWidth color="secondary"
          type="submit" disabled={submitDisabled}>
          <strong>Alterar senha</strong>
        </Button>
      </>
    )
  }

  return(
    <Box className="ForgotPasswordPage" flexGrow={1} component="main">
      <Container fixed>
        <Grid container spacing={6} justify="center">

          <SnackAlerts formSuccess={formSuccess} setFormSuccess={setFormSuccess} 
            formErrors={formErrors} setFormErrors={setFormErrors}/>

          <Grid item xs={12}>
            <form className="ForgotPasswordForm" onSubmit={handleSubmit}>

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
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Button, Typography, Link } from '@material-ui/core'
import { TextField } from '@material-ui/core'
import './Login.css'

import GlitchHop from '../../../components/GlitchHop/GlitchHop'
import OrDivider from '../../../components/OrDivider/OrDivider'
import SnackAlerts from '../../../components/SnackAlerts/SnackAlerts';
import { authService } from '../../../services/authService'

function Login(){

  const [showGlitchHop, setShowGitchHop]    = useState(false)
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
    
    authService.login(formData.email, formData.password)
    .then(   function( ) { setShowGitchHop(true) })
    .catch(  function(e) { setFormErrors(e) })     
    .finally(function( ) { setSubmitDisabled(false) })
  }

  return(
    <Box className="LoginPage" flexGrow={1} component="main">
      <Container fixed>
        <Grid container spacing={6} justify="center">

          <Grid item xs={12}>

            { showGlitchHop && <GlitchHop/> }

            <SnackAlerts formSuccess={formSuccess} setFormSuccess={setFormSuccess} 
              formErrors={formErrors} setFormErrors={setFormErrors}/>

            <form className="LoginForm" onSubmit={handleSubmit}>
              <Typography variant="h5" align="center">
                <strong>Entrar no Ganesh App</strong>
              </Typography>
              
              <TextField type="email" variant="outlined" fullWidth label="E-mail" name="email" value={formData.email}
                required inputProps={{maxLength:64}} error={formErrors.email} onChange={handleChange} />
              
              <TextField type="password" variant="outlined" fullWidth label="Senha" name="password" value={formData.password}
                required inputProps={{maxLength:64}} error={formErrors.password} onChange={handleChange} />
              
              <Button variant="contained" size="large" fullWidth color="primary"
                type="submit" disabled={submitDisabled}>
                <strong>Entrar</strong>
              </Button>

              <Typography align="center">
                <Link className="ForgotLink" component={RouterLink} to="/recuperar-senha">
                  Esqueceu a senha? Clique aqui.
                </Link>
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
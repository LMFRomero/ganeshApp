import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Button, Typography } from '@material-ui/core'
import { TextField, InputLabel, Select, FormControl, Checkbox, FormControlLabel } from '@material-ui/core'
import './Register.css'

import OrDivider from '../../../components/OrDivider/OrDivider'
import SnackAlerts from '../../../components/SnackAlerts/SnackAlerts'
import { authService } from '../../../services/authService'
import { optionsHelper as optHelper } from '../../../helpers/optionsHelper'

function Register(){

  const coursesMenuOptions = optHelper.renderOptions(optHelper.optsCourses)
  const institutionsMenuOptions = optHelper.renderOptions(optHelper.optsInstitutions)

  const [submitDisabled, setSubmitDisabled] = useState(false)
  const [formSuccess, setFormSuccess]       = useState('')
  const [formErrors, setFormErrors]         = useState({})
  const [formData, setFormData]             = useState({
    name: '',
    course: optHelper.getDefaultOption(optHelper.optsCourses),
    otherCourse: '',
    institution: optHelper.getDefaultOption(optHelper.optsInstitutions),
    otherInstitution: '',
    collegeID: '',
    yearJoinCollege: new Date().getFullYear(),
    yearJoinGanesh:  new Date().getFullYear(),
    email: '',
    username: '',
    password: '',
    repeatPassword: '',
    pingParticipant: false,
  })

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData({...formData, [name]: value})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    setFormErrors({})
    setFormSuccess({})

    // validate the password
    if(formData.password !== formData.repeatPassword) {
      setFormErrors({ repeatPassword: "As senhas não são iguais!" })
      return
    }

    let userData = { ...formData }

    if(optHelper.isCustomOption(formData.course))
      userData.course = formData.otherCourse
    if(optHelper.isCustomOption(formData.institution))
      userData.institution = formData.otherInstitution

    delete userData.otherCourse
    delete userData.otherInstitution
    delete userData.repeatPassword

    authService.register(userData)
    .then(   function( ) { setFormSuccess({message: "Cadastro criado com sucesso!" }) })
    .catch(  function(e) { setFormErrors(e) })     
    .finally(function( ) { setSubmitDisabled(false) })
  }

  return(
    <Box className="RegisterPage" flexGrow={1} component="main">
      <Container fixed>
        <form className="RegisterForm" onSubmit={handleSubmit}>
          <Grid container spacing={6} justify="center">
          
            <SnackAlerts formSuccess={formSuccess} setFormSuccess={setFormSuccess} 
              formErrors={formErrors} setFormErrors={setFormErrors}/>
            
            <Grid className="FormSection" item xs={12} sm={6} md={5} lg={4}>
              <Typography variant="h5">
                <strong>Dados Pessoais</strong>
              </Typography>

              <TextField variant="outlined" fullWidth label="Nome Completo" name="name" value={formData.name}
                autoFocus required inputProps={{maxLength:64}} error={formErrors.name} onChange={handleChange} />

              <TextField variant="outlined" fullWidth label="Número de Matrícula" name="collegeID" value={formData.collegeID}
                inputProps={{pattern:"[0-9]{0,12}", maxLength:12}} error={formErrors.collegeID} onChange={handleChange} />
              
              <FormControl variant="outlined" fullWidth error={formErrors.course}>
                <InputLabel id="LabelCourse">Curso atual *</InputLabel>
                <Select labelId="LabelCourse" label="Curso atual *" name="course" value={formData.course}
                  required onChange={handleChange}>
                    { coursesMenuOptions }
                </Select>
              </FormControl>

              { optHelper.isCustomOption(formData.course) && 
              <TextField variant="outlined" fullWidth label="Nome do curso" name="otherCourse" value={formData.otherCourse}
                required inputProps={{maxLength:64}} error={formErrors.otherCourse} onChange={handleChange} />
              }

              <FormControl variant="outlined" fullWidth error={formErrors.institution}>
                <InputLabel id="LabelInstitute">Instituição *</InputLabel>
                <Select labelId="LabelInstitute" label="Instituição *" name="institution" value={formData.institution}
                  required onChange={handleChange}>
                    { institutionsMenuOptions }
                </Select>
              </FormControl>

              { optHelper.isCustomOption(formData.institution) &&
              <TextField variant="outlined" fullWidth label="Nome da instituição" name="otherInstitution" value={formData.otherInstitution}
                required inputProps={{maxLength:64}} error={formErrors.otherInstitution} onChange={handleChange} />
              }

              <TextField variant="outlined" fullWidth label="Ano de ingresso na instituição" name="yearJoinCollege" value={formData.yearJoinCollege}
                inputProps={{pattern:"[0-9]{0,4}", maxLength:4}} error={formErrors.yearJoinCollege} onChange={handleChange} />

              <TextField variant="outlined" fullWidth label="Ano de ingresso no Ganesh" name="yearJoinGanesh" value={formData.yearJoinGanesh}
                inputProps={{pattern:"[0-9]{0,4}", maxLength:4}} error={formErrors.yearJoinGanesh} onChange={handleChange} />
            </Grid>

            <Grid className="FormSection" item xs={12} sm={6} md={5} lg={4}>
              <Typography variant="h5">
                <strong>Dados de Acesso</strong>
              </Typography>

              <TextField type="email" variant="outlined" fullWidth label="E-mail" name="email" value={formData.email}
                required inputProps={{maxLength:64}} error={formErrors.email} onChange={handleChange} />

              <TextField variant="outlined" fullWidth label="Apelido ou Primeiro Nome" name="username" value={formData.username}
                required inputProps={{maxLength:32}} error={formErrors.username} onChange={handleChange} />

              <TextField type="password" variant="outlined" fullWidth label="Senha" name="password" value={formData.password}
                required inputProps={{minLength:8, maxLength:64}} error={formErrors.password} onChange={handleChange} />

              <TextField type="password" variant="outlined" fullWidth label="Confirmar senha" name="repeatPassword" value={formData.repeatPassword}
                required inputProps={{minLength:8, maxLength:64}} error={formErrors.repeatPassword} onChange={handleChange} />
              
              <FormControl component="fieldset">
                <FormControlLabel label={`Pretendo participar do Ping ${new Date().getFullYear()}`}  
                  control={<Checkbox color="primary" name="pingParticipant" value={formData.pingParticipant} />}/>
              </FormControl>

              <Button variant="contained" size="large" fullWidth color="secondary"
                type="submit" disabled={submitDisabled}>
                <strong>Criar Conta</strong>
              </Button>
            </Grid>

            <Grid item xs={12} style={{paddingTop: 0}}>
              <OrDivider/>

              <Button className="BtnLogin" variant="contained" size="large" fullWidth color="primary"
                component={RouterLink} to="/login" style={{marginTop: 0}}>
                <strong>Já possuo uma conta</strong>
              </Button>
            </Grid>

          </Grid>
        </form>
      </Container>
    </Box>
  )
}

export default Register
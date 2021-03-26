import { Grid, Button, Typography } from '@material-ui/core'
import { TextField, InputLabel, Select, FormControl } from '@material-ui/core'

import { userService } from '../../services/userService'
import { optionsHelper as optHelper } from '../../helpers/optionsHelper'

// Variants: 'my-account' and 'coordinator'
function FormUserData({ variant, submitDisabled, setSubmitDisabled, formData, setFormData, 
  formSuccess, setFormSuccess, formErrors, setFormErrors }){
  
  const coursesMenuOptions = optHelper.renderOptions(optHelper.optsCourses)
  const institutionsMenuOptions = optHelper.renderOptions(optHelper.optsInstitutions)

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData({...formData, [name]: value})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    setFormErrors({})
    setFormSuccess({})
    setSubmitDisabled(true)

    let userData = { ...formData }

    if(optHelper.isCustomOption(formData.course))
      userData.course = formData.otherCourse
    if(optHelper.isCustomOption(formData.institution))
      userData.institution = formData.otherInstitution

    delete userData.otherCourse
    delete userData.otherInstitution

    userService.update(userData.id, userData)
    .then(   function(s) { setFormSuccess(s) })
    .catch(  function(e) { setFormErrors(e) })     
    .finally(function( ) { setSubmitDisabled(false) })
  }

  return(
    <Grid component="form" className="FormSection" item xs={12} sm={12} md={6} onSubmit={handleSubmit}>
      <Typography variant="h5">
      <strong>Editar Dados Pessoais</strong>
      </Typography>

      <TextField variant="filled" fullWidth label="Nome Completo" name="name" value={formData.name}
        autoFocus required inputProps={{maxLength:64}} error={formErrors.name} onChange={handleChange} />
      
      <TextField type="email" variant="filled" fullWidth label="E-mail" name="email" value={formData.email}
        required inputProps={{maxLength:64}} error={formErrors.email} onChange={handleChange} />

      <TextField variant="filled" fullWidth label="Apelido ou Primeiro Nome" name="username" value={formData.username}
        required inputProps={{maxLength:32}} error={formErrors.username} onChange={handleChange} />
      
      <TextField variant="filled" fullWidth label="Número de Matrícula" name="collegeID" value={formData.collegeID}
                inputProps={{maxLength:12}} error={formErrors.collegeID} onChange={handleChange} />
              
      <FormControl variant="filled" fullWidth error={formErrors.course}>
        <InputLabel id="LabelCourse">Curso atual *</InputLabel>
        <Select labelId="LabelCourse" label="Curso atual *" name="course" value={formData.course}
          required onChange={handleChange}>
            { coursesMenuOptions }
        </Select>
      </FormControl>

      { optHelper.isCustomOption(formData.course) && 
      <TextField variant="filled" fullWidth label="Nome do curso" name="otherCourse" value={formData.otherCourse}
        required inputProps={{maxLength:64}} error={formErrors.otherCourse} onChange={handleChange} />
      }

      <FormControl variant="filled" fullWidth error={formErrors.institution}>
        <InputLabel id="LabelInstitute">Instituição *</InputLabel>
        <Select labelId="LabelInstitute" label="Instituição *" name="institution" value={formData.institution}
          required onChange={handleChange}>
            { institutionsMenuOptions }
        </Select>
      </FormControl>

      { optHelper.isCustomOption(formData.institution) && 
      <TextField variant="filled" fullWidth label="Nome da instituição" name="otherInstitution" value={formData.otherInstitution}
        required inputProps={{maxLength:64}} error={formErrors.otherInstitution} onChange={handleChange} />
      }

      <TextField variant="filled" fullWidth label="Ano de ingresso na instituição" name="yearJoinCollege" value={formData.yearJoinCollege}
        inputProps={{maxLength:4}} error={formErrors.yearJoinCollege} onChange={handleChange} />

      <TextField variant="filled" fullWidth label="Ano de ingresso no Ganesh" name="yearJoinGanesh" value={formData.yearJoinGanesh}
        inputProps={{maxLength:4}} error={formErrors.yearJoinGanesh} onChange={handleChange} />

      <Button variant="contained" size="large" fullWidth color="primary"
        type="submit" disabled={submitDisabled}>
          <strong>Salvar alterações</strong>
      </Button>
    </Grid>
  )
}

export default FormUserData
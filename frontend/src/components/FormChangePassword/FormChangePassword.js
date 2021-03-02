import { useState } from 'react';
import { Box, Button, Typography, TextField } from '@material-ui/core'

import { userService } from '../../services/userService'

// Variants: 'normal' and 'coorditator'
function FormChangePassword({ userId, submitDisabled, setSubmitDisabled, 
  formSuccess, setFormSuccess, formErrors, setFormErrors }){
  
  const [formData, setFormData]     = useState({
    password: '',
    newPassword: '',
    repeatPassword: '',
  })

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData({...formData, [name]: value})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    setFormErrors({})
    setFormSuccess({})
    setSubmitDisabled(true)

    if(formData.newPassword !== formData.repeatPassword){
      setFormErrors({repeatPassword: "As senhas não são iguais!"})
      setSubmitDisabled(false)
      return;
    }

    userService.updatePassword(userId, formData.password, formData.newPassword)
    .then(   function(s) { setFormSuccess(s) })
    .catch(  function(e) { setFormErrors(e) })     
    .finally(function( ) { setSubmitDisabled(false) })
  }

  return(
    <Box className="FormSection" component="form" style={{ marginTop: 40 }} onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom>
        <strong>Alterar Senha</strong>
      </Typography>
      
      <TextField type="password" variant="filled" fullWidth label="Senha Atual" name="password" value={formData.password}
        required inputProps={{maxLength:64}} error={!!formErrors.password} onChange={handleChange} />

      <TextField type="password" variant="filled" fullWidth label="Nova Senha" name="newPassword" value={formData.newPassword}
        required inputProps={{maxLength:64}} error={!!formErrors.newPassword} onChange={handleChange} />
      
      <TextField type="password" variant="filled" fullWidth label="Confirmar Nova Senha" name="repeatPassword" value={formData.repeatPassword}
        required inputProps={{maxLength:64}} error={!!formErrors.repeatPassword} onChange={handleChange} />
      
      <Button variant="contained" size="large" fullWidth color="secondary"
        type="submit" disabled={submitDisabled}>
        <strong>Confirmar alteração</strong>
      </Button>
    </Box>
  )
}

export default FormChangePassword
import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@material-ui/core'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'

import { userService } from '../../services/userService'

// Variants: 'my-account' and 'coordinator'
function FormAccountDelete({ userId, confirmEmail, submitDisabled, setSubmitDisabled, 
  formSuccess, setFormSuccess, formErrors, setFormErrors }){
    
  const [showDialog, setShowDialog] = useState(false)
  const [formData, setFormData]     = useState({
    email: '',
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

    if(formData.email !== confirmEmail){
      setFormErrors({email: "E-mail incorreto!"})
      setSubmitDisabled(false)
      return;
    }

    userService.deleteAccount(userId)
    .then(   function(s) { setFormSuccess(s) })
    .catch(  function(e) { setFormErrors(e) })     
    .finally(function( ) { setSubmitDisabled(false) })
  }

  return(
    <Box component="form" onSubmit={handleSubmit} style={{ marginTop: 62 }}>
      <Typography variant="h5" gutterBottom>
        <strong>Excluir Cadastro</strong>
      </Typography>
      
      <Typography>
        <Button variant="contained" size="large" fullWidth color="primary"
          onClick={() => setShowDialog(true)}>
          <strong>Continuar exclusão</strong>
        </Button>
      </Typography>

      <Typography variant="caption">
        <strong> Cuidado! </strong> esta ação não é reversível!  
      </Typography>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle><strong>Excluir Cadastro</strong></DialogTitle>
        <DialogContent>
          <DialogContentText>
            Para confirmar a exclusão insira <strong>{confirmEmail}</strong> no campo abaixo. 
            <br/><strong>Atenção:</strong> esta ação não é reversível!
          </DialogContentText>
          <TextField type="email" margin="dense" fullWidth label="E-mail" name="email" value={formData.email}
            required inputProps={{maxLength:64}} error={formErrors.email} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)} color="primary">
            <strong>Cancelar</strong>
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={submitDisabled}>
            <strong>Excluir Conta</strong>
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  )
}

export default FormAccountDelete
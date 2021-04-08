import { useState } from 'react';
import { Button, TextField } from '@material-ui/core'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'


function DeleteDialog({ title = "Excluir Cadastro", securityString = "", successCallback = () => {}, 
  showDialog, setShowDialog, submitDisabled, setSubmitDisabled,
  formSuccess, setFormSuccess, formErrors, setFormErrors }){
    
  const [formData, setFormData] = useState({
    securityInput: "",
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

    if(formData.securityInput !== securityString){
      setFormErrors({securityInput: "Texto de Segurança incorreto!"})
      setSubmitDisabled(false)
      return;
    }

    successCallback()
  }

  return(
    <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
    <DialogTitle><strong>{title}</strong></DialogTitle>
    <DialogContent>
        <DialogContentText>
        Para confirmar a exclusão insira <strong>{securityString}</strong> no campo abaixo. 
        <br/><strong>Atenção:</strong> esta ação não é reversível!
        </DialogContentText>
        <TextField type="text" margin="dense" fullWidth label="Texto de Segurança" name="securityInput" value={formData.securityInput}
            required inputProps={{maxLength:64}} error={formErrors.securityInput} onChange={handleChange} />
    </DialogContent>
    <DialogActions>
        <Button onClick={() => setShowDialog(false)} color="primary">
            <strong>Cancelar</strong>
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={submitDisabled}>
            <strong>Excluir Cadastro</strong>
        </Button>
    </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog
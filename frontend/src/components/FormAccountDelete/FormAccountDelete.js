import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Typography } from '@material-ui/core'

import { userService } from '../../services/userService'
import { authService } from '../../services/authService'
import DeleteDialog from '../DeleteDialog/DeleteDialog'

// Variants: 'my-account' and 'coordinator'
function FormAccountDelete({ variant, userId, confirmEmail, submitDisabled, setSubmitDisabled, 
  formSuccess, setFormSuccess, formErrors, setFormErrors }){
  
  const history = useHistory()
  const [showDialog, setShowDialog] = useState(false)

  const handleSubmit = (e) => {
    userService.deleteAccount(userId)
    .then(   function(s) {
      if (variant == 'my-account'){
        authService.logout()
        history.push('/')
      } else {
        setFormSuccess(s)
      }
    })
    .catch(  function(e) { setFormErrors(e) })     
    .finally(function( ) { setSubmitDisabled(false) })
  }

  return(
    <Box>
      <Typography variant="h5" gutterBottom>
        <strong>Excluir Cadastro</strong>
      </Typography>
      
      <Typography variant="caption">
        <strong> Atenção: </strong> esta ação não é reversível!  
      </Typography>

      <Typography>
        <Button variant="contained" size="large" fullWidth color="primary"
          onClick={() => setShowDialog(true)}>
          <strong>Continuar exclusão</strong>
        </Button>
      </Typography>

      <DeleteDialog 
        title="Excluir conta Ganesh" 
        securityString={confirmEmail}  
        successCallback={handleSubmit}
        
        showDialog={showDialog} setShowDialog={setShowDialog}
        submitDisabled={submitDisabled} setSubmitDisabled={setSubmitDisabled}
        formSuccess={formSuccess} setFormSuccess={setFormSuccess} 
        formErrors={formErrors} setFormErrors={setFormErrors}
      />
    </Box>
  )
}

export default FormAccountDelete
import { Box, Button, Typography} from '@material-ui/core'
import { TextField } from '@material-ui/core'

// Variants: 'normal' and 'coorditator'
function FormChangePassword(props){
  return(
    <Box className="FormSection" component="form">
      <Typography variant="h5">
        <strong>Alterar Senha</strong>
      </Typography>
      
      <TextField variant="outlined" fullWidth label="Senha atual" type="password" required/>

      <TextField variant="outlined" fullWidth label="Nova senha" type="password" required/>

      <TextField variant="outlined" fullWidth label="Confirmar nova senha" type="password" required/>
      
      <Button variant="contained" size="large" fullWidth color="secondary">
        <strong>Confirmar alteração</strong>
      </Button>
    </Box>
  )
}

export default FormChangePassword
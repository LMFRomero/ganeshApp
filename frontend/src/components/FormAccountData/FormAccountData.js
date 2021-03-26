import { Box, Typography } from '@material-ui/core'
import { TextField, InputLabel, Select, FormControl } from '@material-ui/core'

import { optionsHelper as optHelper } from '../../helpers/optionsHelper'

// Variants: 'my-account' and 'coordinator'
function FormAccountData({ variant, submitDisabled, setSubmitDisabled, formData, setFormData, 
  formSuccess, setFormSuccess, formErrors, setFormErrors }){
  
  const rolesMenuOptions = optHelper.renderOptions(optHelper.optsRoles)

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData({...formData, [name]: parseInt(value)})
  }

  return(
    <Box className="FormSection" component="form">
      <Typography variant="h5">
        <strong>Informações da Conta</strong>
      </Typography>
      
      { variant === 'my-account' && 
      <>
        <TextField variant="filled" fullWidth label="Título do Usuário" name="title" value={formData.title} />
        <TextField variant="filled" fullWidth label="Status da Conta" 
          name="status" value={(formData.isDeleted) ? "Cadastro Desativado" : "Cadastro Ativo" }/>
      </>
      }

      { variant === 'coordinator' &&
      <>
        <FormControl variant="filled" fullWidth error={formErrors.title}>
          <InputLabel id="LabelTitle">Título do Usuário</InputLabel>
          <Select labelId="LabelTitle" label="Título do Usuário" name="role" value={formData.role || 60}
            required onChange={handleChange}>
              { rolesMenuOptions }
          </Select>
        </FormControl>

        <TextField variant="filled" fullWidth label="Status da Conta" 
          name="status" value={(formData.isDeleted) ? "Cadastro Desativado" : "Cadastro Ativo" }/>
      </>
      }
    </Box>
  )
}

export default FormAccountData
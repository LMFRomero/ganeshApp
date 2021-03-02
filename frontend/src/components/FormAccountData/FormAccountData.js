import { Box, Button, Typography } from '@material-ui/core'
import { TextField, InputLabel, Select, MenuItem, FormControl } from '@material-ui/core'

// Variants: 'my-account' and 'coordinator'
function FormAccountData({ variant, submitDisabled, setSubmitDisabled, formData, setFormData, 
  formSuccess, setFormSuccess, formErrors, setFormErrors }){
  
  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData({...formData, [name]: value})
  }

  return(
    <Box className="FormSection" component="form">
      <Typography variant="h5">
        <strong>Informações da Conta</strong>
      </Typography>
      
      { variant === 'my-account' && 
      <>
        <TextField variant="filled" fullWidth label="Título do Usuário" name="title" value={formData.title} />
        <TextField variant="filled" fullWidth label="Status da Conta" name="status" value="Solicitação Aprovada"/>
      </>
      }

      { variant === 'coordinator' &&
      <>
        <FormControl variant="filled" fullWidth error={formErrors.title}>
          <InputLabel id="LabelTitle">Título do Usuário</InputLabel>
          <Select labelId="LabelTitle" label="Título do Usuário" name="role" value={formData.role}
            required onChange={handleChange}>
              <MenuItem value="0">Administrador</MenuItem>
              <MenuItem value="10">Coordenador Geral</MenuItem>
              <MenuItem value="11">Vice-Coordenador Geral</MenuItem>
              <MenuItem value="21">Coordenador RH</MenuItem>
              <MenuItem value="22">Secretário</MenuItem>
              <MenuItem value="23">Coordenador de Estudos</MenuItem>
              <MenuItem value="60">Membro</MenuItem>
              <MenuItem value="80">Colaborador</MenuItem>
              <MenuItem value="100">Participante do Ping</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="filled" fullWidth error={formErrors.title}>
          <InputLabel id="LabelStatus">Status da Conta</InputLabel>
          <Select labelId="LabelStatus" label="Status da Conta">
              <MenuItem value="0">Solicitação em Análise</MenuItem>
              <MenuItem value="1">Solicitação Aprovada</MenuItem>
          </Select>
        </FormControl>
      </>
      }

      <Typography>
        <Button variant="contained" size="large" fullWidth color="primary">
          <strong>Excluir cadastro</strong>
        </Button>
      </Typography>

    </Box>
  )
}

export default FormAccountData
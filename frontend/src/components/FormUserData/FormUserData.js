import { Grid, Button, Typography } from '@material-ui/core'
import { TextField, InputLabel, Select, MenuItem, FormControl } from '@material-ui/core'

// Variants: 'normal' and 'coorditator'
function FormUserData(props){
  return(
    <Grid component="form" className="FormSection" item xs={12} sm={12} md={6}>
      <Typography variant="h5">
      <strong>Editar Dados Pessoais</strong>
      </Typography>

      <TextField variant="filled" fullWidth label="Nome completo" required
      value="Gabriel Van Loon Bodê da Costa Dourado Fuentes Rojas"/>

      <TextField variant="filled" fullWidth label="Apelido ou Primeiro Nome" required
      value="Gabriel Van Loon"/>
      
      <TextField variant="filled" fullWidth label="E-mail" required
      value="gabrielvanloon@usp.br"/>
      
      <FormControl variant="filled" fullWidth>
      <InputLabel id="LabelCourse">Curso atual</InputLabel>
      <Select labelId="LabelCourse" label="Curso atual" value="BCC">
          <MenuItem value="BCC" selected>Ciências da Computação </MenuItem>
          <MenuItem value="EngComp">Engenharia da Computação</MenuItem>
          <MenuItem value="BSI">Sistemas de Informação</MenuItem>
          <MenuItem value="Nenhum">Nenhum</MenuItem>
          <MenuItem value="Outro">Outro curso</MenuItem>
      </Select>
      </FormControl>

      <FormControl variant="filled" fullWidth>
      <InputLabel id="LabelInstitute">Instituição</InputLabel>
      <Select labelId="LabelInstitute" label="Instituição" value="ICMC">
          <MenuItem value="ICMC">USP - ICMC</MenuItem>
          <MenuItem value="EESC">USP - EESC</MenuItem>
          <MenuItem value="IFSC">USP - IFSC</MenuItem>
          <MenuItem value="IQSC">USP - IQSC</MenuItem>
          <MenuItem value="UFSCAR">UFSCAR</MenuItem>
          <MenuItem value="Nenhuma">Nenhuma</MenuItem>
          <MenuItem value="Outra">Outra instituição</MenuItem>
      </Select>
      </FormControl>

      <TextField variant="filled" fullWidth label="Número USP" value="12345679"/>

      <Button variant="contained" size="large" fullWidth color="primary">
      <strong>Salvar alterações</strong>
      </Button>
    </Grid>
       
  )
}

export default FormUserData
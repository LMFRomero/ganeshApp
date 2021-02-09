import { Box, Container, Grid, Button, Typography, Table, TableBody, TableRow, TableCell } from '@material-ui/core'
import { TextField, InputLabel, Select, MenuItem, FormControl, Checkbox, FormControlLabel } from '@material-ui/core'

// Variants: "register" and "edit"
function FormMeeting(props){
  return(
    <>
      <Grid className="FormSection" item xs={12} md={6}>
        <TextField variant="outlined" fullWidth label="Título" required/>
        
        <TextField variant="outlined" fullWidth label="Conteúdo" required
          multiline rows={11}/>
      </Grid>

      <Grid className="FormSection" item xs={12} md={6}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="LabelFront">Frente</InputLabel>
          <Select labelId="LabelFront" label="Frente">
            <MenuItem value="Cripto">Criptografia</MenuItem>
            <MenuItem value="RevPwn">Reversa e Pwning</MenuItem>
            <MenuItem value="Redes">Redes</MenuItem>
            <MenuItem value="Hard">Hardware</MenuItem>
            <MenuItem value="Web">Web</MenuItem>
            <MenuItem value="Geral">Reunião Geral</MenuItem>
          </Select>
        </FormControl>

        <TextField variant="outlined" fullWidth type="date"required
          label="Data" InputLabelProps={{ shrink: true}}/>
        
        <TextField variant="outlined" fullWidth type="time" required
          label="Horário" InputLabelProps={{ shrink: true}}/>
        
        <TextField variant="outlined" fullWidth label="Local" required/>
        
        <FormControlLabel label="Visível apenas para membros ativos." 
          control={
            <Checkbox color="primary" name="PingParticipant" checked/>
        }/>
        
        { props.variant === "register" &&  
        <Button variant="contained" size="large" fullWidth color="primary">
          <strong>Publicar reunião</strong>
        </Button>
        }

        { props.variant === "edit" &&
        <Button variant="contained" size="large" fullWidth color="primary">
          <strong>Salvar Alterações</strong>
        </Button>
        }

      </Grid>
    </>
  )
}

export default FormMeeting
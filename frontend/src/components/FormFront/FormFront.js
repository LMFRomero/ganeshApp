import { Grid, Button } from '@material-ui/core'
import { TextField, Checkbox, FormControlLabel } from '@material-ui/core'

// Variants: "register" and "edit"
function FormFront(props){
  return(
    <>
      <Grid item component="form" className="FormSection" xs={12} md={8}>
        <TextField variant="filled" fullWidth label="Nome da Frente" required/>

        <TextField variant="filled" fullWidth label="Conteúdo" required
        multiline rows={4}/>

        <FormControlLabel label="Visível apenas para membros ativos." 
        control={
            <Checkbox color="primary" name="membersOnly" checked/>
        }/>

        { props.variant === "register" &&  
        <Button variant="contained" size="large" fullWidth color="secondary">
          <strong>Publicar Frente</strong>
        </Button>
        }

        { props.variant === "edit" &&
        <Button variant="contained" size="large" fullWidth color="secondary">
          <strong>Salvar Alterações</strong>
        </Button>
        }

      </Grid>
    </>   
  )
}

export default FormFront
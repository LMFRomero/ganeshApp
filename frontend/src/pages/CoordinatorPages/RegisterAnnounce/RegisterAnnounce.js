import { Box, Container, Grid, Button, Typography, Table, TableBody, TableRow, TableCell } from '@material-ui/core'
import { TextField, InputLabel, Select, MenuItem, FormControl, Checkbox, FormControlLabel } from '@material-ui/core'
import './RegisterAnnounce.css'

function RegisterAnnounce(){
  return(
    <Box className="RegisterAnnouncePage" flexGrow={1} component="main">
      <Container fixed>
          <Grid container spacing={3} justify="center">

            <Grid item xs={8}>
                <Typography variant="h3">Criar comunicado</Typography>
            </Grid>

            <Grid component="form" className="FormSection" item xs={8}>
              <TextField variant="outlined" fullWidth label="Título" required/>

              <TextField variant="outlined" fullWidth label="Conteúdo" required
                multiline rows={4}/>

              <FormControlLabel label="Visível apenas para membros ativos." 
                control={
                  <Checkbox color="primary" name="PingParticipant" checked/>
              }/>

              <Button variant="contained" size="large" fullWidth color="primary">
                <strong>Publicar comunicado</strong>
              </Button>
            </Grid>

          </Grid>
      </Container>
    </Box>
  )
}

export default RegisterAnnounce
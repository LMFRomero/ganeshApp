import { Box, Container, Grid, Button, Typography, Table, TableBody, TableRow, TableCell } from '@material-ui/core'
import { TextField, InputLabel, Select, MenuItem, FormControl, Checkbox, FormControlLabel } from '@material-ui/core'
import './EditAnnounce.css'

import FormAnnounce from '../../../components/FormAnnounce/FormAnnounce'

function EditAnnounce(){
  return(
    <Box className="EditAnnouncePage" flexGrow={1} component="main">
      <Container fixed>
          <Grid container spacing={3} justify="center">

            <Grid item xs={12} md={8}>
                <Typography variant="h3">Editar Comunicado</Typography>
            </Grid>

            <FormAnnounce variant="edit"/>

          </Grid>
      </Container>
    </Box>
  )
}

export default EditAnnounce
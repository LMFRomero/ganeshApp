import { Box, Container, Grid, Typography } from '@material-ui/core'
import './EditFront.css'

import FormFront from '../../../components/FormFront/FormFront'

function EditFront(){
  return(
    <Box className="EditFrontPage" flexGrow={1} component="main">
      <Container fixed>
          <Grid container spacing={3} justify="center">

            <Grid item xs={12} md={8}>
                <Typography variant="h3">Editar Frente</Typography>
            </Grid>

            <FormFront variant="edit"/>

          </Grid>
      </Container>
    </Box>
  )
}

export default EditFront
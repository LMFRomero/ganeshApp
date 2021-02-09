import { Box, Container, Grid, Button, Typography } from '@material-ui/core'
import './EditMeeting.css'

import FormMeeting from '../../../components/FormMeeting/FormMeeting'

function EditMeeting(){
  return(
    <Box className="EditMeetingPage" flexGrow={1} component="main">
      <Container fixed>
          <Grid container spacing={3} justify="center" component="form">

            <Grid item xs={12}>
                <Typography variant="h3">Editar Reunião</Typography>
            </Grid>
            
            <FormMeeting variant="edit"/>

          </Grid>
      </Container>
    </Box>
  )
}

export default EditMeeting
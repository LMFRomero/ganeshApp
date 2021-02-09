import { Box, Container, Grid, Typography } from '@material-ui/core'
import './RegisterMeeting.css'

import FormMeeting from '../../../components/FormMeeting/FormMeeting'

function RegisterMeeting(){
  return(
    <Box className="RegisterMeetingPage" flexGrow={1} component="main">
      <Container fixed>
          <Grid container spacing={3} justify="center" component="form">

            <Grid item xs={12}>
                <Typography variant="h3">Criar reunião</Typography>
            </Grid>
            
            <FormMeeting variant="register"/>

          </Grid>
      </Container>
    </Box>
  )
}

export default RegisterMeeting
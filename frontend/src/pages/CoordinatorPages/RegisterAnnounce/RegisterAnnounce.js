import { Box, Container, Grid, Typography} from '@material-ui/core'
import './RegisterAnnounce.css'

import FormAnnounce from '../../../components/FormAnnounce/FormAnnounce'

function RegisterAnnounce(){
  return(
    <Box className="RegisterAnnouncePage" flexGrow={1} component="main">
      <Container fixed>
          <Grid container spacing={3} justify="center">

            <Grid item xs={12} md={8}>
                <Typography variant="h3">Criar Comunicado</Typography>
            </Grid>

            <FormAnnounce variant="register"/>

          </Grid>
      </Container>
    </Box>
  )
}

export default RegisterAnnounce
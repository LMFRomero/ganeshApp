import { Box, Container, Grid, Typography} from '@material-ui/core'
import './RegisterFront.css'

import FormFront from '../../../components/FormFront/FormFront'

function RegisterFront(){
  return(
    <Box className="RegisterFrontPage" flexGrow={1} component="main">
      <Container fixed>
          <Grid container spacing={3} justify="center">
            
            <Grid item xs={12} md={8}>
                <Typography variant="h3">Criar Frente</Typography>
            </Grid>

            <FormFront variant="register"/>

          </Grid>
      </Container>
    </Box>
  )
}

export default RegisterFront
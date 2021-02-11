import { Box, Container, Grid, Typography } from '@material-ui/core'
import './Requests.css'

function Requests(){
  return(
    <Box className="RequestsPage" flexGrow={1} component="main">
      <Container fixed>
          <Grid container spacing={3} justify="center">

            <Grid item xs={12} md={8}>
                <Typography variant="h3">Solicitações Pendentes</Typography>
            </Grid>

          </Grid>
      </Container>
    </Box>
  )
}

export default Requests
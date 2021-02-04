import { Box, Container, Grid, Typography } from "@material-ui/core";
import { Link as RouterLink } from 'react-router-dom';

import GaneshLogo from '../../assets/images/GaneshLogo.png'

function PageNotFound(){
  return(
    <Box className="LoginPage" flexGrow={1} component="main">
      <Container fixed>
        <Grid container spacing={6} justify="center">
          
          <Grid item xs={12} md={5}>
            <img src={GaneshLogo} style={{maxWidth: 200, display: "block", margin: "0 auto"}}/>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h2" align="center">404 - Página não encontrada</Typography>
            <Typography variant="h6" align="center">
              <RouterLink to="/">Voltar para a página inicial</RouterLink>
            </Typography>
          </Grid>

        </Grid>
      </Container>
    </Box>
  )
}

export default PageNotFound
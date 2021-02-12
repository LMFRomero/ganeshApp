import { Box, Container, Grid, Typography } from '@material-ui/core'
import './UserAccount.css'

import FormUserData from '../../../components/FormUserData/FormUserData'
import FormAccountData from '../../../components/FormAccountData/FormAccountData'
import FormChangePassword from '../../../components/FormChangePassword/FormChangePassword'

function UserAccount(){
  return(
    <Box className="UserAccountPage" flexGrow={1} component="main">
      <Container fixed>
          <Grid container spacing={3} justify="center">

            <Grid item xs={12}>
                <Typography variant="h3">Minha conta</Typography>
            </Grid>

            <FormUserData variant="coorditator"/>

            <Grid className="FormSection" item xs={12} sm={12} md={6}>
              <FormAccountData variant="coorditator"/>
              <FormChangePassword variant="coorditator"/>
            </Grid>

          </Grid>
      </Container>
    </Box>
  )
}

export default UserAccount
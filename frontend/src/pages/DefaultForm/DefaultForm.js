import { useState } from 'react'
import { Box, Container, Grid, Typography } from '@material-ui/core'

import SnackAlerts from '../../components/SnackAlerts/SnackAlerts'
import FormAnnounce from '../../components/FormAnnounce/FormAnnounce'
import FormMeeting  from '../../components/FormMeeting/FormMeeting'
import FormFront    from '../../components/FormFront/FormFront' 


// Variants: 'register-meeting', 'edit-meeting', 'r/e-announce', 'r/e-front',
function DefaultForm(props){
    
  const [action, subject] = props.variant.split('-')
  const [formSuccess, setFormSuccess]       = useState({})
  const [formErrors, setFormErrors]         = useState({})

  const options = {
    announce: { name: 'Comunicado', Component: FormAnnounce },
    meeting:  { name: 'Reunião',    Component: FormMeeting },
    front:    { name: 'Frente',     Component: FormFront },
  }

  const renderTitle = () => {
    return (
      <Typography variant="h3">
        { (action === 'edit') ? 'Editar ' : 'Criar '}
        { options[subject].name }
      </Typography>
    )
  }

  const renderForm = (Component, action) => { 
    return (
      <Component variant={action} formSuccess={formSuccess} setFormSuccess={setFormSuccess}
        formErrors={formErrors} setFormErrors={setFormErrors} />
    )
  }

  return(
    <Box className="DefaultFormPage" flexGrow={1} component="main">
      <Container fixed>
          <Grid container spacing={3} justify="center">

            <SnackAlerts formSuccess={formSuccess} setFormSuccess={setFormSuccess} 
              formErrors={formErrors} setFormErrors={setFormErrors}/>
              
            <Grid item xs={12}>
                { renderTitle() }
            </Grid>
            
            { renderForm(options[subject].Component, action) }
            
          </Grid>
      </Container>
    </Box>
  )
}

export default DefaultForm
import { Box, Container, Grid, Typography } from '@material-ui/core'

import FormAnnounce from '../../components/FormAnnounce/FormAnnounce'
import FormMeeting  from '../../components/FormMeeting/FormMeeting'
import FormFront    from '../../components/FormFront/FormFront' 

// Variants: 'register-meeting', 'edit-meeting', 'r/e-announce', 'r/e-front',
function DefaultForm(props){
    
    const [ action, subject ] = props.variant.split('-')

    const options = {
        announce: { name: 'Comunicado', render: (v) => <FormAnnounce variant={v}/> },
        meeting: {  name: 'Reunião',    render: (v) => <FormMeeting variant={v}/> },
        front: {    name: 'Frente',     render: (v) => <FormFront variant={v}/> },
    }

    const renderTitle = () => {
        return (
            <Typography variant="h3">
                { (action == 'edit') ? 'Editar ' : 'Criar '}
                { options[subject].name }
            </Typography>
        )
    }

    const renderForm = () => options[subject].render(action)

  return(
    <Box className="DefaultFormPage" flexGrow={1} component="main">
      <Container fixed>
          <Grid container spacing={3} justify="center">

            <Grid item xs={12} md={12}>
                { renderTitle() }
            </Grid>
            
            { renderForm() }
            
          </Grid>
      </Container>
    </Box>
  )
}

export default DefaultForm
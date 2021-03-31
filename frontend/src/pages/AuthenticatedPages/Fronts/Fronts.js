import { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Button } from '@material-ui/core'
import './Fronts.css'

import AddSharpIcon from '@material-ui/icons/AddSharp';

import { frontService } from '../../../services/frontService'
import { authService } from '../../../services/authService'
import FrontCard from '../../../components/FrontCard/FrontCard'
import SnackAlerts from '../../../components/SnackAlerts/SnackAlerts'
  
function Fronts(props){

  const [ fronts, setFronts ]              = useState([])
  const [ authUsername, setUsername ]        = useState('')
  const [ errorMessages, setErrorMessages] = useState({})

  useEffect(() => { 
    setUsername(authService.getAuth().username)

    frontService.getAll()
    .then( (s) => setFronts(s))
    .catch((e) => setErrorMessages(e))
  }, [])

  return(
    <Box className="FrontsPage" flexGrow={1} component="main">
      <Container fixed>
          <Grid container spacing={3} justify="center">

            <SnackAlerts formSuccess={{}} setFormSuccess={()=>undefined} 
              formErrors={errorMessages} setFormErrors={setErrorMessages}/>

            <Grid item container xs={12} sm={12} md={8} justify="flex-end">
              <Button variant="contained" color="secondary" startIcon={<AddSharpIcon/>} 
                component={RouterLink} to="/criar-frente">Criar Frente</Button>
            </Grid>
            
            { fronts.map((f,i) => { 
              return(
                <Grid key={i} item xs={12} sm={12} md={8}>
                  <FrontCard
                      id={f.id} name={f.name} slug={f.slug} type={f.type} 
                      description={f.description} 
                      initMembers={f.members}
                      isDeleted={f.isDeleted} membersOnly={f.membersOnly}

                      authUsername={authUsername}
                      errorMessages={errorMessages} setErrorMessages={setErrorMessages}
                      />
                </Grid>
              )
            })}
            
          </Grid>
      </Container>
    </Box>
  )
}
  
export default Fronts
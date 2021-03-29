import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Grid, Typography } from '@material-ui/core'
import './UserAccount.css'

import { authService } from '../../../services/authService'
import { userService } from '../../../services/userService'
import { optionsHelper as optHelper } from '../../../helpers/optionsHelper'
import SnackAlerts from '../../../components/SnackAlerts/SnackAlerts'
import FormUserData from '../../../components/FormUserData/FormUserData'
import FormAccountData from '../../../components/FormAccountData/FormAccountData'
import FormAccountDelete from '../../../components/FormAccountDelete/FormAccountDelete'
import FormChangePassword from '../../../components/FormChangePassword/FormChangePassword'

// Variants: 'my-account', 'coordinator'
function UserAccount({variant = "my-account"}){

  let { userId } = useParams()

  const [submitDisabled, setSubmitDisabled] = useState(false)
  const [formSuccess, setFormSuccess]       = useState({})
  const [formErrors, setFormErrors]         = useState({})
  const [confirmEmail, setConfirmEmail]     = useState("membro@ganesh.com")
  const [formData, setFormData]             = useState({
    id: '',
    name: '',
    course: optHelper.getDefaultOption(optHelper.optsCourses),
    otherCourse: '',
    institution: optHelper.getDefaultOption(optHelper.optsInstitutions),
    otherInstitution: '',
    collegeID: '',
    yearJoinCollege: new Date().getFullYear(),
    yearJoinGanesh:  new Date().getFullYear(),
    email: '',
    username: '',
    title: '',
    role: '',
    isDeleted: false,
  })

  useEffect(() => { 
    userService.getById(variant === 'my-account' ? authService.getAuth().id : userId)
    .then(   function(u) { 

      let userData = { ...u }
      
      // If option is not predefined then set it to otherField
      if( !optHelper.isPredefinedOption(userData.course, optHelper.optsCourses) ){
        userData.otherCourse = u.course
        userData.course = optHelper.CUSTOM_OPTION
      }
      if( !optHelper.isPredefinedOption(userData.institution, optHelper.optsInstitutions) ){
        userData.otherInstitution = u.institution
        userData.institution = optHelper.CUSTOM_OPTION
      }

      setFormData(userData) 
      setConfirmEmail(userData.email || "membro@ganesh.com")
    })
    .catch(  function(e) { 
      setFormErrors(e) 
      setSubmitDisabled(true)
    }) 
  }, [userId, variant])

  return(
    <Box className="UserAccountPage" flexGrow={1} component="main">
      <Container fixed>
          <Grid container spacing={3} justify="center">

            <SnackAlerts formSuccess={formSuccess} setFormSuccess={setFormSuccess} 
              formErrors={formErrors} setFormErrors={setFormErrors}/>

            <Grid item xs={12}>
                <Typography variant="h3">
                  { variant === "my-account" ? "Minha conta" : "Editar Usuário"}
                </Typography>
            </Grid>

            <FormUserData variant={variant} 
              submitDisabled={submitDisabled} setSubmitDisabled={setSubmitDisabled}
              formData={formData} setFormData={setFormData} 
              formSuccess={formSuccess} setFormSuccess={setFormSuccess} 
              formErrors={formErrors} setFormErrors={setFormErrors} />
            
            <Grid className="FormSection" item xs={12} sm={12} md={6} 
              style={{display: "flex", flexFlow:"column nowrap", justifyContent: "space-between"}}>
              <FormAccountData variant={variant}
                submitDisabled={submitDisabled} setSubmitDisabled={setSubmitDisabled}
                formData={formData} setFormData={setFormData} 
                formSuccess={formSuccess} setFormSuccess={setFormSuccess} 
                formErrors={formErrors} setFormErrors={setFormErrors} />
            
              <FormChangePassword variant={variant} userId={formData.id}
                submitDisabled={submitDisabled} setSubmitDisabled={setSubmitDisabled}
                formSuccess={formSuccess} setFormSuccess={setFormSuccess} 
                formErrors={formErrors} setFormErrors={setFormErrors} />

              <FormAccountDelete variant={variant} userId={formData.id} confirmEmail={confirmEmail}
                submitDisabled={submitDisabled} setSubmitDisabled={setSubmitDisabled}
                formSuccess={formSuccess} setFormSuccess={setFormSuccess} 
                formErrors={formErrors} setFormErrors={setFormErrors} />
            </Grid>

          </Grid>
      </Container>
    </Box>
  )
}

export default UserAccount
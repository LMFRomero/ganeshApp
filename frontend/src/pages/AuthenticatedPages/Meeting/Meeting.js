import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Box, Container, Grid } from '@material-ui/core'
import './Meeting.css'

import { authService } from '../../../services/authService'
import { meetingService } from '../../../services/meetingService'
import MeetingCard from '../../../components/MeetingCard/MeetingCard'
import SnackAlerts from '../../../components/SnackAlerts/SnackAlerts'

function Meeting(){
  
  let history = useHistory()
  let { meetingId } = useParams()

  const [ authUsername, setUsername ]      = useState('')
  const [ errorMessages, setErrorMessages] = useState({})
  const [meeting, setMeetingData] = useState({
    id: ' ', title: ' ', content: ' ',
    date: ' ', duration: ' ', place: ' ',
    front: { name: ' ', slug: ' '},
    author: {username: ' ', title: ' '},
    publishDate: ' ',
    members: [],
    membersOnly: true, deleted: false,
  })

  useEffect(() => { 
    setUsername(authService.getAuth().username)

    meetingService.getById(meetingId)
    .then(function(m) { setMeetingData({ ...m }) })
    .catch(function(e) { history.push("/404") }) 
  }, [meetingId])

  return(
    <Box className="MeetingPage" flexGrow={1} component="main">
      <Container>
        <Grid container spacing={3} justify="center">

          <SnackAlerts formSuccess={{}} setFormSuccess={()=>undefined} 
            formErrors={errorMessages} setFormErrors={setErrorMessages}/>

          <Grid item xs={12} sm={12} md={12} lg={10}>
            <MeetingCard variant="large"
                authUsername={authUsername}
                id={meeting.id}
                author={meeting.author} 
                publishDate={meeting.publishDate}

                title={meeting.title}
                content={meeting.content}
                
                date={meeting.date}
                duration={meeting.duration}
                place={meeting.place}

                initMembers={meeting.members}

                errorMessages={errorMessages} setErrorMessages={setErrorMessages}
                />
          </Grid>

        </Grid>
      </Container>
    </Box>
  )
}
  
export default Meeting
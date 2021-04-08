import { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography, Card, CardHeader, Avatar, CardContent, 
  Divider, Table, TableBody, TableRow, TableCell, CardActions, IconButton } from '@material-ui/core'
import './MeetingCard.css'

import AddSharpIcon from '@material-ui/icons/AddSharp';
import CheckSharpIcon from '@material-ui/icons/CheckSharp';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PeopleIcon from '@material-ui/icons/People';
import EditIcon from '@material-ui/icons/Edit';

import { meetingService } from '../../services/meetingService'

const monthNames = [" ", "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
];

function MeetingCard({ authUsername, variant, _id, title, content, date, duration, place, front, author, 
    createdAt, initMembers, membersOnly, isDeleted, errorMessages, setErrorMessages }){

  const [ submitDisabled, setSubmitDisabled] = useState(false)
  const [ isMember, setIsMember] = useState(initMembers.find((m) => m.username === authUsername))
  const [ members,  setMembers ] = useState(initMembers)
  
  useEffect(() => { 
    setMembers(initMembers)
    setIsMember(initMembers.find((m) => m.username === authUsername))
  }, [initMembers, authUsername])

  const getFormattedDate = (date) => { 
    let parts = (new Date(date)).toLocaleString().split(/[/: ]/)
    return `${parts[0]} de ${monthNames[parseInt(parts[1])]} de ${parts[2]}, ${parts[3]}h${parts[4]}`
  }
  
  const renderActionIcon = () => {
    if(variant === "large") { return (
        <IconButton aria-label="settings" component={RouterLink} to={`/editar-reuniao/${_id}`}>
          <EditIcon/>
        </IconButton>
    )} else return <></>
  }

  const handleAddMember = (e) => {
    e.preventDefault()
    
    setSubmitDisabled(true)

    meetingService.addMember(_id, authUsername)
    .then(   function(s) {  
      setIsMember(true)
      setMembers([...members, {username: authUsername}])
    })
    .catch(  function(e) { setErrorMessages(e) })     
    .finally(function( ) { setSubmitDisabled(false) })
  }

  const handleRemoveMember = (e) => {
    e.preventDefault()
    
    setErrorMessages({})
    setSubmitDisabled(true)

    meetingService.removeMember(_id, authUsername)
    .then(   function(s) {  
      setIsMember(false)
      setMembers([...members.filter((m) => m.username !== authUsername)])
    })
    .catch(  function(e) { setErrorMessages(e) })     
    .finally(function( ) { setSubmitDisabled(false) })
  }

  return(
    <Card className={"MeetingCard MeetingCard-" + (variant || 'small')} elevation={2}>
      <CardHeader
        avatar={<Avatar>{(author.username) && author.username[0].toUpperCase()}</Avatar>}
        title={`${author.username} (${author.title})`}
        subheader={getFormattedDate(createdAt)}
        action={renderActionIcon()}
        />
      <Divider/>
        
      <CardContent>
        <Box className="MeetingInfo">
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>

          <Table size="small">
            <TableBody>
              <TableRow>
                  <TableCell padding="none"><strong>Data:</strong></TableCell>
                  <TableCell>{(date) ? getFormattedDate(date) : "a combinar"}</TableCell>
              </TableRow>
              <TableRow>
                  <TableCell padding="none"><strong>Duração:</strong></TableCell>
                  <TableCell>{(duration) ? duration : "a combinar"}</TableCell>
              </TableRow>
              <TableRow>
                  <TableCell padding="none"><strong>Local:</strong></TableCell>
                  <TableCell>{(place) ? place : "a combinar"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          { variant === "large" && 
          <Typography className="MeetingContent" align="justify" gutterBottom>
            {content}
          </Typography>
          }
        </Box>
        
        { variant === "large" && members !== undefined &&  
        <Box className="MeetingPresents">
          {members.map((i) => <Avatar key={i.username} title={i.username}>
            {i.username[0].toUpperCase()}</Avatar>)}
        </Box>
        }
      </CardContent>

      <CardActions >
        { variant === "large" &&
          <Button color="default" variant="text" size="large" startIcon={<PeopleIcon/>}>
            <span>{members.length}</span>
          </Button>
        } 

        { isMember && 
          <Button color="primary" variant="contained" size="medium" startIcon={<CheckSharpIcon/>}
            onClick={handleRemoveMember} disabled={submitDisabled}>
            Participou
          </Button>
        }

        { !isMember && 
          <Button color="secondary" variant="contained" size="medium" startIcon={<PersonAddIcon/>}
            onClick={handleAddMember} disabled={submitDisabled}>
            Participar
          </Button>
        }

        { variant !== "large" && 
        <Button color="primary" variant="contained" size="medium" startIcon={<AddSharpIcon/>}
          component={RouterLink} to={`/reuniao/${_id}`}>
            Detalhes
        </Button>
        }
      </CardActions>

    </Card>
  )
}
    
export default MeetingCard
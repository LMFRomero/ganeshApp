import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Card, CardHeader, Avatar, CardContent, Divider, IconButton, Box, Button, CardActions } from '@material-ui/core'
import './FrontCard.css'

import EditIcon from '@material-ui/icons/Edit';
import CheckSharpIcon from '@material-ui/icons/CheckSharp';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { frontService } from '../../services/frontService';

const frontTypes = { 
  study:    "Frente de Estudos", 
  special:  "Frente Especial",
  internal: "Frente Interna"
}

function FrontCard({id, name, slug, type, description, initMembers, isDeleted, membersOnly, 
  authUsername, errorMessages, setErrorMessages }){
  
  const [submitDisabled, setSubmitDisabled] = useState(false)
  const [ isMember, setIsMember] = useState(initMembers.find((m) => m.username === authUsername))
  const [ members,  setMembers ] = useState(initMembers)

  const renderActionIcon = () => {
    if(true) { return (
        <IconButton aria-label="settings" component={RouterLink} to={`/editar-frente/${id}`}>
          <EditIcon/>
        </IconButton>
    )} else return <></>
  }

  const renderSubtitle = () => {
    let subtitle = ''
    subtitle += (isDeleted) ? 'Desativada | ' : ''
    subtitle += `${frontTypes[type]} | `
    subtitle += (members.length) ? `${members.length} participantes` : 'Nenhum participante'
    return subtitle
  }

  const handleAddMember = (e) => {
    e.preventDefault()
    
    setErrorMessages({})
    setSubmitDisabled(true)

    frontService.addMember(slug, authUsername)
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

    frontService.removeMember(slug, authUsername)
    .then(   function(s) {  
      setIsMember(false)
      setMembers([...members.filter((m) => m.username !== authUsername)])
    })
    .catch(  function(e) { setErrorMessages(e) })     
    .finally(function( ) { setSubmitDisabled(false) })
  }

  return(
    <Card className="FrontCard" elevation={2}>
      
      <CardHeader
          avatar={<Avatar>F</Avatar>}
          title={<Typography variant="h5">{name}</Typography>}
          subheader={renderSubtitle()}
          action={renderActionIcon()}
        />

      <Divider/>
      
      <CardContent>
        <Box className="FrontParticipants">
          {members.map((m) => <Avatar key={m.username} title={m.username} >{m.username[0]}</Avatar>)}
        </Box>
      </CardContent>
        
      <CardActions>
        { isMember && 
          <Button color="primary" variant="contained" size="medium" startIcon={<CheckSharpIcon/>}
            onClick={handleRemoveMember} disabled={submitDisabled}>
            Participando
          </Button>
        }

        { !isMember && 
          <Button color="secondary" variant="contained" size="medium" startIcon={<PersonAddIcon/>}
            onClick={handleAddMember} disabled={submitDisabled}>
            Participar
          </Button>
        }
      </CardActions>

    </Card>
  )
}
    
export default FrontCard
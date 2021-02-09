import { Typography, Card, CardHeader, Avatar, CardContent, Divider, IconButton, Box, Button, CardActions } from '@material-ui/core'
import './FrontCard.css'

import { Link as RouterLink } from 'react-router-dom';

import EditIcon from '@material-ui/icons/Edit';
import CheckSharpIcon from '@material-ui/icons/CheckSharp';


function FrontCard(props){
  
  const renderActionIcon = () => {
    if(true) { return (
        <IconButton aria-label="settings" component={RouterLink} to="/editar-frente/abc">
          <EditIcon/>
        </IconButton>
    )} else return <></>
  }

  const renderSubtitle = () => {
    let subtitle = ''
    subtitle += (props.inactive) ? 'Desativada | ' : ''
    subtitle += `${props.type} | `
    subtitle += (props.participants.length) ? `${props.participants.length} participantes` : 'Nenhum participante'
    return subtitle
  }

  return(
    <Card className="FrontCard" elevation={2}>
      
      <CardHeader
          avatar={<Avatar>{props.avatar}</Avatar>}
          title={<Typography variant="h5">{props.title}</Typography>}
          subheader={renderSubtitle()}
          action={renderActionIcon()}
        />

      <Divider/>
      
      <CardContent>
        <Box className="FrontParticipants">
          {props.participants.map((i) => <Avatar key={i.name}>{i.avatar}</Avatar>)}
        </Box>
      </CardContent>
        
      <CardActions>
        <Button color="primary" variant="contained" size="medium" startIcon={<CheckSharpIcon/>}>
          Participando
        </Button>
      </CardActions>

    </Card>
  )
}
    
export default FrontCard
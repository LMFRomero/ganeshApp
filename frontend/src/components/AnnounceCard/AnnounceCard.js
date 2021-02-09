import { Box, Container, Grid, Button, Typography, Card, CardHeader, Avatar, CardContent, Divider, IconButton } from '@material-ui/core'
import './AnnounceCard.css'

import { Link as RouterLink } from 'react-router-dom';

import EditIcon from '@material-ui/icons/Edit';

function AnnounceCard(props){
  
  const renderActionIcon = () => {
    if(true) { return (
        <IconButton aria-label="settings" component={RouterLink} to="/editar-comunicado/abc">
          <EditIcon/>
        </IconButton>
    )} else return <></>
  }

  return(
    <Card className="AnnounceCard" elevation={2}>
      
      <CardHeader
          avatar={<Avatar>{props.avatar}</Avatar>}
          title={props.author}
          subheader={props.dateHour}
          action={renderActionIcon()}
          />

      <Divider/>
      
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {props.title}
        </Typography>

        <Typography  variant="body2" align="justify">
          {props.content}
        </Typography>
      </CardContent>

    </Card>
  )
}
    
export default AnnounceCard
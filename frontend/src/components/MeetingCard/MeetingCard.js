import { Box, Button, Typography, Card, CardHeader, Avatar, CardContent, Divider, Table, TableBody, TableRow, TableCell, CardActions, IconButton } from '@material-ui/core'
import './MeetingCard.css'

import { Link as RouterLink } from 'react-router-dom';

import AddSharpIcon from '@material-ui/icons/AddSharp';
import CheckSharpIcon from '@material-ui/icons/CheckSharp';
import PeopleIcon from '@material-ui/icons/People';
import EditIcon from '@material-ui/icons/Edit';

function MeetingCard(props){

  const renderActionIcon = () => {
    if(props.variant === "large") { return (
        <IconButton aria-label="settings">
          <EditIcon/>
        </IconButton>
    )} else return <></>
  }

  return(
    <Card className={"MeetingCard MeetingCard-" + (props.variant || 'small')} elevation={2}>
      <CardHeader
        avatar={<Avatar>{props.avatar}</Avatar>}
        title={props.author}
        subheader={props.dateHour}
        action={renderActionIcon()}
        />

      <Divider/>
        
      <CardContent>
        <Box className="MeetingInfo">
          <Typography variant="h5" gutterBottom>
            {props.title}
          </Typography>

          <Table size="small">
            <TableBody>
              <TableRow>
                  <TableCell padding="none"><strong>Data:</strong></TableCell>
                  <TableCell>{props.meetingDate}</TableCell>
              </TableRow>
              <TableRow>
                  <TableCell padding="none"><strong>Duração:</strong></TableCell>
                  <TableCell>{props.meetingDuration}</TableCell>
              </TableRow>
              <TableRow>
                  <TableCell padding="none"><strong>Local:</strong></TableCell>
                  <TableCell>{props.meetingPlace}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          { props.variant === "large" && 
          <Typography className="MeetingContent" align="justify" gutterBottom>
            {props.content}
          </Typography>
          }
        </Box>
        
        { props.variant === "large" && props.presents !== undefined &&  
        <Box className="MeetingPresents">
          {props.presents.map((i) => <Avatar key={i.name}>{i.avatar}</Avatar>)}
        </Box>
        }
      </CardContent>

      <CardActions >
        { props.variant === "large" &&
        <Button color="default" variant="text" size="large" startIcon={<PeopleIcon/>}>
          <span>{props.presents.length}</span>
        </Button>
        } 

        <Button color="secondary" variant="contained" size="medium" startIcon={<CheckSharpIcon/>}>
          Presente
        </Button>

        { props.variant !== "large" && 
        <Button color="primary" variant="contained" size="medium" startIcon={<AddSharpIcon/>}
          component={RouterLink} to="/reuniao/abc">
            Detalhes
        </Button>
        }
      </CardActions>

    </Card>
  )
}
    
export default MeetingCard
import { Box, Container, Grid, Button, Typography, Card, CardHeader, Avatar, CardContent, Divider, Table, TableBody, TableRow, TableCell, CardActions } from '@material-ui/core'
import './MeetingCard.css'

import AddSharpIcon from '@material-ui/icons/AddSharp';
import CheckSharpIcon from '@material-ui/icons/CheckSharp';

function MeetingCard(props){
    return(
      <Card className="MeetingCard" elevation={2}>
        <CardHeader
            avatar={<Avatar>{props.avatar}</Avatar>}
            title={props.author}
            subheader={props.dateHour}
            />

        <Divider/>
        
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {props.title}
          </Typography>

          <Table size="small">
            <TableBody>
              <TableRow>
                  <TableCell padding="none"><strong>Dia e Hora:</strong></TableCell>
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
      </CardContent>

      <CardActions >
        <Button color="secondary" variant="contained" size="medium" startIcon={<CheckSharpIcon/>}>
            Marcar Presença
        </Button>
        <Button color="primary" variant="contained" size="medium" startIcon={<AddSharpIcon/>}>
            Detalhes
        </Button>
      </CardActions>

    </Card>
  )
}
    
export default MeetingCard
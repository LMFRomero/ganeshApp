import { Box, Container, Grid, Button, Typography, Card, CardHeader, Avatar, CardContent, Divider } from '@material-ui/core'
import './AnnounceCard.css'

function AnnounceCard(props){
    return(
      <Card className="AnnounceCard" elevation={2}>
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

          <Typography  variant="body2" align="justify">
            {props.content}
          </Typography>
      </CardContent>

    </Card>
  )
}
    
export default AnnounceCard
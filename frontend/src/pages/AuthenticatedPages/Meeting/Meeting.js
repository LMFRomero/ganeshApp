import { Box, Container, Grid } from '@material-ui/core'
import './Meeting.css'

import MeetingCard from '../../../components/MeetingCard/MeetingCard'

const presentMembers = [
  {name: "Gabriel", avatar:"G", dateHour: "09/02/2021 19h30"},
  {name: "Pedro",   avatar:"P", dateHour: "09/02/2021 19h30"},
  {name: "Alex",    avatar:"A", dateHour: "09/02/2021 19h30"},
  {name: "Fabiano", avatar:"F", dateHour: "09/02/2021 19h30"},
  {name: "Serena",  avatar:"S", dateHour: "09/02/2021 19h30"},
  {name: "Gabriel", avatar:"G", dateHour: "09/02/2021 19h30"},
  {name: "Pedro",   avatar:"P", dateHour: "09/02/2021 19h30"},
  {name: "Alex",    avatar:"A", dateHour: "09/02/2021 19h30"},
  {name: "Fabiano", avatar:"F", dateHour: "09/02/2021 19h30"},
  {name: "Serena",  avatar:"S", dateHour: "09/02/2021 19h30"},
  {name: "Pedro",   avatar:"P", dateHour: "09/02/2021 19h30"},
  {name: "Alex",    avatar:"A", dateHour: "09/02/2021 19h30"},
  {name: "Fabiano", avatar:"F", dateHour: "09/02/2021 19h30"},
  {name: "Serena",  avatar:"S", dateHour: "09/02/2021 19h30"},
  {name: "Heloise", avatar:"H", dateHour: "09/02/2021 19h30"}
]

function Meeting(){
  return(
    <Box className="MeetingPage" flexGrow={1} component="main">
      <Container>
        <Grid container spacing={3} justify="center">

          <Grid item xs={12} sm={12} md={12} lg={10}>
            <MeetingCard variant="large" 
                avatar="G" author="Gabriel Van Loon (Membro)" 
                dateHour="2 de fevereiro de 2020, 13h37"
                title="Reunião de Web - SQL Injection + HackTheBox"
                summary="Nesta reunião iremos apresentar um pouco sobre SQL Injection nos 
                    bancos de dados SQLite3 e Oracle. Venham com a conta e VPN do HackTheBox já configuradas!"
                
                meetingDate="15 de fevereiro de 2020, 17h00"
                meetingDuration="2 horas e 15 minutos"
                meetingPlace="Online (Canal Discord)"

                content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent lacinia aliquet lorem non auctor. Fusce eu quam eu eros fermentum ornare. Etiam consectetur scelerisque ex. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque nec mollis justo. Nam tristique tincidunt quam non fringilla. Phasellus non purus diam. Cras lorem leo, sollicitudin at facilisis vitae, rutrum vitae odio. Mauris ut tortor quis elit dignissim euismod ut quis lectus. Mauris porttitor aliquet sapien, volutpat dapibus eros sodales at. Quisque pulvinar facilisis felis, in tempor magna faucibus vitae. Aenean at risus ac elit tristique pulvinar id eu mauris. Curabitur quis eleifend orci. Cras sagittis, odio a molestie auctor, tellus dui viverra libero, sed mattis urna metus quis mauris."
                presents={presentMembers}
                />
          </Grid>

        </Grid>
      </Container>
    </Box>
  )
}
  
export default Meeting
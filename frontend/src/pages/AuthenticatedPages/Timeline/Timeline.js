import { Box, Container, Grid, Button, Typography, Card, CardHeader, Avatar, CardContent, Divider } from '@material-ui/core'
import './Timeline.css'

import { Link as RouterLink } from 'react-router-dom';

import AnnounceCard from '../../../components/AnnounceCard/AnnounceCard'
import MeetingCard from '../../../components/MeetingCard/MeetingCard'

function Timeline(){
    return(
      <Box className="TimelinePage" flexGrow={1} component="main">
        <Container fixed>
            <Grid container spacing={3} justify="center">
  
              <Grid item container xs={12} sm={12} md={8} justify="flex-end">
                <Button  size="small" variant="outlined" color="primary">Definir filtros</Button>
                &nbsp;
                <Button  size="small" variant="outlined" color="secondary" 
                  component={RouterLink} to="/criar-reuniao">Criar Reunião</Button>
                &nbsp;
                <Button  size="small" variant="outlined" color="secondary"
                  component={RouterLink} to="/criar-comunicado">Criar Comunicado</Button>
              </Grid>

              <Grid item xs={12} sm={12} md={8}>
                <AnnounceCard avatar="P" author="Pedro Guerra (Coordenador Geral)"
                    dateHour="6 de fevereiro de 2020, 13h37"
                    title="Formulário de Intenção - 2021"
                    content={
                        <>
                        Bom dia bom dia. Passando aqui hoje pra pedir para vocês por favor preencherem esse  
                        <a href="#"> formulário de intenção de continuação no Ganesh em 2021</a>. Ele é tanto  
                        quem pretende ficar quanto para quem pretende sair. O principal motivo para isso é ajudar a gente a 
                        reorganizar a lista de membros, porque com a transição para "ead" as coisas ficaram 
                        meio confusas.
                        <br/><br/>
                        São só umas infos basicas tipo como te chamam, email, nome... e leva menos de 5 minutos para finalizar!
                        </>
                    }/>
              </Grid>

              <Grid item xs={12} sm={12} md={8}>
                <MeetingCard avatar="G" author="Gabriel Van Loon (Membro)"
                    dateHour="2 de fevereiro de 2020, 13h37"
                    title="Reunião de Web - SQL Injection + HackTheBox"
                    summary="Nesta reunião iremos apresentar um pouco sobre SQL Injection nos 
                        bancos de dados SQLite3 e Oracle. Venham com a conta e VPN do HackTheBox já configuradas!"
                    
                    meetingDate="15 de fevereiro de 2020, 17h00"
                    meetingDuration="2 horas e 15 minutos"
                    meetingPlace="Online (Canal Discord)"
                    />

              </Grid>
  
            </Grid>
        </Container>
      </Box>
    )
  }
  
  export default Timeline
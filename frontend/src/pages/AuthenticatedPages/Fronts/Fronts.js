import { Box, Container, Grid, Button } from '@material-ui/core'
import AddSharpIcon from '@material-ui/icons/AddSharp';
import './Fronts.css'

import { Link as RouterLink } from 'react-router-dom';

import FrontCard from '../../../components/FrontCard/FrontCard'

const frontMembers = [
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
  
function Fronts(props){
    return(
      <Box className="FrontsPage" flexGrow={1} component="main">
        <Container fixed>
            <Grid container spacing={3} justify="center">
  
              <Grid item container xs={12} sm={12} md={8} justify="flex-end">
                <Button variant="contained" color="secondary" startIcon={<AddSharpIcon/>} 
                  component={RouterLink} to="/criar-frente">Criar Frente</Button>
              </Grid>
              
              <Grid item xs={12} sm={12} md={8}>
                <FrontCard 
                    avatar="W" 
                    title="Segurança Web"
                    type="Frente de estudos"
                    participants={frontMembers}
                    />
              </Grid>

              <Grid item xs={12} sm={12} md={8}>
                <FrontCard 
                    avatar="R" 
                    title="Redes e Pentesting"
                    type="Frente de estudos"
                    participants={frontMembers}
                    />
              </Grid>

              <Grid item xs={12} sm={12} md={8}>
                <FrontCard 
                    avatar="C" 
                    title="Criptografia"
                    type="Frente de estudos"
                    participants={frontMembers}
                    />
              </Grid>

              <Grid item xs={12} sm={12} md={8}>
                <FrontCard 
                    avatar="G" 
                    title="Reunião Geral"
                    type="Grupo de Extensão"
                    participants={frontMembers}
                    />
              </Grid>
              
            </Grid>
        </Container>
      </Box>
    )
  }
  
  export default Fronts
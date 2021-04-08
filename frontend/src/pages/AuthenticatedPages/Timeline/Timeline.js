import { useState, useEffect } from 'react'
import { useParams, useHistory, Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Button, Link, Menu, MenuItem } from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination';
import AddSharpIcon from '@material-ui/icons/AddSharp';
import FilterListIcon from '@material-ui/icons/FilterList';
import './Timeline.css'

import { authService } from '../../../services/authService'
import { frontService } from '../../../services/frontService'
import { meetingService } from '../../../services/meetingService'
import AnnounceCard from '../../../components/AnnounceCard/AnnounceCard'
import MeetingCard from '../../../components/MeetingCard/MeetingCard'
import SnackAlerts from '../../../components/SnackAlerts/SnackAlerts'

// Variants: "meetings" and "announces"
function Timeline({ variant }){

  const history = useHistory()
  const {frontSlug, pageNumber}     = useParams()
  const pathStart = history.location.pathname.split("/")[1]

  const [authUsername, setUsername]       = useState('')
  const [errorMessages, setErrorMessages] = useState({})
  const [frontOptions,   setFrontOptions] = useState([])
  const [pagination, setPagination]     = useState({ currentPage: pageNumber, maxPage: pageNumber })
  const [results, setResults]           = useState([])
  const [filterAnchor, setFilterAnchor] = useState(null)

  const loadResults = async (front, page) => { 
    try { 
      const response = await meetingService.getAll(page, front);
      setPagination({ currentPage: response.currentPage, maxPage: response.maxPage })
      setResults([ ...response.results ])
    } catch(e) {
      setErrorMessages(e)
    }
  }

  const handlePageChange = (event, value) => {
    if(frontSlug)
      history.push(`/${pathStart}/${frontSlug}/${value}`)
    else
      history.push(`/${pathStart}/${value}`)
  };

  useEffect(() => { 
    loadResults(frontSlug, parseInt(pageNumber) || 1 )
  }, [frontSlug, pageNumber])

  useEffect(() => { 
    setUsername(authService.getAuth().username)

    frontService.getOptions()
    .then( (s) => { setFrontOptions(s) })
    .catch((e) => { setErrorMessages(e) })
  }, [])

  return(
    <Box className="TimelinePage" flexGrow={1} component="main">
      <Container fixed>
          <Grid container spacing={3} justify="center">

            <SnackAlerts formSuccess={{}} setFormSuccess={()=>undefined} 
              formErrors={errorMessages} setFormErrors={setErrorMessages}/>

            <Grid item container xs={12} sm={12} md={8} justify="space-between" spacing={1}>
              <Button variant="outlined" size="small" startIcon={<FilterListIcon/>}
                onClick={(e) => setFilterAnchor(e.currentTarget)}>
                  Filtrar Frentes
              </Button>
              <Menu anchorEl={filterAnchor} open={Boolean(filterAnchor)} onClose={() => setFilterAnchor(null)} >
                <MenuItem component={RouterLink} to={`/${pathStart}/`}>Mostrar Todas</MenuItem>
                { frontOptions.map((f,i)=><MenuItem key={f.slug} component={RouterLink} to={`/${pathStart}/${f.slug}/1`}>{f.name}</MenuItem>) }
              </Menu>

              { variant === "meetings" &&
              <Button variant="contained" color="secondary" size="small" startIcon={<AddSharpIcon/>}
                component={RouterLink} to="/criar-reuniao">Criar Reunião</Button>
              }

              { variant === "announces" &&
              <Button variant="contained" color="secondary" size="small" startIcon={<AddSharpIcon/>}
                component={RouterLink} to="/criar-comunicado">Criar Comunicado</Button>
              }
            </Grid>
            
            { variant === "announces" &&
            <Grid item xs={12} sm={12} md={8}>
              <AnnounceCard avatar="P" author="Pedro Guerra (Coordenador Geral)"
                dateHour="6 de fevereiro de 2020, 13h37"
                title="Formulário de Intenção - 2021"
                content={
                    <>
                    Bom dia bom dia. Passando aqui hoje pra pedir para vocês por favor preencherem esse  
                    <Link href="#form-link"> formulário de intenção de continuação no Ganesh em 2021</Link>. Ele é tanto  
                    quem pretende ficar quanto para quem pretende sair. O principal motivo para isso é ajudar a gente a 
                    reorganizar a lista de membros, porque com a transição para "ead" as coisas ficaram 
                    meio confusas.
                    <br/><br/>
                    São só umas infos basicas tipo como te chamam, email, nome... e leva menos de 5 minutos para finalizar!
                    </>
                  }/>
            </Grid>
            }
            
            { variant === "meetings" &&
              results.map((meeting,i) => {
                return (
                  <Grid item xs={12} sm={12} md={8}>
                    <MeetingCard  key={meeting._id} variant="small"
                      authUsername={authUsername}
                      id={meeting._id}
                      author={meeting.author} 
                      createdAt={meeting.createdAt}
                      
                      title={meeting.title}
                      date={meeting.date}
                      duration={meeting.duration}
                      place={meeting.place}
                      initMembers={meeting.members}

                      isDeleted={meeting.isDeleted}
                      errorMessages={errorMessages} setErrorMessages={setErrorMessages}
                      />
                  </Grid>
                )}
              )
            }

            <Grid item xs={12} sm={12} md={8} container justify="center">
              <Pagination 
                page={pagination.currentPage} 
                count={pagination.maxPage} 
                onChange={handlePageChange} />
            </Grid>

          </Grid>
      </Container>
    </Box>
  )
}
  
export default Timeline
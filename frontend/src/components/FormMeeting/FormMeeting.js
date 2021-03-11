import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Button } from '@material-ui/core'
import { TextField, InputLabel, Select, MenuItem, FormControl } from '@material-ui/core'

import { meetingService } from '../../services/meetingService'
import { frontService } from '../../services/frontService'

// Variants: "register" and "edit"
function FormMeeting({ variant, formSuccess, setFormSuccess, formErrors, setFormErrors }){

  let { meetingId } = useParams()

  const [submitDisabled, setSubmitDisabled] = useState(false)
  const [frontOptions,   setFrontOptions]   = useState([])
  const [formData, setFormData]             = useState({
    id:   '', 
    title: '', 
    content: '',
    frontSlug: '',
    date: '',
    time: '',
    duration: '',
    place: '',
    membersOnly: true,
    // deleted: false,
  })

  useEffect(() => { 
    frontService.getOptions()
    .then( (s) => setFrontOptions(s))
    .catch((e) => { 
      setFormErrors(e) 
      setSubmitDisabled(true)
    })

    if(variant === "edit"){
      meetingService.getById(meetingId)
      .then(function(m) { 
        setFormData({ ...m, 
          frontSlug: m.front.slug,
          date: m.date.substr(0,10),
          time: m.date.substr(11,5)
        }) 
      })
      .catch(function(e) { 
        setFormErrors(e) 
        setSubmitDisabled(true)
      }) 
    }
  }, [meetingId, variant, setFormErrors])

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData({...formData, [name]: value})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    setFormErrors({})
    setFormSuccess({})
    setSubmitDisabled(true)

    // Transforming Datetime to Date Object and remove unused data
    let meeting = { ...formData, date: new Date(`${formData.date} ${formData.time}`) }
    delete meeting.time
    delete meeting.author
    delete meeting.front

    if ( isNaN(meeting.date.valueOf()) ) {
      setFormErrors({date: "Data ou Hora inválida!"})
      setSubmitDisabled(false)
      return;
    } else { meeting.date = meeting.date.toISOString() }
    
    if(variant === "register"){ 
      meetingService.register(meeting)
      .then(   function(s) { setFormSuccess(s) })
      .catch(  function(e) { setFormErrors(e) })     
      .finally(function( ) { setSubmitDisabled(false) })
    
    } else if(variant === "edit") { 
      meetingService.update(meetingId, meeting)
      .then(   function(s) { setFormSuccess(s) })
      .catch(  function(e) { setFormErrors(e) })     
      .finally(function( ) { setSubmitDisabled(false) }) 
    } 
  }

  return(
    <Grid item xs={12} container spacing={3} justify="center" 
      component="form" onSubmit={handleSubmit} style={{paddingLeft: 0, paddingRight: 0}}>

      <Grid className="FormSection" item xs={12} md={7}>

        <TextField variant="filled" fullWidth label="Título" name="title" value={formData.title}
          required inputProps={{maxLength:64}} error={!!formErrors.title} onChange={handleChange} />

        <TextField variant="filled" fullWidth label="Conteúdo e Informações Adicionais" name="content" value={formData.content}
          multiline rows={12} inputProps={{maxLength:1024}} error={!!formErrors.content} onChange={handleChange} />
        
      </Grid>

      <Grid className="FormSection" item xs={12} md={5}>

        <FormControl variant="filled" fullWidth error={formErrors.frontSlug}>
          <InputLabel id="LabelFront">Frente *</InputLabel>
          <Select labelId="LabelFront" label="Frente *" name="frontSlug" value={formData.frontSlug}
            required onChange={handleChange}>
              { frontOptions.map((f,i)=><MenuItem key={f.slug} value={f.slug}>{f.name}</MenuItem>) }
          </Select>
        </FormControl>
        
        <Grid container spacing={3}>
          <Grid item xs={6} style={{paddingTop: 0, paddingBottom: 0 }}>
          <TextField type="date" variant="filled" fullWidth label="Data" name="date" value={formData.date}
            required inputProps={{maxLength:64}} error={!!formErrors.date} onChange={handleChange} 
            InputLabelProps={{ shrink: true }} />
          </Grid>
          
          <Grid item xs={6} style={{paddingTop: 0, paddingBottom: 0 }}>
          <TextField type="time" variant="filled" fullWidth label="Horário" name="time" value={formData.time}
            required inputProps={{maxLength:64}} error={!!formErrors.date} onChange={handleChange} 
            InputLabelProps={{ shrink: true }}/>
          </Grid>
        </Grid>

        <TextField variant="filled" fullWidth label="Duração" name="duration" value={formData.duration}
          inputProps={{maxLength:64}} error={!!formErrors.duration} onChange={handleChange} />

        <TextField variant="filled" fullWidth label="Local" name="place" value={formData.place}
          inputProps={{maxLength:64}} error={!!formErrors.place} onChange={handleChange} />
        
        <FormControl variant="filled" fullWidth error={formErrors.membersOnly}>
          <InputLabel id="LabelMembersOnly">Visibilidade *</InputLabel>
          <Select labelId="LabelMembersOnly" label="Visibilidade *" name="membersOnly" value={formData.membersOnly}
            required onChange={handleChange}>
              <MenuItem value={false}>Todos os Usuários</MenuItem>
              <MenuItem value={true}>Apenas Membros Ativos</MenuItem>
          </Select>
        </FormControl>
        
        <Button variant="contained" size="large" fullWidth color="secondary"
          type="submit" disabled={submitDisabled}>
          <strong>{variant === "register" ? "Publicar Reunião" : "Salvar Alterações"}</strong>
        </Button>
      </Grid>

    </Grid>
  )
}

export default FormMeeting
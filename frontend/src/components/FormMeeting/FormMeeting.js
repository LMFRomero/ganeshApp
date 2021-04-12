import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Grid, Button } from '@material-ui/core'
import { TextField, InputLabel, Select, MenuItem, FormControl } from '@material-ui/core'

import { meetingService } from '../../services/meetingService'
import { frontService } from '../../services/frontService'
import DeleteDialog from '../../components/DeleteDialog/DeleteDialog'

// Variants: "register" and "edit"
function FormMeeting({ variant, formSuccess, setFormSuccess, formErrors, setFormErrors }){

  let { meetingId } = useParams()
  const history = useHistory()

  const [submitDisabled, setSubmitDisabled] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [frontOptions,   setFrontOptions]   = useState([])
  const [formData, setFormData]             = useState({
    _id:   '', 
    title: '', 
    content: '',
    frontSlug: '',
    date: '',
    time: '',
    duration: '',
    place: '',
    membersOnly: true,
    isDeleted: false,
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

        const ISOdate = new Date(m.date)
        setFormData({ ...m, 
          frontSlug: m.front.slug,
          date: `${ISOdate.getFullYear().toString().padStart(4, '0')}-${ISOdate.getMonth().toString().padStart(2, '0')}-${ISOdate.getDate().toString().padStart(2, '0')}`,
          time: `${ISOdate.getHours().toString().padStart(2, '0')}:${ISOdate.getMinutes().toString().padStart(2, '0')}`
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

    if ( (formData.date || formData.time) && isNaN(meeting.date.valueOf()) ) {
      setFormErrors({date: "Data ou Hora inválida!"})
      setSubmitDisabled(false)
      return;
    } else { 
      meeting.date = ( isNaN(meeting.date.valueOf()) ) ? "" : meeting.date.toISOString() 
    } 
    
    if(variant === "register"){ 
      meetingService.register(meeting)
      .then(   function(s) { history.push("/reunioes") })
      .catch(  function(e) { setFormErrors(e) })     
      .finally(function( ) { setSubmitDisabled(false) })
    
    } else if(variant === "edit") { 
      meetingService.update(meetingId, meeting)
      .then(   function(s) { setFormSuccess(s) })
      .catch(  function(e) { setFormErrors(e) })     
      .finally(function( ) { setSubmitDisabled(false) }) 
    } 
  }

  const handleDelete = (e) => {
    meetingService._delete(meetingId)
    .then( function(s) { history.push('/reunioes') })
    .catch(  function(e) { setFormErrors(e) })     
    .finally(function( ) { setSubmitDisabled(false) })
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
            inputProps={{maxLength:64}} error={!!formErrors.date} onChange={handleChange} 
            InputLabelProps={{ shrink: true }} />
          </Grid>
          
          <Grid item xs={6} style={{paddingTop: 0, paddingBottom: 0 }}>
          <TextField type="time" variant="filled" fullWidth label="Horário" name="time" value={formData.time}
            inputProps={{maxLength:64}} error={!!formErrors.date} onChange={handleChange} 
            InputLabelProps={{ shrink: true }}/>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={6} style={{paddingTop: 0, paddingBottom: 0 }}>
          <TextField variant="filled" fullWidth label="Duração" name="duration" value={formData.duration}
            inputProps={{maxLength:64}} error={!!formErrors.duration} onChange={handleChange} />
          </Grid>
          
          <Grid item xs={6} style={{paddingTop: 0, paddingBottom: 0 }}>
          <TextField variant="filled" fullWidth label="Local" name="place" value={formData.place}
          inputProps={{maxLength:64}} error={!!formErrors.place} onChange={handleChange} />
          </Grid>
        </Grid>

        <FormControl variant="filled" fullWidth error={formErrors.membersOnly}>
          <InputLabel id="LabelMembersOnly">Visibilidade *</InputLabel>
          <Select labelId="LabelMembersOnly" label="Visibilidade *" name="membersOnly" value={formData.membersOnly}
            required onChange={handleChange}>
              <MenuItem value={false}>Todos os Usuários</MenuItem>
              <MenuItem value={true}>Apenas Membros Ativos</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="filled" fullWidth error={formErrors.isDeleted}>
          <InputLabel id="LabelStatus">Status *</InputLabel>
          <Select labelId="LabelStatus" label="Status *" name="isDeleted" value={formData.isDeleted}
            required onChange={handleChange}>
              <MenuItem value={false}>Reunião Ativa</MenuItem>
              <MenuItem value={true}>Reunião Desativada</MenuItem>
          </Select>
        </FormControl>
        
        <Button variant="contained" size="large" fullWidth color="secondary"
          type="submit" disabled={submitDisabled}>
          <strong>{variant === "register" ? "Publicar Reunião" : "Salvar Alterações"}</strong>
        </Button>

        { variant === "edit" && 
        <Button variant="contained" size="large" fullWidth color="primary"
          onClick={() => setShowDeleteDialog(true)} >
          <strong>Excluir Reunião</strong>
        </Button>
        }

        { variant === "edit" && 
        <DeleteDialog 
          title="Excluir Reunião" 
          securityString={`reuniao-${formData._id.substr(0,6)}`}  
          successCallback={handleDelete}
          
          showDialog={showDeleteDialog} setShowDialog={setShowDeleteDialog}
          submitDisabled={submitDisabled} setSubmitDisabled={setSubmitDisabled}
          formSuccess={formSuccess} setFormSuccess={setFormSuccess} 
          formErrors={formErrors} setFormErrors={setFormErrors}
        />
        }
      </Grid>

    </Grid>
  )
}

export default FormMeeting
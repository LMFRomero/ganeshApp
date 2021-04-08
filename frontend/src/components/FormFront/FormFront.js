import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Grid, Button, FormControl, Select, MenuItem, InputLabel, TextField } from '@material-ui/core'

import { frontService } from '../../services/frontService'
import DeleteDialog from '../../components/DeleteDialog/DeleteDialog'

// Variants: "register" and "edit"
function FormFront({ variant, formSuccess, setFormSuccess, formErrors, setFormErrors }){

  let { frontId } = useParams()
  const history   = useHistory();

  const [submitDisabled, setSubmitDisabled] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [formData, setFormData]             = useState({
    _id:   '',
    name: '',
    description: '',
    slug: '',
    type: 'study',
    membersOnly: true,
    isDeleted: false,
  })

  useEffect(() => { 
    if(variant === "edit"){
      frontService.getById(frontId)
      .then(function(u) { setFormData(u) })
      .catch(  function(e) { 
        setFormErrors(e) 
        setSubmitDisabled(true)
      }) 
    }
  }, [frontId, variant, setFormErrors])


  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData({...formData, [name]: value})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    setFormErrors({})
    setFormSuccess({})
    // setSubmitDisabled(true)

    if(!formData.slug.match(/^[a-zA-Z0-9-]{3,16}$/)){
      setFormErrors({repeatPassword: "Slug inválido! Use apenas alfanuméricos e traços!"})
      setSubmitDisabled(false)
      return;
    }
    
    if(variant === "register"){ 
      frontService.register(formData)
      .then(   function(s) { history.push("/frentes") })
      .catch(  function(e) { setFormErrors(e) })     
      .finally(function( ) { setSubmitDisabled(false) })
    
    } else if(variant === "edit") { 
      frontService.update(frontId, formData)
      .then(   function(s) { setFormSuccess(s) })
      .catch(  function(e) { setFormErrors(e) })     
      .finally(function( ) { setSubmitDisabled(false) }) 
    } 
  }

  const handleDelete = (e) => {
    frontService._delete(frontId)
    .then( function(s) { history.push('/frentes') })
    .catch(  function(e) { setFormErrors(e) })     
    .finally(function( ) { setSubmitDisabled(false) })
  }

  return(
    <Grid item xs={12} container spacing={3} justify="center" 
      component="form" onSubmit={handleSubmit} style={{paddingLeft: 0, paddingRight: 0}}>

      <Grid item className="FormSection" xs={12} md={7}>
        
        <TextField variant="filled" fullWidth label="Nome da Frente" name="name" value={formData.name}
          required inputProps={{maxLength:32}} error={!!formErrors.name} onChange={handleChange} />

        <TextField variant="filled" fullWidth label="Descrição e Informações Adicionais" name="description" value={formData.description}
          multiline rows={8} inputProps={{maxLength:512}} error={!!formErrors.description} onChange={handleChange} />
      
      </Grid>

      <Grid item className="FormSection" xs={12} md={5}>

        <TextField variant="filled" fullWidth label="URL Slug" name="slug" value={formData.slug}
          required inputProps={{minLength:3, maxLength:16}} error={!!formErrors.slug} onChange={handleChange} />

        <FormControl variant="filled" fullWidth error={formErrors.type}>
          <InputLabel id="LabelType">Tipo de Frente *</InputLabel>
          <Select labelId="LabelType" label="Tipo de Frente *" name="type" value={formData.type}
            required onChange={handleChange}>
              <MenuItem value="study">Frente de Estudos (Listável)</MenuItem>
              <MenuItem value="special">Frente Especial (Listável)</MenuItem>
              <MenuItem value="internal">Frente Interna (Não Listável)</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="filled" fullWidth error={formErrors.membersOnly}>
          <InputLabel id="LabelMembersOnly">Visibilidade *</InputLabel>
          <Select labelId="LabelMembersOnly" label="Visibilidade *" name="membersOnly" value={formData.membersOnly}
            required onChange={handleChange}>
              <MenuItem value={true}>Apenas Membros Ativos</MenuItem>
              <MenuItem value={false}>Todos os Usuários</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl variant="filled" fullWidth error={formErrors.isDeleted}>
          <InputLabel id="LabelStatus">Status *</InputLabel>
          <Select labelId="LabelStatus" label="Status *" name="isDeleted" value={formData.isDeleted}
            required onChange={handleChange}>
              <MenuItem value={false}>Frente Ativa</MenuItem>
              <MenuItem value={true}>Frente Desativada</MenuItem>
          </Select>
        </FormControl>
        
        <Button variant="contained" size="large" fullWidth color="secondary"
          type="submit" disabled={submitDisabled}>
          <strong>{variant === "register" ? "Publicar Frente" : "Salvar Alterações"}</strong>
        </Button>
        
        { variant === "edit" && 
        <Button variant="contained" size="large" fullWidth color="primary"
          onClick={() => setShowDeleteDialog(true)} >
          <strong>Excluir Frente</strong>
        </Button>
        }

        { variant === "edit" && 
        <DeleteDialog 
          title="Excluir Frente" 
          securityString={formData.slug}  
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

export default FormFront
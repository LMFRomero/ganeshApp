import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, IconButton, Typography } from '@material-ui/core'
import { DataGrid } from '@material-ui/data-grid';
import './Users.css'

import { userService } from '../../../services/userService'
import SnackAlerts from '../../../components/SnackAlerts/SnackAlerts'

import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

const columns = [
  { field: 'id',       headerName: '#',        width: 100},
  { field: 'username', headerName: 'Apelido',  width: 160, flex: 1 },
  { field: 'email',    headerName: 'E-mail',   width: 160, flex: 1 },
  { field: 'title',    headerName: 'Título',   width: 160},
  { field: 'yearJoinGanesh', headerName: 'Ingresso', width: 140},
  { field: 'status',   headerName: 'Ativo',    width: 120, 
    renderCell: (params) => ( 
      <>
        { params.value === true  && <CheckIcon color="primary"/>}
        { params.value === false && <ClearIcon color="secondary"/>}
      </>
  )},
  { field: 'linkPath', headerName: 'Editar', width: 120, 
    renderCell: (params) => ( 
      <IconButton color="primary" component={RouterLink} to={`/usuario/${params.value}`}>
        <EditIcon/>
      </IconButton>
  )},
]

function Users(){

  const [formSuccess, setFormSuccess] = useState({})
  const [formErrors, setFormErrors]   = useState({})
  const [rows, setRows]               = useState([])

  const userToRow = (user, index) => { 
    return { ...user, id: index, linkPath: user.id, status: true }
  }

  useEffect(() => { 
    userService.getAll()
    .then( function(u) { setRows(u.map(userToRow)) })
    .catch(  function(e) { setFormErrors(e) }) 
  }, [])


  return(
    <Box className="UsersPage" flexGrow={1} component="main">
      <Container fixed>
          <Grid container spacing={3} justify="center">

            <SnackAlerts formSuccess={formSuccess} setFormSuccess={setFormSuccess} 
                formErrors={formErrors} setFormErrors={setFormErrors}/>

            <Grid item xs={12} md={12}>
                <Typography variant="h3">Usuários</Typography>
            </Grid>
            
            <Grid className="UsersTable" item xs={12} md={12}>
              <DataGrid rows={rows} columns={columns} pageSize={5} disableColumnSelector/>
            </Grid>

          </Grid>
      </Container>
    </Box>
  )
}

export default Users
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, IconButton, Typography } from '@material-ui/core'
import { DataGrid } from '@material-ui/data-grid';
import './Requests.css'

import { requestService } from '../../../services/requestService'
import SnackAlerts from '../../../components/SnackAlerts/SnackAlerts'

import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

const columns = [
  { field: 'id',       headerName: '#',        width: 100},
  { field: 'username', headerName: 'Apelido',  width: 160, flex: 1 },
  { field: 'email',    headerName: 'E-mail',   width: 160, flex: 1 },
  { field: 'name',    headerName:  'Nome',     width: 240},
  { field: 'yearJoinGanesh', headerName: 'Ingresso', width: 140},

  { field: 'requestStatus', headerName: 'Opções',  width: 120, 
    renderCell: (params) => { 
      if( params.value === true ) { 
        return(<IconButton color="primary"><CheckIcon/></IconButton>)
      } else if(params.value === false ) { 
        return(<IconButton color="secondary"><ClearIcon/></IconButton>)
      
      } else {
        return (
          <>
            <IconButton onClick={() => params.row.handler({ email: params.row.email, accept: true})}  color="primary"><CheckIcon/></IconButton>
            <IconButton onClick={() => params.row.handler({ email: params.row.email, accept: false})} color="secondary"><ClearIcon/></IconButton>
          </>
        )
      }
    }
  },
  { field: 'linkPath', headerName: 'Editar', width: 120, 
    renderCell: (params) => ( 
      <IconButton color="primary" component={RouterLink} to={`/usuario/${params.value}`}>
        <EditIcon/>
      </IconButton>
  )},
]

function Requests(){

  const [formSuccess, setFormSuccess] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const [submitDisabled, setSubmitDisabled] = useState(false)
  const [rows, setRows] = useState([])
  const [rowChange, setRowChange] = useState(undefined)

  const userToRow = (user, index) => { 
    return { ...user, 
      id: index, 
      linkPath: user._id, 
      requestStatus: undefined, 
      handler: setRowChange, 
    }
  }

  useEffect(() => { 
    requestService.getAll()
    .then( function(u) { setRows(u.map(userToRow)) })
    .catch(  function(e) { setFormErrors(e) }) 
  }, [])

  useEffect(() => { 
    if(typeof(rowChange) === "object" && submitDisabled === false){
      
      setSubmitDisabled(true)
      let reqPromise = (rowChange.accept) ? requestService.acceptUser(rowChange.email) : requestService.rejectUser(rowChange.email) 
      
      reqPromise
      .then( function(s) {  

        setFormSuccess(s)
        setRows(rows.map((u) => { 
          if(rowChange.email === u.email)
            u.requestStatus = rowChange.accept
          return u
        }))

      })
      .catch( function(e) { setFormErrors(e) }) 
      .finally(function() { 
        setSubmitDisabled(false)
        setRowChange(undefined)
      })

    }
  }, [rowChange])

  return(
    <Box className="RequestsPage" flexGrow={1} component="main">
      <Container fixed>
          <Grid container spacing={3} justify="center">

            <SnackAlerts formSuccess={formSuccess} setFormSuccess={setFormSuccess} 
                formErrors={formErrors} setFormErrors={setFormErrors}/>

            <Grid item xs={12} md={12}>
                <Typography variant="h3">Solicitações Pendentes</Typography>
            </Grid>

            <Grid className="RequestsTable" item xs={12} md={12}>
              <DataGrid rows={rows} columns={columns} pageSize={5} disableColumnSelector/>
            </Grid>

          </Grid>
      </Container>
    </Box>
  )
}

export default Requests
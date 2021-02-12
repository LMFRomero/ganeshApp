import { Box, Container, Grid, IconButton, Typography } from '@material-ui/core'
import { DataGrid } from '@material-ui/data-grid';
import './Users.css'

import { Link as RouterLink } from 'react-router-dom';

import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

const columns = [
  { field: 'id',       headerName: 'ID',       width: 100},
  { field: 'nickname', headerName: 'Apelido',  width: 160, flex: 1 },
  { field: 'mail',     headerName: 'E-mail',   width: 160, flex: 1 },
  { field: 'title',    headerName: 'Título',   width: 160},
  { field: 'joinYear', headerName: 'Ingresso', width: 140},
  { field: 'active',   headerName: 'Ativo',    width: 120, 
    renderCell: (params) => ( 
      <>
        { params.value === true  && <CheckIcon/>}
        { params.value === false && <ClearIcon/>}
      </>
    )},
  { field: 'linkPath', headerName: 'Editar', width: 120, 
    renderCell: (params) => ( 
      <IconButton component={RouterLink} to={`/usuario/${params.value}`}>
        <EditIcon/>
      </IconButton>
    )},
]

const rows = [
  { nickname: "Gabriel" },  
  { nickname: "Bob" },      
  { nickname: "Hinata" },   
  { nickname: "Guarulhos" },
  { nickname: "Noice" },    
  { nickname: "Vivian" },   
  { nickname: "Carlos" },   
  { nickname: "Susu" },     
  { nickname: "Sora" },     
  { nickname: "Riku" },     
  { nickname: "Kairi" },    
  { nickname: "Ventus" },   
  { nickname: "Aqua" },     
  { nickname: "Terra" },    
  { nickname: "Larxene" },  
  { nickname: "Lea" },      
  { nickname: "Xenahort" }, 
  { nickname: "Mickey" },   
  { nickname: "Ava" }      
].map((v,i) => {
  return {
  id: i+1, 
  nickname: v.nickname,
  mail: v.nickname + "@gmail.com",
  title: "Membro",
  joinYear: (2016+(i%5)).toString(),
  active: (i%3 !== 0),
  linkPath: i+1,
}})


function Users(){
  return(
    <Box className="UsersPage" flexGrow={1} component="main">
      <Container fixed>
          <Grid container spacing={3} justify="center">

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
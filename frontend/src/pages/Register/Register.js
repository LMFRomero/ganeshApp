import { Box, Container, Grid, Button, Typography } from '@material-ui/core'
import { TextField, InputLabel, Select, MenuItem, FormControl, Checkbox, FormControlLabel } from '@material-ui/core'
import './Register.css'

import { Link as RouterLink } from 'react-router-dom';

import OrDivider from '../../components/OrDivider/OrDivider'

function Register(){
  return(
    <Box className="RegisterPage" flexGrow={1}>
      <Container fixed>
        <form classname="RegisterForm">
          <Grid container spacing={6} justify="center">
            
            <Grid className="RegisterSection" item xs={12} sm={6} md={4}>
              <Typography variant="h5">
                <strong>Dados Pessoais</strong>
              </Typography>

              <TextField variant="outlined" fullWidth label="Nome completo" required/>

              <TextField variant="outlined" fullWidth label="Apelido ou Primeiro Nome" required/>
              
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="LabelCurso">Curso atual</InputLabel>
                <Select labelId="LabelCurso" label="Curso atual">
                  <MenuItem value="BCC">Ciências da Computação </MenuItem>
                  <MenuItem value="EngComp">Engenharia da Computação</MenuItem>
                  <MenuItem value="BSI">Sistemas de Informação</MenuItem>
                  <MenuItem value="Nenhum">Nenhum</MenuItem>
                  <MenuItem value="Outro">Outro curso</MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="outlined" fullWidth>
                <InputLabel id="LabelCurso">Instituição</InputLabel>
                <Select labelId="LabelCurso" label="Instituição">
                  <MenuItem value="ICMC">USP - ICMC</MenuItem>
                  <MenuItem value="EESC">USP - EESC</MenuItem>
                  <MenuItem value="IFSC">USP - IFSC</MenuItem>
                  <MenuItem value="IQSC">USP - IQSC</MenuItem>
                  <MenuItem value="UFSCAR">UFSCAR</MenuItem>
                  <MenuItem value="Nenhuma">Nenhuma</MenuItem>
                  <MenuItem value="Outra">Outra instituição</MenuItem>
                </Select>
              </FormControl>

              <TextField variant="outlined" fullWidth label="Número USP"/>
            </Grid>


            <Grid className="RegisterSection" item xs={12} sm={6} md={4}>
              <Typography variant="h5">
                <strong>Dados de Acesso</strong>
              </Typography>

              <TextField variant="outlined" fullWidth label="E-mail" required/>
              
              <TextField variant="outlined" fullWidth label="Senha" type="password" required/>

              <TextField variant="outlined" fullWidth label="Confirmar senha" type="password" required/>
              
              <FormControlLabel label="Pretendo participar do PInG 2021" 
                control={
                  <Checkbox color="primary" name="PingParticipant" />
              }/>

              <Button variant="contained" size="large" fullWidth color="secondary">
                <strong>Criar Conta</strong>
              </Button>

            </Grid>

            <Grid item xs={12}>
              <OrDivider/>

              <Button className="BtnEntrar" variant="contained" size="large" fullWidth color="primary"
                component={RouterLink} to="/fazer-login">
                <strong>Já possuo uma conta</strong>
              </Button>
            </Grid>

          </Grid>
        </form>
      </Container>
    </Box>
  )
}

export default Register
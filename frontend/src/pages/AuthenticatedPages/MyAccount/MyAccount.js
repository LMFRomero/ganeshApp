import { Box, Container, Grid, Button, Typography } from '@material-ui/core'
import { TextField, InputLabel, Select, MenuItem, FormControl, Checkbox, FormControlLabel } from '@material-ui/core'
import './MyAccount.css'

function MyAccount(){
  return(
    <Box className="MyAccountPage" flexGrow={1} component="main">
      <Container fixed>
          <Grid container spacing={3} justify="center">

            <Grid item xs={12}>
                <Typography variant="h3">Minha conta</Typography>
            </Grid>

            <Grid component="form" className="FormSection" item xs={12} sm={12} md={6}>
              <Typography variant="h5">
                <strong>Editar Dados Pessoais</strong>
              </Typography>

              <TextField variant="outlined" fullWidth label="Nome completo" required
                value="Gabriel Van Loon Bodê da Costa Dourado Fuentes Rojas"/>

              <TextField variant="outlined" fullWidth label="Apelido ou Primeiro Nome" required
                value="Gabriel Van Loon"/>
              
              <TextField variant="outlined" fullWidth label="E-mail" required
                value="gabrielvanloon@usp.br"/>
              
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="LabelCourse">Curso atual</InputLabel>
                <Select labelId="LabelCourse" label="Curso atual" value="BCC">
                  <MenuItem value="BCC" selected>Ciências da Computação </MenuItem>
                  <MenuItem value="EngComp">Engenharia da Computação</MenuItem>
                  <MenuItem value="BSI">Sistemas de Informação</MenuItem>
                  <MenuItem value="Nenhum">Nenhum</MenuItem>
                  <MenuItem value="Outro">Outro curso</MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="outlined" fullWidth>
                <InputLabel id="LabelInstitute">Instituição</InputLabel>
                <Select labelId="LabelInstitute" label="Instituição" value="ICMC">
                  <MenuItem value="ICMC">USP - ICMC</MenuItem>
                  <MenuItem value="EESC">USP - EESC</MenuItem>
                  <MenuItem value="IFSC">USP - IFSC</MenuItem>
                  <MenuItem value="IQSC">USP - IQSC</MenuItem>
                  <MenuItem value="UFSCAR">UFSCAR</MenuItem>
                  <MenuItem value="Nenhuma">Nenhuma</MenuItem>
                  <MenuItem value="Outra">Outra instituição</MenuItem>
                </Select>
              </FormControl>

              <TextField variant="outlined" fullWidth label="Número USP" value="12345679"/>

              <Button variant="contained" size="large" fullWidth color="primary">
                <strong>Salvar alterações</strong>
              </Button>
            </Grid>
            
            <Grid component="form" className="FormSection" item xs={12} sm={12} md={6}>
              <Typography variant="h5">
                <strong>Informações da Conta</strong>
              </Typography>
              
              <Typography>
                  <strong>Situação da conta: </strong>  Registro aprovado. <br/>
                  <strong>Título da conta:</strong>     Membro ativo
              </Typography>
            
              <Typography>
              <Button variant="contained" size="large" fullWidth color="primary">
                <strong>Excluir cadastro</strong>
              </Button>
              </Typography>

              <Typography variant="caption">
                  *Atenção, esta ação não é reversível.
              </Typography>

                {/* Form Starts here */}
              <Typography variant="h5">
                <strong>Alterar Senha</strong>
              </Typography>
              
              <TextField variant="outlined" fullWidth label="Senha atual" type="password" required/>

              <TextField variant="outlined" fullWidth label="Nova senha" type="password" required/>

              <TextField variant="outlined" fullWidth label="Confirmar nova senha" type="password" required/>
              
              <Button variant="contained" size="large" fullWidth color="secondary">
                <strong>Confirmar alteração</strong>
              </Button>
            </Grid>

          </Grid>
      </Container>
    </Box>
  )
}

export default MyAccount
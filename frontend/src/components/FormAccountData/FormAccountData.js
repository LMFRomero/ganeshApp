import { Box, Button, Typography, Table, TableBody, TableRow, TableCell } from '@material-ui/core'
// import { TextField, InputLabel, Select, MenuItem, FormControl } from '@material-ui/core'

// Variants: 'normal' and 'coorditator'
function FormAccountData(props){
  return(
    <Box className="FormSection" component="form">
      <Typography variant="h5">
        <strong>Informações da Conta</strong>
      </Typography>
      
      <Table size="small">
        <TableBody>
          <TableRow>
              <TableCell padding="none"><strong>Situação da conta:</strong></TableCell>
              <TableCell>Cadastro aprovado</TableCell>
          </TableRow>
          <TableRow>
              <TableCell padding="none"><strong>Título da conta:</strong></TableCell>
              <TableCell>Membro ativo</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    
      <Typography>
      <Button variant="contained" size="large" fullWidth color="primary">
        <strong>Excluir cadastro</strong>
      </Button>
      </Typography>

      <Typography variant="caption">
          *Atenção, esta ação não é reversível.
      </Typography>
    </Box>
  )
}

export default FormAccountData
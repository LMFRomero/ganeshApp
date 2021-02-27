import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

function SnackAlerts({formSuccess, formErrors, setFormSuccess, setFormErrors}) { 
    
  return (
    <>
      { /* Render Form Errors */ 
        Object.keys(formErrors).map((key,index) => {
          if(formErrors[key] !== undefined)
            return (
              <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={true}>
                <Alert severity="error" key={index}
                  onClose={() => setFormErrors({ ...formErrors, [key]:undefined })}>
                  {formErrors[key]}
                </Alert>
              </Snackbar>
            )
          else return <></>
        }) 
      }

      { /* Render Form Success */ 
        Object.keys(formSuccess).map((key,index) => {
          if(formSuccess[key] !== undefined)
            return (
              <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={true}>
                <Alert severity="success" key={index}
                  onClose={() => setFormSuccess({ ...formSuccess, [key]:undefined })}>
                  {formSuccess[key]}
                </Alert>
              </Snackbar>
            )
          else return <></>
        }) 
      }
    </>
  )
}

export default SnackAlerts
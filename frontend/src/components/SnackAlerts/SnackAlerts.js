import { useState, useEffect } from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import "./SnackAlerts.css"


function SnackAlerts({formSuccess, formErrors, setFormSuccess, setFormErrors}) { 
  
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen( (Object.keys(formSuccess).length || Object.keys(formErrors).length) > 0 )
  }, [formSuccess, formErrors])

  return (
    <Snackbar className="SnackAlerts" anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={isOpen}>
      <div>
        { /* Render Form Errors */ 
          Object.keys(formErrors).map((key,index) => {
            if(formErrors[key] !== undefined)
              return (
                <Alert severity="error" key={index}
                  onClose={() => setFormErrors({ ...formErrors, [key]:undefined })}>
                  {formErrors[key]}
                </Alert>
              )
            else return <></>
          }) 
        }

        { /* Render Form Success */ 
          Object.keys(formSuccess).map((key,index) => {
            if(formSuccess[key] !== undefined)
              return (
                <Alert severity="success" key={index}
                  onClose={() => setFormSuccess({ ...formSuccess, [key]:undefined })}>
                  {formSuccess[key]}
                </Alert>
              )
            else return <></>
          }) 
        }
      </div>
    </Snackbar>
  )
}

export default SnackAlerts
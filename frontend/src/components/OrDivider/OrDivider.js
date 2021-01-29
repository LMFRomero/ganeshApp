import { Typography } from '@material-ui/core'
import './OrDivider.css'

function OrDivider() {
  return(
    <Typography className="OrDivider" align="center">
      <span className="BackLine LeftLine"> </span>
        ou
      <span className="BackLine RightLine"> </span>
    </Typography>
  )
}

export default OrDivider
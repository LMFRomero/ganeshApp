import { useHistory } from 'react-router-dom';
import { Hidden } from '@material-ui/core';
import './GlitchHop.css'

// import ClipWelcomeMobile from '../../assets/videos/clip_welcome_mobile.mp4'
import ClipWelcomeDesktop from '../../assets/videos/clip_welcome_desktop.mp4'

function GlitchHop() {

  const history = useHistory();

  const handleEnd = () => {
    history.push("/reunioes")
  }

  return (
    <>
      <Hidden smDown>
        <video className="GlitchHop-Video GlitchHop-Desktop" autoPlay muted={true} onEnded={handleEnd}>
          <source src={ClipWelcomeDesktop} type="video/mp4" />
        </video>
      </Hidden>

      <Hidden mdUp>
        <video className="GlitchHop-Video GlitchHop-Mobile" autoPlay muted={true} onEnded={handleEnd}>
          <source src={ClipWelcomeDesktop} type="video/mp4" />
        </video>
      </Hidden>
    </>

    
  )
}

export default GlitchHop
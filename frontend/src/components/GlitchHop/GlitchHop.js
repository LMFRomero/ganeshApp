import { useHistory } from 'react-router-dom';
import './GlitchHop.css'

import ClipWelcome from '../../assets/videos/clip_welcome.mp4'

function GlitchHop() {

  const history = useHistory();

  const handleEnd = () => {
    history.push("/reunioes")
  }

  return (
    <video className="GlitchHop-Video" autoPlay muted={true} onEnded={handleEnd}>
      <source src={ClipWelcome} type="video/mp4" />
    </video>
  )
}

export default GlitchHop
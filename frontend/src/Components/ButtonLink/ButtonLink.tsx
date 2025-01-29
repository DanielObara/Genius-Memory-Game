import { Link } from 'react-router-dom';
import { Button } from './ButtonLinkTypes';
import './ButtonLink.css'

const ButtonLink = ({ buttontext,to ,id}: Button) => {
  return (
    <div>
      <Link to={to} id={id} className="Link">
        {buttontext}
      </Link>
    </div>
  );
}

export default ButtonLink;

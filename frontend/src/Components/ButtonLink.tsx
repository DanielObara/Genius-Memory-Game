import { Link } from 'react-router-dom';
import '../Styles/ButtonLink.css'
interface Button {
  buttontext: string;
  to:string
  id:string
}

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

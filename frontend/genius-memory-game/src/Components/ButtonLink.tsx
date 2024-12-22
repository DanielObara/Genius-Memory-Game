import { Link } from 'react-router-dom';
import '../Styles/ButtonLink.css'
interface Button {
  buttontext: string;
  to:string
}

function ButtonLink({ buttontext,to }: Button) {
  return (
    <div>
      <Link to={to} className="Link">
        {buttontext}
      </Link>
    </div>
  );
}

export default ButtonLink;

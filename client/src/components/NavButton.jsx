import { useNavigate } from "react-router-dom";
import arrowIcon from "../assets/chevron-right-svgrepo-com.svg";

function NavButton(props) {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(props.navTo)}>
      <img className="icon" src={arrowIcon} alt="arrow icon" />
      {props.text}
    </button>
  );
}

export default NavButton;

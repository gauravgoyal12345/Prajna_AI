import React from 'react';
import { Link } from 'react-router-dom';
import '../Style/RoundedButton.css'; // You can use a separate CSS file or inline styling

const RoundedButton = (props) => {
  const {routeLink, label, onClick} = props;
    return (
    <Link to={routeLink} className="rounded-button">
      {label}
    </Link>
  );
};

export default RoundedButton;

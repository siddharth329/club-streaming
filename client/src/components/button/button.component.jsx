import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './button.styles.scss';

const Button = ({ to, children, variant }) => {
	return (
		<Link
			to={to}
			className={`button ${variant === 'ghost' ? 'button--ghost' : 'button--fill'}`}
		>
			{children}
		</Link>
	);
};

Button.propTypes = {
	to: PropTypes.string.isRequired,
	children: PropTypes.element.isRequired
};

export default Button;

import React from 'react';
import PropTypes from 'prop-types';

import './button-slider.styles.scss';

const ButtonSlider = ({ state, setChange }) => {
	return (
		<div className="buttonslider">
			<div
				className={`buttonslider__label ${state && 'checked'}`}
				onClick={() => setChange(!state)}
			>
				<span>&nbsp;</span>
			</div>
		</div>
	);
};

ButtonSlider.propTypes = {
	state: PropTypes.bool.isRequired,
	setChange: PropTypes.func.isRequired
};

export default ButtonSlider;

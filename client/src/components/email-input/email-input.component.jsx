import React from 'react';

import './email-input.styles.scss';

const EmailInput = ({ value, setValue }) => {
	return (
		<div className="emailinput__input-container">
			<div className="emailinput__icon-box">
				<i className="fal fa-user" />
			</div>
			<div className="emailinput__input-wrapper">
				<input
					className="emailinput__input"
					type="text"
					name="email"
					id="email"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					autoComplete="off"
				/>
				<label
					className={`emailinput__label ${value && 'emailinput__label--focused'}`}
					htmlFor="email"
				>
					Email
				</label>
			</div>
		</div>
	);
};

export default EmailInput;

import React, { useState } from 'react';

import './password-input.styles.scss';

const PasswordInput = ({ value, setValue }) => {
	const [ showPassword, setShowPassword ] = useState(false);

	return (
		<div className="passwordinput__input-container">
			<div className="passwordinput__icon-box">
				<i className="fal fa-lock-alt" />
			</div>
			<div className="passwordinput__input-wrapper">
				<input
					className="passwordinput__input input-pass"
					type={`${showPassword ? 'text' : 'password'}`}
					name="password"
					id="password"
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				<label
					className={`passwordinput__label ${value && 'passwordinput__label--focused'}`}
					htmlFor="password"
				>
					Password
				</label>
			</div>
			<div className="passwordinput__password-visibility">
				{showPassword ? (
					<i onClick={() => setShowPassword(false)} className="far fa-eye-slash" />
				) : (
					<i onClick={() => setShowPassword(true)} className="far fa-eye" />
				)}
			</div>
		</div>
	);
};

export default PasswordInput;

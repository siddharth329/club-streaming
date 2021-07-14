import React from 'react';
import './form.styles.scss';
const Form = ({ children, onFormSubmit }) => {
	return (
		<form className="form" onSubmit={onFormSubmit}>
			{children}
		</form>
	);
};

export default Form;

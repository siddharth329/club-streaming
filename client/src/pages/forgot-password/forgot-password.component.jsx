import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Form from '../../containers/form';
import EmailInput from '../../components/email-input';

import './forgot-password.styles.scss';

const ForgotPassword = () => {
	const [ email, setEmail ] = useState('');
	const [ loading, setLoading ] = useState(false);

	const onFormSubmit = async (event) => {
		event.preventDefault();
		setLoading(true);
		try {
			const { data: { msg } } = await axios.post('/api/user/forgotPassword', { email });
			alert(msg);
			setLoading(false);
		} catch (error) {
			alert(error.response ? error.response.data.errors[0].msg : error.message);
			setLoading(false);
		}
	};

	return (
		<div className="forgotpassword">
			<Link to="/login" className="forgotpassword__goback">
				Go Back
			</Link>

			{loading ? (
				<div>Loading</div>
			) : (
				<React.Fragment>
					<Form onFormSubmit={onFormSubmit}>
						<div className="forgotpassword__header">
							<h1>
								<strong>Forgot</strong> Password
							</h1>
						</div>

						<EmailInput value={email} setValue={setEmail} />

						<button type="submit" className="login__btn">
							Click here to Reset Password
						</button>
					</Form>
				</React.Fragment>
			)}
		</div>
	);
};

export default ForgotPassword;

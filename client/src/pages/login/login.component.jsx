import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Form from '../../containers/form';
import EmailInput from '../../components/email-input';
import PasswordInput from '../../components/password-input';
import ButtonSlider from '../../components/button-slider';

import './login.styles.scss';

const Login = () => {
	const [ password, setPassword ] = useState('');
	const [ email, setEmail ] = useState('');
	const [ rememberMe, setRememberMe ] = useState(true);

	const onFormSubmit = async (event) => {
		event.preventDefault();

		try {
			const { data } = await axios.post(
				'/api/user/login',
				{ email, password },
				{ withCredentials: true }
			);
			console.log(data);
		} catch (error) {
			setPassword('');
		}
	};

	return (
		<div className="login">
			<Form onFormSubmit={onFormSubmit}>
				<div className="login__header">
					<h1>
						Sign In to <strong>ClubX Streaming</strong>
					</h1>
				</div>

				<EmailInput value={email} setValue={setEmail} />

				<PasswordInput value={password} setValue={setPassword} />

				<div className="login__options">
					<div className="login__remember">
						<ButtonSlider state={rememberMe} setChange={setRememberMe} />
						<div style={{ marginLeft: '1rem' }}>Remember Me</div>
					</div>

					<div>
						<Link to="/forgot-password">Forgot Password?</Link>
					</div>
				</div>

				<button type="submit" className="login__btn">
					Click here to Login
				</button>
			</Form>

			<div className="login__redirect-signup">
				Don't have an account? <Link to="/signup">SignUp Now</Link>
			</div>
		</div>
	);
};

export default Login;

// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css'; 

function Login({ onLogin }) {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', { email: loginEmail, password: loginPassword });
            if (response.data.success) {
                onLogin();
                navigate('/dashboard');
            } else {
                setErrorMessage('Invalid email or password');
            }
        } catch (error) {
            setErrorMessage(error.response?.data.message || 'Login failed, please try again.');
        }
    };

    const handleRegistration = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/register', { name: registerName, email: registerEmail, password: registerPassword });
            if (response.status === 201) {
                setErrorMessage('Registration successful! Please log in.');
            }
        } catch (error) {
            setErrorMessage(error.response?.data.message || 'Registration failed, please try again.');
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
                <button type="submit">Login</button>
                <p>{errorMessage}</p>
            </form>

            <h1>Register</h1>
            <form onSubmit={handleRegistration}>
                <input type="text" placeholder="Name" value={registerName} onChange={e => setRegisterName(e.target.value)} required />
                <input type="email" placeholder="Email" value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} required />
                <button type="submit">Register</button>
                <p>{errorMessage}</p>
            </form>
        </div>
    );
}

export default Login;
import React, { useState } from 'react';
import './Login.css';
import assests from '../../assets/assets';
import { signup, login, resetPass } from '../../config/firebase';

function Login() {
  const [currState, setCurrState] = useState("Sign up");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Guest credentials
  const guestEmail = "mukul@gmail.com";
  const guestPassword = "12345678";
  const guestEmail2 = "shu@gmail.com";
  const guestPassword2 = "12345678";

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (currState === "Sign up") {
      // Pass username, email, and password to signup function
      signup(userName, email, password);
    } else {
      login(email, password);
    }
  };

  const guestLoginHandler = () => {
    login(guestEmail, guestPassword);
  };

  const guestLoginHandler2 = () => {
    login(guestEmail2, guestPassword2);
  };

  return (
    <div className='login'>
      <img src={assests.logo_big} alt="" className='logo' />
      <form onSubmit={onSubmitHandler} className='login-form'>
        <h2>{currState}</h2>
        {currState === "Sign up" ? (
          <input
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            type="text"
            placeholder='Username'
            className="form-input"
            required
          />
        ) : null}
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder='Email address'
          className="form-input"
          required
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder='Password'
          className="form-input"
          required
        />
        <button type='submit'>
          {currState === "Sign up" ? "Create account" : "Login now"}
        </button>

        <div className="login-term">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy</p>
        </div>
        <div className="login-forgot">
          {currState === "Sign up" ? (
            <p className='login-toggle'>
              Already have an account{' '}
              <span onClick={() => setCurrState("Login")}>click here</span>
            </p>
          ) : (
            <p className='login-toggle'>
              Create an account{' '}
              <span onClick={() => setCurrState("Sign up")}>click here</span>
            </p>
          )}
          {currState === "Login" && (
            <p className='login-toggle'>
              Forgot Password?{' '}
              <span onClick={() => resetPass(email)}>Reset here</span>
            </p>
          )}
        </div>
        <div className="guest-login">
  <p className="login-toggle">
    Or log in as a guest{' '}
    <span onClick={guestLoginHandler}>click here</span>
  </p>
</div>
<div className="guest-login">
  <p>Log in with another browser</p>
  <p className="login-toggle">
    Or log in as a guest2{' '}
    <span onClick={guestLoginHandler2}>click here</span>
  </p>
</div>

      </form>
    </div>
  );
}

export default Login;

import React, { useRef, useState } from 'react'
import './Login.css'
import GoogleLogin, { GoogleLogout } from '@leecheuk/react-google-login';
import { useNavigate } from 'react-router-dom'
import AuthServices from '../../Services/AuthServices';
import { gapi } from "gapi-script";
import { useEffect } from 'react';
import ToastifyServices from '../../Services/ToastifyServices';
import API_ENDPOINT from '../../EndPoint';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'; // This is the sign-in icon.
import { useDispatch, useSelector } from 'react-redux';

const Login = () => {
  const dispatch = useDispatch()
  const StoreUserData = useSelector((state) => state.app.StoreUserData)
  const [modalOpen, setModalOpen] = useState(false)
  const [Loader, setLoader] = useState(false);
  const emailRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate()
  console.log('this is user Data from redux', StoreUserData)

  const handleBackgroundClick = () => {
    setModalOpen(false)

  };

  const renderButton = (renderProps) => (
    <button
      onClick={renderProps.onClick}
      disabled={renderProps.disabled}
      className='googleLoginButton'
    > <img style={{ height: '30px    ', width: '30px    ', marginLeft: '10px', marginRight: '55px   ' }} src="GoogleLoginIcon.png" alt="" />
      Google
    </button>
  );
  const onFailure = (error) => {
    console.log("login", error)
  };
  const onsuccess = async (response) => {
    setModalOpen(true)
    const token = response.tokenObj.id_token;
    const profile = response.profileObj;
    try {
      const res = await fetch(`${API_ENDPOINT}/users/googleLogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token, profile,
        })
      });
      console.log('this is response', res)
      const data = await res.json();
      if (res.ok) {
        console.log('this is me', data.message);
        console.log('this is me', data.user);
        AuthServices.StoreUser(data.user, dispatch)
        ToastifyServices.showSuccess(data.message)
        setModalOpen(false)
        navigate("/trymodal");
      }
    } catch (error) {
      console.error("Error sending data to server:", error);
    }
  };

  const handleLogin = async (e) => {
    setLoader(true)

    e.preventDefault();
    if (!password || !email) {
      setLoader(false)
      ToastifyServices.showError("Both fields are required!")
      return;
    }

    // 4. Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      ToastifyServices.showError("Please enter a valid email address.")
      setLoader(false)
      return;
    }
    try {
      const body = { email: email, password: password }
      const response = await AuthServices.login(body)
      console.log('this is response', response)
      console.log(response.data);
      // AuthServices.StoreUser()
      AuthServices.StoreUser(response.data.data, dispatch);
      setLoader(false)
      navigate("/trymodal");
      ToastifyServices.showSuccess(response.data.message)
    } catch (error) {
      console.error(error);
      setLoader(false)
      ToastifyServices.showError(error.response.data)
    }
  };



  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);


  useEffect(() => {

    function start() {
      gapi.client.init({
        clientId: "51199884209-voa3fi3ovpi2evpc885eajqr3jq46mvg.apps.googleusercontent.com",
        scope: 'email',
      });
    }

    gapi.load('client:auth2', start);
  },);
  return (
    <div>
      <section className="login-container">

        <div className="login-inputs">

          <h1>Login</h1>
          <GoogleLogin prompt='select_account' cookiePolicy="single_host_origin" onFailure={onFailure} onSuccess={onsuccess} render={renderButton} clientId="51199884209-voa3fi3ovpi2evpc885eajqr3jq46mvg.apps.googleusercontent.com" />
          <div className="continueEmail">
            <div className="line"></div>
            <p className="continuePara">
              or continue with email
            </p>
            <div className="line"></div>
          </div>
          <form>
            <p className="paralogin">
              Email Address
            </p>
            <input type="email" placeholder="Example@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} ref={emailRef} />

            <p className="paralogin">
              Password
            </p>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="rememForgetBox">
              <p onClick={() => { navigate('/forgotpassword') }} className="forgetPara">Forgot Password?</p>

            </div>
            <button
              className={Loader ? "disabled-button ForDisableLogin" : "LoginBtns"}
              disabled={Loader}
              onClick={handleLogin}>
              {Loader ? <div className="loader"></div> :
                <><FontAwesomeIcon style={{ marginRight: '10px' }} icon={faSignInAlt} />

                  Log In
                </>
              }
            </button>
          </form>
          <a onClick={() => { navigate('/createaccount') }} className="forget">
            <span className="forgetSpan">


              Don't have an account?
            </span>
            Sign Up</a>
        </div>
      </section>
      {
        modalOpen && (
          <div

            onClick={handleBackgroundClick}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 9999,
              transition: 'all 0.3s ease-in-out'
            }}
          >
            <Box sx={{ display: 'flex' }}>

              <CircularProgress />
            </Box>
          </div>
        )
      }
    </div>
  )
}

export default Login
import React, { useState } from 'react'
import './ForgotPassword.css'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react';
import ToastifyServices from '../../Services/ToastifyServices';
import API_ENDPOINT from '../../EndPoint';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons'; // This can represent a message/OTP.
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
const ForgotPassword = () => {
    const [Loader, setLoader] = useState(false);
    const focusInput = useRef(null);
    const [isOTPVerified, setIsOTPVerified] = useState(false);
    const [otp, setOtp] = useState(Array(6).fill(''));
    const otpInputRefs = useRef([]);
    const [isOTPSent, setIsOTPSent] = useState(false);
    const [email, setEmail] = useState('');
    const [RepeatEmail, setRepeatEmail] = useState('');
    const [password, setPassword] = useState('');
    const [RepeatPassword, setRepeatPassword] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        if (focusInput.current) {
            focusInput.current.focus();
        }
    }, [isOTPVerified]);





    const handleOTPChange = (e, index) => {
        const value = e.target.value;
        if (/^\d$/.test(value) || value === "") {
            setOtp(prevOtp => {
                const newOtp = [...prevOtp];
                newOtp[index] = value;
                return newOtp;
            });
            if (value && index < otpInputRefs.current.length - 1) {
                otpInputRefs.current[index + 1].focus();
            }
        }
    };

    const isOtpFilled = () => {
        return otp.every(singleOtp => singleOtp !== '');
    };


    const handleSendOTP = async (e) => {
        setLoader(true)
        e.preventDefault();
        if (!email || !RepeatEmail) {
            ToastifyServices.showError("All fields are required!")
            setLoader(false)
            return;
        }
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
            ToastifyServices.showError("Please enter a valid email address.")
            setLoader(false)
            return;
        }
        if (email !== RepeatEmail) {
            ToastifyServices.showError("Emails do not match!")
            setLoader(false)
            return;
        }
        try {
            const response = await fetch(`${API_ENDPOINT}/users/sendOtp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            console.log('this is response', response)
            const data = await response.json();
            if (response.ok) {
                setLoader(false)
                ToastifyServices.showSuccess(data.message)
            } else {
                throw new Error(data.message);
            }
            console.log(data)
            console.log(data.message);
            setIsOTPSent(true);
        } catch (error) {
            ToastifyServices.showError(error.message)
            setLoader(false)
        }
    };

    const handleVerifyOTP = async (e, email, otp) => {
        setLoader(true)
        e.preventDefault();
        try {
            const response = await fetch(`${API_ENDPOINT}/users/verifyOtp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    otp: otp.join('')
                })
            });
            const data = await response.json();
            if (response.ok) {
                ToastifyServices.showSuccess(data.message)
                setIsOTPVerified(true);
                setLoader(false)
            } else {
                setLoader(false)
                throw new Error(data.message);
            }
        } catch (error) {
            ToastifyServices.showError(error.message)
            setLoader(false)
        }
    }

    const handleSubmit = async (e) => {
        setLoader(true)
        e.preventDefault();
        if (!password || !RepeatPassword) {
            ToastifyServices.showError("Both fields are required!")
            setLoader(false)
            return;
        }
        if (password !== RepeatPassword) {
            ToastifyServices.showError("Passwords do not match!")
            setLoader(false)
            return;
        }
        try {
            const response = await fetch(`${API_ENDPOINT}/users/updatePassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    newPassword: password
                })
            });
            console.log(response)
            const data = await response.json();
            if (response.ok) {
                ToastifyServices.showSuccess(data.message)
                setLoader(false)
                navigate('/login');
            } else {
                throw new Error(data.message || 'Could not update password.');
            }
        } catch (error) {
            ToastifyServices.showError(error.message)
            setLoader(false)
        }
    }


    return (
        <div>
            {!isOTPSent ? (
                <div>
                    <section className="login-container">
                        <div className="login-inputs forgotCard">
                            <p className='forgotParabox'>Forgot Password</p>
                            <p className='enterOPTpara'>Enter your Email and get OTP for verification.</p>
                            <form className='forgotPasswordForm'>
                                <p className="paralogin">Email Address</p>
                                <input ref={focusInput} type="email" placeholder="Example@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <p className="paralogin">Repeat Email Address</p>
                                <input type="email" placeholder="Example@gmail.com" value={RepeatEmail} onChange={(e) => setRepeatEmail(e.target.value)} />



                                <div className="savechangesAndCancel">

                                    <button
                                        className={Loader ? "disabled-button" : "GetOTPbtns"}
                                        disabled={Loader}
                                        onClick={handleSendOTP}>
                                        {Loader ? <div className="loader"></div> :
                                            <>
                                                <FontAwesomeIcon style={{ marginRight: '10px' }} icon={faCommentDots} />

                                                GET OTP
                                            </>
                                        }
                                    </button>
                                    <button onClick={() => { navigate('/trymodal') }} className="signUPBtn cancelOTP">

                                        <FontAwesomeIcon style={{ marginRight: '10px' }} icon={faTimes} />
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            ) : !isOTPVerified ? (
                <div className='enterOpt'>
                    <section className="login-container">
                        <div className="login-inputs forgotCard">
                            <p className='forgotParabox'>Enter OTP</p>
                            <p className='enterOPTpara2'>Sent OTP on <span className='sendOPTSpan'>{email}</span></p>
                            <div className="containerOTP">
                                <form className='optformContainer'>
                                    <div className="userInputOTP">
                                        {otp.map((data, index) => (
                                            <input
                                                className='inputOTP'
                                                placeholder='-'
                                                type="text"
                                                key={index}
                                                value={data}
                                                maxLength="1"
                                                ref={input => otpInputRefs.current[index] = input}
                                                onChange={(e) => handleOTPChange(e, index)}
                                            />
                                        ))}
                                    </div>



                                    <div className="savechangesAndCancel">

                                        <button
                                            className={Loader || !isOtpFilled() ? "disabled-button " : "Submits"}
                                            disabled={Loader || !isOtpFilled()}
                                            onClick={(e) => handleVerifyOTP(e, email, otp)}>
                                            {Loader ? <div className="loader"></div> : <>

                                                <FontAwesomeIcon style={{ marginRight: '10px' }} icon={faPaperPlane} /> Submit
                                            </>}
                                        </button>
                                        <button onClick={() => { navigate('/trymodal') }} className="signUPBtn cancelOTP">

                                            <FontAwesomeIcon style={{ marginRight: '10px' }} icon={faTimes} />
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                </div>
            ) : (
                <div className='passwordandNewPassword'>
                    <section className="login-container">
                        <div className="login-inputs forgotCard">
                            <p className='forgotParabox'>Enter your new password</p>
                            <p className='enterOPTpara'>This is the last step in recovering your password.</p>
                            <form className='forgotPasswordForm'>
                                <p className="paralogin">Password</p>
                                <input ref={focusInput} type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <p className="paralogin">New Password</p>
                                <input type="password" placeholder="Repeat your password" value={RepeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />


                                <div className="savechangesAndCancel">
                                    <button
                                        className={Loader ? "disabled-button " : "repeatPassBtn"}
                                        disabled={Loader}
                                        onClick={handleSubmit}>
                                        {Loader ? <div className="loader"></div> : <>
                                            <FontAwesomeIcon style={{ marginRight: '10px' }} icon={faSave} /> Save Password
                                        </>}
                                    </button>

                                    <button onClick={() => { navigate('/trymodal') }} className="signUPBtn cancelOTP">

                                        <FontAwesomeIcon style={{ marginRight: '10px' }} icon={faTimes} />
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            )}
        </div>
    )
}

export default ForgotPassword
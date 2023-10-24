import React, { useEffect, useState, useRef, } from 'react'
import './AccountSetting.css'
import { Navigate, useNavigate } from 'react-router-dom'
import AuthServices from '../../Services/AuthServices';
import ToastifyServices from '../../Services/ToastifyServices';
import API_ENDPOINT from '../../EndPoint';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setShowForm } from '../../features/inputValue/Inputvalue';
const AccountSetting = () => {
    const inputFileRef = useRef(null);
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [Loader, setLoader] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [userId, setserId] = useState([]);
    const oldPass = useRef(null);
    const [image_url, setImageURL] = useState("")
    const navigate = useNavigate()
    const user = useSelector(state => state.app.StoreUserData);
    const dispatch = useDispatch()
    useEffect(() => {
        if (oldPass.current) {
            oldPass.current.focus();
        }
    }, []);


    useEffect(() => {
        // const user = AuthServices.GetCurrentUser()
        if (!user) {
            navigate("/login");
        }
        else {
            setserId(user._id)
            setUserName(user.userName)
            setImageURL(user.imagePath)

        }
    }, []);

    useEffect(() => {
        // const user = AuthServices.GetCurrentUser()
        if (!user) {
            navigate("/login");
        }
        else {

        }
    });

    const verifyOldPassword = async (event) => {
        setLoader(true)
        event.preventDefault();
        if (!userName || !oldPassword) {
            if (!oldPassword) {
                ToastifyServices.showError("Old Password is required!")
                setLoader(false)
                return;
            }
            ToastifyServices.showError("All fields are required!")
            return;
        }
        const minUserNameLength = 3;
        const maxUserNameLength = 15;
        if (userName.length < minUserNameLength || userName.length > maxUserNameLength) {
            ToastifyServices.showError(`User Name should be between ${minUserNameLength} and ${maxUserNameLength} characters long.`)
            setLoader(false)
            return;
        }
        const userNameRegex = /^[a-zA-Z\s]+$/;
        if (!userNameRegex.test(userName)) {
            ToastifyServices.showError("User Name should only contain alphanumeric characters.")
            setLoader(false)
            return;
        }

        if (password) {
            const minPasswordLength = 8;
            if (password.length < minPasswordLength) {
                ToastifyServices.showError(`Password should be at least ${minPasswordLength} characters long.`)
                setLoader(false)
                return;
            }

            if (password !== repeatPassword) {
                ToastifyServices.showError("Passwords do not match!")
                setLoader(false)
                return;
            }
        }


        try {
            const response = await fetch(`${API_ENDPOINT}/users/verifyOldPassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId,
                    oldPassword: oldPassword,
                })
            });
            const data = await response.json();
            if (data.success) {
                updateDetails()
                setLoader(false)
            } else {
                ToastifyServices.showError('Old Passwords do not match!')
                setLoader(false)
            }
        } catch (error) {
            console.error("Error verifying old password:", error);
            setLoader(false)
        }
    }

    const updateDetails = async () => {
        try {
            const response = await fetch(`${API_ENDPOINT}/users/changeAccountDetails`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId,
                    newPassword: password,
                    userName: userName,
                    image_url: image_url
                })
            });
            const data = await response.json();
            console.log(data.user);
            if (data.success) {
                ToastifyServices.showSuccess('Account details updated successfully.')
                setLoader(false)
                console.log('updated', data.user)
                AuthServices.StoreUser(data.user, dispatch)
                navigate('/trymodal')
            } else {
                alert(data.message || 'Error updating account details.');
                setLoader(false)
            }
        } catch (error) {
            console.error("Error updating account details:", error);
            setLoader(false)
        }
    }


    const handleFileChange = async (e) => {
        setLoader(true)
        const file = e.target.files[0];
        if (file) {
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
            if (!validImageTypes.includes(file.type) || !validExtensions.includes(fileExtension)) {
                ToastifyServices.showError("Please select a valid image format (jpg, jpeg, png, or gif).")
                inputFileRef.current.value = "";
                setLoader(false);
                return;
            }

            try {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "uts5ahls");
                formData.append("cloud_name", "dypgiir37");

                const response = await fetch("https://api.cloudinary.com/v1_1/dypgiir37/image/upload", {
                    body: formData,
                    method: "post",
                });
                const data = await response.json();
                setImageURL(data.url);
                setLoader(false)
            } catch (err) {
                console.log(err);
            }
        }
    };
    const HandleDrop = () => {
        dispatch(setShowForm(false))
    }
    return (
        <div onClick={HandleDrop}>
            <section className="login-container forAccount" >
                <div className="accountBox">
                    <h1 className="accountBoxH1">Account</h1>
                    <p className="accountBoxP">Set your account settings down below</p>
                </div>
                <div className="login-inputs accountsettingForm">
                    <form className='accountsettingform'>
                        <p className="paralogin">
                            Full Name
                        </p>
                        <input className='inputText' type="text" placeholder="User Name" value={userName} onChange={(e) => setUserName(e.target.value)} />
                        <p className="paralogin">
                            Old Password
                        </p>
                        <input ref={oldPass} className='inputText' type="password" placeholder="Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                        <p className="paralogin">
                            Password
                        </p>
                        <input className='inputText' type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <p className="paralogin">
                            Repeat Password
                        </p>
                        <input className='inputText' type="password" placeholder="Repeat Password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
                        <input className='uploadimageCreate' ref={inputFileRef} type="file" onChange={handleFileChange} />
                        <div className="savechangesAndCancel">

                            <button
                                className={Loader ? "disabled-button disableForEdit" : "signUPBtn"}
                                disabled={Loader}
                                onClick={verifyOldPassword}>
                                {Loader ? (
                                    <div className="loader"></div>
                                ) : (
                                    <>
                                        <FontAwesomeIcon style={{ marginRight: '10px' }} icon={faSave} /> Save Changes
                                    </>
                                )}
                            </button>
                            <button onClick={() => { navigate('/trymodal') }} className="signUPBtn">

                                <FontAwesomeIcon style={{ marginRight: '10px' }} icon={faTimes} />
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    )
}

export default AccountSetting
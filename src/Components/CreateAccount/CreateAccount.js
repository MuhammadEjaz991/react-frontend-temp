import React, {useRef, useState } from 'react'
import './CreateAccount.css'
import { useNavigate } from 'react-router-dom'
import ToastifyServices from '../../Services/ToastifyServices';
import API_ENDPOINT from '../../EndPoint';

const CreateAccount = () => {
    const inputFileRef = useRef(null);
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [Loader, setLoader] = useState(false);
    const [image, setImage] = useState('');
    const [image_url, setImageURL] = useState("")


    const navigate = useNavigate()

    const handleSignUp = async (e) => {
        setLoader(true)
        e.preventDefault();
        if (!userName || !email || !password || !repeatPassword || !image_url) {
            ToastifyServices.showError("All fields are required!")
            setLoader(false)
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

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
            ToastifyServices.showError("Please enter a valid email address.")
            setLoader(false)
            return;
        }

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

        const user = {
            userName: userName,
            email: email,
            password: password,
            imageUrl: image_url, 
        };
        try {
            const response = await fetch(`${API_ENDPOINT}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            // if (!response.ok) {
            //     throw new Error('Registration failed!');
            // }
            console.log(response)
            const data = await response.json();
            console.log(data)
            if (response.ok) {

                navigate('/login');
                setLoader(false)
                ToastifyServices.showSuccess("Account is Created Successfully")
            }
            else {
                console.log(data.message);
                ToastifyServices.showError(data.message)
                setLoader(false)
            }
        } catch (error) {
            alert(error.message);
            setLoader(false)
        }
    };


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

    return (
        <div>
            <section className="login-container">
                <div className="login-inputs createinputform">
                    <h1 className='SignUpPara'>Sign Up</h1>
                    <form className='createForm'>
                        <p className="paralogin">
                            User Name
                        </p>
                        <input className='inputText' type="text" placeholder="User Name" value={userName} onChange={(e) => setUserName(e.target.value)} />
                        <p className="paralogin">
                            Email Address
                        </p>
                        <input className='inputText' type="email" placeholder="Example@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <p className="paralogin">
                            Password
                        </p>
                        <input className='inputText' type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <p className="paralogin">
                            Repeat Password
                        </p>
                        <input className='inputText' type="password" placeholder="Repeat Password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
                        <input className='uploadimageCreate inputText' ref={inputFileRef} type="file" onChange={handleFileChange} />
                        <button
                            className={Loader ? "disabled-button disableForEdit" : "signUPBtn"}
                            disabled={Loader}
                            onClick={handleSignUp}>
                            {Loader ? <div className="loader"></div> : 'Sign Up'}
                        </button>
                    </form>
                    <a onClick={() => { navigate('/login') }} className="forget createLoginbutton"> <span className="forgetSpan">
                        Already have an account?
                    </span>
                        Sign in</a>
                </div>
            </section>
        </div>
    )
}

export default CreateAccount
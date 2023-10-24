import React, { useCallback, useEffect, useRef, useState } from 'react'
import './TryModal.css'
import { useDropzone } from 'react-dropzone';
import InputSliderMinDepth from '../Slider/InputSliderMinDepth';
import InputSliderMaxDepth from '../Slider/InputSliderMaxDepth';
import InputSliderGtDepth from '../Slider/InputSliderGtDepth';
import InputSliderFOVDepth from '../Slider/InputSliderFOVDepth';
import { useNavigate } from 'react-router-dom';
import LinearWithValueLabel from './LinearWithValueLabel';
import CircularProgress from '@mui/material/CircularProgress';
import AuthServices from '../../Services/AuthServices';
import ToastifyServices from '../../Services/ToastifyServices';
import { async } from 'q';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser } from '@fortawesome/free-solid-svg-icons';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { setShowForm } from '../../features/inputValue/Inputvalue';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import API_ENDPOINT from '../../EndPoint';
const TryModal = () => {

    const [progress, setProgress] = useState(0);
    const intervalRef = useRef(null);
    const navigate = useNavigate()
    const [modalOpen, setModalOpen] = useState(false)
    const [isAnimatingOut, setAnimatingOut] = useState(false);
    const [sliderValueMin, setSliderValueMin] = useState(0.01);
    const [sliderValueMax, setSliderValueMax] = useState(10);
    const [sliderValueGT, setSliderValueGT] = useState(0.35);
    const [sliderValueFov, setSliderValueFov] = useState(40);
    const [imageresult, Setimageresult] = useState();
    const [resetSignal, setResetSignal] = useState(false);
    const [user_id, setUserId] = useState('');
    const [shadowEffect, setShadowEffect] = useState(false);
    const [image, setImage] = useState('');
    const [image_url, setImageURL] = useState("")
    const [isVisible, setIsVisible] = useState(false);
    const dispatch = useDispatch()
    
    const user = useSelector(state => state.app.StoreUserData);
    const handleClearClick = () => {
        setResetSignal(true);
        setTimeout(() => setResetSignal(false), 10);
    }

    const handleBackgroundClick = () => {
        setShadowEffect(true);
        setTimeout(() => {
            setShadowEffect(false);
        }, 150);
    };


    const onDrop = useCallback(acceptedFiles => {

        dispatch(setShowForm(false))
        const file = acceptedFiles[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            handelSelectedFile(file)
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const handelSelectedFile = async (file) => {
        setImageURL('')
        try {
            Setimageresult('');
            const formData = new FormData();
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

            if (!validImageTypes.includes(file.type) || !validExtensions.includes(fileExtension)) {
                ToastifyServices.showError("Please select a valid image format (jpg, jpeg, png, or gif).")
                setImageURL('')
                setImage('')
                return;
            }
            formData.append("file", file);
            formData.append("upload_preset", "uts5ahls");
            formData.append("cloud_name", "dypgiir37");
            const response = await fetch("https://api.cloudinary.com/v1_1/dypgiir37/image/upload", {
                body: formData,
                method: "post",
            });
            const data = await response.json();
            if (data.url) {
                console.log('this is result from aws image upload', data)
                setImageURL(data.url);
            }
            else {
                console.log('this is error')
            }
        } catch (err) {
            console.log(err);
        }
    };


    const handleImageClickme = () => {
        setIsVisible(!isVisible);
    };

    const foodItems = [
        { name: "Macarons", calories: 28.34 },
        { name: "Cake", calories: 320.50 },
        { name: "Pie", calories: 265.30 },
        { name: "Pie", calories: 265.30 },
        { name: "Pie", calories: 265.30 },
        { name: "Pie", calories: 265.30 },
        { name: "Pie", calories: 265.30 },
        { name: "Pie", calories: 265.30 },
        { name: "Pie", calories: 265.30 },
        { name: "Pie", calories: 265.30 },
        { name: "Pie", calories: 265.30 },
        // ... you can add more items as needed
    ];



    const handleSubmit = async () => {
        setModalOpen(true);

        if (!image_url) {
            console.error("Image URL is empty or undefined. Aborting submission.");
            return;
        }

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        setProgress(0);

        intervalRef.current = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    return 100;
                }
                if (prevProgress === 80) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    return 80;
                } else {
                    return prevProgress + 1;
                }
            });
        }, 500);

        const data = {
            MIN_DEPTH: sliderValueMin,
            MAX_DEPTH: sliderValueMax,
            gt_depth_scale: sliderValueGT,
            FOV: sliderValueFov,
            image_url: image_url
        };

        console.log(data);
        try {
            // Yahan aap backend endpoint ko hit kar rahe hain
            const response = await axios.post(`${API_ENDPOINT}/users/proxyLambda`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('this is result from lambda via backend', response);
            console.log('this is result from lambda via backend', response.data);

            if (response.status === 200) {
                // const responseBody = response.data;
                const responseBody = JSON.parse(response.data.body);

                setProgress(100);
                console.log('this is image result without something', responseBody);
                const ForEmptyResult = { food: 'No food Found!', quantity: 'Nill!', bbox: Array(4).fill(0) };
                Setimageresult([Object.keys(responseBody.result).length === 0 ? ForEmptyResult : responseBody.result]);

                const resultToStore = {
                    user_id: user_id,
                    imageUrl: image_url,
                    result: Object.keys(responseBody.result).length === 0 ? ForEmptyResult : responseBody.result
                };

                storeImageDetails(resultToStore);
            }

        } catch (error) {
            console.error("Error sending data:", error);
        }
    };


    const storeImageDetails = async (resultToStore) => {
        try {
            const response = await AuthServices.StoreImageDetail(resultToStore)
            const data = response;
            if (data.status) {
                console.log('from backend Data', data.data.data)
                console.log("Data stored successfully in backend");
            } else {
                console.error("Error storing data:", data.message);
            }
        } catch (error) {
            console.error("Error sending data to backend:", error);
        }
        setTimeout(() => {
            setAnimatingOut(true);
            setTimeout(() => {
                setModalOpen(false);
                setAnimatingOut(false);
            }, 1500);
        }, 1000);
    }


    useEffect(() => {
        // const user = AuthServices.GetCurrentUser()
        if (!user) {
            navigate("/login");
        }
        else {
            setUserId(user._id)
        }
    });

    const HandleDrop = () => {
        dispatch(setShowForm(false))
    }
    return (
        <div className='ResultPageContainer' onClick={HandleDrop}>
            {!imageresult && <h1 className='heading1'>Upload a picture, and our AI  tell you the <span style={{ color: '#3990FF', fontWeight: '700' }}>calories</span> within seconds.</h1>}
            {imageresult && <h1 style={{
                maxWidth: "1264px",
                width: "90%", lineHeight: '35px'
            }} className='heading1'>With the precision of our advanced AI, we've detected that your meal contains approximately  <span style={{ color: '#3990FF', fontWeight: '700' }}>calories</span>  value. Plan your day and enjoy every bite!</h1>}
            <div className="innerdivResult" style={{
                gridTemplateColumns: imageresult ? '1fr 1fr' : '1fr',
                paddingTop: isVisible ? "20px" : "50px",
            }}>
                <div className="leftSideDiv"
                    style={{
                        padding: isVisible ? " 20px 30px" : "50px"
                    }}
                >
                    <div className="uploadPicImage" {...getRootProps()}>
                        {image && !image_url && (<CircularProgress />)}
                        {image_url && <img src={image_url} alt="User" />}
                        <input {...getInputProps()} type="file" />
                        {!image && !image_url && (
                            <div>
                                {isDragActive ? 'Drop the files here ...' : (
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                        <img style={{ width: '80px', height: '80px', textAlign: 'center', margin: '8px' }} src="photoicon.png" alt="" />
                                        <p className='dragAndDrop'>Drag & Drop</p>
                                        <p className='dragAndDrop2'>You can also browse for files</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="buttondivs">
                        <button {...getRootProps()} className='browseButton' >

                            Upload Image
                            <FontAwesomeIcon style={{ marginLeft: '10px' }} icon={faUpload} />
                        </button>
                    </div>
                    <div className="sliderDivBox">
                        <button onClick={handleImageClickme} className="browseButton2">
                            advance Options
                            <img
                                src="angle-down.png"
                                style={{
                                    transform: !isVisible ? "none" : "rotate(180deg)",
                                    cursor: "pointer",
                                    marginLeft: '20px'
                                }}
                                alt=""
                            />
                        </button>
                        {isVisible && (
                            <div className="parameterDiv">
                                <InputSliderMinDepth sliderValueMin={sliderValueMin} onValueChange={setSliderValueMin} resetSignal={resetSignal} />
                                <InputSliderMaxDepth sliderValueMax={sliderValueMax} onValueChange={setSliderValueMax} resetSignal={resetSignal} />
                                <InputSliderGtDepth sliderValueGT={sliderValueGT} onValueChange={setSliderValueGT} resetSignal={resetSignal} />
                                <InputSliderFOVDepth sliderValueFov={sliderValueFov} onValueChange={setSliderValueFov} resetSignal={resetSignal} />
                            </div>
                        )}
                        <div className="buttondivsbelow">
                            <button
                                // onClick={handleCaptureClick } 
                                className='browseButton' onClick={handleClearClick} >
                                <FontAwesomeIcon style={{ marginRight: '10px' }} icon={faEraser} />

                                Clear
                            </button>
                            <button
                                className={!image_url ? "disabled-button" : "browseButton"}
                                disabled={!image_url}
                                onClick={() => {
                                    handleSubmit()
                                    dispatch(setShowForm(false))
                                }}>
                                {!image_url && image ? (
                                    <div className="loader"></div>
                                ) : (
                                    <>
                                        <FontAwesomeIcon style={{ marginRight: '10px' }} icon={faPaperPlane} /> Submit
                                    </>
                                )}

                            </button>
                        </div>
                    </div>
                </div>
                {imageresult && (
                    <div className="rightSideDiv">
                        <div className="resultImageBox">
                            <img src={image} alt="" />
                            <span className="imageChip imageChip2">
                                {imageresult[0]?.food.charAt(0).toUpperCase() + imageresult[0]?.food.slice(1)}
                            </span>
                        </div>

                        <div className="resultDivDetail">
                            <h1>Output:</h1>
                            <div className="food-list">
                                {imageresult.map((item, index) => (
                                    <div className='food-item' key={index}>

                                        <span className='food-name'>
                                            {item?.food.charAt(0).toUpperCase() + item?.food.slice(1)}
                                        </span>
                                        <br />
                                        <span className='calorie-info'>Calories:
                                            {item?.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {
                modalOpen && (
                    <div
                        className={`modal-background ${isAnimatingOut ? 'slide-out' : 'slide-in'} }`}
                        onClick={handleBackgroundClick}
                        // onClick={() => setModalOpen(false)}
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
                        <div
                            className={`modal-content  ${shadowEffect ? 'shadow-effect' : ''}`}
                            style={{
                                width: '50vw',
                                minHeight: '60vh',
                                background: '#f7f7f7',
                                padding: '40px',
                                borderRadius: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.3)'
                            }}>
                            <LinearWithValueLabel style value={progress} />

                            <img
                                className='modalimage'
                                src={image}
                                style={{
                                    width: '40vw',
                                    height: '40vh',
                                    objectFit: 'cover',
                                    margin: '33px auto',
                                    borderRadius: '12px',
                                    boxShadow: "0.2778vw 0.2778vw 0.2778vw 0px rgba(0, 0, 0, 0.25)"
                                }}
                                alt="modal"
                            // onClick={() => setModalOpen(false)}
                            />
                            <h1 className='processPara' style={{
                                fontFamily: '"Arial", sans-serif',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: '#333'
                            }}>
                                Your image is processing
                                <span className="dot">.</span>
                                <span className="dot">.</span>
                                <span className="dot">.</span>
                                <span className="dot">.</span>
                                <span className="dot">.</span>
                            </h1>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default TryModal
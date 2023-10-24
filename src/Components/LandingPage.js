import React, { useEffect } from 'react'
import './LandingPage.css'
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setShowForm } from '../features/inputValue/Inputvalue';
const LandingPage = () => {
    const dispatch= useDispatch()
    const navigate=useNavigate()
    const HandleDrop = () => {
        dispatch(setShowForm(false))
    }
    return (
        <div className='LandingPageContainer' onClick={HandleDrop}>
            <div className="buttonpara"> 
            <p className="cloriesPara">
                With our revolutionary platform, you now hold the power to unveil the mysteries of your diet. Simply upload an image of any fruit and watch as we instantly provide you with its calorie count. It's time to visualize your path to wellness like never before!
            </p>
            <button className="signintoolanding" aria-current="page" onClick={()=>{navigate('/trymodal')}}>Try Model</button>
    </div>
        </div>
    )
}

export default LandingPage
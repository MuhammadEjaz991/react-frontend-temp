import React, { useEffect, useRef, useState } from 'react'
import './Navbar.css'
import { Outlet, Link, useNavigate } from "react-router-dom";
import AuthServices from '../Services/AuthServices';
import ToastifyServices from '../Services/ToastifyServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons'; // This is the dashboard icon.
import { faCog } from '@fortawesome/free-solid-svg-icons'; // This is the cog (settings) icon.
import { decrement, increment, setInputobject, setShowForm, setStoreUserData } from '../features/inputValue/Inputvalue';
import { useSelector, useDispatch } from 'react-redux';
const Navbar = () => {
  const user = useSelector(state => state.app.StoreUserData);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userName, setUserName] = useState('')
  const [userimage, setuserimage] = useState('')
  // const [showForm, setShowForm] = useState(false);
  const [isVisible, setIsVisible] = React.useState(true);
  const navigate = useNavigate();
  const togglerRef = useRef(null);

  const showForm = useSelector((state) => state.app.showForm)
  const dispatch = useDispatch();

  const handleLogoutClick = () => {

    closeNavbarIfOpen();
    setIsLoggedIn(false);
    AuthServices.logout()
    ToastifyServices.showSuccess("Successfully logged out!")
  }

  const closeNavbarIfOpen = () => {
    if (window.innerWidth <= 990 && togglerRef.current && togglerRef.current.getAttribute('aria-expanded') === 'true') {
      togglerRef.current.click();
    }
  };

  useEffect(() => {
    // const user = AuthServices.GetCurrentUser();
    if (user) {
      setIsLoggedIn(true);
      setUserName(user.userName);
      setuserimage(user.imagePath)
    }
  });

  const HandleDrop = () => {
    dispatch(setShowForm(false))
  }
  return (
    <div className='navbarContainer' >
      <div className="outer">
        <marquee>Discover the <span style={{ color: '#3990FF', fontWeight: '500' }}>calories</span> value of your fruits! Upload a picture now.</marquee>

      </div>
      <nav className="navbar navbar-expand-lg ">
        <div className="container-fluid">
          <img className="navbar-brand" src='apple.png' alt="" onClick={() => {
            navigate('./')

            dispatch(setShowForm(false))
          }} />
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            ref={togglerRef}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active signintoo" aria-current="page" to="/trymodal" onClick={() => {
                  closeNavbarIfOpen()


                  dispatch(setShowForm(false))
                }}>Nutrition <span className='ixPara'>ix</span> </Link>
              </li>

            </ul>
            <div className='btns'>
              {
                (!isLoggedIn) ? (
                  <Link to="/login" className="signin" onClick={closeNavbarIfOpen}>
                    <i className="fas fa-sign-in-alt"></i> Login
                  </Link>
                ) : (
                  <Link className="signin" onClick={() => {
                    handleLogoutClick()
                    dispatch(setShowForm(false))
                    dispatch(setStoreUserData(""))
                  }} >
                    <i className="fas fa-sign-out-alt "></i> Logout
                  </Link>
                )
              }

              {
                (!isLoggedIn) ? (
                  ""
                ) : (
                  <div
                    // onClick={() => {
                    //   setShowForm(prev => !prev);
                    // }}
                    className="dashboardBox">

                    <img onClick={() => dispatch(setShowForm(!showForm))}
                      src={userimage ? `${userimage}` : 'Mypic.jpg'} alt="Profile Picture" />
                    {
                      <div className={`dashboardForm ${showForm ? 'open' : ''}`}>
                        <div className="InnerBoxDiv">


                          <p className="userSettingBtn userNamePar"
                          >
                            <FontAwesomeIcon style={{ marginRight: '10px' }} icon={faUser} />

                            {userName}</p>
                          <p
                            className="userSettingBtn"

                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('./dashboard');
                              closeNavbarIfOpen();
                              dispatch(setShowForm(false))

                            }}
                          >
                            <FontAwesomeIcon style={{ marginRight: '10px' }} icon={faTachometerAlt} />

                            Dashboard
                          </p>
                          <p onClick={(e) => {
                            e.stopPropagation();
                            navigate('./accountsettings');
                            closeNavbarIfOpen();
                            dispatch(setShowForm(false))
                          }} className="userSettingBtn">
                            <FontAwesomeIcon style={{ marginRight: '10px' }} icon={faCog} />

                            User settings
                          </p>
                        </div>
                      </div>
                    }
                  </div>

                )
              }
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
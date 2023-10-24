import './App.css';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import LandingPage from './Components/LandingPage';
import TryModal from './Components/TryModal/TryModal';
import Dashboard from './Components/Dashboard/Dashboard';
import Login from './Components/Login/Login';
import CreateAccount from './Components/CreateAccount/CreateAccount';
import AccountSetting from './Components/AccountSetting/AccountSetting';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (

    <div className='mainContainer'>


      <BrowserRouter>
        <ToastContainer />
        <Navbar />
        <Routes>


          <Route path='/' element={<LandingPage />}></Route>

        </Routes>
      </BrowserRouter>






    </div>

  );
}

export default App;

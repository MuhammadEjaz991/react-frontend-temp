import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const showError = (message) => {
    toast.error(message)
}
const showSuccess = (message) => {
    toast.success(message)
}


export default {
    showError, 
    showSuccess
}
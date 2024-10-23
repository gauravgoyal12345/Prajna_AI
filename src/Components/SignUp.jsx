import { useState} from 'react';
import axios from 'axios';
import '../Style/formStyle.css';
import { Alert } from "antd";
import {useNavigate } from 'react-router-dom';
const validator = require('validator');

function SignUp() {
    const [submitted, setSubmitted] = useState(false);
    const [signUpData, setSignUpData] = useState({
        name: '',
        email: '',
        password : '',
        ConfirmPassword : ''
    });
    const navigate = useNavigate();
    const [incorrectField, setIncorrectFieldAlert] = useState(false);
    const [emptyField, setEmptyFieldAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleSignUpChange = (e) => {
        const { name, value } = e.target;
        setSignUpData(prevState => ({
            ...prevState,
            [name]: name === 'age' ? Number(value) : value 
        }));

        if (emptyField) {
            setEmptyFieldAlert(false);
        }
        if (incorrectField) {
            setIncorrectFieldAlert(false);
        }
        if (alertMessage) {
            setAlertMessage('');
        }
    };

    
    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        if (signUpData.name.trim() === '' || signUpData.email.trim() === '' || signUpData.password.trim() === '' || signUpData.ConfirmPassword.trim() === '') {
            setEmptyFieldAlert(true);
            setAlertMessage("Please Fill all the details");
            return;
        }
        if(!validator.isEmail(signUpData.email)){
            setIncorrectFieldAlert(true);
            setAlertMessage("Please check the credentials");
            return;
        }
        if(signUpData.password.trim().length < 6){
            setEmptyFieldAlert(true);
            setAlertMessage("The password length should be greater than 5");
            return;
        }
        if(signUpData.password !== signUpData.ConfirmPassword){
            setIncorrectFieldAlert(true);
            setAlertMessage("Confirm Password and Password both are not same");
            return;
        }
        
        try {
            // Create a copy of signUpData excluding ConfirmPassword
            const {ConfirmPassword, ...dataToSend} = signUpData;
            setSubmitted(true);
            const response = await axios.post("https://prajna-ai-f6r7.onrender.com/register", dataToSend);
            
            if(response.status === 201){
                setTimeout(() => {
                    navigate('/login');
                }, 1000); // Delay of 3000ms (3 seconds)
            }
        } 
        catch (error) {
            console.log(error);
            setIncorrectFieldAlert(true);
            setAlertMessage("Error at Registering User");
        }
    };

    return (
        <div className='container'>
            <div className='form-container'>
                <h1 className='form-title'>User SignUp form</h1>
                <form className='form'>
                    <input className='form-input' name='name' type='text' value={signUpData.name} placeholder='Enter your Name' onChange={handleSignUpChange} />
                    <input className='form-input' name='email' type='text' value={signUpData.email} placeholder='Enter your Email' onChange={handleSignUpChange}  />
                    <input className='form-input' name = 'password' type='password' placeholder='Enter your password' value={signUpData.password }  onChange={handleSignUpChange} />
                    <input className='form-input' name = 'ConfirmPassword' type='password' placeholder='Confirm your password' value={signUpData.ConfirmPassword }  onChange={handleSignUpChange} />
                    <button className='form-button' type='submit' onClick={handleSignUpSubmit}>SignUp</button>
                </form>

                {submitted && (
                    <div className='result'>
                        <div>
                            <h2>Welcome {signUpData.firstName}</h2>
                            
                            <p> Created User with Credentials</p>
                            <p>Name: {signUpData.name}</p>
                            <p>Email: {signUpData.email}</p>
                            <h2>Now Please LogIn Again</h2>
                        </div>
                    </div>
                )}
                {incorrectField && <Alert message = {alertMessage} type="error" />} 
                {emptyField && <Alert message = {alertMessage} type="warning" />} 
            </div>


        </div>
    );
}

export default SignUp;

import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import bgImg from "../Assets/bg3.avif"; // Make sure the path to the image is correct
import {useNavigate } from 'react-router-dom';
const validator = require('validator');
export default function SignUpForm() {
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const [emptyField, setEmptyFieldAlert] = useState(false);
  const [incorrectField, setIncorrectFieldAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prevState) => ({
      ...prevState,
      [name]: value // Store value as-is
    }));

    // Reset alerts
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (signUpData.name.trim() === '' || signUpData.email.trim() === '' || signUpData.password.trim() === '' || signUpData.confirmPassword.trim() === '') {
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
    if(signUpData.password !== signUpData.confirmPassword){
        setIncorrectFieldAlert(true);
        setAlertMessage("Confirm Password and Password both are not same");
        return;
    }
    
    try {
        // Create a copy of signUpData excluding ConfirmPassword
        const {confirmPassword, ...dataToSend} = signUpData;
        setSubmitted(true);
        const response = await axios.post("https://prajna-ai.onrender.com/register", dataToSend);
        
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
    <Grid
      container
      justifyContent="center" // Center items horizontally
      alignItems="center" // Center items vertically
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${bgImg})`, // Correct syntax for backgroundImage
        backgroundSize: 'cover', // Ensures the background covers the whole viewport
        backgroundPosition: 'center', // Centers the background image
        backgroundRepeat: 'no-repeat' // Prevents image repetition
      }}
    >
      <Grid item>
        <Box
          component="form"
          onSubmit={handleSubmit} // Handle form submission
          sx={{
            width: 350,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            padding: 3,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: 'rgba(18, 18, 18, 0.8)', // Semi-transparent background for the form
            border: '2px solid #567350', // Green border
          }}
        >
          <Typography variant="h5" component="h1" align="center" sx={{ mb: 2, color: '#e6f4e4' }}>
            User Signup Form
          </Typography>

          <TextField
            name='name'
            label='Name'
            variant='outlined'
            value={signUpData.name}
            onChange={handleSignUpChange}
            error={emptyField}
            helperText={emptyField && "This field cannot be empty"}
            sx={{
              input: { color: '#e6f4e4' },
              fieldset: { borderColor: '#567350' },
              '& .MuiInputLabel-root': { color: '#e6f4e4' }, // Label color
              '& .MuiInputLabel-root.Mui-focused': { color: '#e6f4e4' }, // Label focus color
              '& input::placeholder': { color: 'white' } // Placeholder color
            }}
            InputLabelProps={{
              style: { color: 'white' } // Label color
            }}
            InputProps={{
              style: { color: 'white' }, // Input text color
              inputProps: {
                style: { color: 'white' } // Placeholder color
              }
            }}
          />

          <TextField
            name='email'
            type='email'
            label='Email Address'
            variant='outlined'
            value={signUpData.email}
            onChange={handleSignUpChange}
            error={emptyField}
            helperText={emptyField && "This field cannot be empty"}
            sx={{
              input: { color: '#e6f4e4' },
              fieldset: { borderColor: '#567350' },
              '& .MuiInputLabel-root': { color: '#e6f4e4' }, // Label color
              '& .MuiInputLabel-root.Mui-focused': { color: '#e6f4e4' }, // Label focus color
              '& input::placeholder': { color: 'white' } // Placeholder color
            }}
            InputLabelProps={{
              style: { color: 'white' } // Label color
            }}
            InputProps={{
              style: { color: 'white' }, // Input text color
              inputProps: {
                style: { color: 'white' } // Placeholder color
              }
            }}
          />

          <TextField
            name='password'
            type='password'
            label='Password'
            variant='outlined'
            value={signUpData.password}
            onChange={handleSignUpChange}
            error={emptyField}
            helperText={emptyField && "This field cannot be empty"}
            sx={{
              input: { color: '#e6f4e4' },
              fieldset: { borderColor: '#567350' },
              '& .MuiInputLabel-root': { color: '#e6f4e4' }, // Label color
              '& .MuiInputLabel-root.Mui-focused': { color: '#e6f4e4' }, // Label focus color
              '& input::placeholder': { color: 'white' } // Placeholder color
            }}
            InputLabelProps={{
              style: { color: 'white' } // Label color
            }}
            InputProps={{
              style: { color: 'white' }, // Input text color
              inputProps: {
                style: { color: 'white' } // Placeholder color
              }
            }}
          />

          <TextField
            name='confirmPassword'
            type='password'
            label='Confirm Password'
            variant='outlined'
            value={signUpData.confirmPassword}
            onChange={handleSignUpChange}
            error={emptyField || incorrectField}
            helperText={(emptyField && "This field cannot be empty") || (incorrectField && "Passwords do not match")}
            sx={{
              input: { color: '#e6f4e4' },
              fieldset: { borderColor: '#567350' },
              '& .MuiInputLabel-root': { color: '#e6f4e4' }, // Label color
              '& .MuiInputLabel-root.Mui-focused': { color: '#e6f4e4' }, // Label focus color
              '& input::placeholder': { color: 'white' } // Placeholder color
            }}
            InputLabelProps={{
              style: { color: 'white' } // Label color
            }}
            InputProps={{
              style: { color: 'white' }, // Input text color
              inputProps: {
                style: { color: 'white' } // Placeholder color
              }
            }}
          />

          <Button 
            variant="contained" 
            type="submit" 
            sx={{
              backgroundColor: '#567350', // Button background color
              color: '#e6f4e4', // Button text color
              '&:hover': {
                backgroundColor: '#4a6d44' // Darker green on hover
              }
            }}
          >
            Submit
          </Button>
          {submitted && (
                    <div className='result'>
                        <div>
                            <h2>Welcome {signUpData.name}</h2>
                            
                            <p> Created User with Credentials</p>
                            <p>Name: {signUpData.name}</p>
                            <p>Email: {signUpData.email}</p>
                            <h2>Now Please LogIn Again</h2>
                        </div>
                    </div>
          )}
        </Box>
      </Grid>

    </Grid>
  );
}

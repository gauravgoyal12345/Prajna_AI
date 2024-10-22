import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './Components/LandingPage';
import FinalComponents from './Components/FinalComponent';
import SignUpForm from './Components/SignUp2';
import LogInForm from './Components/Login2';
import PDFopener from './Components/PDFOpener';
import UserProfile from './Components/UserProfile';
function App() {
  return (
    <BrowserRouter>
        {/* <Navbar /> */}
        <Routes>  
          <Route path='/' element = {<LandingPage/>}/>
          <Route path='/login' element = {<LogInForm/>}/>
          <Route path='/signUp' element = {<SignUpForm/>}/>
          <Route path='/upload' element = {<FinalComponents/>}/>
          <Route path='/pdf' element = {<PDFopener/>}/>
          <Route path='/profile' element = {<UserProfile/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;

import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './Components/LandingPage';
import FinalComponents from './Components/FinalComponent';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import SignUpForm from './Components/SignUp2';
import LogInForm from './Components/Login2';
function App() {
  return (
    <BrowserRouter>
        {/* <Navbar /> */}
        <Routes>  
          <Route path='/' element = {<LandingPage/>}/>
          <Route path='/login' element = {<Login/>}/>
          <Route path='/login2' element = {<LogInForm/>}/>
          <Route path='/signUp' element = {<SignUp/>}/>
          <Route path='/signUp2' element = {<SignUpForm/>}/>
          <Route path='/upload' element = {<FinalComponents/>}/>

        </Routes>
      </BrowserRouter>
  );
}

export default App;

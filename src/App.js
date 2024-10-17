import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CombinedLayout from './Components/CombinedLayout';
import LandingPage from './Components/LandingPage';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import SignUpForm from './Components/SignUp2';
function App() {
  return (
    <BrowserRouter>
        {/* <Navbar /> */}
        <Routes>  
          <Route path='/' element = {<LandingPage/>}/>
          <Route path='/login' element = {<Login/>}/>
          <Route path='/signUp' element = {<SignUp/>}/>
          <Route path='/signUp2' element = {<SignUpForm/>}/>
          <Route path='/upload' element = {<CombinedLayout/>}/>

        </Routes>
      </BrowserRouter>
  );
}

export default App;

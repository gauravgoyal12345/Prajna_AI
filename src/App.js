import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CombinedLayout from './Components/CombinedLayout';
import LandingPage from './Components/LandingPage';
function App() {
  return (
    <BrowserRouter>
        {/* <Navbar /> */}
        <Routes>  
          <Route path='/' element = {<LandingPage/>}/>
          <Route path='/upload' element = {<CombinedLayout/>}/>

        </Routes>
      </BrowserRouter>
  );
}

export default App;

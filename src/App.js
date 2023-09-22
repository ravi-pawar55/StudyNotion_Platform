import "./App.css";
import {Route,Routes} from "react-router-dom";
import Home from "../pages/Home";
import Navbar from "./component/common/Navbar"

function App() {
  return (
     <div className="w-screen min-h-screen bg-richblack-900 flex flex-col ">
     <Routes>
        <Route path="/" element={<Home/>}/>
     </Routes>
     </div>
  );
}

export default App;

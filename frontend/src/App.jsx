import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignUp from './Screens/signup'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"; 
import Sidebar from './Components/sidebar';
import Tasks from './Screens/task';
import SpecificTask from './Screens/specificTask';

function App() {

  const [user, setLoginUser] = useState(
    JSON.parse(sessionStorage.getItem("user")) || {}
  )

  useEffect(() => {
    if(user && user._id) {sessionStorage.setItem('user', JSON.stringify(user))}
    else {sessionStorage.removeItem('user')}
  }, [user])

  return (
    <Router>
        {(user && user._id)?
        (<>
        <Sidebar user={user}/>
        <Routes>
          <Route exact path='/Tasks' element={<Tasks user={user}/>}/>
          <Route exact path='/SpecificTask/:id' element={<SpecificTask/>}/>
        </Routes>
        </>)
        :
        (<Routes>
          <Route exact path='/' element={<SignUp setLoginUser={setLoginUser}/>}/>
        </Routes>)}
        <ToastContainer/>
    </Router>
  )
}

export default App

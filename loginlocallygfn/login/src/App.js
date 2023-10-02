import logo from './logo.svg';
import './App.css';
import Signup from './Components/Signup/Signup';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import Verification from './Components/Verification/Verification';
import Dashboad from './Components/Dashboard/Dashboad';
import ResendVerification from './Components/Resend/Resend';
import ResetPassword from './Components/Enternewpas/Newpass';
import ForgotPassword from './Components/Resetpasward/Reset';
import ProtectedRoutes from './Components/ProtectedRoute';
import { UserSessionContextProvider } from './Components/UserSessionContext';
import OTPInput from './Components/Digit6/Sixdigitcode';
import UserProfile from './Delete';

function App() {
  return (
  <>
  <UserSessionContextProvider>
 <BrowserRouter>
 <Routes>
<Route path='/' element={<Signup/>}/>
<Route path='/login' element={<Login/>}/>
<Route path='/verify' element={<Verification/>}/>
<Route path='/dash' element={ <ProtectedRoutes> <Dashboad/>  </ProtectedRoutes>}/>
<Route path='/resand' element={<ResendVerification/>}/>
<Route path='/forgot' element={<ForgotPassword/>}/>
<Route path='/reset' element={<ResetPassword/>}/>
<Route path='/re' element={<OTPInput/>}/>
<Route path='/google' element={<UserProfile/>}/>
 </Routes>
 </BrowserRouter>
 </UserSessionContextProvider>
  </>
  );
}

export default App;

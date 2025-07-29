import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [showOtpForm, setShowOtpForm] = useState(false);
  
  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setIsLoading(true);

    try {
      const res = await axios.post("https://notes-app-1exy.onrender.com/signup", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });
      setMessage(res.data.message);
      setShowOtpForm(true); 
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    if (!otp.trim()) {
        setError("Please enter the OTP.");
        return;
    }
    setIsLoading(true);
    
    try {
        const res = await axios.post("https://notes-app-1exy.onrender.com/verify-otp", {
            email: email.trim().toLowerCase(),
            otp: otp.trim(),
        });
        alert(res.data.message);
        navigate("/");
    } catch (err) {
        setError(err.response?.data?.error || "OTP Verification failed.");
    } finally {
        setIsLoading(false);
    }
  };

  const SignupForm = (
    <form onSubmit={handleSignupSubmit} className='flex flex-col gap-3 my-4'>
      <label className='font-bold text-gray-700'>Full Name</label>
      <input
        className='border border-black rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
        type="text"
        placeholder='Enter your Full Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        disabled={isLoading}
      />
      <label className='font-bold text-gray-700'>Email</label>
      <input
        className='border border-black rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
        type="email"
        placeholder='Enter your Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
      />
      <label className='font-bold text-gray-700'>Password</label>
      <input
        className='border border-black rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
        type="password"
        placeholder='At least 6 characters'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading} className={`py-2 px-4 mt-2 rounded-xl text-white font-semibold cursor-pointer transition-colors ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-[#367AFF] hover:bg-blue-600'}`}>
        {isLoading ? 'Sending OTP...' : 'Sign Up'}
      </button>
    </form>
  );

  const OtpForm = (
    <form onSubmit={handleVerifyOtpSubmit} className='flex flex-col gap-3 my-4'>
        <label className='font-bold text-gray-700'>Enter OTP</label>
        <input
          className='border border-black rounded-xl px-4 py-2 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500'
          type="text"
          placeholder='_ _ _ _ _ _'
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading} className={`py-2 px-4 mt-2 rounded-xl text-white font-semibold cursor-pointer transition-colors ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-[#367AFF] hover:bg-blue-600'}`}>
          {isLoading ? 'Verifying...' : 'Verify Account'}
        </button>
    </form>
  );

  return (
    <div className='h-screen w-screen items-center flex bg-gray-300 justify-center p-4'>
      <div className='flex justify-evenly items-center p-2 rounded-xl w-full max-w-4xl h-auto md:h-4/5 bg-white shadow-lg'>
        <div className='flex justify-center flex-col m-5 p-5 w-full md:w-1/2'>
          <h1 className='font-bold text-2xl text-gray-800'>{showOtpForm ? 'Verify Your Email' : 'Create an Account'}</h1>
          <p className="text-gray-600 mt-1">{showOtpForm ? `An OTP has been sent to ${email}.` : "Let's get you started."}</p>
          
          {error && <div className="bg-red-100 text-red-700 p-3 rounded my-4 text-center">{error}</div>}
          {message && <div className="bg-green-100 text-green-700 p-3 rounded my-4 text-center">{message}</div>}
          
          {showOtpForm ? OtpForm : SignupForm}
          
          {!showOtpForm && (
            <p className='text-center text-gray-600'>Already have an account?{' '}
              <Link to="/" className='text-[#367AFF] cursor-pointer font-semibold hover:underline'>Sign In</Link>
            </p>
          )}
        </div>
        <div className='h-full w-1/2 hidden md:block'>
          <img className="h-full w-full object-cover rounded-xl" src='https://notes-app-1exy.onrender.com/background.jpg' alt="A person writing notes" />
        </div>
      </div>
    </div>
  );
};

export default Signup;

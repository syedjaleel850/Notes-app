import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post("https://notes-app-1exy.onrender.com/login", {
        email: trimmedEmail,
        password: trimmedPassword,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/notes");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='h-screen w-screen items-center flex bg-gray-300 justify-center p-4'>
      <div className='flex justify-evenly items-center p-2 rounded-xl w-full max-w-4xl h-auto md:h-4/5 bg-white shadow-lg'>
        <div className='flex justify-center flex-col m-5 p-5 w-full md:w-1/2'>
          <h1 className='font-bold text-2xl text-gray-800'>Sign in</h1>
          <p className="text-gray-600 mt-1">
            Please sign in to continue to your account
          </p>

          {/* Displaying the error message in the new UI */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded my-4 text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className='flex flex-col gap-3 my-4'>
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
              placeholder='Enter your Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            
            <div className='flex gap-2 items-center'>
              <input type="checkbox" id="keep-signed-in" /> 
              <label htmlFor="keep-signed-in" className="text-gray-600">Keep me signed in</label>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`py-2 px-4 rounded-xl text-white font-semibold cursor-pointer transition-colors ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-[#367AFF] hover:bg-blue-600'
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          
          <p className='text-center text-gray-600'>Don't have an account?{' '}
            <Link to="/signup" className='text-[#367AFF] cursor-pointer font-semibold hover:underline'>
              Sign up
            </Link>
          </p>
        </div>
        <div className='h-full w-1/2 hidden md:block'>
          
          <img
            className="h-full w-full object-cover rounded-xl"
            src='https://notes-app-1exy.onrender.com/background.jpg'
            alt="A person writing notes"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;

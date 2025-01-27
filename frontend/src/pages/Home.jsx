import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../userContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user, setUserInfo } = useUser(); // Access and update the user info in context
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserInfo(null); // Clear user info from context
    navigate('/'); // Redirect to login/register page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-semibold mb-4">Welcome to the Homepage!</h1>
        {user ? (
          <div className="text-lg">
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <button
              onClick={handleLogout}
              className="mt-4 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        ) : (
          <p>Please log in or register to view your profile.Click here to <a href="/">Login</a> </p>
        )}
      </div>
    </div>
  );
};

export default Home;

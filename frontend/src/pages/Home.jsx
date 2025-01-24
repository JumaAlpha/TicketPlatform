import React from 'react';
import { useUser } from '../userContext';
const Home = () => {
  const { user } = useUser(); // Access the user info from context

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-semibold mb-4">Welcome to the Homepage!</h1>
        {user ? (
          <div className="text-lg">
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
          </div>
        ) : (
          <p>Please log in or register to view your profile.</p>
        )}
      </div>
    </div>
  );
};

export default Home;

import React from 'react';

const SimpleHomePage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🏢 Billionaire Empire</h1>
        <p className="text-xl mb-8">Your empire awaits!</p>
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
          <p className="text-gray-300">The app is loading successfully!</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleHomePage; 
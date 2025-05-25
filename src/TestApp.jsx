import React, { useState, useEffect } from 'react';

function TestApp() {
  const [status, setStatus] = useState('Starting...');

  useEffect(() => {
    console.log('TestApp mounted');
    setStatus('TestApp loaded successfully!');
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Test App</h1>
        <p className="text-xl">{status}</p>
        <div className="mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setStatus('Button clicked!')}
          >
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestApp; 
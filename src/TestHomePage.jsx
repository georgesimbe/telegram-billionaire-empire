import React from 'react';
import useIntegratedGameStore from './store/integratedGameStore';
import { HOUSING_TYPES } from './config/housingConfig';

function TestHomePage() {
  const housing = useIntegratedGameStore(state => state.housing);
  const player = useIntegratedGameStore(state => state.player);

  // Test the same logic as HomePage
  const currentHousing = HOUSING_TYPES[housing.currentHousing?.toLowerCase()] || HOUSING_TYPES.homeless;

  return (
    <div style={{ padding: '20px', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      <h1>🏠 Housing Test</h1>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#333', borderRadius: '8px' }}>
        <h3>Housing State Debug:</h3>
        <p><strong>housing.currentHousing:</strong> {housing.currentHousing || 'undefined'}</p>
        <p><strong>currentHousing object:</strong> {currentHousing ? 'Found' : 'Not found'}</p>
        <p><strong>currentHousing.name:</strong> {currentHousing?.name || 'undefined'}</p>
        <p><strong>currentHousing.icon:</strong> {currentHousing?.icon || 'undefined'}</p>
        <p><strong>currentHousing.monthlyMaintenance:</strong> {currentHousing?.monthlyMaintenance || 'undefined'}</p>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#333', borderRadius: '8px' }}>
        <h3>Player State Debug:</h3>
        <p><strong>player.cash:</strong> {player.cash || 'undefined'}</p>
        <p><strong>player.monthlyIncome:</strong> {player.monthlyIncome || 'undefined'}</p>
        <p><strong>player.happiness:</strong> {player.happiness || 'undefined'}</p>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#333', borderRadius: '8px' }}>
        <h3>Available Housing Types:</h3>
        {Object.entries(HOUSING_TYPES).map(([key, housing]) => (
          <div key={key} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#444', borderRadius: '5px' }}>
            <p><strong>{key}:</strong> {housing.name} {housing.icon} (${housing.monthlyMaintenance}/mo)</p>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#2a4a2a', borderRadius: '8px' }}>
        <h3>Test Result:</h3>
        {currentHousing ? (
          <div>
            <p style={{ color: '#4CAF50' }}>✅ Housing object found successfully!</p>
            <p>Name: {currentHousing.name}</p>
            <p>Icon: {currentHousing.icon}</p>
            <p>Monthly Cost: ${currentHousing.monthlyMaintenance}</p>
          </div>
        ) : (
          <p style={{ color: '#f44336' }}>❌ Housing object not found</p>
        )}
      </div>
    </div>
  );
}

export default TestHomePage; 
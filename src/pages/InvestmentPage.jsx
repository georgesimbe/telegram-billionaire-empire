import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useIntegratedGameStore from '../store/integratedGameStore';
import { formatNumber } from '../utils/formatters';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const InvestmentPage = () => {
  const player = useIntegratedGameStore(state => state.player);
  const investments = useIntegratedGameStore(state => state.investments);
  const earnPoints = useIntegratedGameStore(state => state.earnPoints);
  const logAction = useIntegratedGameStore(state => state.logAction);
  
  const [selectedAsset, setSelectedAsset] = useState('stocks');
  const [investAmount, setInvestAmount] = useState('');
  const [marketPrices, setMarketPrices] = useState({
    stocks: 100,
    crypto: 50,
    realEstate: 1000,
  });
  const [priceHistory, setPriceHistory] = useState({
    stocks: [100],
    crypto: [50],
    realEstate: [1000],
  });

  // Simulate market fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketPrices(prev => {
        const newPrices = { ...prev };
        
        // Stocks: ±5% volatility
        newPrices.stocks = prev.stocks * (1 + (Math.random() - 0.5) * 0.1);
        
        // Crypto: ±10% volatility (more volatile)
        newPrices.crypto = prev.crypto * (1 + (Math.random() - 0.5) * 0.2);
        
        // Real Estate: ±2% volatility (more stable)
        newPrices.realEstate = prev.realEstate * (1 + (Math.random() - 0.5) * 0.04);
        
        // Update history
        setPriceHistory(prevHistory => ({
          stocks: [...prevHistory.stocks.slice(-49), newPrices.stocks],
          crypto: [...prevHistory.crypto.slice(-49), newPrices.crypto],
          realEstate: [...prevHistory.realEstate.slice(-49), newPrices.realEstate],
        }));
        
        return newPrices;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleInvest = () => {
    const actionCheck = logAction('INVESTMENT_ACTION');
    if (!actionCheck.allowed) {
      alert('Please wait before making another investment');
      return;
    }

    const amount = parseFloat(investAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (amount > player.cash) {
      alert('Insufficient funds');
      return;
    }

    // Buy the asset
    const units = amount / marketPrices[selectedAsset];
    
    // Update store
    useGameStore.setState(state => ({
      player: { ...state.player, cash: state.player.cash - amount },
      investments: {
        ...state.investments,
        [selectedAsset]: state.investments[selectedAsset] + units,
      }
    }));

    setInvestAmount('');
    alert(`Purchased ${units.toFixed(2)} units of ${selectedAsset}`);
  };

  const handleSell = (asset) => {
    const actionCheck = logAction('INVESTMENT_ACTION');
    if (!actionCheck.allowed) {
      alert('Please wait before making another transaction');
      return;
    }

    const units = investments[asset];
    if (units <= 0) {
      alert('No units to sell');
      return;
    }

    const value = units * marketPrices[asset];
    
    // Update store
    useGameStore.setState(state => ({
      player: { ...state.player, cash: state.player.cash + value },
      investments: {
        ...state.investments,
        [asset]: 0,
      }
    }));

    // Earn points based on profit
    const profit = value - (units * 100); // Assuming base price of 100
    if (profit > 0) {
      earnPoints(Math.floor(profit), 'INVESTMENT_PROFIT');
    }

    alert(`Sold all ${asset} for ${formatNumber(value)}`);
  };

  // Calculate portfolio value
  const portfolioValue = {
    stocks: investments.stocks * marketPrices.stocks,
    crypto: investments.crypto * marketPrices.crypto,
    realEstate: investments.realEstate * marketPrices.realEstate,
  };
  const totalPortfolioValue = Object.values(portfolioValue).reduce((a, b) => a + b, 0);

  // Chart data
  const chartData = {
    labels: ['Stocks', 'Crypto', 'Real Estate'],
    datasets: [{
      data: [portfolioValue.stocks, portfolioValue.crypto, portfolioValue.realEstate],
      backgroundColor: ['#3B82F6', '#8B5CF6', '#10B981'],
      borderColor: ['#2563EB', '#7C3AED', '#059669'],
      borderWidth: 2,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'white',
        },
      },
    },
  };

  return (
    <div className="p-4 max-w-md mx-auto pb-20">
      <h1 className="text-2xl font-bold mb-6">Investments</h1>

      {/* Portfolio Overview */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Portfolio Value</h2>
        <p className="text-3xl font-bold text-green-400 mb-4">
          ${formatNumber(totalPortfolioValue)}
        </p>
        
        {totalPortfolioValue > 0 && (
          <div className="h-48">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        )}
      </div>

      {/* Market Prices */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Market Prices</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>📈 Stocks</span>
            <div className="text-right">
              <p className="font-bold">${marketPrices.stocks.toFixed(2)}</p>
              <p className="text-xs text-gray-400">
                {priceHistory.stocks.length > 1 && (
                  <span className={marketPrices.stocks > priceHistory.stocks[priceHistory.stocks.length - 2] ? 'text-green-400' : 'text-red-400'}>
                    {marketPrices.stocks > priceHistory.stocks[priceHistory.stocks.length - 2] ? '▲' : '▼'}
                    {Math.abs(((marketPrices.stocks / priceHistory.stocks[priceHistory.stocks.length - 2]) - 1) * 100).toFixed(2)}%
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span>🪙 Crypto</span>
            <div className="text-right">
              <p className="font-bold">${marketPrices.crypto.toFixed(2)}</p>
              <p className="text-xs text-gray-400">
                {priceHistory.crypto.length > 1 && (
                  <span className={marketPrices.crypto > priceHistory.crypto[priceHistory.crypto.length - 2] ? 'text-green-400' : 'text-red-400'}>
                    {marketPrices.crypto > priceHistory.crypto[priceHistory.crypto.length - 2] ? '▲' : '▼'}
                    {Math.abs(((marketPrices.crypto / priceHistory.crypto[priceHistory.crypto.length - 2]) - 1) * 100).toFixed(2)}%
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span>🏠 Real Estate</span>
            <div className="text-right">
              <p className="font-bold">${marketPrices.realEstate.toFixed(2)}</p>
              <p className="text-xs text-gray-400">
                {priceHistory.realEstate.length > 1 && (
                  <span className={marketPrices.realEstate > priceHistory.realEstate[priceHistory.realEstate.length - 2] ? 'text-green-400' : 'text-red-400'}>
                    {marketPrices.realEstate > priceHistory.realEstate[priceHistory.realEstate.length - 2] ? '▲' : '▼'}
                    {Math.abs(((marketPrices.realEstate / priceHistory.realEstate[priceHistory.realEstate.length - 2]) - 1) * 100).toFixed(2)}%
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Buy/Sell Interface */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Trade</h2>
        
        {/* Asset Selector */}
        <div className="flex gap-2 mb-4">
          {['stocks', 'crypto', 'realEstate'].map(asset => (
            <button
              key={asset}
              onClick={() => setSelectedAsset(asset)}
              className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-colors ${
                selectedAsset === asset
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              {asset === 'realEstate' ? 'Real Estate' : asset.charAt(0).toUpperCase() + asset.slice(1)}
            </button>
          ))}
        </div>

        {/* Investment Input */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Amount to Invest</label>
          <input
            type="number"
            value={investAmount}
            onChange={(e) => setInvestAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
          />
          <p className="text-xs text-gray-400 mt-1">
            Available: ${formatNumber(player.cash)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleInvest}
            className="flex-1 bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg font-semibold transition-colors"
          >
            Buy {selectedAsset}
          </button>
          <button
            onClick={() => handleSell(selectedAsset)}
            className="flex-1 bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg font-semibold transition-colors"
          >
            Sell All
          </button>
        </div>
      </div>

      {/* Holdings */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Your Holdings</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Stocks</span>
            <span>{investments.stocks.toFixed(2)} units</span>
          </div>
          <div className="flex justify-between">
            <span>Crypto</span>
            <span>{investments.crypto.toFixed(2)} units</span>
          </div>
          <div className="flex justify-between">
            <span>Real Estate</span>
            <span>{investments.realEstate.toFixed(2)} units</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentPage;
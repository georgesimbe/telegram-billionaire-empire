import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  UserIcon,
  CurrencyDollarIcon,
  LanguageIcon,
  MoonIcon,
  SunIcon,
  DevicePhoneMobileIcon,
  LinkIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import useIntegratedGameStore from '../store/integratedGameStore';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';

const SettingsPage = () => {
  const { player, settings, updatePlayer, updateSettings } = useIntegratedGameStore();
  const wallet = useTonWallet();
  const [activeTab, setActiveTab] = useState('general');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [showAccessCode, setShowAccessCode] = useState(false);

  // Local settings state
  const [localSettings, setLocalSettings] = useState({
    notifications: settings?.notifications ?? true,
    autoSave: settings?.autoSave ?? true,
    difficulty: settings?.difficulty ?? 'normal',
    currency: settings?.currency ?? 'USD',
    theme: settings?.theme ?? 'dark',
    language: settings?.language ?? 'en',
    soundEffects: settings?.soundEffects ?? true,
    vibration: settings?.vibration ?? true,
    autoCollect: settings?.autoCollect ?? false,
    showHints: settings?.showHints ?? true,
  });

  // Generate access code for bot integration
  const generateAccessCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setAccessCode(code);
    setShowAccessCode(true);
    // Store in localStorage for bot verification
    localStorage.setItem('telegram_access_code', code);
    localStorage.setItem('telegram_access_code_expires', Date.now() + 300000); // 5 minutes
  };

  const saveSettings = () => {
    updateSettings(localSettings);
    // Show success notification
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showAlert('Settings saved successfully!');
    }
  };

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
      // Reset game state
      localStorage.clear();
      window.location.reload();
    }
  };

  const exportData = () => {
    const gameData = {
      player,
      settings: localSettings,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(gameData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `billionaire-empire-backup-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Cog6ToothIcon },
    { id: 'account', name: 'Account', icon: UserIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'advanced', name: 'Advanced', icon: ExclamationTriangleIcon },
  ];

  const SettingToggle = ({ label, description, value, onChange, icon: Icon }) => (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
      <div className="flex items-center space-x-3">
        {Icon && <Icon className="h-5 w-5 text-blue-400" />}
        <div>
          <h3 className="text-white font-medium">{label}</h3>
          {description && <p className="text-gray-400 text-sm">{description}</p>}
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-gray-600'
          }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
      </button>
    </div>
  );

  const SettingSelect = ({ label, description, value, onChange, options, icon: Icon }) => (
    <div className="p-4 bg-gray-800 rounded-lg">
      <div className="flex items-center space-x-3 mb-2">
        {Icon && <Icon className="h-5 w-5 text-blue-400" />}
        <div>
          <h3 className="text-white font-medium">{label}</h3>
          {description && <p className="text-gray-400 text-sm">{description}</p>}
        </div>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-2 p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Cog6ToothIcon className="h-8 w-8 text-blue-400" />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <div className="flex items-center space-x-2">
          <QuestionMarkCircleIcon className="h-6 w-6 text-gray-400 cursor-pointer hover:text-blue-400" />
          <button
            onClick={saveSettings}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors whitespace-nowrap ${activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-4">
            <SettingSelect
              label="Currency Display"
              description="Choose how currency is displayed"
              value={localSettings.currency}
              onChange={(value) => setLocalSettings(prev => ({ ...prev, currency: value }))}
              options={[
                { value: 'USD', label: 'US Dollar ($)' },
                { value: 'EUR', label: 'Euro (€)' },
                { value: 'GBP', label: 'British Pound (£)' },
                { value: 'JPY', label: 'Japanese Yen (¥)' },
                { value: 'CNY', label: 'Chinese Yuan (¥)' },
                { value: 'KRW', label: 'South Korean Won (₩)' },
                { value: 'INR', label: 'Indian Rupee (₹)' },
                { value: 'BRL', label: 'Brazilian Real (R$)' },
                { value: 'CAD', label: 'Canadian Dollar (C$)' },
                { value: 'AUD', label: 'Australian Dollar (A$)' },
                { value: 'CHF', label: 'Swiss Franc (CHF)' },
                { value: 'SEK', label: 'Swedish Krona (kr)' },
                { value: 'NOK', label: 'Norwegian Krone (kr)' },
                { value: 'RUB', label: 'Russian Ruble (₽)' },
                { value: 'TON', label: 'TON Cryptocurrency' }
              ]}
              icon={CurrencyDollarIcon}
            />

            <SettingToggle
              label="Show Hints"
              description="Display helpful tips and guidance throughout the game"
              value={localSettings.showHints}
              onChange={(value) => setLocalSettings(prev => ({ ...prev, showHints: value }))}
              icon={QuestionMarkCircleIcon}
            />
          </div>
        )}

        {/* Account Settings */}
        {activeTab === 'account' && (
          <div className="space-y-4">
            {/* Player Info */}
            <div className="p-4 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-blue-400" />
                Player Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Username:</span>
                  <span className="text-white">{player?.username || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Level:</span>
                  <span className="text-white">{player?.level || 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Earned:</span>
                  <span className="text-white">${player?.totalEarned?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Member Since:</span>
                  <span className="text-white">
                    {player?.createdAt ? new Date(player.createdAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            {/* TON Wallet Connection */}
            <div className="p-4 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <LinkIcon className="h-5 w-5 mr-2 text-blue-400" />
                TON Wallet Connection
              </h3>
              <div className="space-y-3">
                {wallet ? (
                  <div>
                    <p className="text-green-400 mb-2">✓ Wallet Connected</p>
                    <p className="text-gray-400 text-sm">
                      Address: {wallet.account.address.slice(0, 8)}...{wallet.account.address.slice(-8)}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400 mb-2">No wallet connected</p>
                )}
                <TonConnectButton />
              </div>
            </div>

            {/* Bot Integration */}
            <div className="p-4 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <DevicePhoneMobileIcon className="h-5 w-5 mr-2 text-blue-400" />
                Telegram Bot Integration
              </h3>
              <div className="space-y-3">
                <p className="text-gray-400 text-sm">
                  Connect with our Telegram bot for notifications and quick access
                </p>
                <button
                  onClick={generateAccessCode}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Generate Access Code
                </button>
                {showAccessCode && (
                  <div className="p-3 bg-blue-900 rounded-lg">
                    <p className="text-blue-200 text-sm mb-2">Your access code (expires in 5 minutes):</p>
                    <p className="text-white font-mono text-lg">{accessCode}</p>
                    <p className="text-blue-200 text-xs mt-2">
                      Send this code to @BillionaireEmpireBot to link your account
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <SettingToggle
              label="Push Notifications"
              description="Receive notifications about game events and updates"
              value={localSettings.notifications}
              onChange={(value) => setLocalSettings(prev => ({ ...prev, notifications: value }))}
              icon={BellIcon}
            />

            <SettingToggle
              label="Sound Effects"
              description="Play sound effects for actions and achievements"
              value={localSettings.soundEffects}
              onChange={(value) => setLocalSettings(prev => ({ ...prev, soundEffects: value }))}
            />

            <SettingToggle
              label="Vibration"
              description="Use device vibration for feedback"
              value={localSettings.vibration}
              onChange={(value) => setLocalSettings(prev => ({ ...prev, vibration: value }))}
            />

            {/* Auto-Collect Premium Feature */}
            <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-4 border border-purple-500">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <BanknotesIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Auto-Collect Earnings</h4>
                    <p className="text-sm text-purple-200">Automatically collect business earnings when available</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">PREMIUM</span>
                  <button
                    onClick={() => {
                      if (localSettings.autoCollect) {
                        setLocalSettings(prev => ({ ...prev, autoCollect: false }));
                      } else {
                        // Show purchase modal for auto-collect feature
                        alert('Purchase Auto-Collect for 5 TON to automatically collect your business earnings!');
                      }
                    }}
                    className={`w-12 h-6 rounded-full transition-colors ${localSettings.autoCollect ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${localSettings.autoCollect ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                  </button>
                </div>
              </div>
              <div className="text-xs text-purple-300">
                💎 Cost: 5 TON • ⚡ Saves time • 📈 Never miss earnings
              </div>
            </div>

            {/* Currency Display Settings */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3">Currency Display</h4>
              <p className="text-sm text-gray-400 mb-4">Choose how currency is displayed throughout the app</p>

              <div className="space-y-2">
                {[
                  { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
                  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
                  { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
                  { value: 'JPY', label: 'Japanese Yen (¥)', symbol: '¥' },
                  { value: 'CAD', label: 'Canadian Dollar (C$)', symbol: 'C$' },
                  { value: 'AUD', label: 'Australian Dollar (A$)', symbol: 'A$' },
                  { value: 'CHF', label: 'Swiss Franc (CHF)', symbol: 'CHF' },
                  { value: 'CNY', label: 'Chinese Yuan (¥)', symbol: '¥' },
                  { value: 'KRW', label: 'South Korean Won (₩)', symbol: '₩' },
                  { value: 'INR', label: 'Indian Rupee (₹)', symbol: '₹' },
                  { value: 'BRL', label: 'Brazilian Real (R$)', symbol: 'R$' },
                  { value: 'RUB', label: 'Russian Ruble (₽)', symbol: '₽' },
                  { value: 'TON', label: 'Toncoin (TON)', symbol: 'TON' }
                ].map((currency) => (
                  <button
                    key={currency.value}
                    onClick={() => setLocalSettings(prev => ({ ...prev, currency: currency.value }))}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${localSettings.currency === currency.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{currency.label}</span>
                      <span className="text-sm opacity-75">{currency.symbol}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <SettingToggle
              label="Auto-Save"
              description="Automatically save your progress"
              value={localSettings.autoSave}
              onChange={(value) => setLocalSettings(prev => ({ ...prev, autoSave: value }))}
              icon={ShieldCheckIcon}
            />

            <div className="p-4 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <ShieldCheckIcon className="h-5 w-5 mr-2 text-blue-400" />
                Data Management
              </h3>
              <div className="space-y-3">
                <button
                  onClick={exportData}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Export Game Data
                </button>
                <p className="text-gray-400 text-sm">
                  Download a backup of your game progress and settings
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Advanced */}
        {activeTab === 'advanced' && (
          <div className="space-y-4">
            <div className="p-4 bg-red-900 border border-red-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-red-400">
                <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                Danger Zone
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Reset All Progress
                </button>
                <p className="text-red-200 text-sm">
                  This will permanently delete all your game progress. This action cannot be undone!
                </p>
              </div>
            </div>

            {/* Debug Info */}
            <div className="p-4 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Debug Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">App Version:</span>
                  <span className="text-white">3.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Platform:</span>
                  <span className="text-white">{window.Telegram?.WebApp ? 'Telegram' : 'Web'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Storage Used:</span>
                  <span className="text-white">
                    {Math.round(JSON.stringify(localStorage).length / 1024)}KB
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-red-400 mb-4">Confirm Reset</h3>
            <p className="text-gray-300 mb-6">
              Are you absolutely sure you want to reset all progress? This will delete:
            </p>
            <ul className="text-gray-400 text-sm mb-6 space-y-1">
              <li>• All businesses and investments</li>
              <li>• Player level and achievements</li>
              <li>• Staking positions and rewards</li>
              <li>• Settings and preferences</li>
            </ul>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={resetProgress}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage; 
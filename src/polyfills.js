// Polyfills for Node.js modules in browser environment
import { Buffer } from 'buffer';

// Make Buffer available globally
window.Buffer = Buffer;
globalThis.Buffer = Buffer;

// Debug: Log that Buffer is available
console.log('✅ Buffer polyfill loaded:', typeof Buffer !== 'undefined');

// Set up global object
if (typeof global === 'undefined') {
  window.global = globalThis;
}

// Set up process object
if (typeof process === 'undefined') {
  window.process = {
    env: {},
    browser: true,
    version: '',
    versions: { node: '18.0.0' }
  };
}

export { Buffer }; 
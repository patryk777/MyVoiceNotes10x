import '@testing-library/jest-dom';

// Fix for React 19 - globalThis.IS_REACT_ACT_ENVIRONMENT
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// React 19 moved act from react-dom/test-utils to react
// This polyfill ensures compatibility
const React = require('react');
const ReactDOM = require('react-dom');

if (typeof React.act === 'undefined') {
  // For React 19, act should be available on React
  // If not, we need to create a proper implementation
  const { act: reactDomAct } = require('react-dom/test-utils');
  if (reactDomAct) {
    React.act = reactDomAct;
  } else {
    // Fallback implementation
    React.act = (callback) => {
      const result = callback();
      if (result && typeof result.then === 'function') {
        return result;
      }
      return Promise.resolve(result);
    };
  }
}

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

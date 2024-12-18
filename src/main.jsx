import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx'; // Ensure the file extension matches
import Amplify from 'aws-amplify';
import config from './aws-exports';
import { AmplifyProvider } from '@aws-amplify/ui-react';

Amplify.configure(config);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AmplifyProvider>
      <App />
    </AmplifyProvider>
  </React.StrictMode>
);
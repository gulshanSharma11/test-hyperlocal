import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import ItemDetail from './components/ItemDetail'; // Import ItemDetail component
import { Auth0Provider } from '@auth0/auth0-react';
import { ToastContainer } from 'react-toastify';
import StarterPage from './components/StarterPage';



const Root = () => (
  <Auth0Provider
    domain="dev-wrmifwelyxdgusuj.us.auth0.com"
    clientId="5DA2zwsyMJCK85MRViIjjrWQxbcYC1uf"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
  <ToastContainer
  theme='dark'
position="top-right"
autoClose={3000}
closeOnClick
pauseOnHover={true}

/>

<ToastContainer />
    <Router>
      <Routes>
      <Route path="/" element={<StarterPage />} />
        <Route path="/:society/*" element={<App />} />
        <Route path="/item/:itemName" element={<ItemDetail />} />
      </Routes>
    </Router>
  </Auth0Provider>
);

ReactDOM.render(<Root />, document.getElementById('root'));

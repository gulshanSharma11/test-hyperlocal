import React from 'react';
import { Link } from 'react-router-dom';
import './StarterPage.css';
import Header from "./Header";

const StarterPage = () => {
  return (
    <>
<Header/>
    <div className="starter-page">
    
      <h1>Choose Your Society</h1>
      <div className="society-links">
        <Link to="/mahaguna-moderne">Mahaguna Moderne Society</Link>
        <Link to="/mahaguna-historic">Mahaguna Historic Society</Link>
      </div>
    </div>
    </>
  );
};

export default StarterPage;
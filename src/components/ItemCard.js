import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import './PriorityUpdater.css';

const ItemCard = ({ item, ratings, handleRate, getAverageRating, isAuthenticated, onPriorityChange }) => {
  const [priority, setPriority] = useState(item.priority || 5);

  const handlePriorityChange = (newPriority) => {
    setPriority(newPriority);
    onPriorityChange(item.name, newPriority);
  };

  return (
    <div className={`card priority-${priority}`}>
      <Link to={`/item/${item.name}`}>
        <h3>{item.name}</h3>
      </Link>
      {Array.isArray(item.phone) ? (
        <p>
          {item.phone.map((phone, i) => (
            <a key={i} href={`tel:${phone}`}>
              {phone}
            </a>
          )).reduce((prev, curr) => [prev, ', ', curr])}
        </p>
      ) : (
        <p><a href={`tel:${item.phone}`}>{item.phone}</a></p>
      )}
      {item.address && <p>Address: {item.address}</p>}
      {item.specialization && <p>Specialization: {item.specialization}</p>}
      {item.website && (
        <p>
          Website:{" "}
          {item.website.map((site, i) => (
            <span key={i}>
              <a href={`http://${site}`} target="_blank" rel="noopener noreferrer">
                {site}
              </a>
              {i < item.website.length - 1 && ", "}
            </span>
          ))}
        </p>
      )}
      {item.google_maps && (
        <p>
          <a href={item.google_maps} target="_blank" rel="noopener noreferrer">
            Google Maps Location
          </a>
        </p>
      )}
      <Rating
        rating={(ratings[item.name]?.sum / ratings[item.name]?.count) || 0}
        onRate={(rating) => handleRate(item.name, rating)}
        numRatings={ratings[item.name]?.count || 0}
        averageRating={getAverageRating(item.name)}
      />
      <div className="priority-controls">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => handlePriorityChange(value)}
            className={priority === value ? 'active' : ''}
          >
            Priority {value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ItemCard;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './item.css';

const ItemDetail = () => {
  const { itemName } = useParams();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://raw.githubusercontent.com/ayushku634/ayushku634/main/data.json");
        const allData = response.data.flatMap(category => category.data);
        const foundItem = allData.find(item => item.name === itemName);
        if (foundItem) {
          setItem(foundItem);
        } else {
          throw new Error(`Item '${itemName}' not found`);
        }
      } catch (error) {
        setIsError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [itemName]);

  if (isLoading) return <h2>Loading...</h2>;
  if (isError) return <h2>Error: {isError}</h2>;
  if (!item) return <h2>Item not found</h2>;

  return (
    <div className="item-detail">
      <h2>{item.name}</h2>
      {Array.isArray(item.phone) ? (
        <p>{item.phone.join(", ")}</p>
      ) : (
        <p>{item.phone}</p>
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
    </div>
  );
};

export default ItemDetail;

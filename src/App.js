import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategoryDropdown from './components/CategoryDropdown';
import ItemCard from './components/ItemCard';
import ItemDetail from './components/ItemDetail';
import Header from './components/Header';
import './App.css';

const App = () => {
  const [myData, setMyData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isError, setIsError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const { user, loginWithRedirect, logout, isAuthenticated } = useAuth0();

  useEffect(() => {
    axios
      .get("https://raw.githubusercontent.com/ayushku634/ayushku634/main/data.json")
      .then((response) => {
        const dataWithPriority = response.data.map(category => ({
          ...category,
          data: category.data.map(item => ({
            ...item,
            priority: item.priority || 5 // Set default priority to 5
          }))
        }));
        setMyData(dataWithPriority);
        if (dataWithPriority.length > 0) {
          setSelectedCategory(dataWithPriority[0].cat_id.toString());
        }
        setIsLoading(false);
        fetchRatings();
      })
      .catch((error) => {
        setIsError(error.message);
        setIsLoading(false);
      });
  }, []);

  const fetchRatings = async () => {
    try {
      const response = await axios.get('http://localhost:5003/api/ratings');
      const ratings = response.data.reduce((acc, rating) => {
        const { itemId, rating: rate, userEmail } = rating;
        if (!acc[itemId]) {
          acc[itemId] = { count: 0, sum: 0, users: [] };
        }
        acc[itemId].count += 1;
        acc[itemId].sum += rate;
        acc[itemId].users.push(userEmail);
        return acc;
      }, {});
      setRatings(ratings);
    } catch (error) {
      toast.error('Error fetching ratings: ' + error.message);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleRate = async (itemId, rating) => {
    if (!isAuthenticated) {
      loginWithRedirect().then(() => {
        // Login successful
      }).catch((error) => {
        toast.error('Error during login:', error.message);
      });
    } else {
      const currentRatings = ratings[itemId] || { count: 0, sum: 0, users: [] };
      if (currentRatings.users.includes(user.email)) {
        toast.error("You have already rated this item.");
        return;
      }

      try {
        const response = await axios.post('http://localhost:5003/api/ratings', {
          itemId,
          userEmail: user.email,
          rating
        });

        if (response.status === 201) {
          rateItem(itemId, rating, user.email);
          fetchRatings();
        } else {
          toast.error('Failed to submit rating');
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error('You have already rated this item.');
        } else {
          toast.error('Error submitting rating: ' + error.message);
        }
      }
    }
  };

  const rateItem = (itemId, rating, userEmail) => {
    setRatings((prevRatings) => {
      const currentRatings = prevRatings[itemId] || { count: 0, sum: 0, users: [] };
      const updatedRatings = {
        ...prevRatings,
        [itemId]: {
          count: currentRatings.count + 1,
          sum: currentRatings.sum + rating,
          users: [...currentRatings.users, userEmail]
        },
      };

      localStorage.setItem('ratings', JSON.stringify(updatedRatings));

      return updatedRatings;
    });
  };

  const getAverageRating = (itemId) => {
    const currentRatings = ratings[itemId] || { count: 0, sum: 0 };
    return currentRatings.count > 0 ? currentRatings.sum / currentRatings.count : 0;
  };

  const handlePriorityChange = (itemId, newPriority) => {
    setMyData((prevData) => {
      const updatedData = prevData.map((category) => {
        if (category.cat_id.toString() === selectedCategory) {
          return {
            ...category,
            data: category.data.map((item) => {
              if (item.name === itemId) {
                return { ...item, priority: newPriority };
              }
              return item;
            }).sort((a, b) => a.priority - b.priority)
          };
        }
        return category;
      });
      return updatedData;
    });
  };

  const selectedData = myData.find(
    (category) => category.cat_id.toString() === selectedCategory
  );

  return (
    <>
      <Header user={user} isAuthenticated={isAuthenticated} onLogin={loginWithRedirect} onLogout={logout} />

      <Routes>
        <Route path="/" element={
          <>
            <h1>Contact Information</h1>
            {isLoading ? (
              <h2>Loading...</h2>
            ) : isError ? (
              <h2>Error: {isError}</h2>
            ) : (
              <>
                <CategoryDropdown 
                  categories={myData} 
                  selectedCategory={selectedCategory} 
                  handleCategoryChange={handleCategoryChange} 
                />

                {selectedData && (
                  <>
                    <h2 className="category-heading">{selectedData.cat}</h2>
                    <div className="grid">
                      {selectedData.data.map((item, index) => (
                        <ItemCard
                          key={index}
                          item={item}
                          ratings={ratings}
                          handleRate={handleRate}
                          getAverageRating={getAverageRating}
                          isAuthenticated={isAuthenticated}
                          onPriorityChange={handlePriorityChange}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        } />
        <Route path="/item/:itemName" element={<ItemDetail data={myData} />} />
      </Routes>
    </>
  );
};

export default App;

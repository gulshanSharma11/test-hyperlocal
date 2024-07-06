import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './PriorityUpdater.css';


const PriorityUpdater = ({ itemId, currentPriority }) => {
  const [priority, setPriority] = useState(currentPriority);
  

  const handlePriorityChange = async (event) => {
    const newPriority = event.target.value;
    setPriority(newPriority);

    try {
      await axios.put(`http://localhost:5003/api/items/${itemId}/priority`, { priority: newPriority });
      toast.success('Priority updated successfully');
    } catch (error) {
      toast.error('Error updating priority');
    }
  };

  return (
    <div className="priority-updater">
      <label htmlFor="priority">Priority: </label>
      <select id="priority" value={priority} onChange={handlePriorityChange}>
        {[1, 2, 3, 4, 5].map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>
  );
};

export default PriorityUpdater;

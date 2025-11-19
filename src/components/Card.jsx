import React from 'react';
import './Card.css';

const Card = ({ title, items, iconMap }) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {iconMap[item] && <img src={iconMap[item]} alt={item} className="card-icon" />}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Card;

// src/components/AvatarCard.jsx
import React from 'react';
import '../css/AvatarCard.css';
import avatar from '../assets/avatar.jpg';

function AvatarCard() {
  return (
    <div className="photo-section">
      <img
        className="avatar-img"
        src={avatar}
        alt="Tony Yang"
      />
      <div className="photo-name">Tony Yang</div>
      <div className="photo-links">
        <a href="mailto:tony.yang972@gmail.com" target="_blank" rel="noopener noreferrer">
          <i className="fas fa-envelope"></i>
        </a>
        <a
          href="https://www.credly.com/badges/60949ad8-07f2-489f-8442-cf50a8a067e9/linked_in_profile"
          target="_blank"
          rel="noopener noreferrer"
          title="AWS Certified Developer – Associate"
        >
          <i className="fas fa-certificate"></i>
        </a>
      </div>
    </div>
  );
}

export default AvatarCard;

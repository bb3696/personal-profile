// src/components/AvatarCard.jsx
import React from 'react';
import '../css/AvatarCard.css'; // 引入样式文件
import avatar from "../assets/avatar.jpeg"; // 引入头像图片

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
      </div>
    </div>
  );
}

export default AvatarCard;

// src/components/AvatarCard.jsx
import React from 'react';
import '../css/AvatarCard.css'; // 引入样式文件

function AvatarCard() {
  return (
    <div className="photo-section">
      <img
        className="avatar-img"
        src="https://media.licdn.com/dms/image/v2/D4D03AQGHgjh7LBpD5w/profile-displayphoto-shrink_400_400/B4DZY9dRs6GwAk-/0/1744787807337?e=1756339200&v=beta&t=6fVsamGCSYec_I-sQnpb7FZLwqngtS_Fce01LcNd2f8"
        alt="Tony Yang"
      />
      <div className="photo-name">Tony Yang</div>
      <div className="photo-links">
        <a href="https://github.com/bb3696" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-github"></i>
        </a>
        <a href="https://www.linkedin.com/in/syang972/" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-linkedin"></i>
        </a>
        <a href="mailto:syangnate972@gmail.com" target="_blank" rel="noopener noreferrer">
          <i className="fas fa-envelope"></i>
        </a>
      </div>
    </div>
  );
}

export default AvatarCard;

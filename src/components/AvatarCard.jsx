import React from 'react';
import { Award } from 'lucide-react';
import '../css/AvatarCard.css';
import avatar from '../assets/avatar.jpg';

const awsCredentialUrl = 'https://www.credly.com/badges/60949ad8-07f2-489f-8442-cf50a8a067e9/linked_in_profile';

function AvatarCard() {
  return (
    <section className="photo-section" aria-label="Tony Yang profile">
      <img
        className="avatar-img"
        src={avatar}
        alt="Tony Yang"
        width="240"
        height="240"
        decoding="async"
        fetchpriority="high"
      />
      <div className="photo-copy">
        <div className="photo-name">Tony Yang</div>
        <p>Full Stack Engineer focused on Java, Spring Boot, React, Cloud and AI</p>
        <a
          className="photo-credential"
          href={awsCredentialUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Award aria-hidden="true" size={16} strokeWidth={1.9} />
          AWS Certified Developer
        </a>
      </div>
    </section>
  );
}

export default AvatarCard;

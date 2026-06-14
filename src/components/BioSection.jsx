import React from 'react';
import '../css/BioSection.css';

function BioSection() {
  return (
    <section className="bio-section" id="about" aria-labelledby="about-title">
      <div className="section-heading">
        <p className="section-kicker">About</p>
        <h2 id="about-title">Full stack engineering with a personal travel log.</h2>
      </div>

      <div className="bio-layout">
        <p className="bio-lead">
          I'm a Full Stack Engineer focused on Java, Spring Boot, React, and building clean, maintainable web applications.
        </p>
        <div className="bio-notes" aria-label="Engineering principles">
          <p>
            I like working across the backend and frontend, turning ideas into practical tools with clear structure and thoughtful interfaces.
          </p>
          <p>
            Outside of work, I enjoy traveling and visiting national parks. This site is a small place to share what I build and keep track of where I've been.
          </p>
        </div>
      </div>
    </section>
  );
}

export default BioSection;

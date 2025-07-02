// src/components/BioSection.jsx
import React from 'react';
import '../css/BioSection.css'; // 引入样式文件


function BioSection() {
  return (
    <div className="bio-section">
      <p className="bio">
        I'm a Full Stack Developer at <a href="https://www.antra.com" className="static-link" target="_blank" rel="noopener noreferrer">Antra</a>,
        with hands-on experience building scalable, user-focused web applications. I specialize in backend development using Java, Spring Boot, and JPA/Hibernate, and create responsive frontends with React and TypeScript.
      </p>
      <p className="bio">
        I've worked across the full development lifecycle—from designing databases in MySQL/PostgreSQL to deploying applications on AWS (EC2, S3, RDS). I also implement CI/CD pipelines using GitHub Actions and Docker to support fast, reliable releases.
      </p>
      <p className="bio">
         I take pride in writing clean, testable code that connects robust backend logic with intuitive user interfaces. My goal is to build maintainable, high-performance solutions that solve real-world business problems effectively.
      </p>
      <p className="bio">
        Check out my projects <a href="/project1.html" className="static-link">here</a> and <a href="#" className="static-link">here</a>.
      </p>
      <p className="bio">
        I love hiking! Here's a record of the parks I've <a href="/parks" className="static-link">visited</a> and the states I've <a href="/usmap" className="static-link">visited</a>.
      </p>
    </div>
  );
}

export default BioSection;

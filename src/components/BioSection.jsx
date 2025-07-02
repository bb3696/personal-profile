// src/components/BioSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
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
        Check out my projects <Link to="/project1" className="static-link">here</Link> and <Link to="#" className="static-link">here</Link>.
      </p>
      <p className="bio">
        I love hiking! Here's a record of the parks I've <Link to="/parks" className="static-link">visited</Link> and the states I've <Link to="/usmap" className="static-link">visited</Link>.
      </p>
    </div>
  );
}

export default BioSection;

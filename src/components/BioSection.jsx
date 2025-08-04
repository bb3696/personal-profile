// src/components/BioSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/BioSection.css'; // 引入样式文件


function BioSection() {
  return (
    <div className="bio-section">
      <p className="bio">
        I’m a Full Stack Developer with experience building scalable, event-driven web applications across logistics, e-commerce, and healthcare domains.
      </p>
      <p className="bio">
        My backend expertise includes Java 17, Spring Boot 3, and JPA/Hibernate. On the frontend, I build responsive user interfaces using ReactJS. I deploy cloud-native systems on AWS and set up CI/CD pipelines with GitHub Actions, Docker, and Terraform.
      </p>
      <p className="bio">
         Beyond Java, I also leverage Python and Django for data-driven applications, and have explored machine learning projects including neural style transfer using VGG models. I actively use tools like GitHub Copilot, Claude, and ChatGPT to enhance productivity and streamline development.
      </p>
      <p className="bio">
        Outside of tech, I’m passionate about hiking. Check out the <Link to="/parks" className="static-link">National-Parks</Link> and the <Link to="/usmap" className="static-link">States</Link> I've explored.
      </p>
    </div>
  );
}

export default BioSection;

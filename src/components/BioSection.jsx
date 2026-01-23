import React from 'react';
import { Link } from 'react-router-dom';
import '../css/BioSection.css';


function BioSection() {
  return (
    <div className="bio-section">
      <p className="bio">
        I’m a Full-Stack engineer building highly available, cloud-native systems with Java, Spring Boot, and React. I design and deliver scalable platforms on AWS across microservices, CI/CD, observability, and performance engineering, turning complex requirements into clean, reliable solutions.
      </p>
      <p className="bio">
        I focus on real-world complexity: event-driven pipelines, async workflows, integrations, and production bottlenecks. From reducing latency with caching to improving resilience through Kafka tuning and automated testing, my goal is simple—make systems faster, more stable, and easier to evolve.      </p>
      <p className="bio">
        Beyond backend engineering, I explore data platforms and generative AI in production. I believe the future lies at the intersection of cloud, data, and AI—and my focus is turning emerging technology into reliable, scalable system capabilities.      </p>
      <p className="bio">
        Outside of tech, I’m passionate about hiking. Check out the <Link to="/parks" className="static-link">National-Parks</Link> and <Link to="/usmap" className="static-link">States</Link> I've explored.
      </p>
    </div>
  );
}

export default BioSection;

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AvatarCard from '../components/AvatarCard';
import TopNav from '../components/TopNav';
import { useInteractiveBackground } from '../hooks/useInteractiveBackground';
import '../css/Home.css';

const MotionSection = motion.section;

const techNotes = ['Java', 'Spring Boot', 'React', 'JavaScript', 'REST APIs', 'Responsive UI'];

function Home() {
  useInteractiveBackground();

  return (
    <main className="about-page">
      <TopNav />

      <MotionSection
        className="about-shell"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: 'easeOut' }}
        aria-labelledby="about-title"
      >
        <div className="about-copy">
          <p className="about-eyebrow">Tony Yang</p>
          <h1 id="about-title">Hi, I&apos;m Tony. A Full Stack Engineer building with Java, Spring Boot, and React.</h1>
          <div className="about-text">
            <p>
              I build clean, practical web apps across backend and frontend, with clear structure and thoughtful interfaces.
            </p>
            <p>
              My work centers on Java, Spring Boot, React, and user experiences that are straightforward to use and maintain.
            </p>
            <p>
              Outside of coding, I like exploring national parks and keeping a simple travel log of the states and parks I&apos;ve visited.
            </p>
          </div>

          <div className="about-tags" aria-label="Technical background">
            {techNotes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>

          <div className="about-links" aria-label="Profile links">
            <Link className="about-link" to="/projects">
              View projects and travel log
              <ArrowRight aria-hidden="true" size={17} strokeWidth={1.9} />
            </Link>
          </div>
        </div>

        <AvatarCard />
      </MotionSection>
    </main>
  );
}

export default Home;

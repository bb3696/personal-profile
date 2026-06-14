import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Map, Mountain } from 'lucide-react';
import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { DEFAULT_VISITED, PARK_NAMES } from '../data/parkList';
import { DEFAULT_VISITED_STATES } from '../data/stateList';
import { useInteractiveBackground } from '../hooks/useInteractiveBackground';
import '../css/Projects.css';

const trackerLinks = [
  {
    description: 'A personal checklist of the national parks I have visited, with notes, photos, and progress along the way.',
    icon: Mountain,
    meta: `${DEFAULT_VISITED.length} / ${PARK_NAMES.length} parks`,
    title: 'National Parks',
    to: '/parks',
  },
  {
    description: 'An interactive map showing the states I have traveled to across the U.S.',
    icon: Map,
    meta: `${DEFAULT_VISITED_STATES.length} / 50 states`,
    title: 'U.S. States Map',
    to: '/usmap',
  },
];

const MotionArticle = motion.article;
const MotionSection = motion.section;

function Projects() {
  useInteractiveBackground();

  return (
    <main className="projects-page">
      <TopNav />

      <MotionSection
        className="projects-shell"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: 'easeOut' }}
        aria-labelledby="projects-title"
      >
        <div className="projects-heading">
          <p className="section-kicker">Projects</p>
          <h1 id="projects-title">Things I Built</h1>
          <p>
            Selected personal work, kept simple: practical web applications, clean interfaces, and small tools that are useful to me.
          </p>
        </div>

        <section className="travel-log" id="travel-log" aria-labelledby="travel-log-title">
          <div className="travel-log-heading">
            <p className="section-kicker">Travel</p>
            <h2 id="travel-log-title">Travel Log</h2>
            <p>
              A simple travel record built into this site, tracking national parks I&apos;ve visited and U.S. states I&apos;ve explored.
            </p>
          </div>

          <div className="tracker-grid" aria-label="Travel Log sections">
          {trackerLinks.map(({ description, icon: Icon, meta, title, to }) => (
            <MotionArticle
              className="tracker-card"
              key={title}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Link to={to}>
                {React.createElement(Icon, {
                  'aria-hidden': true,
                  size: 28,
                  strokeWidth: 1.75,
                })}
                <span>{meta}</span>
                <h2>{title}</h2>
                <p>{description}</p>
                <strong>
                  Open tracker
                  <ArrowRight aria-hidden="true" size={16} strokeWidth={1.8} />
                </strong>
              </Link>
            </MotionArticle>
          ))}
          </div>
        </section>

      </MotionSection>
    </main>
  );
}

export default Projects;

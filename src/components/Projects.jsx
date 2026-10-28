import PropTypes from 'prop-types';
import { portfolio } from '../constants/portfolio';
import HeadingReveal from './editorial/HeadingReveal';
import ProjectMedia from './ProjectMedia';
import CaseDisclosure from './CaseDisclosure';

export default function Projects({ animate }) {
  const { rideImage, rideVideo, ride } = portfolio;
  return (
    <section
      id="projects"
      tabIndex={-1}
      className="work-section section-pad"
      aria-labelledby="work-title"
    >
      <div className="section-heading">
        <p className="micro">01 / Selected work</p>
        <HeadingReveal animate={animate} id="work-title">
          Made to <em>move.</em>
        </HeadingReveal>
      </div>
      <article className="featured-project" aria-labelledby="ride-title">
        <div className="project-intro">
          <div>
            <p className="micro muted">Independent project / Design + development</p>
            <h3 id="ride-title" className="project-wordmark">
              RIDE<span>SD</span>
            </h3>
          </div>
          <div className="project-description">
            <p>
              From a GPS recording to the story of a ride. Explore a route, replay a session, and
              compare what happened at each corner.
            </p>
            <a className="text-link" href={ride.repository} target="_blank" rel="noreferrer">
              Explore the code <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className="project-stage">
          <div className="project-screen">
            <div className="screen-toolbar">
              <span className="window-dots" aria-hidden="true">
                ● ● ●
              </span>
              <span>RIDE SD / Route explorer</span>
            </div>
            <ProjectMedia
              image={rideImage}
              video={rideVideo}
              motionEnabled={animate}
              title="RIDE SD ride playback preview"
              caption="Route, speed profile, and corner detail in one view."
            />
          </div>
        </div>
        <dl className="project-facts">
          <div>
            <dt className="micro muted">My role</dt>
            <dd>Interface design & development</dd>
          </div>
          <div>
            <dt className="micro muted">Built with</dt>
            <dd>Next.js · TypeScript · MapLibre</dd>
          </div>
          <div>
            <dt className="micro muted">Focus</dt>
            <dd>Maps, data & interaction</dd>
          </div>
        </dl>
        <div className="case-study">
          <CaseDisclosure
            className="challenge-notes"
            title="Challenge &amp; approach"
            animate={animate}
          >
            <div className="case-intro">
              <p className="micro muted">The challenge</p>
              <h4 id="case-title" className="heading heading--title">
                What happened at that corner?
              </h4>
              <p>
                A line on a map tells you where you rode. Understanding a particular corner means
                connecting its location with speed and direction of travel. RIDE SD brings those
                pieces together so a rider can inspect one moment without losing the context of the
                route.
              </p>
            </div>
            <div className="case-content">
              {ride.decisions.map((decision, index) => (
                <div key={decision.title}>
                  <p className="micro">
                    0{index + 1} / {decision.label}
                  </p>
                  <h5 className="heading heading--subtitle">{decision.title}</h5>
                  <p>{decision.description}</p>
                </div>
              ))}
            </div>
            <div className="case-detail">
              <figure className="detail-figure">
                <div className="detail-crop">
                  <img
                    src={rideImage.src}
                    width={rideImage.width}
                    height={rideImage.height}
                    loading="lazy"
                    decoding="async"
                    alt="Detail of the RIDE SD speed profile: corner markers sit behind the cyan speed trace, with a playback position and speed reading."
                  />
                </div>
                <figcaption>
                  Speed in context: corner markers and the ride trace share the same distance axis.
                </figcaption>
              </figure>
              <div className="detail-copy">
                <p className="micro muted">Interaction detail</p>
                <h5 className="heading heading--title">One corner. Connected views.</h5>
                <p>
                  Hover over the speed profile for a reading; select a corner to inspect it on the
                  map and in the detail panel. The same selection connects geography with the
                  numbers.
                </p>
                <a className="text-link" href={rideImage.src} target="_blank" rel="noreferrer">
                  View full interface <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
            <div className="case-refinement">
              <div>
                <p className="micro muted">A refinement that mattered</p>
                <h5 className="heading heading--subtitle">Keep playback honest.</h5>
                <p>
                  Earlier playback imposed a minimum movement speed to keep the rider marker moving
                  through stops. The revised version follows recorded timestamps and removes
                  confirmed stationary breaks. Slow riding stays slow, without making a long
                  recording pause part of the replay.
                </p>
                <a
                  className="text-link"
                  href={`${ride.repository}/commit/4f92881`}
                  target="_blank"
                  rel="noreferrer"
                >
                  See the implementation change <span aria-hidden="true">↗</span>
                </a>
              </div>
              <div>
                <p className="micro muted">Current scope</p>
                <h5 className="heading heading--subtitle">A working, focused prototype.</h5>
                <p>
                  The app supports four San Diego routes, with local GPX analysis and comparisons
                  within a session. Accounts and saved ride history are planned. The current focus
                  is making the ride-analysis experience reliable before expanding it.
                </p>
              </div>
            </div>
          </CaseDisclosure>
          <CaseDisclosure
            className="technical-notes"
            title="Engineering notes & verification"
            animate={animate}
          >
            <div className="technical-content">
              <div>
                <h5 className="heading heading--subtitle">Noisy input, useful comparisons.</h5>
                <p>
                  GPS samples are matched to road geometry, split into directional passes, and
                  smoothed before corner metrics are calculated. Savitzky–Golay smoothing reduces
                  noise while retaining the shape of speed changes. GPX processing runs in the
                  browser.
                </p>
              </div>
              <div>
                <h5 className="heading heading--subtitle">Make the edge cases explicit.</h5>
                <p>
                  The repository includes tests for route mismatches, pass ordering, stationary
                  breaks, playback, and incomplete corner coverage. Recordings need to match a
                  supported route; ambiguous matches are rejected with an explanation.
                </p>
                <a
                  className="text-link"
                  href={`${ride.repository}/tree/main/tests`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Browse the tests <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </CaseDisclosure>
        </div>
      </article>
    </section>
  );
}
Projects.propTypes = { animate: PropTypes.bool.isRequired };

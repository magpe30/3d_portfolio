import PropTypes from 'prop-types';
import { portfolio, projects } from '../constants/portfolio';
import HeadingReveal from './editorial/HeadingReveal';
import Reveal from './editorial/Reveal';
import CaseDisclosure from './CaseDisclosure';
import ProjectMedia from './ProjectMedia';

export default function CaseStudy({ slug, animate }) {
  const ride = slug === 'ride-sd';
  const project = projects.find((project) => project.id === slug);
  return (
    <main id="case-main" tabIndex={-1} className={`case-page case-page--${slug}`}>
      <section className="case-hero section-pad" aria-labelledby="case-heading">
        <a href="/#projects" className="text-link">
          ← All selected work
        </a>
        <p className="micro case-kicker">
          {ride ? '01 / RIDE SD' : '02 / Fluent'} · Independent project · Working prototype
        </p>
        <HeadingReveal as="h1" id="case-heading" animate={animate}>
          {ride ? (
            <>
              The story
              <br />
              inside a <em>ride.</em>
            </>
          ) : (
            <>
              A little space
              <br />
              to find your <em>voice.</em>
            </>
          )}
        </HeadingReveal>
        <div className="case-overview">
          <p>
            {ride
              ? 'I built RIDE SD to explore a recorded ride, with the route, speed, and corner details in one place.'
              : 'Fluent is a prototype for rehearsing a conversation, getting feedback, and having another go.'}
          </p>
          <dl>
            <div>
              <dt className="micro muted">My role</dt>
              <dd>Interface design & development</dd>
            </div>
            <div>
              <dt className="micro muted">Technology</dt>
              <dd>{project.stack}</dd>
            </div>
          </dl>
        </div>
      </section>
      <div className="case-feature section-pad">
        {ride ? (
          <ProjectMedia
            image={portfolio.rideImage}
            video={portfolio.rideVideo}
            animate={animate}
            title="RIDE SD ride playback preview"
            caption="Route, speed profile, and corner detail in one view."
          />
        ) : (
          <img
            src={project.image.src}
            width={project.image.width}
            height={project.image.height}
            alt="Fluent’s preparation screen invites a learner to describe a conversation to practice."
          />
        )}
      </div>
      {ride ? <RideStory animate={animate} /> : <FluentStory animate={animate} />}
      <section className="case-next section-pad" aria-label="Next project">
        <p className="micro">Keep exploring</p>
        <a href={`/work/${ride ? 'fluent' : 'ride-sd'}`}>
          {ride ? 'Fluent' : 'RIDE SD'} <span aria-hidden="true">↗</span>
        </a>
        <a className="text-link" href="/#contact">
          Get in touch <span aria-hidden="true">↗</span>
        </a>
      </section>
    </main>
  );
}
CaseStudy.propTypes = {
  slug: PropTypes.oneOf(['ride-sd', 'fluent']).isRequired,
  animate: PropTypes.bool.isRequired,
};

function RideStory({ animate }) {
  return (
    <div className="case-story section-pad">
      <section className="story-row" aria-labelledby="challenge-title">
        <p className="micro">01 / The problem</p>
        <div>
          <h2 id="challenge-title">What happened at that corner?</h2>
          <p>
            A GPS track shows where you went, but it takes more work to see how you rode a
            particular corner. I wanted to put its location, speed, and direction together, so a
            rider could look closely at one part of a ride and still see the whole route.
          </p>
        </div>
      </section>
      <section className="story-row" aria-labelledby="decisions-title">
        <p className="micro">02 / Design decisions</p>
        <div>
          <h2 id="decisions-title">How I put the views together.</h2>
          <div className="decision-list">
            {portfolio.ride.decisions.map((decision, index) => (
              <Reveal key={decision.title} animate={animate}>
                <p className="micro muted">
                  0{index + 1} / {decision.label}
                </p>
                <h3>{decision.title}</h3>
                <p>{decision.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <figure className="case-detail-image">
        <img
          src={portfolio.rideImage.src}
          width={portfolio.rideImage.width}
          height={portfolio.rideImage.height}
          loading="lazy"
          alt="RIDE SD’s connected map, corner panel, and speed profile."
        />
        <figcaption>
          Selecting a corner highlights it on the map and shows its speed data alongside it.
        </figcaption>
      </figure>
      <section className="story-row" aria-labelledby="refinement-title">
        <p className="micro">03 / A refinement</p>
        <div>
          <h2 id="refinement-title">Getting the playback timing right.</h2>
          <p>
            An earlier version forced a minimum playback speed, so the marker kept moving even
            during stops. I changed it to follow the recorded timestamps and skip confirmed breaks.
            Slow sections now play back at their recorded pace, while long stops are left out.
          </p>
          <a
            className="text-link"
            href={`${portfolio.ride.repository}/commit/4f92881`}
            target="_blank"
            rel="noreferrer"
          >
            See the code change <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
      <section className="story-row" aria-labelledby="scope-title">
        <p className="micro">04 / Where it is now</p>
        <div>
          <h2 id="scope-title">What works so far.</h2>
          <p>
            The prototype supports four San Diego routes. It can analyze GPX files in the browser,
            compare passes in the same direction, and replay a ride. Accounts and saved ride history
            are still on the list. For now, I’m focused on getting the analysis right.
          </p>
        </div>
      </section>
      <CaseDisclosure title="Under the hood & what I test" animate={animate}>
        <div className="technical-content">
          <div>
            <h3>Working with GPS data.</h3>
            <p>
              The app matches GPS points to the road and separates passes by direction.
              Savitzky–Golay smoothing reduces noise in the speed data while preserving the shape of
              speed changes. All GPX processing happens in the browser.
            </p>
          </div>
          <div>
            <h3>Checking where things can go wrong.</h3>
            <p>
              The tests cover mismatched routes, pass ordering, stops, playback, and missing data
              around corners. If a recording can’t be matched to a route confidently, the app
              explains the problem rather than guessing.
            </p>
            <a
              className="text-link"
              href={`${portfolio.ride.repository}/tree/main/tests`}
              target="_blank"
              rel="noreferrer"
            >
              Browse the tests <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </CaseDisclosure>
      <a
        className="button-link case-source"
        href={portfolio.ride.repository}
        target="_blank"
        rel="noreferrer"
      >
        View the repository <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}
RideStory.propTypes = { animate: PropTypes.bool.isRequired };

function FluentStory({ animate }) {
  return (
    <div className="case-story section-pad">
      <section className="story-row" aria-labelledby="challenge-title">
        <p className="micro">01 / The challenge</p>
        <div>
          <h2 id="challenge-title">Where do you start practicing?</h2>
          <p>
            “Speak more confidently” doesn’t give you much to start with. I wanted Fluent to begin
            with a conversation you can picture: who you’re talking to and what you want to say. You
            can then rehearse it and use the feedback for another attempt.
          </p>
        </div>
      </section>
      <section className="story-row" aria-labelledby="flow-title">
        <p className="micro">02 / The experience</p>
        <div>
          <h2 id="flow-title">Prepare, practice, try again.</h2>
          <ol className="practice-flow">
            <li>
              <span>01</span>
              <div>
                <h3>Prepare</h3>
                <p>Start with a situation and the point you want to make.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Practice</h3>
                <p>
                  Practice out loud. The interface shows when you’re connected and when the
                  microphone is on.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Reflect & try again</h3>
                <p>
                  Read the feedback, choose one thing to work on, and try the conversation again.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>
      <Reveal animate={animate} className="fluent-feedback">
        <figure>
          <img
            src="/images/fluent-feedback.png"
            width="1280"
            height="1512"
            loading="lazy"
            alt="Fluent sample feedback separates what worked, a sentence correction, and optional phrasing, followed by one thing to try."
          />
          <figcaption>Sample feedback from the scripted demo.</figcaption>
        </figure>
        <div>
          <p className="micro">Writing the feedback</p>
          <h2>A correction or a suggestion?</h2>
          <p>
            A grammar mistake and a different way of saying something need different feedback. I
            kept corrections separate from optional phrasing suggestions, so a learner can see what
            needs fixing and what they can take or leave.
          </p>
          <p>Each practice ends with one suggestion to try in the next attempt.</p>
        </div>
      </Reveal>
      <section className="story-row" aria-labelledby="system-title">
        <p className="micro">03 / Interface engineering</p>
        <div>
          <h2 id="system-title">The parts between the main screens.</h2>
          <p>
            I built reusable buttons for primary and secondary actions, including loading and
            disabled states. Their shapes are clipped, but keyboard focus stays visible around them.
            The recording flow also handles microphone permissions, lost connections, cancellation,
            and retries.
          </p>
          <div className="state-samples" aria-label="Illustrative button states">
            <span>Primary action ↗</span>
            <span>Secondary action ↗</span>
            <span aria-disabled="true">Processing…</span>
          </div>
          <p className="story-note">Examples of button states, shown here for reference.</p>
        </div>
      </section>
      <section className="story-row" aria-labelledby="scope-title">
        <p className="micro">04 / Where it is now</p>
        <div>
          <h2 id="scope-title">Still a work in progress.</h2>
          <p>
            The local app has a scripted demo and a live conversation integration. The demo lets you
            walk through the experience without using a microphone or making AI requests. Its
            feedback is labeled as a sample.
          </p>
          <p>
            I still need to evaluate the feedback quality, test how people use it, and finish saving
            practice sessions between visits.
          </p>
        </div>
      </section>
      <a
        className="button-link case-source"
        href={portfolio.fluent.repository}
        target="_blank"
        rel="noreferrer"
      >
        View the repository <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}
FluentStory.propTypes = { animate: PropTypes.bool.isRequired };

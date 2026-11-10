import PropTypes from 'prop-types';
import HeadingReveal from './editorial/HeadingReveal';
import AsciiSculpture from './editorial/AsciiSculpture';
import ColorSection from './editorial/ColorSection';
import DisciplineStack from './editorial/DisciplineStack';

const disciplines = [
  {
    title: 'Engineering',
    focus: 'Components · Systems',
    shape: 'keyboard',
    color: '#e5ee8d',
    description:
      'I build web and mobile interfaces with React and TypeScript. I care about the small interactions people notice, and the reusable components that make the next feature easier to build.',
    tools: 'React · TypeScript · React Native · Tamagui',
  },
  {
    title: 'Design',
    focus: 'Design systems · Tamagui',
    shape: 'camera',
    color: '#eac5e4',
    description:
      'My professional design work centers on design systems. At BlackCloak, I build shared Tamagui components for web, mobile, and internal tools, so the same patterns work across each app.',
    tools: 'Tamagui · Design systems · Web & mobile',
  },
  {
    title: 'AI',
    focus: 'Workflows · Experiments',
    shape: 'processor',
    color: '#bfd0ed',
    description:
      'At work, I use Claude and Cursor for development, and Greptile and CodeRabbit for code review. In my own projects, I experiment with voice interfaces and conversational prototypes using OpenAI and LiveKit.',
    tools: 'Claude · Cursor · Greptile · CodeRabbit · OpenAI · LiveKit',
  },
];

export default function About({ animate }) {
  return (
    <ColorSection
      animate={animate}
      from="#eac5e4"
      to="#bfd0ed"
      id="about"
      tabIndex={-1}
      className="about-section section-pad"
      aria-labelledby="about-title"
    >
      <p className="micro">02 / Behind the work</p>
      <div className="about-grid">
        <HeadingReveal animate={animate} id="about-title">
          Curiosity,
          <br />
          put to work.
        </HeadingReveal>
        <div className="about-copy">
          <p>
            I’m Magda, a software engineer with a background in film and photography. That
            background still shapes how I look at a screen: what catches your eye, what needs space,
            and what comes next.
          </p>
          <p>
            I enjoy working on both the interface and the code behind it. Here’s what that looks
            like in my day job and the projects I build for myself.
          </p>
        </div>
      </div>
      <DisciplineStack animate={animate}>
        {disciplines.map((discipline, index) => (
          <article
            key={discipline.title}
            className="discipline-card"
            style={{ '--discipline-color': discipline.color, '--card-index': index }}
            aria-labelledby={`discipline-${discipline.shape}`}
          >
            <div className="discipline-copy">
              <p className="discipline-number micro">
                <span>0{index + 1}</span>
                <span aria-hidden="true"> / 03</span>
              </p>
              <h3 id={`discipline-${discipline.shape}`}>{discipline.title}</h3>
              <p className="discipline-focus micro">{discipline.focus}</p>
              <p className="discipline-description">{discipline.description}</p>
              <p className="discipline-tools micro">{discipline.tools}</p>
            </div>
            <div className="discipline-art">
              <AsciiSculpture animate={animate} shape={discipline.shape} color={discipline.color} />
            </div>
          </article>
        ))}
      </DisciplineStack>
    </ColorSection>
  );
}
About.propTypes = { animate: PropTypes.bool.isRequired };

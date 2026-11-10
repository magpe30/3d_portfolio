import PropTypes from 'prop-types';

const paths = {
  'up-right': 'M5 19 19 5M5 5h14v14',
  'down-right': 'M5 5 19 19M5 19h14V5',
  down: 'M12 4v16m-7-7 7 7 7-7',
  left: 'M20 12H4m7-7-7 7 7 7',
  up: 'M12 20V4m-7 7 7-7 7 7',
};

export default function ArrowIcon({ direction = 'up-right' }) {
  return (
    <svg
      className="arrow-icon"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[direction]} />
    </svg>
  );
}

ArrowIcon.propTypes = {
  direction: PropTypes.oneOf(Object.keys(paths)),
};

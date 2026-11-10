// Project content and media shared by selected work and the case studies.
export const portfolio = {
  ride: {
    repository: 'https://github.com/magpe30/ride-sd',
    decisions: [
      {
        label: 'Visual hierarchy',
        title: 'Keep the route in focus.',
        description:
          'I kept the map muted so the route and numbered corners stand out. The speed chart and corner details sit alongside it, so you can check the numbers while keeping your place on the route.',
      },
      {
        label: 'Comparison',
        title: 'Compare rides in the same direction.',
        description:
          'You can compare up to three passes along the same route, using the oldest as a baseline. They have to travel in the same direction: comparing an uphill pass with a downhill one would give a misleading picture.',
      },
      {
        label: 'Playback',
        title: 'Follow the ride, not the stops.',
        description:
          'Playback uses the recorded ride timing and skips confirmed stops. Between GPS samples, the rider marker moves smoothly along the route, with speed and position shown together.',
      },
    ],
  },
  rideImage: {
    src: '/images/ride-sd.png',
    alt: 'RIDE SD with Palomar Mountain selected: a highlighted route and rider on the map, a speed profile below, and corner speeds on the right.',
    width: 2866,
    height: 1342,
  },
  fluent: {
    repository: 'https://github.com/magpe30/fluent',
  },
  fluentImage: {
    src: '/images/fluent-brief.png',
    width: 1280,
    height: 720,
    alt: 'Fluent’s preparation screen with a conversation prompt, a mint action button, and purple sculptural lips on a dark background.',
  },
  rideVideo: { src: '/videos/ride-sd-preview.mp4' },
};

export const projects = [
  {
    id: 'ride-sd',
    number: '01',
    category: 'Maps, data & interaction',
    name: 'RIDE',
    suffix: 'SD',
    tagline: 'Take a closer look at your ride.',
    description:
      'A tool for exploring a recorded ride. Replay it on a map, compare passes along the same route, and check your speed through each corner.',
    image: portfolio.rideImage,
    previewLabel: 'Route explorer / Palomar Mountain',
    decision: 'See the same corner in three views.',
    reason:
      'Select a corner and the map, speed chart, and detail panel update together. You can see where it happened and check the numbers in the same place.',
    stack: 'Next.js · TypeScript · MapLibre',
    from: '#e9e8e3',
    color: '#e5ee8d',
  },
  {
    id: 'fluent',
    number: '02',
    category: 'Product design & interaction',
    name: 'fluent',
    suffix: '.',
    tagline: 'A little space to find your voice.',
    description:
      'A prototype for practicing a conversation before you have it. Describe the situation, rehearse what you want to say, and use the feedback to try again.',
    image: portfolio.fluentImage,
    previewLabel: 'Conversation practice / Preparation',
    decision: 'Give each attempt a clear next step.',
    reason:
      'After each practice, the feedback suggests one thing to work on. That gives you somewhere to start when you try the conversation again.',
    stack: 'Next.js · TypeScript · LiveKit',
    from: '#e5ee8d',
    color: '#eac5e4',
  },
];

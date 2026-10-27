// RIDE SD media supplied by Magda. No résumé or live demo is published.
export const portfolio = {
  ride: {
    repository: 'https://github.com/magpe30/ride-sd',
    decisions: [
      {
        label: 'Visual hierarchy',
        title: 'Keep the route in focus.',
        description:
          'A muted map sits behind a bright route and numbered corners. The chart and corner panel stay alongside the map, keeping detailed readings close to their location.',
      },
      {
        label: 'Comparison',
        title: 'Compare the same journey.',
        description:
          'Outbound and return passes are separated. Up to three passes on the same route and in the same direction share a comparison, with the oldest as the baseline. This keeps an ascent from being compared with a descent.',
      },
      {
        label: 'Playback',
        title: 'Follow the ride, not the stops.',
        description:
          'Replay follows recorded riding time while excluding confirmed stationary breaks. Interpolated rider markers connect sparse GPS samples into continuous movement, with speed and position shown together.',
      },
    ],
  },
  rideImage: {
    src: '/images/ride-sd.png',
    alt: 'RIDE SD with Palomar Mountain selected: a highlighted route and rider on the map, a speed profile below, and corner speeds on the right.',
    width: 2866,
    height: 1342,
  },
  rideVideo: { src: '/videos/ride-sd-preview.mp4' },
};

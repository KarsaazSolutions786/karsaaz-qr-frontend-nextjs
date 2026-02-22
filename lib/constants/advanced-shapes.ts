export interface QRShape {
  slug: string;
  name: string;
  path: string;
}

export const ADVANCED_SHAPES: QRShape[] = [
  { slug: 'square', name: 'Square', path: 'M0 0h1v1H0z' },
  { slug: 'circle', name: 'Circle', path: 'M0.5 0A0.5 0.5 0 1 0 0.5 1A0.5 0.5 0 1 0 0.5 0' },
  { slug: 'rounded', name: 'Rounded', path: 'M0.1 0C0.045 0 0 0.045 0 0.1V0.9C0 0.955 0.045 1 0.1 1H0.9C0.955 1 1 0.955 1 0.9V0.1C1 0.045 0.955 0 0.9 0H0.1Z' },
  { slug: 'diamond', name: 'Diamond', path: 'M0.5 0L1 0.5L0.5 1L0 0.5Z' },
  { slug: 'star', name: 'Star', path: 'M0.5 0L0.618 0.382L1 0.382L0.691 0.618L0.809 1L0.5 0.764L0.191 1L0.309 0.618L0 0.382L0.382 0.382Z' },
  { slug: 'hexagon', name: 'Hexagon', path: 'M0.5 0L0.933 0.25L0.933 0.75L0.5 1L0.067 0.75L0.067 0.25Z' },
  { slug: 'octagon', name: 'Octagon', path: 'M0.293 0L0.707 0L1 0.293L1 0.707L0.707 1L0.293 1L0 0.707L0 0.293Z' },
  { slug: 'leaf', name: 'Leaf', path: 'M0 0.5Q0 0 0.5 0Q1 0 1 0.5Q1 1 0.5 1Q0 1 0 0.5Z' },
  { slug: 'heart', name: 'Heart', path: 'M0.5 0.15C0.25 -0.1 0 0.1 0 0.35C0 0.6 0.5 1 0.5 1S1 0.6 1 0.35C1 0.1 0.75 -0.1 0.5 0.15Z' },
];

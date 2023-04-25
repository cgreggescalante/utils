import { render } from '@testing-library/react';

import MultiStopwatch from './multi-stopwatch';

describe('MultiStopwatch', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MultiStopwatch />);
    expect(baseElement).toBeTruthy();
  });
});

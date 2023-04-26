import { render } from '@testing-library/react';

import PaceCalculator from './pace-calculator';

describe('PaceCalculator', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PaceCalculator />);
    expect(baseElement).toBeTruthy();
  });
});

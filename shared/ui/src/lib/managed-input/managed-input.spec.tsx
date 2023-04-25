import { render } from '@testing-library/react';

import ManagedInput from './managed-input';

describe('ManagedInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ManagedInput />);
    expect(baseElement).toBeTruthy();
  });
});

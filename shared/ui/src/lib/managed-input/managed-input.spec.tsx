import { render } from '@testing-library/react';

import ManagedInput from './managed-input';

describe('ManagedInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ManagedInput  value={undefined} valueSetter={(_) => {}}/>);
    expect(baseElement).toBeTruthy();
  });
});

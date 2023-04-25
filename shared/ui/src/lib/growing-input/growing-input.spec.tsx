import { render } from '@testing-library/react';

import GrowingInput from './growing-input';

describe('GrowingInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GrowingInput  onChange={(_) => null} value={undefined}/>);
    expect(baseElement).toBeTruthy();
  });
});

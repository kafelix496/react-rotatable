import React from 'react'
import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Checkbox from '../Checkbox'

afterEach(cleanup)

it('CheckboxWithLabel changes the text after click', () => {
  const { queryByLabelText, getByLabelText } = render(
    <Checkbox labelOn="On" labelOff="Off" />
  )

  expect(queryByLabelText(/off/i)).toBeTruthy()

  userEvent.click(getByLabelText(/off/i))

  expect(queryByLabelText(/on/i)).toBeTruthy()
})

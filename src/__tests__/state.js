import 'jest-dom/extend-expect'
import 'react-testing-library/cleanup-after-each'
import React from 'react'
import {render, fireEvent, getByText} from 'react-testing-library'
import {FavoriteNumber} from '../favorite-number'

test('entering an invalid value shows an error message', () => {
  const {getByLabelText, container, getByText, getByTestId} = render(
    <FavoriteNumber />,
  )
  const input = getByLabelText(/favorite number/i)
  fireEvent.change(input, {target: {value: 10}})

  // option 1
  expect(container).toHaveTextContent(/the number is invalid/i)

  // option 2
  getByText(/the number is invalid/i)

  // or to make option2 look more like an assertion
  expect(getByText(/the number is invalid/i)).toBeInTheDocument()

  // option 3: preferred
  expect(getByTestId('error-message')).toHaveTextContent(
    /the number is invalid/i,
  )
})

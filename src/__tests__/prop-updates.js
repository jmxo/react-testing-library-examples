import React from 'react'
import {render, fireEvent, getByText} from 'react-testing-library'
import {FavoriteNumber} from '../favorite-number'

test('entering an invalid value shows an error message', () => {
  const {getByLabelText, getByTestId, queryByTestId, rerender} = render(
    <FavoriteNumber />,
  )
  const input = getByLabelText(/favorite number/i)
  fireEvent.change(input, {target: {value: 10}})

  expect(getByTestId('error-message')).toHaveTextContent(
    /the number is invalid/i,
  )

  rerender(<FavoriteNumber max={10} />)

  expect(queryByTestId('error-message')).toBeNull()
})

import React from 'react'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {render as rtlRender, fireEvent} from 'react-testing-library'
import {reducer, ConnectedCounter} from '../redux-app'

function render(
  ui,
  {initialState, store = createStore(reducer, initialState), ...options} = {},
) {
  return rtlRender(<Provider store={store}>{ui}</Provider>, options)
}

test('can render with redux with defaults', () => {
  const {getByText, getByTestId} = render(<ConnectedCounter />)
  fireEvent.click(getByText('+'))
  expect(getByTestId('count-value')).toHaveTextContent('1')
})

test('can render with redux with custom initial state', () => {
  const {getByText, getByTestId} = render(<ConnectedCounter />, {
    initialState: {count: 3},
  })
  fireEvent.click(getByText('-'))
  expect(getByTestId('count-value')).toHaveTextContent('2')
})

import React from 'react'
import {Router} from 'react-router-dom'
import {createMemoryHistory} from 'history'
import {render as rtlRender, fireEvent} from 'react-testing-library'
import {Main} from '../main'

function render(
  ui,
  {
    route = '/',
    history = createMemoryHistory({initialEntries: [route]}),
    ...options
  } = {},
) {
  return {
    ...rtlRender(<Router history={history}>{ui}</Router>, options),
    history,
  }
}

test('Main renders home and about and I can navigate to those pages', () => {
  const {getByText, getByTestId, queryByTestId} = render(<Main />)

  expect(getByTestId('home-screen')).toBeInTheDocument()
  expect(queryByTestId('about-screen')).not.toBeInTheDocument()
  fireEvent.click(getByText(/about/i))
  expect(queryByTestId('home-screen')).not.toBeInTheDocument()
  expect(getByTestId('about-screen')).toBeInTheDocument()
})

test('landing on a bad page shows no match component', () => {
  const {getByTestId} = render(<Main />, {
    route: '/something-that-does-not-match',
  })

  expect(getByTestId('no-match-screen')).toBeInTheDocument()
})

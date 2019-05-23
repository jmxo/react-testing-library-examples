import 'jest-axe/extend-expect'
import React from 'react'
import {render} from 'react-testing-library'
import {axe} from 'jest-axe'

function Form() {
  return (
    <form>
      <label htmlFor="username">Username</label>
      <input id="username" placeholder="username" name="username" />
    </form>
  )
}

test('the form is accessible', async () => {
  const {container} = render(<Form />)
  const results = await axe(container.innerHTML)
  expect(results).toHaveNoViolations()
})

import React from 'react'
import {render} from 'react-testing-library'
import {Modal} from '../modal'

test('modal shows the children', () => {
  const {getByText} = render(
    <Modal>
      <div>test</div>
    </Modal>,
  )
  expect(getByText('test')).toBeInTheDocument()
})

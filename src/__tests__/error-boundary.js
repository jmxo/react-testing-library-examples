import React from 'react'
import {render, fireEvent} from 'react-testing-library'
import {reportError as mockReportError} from '../api'
import {ErrorBoundary} from '../error-boundary'

jest.mock('../api', () => {
  return {
    reportError: jest.fn(() => Promise.resolve({success: true})),
  }
})

function Bomb({shouldThrow}) {
  if (shouldThrow) {
    throw new Error('💣')
  } else {
    return null
  }
}

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  console.error.mockRestore()
})

test('calls reportError and renders that there was a problem', () => {
  const {container, rerender, getByText} = render(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>,
  )

  rerender(
    <ErrorBoundary>
      <Bomb shouldThrow={true} />
    </ErrorBoundary>,
  )

  expect(mockReportError).toHaveBeenCalledTimes(1)
  const error = expect.any(Error)
  const info = {componentStack: expect.stringContaining('Bomb')}
  expect(mockReportError).toHaveBeenCalledWith(error, info)
  expect(container).toHaveTextContent('There was a problem.')
  expect(console.error).toHaveBeenCalledTimes(2)

  console.error.mockClear()
  mockReportError.mockClear()

  rerender(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>,
  )

  fireEvent.click(getByText(/try again/i))
  expect(mockReportError).not.toHaveBeenCalled()
  expect(container).not.toHaveTextContent('There was a problem.')
  expect(console.error).not.toHaveBeenCalled()
})

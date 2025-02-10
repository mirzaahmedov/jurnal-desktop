import type { AxiosError } from 'axios'

type ErrorResponse = {
  message: string
  status?: number
  data?: any
}

export function handleAxiosError(error: AxiosError): ErrorResponse {
  if (error.response) {
    // Server responded with a status other than 2xx
    return {
      message: error.response.statusText,
      status: error.response.status,
      data: error.response.data
    }
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'No response received from server'
    }
  } else {
    // Something happened in setting up the request
    return {
      message: error.message
    }
  }
}

export const focusInvalidInput = () => {
  if ((document.activeElement as HTMLInputElement)?.dataset.error) {
    return
  }
  const inputElement = document.querySelector('input[data-error=true]') as HTMLInputElement
  if (inputElement) {
    inputElement.focus()
    inputElement.scrollIntoView({ behavior: 'smooth' })
  }
}

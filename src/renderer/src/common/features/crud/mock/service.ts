import type { Response } from '@/common/models'

class MockCRUDService<T extends { id: number }> {
  constructor(private data: T[]) {}

  getAll() {
    return mockApiRequest(this.data)
  }

  getById(id: number) {
    return mockApiRequest(this.data.find((item) => item.id === id))
  }

  create(payload: Omit<T, 'id'>) {
    const id = this.data.length + 1
    const newItem = { ...payload, id } as T
    this.data.push(newItem)
    return mockApiRequest(newItem)
  }

  update(payload: T) {
    const index = this.data.findIndex((item) => item.id === payload.id)
    this.data[index] = payload
    return mockApiRequest('success')
  }

  delete(id: number) {
    this.data = this.data.filter((item) => item.id !== id)
    return mockApiRequest('success')
  }
}

export const mockApiRequest = <T>(data: T, timeout: number = 1000) => {
  return new Promise<Response<T, null>>((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data,
        meta: null
      })
    }, timeout)
  })
}

export { MockCRUDService }

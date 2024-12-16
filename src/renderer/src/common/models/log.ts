type Log = {
  date: string
  type: string
  id: string
  user_id: string
}

enum LogType {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete'
}

export { LogType }
export type { Log }

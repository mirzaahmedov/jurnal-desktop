import type { PrivilegeFormValues } from './config'
import type { IPrivilege } from './model'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { zarplataApiNew } from '@/common/lib/zarplata'

export class PrivilegeService {
  static endpoint = 'Privilege'

  static QueryKeys = {
    GetAll: 'Privilege/all',
    GetById: 'Privilege/'
  }

  static async getAll(
    ctx: QueryFunctionContext<[typeof PrivilegeService.QueryKeys.GetAll, number]>
  ) {
    const mainZarplataId = ctx.queryKey[1]
    const res = await zarplataApiNew.get<IPrivilege[]>(PrivilegeService.endpoint, {
      params: { mainZarplataId }
    })
    return res.data
  }

  static async getById(
    ctx: QueryFunctionContext<[typeof PrivilegeService.QueryKeys.GetById, number]>
  ) {
    const id = ctx.queryKey[1]
    const res = await zarplataApiNew.get<IPrivilege>(`${PrivilegeService.endpoint}/${id}`)
    return res.data
  }

  static async create(values: PrivilegeFormValues) {
    const res = await zarplataApiNew.post(`${PrivilegeService.endpoint}`, values)
    return res.data
  }

  static async update(args: { id: number; values: PrivilegeFormValues }) {
    const res = await zarplataApiNew.put(`${PrivilegeService.endpoint}/${args.id}`, args.values)
    return res.data
  }

  static async delete(id: number) {
    const res = await zarplataApiNew.delete(`${PrivilegeService.endpoint}/${id}`)
    return res.data
  }
}

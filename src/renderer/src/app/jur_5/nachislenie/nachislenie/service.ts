import type { Nachislenie, NachislenieSostav } from "@/common/models"
import { getMockingNachislenie, getMockingNachislenieSostav } from "./mocking"

export class NachislenieService {
    static endpoint = "Nachislenie"

    static QueryKeys = {
        GetAll: 'nachislenie/all',
        GetByVacantId: 'nachislenie/vacantId',
    }

    static async getByVacantId() {
        return new Promise<{
            data: Nachislenie[]
        }>((resolve) => {
            setTimeout(() => {
                resolve({
                    data: getMockingNachislenie()
                })
            }, 1000)
        })
    }

    static async delete(id: number) {
        console.log(`Deleting Nachislenie with id: ${id}`)
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve()
            }, 1000)
        })
    }
}

export class NachislenieSostavService {
    static endpoint = "NachislenieSostav"

    static QueryKeys = {
        GetAll: 'nachislenie-sostav/all',
        GetByVacantId: 'nachislenie-sostav/vacantId',
    }

    static async getByVacantId() {
        return new Promise<{
            data: NachislenieSostav[]
        }>((resolve) => {
            setTimeout(() => {
                resolve({
                    data: getMockingNachislenieSostav()
                })
            }, 1000)
        })
    }
}

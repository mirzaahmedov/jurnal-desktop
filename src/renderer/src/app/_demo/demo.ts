import { TypeSchetOperatsii } from '@/common/models'

export const workTrip = {
  id: 9,
  user_id: 44,
  doc_num: '1',
  doc_date: '2025-01-01',
  from_date: '2025-08-14',
  to_date: '2025-08-31',
  day_summa: 675000,
  hostel_summa: 19004,
  road_ticket_number: null,
  road_summa: 454500,
  summa: 1148504,
  main_schet_id: 19,
  schet_id: 70,
  created_at: '2025-08-12T13:10:43.793Z',
  updated_at: '2025-08-12T13:10:43.793Z',
  isdeleted: false,
  worker_id: 17,
  comment: '',
  worker_name: 'ТОШПУЛАТОВ',
  worker_rayon: 'НАВОИЙ',
  worker_rank: null,
  worker: {
    id: 17,
    name: 'ТОШПУЛАТОВ',
    rayon: 'НАВОИЙ',
    user_id: 44,
    created_at: '2024-10-28T22:20:19.735',
    updated_at: '2024-10-28T22:20:19.735',
    isdeleted: false,
    position: 'Xodim',
    rank: null
  },
  childs: [
    {
      id: 44,
      schet_id: 668,
      summa: 675000,
      type: 'day',
      parent_id: 9,
      created_at: '2025-08-12T13:10:43.793',
      updated_at: '2025-08-12T13:10:43.793',
      isdeleted: false,
      schet_name: 'Xizmat safari puli',
      schet: {
        id: 668,
        name: 'Xizmat safari puli',
        schet: '231',
        sub_schet: '411221',
        type_schet: TypeSchetOperatsii.WORK_TRIP,
        smeta_id: null,
        created_at: '2028-06-26T15:28:36.430166',
        updated_at: '2028-06-26T15:28:36.430166',
        isdeleted: false,
        budjet_id: null,
        schet6: null
      }
    },
    {
      id: 45,
      schet_id: 668,
      summa: 19004,
      type: 'hostel',
      parent_id: 9,
      created_at: '2025-08-12T13:10:43.793',
      updated_at: '2025-08-12T13:10:43.793',
      isdeleted: false,
      schet_name: 'Xizmat safari puli',
      schet: {
        id: 668,
        name: 'Xizmat safari puli',
        schet: '231',
        sub_schet: '411221',
        type_schet: 'work_trip',
        smeta_id: null,
        created_at: '2028-06-26T15:28:36.430166',
        updated_at: '2028-06-26T15:28:36.430166',
        isdeleted: false,
        budjet_id: null,
        schet6: null
      }
    },
    {
      id: 46,
      schet_id: 668,
      summa: 454500,
      type: 'road',
      parent_id: 9,
      created_at: '2025-08-12T13:10:43.793',
      updated_at: '2025-08-12T13:10:43.793',
      isdeleted: false,
      schet_name: 'Xizmat safari puli',
      schet: {
        id: 668,
        name: 'Xizmat safari puli',
        schet: '231',
        sub_schet: '411221',
        type_schet: 'work_trip',
        smeta_id: null,
        created_at: '2028-06-26T15:28:36.430166',
        updated_at: '2028-06-26T15:28:36.430166',
        isdeleted: false,
        budjet_id: null,
        schet6: null
      }
    }
  ],
  road: [
    {
      id: 7,
      road_ticket_number: '',
      km: 789,
      road_summa: 295875,
      parent_id: 9,
      created_at: '2025-08-12T13:10:43.793',
      updated_at: '2025-08-12T13:10:43.793',
      is_active: true,
      from_region_id: 1,
      to_region_id: 3,
      from: 'Qoraqalpog‘iston',
      to: 'Samarqand viloyati'
    },
    {
      id: 8,
      road_ticket_number: '',
      km: 423,
      road_summa: 158625,
      parent_id: 9,
      created_at: '2025-08-12T13:10:43.793',
      updated_at: '2025-08-12T13:10:43.793',
      is_active: true,
      from_region_id: 2,
      to_region_id: 9,
      from: 'Buxoro viloyati',
      to: 'Xorazm viloyati'
    }
  ],
  hotel: [
    {
      id: 6,
      hostel_ticket_number: '1000',
      day: 54,
      day_summa: 234,
      hostel_summa: 12636,
      parent_id: 9,
      created_at: '2025-08-12T13:10:43.793',
      updated_at: '2025-08-12T13:10:43.793',
      is_active: true
    },
    {
      id: 7,
      hostel_ticket_number: '4000',
      day: 32,
      day_summa: 199,
      hostel_summa: 6368,
      parent_id: 9,
      created_at: '2025-08-12T13:10:43.793',
      updated_at: '2025-08-12T13:10:43.793',
      is_active: true
    }
  ]
}

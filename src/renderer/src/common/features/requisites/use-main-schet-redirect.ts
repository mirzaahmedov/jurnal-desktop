import { useEffect, useRef } from 'react'

import { type NavigateFunction, useNavigate } from 'react-router-dom'

import { useRequisitesStore } from './store'

export const useRequisitesRedirect = (to: Parameters<NavigateFunction>[0], enabled = true) => {
  const { main_schet_id, budjet_id } = useRequisitesStore()

  const navigate = useNavigate()
  const prevRequisites = useRef({
    main_schet_id,
    budjet_id
  })

  useEffect(() => {
    if (!enabled) {
      return
    }
    if (
      (prevRequisites.current.budjet_id && !main_schet_id !== !prevRequisites.current.budjet_id) ||
      (prevRequisites.current.main_schet_id &&
        main_schet_id !== prevRequisites.current.main_schet_id)
    ) {
      navigate(to)
    }
  }, [navigate, to, enabled, budjet_id, main_schet_id])
}

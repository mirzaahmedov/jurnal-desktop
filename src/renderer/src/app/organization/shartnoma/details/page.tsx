import {
  DocumentFields,
  OpisanieFields,
  SmetaFields,
  SummaEditableFields
} from '@/common/widget/form'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ShartnomaFormSchema, shartnomaService } from '../service'
import { defaultValues, shartnomaQueryKeys } from '../constants'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { DetailsView } from '@/common/views'
import { Form } from '@/common/components/ui/form'
import { PudratchiFields } from './pudratchi'
import { ShartnomaKindFields } from './kind'
import { createSmetaSpravochnik } from '@renderer/app/super-admin/smeta'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useLayout } from '@/common/features/layout'
import { useOrgId } from '../hooks'
import { useRequisitesStore } from '@/common/features/main-schet'
import { useSpravochnik } from '@/common/features/spravochnik'
import { useToast } from '@/common/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'

const OrganizationDetailsPage = () => {
  const [orgId] = useOrgId()

  const { toast } = useToast()

  const id = useParams().id as string
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)

  const form = useForm({
    resolver: zodResolver(ShartnomaFormSchema),
    defaultValues
  })

  const smetaSpravochnik = useSpravochnik(
    createSmetaSpravochnik({
      value: form.watch('smeta_id'),
      onChange: (value) => {
        form.setValue('smeta_id', value)
        form.trigger('smeta_id')
      }
    })
  )

  const { data: prixod, isFetching } = useQuery({
    queryKey: [
      shartnomaQueryKeys.getById,
      Number(id),
      {
        main_schet_id
      }
    ],
    queryFn: shartnomaService.getById,
    enabled: id !== 'create'
  })
  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [shartnomaQueryKeys.create],
    mutationFn: shartnomaService.create,
    onSuccess() {
      toast({ title: 'Документ успешно создан' })
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [shartnomaQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [shartnomaQueryKeys.getById, id]
      })

      navigate(`/organization/shartnoma?org_id=${orgId}`)
    },
    onError(error) {
      toast({ title: error.message, variant: 'destructive' })
    }
  })

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [shartnomaQueryKeys.update, id],
    mutationFn: shartnomaService.update,
    onSuccess() {
      toast({ title: 'Документ успешно обновлен' })

      queryClient.invalidateQueries({
        queryKey: [shartnomaQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [shartnomaQueryKeys.getById, id]
      })

      navigate(`/organization/shartnoma?org_id=${orgId}`)
    },
    onError(error) {
      toast({ title: error.message, variant: 'destructive' })
    }
  })

  const onSubmit = form.handleSubmit((payload) => {
    const {
      doc_date,
      doc_num,
      spravochnik_organization_id,
      smeta_id,
      smeta2_id,
      summa,
      opisanie,
      pudratchi_bool,
      yillik_oylik,
      grafik_year
    } = payload

    if (id !== 'create') {
      update({
        id: Number(id),
        doc_date,
        doc_num,
        spravochnik_organization_id,
        smeta_id,
        smeta2_id,
        summa,
        opisanie,
        pudratchi_bool,
        yillik_oylik,
        grafik_year
      })
      return
    }

    create({
      doc_date,
      doc_num,
      spravochnik_organization_id,
      smeta_id,
      smeta2_id,
      summa,
      opisanie,
      pudratchi_bool,
      yillik_oylik,
      grafik_year: new Date().getFullYear()
    })
  })

  useEffect(() => {
    if (!orgId) {
      toast({
        title: 'Выберите организацию',
        variant: 'destructive'
      })
      return
    }
  }, [toast, orgId])

  useEffect(() => {
    if (id === 'create') {
      form.reset(defaultValues)
      return
    }
    form.reset(prixod?.data ?? defaultValues)
  }, [form, prixod, id])

  useEffect(() => {
    if (orgId) {
      form.setValue('spravochnik_organization_id', orgId)
    } else {
      form.setValue('spravochnik_organization_id', 0)
    }
  }, [form, orgId])

  useLayout({
    title: id === 'create' ? 'Создать договор' : 'Редактировать договор',
    onBack() {
      navigate(-1)
    }
  })

  return !orgId ? (
    <Navigate to="/organization/shartnoma" />
  ) : (
    <DetailsView>
      <DetailsView.Content loading={isFetching || isCreating || isUpdating}>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div>
              <div className="flex">
                <DocumentFields
                  tabIndex={1}
                  form={form}
                />
              </div>

              <div className="grid grid-cols-2 gap-10">
                <SummaEditableFields
                  tabIndex={2}
                  form={form}
                />
                <SmetaFields
                  tabIndex={3}
                  error={form.formState.errors.smeta_id}
                  spravochnik={smetaSpravochnik}
                />
              </div>

              <div className="p-5">
                <OpisanieFields
                  form={form}
                  className="pt-0"
                />
              </div>

              <div className="grid grid-cols-2 gap-10">
                <PudratchiFields
                  form={form}
                  className="pt-0"
                />
                <ShartnomaKindFields
                  form={form}
                  className="pt-0"
                />
              </div>
            </div>

            <DetailsView.Footer>
              <DetailsView.Create disabled={isCreating || isUpdating} />
            </DetailsView.Footer>
          </form>
        </Form>
      </DetailsView.Content>
    </DetailsView>
  )
}

export default OrganizationDetailsPage

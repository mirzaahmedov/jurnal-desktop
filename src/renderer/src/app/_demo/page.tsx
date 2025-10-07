import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { useTranslation } from 'react-i18next'

import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'

const DemoPage = () => {
  const { t } = useTranslation()
  return (
    <DialogTrigger isOpen>
      <DialogOverlay>
        <DialogContent closeButton={false}>
          <DotLottieReact
            autoplay
            loop
            src="/lotties/finding-documents.json"
          />
          <DialogHeader>
            <DialogTitle className="text-center">{t('document_processing')}</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}

export default DemoPage

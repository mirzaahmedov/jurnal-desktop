import type { DialogTriggerProps } from 'react-aria-components'

import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { useTranslation } from 'react-i18next'

import { DialogContent, DialogOverlay, DialogTrigger } from './jolly/dialog'

export const ProcessingDocumentLoader = (props: Omit<DialogTriggerProps, 'children'>) => {
  const { t } = useTranslation()
  return (
    <DialogTrigger {...props}>
      <DialogOverlay className="backdrop-blur-sm bg-black/50">
        <DialogContent
          closeButton={false}
          className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl border-0 p-8"
        >
          <div className="flex flex-col items-center space-y-8">
            <DotLottieReact
              autoplay
              loop
              src="/lotties/finding-documents.json"
            />

            <div className="text-center space-y-6 w-full">
              <p className="text-gray-600 leading-relaxed">{t('document_processing')}</p>

              <div className="w-full max-w-xs mx-auto">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-brand to-brand/50 h-2 rounded-full animate-loading-bar"></div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}

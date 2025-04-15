import { useContext } from 'react'

import { Cross2Icon } from '@radix-ui/react-icons'
import {
  Dialog,
  DialogContext,
  DialogTrigger,
  Heading,
  Input,
  Label,
  Modal,
  ModalOverlay,
  OverlayTriggerStateContext,
  TextField
} from 'react-aria-components'

import { Button } from '@/common/components/ui/button'

const DialogClose = () => {
  const state = useContext(OverlayTriggerStateContext)
  return (
    <Button
      onClick={() => {
        state?.close()
      }}
    >
      <Cross2Icon />
    </Button>
  )
}

const DemoPage = () => {
  return (
    <div className="flex-1 w-full h-full p-10">
      <DialogTrigger>
        <Button>Sign up…</Button>
        <Modal className="fixed inset-0 z-[100] bg-black/50 grid place-items-center">
          <Dialog className="bg-white w-full max-w-[800px] h-full max-h-[400px] p-5">
            <form>
              <DialogClose />
              <Heading slot="title">Sign up</Heading>
              <TextField autoFocus>
                <Label>First Name:</Label>
                <Input />
              </TextField>
              <TextField>
                <Label>Last Name:</Label>
                <Input />
              </TextField>
              <Button slot="close">Submit</Button>
            </form>
          </Dialog>
        </Modal>
      </DialogTrigger>
    </div>
  )
}

export default DemoPage

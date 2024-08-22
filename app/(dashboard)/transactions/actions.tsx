'use client'

import { Edit, MoreHorizontal, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useConfirm } from '@/hooks/use-confirm'
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction'
import { useDeleteTransaction } from '@/features/transactions/api/use-delete-transaction'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

type Props = {
  id: string
}

export const Actions = ({ id }: Props) => {
  const { onOpen } = useOpenTransaction()
  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'You are about to delete this transaction.'
  )

  const deleteMutation = useDeleteTransaction(id)

  const handleDelete = async () => {
    const isDeleteAllowed = await confirm()

    if (isDeleteAllowed) {
      deleteMutation.mutate()
    }
  }

  return (
    <>
      <ConfirmDialog />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={() => onOpen(id)}
          >
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
          >
            <Trash className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

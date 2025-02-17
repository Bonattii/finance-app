import { z } from 'zod'
import { Loader2 } from 'lucide-react'

import { useConfirm } from '@/hooks/use-confirm'
import { insertTransactionSchema } from '@/db/schema'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'

import { useGetTransaction } from '@/features/transactions/api/use-get-transaction'
import { TransactionForm } from '@/features/transactions/components/transaction-form'
import { useEditTransaction } from '@/features/transactions/api/use-edit-transaction'
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction'
import { useDeleteTransaction } from '@/features/transactions/api/use-delete-transaction'

import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { useGetCategories } from '@/features/categories/api/use-get-categories'

import { useCreateAccount } from '@/features/accounts/api/use-create-account'
import { useCreateCategory } from '@/features/categories/api/use-create-category'

const formSchema = insertTransactionSchema.omit({ id: true })

type FormValues = z.input<typeof formSchema>

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction()

  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'You are about to delete this transaction.'
  )

  const transactionQuery = useGetTransaction(id)
  const editMutation = useEditTransaction(id)
  const deleteMutation = useDeleteTransaction(id)

  const categoryQuery = useGetCategories()
  const createCategoryMutation = useCreateCategory()
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id
  }))

  const accountQuery = useGetAccounts()
  const createAccountMutation = useCreateAccount()
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id
  }))

  const isLoading =
    transactionQuery.isLoading ||
    categoryQuery.isLoading ||
    accountQuery.isLoading
  const isPending =
    editMutation.isPending ||
    deleteMutation.isPending ||
    transactionQuery.isLoading ||
    createCategoryMutation.isPending ||
    createAccountMutation.isPending

  const defaultValues = transactionQuery.data
    ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date
          ? new Date(transactionQuery.data.date)
          : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes
      }
    : {
        accountId: '',
        categoryId: '',
        amount: '',
        date: new Date(),
        payee: '',
        notes: ''
      }

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose()
      }
    })
  }

  const onDelete = async () => {
    const isDeleteAllowed = await confirm()

    if (isDeleteAllowed) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose()
        }
      })
    }
  }

  const onCreateCategory = (name: string) => {
    createCategoryMutation.mutate({ name })
  }

  const onCreateAccount = (name: string) => {
    createAccountMutation.mutate({ name })
  }

  return (
    <>
      <ConfirmDialog />

      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>

            <SheetDescription>Edit an existing transaction.</SheetDescription>
          </SheetHeader>

          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="siez-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              onDelete={onDelete}
              defaultValues={defaultValues}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

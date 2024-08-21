import { z } from 'zod'
import { Loader2 } from 'lucide-react'

import { insertTransactionSchema } from '@/db/schema'
import { TransactionForm } from '@/features/transactions/components/transaction-form'
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction'
import { useCreateTransaction } from '@/features/transactions/api/use-create-transaction'

import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { useGetCategories } from '@/features/categories/api/use-get-categories'

import { useCreateAccount } from '@/features/accounts/api/use-create-account'
import { useCreateCategory } from '@/features/categories/api/use-create-category'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'

const formSchema = insertTransactionSchema.omit({ id: true })

type FormValues = z.input<typeof formSchema>

export const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransaction()

  const createTransactionMutation = useCreateTransaction()

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

  const isPending =
    createTransactionMutation.isPending ||
    createCategoryMutation.isPending ||
    createAccountMutation.isPending

  const isLoading = categoryQuery.isLoading || accountQuery.isLoading

  const onCreateCategory = (name: string) => {
    createCategoryMutation.mutate({ name })
  }

  const onCreateAccount = (name: string) => {
    createAccountMutation.mutate({ name })
  }

  const onSubmit = (values: FormValues) => {
    createTransactionMutation.mutate(values, {
      onSuccess: () => {
        onClose()
      }
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>

          <SheetDescription>Add a new transaction</SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={onSubmit}
            disabled={isPending}
            categoryOptions={categoryOptions}
            onCreateCategory={onCreateCategory}
            accountOptions={accountOptions}
            onCreateAccount={onCreateAccount}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}

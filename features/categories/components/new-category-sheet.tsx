import { z } from 'zod'

import { insertCategorySchema } from '@/db/schema'
import { useNewCategory } from '@/features/categories/hooks/use-new-category'
import { CategoryForm } from '@/features/categories/components/category-form'
import { useCreateCategory } from '@/features/categories/api/use-create-category'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'

const formSchema = insertCategorySchema.pick({ name: true })

type FormValues = z.input<typeof formSchema>

export const NewCategorySheet = () => {
  const { isOpen, onClose } = useNewCategory()

  const createMutation = useCreateCategory()

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        onClose()
      }
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>

          <SheetDescription>
            Create a new category to organize your transactions.
          </SheetDescription>
        </SheetHeader>

        <CategoryForm
          onSubmit={onSubmit}
          disabled={createMutation.isPending}
          defaultValues={{ name: '' }}
        />
      </SheetContent>
    </Sheet>
  )
}

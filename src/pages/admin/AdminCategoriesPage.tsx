import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Edit2, Plus } from 'lucide-react';
import { adminService } from '@/services';
import { queryKeys } from '@/lib/queryKeys';
import type { Category } from '@/types';
import type { AdminCategoryInput } from '@/services/contracts/admin';
import { Button } from '@/components/ui/button';
import { InputField, TextAreaField } from '@/components/forms/Fields';
import { Skeleton } from '@/components/ui/skeleton';

const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(5, 'Description is required'),
  imageUrl: z.string().min(5, 'Image URL is required'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: categories, isLoading } = useQuery({
    queryKey: queryKeys.adminCategories,
    queryFn: () => adminService.listCategories(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const upsertMutation = useMutation({
    mutationFn: (data: CategoryFormData) => {
      const input: AdminCategoryInput = {
        id: data.id,
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
      };
      return adminService.upsertCategory(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminCategories });
      setIsCreating(false);
      setEditingCategory(null);
      reset();
    },
  });

  const startEdit = (cat: Category) => {
    setEditingCategory(cat);
    setIsCreating(true);
    reset({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      imageUrl: cat.imageUrl,
    });
  };

  const startNew = () => {
    setEditingCategory(null);
    setIsCreating(true);
    reset({
      name: '',
      description: '',
      imageUrl: '/images/category-tops.jpg',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/15 pb-4">
        <div>
          <span className="label-xs text-ink-muted">Taxonomy</span>
          <h1 className="display text-3xl">Categories</h1>
        </div>
        {!isCreating && (
          <Button onClick={startNew}>
            <Plus className="size-4" /> Add Category
          </Button>
        )}
      </div>

      {isCreating && (
        <div className="border border-ink/20 bg-paper p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-ink/10 mb-6">
            <h2 className="font-display text-2xl">
              {editingCategory ? `Edit Category: ${editingCategory.name}` : 'New Garment Category'}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit((d) => upsertMutation.mutate(d))} className="space-y-6">
            <InputField
              label="Category Name *"
              placeholder="e.g. Knitwear & Heavy Loops"
              error={errors.name?.message}
              {...register('name')}
            />

            <TextAreaField
              label="Description *"
              placeholder="Short editorial summary of pieces in this taxonomy."
              rows={3}
              error={errors.description?.message}
              {...register('description')}
            />

            <InputField
              label="Hero Image URL *"
              placeholder="/images/category-knitwear.jpg"
              error={errors.imageUrl?.message}
              {...register('imageUrl')}
            />

            <div className="flex gap-4 pt-4 border-t border-ink/10">
              <Button type="submit" disabled={upsertMutation.isPending}>
                {upsertMutation.isPending ? 'Saving…' : 'Save Category'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {categories?.map((cat) => (
            <div
              key={cat.id}
              className="border border-ink/15 bg-paper p-6 flex flex-col justify-between"
            >
              <div className="flex gap-4">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="size-20 object-cover bg-bone shrink-0"
                />
                <div>
                  <h3 className="font-display text-xl">{cat.name}</h3>
                  <p className="font-mono text-xs text-ink-muted mt-0.5">/{cat.slug}</p>
                  <p className="text-xs text-ink-muted mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end border-t border-ink/10 pt-4">
                <Button variant="outline" size="sm" onClick={() => startEdit(cat)}>
                  <Edit2 className="size-3" /> Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

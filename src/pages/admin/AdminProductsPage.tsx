import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit2, Plus } from 'lucide-react';
import { adminService } from '@/services';
import { queryKeys } from '@/lib/queryKeys';
import type { AdminProductInput } from '@/services/contracts/admin';
import type { Product, ProductBadge } from '@/types';
import { adminProductSchema, type AdminProductFormValues } from '@/schemas';
import { formatMoney, minorToRupees, rupeesToMinor } from '@/utils/money';
import { Button } from '@/components/ui/button';
import { TextField, SelectField, TextAreaField } from '@/components/forms/Fields';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: queryKeys.adminProducts,
    queryFn: () => adminService.listProducts(),
  });

  const { data: categories } = useQuery({
    queryKey: queryKeys.adminCategories,
    queryFn: () => adminService.listCategories(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminProductFormValues>({
    resolver: zodResolver(adminProductSchema) as unknown as Resolver<AdminProductFormValues>,
    defaultValues: {
      name: '',
      slug: '',
      subtitle: '',
      description: '',
      categorySlug: 'tops',
      priceRupees: 1499,
      status: 'active',
      badge: 'New',
      materials: '100% Combed Cotton, 280 GSM heavy jersey',
      care: 'Machine wash cold with like colors. Line dry.',
    },
  });

  const upsertMutation = useMutation({
    mutationFn: (data: AdminProductFormValues) => {
      const input: AdminProductInput = {
        id: editingProduct?.id,
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        subtitle: data.subtitle,
        description: data.description,
        categorySlug: data.categorySlug,
        priceMinor: rupeesToMinor(data.priceRupees),
        compareAtPriceMinor: data.compareAtRupees ? rupeesToMinor(data.compareAtRupees) : undefined,
        status: data.status,
        badge: (data.badge || null) as ProductBadge,
        isNew: data.badge === 'New',
        isBestSeller: data.badge === 'Bestseller',
        isFeatured: true,
        colors: editingProduct?.colors ?? [
          { name: 'Pitch Black', slug: 'black', hex: '#111111' },
          { name: 'Chalk White', slug: 'white', hex: '#FAF9F6' },
        ],
        sizes: editingProduct?.sizes ?? ['S', 'M', 'L', 'XL'],
        images: editingProduct?.images ?? [
          {
            id: 'img-1',
            url: '/images/product-tee-white.jpg',
            alt: data.name,
          },
        ],
        details: editingProduct?.details ?? [
          'Custom heavy-gauge cotton build',
          'Dropped shoulder relaxed silhouette',
          'Reinforced high-density collar',
        ],
        materials: data.materials || '100% Cotton',
        care: data.care || 'Machine wash cold.',
      };
      return adminService.upsertProduct(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminProducts });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
      setIsCreating(false);
      setEditingProduct(null);
      reset();
    },
  });

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setIsCreating(true);
    reset({
      name: product.name,
      slug: product.slug,
      subtitle: product.subtitle,
      description: product.description,
      categorySlug: product.categorySlug,
      priceRupees: minorToRupees(product.priceMinor),
      compareAtRupees: product.compareAtPriceMinor ? minorToRupees(product.compareAtPriceMinor) : undefined,
      status: product.status,
      badge: (product.badge || '') as 'New' | 'Bestseller' | 'Limited' | 'Almost gone' | '',
      materials: product.materials,
      care: product.care,
    });
  };

  const startNew = () => {
    setEditingProduct(null);
    setIsCreating(true);
    reset({
      name: '',
      slug: '',
      subtitle: '',
      description: '',
      categorySlug: categories?.[0]?.slug ?? 'tops',
      priceRupees: 1499,
      status: 'active',
      badge: 'New',
      materials: '100% Combed Cotton, 280 GSM heavy jersey',
      care: 'Machine wash cold with like colors. Line dry.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/15 pb-4">
        <div>
          <span className="label-xs text-ink-muted">Catalog Operations</span>
          <h1 className="display text-3xl">Garment Listing</h1>
        </div>
        {!isCreating && (
          <Button onClick={startNew}>
            <Plus className="size-4" /> Add Garment
          </Button>
        )}
      </div>

      {isCreating && (
        <div className="border border-ink/20 bg-paper p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-ink/10 mb-6">
            <h2 className="font-display text-2xl">
              {editingProduct ? `Edit Piece: ${editingProduct.name}` : 'Create New Garment Drop'}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit((d) => upsertMutation.mutate(d))} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField
                label="Garment Title *"
                placeholder="e.g. Heavyweight Work Jacket"
                error={errors.name?.message}
                {...register('name')}
              />
              <TextField
                label="URL Slug (optional)"
                placeholder="e.g. heavyweight-work-jacket"
                error={errors.slug?.message}
                {...register('slug')}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <SelectField
                label="Category *"
                options={
                  categories?.map((c) => ({ label: c.name, value: c.slug })) ?? [
                    { label: 'Tops', value: 'tops' },
                    { label: 'Outerwear', value: 'outerwear' },
                    { label: 'Bottoms', value: 'bottoms' },
                    { label: 'Knitwear', value: 'knitwear' },
                  ]
                }
                error={errors.categorySlug?.message}
                {...register('categorySlug')}
              />
              <TextField
                label="Price in ₹ Rupees *"
                type="number"
                error={errors.priceRupees?.message}
                {...register('priceRupees')}
              />
              <SelectField
                label="Status *"
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'Draft', value: 'draft' },
                  { label: 'Archived', value: 'archived' },
                ]}
                error={errors.status?.message}
                {...register('status')}
              />
            </div>

            <TextField
              label="Subtitle / Cut Description *"
              placeholder="e.g. Boxy street fit / 100% Japanese twill"
              error={errors.subtitle?.message}
              {...register('subtitle')}
            />

            <TextAreaField
              label="Editorial Product Description *"
              rows={4}
              error={errors.description?.message}
              {...register('description')}
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <SelectField
                label="Badge"
                options={[
                  { label: 'None', value: '' },
                  { label: 'New', value: 'New' },
                  { label: 'Bestseller', value: 'Bestseller' },
                  { label: 'Limited', value: 'Limited' },
                  { label: 'Almost gone', value: 'Almost gone' },
                ]}
                error={errors.badge?.message}
                {...register('badge')}
              />
              <TextField
                label="Compare at Price in ₹ (Optional)"
                type="number"
                error={errors.compareAtRupees?.message}
                {...register('compareAtRupees')}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <TextField
                label="Fabric Composition & GSM"
                error={errors.materials?.message}
                {...register('materials')}
              />
              <TextField
                label="Care Instructions"
                error={errors.care?.message}
                {...register('care')}
              />
            </div>

            <div className="flex gap-4 pt-4 border-t border-ink/10">
              <Button type="submit" disabled={upsertMutation.isPending}>
                {upsertMutation.isPending ? 'Transmitting…' : 'Save Garment'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : (
        <div className="border border-ink/15 bg-paper overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-ink/15 bg-bone/70 uppercase font-mono tracking-wider text-ink-muted">
              <tr>
                <th className="py-3 px-4">Piece</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Variants</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {products?.map((product) => (
                <tr key={product.id} className="hover:bg-bone/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]?.url}
                        alt=""
                        className="size-12 object-cover bg-bone"
                      />
                      <div>
                        <span className="font-semibold text-ink text-sm">{product.name}</span>
                        <p className="font-mono text-[10px] text-ink-muted">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 uppercase font-mono text-[11px] text-ink-muted">
                    {product.categoryName}
                  </td>
                  <td className="py-3 px-4 font-medium text-ink">
                    {formatMoney(product.priceMinor, product.currency)}
                  </td>
                  <td className="py-3 px-4 font-mono text-ink-muted">
                    {product.variants.length} SKU(s)
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 font-mono text-[10px] uppercase font-semibold ${
                        product.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(product)}
                    >
                      <Edit2 className="size-3" />
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

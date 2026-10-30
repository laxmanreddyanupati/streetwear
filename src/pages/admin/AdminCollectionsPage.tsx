import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Archive,
  CheckCircle2,
  Edit2,
  FolderOpen,
  Plus,
  Search,
  Trash2,
  XCircle,
} from 'lucide-react';
import { adminService } from '@/services';
import { queryKeys } from '@/lib/queryKeys';
import type { Collection } from '@/types';
import type { AdminCollectionInput } from '@/services/contracts/admin';
import { Button } from '@/components/ui/button';
import { InputField, TextAreaField } from '@/components/forms/Fields';
import { Skeleton } from '@/components/ui/skeleton';
import { slugify } from '@/utils/misc';
import { cn } from '@/utils/cn';

// ---------------------------------------------------------------------------
// Zod schema
// ---------------------------------------------------------------------------

const collectionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers and hyphens'),
  tagline: z.string().min(3, 'Tagline is required'),
  description: z.string().min(5, 'Description is required'),
  story: z.string().optional(),
  imageUrl: z.string().min(5, 'Image URL is required'),
  productIds: z.string(), // comma-separated IDs, parsed before submit
  sortOrder: z.coerce.number().int().min(0, 'Sort order must be ≥ 0'),
  status: z.enum(['draft', 'published', 'archived']),
});

type CollectionFormData = z.infer<typeof collectionSchema>;

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: Collection['status'] }) {
  const styles: Record<Collection['status'], string> = {
    published: 'bg-[#d8f05f]/30 text-[#2d5a29] border-[#d8f05f]',
    draft: 'bg-bone border-ink/20 text-ink-muted',
    archived: 'bg-bone-deep border-ink/15 text-ink-muted line-through',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest',
        styles[status],
      )}
    >
      {status === 'published' && <CheckCircle2 className="size-3" />}
      {status === 'draft' && <XCircle className="size-3" />}
      {status === 'archived' && <Archive className="size-3" />}
      {status}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Delete confirm dialog
// ---------------------------------------------------------------------------

function DeleteDialog({
  collection,
  onConfirm,
  onCancel,
  isPending,
}: {
  collection: Collection;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title">
      <div className="w-full max-w-md border border-ink/20 bg-paper p-6 shadow-xl">
        <h2 id="delete-dialog-title" className="font-display text-2xl">Delete collection?</h2>
        <p className="mt-3 text-sm text-ink-muted">
          This will permanently delete <strong className="text-ink">{collection.name}</strong> from the admin.
          Products are <em>not</em> deleted — they will just no longer reference this collection.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Deleting…' : 'Yes, delete'}
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export function AdminCollectionsPage() {
  const queryClient = useQueryClient();
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null);
  const [search, setSearch] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [slugConflict, setSlugConflict] = useState<string | null>(null);

  // All products for the product-selection field
  const { data: allProducts } = useQuery({
    queryKey: queryKeys.adminProducts,
    queryFn: () => adminService.listProducts(),
  });

  const { data: collections, isLoading, isError } = useQuery({
    queryKey: queryKeys.adminCollections,
    queryFn: () => adminService.listCollections(),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: '',
      slug: '',
      tagline: '',
      description: '',
      story: '',
      imageUrl: '/images/collection-essentials.jpg',
      productIds: '',
      sortOrder: (collections?.length ?? 0) + 1,
      status: 'draft',
    },
  });

  const watchedName = watch('name');
  const watchedSlug = watch('slug');

  // Auto-generate slug from name unless user has manually edited it
  useEffect(() => {
    if (!slugManuallyEdited && !editingCollection) {
      setValue('slug', slugify(watchedName));
    }
  }, [watchedName, slugManuallyEdited, editingCollection, setValue]);

  // Validate slug uniqueness in real-time
  useEffect(() => {
    if (!watchedSlug) {
      setSlugConflict(null);
      return;
    }
    const conflict = collections?.find(
      (c) => c.slug === watchedSlug && c.id !== editingCollection?.id,
    );
    setSlugConflict(conflict ? conflict.name : null);
  }, [watchedSlug, collections, editingCollection]);

  // -------------------------------------------------------------------------
  // Mutations
  // -------------------------------------------------------------------------

  const upsertMutation = useMutation({
    mutationFn: (data: CollectionFormData) => {
      const productIds = data.productIds
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const input: AdminCollectionInput = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        tagline: data.tagline,
        description: data.description,
        story: data.story || undefined,
        imageUrl: data.imageUrl,
        productIds,
        sortOrder: data.sortOrder,
        status: data.status,
      };
      return adminService.upsertCollection(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminCollections });
      queryClient.invalidateQueries({ queryKey: queryKeys.collections });
      closeForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminCollections });
      queryClient.invalidateQueries({ queryKey: queryKeys.collections });
      setDeleteTarget(null);
    },
  });

  const publishMutation = useMutation({
    mutationFn: (collection: Collection) =>
      adminService.upsertCollection({
        id: collection.id,
        name: collection.name,
        slug: collection.slug,
        tagline: collection.tagline,
        description: collection.description,
        story: collection.story,
        imageUrl: collection.imageUrl,
        additionalImages: collection.additionalImages,
        productIds: collection.productIds,
        sortOrder: collection.sortOrder,
        status: collection.status === 'published' ? 'draft' : 'published',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminCollections });
      queryClient.invalidateQueries({ queryKey: queryKeys.collections });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (collection: Collection) =>
      adminService.upsertCollection({
        id: collection.id,
        name: collection.name,
        slug: collection.slug,
        tagline: collection.tagline,
        description: collection.description,
        story: collection.story,
        imageUrl: collection.imageUrl,
        additionalImages: collection.additionalImages,
        productIds: collection.productIds,
        sortOrder: collection.sortOrder,
        status: 'archived',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminCollections });
      queryClient.invalidateQueries({ queryKey: queryKeys.collections });
    },
  });

  // -------------------------------------------------------------------------
  // Form helpers
  // -------------------------------------------------------------------------

  function closeForm() {
    setIsFormOpen(false);
    setEditingCollection(null);
    setSlugManuallyEdited(false);
    setSlugConflict(null);
    reset();
  }

  function startNew() {
    setEditingCollection(null);
    setSlugManuallyEdited(false);
    setIsFormOpen(true);
    reset({
      name: '',
      slug: '',
      tagline: '',
      description: '',
      story: '',
      imageUrl: '/images/collection-essentials.jpg',
      productIds: '',
      sortOrder: (collections?.length ?? 0) + 1,
      status: 'draft',
    });
  }

  function startEdit(col: Collection) {
    setEditingCollection(col);
    setSlugManuallyEdited(true); // don't auto-overwrite existing slug
    setIsFormOpen(true);
    reset({
      id: col.id,
      name: col.name,
      slug: col.slug,
      tagline: col.tagline,
      description: col.description,
      story: col.story ?? '',
      imageUrl: col.imageUrl,
      productIds: col.productIds.join(', '),
      sortOrder: col.sortOrder,
      status: col.status,
    });
  }

  // -------------------------------------------------------------------------
  // Filtered list
  // -------------------------------------------------------------------------

  const filtered = (collections ?? []).filter(
    (c) =>
      !search.trim() ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.includes(search.toLowerCase()),
  );

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/15 pb-4">
        <div>
          <span className="label-xs text-ink-muted">Curation</span>
          <h1 className="display text-3xl">Collections</h1>
        </div>
        {!isFormOpen && (
          <Button onClick={startNew}>
            <Plus className="size-4" /> New Collection
          </Button>
        )}
      </div>

      {/* Create / Edit Form */}
      {isFormOpen && (
        <div className="border border-ink/20 bg-paper p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-ink/10 pb-4 mb-6">
            <h2 className="font-display text-2xl">
              {editingCollection ? `Edit: ${editingCollection.name}` : 'New Collection'}
            </h2>
            <Button variant="ghost" size="sm" onClick={closeForm}>
              Cancel
            </Button>
          </div>

          <form
            onSubmit={handleSubmit((d) => upsertMutation.mutate(d))}
            className="space-y-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <InputField
                label="Collection Name *"
                placeholder="e.g. Field Notes"
                error={errors.name?.message}
                {...register('name')}
              />

              <div className="min-w-0">
                <InputField
                  label="Slug *"
                  placeholder="e.g. field-notes"
                  error={errors.slug?.message ?? (slugConflict ? `Slug already used by "${slugConflict}"` : undefined)}
                  {...register('slug', {
                    onChange: () => setSlugManuallyEdited(true),
                  })}
                />
                <p className="mt-1 text-[10px] text-ink-muted">
                  Auto-generated from name. Edit to customise.
                </p>
              </div>
            </div>

            <InputField
              label="Tagline *"
              placeholder="e.g. Informed by the everyday"
              error={errors.tagline?.message}
              {...register('tagline')}
            />

            <TextAreaField
              label="Description *"
              placeholder="Short editorial summary of the collection."
              rows={3}
              error={errors.description?.message}
              {...register('description')}
            />

            <TextAreaField
              label="Story (optional)"
              placeholder="Longer editorial story shown on the collection detail page."
              rows={4}
              error={errors.story?.message}
              {...register('story')}
            />

            <InputField
              label="Hero Image URL *"
              placeholder="/images/collection-essentials.jpg"
              error={errors.imageUrl?.message}
              {...register('imageUrl')}
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="min-w-0">
                <label className="field-label">Status *</label>
                <select
                  className="flex h-11 w-full rounded-sm border border-ink/20 bg-white px-3.5 text-sm text-ink transition-colors focus-visible:border-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink"
                  {...register('status')}
                >
                  <option value="draft">Draft — hidden from public</option>
                  <option value="published">Published — visible to public</option>
                  <option value="archived">Archived — permanently hidden</option>
                </select>
                {errors.status && (
                  <p className="mt-1.5 text-xs text-destructive">{errors.status.message}</p>
                )}
              </div>

              <InputField
                label="Sort Order"
                type="number"
                placeholder="1"
                error={errors.sortOrder?.message}
                {...register('sortOrder')}
              />
            </div>

            {/* Product selection */}
            <div>
              <label className="field-label">Assign Products</label>
              <p className="mb-2 text-[10px] text-ink-muted">
                Select product IDs to include in this collection. You can also type IDs directly.
              </p>
              <div className="max-h-48 overflow-y-auto border border-ink/15 bg-white p-3 space-y-1">
                {allProducts?.map((p) => {
                  const ids = watch('productIds')
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean);
                  const checked = ids.includes(p.id);
                  return (
                    <label key={p.id} className="flex cursor-pointer items-center gap-2 py-1 text-xs hover:bg-bone px-2 rounded-sm">
                      <input
                        type="checkbox"
                        className="accent-[#171714]"
                        checked={checked}
                        onChange={(e) => {
                          const current = watch('productIds')
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean);
                          const next = e.target.checked
                            ? [...current, p.id]
                            : current.filter((id) => id !== p.id);
                          setValue('productIds', next.join(', '));
                        }}
                      />
                      <span className="font-medium">{p.name}</span>
                      <span className="ml-auto font-mono text-[10px] text-ink-muted">{p.id}</span>
                    </label>
                  );
                })}
                {!allProducts?.length && (
                  <p className="py-2 text-center text-xs text-ink-muted">Loading products…</p>
                )}
              </div>
              <TextAreaField
                label="Product IDs (comma-separated)"
                placeholder="prd_essential-boxy-tee, prd_studio-hoodie"
                rows={2}
                error={errors.productIds?.message}
                {...register('productIds')}
              />
            </div>

            {upsertMutation.isError && (
              <p className="text-xs text-destructive">
                {upsertMutation.error instanceof Error
                  ? upsertMutation.error.message
                  : 'An error occurred. Please try again.'}
              </p>
            )}

            <div className="flex gap-4 border-t border-ink/10 pt-4">
              <Button
                type="submit"
                disabled={upsertMutation.isPending || Boolean(slugConflict)}
              >
                {upsertMutation.isPending ? 'Saving…' : editingCollection ? 'Update Collection' : 'Create Collection'}
              </Button>
              <Button type="button" variant="outline" onClick={closeForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      {!isFormOpen && (
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
          <input
            type="search"
            placeholder="Search collections…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-10 w-full rounded-sm border border-ink/20 bg-white pl-9 pr-3.5 text-sm text-ink placeholder:text-ink-muted/70 focus-visible:border-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink"
          />
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-28 w-full" />
          ))}
        </div>
      ) : isError ? (
        <div className="border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Could not load collections. Refresh to try again.
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-dashed border-ink/20 py-14 text-center">
          <FolderOpen className="mx-auto mb-3 size-8 text-ink-muted" />
          <p className="text-sm text-ink-muted">
            {search ? 'No collections match your search.' : 'No collections yet. Create your first one.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((col) => (
            <div
              key={col.id}
              className="flex flex-col gap-4 border border-ink/15 bg-paper p-5 sm:flex-row sm:items-center"
            >
              {/* Thumbnail */}
              <img
                src={col.imageUrl}
                alt={col.name}
                className="h-16 w-24 shrink-0 object-cover bg-bone-deep"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-xl">{col.name}</h3>
                  <StatusBadge status={col.status} />
                </div>
                <p className="font-mono text-xs text-ink-muted mt-0.5">/{col.slug}</p>
                <p className="mt-1 text-xs text-ink-muted truncate">{col.tagline}</p>
                <div className="mt-1.5 flex flex-wrap gap-3 text-[10px] text-ink-muted">
                  <span>{col.productIds.length} product{col.productIds.length !== 1 ? 's' : ''}</span>
                  <span>Sort #{col.sortOrder}</span>
                  <span>Created {new Date(col.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startEdit(col)}
                  title="Edit collection"
                >
                  <Edit2 className="size-3" /> Edit
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => publishMutation.mutate(col)}
                  disabled={publishMutation.isPending || col.status === 'archived'}
                  title={col.status === 'published' ? 'Unpublish (set to draft)' : 'Publish'}
                >
                  {col.status === 'published' ? (
                    <><XCircle className="size-3" /> Unpublish</>
                  ) : (
                    <><CheckCircle2 className="size-3" /> Publish</>
                  )}
                </Button>

                {col.status !== 'archived' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => archiveMutation.mutate(col)}
                    disabled={archiveMutation.isPending}
                    title="Archive collection"
                  >
                    <Archive className="size-3" /> Archive
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:border-destructive hover:bg-destructive/5"
                  onClick={() => setDeleteTarget(col)}
                  title="Delete collection"
                >
                  <Trash2 className="size-3" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deleteTarget && (
        <DeleteDialog
          collection={deleteTarget}
          onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
          isPending={deleteMutation.isPending}
        />
      )}
    </div>
  );
}


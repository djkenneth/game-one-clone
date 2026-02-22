import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getProduct,
  createVariant, updateVariant, deleteVariant,
  addProductImage, deleteProductImage,
  createProductOption, deleteProductOption,
  addProductTag, removeProductTag,
} from '@/api/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormDialog } from '@/components/shared/FormDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Trash2, Pencil, X } from 'lucide-react';
import type { Product, ProductVariant, ProductImage, ProductOption, ProductTag } from '@/types';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Variant dialog
  const [variantDialog, setVariantDialog] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [variantForm, setVariantForm] = useState({ sku: '', price: '', stock: '0', option1: '', option2: '', option3: '', compareAtPrice: '', title: '' });
  const [savingVariant, setSavingVariant] = useState(false);
  const [deleteVariantId, setDeleteVariantId] = useState<number | null>(null);

  // Image dialog
  const [imageDialog, setImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [savingImage, setSavingImage] = useState(false);
  const [deleteImageId, setDeleteImageId] = useState<number | null>(null);

  // Option dialog
  const [optionDialog, setOptionDialog] = useState(false);
  const [optionName, setOptionName] = useState('');
  const [optionValues, setOptionValues] = useState('');
  const [savingOption, setSavingOption] = useState(false);
  const [deleteOptionId, setDeleteOptionId] = useState<number | null>(null);

  // Tag
  const [newTag, setNewTag] = useState('');
  const [savingTag, setSavingTag] = useState(false);

  const fetchProduct = () => {
    setLoading(true);
    getProduct(Number(id))
      .then((res) => setProduct(res.data.product ?? res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProduct(); }, [id]);

  // ── Variants ─────────────────────────────────────────────────────────────
  const openAddVariant = () => {
    setEditingVariant(null);
    setVariantForm({ sku: '', price: '', stock: '0', option1: '', option2: '', option3: '', compareAtPrice: '', title: '' });
    setVariantDialog(true);
  };
  const openEditVariant = (v: ProductVariant) => {
    setEditingVariant(v);
    setVariantForm({
      sku: v.sku, price: String(v.price), stock: String(v.stock),
      option1: v.option1 ?? '', option2: v.option2 ?? '', option3: v.option3 ?? '',
      compareAtPrice: v.compareAtPrice ? String(v.compareAtPrice) : '',
      title: v.title ?? '',
    });
    setVariantDialog(true);
  };

  const handleSaveVariant = async () => {
    setSavingVariant(true);
    try {
      const payload: Record<string, unknown> = {
        sku: variantForm.sku, price: Number(variantForm.price),
        stock: Number(variantForm.stock),
        option1: variantForm.option1 || undefined,
        option2: variantForm.option2 || undefined,
        option3: variantForm.option3 || undefined,
        compareAtPrice: variantForm.compareAtPrice ? Number(variantForm.compareAtPrice) : undefined,
        title: variantForm.title || undefined,
      };
      if (editingVariant) {
        await updateVariant(editingVariant.id, payload);
        toast({ title: 'Variant updated' });
      } else {
        await createVariant(Number(id), payload);
        toast({ title: 'Variant added' });
      }
      setVariantDialog(false);
      fetchProduct();
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    } finally {
      setSavingVariant(false);
    }
  };

  const handleDeleteVariant = async () => {
    if (!deleteVariantId) return;
    try {
      await deleteVariant(deleteVariantId);
      toast({ title: 'Variant deleted' });
      setDeleteVariantId(null);
      fetchProduct();
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  // ── Images ────────────────────────────────────────────────────────────────
  const handleAddImage = async () => {
    if (!imageUrl) return;
    setSavingImage(true);
    try {
      await addProductImage(Number(id), { url: imageUrl, altText: imageAlt || undefined });
      toast({ title: 'Image added' });
      setImageDialog(false);
      setImageUrl(''); setImageAlt('');
      fetchProduct();
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    } finally {
      setSavingImage(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!deleteImageId) return;
    try {
      await deleteProductImage(deleteImageId);
      toast({ title: 'Image deleted' });
      setDeleteImageId(null);
      fetchProduct();
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  // ── Options ───────────────────────────────────────────────────────────────
  const handleAddOption = async () => {
    if (!optionName || !optionValues) return;
    setSavingOption(true);
    try {
      await createProductOption(Number(id), {
        name: optionName,
        values: optionValues.split(',').map((v) => v.trim()).filter(Boolean),
      });
      toast({ title: 'Option added' });
      setOptionDialog(false);
      setOptionName(''); setOptionValues('');
      fetchProduct();
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    } finally {
      setSavingOption(false);
    }
  };

  const handleDeleteOption = async () => {
    if (!deleteOptionId) return;
    try {
      await deleteProductOption(deleteOptionId);
      toast({ title: 'Option deleted' });
      setDeleteOptionId(null);
      fetchProduct();
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  // ── Tags ─────────────────────────────────────────────────────────────────
  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    setSavingTag(true);
    try {
      await addProductTag(Number(id), newTag.trim());
      toast({ title: 'Tag added' });
      setNewTag('');
      fetchProduct();
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    } finally {
      setSavingTag(false);
    }
  };

  const handleRemoveTag = async (tag: string) => {
    try {
      await removeProductTag(Number(id), tag);
      fetchProduct();
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex h-40 items-center justify-center text-muted-foreground">Loading…</div>;
  if (!product) return <div className="text-center text-muted-foreground">Product not found.</div>;

  const vf = (k: keyof typeof variantForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setVariantForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/products')}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-xl font-bold">{product.name}</h1>
          <p className="text-sm text-muted-foreground">#{product.id} · {product.category?.name}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/products/${id}/edit`)}>
            <Pencil className="mr-1.5 h-4 w-4" />Edit
          </Button>
        </div>
      </div>

      <Tabs defaultValue="variants">
        <TabsList>
          <TabsTrigger value="variants">Variants ({product.variants?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="images">Images ({product.images?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="options">Options ({product.options?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="tags">Tags ({product.tags?.length ?? 0})</TabsTrigger>
        </TabsList>

        {/* Variants */}
        <TabsContent value="variants" className="space-y-3 pt-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={openAddVariant}><Plus className="mr-1.5 h-3.5 w-3.5" />Add Variant</Button>
          </div>
          <div className="space-y-2">
            {product.variants?.map((v) => (
              <div key={v.id} className="flex items-center justify-between rounded-md border bg-white p-3">
                <div>
                  <p className="text-sm font-medium">{v.title ?? v.sku}</p>
                  <p className="text-xs text-muted-foreground">SKU: {v.sku} · Stock: {v.stock} · {formatCurrency(Number(v.price))}</p>
                  {(v.option1 || v.option2 || v.option3) && (
                    <p className="text-xs text-muted-foreground">{[v.option1, v.option2, v.option3].filter(Boolean).join(' / ')}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEditVariant(v)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteVariantId(v.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Images */}
        <TabsContent value="images" className="space-y-3 pt-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setImageDialog(true)}><Plus className="mr-1.5 h-3.5 w-3.5" />Add Image</Button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {product.images?.map((img) => (
              <div key={img.id} className="relative group rounded-md border overflow-hidden bg-gray-50">
                <img src={img.url} alt={img.altText ?? ''} className="h-32 w-full object-cover" />
                <button
                  onClick={() => setDeleteImageId(img.id)}
                  className="absolute right-1 top-1 rounded bg-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Options */}
        <TabsContent value="options" className="space-y-3 pt-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setOptionDialog(true)}><Plus className="mr-1.5 h-3.5 w-3.5" />Add Option</Button>
          </div>
          <div className="space-y-3">
            {product.options?.map((opt) => (
              <div key={opt.id} className="rounded-md border bg-white p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">{opt.name}</p>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteOptionId(opt.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {opt.values.map((v) => <Badge key={v.id} variant="secondary">{v.value}</Badge>)}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Tags */}
        <TabsContent value="tags" className="space-y-3 pt-4">
          <div className="flex gap-2">
            <Input
              placeholder="New tag…"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="w-48"
            />
            <Button size="sm" onClick={handleAddTag} disabled={savingTag || !newTag.trim()}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.tags?.map((t) => (
              <span key={t.id} className="flex items-center gap-1 rounded-full border px-3 py-1 text-sm">
                {t.tag}
                <button onClick={() => handleRemoveTag(t.tag)} className="ml-0.5 text-muted-foreground hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Variant dialog */}
      <FormDialog
        open={variantDialog}
        title={editingVariant ? 'Edit Variant' : 'Add Variant'}
        onClose={() => setVariantDialog(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setVariantDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveVariant} disabled={savingVariant}>{savingVariant ? 'Saving…' : 'Save'}</Button>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>SKU *</Label><Input value={variantForm.sku} onChange={vf('sku')} /></div>
          <div className="space-y-1.5"><Label>Title</Label><Input value={variantForm.title} onChange={vf('title')} /></div>
          <div className="space-y-1.5"><Label>Price *</Label><Input type="number" value={variantForm.price} onChange={vf('price')} /></div>
          <div className="space-y-1.5"><Label>Compare At</Label><Input type="number" value={variantForm.compareAtPrice} onChange={vf('compareAtPrice')} /></div>
          <div className="space-y-1.5"><Label>Stock</Label><Input type="number" value={variantForm.stock} onChange={vf('stock')} /></div>
          <div className="space-y-1.5"><Label>Option 1</Label><Input value={variantForm.option1} onChange={vf('option1')} placeholder="e.g. Red" /></div>
          <div className="space-y-1.5"><Label>Option 2</Label><Input value={variantForm.option2} onChange={vf('option2')} placeholder="e.g. Large" /></div>
          <div className="space-y-1.5"><Label>Option 3</Label><Input value={variantForm.option3} onChange={vf('option3')} /></div>
        </div>
      </FormDialog>

      {/* Image dialog */}
      <FormDialog
        open={imageDialog}
        title="Add Image"
        onClose={() => setImageDialog(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setImageDialog(false)}>Cancel</Button>
            <Button onClick={handleAddImage} disabled={savingImage || !imageUrl}>{savingImage ? 'Adding…' : 'Add'}</Button>
          </>
        }
      >
        <div className="space-y-1.5"><Label>Image URL *</Label><Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" /></div>
        <div className="space-y-1.5"><Label>Alt Text</Label><Input value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} /></div>
      </FormDialog>

      {/* Option dialog */}
      <FormDialog
        open={optionDialog}
        title="Add Option"
        onClose={() => setOptionDialog(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setOptionDialog(false)}>Cancel</Button>
            <Button onClick={handleAddOption} disabled={savingOption || !optionName || !optionValues}>{savingOption ? 'Adding…' : 'Add'}</Button>
          </>
        }
      >
        <div className="space-y-1.5"><Label>Option Name *</Label><Input value={optionName} onChange={(e) => setOptionName(e.target.value)} placeholder="e.g. Color" /></div>
        <div className="space-y-1.5"><Label>Values (comma-separated) *</Label><Input value={optionValues} onChange={(e) => setOptionValues(e.target.value)} placeholder="Red, Blue, Green" /></div>
      </FormDialog>

      <ConfirmDialog open={deleteVariantId !== null} title="Delete Variant" description="Remove this variant?" onConfirm={handleDeleteVariant} onCancel={() => setDeleteVariantId(null)} />
      <ConfirmDialog open={deleteImageId !== null} title="Delete Image" description="Remove this image?" onConfirm={handleDeleteImage} onCancel={() => setDeleteImageId(null)} />
      <ConfirmDialog open={deleteOptionId !== null} title="Delete Option" description="Remove this option and all its values?" onConfirm={handleDeleteOption} onCancel={() => setDeleteOptionId(null)} />
    </div>
  );
}

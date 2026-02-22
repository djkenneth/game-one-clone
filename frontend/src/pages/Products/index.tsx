import { CardGridCol } from './CardGridCol';
import { getBrands, getCategories } from '@/api/catalog';
import { Button } from '@/components/ui/button';
import Container from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useProducts } from '@/context/ProductsContext';
import type { Brand, Category } from '@/types';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import { useSearchParams } from 'react-router-dom';

const selectClass =
  'w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

const Products = () => {
  const { onFetchProducts, page, setPage, totalPages, isLoading, products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(
    searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined,
  );
  const [selectedBrandId, setSelectedBrandId] = useState<number | undefined>(
    searchParams.get('brandId') ? Number(searchParams.get('brandId')) : undefined,
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Load categories and brands once on mount
  useEffect(() => {
    getCategories().then((res) => setCategories(res.data.categories)).catch(() => {});
    getBrands().then((res) => setBrands(res.data.brands)).catch(() => {});
  }, []);

  const applyFilters = (currentPage = page) => {
    const params: Record<string, string> = {};
    if (searchInput) params.search = searchInput;
    if (selectedCategoryId) params.categoryId = String(selectedCategoryId);
    if (selectedBrandId) params.brandId = String(selectedBrandId);
    if (currentPage > 1) params.page = String(currentPage);
    setSearchParams(params);
    onFetchProducts({
      search: searchInput || undefined,
      categoryId: selectedCategoryId,
      brandId: selectedBrandId,
      page: currentPage,
    });
  };

  useEffect(() => {
    const searchFromUrl = searchParams.get('search') ?? undefined;
    const categoryFromUrl = searchParams.get('categoryId')
      ? Number(searchParams.get('categoryId'))
      : undefined;
    const brandFromUrl = searchParams.get('brandId')
      ? Number(searchParams.get('brandId'))
      : undefined;
    setSearchInput(searchFromUrl ?? '');
    setSelectedCategoryId(categoryFromUrl);
    setSelectedBrandId(brandFromUrl);
    onFetchProducts({ search: searchFromUrl, categoryId: categoryFromUrl, brandId: brandFromUrl, page: 1 });
    setPage(1);
  }, [searchParams.get('search'), searchParams.get('categoryId'), searchParams.get('brandId')]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    applyFilters(1);
  };

  const clearFilters = () => {
    setSearchInput('');
    setSelectedCategoryId(undefined);
    setSelectedBrandId(undefined);
    setPage(1);
    setSearchParams({});
    onFetchProducts({ page: 1 });
  };

  const goToPage = (p: number) => {
    setPage(p);
    applyFilters(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = searchInput || selectedCategoryId || selectedBrandId;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-dark-90 py-8">
        <Container>
          <p className="text-xs font-medium uppercase tracking-widest text-red-500">Store</p>
          <h1 className="mt-1 font-oswald text-2xl font-bold uppercase tracking-wide text-white md:text-3xl">
            All Products
          </h1>
        </Container>
      </div>

      <Container>
        <div className="flex flex-col gap-6 py-8 md:flex-row">
          {/* Filters Sidebar */}
          <aside className="w-full flex-shrink-0 md:w-60">
            <div className="sticky top-4 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
                <HiOutlineAdjustmentsHorizontal className="h-4 w-4 text-gray-500" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Filters
                </h3>
              </div>

              <form onSubmit={handleSearch} className="space-y-4 p-4">
                {/* Search */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">Search</label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
                    <Input
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Product name..."
                      className="pl-8 text-sm"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">
                    Category
                  </label>
                  <select
                    className={selectClass}
                    value={selectedCategoryId ?? ''}
                    onChange={(e) =>
                      setSelectedCategoryId(e.target.value ? Number(e.target.value) : undefined)
                    }
                  >
                    <option value="">All categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">Brand</label>
                  <select
                    className={selectClass}
                    value={selectedBrandId ?? ''}
                    onChange={(e) =>
                      setSelectedBrandId(e.target.value ? Number(e.target.value) : undefined)
                    }
                  >
                    <option value="">All brands</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Button type="submit" variant="solidred" className="w-full" disabled={isLoading}>
                  Apply Filters
                </Button>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="w-full text-xs text-gray-400 hover:text-red-600"
                  >
                    Clear filters
                  </button>
                )}
              </form>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {isLoading ? (
                  <span className="animate-pulse">Loading products…</span>
                ) : (
                  <>
                    <span className="font-semibold text-gray-800">{products.length}</span> product
                    {products.length !== 1 ? 's' : ''} found
                    {searchInput && (
                      <span className="ml-1 text-gray-400">
                        for "<span className="italic">{searchInput}</span>"
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>

            <CardGridCol />

            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem
                    className={page <= 1 ? 'pointer-events-none opacity-40' : 'cursor-pointer'}
                  >
                    <PaginationPrevious onClick={() => goToPage(page - 1)} />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <PaginationItem key={p} className="cursor-pointer">
                      <PaginationLink
                        isActive={p === page}
                        onClick={() => goToPage(p)}
                        className={
                          p === page ? 'bg-red-600 text-white hover:bg-red-700 border-red-600' : ''
                        }
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem
                    className={
                      page >= totalPages ? 'pointer-events-none opacity-40' : 'cursor-pointer'
                    }
                  >
                    <PaginationNext onClick={() => goToPage(page + 1)} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Products;

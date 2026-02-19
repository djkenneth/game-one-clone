import { CardGridCol } from './CardGridCol';
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
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const Products = () => {
  const { onFetchProducts, page, setPage, totalPages, isLoading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');

  const applyFilters = (currentPage = page) => {
    const params: Record<string, string> = {};
    if (searchInput) params.search = searchInput;
    if (currentPage > 1) params.page = String(currentPage);
    setSearchParams(params);
    onFetchProducts({ search: searchInput || undefined, page: currentPage });
  };

  useEffect(() => {
    const searchFromUrl = searchParams.get('search') ?? undefined;
    setSearchInput(searchFromUrl ?? '');
    onFetchProducts({ search: searchFromUrl, page: 1 });
    setPage(1);
  }, [searchParams.get('search')]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    applyFilters(1);
  };

  const goToPage = (p: number) => {
    setPage(p);
    applyFilters(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container>
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="rounded-lg border p-4 space-y-4 sticky top-4">
            <h3 className="font-semibold text-sm uppercase tracking-wide">Filters</h3>
            <form onSubmit={handleSearch} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Search</label>
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Product name..."
                />
              </div>
              <Button type="submit" variant="solidred" className="w-full" disabled={isLoading}>
                Apply
              </Button>
            </form>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">All Products</h2>
          </div>
          <CardGridCol />

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}>
                  <PaginationPrevious onClick={() => goToPage(page - 1)} />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <PaginationItem key={p} className="cursor-pointer">
                    <PaginationLink isActive={p === page} onClick={() => goToPage(p)}>
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem className={page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}>
                  <PaginationNext onClick={() => goToPage(page + 1)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Products;

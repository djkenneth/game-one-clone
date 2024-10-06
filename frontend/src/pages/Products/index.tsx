import { CardGridCol } from './CardGridCol';
// import { Slider } from '@/components/ui/slider'
// import useDebounce from '@/hooks/useDebounce';
import { Button } from '@/components/ui/button';
// import { formatNumberToCurrency } from '@/lib/utils';
// Custom Components
import Container from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent, // PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { useProducts } from '@/context/ProductsContext';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

const Products = () => {
  const {
    onFetchProducts,
    skip,
    setSkip,
    take,
    nextPage,
    previesPage,
    pages,
    isPreviousActive,
    isNextActive,
    setIsLoading
  } = useProducts();
  const navigate = useNavigate();
  const { category, subCategory } = useParams();
  const [search, setSearch] = useSearchParams();
  const [min, setMin] = useState<number>();
  const [max, setMax] = useState<number>();
  // const [defaultValue, setDefaultValue] = useState([lowestPrice, highestPrice])
  // const debouncedValue = useDebounce(defaultValue)

  const applyFilters = () => {
    setIsLoading(true);
    const filters: any = {
      AND: []
    };

    if (min && max) {
      filters.AND.push({ price: { gte: min } }, { price: { lte: max } });
    }

    if (category) {
      filters.AND.push({ categories: { some: { slug: { contains: category } } } });
    }

    if (subCategory) {
      filters.AND.push({ categories: { some: { slug: { contains: subCategory } } } });
    }

    onFetchProducts({ skip, take, filters });
    setInterval(() => {
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    applyFilters();
  }, [navigate, skip]);

  return (
    <Container>
      <div className="flex gap-2">
        <div className="w-[25%]">
          <div className="grid grid-cols-1 divide-y pl-10">
            <div className="space-y-3 py-3">
              <h3 className="font-mono text-lg font-bold uppercase">Price range</h3>
              <div>
                {/* {lowestPrice && highestPrice && (
                                    <Slider
                                        defaultValue={defaultValue}
                                        min={lowestPrice}
                                        max={highestPrice}
                                        step={5}
                                        onValueChange={setDefaultValue}
                                        formatLabel={(value) => `${formatNumberToCurrency(value)}`}
                                        minStepsBetweenThumbs={0}
                                    />
                                )} */}
                <div className="flex justify-between">
                  <Input type="number" min={0} placeholder="MIN" onChange={(e) => setMin(parseInt(e.target.value))} />
                  <Input type="number" min={0} placeholder="MAX" onChange={(e) => setMax(parseInt(e.target.value))} />
                </div>
              </div>
            </div>
            {/* <div>02</div> */}
            <div className="text-right">
              <Button onClick={applyFilters} variant="solidred" size="lg">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
        <div className="w-[75%] space-y-5">
          <CardGridCol />
          <Pagination>
            <PaginationContent>
              <PaginationItem className={isPreviousActive ? 'cursor-pointer' : 'pointer-events-none'}>
                <PaginationPrevious onClick={previesPage} />
              </PaginationItem>
              {pages.map((page, index) => (
                <PaginationItem
                  key={index.toString()}
                  onClick={() => {
                    setSkip(page);
                    setSearch({ page: `${index + 1}` });
                  }}
                  className="cursor-pointer"
                >
                  <PaginationLink>{index + 1}</PaginationLink>
                </PaginationItem>
              ))}
              {/* <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem> */}
              <PaginationItem className={isNextActive ? 'cursor-pointer' : 'pointer-events-none'}>
                <PaginationNext onClick={nextPage} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </Container>
  );
};

export default Products;

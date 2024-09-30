import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '@/context/ProductsContext';
// import { formatNumberToCurrency } from '@/lib/utils';

// Custom Components
import { CardGridCol } from './CardGridCol'
// import { Slider } from '@/components/ui/slider'
// import useDebounce from '@/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


const Products = () => {
    const { fetchProducts, setIsLoading } = useProducts();
    const navigate = useNavigate();
    const { category, subCategory } = useParams();
    const [skip, setSkip] = useState(0);
    const [take, setTake] = useState(36);
    const [min, setMin] = useState<number>();
    const [max, setMax] = useState<number>();
    // const [defaultValue, setDefaultValue] = useState([lowestPrice, highestPrice])
    // const debouncedValue = useDebounce(defaultValue)

    // const handleRangeChange = (value: number[]) => {

    const applyFilters = () => {
        setIsLoading(true)
        const filters: any = {
            AND: [],
        };

        if (min && max) {
            filters.AND.push(
                { price: { gte: min } },
                { price: { lte: max } },
                { categories: { some: { slug: { contains: 'accessories' } } } }
            )
        }

        fetchProducts(skip, take, filters)
        setInterval(() => {
            setIsLoading(false);
        }, 500)
    }

    const onLoad = () => {
        const filters: any = {
            AND: [],
        };

        if (category) {
            filters.AND.push(
                { categories: { some: { slug: { contains: category } } } }
            )
        }

        if (subCategory) {
            filters.AND.push(
                { categories: { some: { slug: { contains: subCategory } } } }
            )
        }

        fetchProducts(skip, take, filters); // Automatically fetch products when the component mounts
    }

    useEffect(() => {
        onLoad();
    }, [navigate]);

    return (
        <div className="container max-w-7xl mx-auto 2xl:max-w-[90%]">
            <div className="flex gap-2">
                <div className="w-[25%]">
                    <div className="grid grid-cols-1 divide-y pl-10">
                        <div className="space-y-3 py-3">
                            <h3 className="text-lg font-bold uppercase font-mono">Price range</h3>
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
                        <div className='text-right'>
                            <Button onClick={applyFilters} variant="solidred" size="lg">
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="w-[75%]">
                    <CardGridCol />
                </div>
            </div>
        </div>
    )
}

export default Products;
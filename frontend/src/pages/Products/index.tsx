// import { useEffect, useState } from 'react'

// import { formatNumberToCurrency } from '@/lib/utils';

// import { useDebounce } from "@uidotdev/usehooks";

// Custom Components
import { CardGridCol } from './CardGridCol'
// import { Slider } from '@/components/ui/slider'


const Products = () => {
    // const [range, setRange] = useState([1000, 10000]);
    // const [trigger, setTrigger] = useState(false);
    // const debouncedSearchTerm = useDebounce(range, 1000);

    // const handleRangeChange = (value: number[]) => {
    //     setRange(value);
    //     setTrigger(true);
    // };

    // useEffect(() => {
    //     if (trigger) {
    //         if (debouncedSearchTerm) {
    //             console.log('debouncedSearchTerm', debouncedSearchTerm);
    //         }
    //     }
    // }, [debouncedSearchTerm])

    return (
        <div className="container max-w-7xl mx-auto 2xl:max-w-[90%]">
            <div className="flex gap-2">
                <div className="w-[25%]">
                    <div className="grid grid-cols-1 divide-y pl-10">
                        <div className="space-y-3 py-3">
                            <h3 className="text-lg font-bold uppercase font-mono">Price</h3>
                            <div className="px-4">
                                {/* <Slider
                                    defaultValue={[1000, 10000]}
                                    min={1000}
                                    max={10000}
                                    step={1}
                                    value={range}
                                    onValueChange={handleRangeChange}
                                    formatLabel={(value) => `${formatNumberToCurrency(value)}`}
                                    minStepsBetweenThumbs={0} /> */}
                            </div>
                        </div>
                        <div>02</div>
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
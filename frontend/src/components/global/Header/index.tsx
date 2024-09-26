import { MainHeader } from "./MainHeader";
import { MainMenu } from "./MainMenu";
import { MainPanelTop } from "./MainPanelTop";

// import {
//     Accordion,
//     AccordionContent,
//     AccordionItem,
//     AccordionTrigger,
// } from "@/components/ui/accordion"

export const Header = () => {
    return (
        <header className="bg-white">
            <nav aria-label="Global">
                <MainPanelTop />
                <MainHeader />
                <MainMenu />
                {/* <div>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg font-semibold uppercase hover:no-underline">Is it accessible?</AccordionTrigger>
                            <AccordionContent>
                                Yes. It adheres to the WAI-ARIA design pattern.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Is it accessible?</AccordionTrigger>
                            <AccordionContent>
                                Yes. It adheres to the WAI-ARIA design pattern.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div> */}
            </nav>
        </header>
    )
}

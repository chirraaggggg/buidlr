import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { CodeBlock, CodeBlockCopyButton } from "@/components/ai-elements/code-block";

const HtmlDialog = ({
    open,
    title,
    theme_style,
    onOpenChange,
    html
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    html: string;
    title?: string;
    theme_style?: string;
}) => {
    let finalHtml = html;
    if (!finalHtml.trim().toLowerCase().startsWith("<!doctype")) {
        finalHtml = `<!DOCTYPE html>\n${finalHtml}`;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* Override sm:max-w-lg and make it responsive and wide */}
            <DialogContent className="sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[1200px] h-[85vh] flex flex-col gap-0 p-0 overflow-hidden bg-background">
                {/* Header without bottom border to match screenshot */}
                <DialogHeader className="px-6 pt-6 pb-2 flex flex-row items-center justify-between">
                    <div>
                        <DialogTitle className="text-base font-semibold text-foreground">
                            {title || "Untitled"}
                        </DialogTitle>
                        {/* Hidden description for accessibility */}
                        <DialogDescription className="sr-only">
                            Code Preview
                        </DialogDescription>
                    </div>
                </DialogHeader>
                
                {/* 
                    The code area container. 
                    Adding a padding of 6 around the code block similar to screenshot.
                */}
                <div className="relative flex-1 min-h-0 px-6 pb-6 overflow-hidden">
                    <CodeBlock
                        code={finalHtml}
                        language="html"
                        showLineNumbers={true}
                        className="h-full border border-transparent shadow-none"
                    >
                        {/* 
                            Copy button floating at the top right of the code area.
                            Styled to look like the one in the screenshot (light grey box, rounded).
                        */}
                        <div className="absolute right-4 top-4 z-10">
                            <CodeBlockCopyButton className="h-8 w-8 bg-muted/50 border border-border text-foreground hover:bg-muted" />
                        </div>
                    </CodeBlock>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default HtmlDialog;
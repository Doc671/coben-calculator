import { CodeBlock } from "react-code-block";
import type CobenSaveData from "../lib/persistence/coben-save-data";
import { useCopyToClipboard } from "react-use";
import { useMemo, useRef } from "react";
import { themes } from "prism-react-renderer";

interface SaveDataPanelProps {
    saveData: CobenSaveData;
    importSaveData: (saveData: CobenSaveData) => void;
}

export default function SaveDataPanel({ saveData, importSaveData } : SaveDataPanelProps) {
    const [_, copyToClipboard] = useCopyToClipboard();
    const jsonSaveData: string = useMemo(() => JSON.stringify(saveData, null, 4), [saveData]);

    const isDark: boolean = document.documentElement.classList.contains("dark");

    const inputFile = useRef<HTMLInputElement | null>(null);

    const copyCode = () => {
        copyToClipboard(jsonSaveData);
    };

    const saveJsonFile = () => {
        try {
            const blob = new Blob([jsonSaveData], { "type": "application/json" });

            const url: string = URL.createObjectURL(blob);

            const link: HTMLAnchorElement = document.createElement("a");
            link.href = url;
            link.download = "coben-save-data.json";
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error(`Error saving JSON file: ${error}`);
        }
    };

    return (
        <CodeBlock code={jsonSaveData} language="json" theme={isDark ? themes.vsDark : themes.vsLight}>
            <div className="relative">
                <CodeBlock.Code className="rounded-lg bg-gray-100 dark:bg-gray-900 p-6">
                    <CodeBlock.LineContent>
                        <CodeBlock.Token />
                    </CodeBlock.LineContent>
                </CodeBlock.Code>

                <button 
                    className="rounded-lg bg-gray-900 dark:bg-gray-100 px-2 py-1 absolute top-2 right-2 text-sm"
                    onClick={_ => {
                        copyCode();
                    }}>
                    Copy code
                </button>
            </div>

            <div className="flex md:flex-row gap-3">
                <button
                    className="rounded-lg bg-gray-900 dark:bg-gray-100 px-2 py-1"
                    onClick={async _ => {
                        inputFile.current?.click();
                    }}>
                    Import save data
                </button>
                <button
                    className="rounded-lg bg-gray-900 dark:bg-gray-100 px-2 py-1"
                    onClick={_ => {
                        saveJsonFile();
                    }}>
                    Export save data
                </button>
            </div>

            <input 
                className="hidden" 
                type="file" 
                id="file" 
                ref={inputFile}
                onChange={async (e) => {
                    const file: File | undefined = e.target.files?.[0];
                    if (!file) {
                        return;
                    }

                    const text: string = await file.text();
                    const newSaveData = JSON.parse(text) as CobenSaveData;
                    importSaveData(newSaveData);
                }}
            />
        </CodeBlock>
    )
}

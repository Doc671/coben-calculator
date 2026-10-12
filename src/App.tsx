import AthleteInfoPanel from "./components/AthleteInfoPanel";
import CobenResultPanel from "./components/CobenResultPanel";
import NextEventPointsPanel from "./components/NextEventPointsPanel";
import SaveDataPanel from "./components/SaveDataPanel";
import SettingsPanel from "./components/SettingsPanel";
import { CobenResult } from "./lib/calculator/coben-result";
import { calculateCoben } from "./lib/calculator/coben-runner";
import type CobenSaveData from "./lib/persistence/coben-save-data";
import type { CobenSettings } from "./lib/persistence/coben-settings";
import { useState, useEffect } from "react";

const defaultSettings: CobenSettings = {
    version: 1,
    eliminationCount: 1,
    simulationCount: 1_000_000,
    showWilsonIntervals: true,
    zScore: 1.96,
    roundingMode: "DecimalPlaces",
    roundingNumber: 2,
    tiebreakMode: "Random",
    theme: "System"
};

function App() {
    const [settings, setSettings] = useLocalStorageState<CobenSettings>("coben-settings", defaultSettings);
    const [athleteNames, setAthleteNames] = useLocalStorageState<Array<string>>("athlete-names", new Array<string>());
    const [athleteCurrentPoints, setAthleteCurrentPoints] = useLocalStorageState<Array<number>>("athlete-current-points", new Array<number>());
    const [nextEventPoints, setNextEventPoints] = useLocalStorageState<Array<number>>("next-event-points", new Array<number>());
    const [results, setResults] = useLocalStorageState<Array<CobenResult>>("coben-results", new Array<CobenResult>());
    const [cobenLoading, setCobenLoading] = useLocalStorageState<boolean>("loading", false);
    const [saveData, setSaveData] = useLocalStorageState<CobenSaveData>("coben-save-data", formSaveData());
    
    function updateSetting<K extends keyof CobenSettings>(key: K, value: CobenSettings[K]) {
        setSettings(settings => ({ ...settings, [key]: value }));
    }

    function addAthlete() {
        setAthleteNames(athleteNames => {
            const names = [...athleteNames];
            names.push("");
            return names;
        });

        setAthleteCurrentPoints(athleteCurrentPoints => {
            const currentPoints = [...athleteCurrentPoints];
            currentPoints.push(0);
            return currentPoints;
        });

        setSaveData(formSaveData());
    }

    function updateName(index: number, name: string) {
        setAthleteNames(athleteNames => {
            const names = [...athleteNames];

            if (index < names.length) {
                names[index] = name;
            } else {
                names.push(name);
            }

            return names;
        });

        setSaveData(formSaveData());
    }
    
    function updateCurrentPoints(index: number, newCurrentPoints: number) {
        setAthleteCurrentPoints(athleteCurrentPoints => {
            const currentPoints = [...athleteCurrentPoints];
            
            if (index < currentPoints.length) {
                currentPoints[index] = newCurrentPoints;
            } else {
                currentPoints.push(newCurrentPoints);
            }
            
            return currentPoints;
        });

        setSaveData(formSaveData());
    }
    
    function removeAthlete(index: number) {
        setAthleteNames(athleteNames => athleteNames
            .slice(0, index)
            .concat(athleteNames.slice(index + 1)));

        setAthleteCurrentPoints(athleteCurrentPoints => athleteCurrentPoints
            .slice(0, index)
            .concat(athleteCurrentPoints.slice(index + 1)));

        setSaveData(formSaveData());
    }

    function addNextEventPoints() {
        setNextEventPoints(nextEventPoints => {
            const newPoints = [...nextEventPoints];
            newPoints.push(0);
            return newPoints;
        });

        setSaveData(formSaveData());
    }

    function updateNextEventPoints(index: number, newNextEventPoints: number) {
        setNextEventPoints(nextEventPoints => {
            const nextEventPointsCopy = [...nextEventPoints];

            if (index < nextEventPointsCopy.length) {
                nextEventPointsCopy[index] = newNextEventPoints;
            } else {
                nextEventPointsCopy.push(newNextEventPoints);
            }

            return nextEventPointsCopy;
        });

        setSaveData(formSaveData());
    }

    function removeNextEventPoints(index: number) {
        setNextEventPoints(nextEventPoints => nextEventPoints
            .slice(0, index)
            .concat(nextEventPoints.slice(index + 1)));

        setSaveData(formSaveData());
    }

    function updateResults(results: Array<CobenResult>) {
        setResults(results);

        setSaveData(formSaveData());
    }

    function importSaveData(saveData: CobenSaveData) {
        setSettings(saveData.settings);
        setAthleteNames(saveData.names);
        setAthleteCurrentPoints(saveData.currentPoints);
        setNextEventPoints(saveData.nextEventPoints);

        setSaveData(formSaveData());
    }

    function formSaveData(): CobenSaveData {
        return {
            settings: settings,
            names: athleteNames,
            currentPoints: athleteCurrentPoints,
            nextEventPoints: nextEventPoints
        } as CobenSaveData;
    }

    return (
        <div className="flex flex-col gap-4 max-w-4xl mx-auto p-4">
            <SettingsPanel settings={settings} onUpdateSetting={updateSetting} />
            <button 
                className="rounded-lg bg-red-200 dark:bg-red-800 px-2 py-1"
                onClick={() => {
                    setSettings(defaultSettings);
                }}>
                Reset to default
            </button>
            <hr />
            <div className="flex flex-col md:flex-row gap-4">
                <AthleteInfoPanel 
                    names={athleteNames} 
                    points={athleteCurrentPoints} 
                    onAddAthlete={addAthlete}
                    onUpdateName={updateName} 
                    onUpdatePoints={updateCurrentPoints} 
                    onRemoveAthlete={removeAthlete} 
                />
                <NextEventPointsPanel
                    nextEventPoints={nextEventPoints}
                    onAddPoints={addNextEventPoints}
                    onUpdatePoints={updateNextEventPoints}
                    onRemovePoints={removeNextEventPoints}
                />
            </div>
            <button
                className="rounded-lg bg-red-200 dark:bg-red-800 px-2 py-1"
                onClick={() => {
                    setAthleteNames([]);
                    setAthleteCurrentPoints([]);
                    setNextEventPoints([]);
                }}>
                Clear all
            </button>
            <hr />
            {athleteNames.length != nextEventPoints.length && <p>Number of athletes and next event points are not equal!</p>}
            <button
                className={cobenLoading ? "rounded-lg bg-grey-200 dark:bg-grey-800 px-2 py-1" : "rounded-lg bg-blue-200 dark:bg-blue-800 px-2 py-1"}
                disabled={cobenLoading}
                onClick={async _ => {
                    setCobenLoading(true);
                    updateResults(await runCoben(settings, athleteNames, athleteCurrentPoints, nextEventPoints));
                    setCobenLoading(false);
                }}>
                {cobenLoading ? "Loading..." : "Calculate COBEN"}
            </button>
            <CobenResultPanel 
                results={results} 
                showWilsonIntervals={settings.showWilsonIntervals} 
                roundingMode={settings.roundingMode} 
                roundingNumber={settings.roundingNumber} 
            />
            <hr />
            <SaveDataPanel saveData={saveData} importSaveData={importSaveData} />
        </div>
    );
}

function useLocalStorageState<T>(key: string, defaultValue: T) {
    const [value, setValue] = useState<T>(() => {
        try {
            const stored = localStorage.getItem(key);
            return stored ? (JSON.parse(stored) as T) : defaultValue;
        } catch {
            return defaultValue;
        }
    });
    
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {}
    }, [key, value]);
    
    return [value, setValue] as const;
}

async function runCoben(settings: CobenSettings, names: string[], currentPoints: number[], pointsToDistribute: number[]): Promise<Array<CobenResult>> {
    return await calculateCoben(names, currentPoints, pointsToDistribute, settings.eliminationCount, settings.simulationCount, settings.showWilsonIntervals, settings.zScore, settings.tiebreakMode);
}

export default App

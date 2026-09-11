import type { CobenSettings, RoundingMode } from "../lib/persistence/coben-settings"

interface SettingsPanelProps {
    settings: CobenSettings;
    onUpdateSetting: <K extends keyof CobenSettings>(key: K, value: CobenSettings[K]) => void;
}

export default function SettingsPanel({ settings, onUpdateSetting }: SettingsPanelProps) {
    return (
        <div className="flex flex-col md:flex-row gap-3">
            <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2">
                    Elimination count:
                    <input 
                        type="number" 
                        min={1} 
                        step={1}
                        value={settings.eliminationCount} 
                        onChange={e => onUpdateSetting("eliminationCount", Number(e.target.value))}
                    />
                </label>

                <label className="flex items-center gap-2">
                    Simulation count:
                    <input 
                        type="number" 
                        min={1} 
                        step={1}
                        value={settings.simulationCount} 
                        onChange={e => onUpdateSetting("simulationCount", Number(e.target.value))}
                    />
                </label>
            </div>
            <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        checked={settings.showWilsonIntervals}
                        onChange={e => {
                            const showWilsonIntervals = e.target.checked;
                            onUpdateSetting("showWilsonIntervals", showWilsonIntervals);
                            if (!showWilsonIntervals && settings.roundingMode.startsWith("Interval")) {
                                onUpdateSetting("roundingMode", "DecimalPlaces");
                            }
                        }}
                    />
                    Show Wilson intervals
                </label>

                <label className="flex items-center gap-2">
                    Z score:
                    <input 
                        type="number" 
                        min={1} 
                        value={settings.zScore} 
                        disabled={!settings.showWilsonIntervals}
                        className="disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                        onChange={e => onUpdateSetting("zScore", Number(e.target.value))}
                    />
                </label>

                <label className="flex items-center gap-2">
                    Round to
                    <input 
                        type="number"
                        min={settings.roundingMode == "DecimalPlaces" ? 0 : 1}
                        max={7}
                        step={1}
                        value={settings.roundingNumber}
                        className="w-12"
                        onChange={e => onUpdateSetting("roundingNumber", Number(e.target.value))}
                    />

                    <select 
                        value={settings.roundingMode}
                        onChange={e => onUpdateSetting("roundingMode", e.target.value as RoundingMode)}
                    >
                        <option value="DecimalPlaces">decimal places of result</option>
                        <option value="SignificantFigures">significant figures of result</option>
                        <option 
                            value="IntervalSignificantFigures"
                            disabled={!settings.showWilsonIntervals}
                            className="disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed">
                            significant figures of Wilson interval
                        </option>
                    </select>
                </label>
            </div>
        </div>
    );
}

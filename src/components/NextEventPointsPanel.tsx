import { getOrdinalPostfix } from "../lib/helpers";

interface NextEventPointsPanelProps {
    nextEventPoints: number[],
    onAddPoints: () => void;
    onUpdatePoints: (index: number, value: number) => void;
    onRemovePoints: (index: number) => void;
}

export default function NextEventPointsPanel({ nextEventPoints, onAddPoints, onUpdatePoints, onRemovePoints }: NextEventPointsPanelProps) {
    const placeLabelWidth = `${nextEventPoints.length}th`.length;
    const nextEventPointGroups = nextEventPoints.map((points, i)=>
        <li className="flex items-center gap-3 py-1" key={i}>
            <span className={`inline-block shrink-0`} style={{ width: `${placeLabelWidth}ch` }}>
                {i + 1}{getOrdinalPostfix(i + 1)}:
            </span>
            <input 
                className="rounded-lg bg-neutral-200 dark:bg-neutral-800 px-2"
                type="number"
                value={points}
                placeholder="Points"
                onChange={e => onUpdatePoints(i, Number(e.target.value))}
            />
            <button 
                className="rounded-lg bg-red-200 dark:bg-red-800 px-2" 
                onClick={_ => onRemovePoints(i)}>
                -
            </button>
        </li>
    );

    return (
        <div className="flex flex-col gap-3">
            <h2>Next Event Points</h2>
            <ol>{nextEventPointGroups}</ol>
            <button 
                className="rounded-lg bg-green-200 dark:bg-green-800 px-2 py-1" 
                onClick={onAddPoints}>
                Add points
            </button>
        </div>
    );
}

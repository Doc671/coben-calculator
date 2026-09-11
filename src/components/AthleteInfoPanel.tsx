interface AthleteInfoPanelProps {
    names: string[],
    points: number[],
    onAddAthlete: () => void;
    onUpdateName: (index: number, name: string) => void;
    onUpdatePoints: (index: number, points: number) => void;
    onRemoveAthlete: (index: number) => void;
}

export default function AthleteInfoPanel({ names, points, onAddAthlete, onUpdateName, onUpdatePoints, onRemoveAthlete }: AthleteInfoPanelProps) {
    const athleteLabelWidth = `Athlete ${names.length}`.length;
    const nameGroups = names.map((name, i) =>
        <li className="flex items-center gap-3 py-1" key={i}>
            <span className="inline-block shrink-0" style={{ width: `${athleteLabelWidth}ch` }}>
                Athlete {i + 1}
            </span>
            <input 
                className="rounded-lg bg-neutral-200 dark:bg-neutral-800 px-2"
                type="text"
                value={name}
                placeholder="Name"
                onChange={e => onUpdateName(i, e.target.value)}
            />
            <input 
                className="rounded-lg bg-neutral-200 dark:bg-neutral-800 px-2"
                type="number"
                min={0}
                value={points[i]}
                placeholder="Points"
                onChange={e => onUpdatePoints(i, Number(e.target.value))}
            />
            <button 
                className="rounded-lg bg-red-200 dark:bg-red-800 px-2" 
                onClick={_ => onRemoveAthlete(i)}>
                -
            </button>
        </li>
    );

    return (
        <div className="flex flex-col gap-3">
            <h2>Athlete Info</h2>
            <ol>{nameGroups}</ol>
            <button 
                className="rounded-lg bg-green-200 dark:bg-green-800 px-2 py-1" 
                onClick={onAddAthlete}>
                Add new athlete
            </button>
        </div>
    );
}

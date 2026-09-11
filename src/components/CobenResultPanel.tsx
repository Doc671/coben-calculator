import type { CobenResult } from "../lib/calculator/coben-result";
import type { RoundingMode } from "../lib/persistence/coben-settings";

interface CobenResultPanelProps {
    results: Array<CobenResult>,
    showWilsonIntervals: boolean,
    roundingMode: RoundingMode;
    roundingNumber: number;
}

export default function CobenResultPanel({ results, showWilsonIntervals, roundingMode, roundingNumber }: CobenResultPanelProps) {
    const resultFormatterOptions: Intl.NumberFormatOptions = {
        style: "percent"
    };

    if (roundingMode == "DecimalPlaces") {
        resultFormatterOptions.minimumFractionDigits = roundingNumber;
        resultFormatterOptions.maximumFractionDigits = roundingNumber;
    } else if (roundingMode == "SignificantFigures") {
        resultFormatterOptions.minimumSignificantDigits = roundingNumber;
        resultFormatterOptions.maximumSignificantDigits = roundingNumber;
    }

    const percentageFormatter = new Intl.NumberFormat("en-US", resultFormatterOptions);

    const resultRows = results.map((result, i) => {
        let roundedChance: string;
        let roundedLowerInterval: string | undefined = undefined;
        let roundedUpperInterval: string | undefined = undefined;
        if (roundingMode == "DecimalPlaces" || roundingMode == "SignificantFigures") {
            roundedChance = percentageFormatter.format(result.chance);
            if (result.lowerInterval != undefined) {
                roundedLowerInterval = percentageFormatter.format(result.lowerInterval);
                roundedUpperInterval = percentageFormatter.format(result.upperInterval!);
            }
        } else if (result.upperInterval != undefined && result.lowerInterval != undefined) {
            const uncertainty = result.upperInterval - result.lowerInterval;
            const uncertaintyPower = Number(uncertainty.toExponential().split("e")[1]);

            const resultRoundingNumber = Math.max(roundingNumber - uncertaintyPower - 1, 1); // The formatting options are for the percentages, not the original numbers
            resultFormatterOptions.minimumSignificantDigits = resultRoundingNumber;
            resultFormatterOptions.maximumSignificantDigits = resultRoundingNumber;
            console.log(uncertainty, uncertaintyPower, resultRoundingNumber);
            const resultFormatter = new Intl.NumberFormat("en-US", resultFormatterOptions);

            roundedChance = resultFormatter.format(result.chance);
            roundedLowerInterval = resultFormatter.format(result.lowerInterval);
            roundedUpperInterval = resultFormatter.format(result.upperInterval);
        } else {
            roundedChance = "";
        }

        return <tr key={i}>
            <td className="px-2 py-1">{result.name}</td>
            <td className="px-2 py-1">{roundedChance}</td>
            {showWilsonIntervals && roundedLowerInterval != undefined && <td className="px-2 py-1">[{roundedLowerInterval}, {roundedUpperInterval}]</td>}
        </tr>
    });

    return (
        <div>
            { 
                results.length != 0 &&
                <table>
                    <thead>
                        <tr>
                            <th className="px-2 py-1">Name</th>
                            <th className="px-2 py-1">COBEN</th>
                            {showWilsonIntervals && <th className="px-2 py-1">Intervals</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {resultRows}
                    </tbody>
                </table>
            }
        </div>
    );
}

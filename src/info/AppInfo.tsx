import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";
import leaderboardImage from "../assets/cary-algicosathlon-day-2-leaderboard.png";

export default function AppInfo() {
    return (
        <div className="flex flex-col gap-4 max-w-4xl mx-auto p-4">
            <h1 className="text-3xl">COBEN Calculator Further Information</h1>

            <h2 className="text-2xl">What is an Algathlon?</h2>
            <p>In 2012, Cary Huang uploaded the <a className="text-sky-200 dark:text-sky-800" href="https://www.youtube.com/watch?v=2navm9b-ryY">first episode of Algodecathlon</a> to YouTube. It featured different coloured athletes participating in ten events. After each event, each athlete would gain a number of points depending on how well they did. After each event, the athlete with the lowest number of points was eliminated. Since then, many others have created their own Algathlon series.</p>

            <h2 className="text-2xl">What is COBEN?</h2>
            <p>Starting from Cary's <a className="text-sky-200 dark:text-sky-800" href="https://www.youtube.com/watch?v=kntUsQPASAE">Algicosathlon Day 2</a>, the points leaderboard featured a new statistic. </p>
            
            <img src={leaderboardImage} alt="The leaderboard at the end of Cary's Algicosathlon Day 2." />

            <p>The COBEN (<b>C</b>hance <b>O</b>f <b>B</b>eing <b>E</b>liminated <b>N</b>ext) is the chance of an athlete in an Algathlon (or similar competition) to be eliminated from the competition after the points are awarded for completing the next event.</p>

            <h2 className="text-2xl">How does calculating COBEN work?</h2>
            COBEN calculation is done with the Monte Carlo method. The calculator "simulates" an event happening by randomly adding the points to each athlete. A certain number of simulations are completed (the default here is 1 million). The COBEN for a single athlete is the number of simulations where they were eliminated divided by the total number of simulations, expressed as a percentage.

            <h2 className="text-2xl">Why make this? / Aren't there other calculators?</h2>
            <p>The original COBEN calculator was made by Cary Huang in <a className="text-sky-200 dark:text-sky-800" href="https://processing.org/">Processing</a>, though I am currently unable to find where the code is.</p>
            <p>In 2018, I modified Cary's original code to make it cleaner for use in my own Algathlon. I remember seeing someone want a COBEN calculator that supported multiple eliminations in an event, so in 2020 I made a <a className="text-sky-200 dark:text-sky-800" href="https://doc671.web.app/coben/old">web-based COBEN calculator</a>. This was extremely minimal and was largely made on a whim.</p>
            <p>In 2024, C Ezra M created a <a className="text-sky-200 dark:text-sky-800" href="https://c-ezra-m.github.io/coben-calc/">significantly better COBEN calculator</a>. He cited a number of issues with my calculator, including its extremely barebones look, how values were forced to 2 decimal places and how tedious it was to re-enter data.</p>
            <p>Admittedly, I was not aware that people were even using my calculator (or that C Ezra M's version existed) until 2026. When I found out, I felt bad about the state I had left my calculator in, and decided to put actual effort into making this new calculator. For those interested, <a className="text-sky-200 dark:text-sky-800" href="https://www.github.com/Doc671/MarbleBot">MarbleBot</a> is returning with a similar implementation of the COBEN algorithm for use within Discord. It should be noted that MarbleBot's COBEN command is limited to 2 million simulations, as it is possible for people to run multiple COBEN simulations on the bot concurrently.</p>
            <p>In addition to some of the improvements made by C Ezra M, I have included multithreading and uncertainty calculation.</p>

            <h2 className="text-2xl">Uncertainties</h2>

            <h3 className="text-xl">Why calculate uncertainties here?</h3>
            <p>Every time you calculate COBEN values with exactly the same inputs, they vary.</p>
            <p>My previous COBEN calculator gave values to two decimal places of the percentage, which I felt was sufficient. One of the improvements C Ezra M made was the ability to allow users to choose how many decimal places to give results to. My initial reaction was that two decimal places were still sufficient, as COBEN calculation only provides an estimate, not the true value. If, for example, the COBEN of an athlete varies by 0.2%, it does not make sense to give COBEN to more than 2 decimal places. Of course, this requires actual calculation to determine what the variation of COBEN results actually are.</p>
            <p>C Ezra M's calculator also features a "systematic" mode, which simulates every possible outcome and therefore can give the true value of COBEN, unlike the usual calculation method. The time taken to calculate this rises dramatically with the number of athletes, as he goes over in <a className="text-sky-200 dark:text-sky-800" href="https://c-ezra-m.github.io/coben-calc/faq">his calculator's FAQ</a>. Otherwise, there has not been a discovered method to obtain the true value of COBEN. Therefore, uncertainty calculation can provide a helpful indication of how much a COBEN result can differ from the true value, and what number of decimal places would be appropriate to round to.</p>

            <h3 className="text-xl">What is an uncertainty?</h3>
            <p>In many fields, it is impossible to calculate the true value of a certain statistic. Uncertainty is the measure of how much a result may vary from the true value.</p>
            <p>For example, in a Physics experiment to calculate the value of local gravitational field strength, somebody may arrive at the following result:</p>
            <BlockMath math="g = (9.79\pm0.05) \mathrm{ms}^{-2}" />
            <p>The 0.05 after the plus/minus sign is the uncertainty, or error bar. Another doing the experiment may arrive at another result:</p>
            <BlockMath math="g = (9.82\pm0.08) \mathrm{ms}^{-2}" />
            <p>The results of both experiment agree, as the ranges (intervals) given by their uncertainties overlap. The second result has a larger uncertainty, so the result is less precise for whatever reason (maybe they used less accurate equipment, or did not repeat their experiment as many times).</p>
            <p>It is convention for a result to be rounded to within one or two significant figures of the uncertainty.</p>
            <p>To use a more relevant example, Rose in Day 15 of the Gadget Car Triacontathlon may have this COBEN result:</p>
            <BlockMath math="p = (38.2315010\pm0.0957608) \%" />
            <p>The COBEN varies by about 0.096%. Any digits beyond 3 decimal places are meaningless. This is why the convention of rounding to 1 or 2 significant figures of the uncertainty is used:</p>
            <BlockMath math="p = (38.232\pm0.096) \%" />

            <h3 className="text-xl">Wald intervals</h3>
            <p>A simple (if you have some statistical knowledge) measure of uncertainty is the Wald interval. This is calculated using the standard error of the mean, which is the standard deviation <InlineMath math="\sigma" /> divided by the square root of the number of trials <InlineMath math="n" />. If you aren't aware of what a standard deviation is, it is a measure of how spread out the data are from the mean.</p>
            <BlockMath math="SE = \frac{\sigma}{\sqrt{n}}" />
            <p>In general, the more times you repeat an experiment, the more accurate your result becomes. The more simulations you use to calculate COBEN, the more accurate the COBEN value becomes. This is why the standard error decreases the higher <InlineMath math="n" /> is.</p>
            <p>Assuming your statistic is approximately normally distributed, the range given by the the mean <InlineMath math="\pm" /> the standard deviation covers roughly 68% of possible values. We call this a 68% confidence interval: there is a 68% chance the true value of the statistic is present in this interval.</p>
            <p>We can multiply the standard deviation by a z score to increase the possible values covered by the uncertainty.</p>
            <BlockMath math="z\sigma_x" />
            <p>A value of <InlineMath math="z = 1.96" /> corresponds to a 95% confidence interval, which is the default used in this COBEN calculator.</p>
            <p>So far in this subsection, I've been speaking in terms of the normal distribution, which only works for continuous values.</p>
            <p>Let Y be a (Bernoulli) random variable of whether or not an athlete gets eliminated.</p>
            <BlockMath math="
                Y = \begin{cases}
                    1 & \mathrm{eliminated} \\
                    0 & \mathrm{otherwise}
                    \end{cases}
            " />
            <p>Its standard deviation is given by:</p>
            <BlockMath math="\sigma_Y = \sqrt{p(1-p)}" />
            <p>The COBEN result (the observed probability of an athlete getting eliminated) <InlineMath math="\hat{p}" />, is the mean of <InlineMath math="n" /> of these variables.</p>
            <BlockMath math="\hat{p} = \frac{Y_1 + Y_2 + ... + Y_n}{n}" />
            <p>The standard error of the COBEN result is given by the standard error of the mean of <InlineMath math="Y" />.</p>
            <BlockMath math="SE_{\hat{p}} = \sqrt{\frac{\hat{p}(1-\hat{p})}{n}}" />
            <p>The Wald interval is the result <InlineMath math="\pm" /> the standard error multiplied by the z score.</p>
            <BlockMath math="\hat{p} \pm z\sqrt{\frac{\hat{p}(1-\hat{p})}{n}}" />
            <p>We can split this into lower and upper intervals.</p>
            <BlockMath math="L_W = \hat{p} - z\sqrt{\frac{\hat{p}(1-\hat{p})}{n}}" />
            <BlockMath math="U_W = \hat{p} + z\sqrt{\frac{\hat{p}(1-\hat{p})}{n}}" />
            
            <h3 className="text-xl">Limitations of Wald intervals</h3>
            <p>The Wald interval requires that the normal distribution can reasonably approximate the binomial distribution of the number of eliminations. If you don't know what a normal distribution looks like, they look like symmetric bell curves. There should be no skew in either direction.</p>
            <p>In Algathlons, it is fairly common for athletes to have COBEN values that are close to, if not zero. The COBEN distribution is not symmetrical when close to zero as it is impossible for COBEN values to be negative.</p>
            <p>Say we have an athlete that gets eliminated exactly 1 time. Let's explore what happens to the lower Wald interval if we use <InlineMath math="p = 0.000001" />, <InlineMath math="n = 1000000" /> simulations and a confidence interval of 95% (<InlineMath math="z = 1.96" />).</p>
            <BlockMath math="L_W = 0.000001 - 1.96\sqrt{\frac{0.000001(1-0.000001)}{1000000}}" />
            <BlockMath math="L_W = -9.6\cdot10^{-7}" />
            <p>This is a negative result, which does not make sense.</p>
            <p>If an athlete gets eliminated in 0 simulations (<InlineMath math="p = 0" />), both Wald intervals will return 0. This is not correct, as there may still be a small chance that the athlete can be eliminated.</p>

            <h3 className="text-xl">Wilson intervals</h3>
            <p>The Wilson intervals do remain stable for low values of <InlineMath math="p" />.</p>
            <BlockMath math="L_{Wi} = \frac{\hat{p} + \frac{z^2}{2n} - z\sqrt{\frac{\hat{p}(1 - \hat{p})}{n} + \frac{z^2}{4n^2}}}{1 + \frac{z^2}{n}}" />
            <BlockMath math="L_{Wi} = \frac{\hat{p} + \frac{z^2}{2n} + z\sqrt{\frac{\hat{p}(1 - \hat{p})}{n} + \frac{z^2}{4n^2}}}{1 + \frac{z^2}{n}}" />

            <p>This COBEN calculator provides the ability to round results to decimal places or significant figures of the result itself, or the Wilson interval.</p>
            <p>Of course, COBEN results are provided in Algathlon leaderboards for fun, so none of this is necessary to know and you can continue rounding however you wish.</p>
        </div>
    );
}
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function LineChartComponent({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  const maxValue = Math.max(...data.map((item) => item.value));
  const minValue = Math.min(...data.map((item) => item.value));

  // Custom tick logic: 4 ticks above and 4 below zero, always starting from 0
  // If all data is on one side of zero, center on average with 4 ticks above and 4 below
  const getCustomTicks = () => {
    const possibleIncrements = [
      1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 1500, 2000, 2500, 3000,
      4000, 5000, 10000,
    ];

    // Check if all data is above or below zero
    const allAboveZero = minValue >= 0;
    const allBelowZero = maxValue <= 0;

    let selectedIncrement = 1;
    console.log(`Data range: ${minValue} to ${maxValue}`);
    console.log(
      `All above zero: ${allAboveZero}, All below zero: ${allBelowZero}`
    );

    if (allAboveZero || allBelowZero) {
      // All data is on one side of zero - find best center point on increment boundary
      const average = (minValue + maxValue) / 2;
      console.log(`Average: ${average}`);

      // Find increment that can contain the data range
      const dataRange = maxValue - minValue;
      const requiredRange = dataRange * 1.2; // Add 20% padding

      let bestIncrement = 1;
      let bestCenter = 0;
      let bestScore = Infinity;

      for (const increment of possibleIncrements) {
        const tickRange = increment * 8; // 4 ticks above + 4 ticks below = 8 total

        console.log(
          `Testing increment ${increment}: tick range ${tickRange}, required range ${requiredRange}`
        );

        if (tickRange >= requiredRange) {
          // Find the nearest incrementable center point
          const centerCandidates = [];

          // Try centers at increment boundaries around the average
          for (let multiplier = -10; multiplier <= 10; multiplier++) {
            const candidateCenter = multiplier * increment;
            centerCandidates.push(candidateCenter);
          }

          // Find the center that's closest to average and can contain all data
          for (const candidateCenter of centerCandidates) {
            const minTick = candidateCenter - 4 * increment;
            const maxTick = candidateCenter + 4 * increment;

            // Check if this center can contain all data
            if (minValue >= minTick && maxValue <= maxTick) {
              const distanceFromAverage = Math.abs(candidateCenter - average);
              console.log(
                `  Candidate center ${candidateCenter}: distance ${distanceFromAverage}`
              );

              if (distanceFromAverage < bestScore) {
                bestScore = distanceFromAverage;
                bestIncrement = increment;
                bestCenter = candidateCenter;
              }
            }
          }

          // If we found a good center, use it
          if (bestScore < Infinity) {
            console.log(
              `Selected increment: ${bestIncrement}, center: ${bestCenter}`
            );
            break;
          }
        }
      }

      // Generate ticks: center-4*increment, center-3*increment, ..., center, ..., center+3*increment, center+4*increment
      const ticks = [];
      for (let i = -4; i <= 4; i++) {
        ticks.push(bestCenter + i * bestIncrement);
      }
      return ticks;
    } else {
      // Data spans both sides of zero - use 4 ticks above and 4 below zero
      for (const increment of possibleIncrements) {
        const maxTick = increment * 4; // 4 ticks above zero
        const minTick = -increment * 4; // 4 ticks below zero

        console.log(
          `Testing increment ${increment}: range ${minTick} to ${maxTick}`
        );
        console.log(
          `  maxValue (${maxValue}) <= maxTick (${maxTick}): ${
            maxValue <= maxTick
          }`
        );
        console.log(
          `  minValue (${minValue}) >= minTick (${minTick}): ${
            minValue >= minTick
          }`
        );

        if (maxValue <= maxTick && minValue >= minTick) {
          selectedIncrement = increment;
          console.log(`Selected increment: ${increment}`);
          break;
        }
      }

      // Generate ticks: -4*increment, -3*increment, ..., 0, ..., 3*increment, 4*increment
      const ticks = [];
      for (let i = -4; i <= 4; i++) {
        ticks.push(i * selectedIncrement);
      }
      return ticks;
    }
  };

  const customTicks = getCustomTicks();
  const domain = [Math.min(...customTicks), Math.max(...customTicks)];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis
          domain={domain}
          tickFormatter={(value) => Math.round(value).toString()}
          ticks={customTicks}
        />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default LineChartComponent;

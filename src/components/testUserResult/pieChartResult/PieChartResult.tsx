import { ResponsivePie } from "@nivo/pie";

const PieChartResult = ({ totalScore }: { totalScore: number }) => {
  const fillColor = totalScore >= 50 ? "#69cc5a" : "#f58d8f";

  const data = [
    { id: "Набрано", value: totalScore, color: fillColor },
    { id: "Осталось", value: 100 - totalScore, color: "lightgray" },
  ];

  return (
    <div style={{ height: "150px", width: "160px", position: "relative" }}>
      <ResponsivePie
        data={data}
        margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
        innerRadius={0.7}
        padAngle={3}
        cornerRadius={1}
        colors={{ datum: "data.color" }}
        borderWidth={2}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        arcLabelsSkipAngle={360}
        arcLinkLabelsSkipAngle={360}
        tooltip={() => null} // Убираем всплывающий текст
        layers={[
          "arcs",
          "arcLabels",
          "arcLinkLabels",
          "legends",
          (props) => {
            const { centerX, centerY } = props;
            return (
              <text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                  fontSize: 14,
                  fill: "#333",
                }}
              >
                {totalScore}%
              </text>
            );
          },
        ]}
      />
    </div>
  );
};

export default PieChartResult;

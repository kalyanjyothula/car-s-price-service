import ReactECharts from "echarts-for-react";

interface HorizontalBarChartProps {
  title: string;
  labels: string[];
  color?: string;
  data: any[];
}

const HorizontalBarChart = (props: HorizontalBarChartProps) => {
  const { title, labels, color, data } = props;
  const option = {
    title: {
      text: title,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
    },
    yAxis: {
      type: "category",
      data: labels,
    },
    series: [
      {
        name: "Count",
        type: "bar",
        data: data,
        // barWidth: 20,
        itemStyle: {
          color: color,
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 400 }} />;
};

export default HorizontalBarChart;

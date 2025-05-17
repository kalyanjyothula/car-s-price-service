import ReactECharts from "echarts-for-react";

interface BoxPlotChartProps {
  title: string;
  labels: string[];
  color?: string;
  data: any[];
}

const BoxPlotChart = (props: BoxPlotChartProps) => {
  const { title, labels, color, data } = props;
  const option = {
    title: {
      text: title,
    },
    tooltip: {
      trigger: "item",
      axisPointer: {
        type: "shadow",
      },
    },
    yAxis: {
      type: "category",
      data: labels,
    },
    xAxis: {
      scale: true,
      name: "Income",
      nameLocation: "middle",
      nameGap: 30,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    series: [
      {
        name: "Box Plot",
        type: "boxplot",
        data: data,
        itemStyle: {
          color: color,
        },
        tooltip: {
          formatter: function (param: any) {
            // console.log(param, "param");
            return [
              "Name: " + param.name,
              "Maximum: " + param.data[4],
              "Q3: " + param.data[3],
              "Median: " + param.data[2],
              "Q1: " + param.data[1],
              "Minimum: " + param.data[0],
            ].join("<br/>");
          },
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 400 }} />;
};

export default BoxPlotChart;

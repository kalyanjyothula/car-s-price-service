import * as XLSX from "xlsx";
import ReportTabs from "@/components/ui/reportTabs";
import RelationCmp from "./relationCmp";
import { useCallback, useEffect, useMemo, useState } from "react";
import BoxPlotChart from "@/components/ui/boxPlot";
import HorizontalBarChart from "@/components/ui/horizantalBar";
export default function Report() {
  const countSummary = {
    oem: [
      "Maruti, Hyundai, Honda, and Mahindra dominate the used car market with the highest number of listings.",
      "Luxury brands like BMW, Mercedes-Benz, and Audi also have significant representation.",
    ],
  };

  const boxSummary = {
    oem: [
      "Mahindra, Tata, Renault, and Nissan offered the widest range of price options and the largest spread in used car price ranges.",
      "Among luxury brands, Mitsubishi, Mercedes-Benz, and Audi exhibited the broadest range and highest variability in used car pricing.",
    ],
  };

  const avgSummary = {
    oem: [
      "Luxury brands (Jeep, Fait, Audi) command the highest average prices.",
      "Skoda, Ford tend to have lower average prices, aligning with their budget-oriented segment.",
    ],
  };

  const [mainData, setMainData] = useState<any>({});
  // console.log(mainData, "mainData");

  const separateByKeys = useCallback((arr: any) => {
    return arr.reduce((acc: any, item: any) => {
      Object.entries(item).forEach(([key, value]) => {
        if (!acc[key]) acc[key] = [];
        acc[key].push(value);
      });
      return acc;
    }, {});
  }, []);

  const countUniqueValues = useCallback((arr: any) => {
    const main = arr.reduce((acc: any, val: any) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

    const sortedEntries = Object.entries(main).sort(
      (a: any, b: any) => b[1] - a[1]
    );
    const sortedObject = Object.fromEntries(sortedEntries);
    return sortedObject;
  }, []);

  const computeDataLables = useCallback(
    (chartKey: string) => {
      const data = (chartKey && mainData[chartKey]) || [];
      const counts = countUniqueValues(data);
      const labels = Object.keys(counts).slice(0, 21);
      const values = Object.values(counts).slice(0, 21);
      return { labels, values, counts };
    },
    [mainData, countUniqueValues]
  );

  const getMedian = (nums: any) => {
    const mid = Math.floor(nums.length / 2);
    if (nums.length % 2 === 0) {
      return (nums[mid - 1] + nums[mid]) / 2;
    } else {
      return nums[mid];
    }
  };

  const getFiveNumberSummary = useCallback((arr: any) => {
    if (!arr.length) return null;

    const sorted = [...arr].sort((a, b) => a - b);
    const len = sorted.length;
    const min = sorted[0];
    const max = sorted[len - 1];
    const median = getMedian(sorted);
    const lowerHalf = sorted.slice(0, Math.floor(len / 2));
    const upperHalf = sorted.slice(Math.ceil(len / 2));
    const q1 = getMedian(lowerHalf);
    const q3 = getMedian(upperHalf);

    return [min, q1, median, q3, max];
  }, []);

  const generateBoxPlotData = useCallback((sellingPricesMap: any) => {
    const boxPlotData: any =
      Object.values(sellingPricesMap).map(getFiveNumberSummary);
    return boxPlotData;
  }, []);

  const filterByLabelAndSellingPrice = useCallback(
    (labelKey: string, labelValues: string[]) => {
      const labelColumn = mainData[labelKey];
      const priceColumn = mainData["selling_price"];

      const labelIndexesMap: Record<string, number[]> = labelColumn.reduce(
        (acc: any, val: any, idx: any) => {
          if (labelValues.includes(`${val}`)) {
            if (!acc[val]) {
              acc[val] = [];
            }
            acc[val].push(idx);
          }
          return acc;
        },
        {} as Record<string, number[]>
      );

      // Build selling prices grouped by label
      const sellingPricesMap: Record<string, number[]> = {};
      for (const [label, indexes] of Object.entries(labelIndexesMap)) {
        sellingPricesMap[label] = indexes.map((idx: any) => priceColumn[idx]);
      }

      return sellingPricesMap;
    },
    [mainData]
  );

  const getAvgPlotData = useCallback((sellingPricesMap: any) => {
    const avgData: any = Object.values(sellingPricesMap).map((arr: any) => {
      const sum = arr.reduce((acc: number, val: number) => acc + val, 0);
      const mean: number = Math.round(sum / arr.length);
      return mean;
    });
    return avgData;
  }, []);

  useEffect(() => {
    fetch(` ${import.meta.env.VITE_ML_DATA_FILE}`)
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });

        // Assume data is on the first sheet (Sheet1)
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convert the sheet to JSON format
        const jsonData: any = XLSX.utils.sheet_to_json(sheet);
        const filteredArr = jsonData && separateByKeys(jsonData);
        setMainData(filteredArr);
      });
  }, []);

  interface ChartProps {
    chartKey: string;
    summaryList?: string[];
    title: string;
  }

  const AvgChartComputation = (props: ChartProps) => {
    const { chartKey, summaryList, title } = props;
    const { labels } = computeDataLables(chartKey);
    const outputSellingPrice = useMemo(
      () => filterByLabelAndSellingPrice(chartKey, labels),
      [chartKey, labels]
    );
    const output = useMemo(
      () => getAvgPlotData(outputSellingPrice),
      [outputSellingPrice]
    );

    return (
      <div>
        <HorizontalBarChart data={output} labels={labels} title={title} />;
        {summaryList && summaryList.length && (
          <ul className="list-disc list-inside text-gray-700 space-y-2 bg-gray-100">
            {summaryList.map((itm, index) => (
              <li key={index} className="underline text-left">
                {itm}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const BoxChartComputation = (props: ChartProps) => {
    const { chartKey, summaryList, title } = props;
    const { labels } = computeDataLables(chartKey);
    const outputSellingPrice = useMemo(
      () => filterByLabelAndSellingPrice(chartKey, labels),
      [chartKey, labels]
    );
    const output = useMemo(
      () => generateBoxPlotData(outputSellingPrice),
      [outputSellingPrice]
    );
    // console.log(labels, outputSellingPrice, output, "Box");
    return (
      <div className="w-full h-full">
        <BoxPlotChart
          labels={labels}
          data={output}
          title={title}
          color="#82baa8"
        />
        {summaryList && summaryList.length && (
          <ul className="list-disc list-inside text-gray-700 space-y-2 bg-gray-100">
            {summaryList.map((itm, index) => (
              <li key={index} className="underline text-left">
                {itm}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const HorizChartsComputation = (props: ChartProps) => {
    const { chartKey, summaryList, title } = props;
    const { labels, values } = computeDataLables(chartKey);

    return (
      <div>
        <HorizontalBarChart data={values} labels={labels} title={title} />;
        {summaryList && summaryList.length && (
          <ul className="list-disc list-inside text-gray-700 space-y-2 bg-gray-100">
            {summaryList.map((itm, index) => (
              <li key={index} className="underline text-left">
                {itm}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-[100vh]">
      <ReportTabs
        defaultTab="FeatureSelection"
        tabs={[
          { value: "FeatureSelection", label: "Feature Selection" },
          { value: "FeatureAnalysis", label: "Feature Analysis" },
        ]}
        tabComponents={[
          { key: "FeatureSelection", componet: <RelationCmp /> },
          {
            key: "FeatureAnalysis",
            componet: (
              <div className="grid lg:grid-cols-2 gap-4 grid-cols-1 p-4">
                <HorizChartsComputation
                  chartKey={"oem"}
                  summaryList={countSummary?.oem}
                  title="Car Brand Analysis"
                />
                <BoxChartComputation
                  title="Car Brand Analysis"
                  chartKey="oem"
                  summaryList={boxSummary?.oem}
                />
                <AvgChartComputation
                  title="Car Brand Analysis"
                  chartKey="oem"
                  summaryList={avgSummary?.oem}
                />
                {/* Year */}
                <HorizChartsComputation
                  chartKey={"myear"}
                  // summaryList={countSummary?.oem}
                  title="Car Year of Purchase Analysis"
                />
                <BoxChartComputation
                  title="Car Year of Purchase Analysis"
                  chartKey="myear"
                  // summaryList={boxSummary?.oem}
                />
                <AvgChartComputation
                  title="Car Year of Purchase Analysis"
                  chartKey="myear"
                  // summaryList={avgSummary?.oem}
                />
                {/* Model */}
                <HorizChartsComputation
                  chartKey={"model"}
                  // summaryList={countSummary?.oem}
                  title="Car Model Analysis"
                />
                <BoxChartComputation
                  title="Car Model Analysis"
                  chartKey="model"
                  // summaryList={boxSummary?.oem}
                />
                <AvgChartComputation
                  title="Car Model Analysis"
                  chartKey="model"
                  // summaryList={avgSummary?.oem}
                />
                {/* Gear Box */}
                <HorizChartsComputation
                  chartKey={"gear_box"}
                  // summaryList={countSummary?.oem}
                  title="Car Gear Box Analysis"
                />
                <BoxChartComputation
                  title="Car Gear Box Analysis"
                  chartKey="gear_box"
                  // summaryList={boxSummary?.oem}
                />
                <AvgChartComputation
                  title="Car Gear Box Analysis"
                  chartKey="gear_box"
                  // summaryList={avgSummary?.oem}
                />

                {/* Seats */}
                <HorizChartsComputation
                  chartKey={"seats"}
                  // summaryList={countSummary?.oem}
                  title="Car Seats Analysis"
                />
                <BoxChartComputation
                  title="Car Seats Analysis"
                  chartKey="seats"
                  // summaryList={boxSummary?.oem}
                />
                <AvgChartComputation
                  title="Car Seats Analysis"
                  chartKey="seats"
                  // summaryList={avgSummary?.oem}
                />

                {/* Steering type */}
                <HorizChartsComputation
                  chartKey={"steering_type"}
                  // summaryList={countSummary?.oem}
                  title="Car Steering Type Analysis"
                />
                <BoxChartComputation
                  title="Car Steering Type Analysis"
                  chartKey="steering_type"
                  // summaryList={boxSummary?.oem}
                />
                <AvgChartComputation
                  title="Car Steering Type Analysis"
                  chartKey="steering_type"
                  // summaryList={avgSummary?.oem}
                />
                {/* No Of Cylinder */}
                <HorizChartsComputation
                  chartKey={"no_of_cylinder"}
                  // summaryList={countSummary?.oem}
                  title="Car No Of Cylinder Analysis"
                />
                <BoxChartComputation
                  title="Car No Of Cylinder Analysis"
                  chartKey="no_of_cylinder"
                  // summaryList={boxSummary?.oem}
                />
                <AvgChartComputation
                  title="Car No Of Cylinder Analysis"
                  chartKey="no_of_cylinder"
                  // summaryList={avgSummary?.oem}
                />
                {/* Super Charger */}
                <HorizChartsComputation
                  chartKey={"super_charger"}
                  // summaryList={countSummary?.oem}
                  title="Car Super Charger Analysis"
                />
                <BoxChartComputation
                  title="Car Super Charger Analysis"
                  chartKey="super_charger"
                  // summaryList={boxSummary?.oem}
                />
                <AvgChartComputation
                  title="Car Super Charger Analysis"
                  chartKey="super_charger"
                  // summaryList={avgSummary?.oem}
                />
                {/* Top Speed */}
                <HorizChartsComputation
                  chartKey={"top_speed"}
                  // summaryList={countSummary?.oem}
                  title="Car Top Speed Analysis"
                />
                <BoxChartComputation
                  title="Car Top Speed Analysis"
                  chartKey="top_speed"
                  // summaryList={boxSummary?.oem}
                />
                <AvgChartComputation
                  title="Car Top Speed Analysis"
                  chartKey="top_speed"
                  // summaryList={avgSummary?.oem}
                />
                {/* Max Power Delivered */}
                <HorizChartsComputation
                  chartKey={"max_power_delivered"}
                  // summaryList={countSummary?.oem}
                  title="Car Max Power Delivered Analysis"
                />
                <BoxChartComputation
                  title="Car Max Power Delivered Analysis"
                  chartKey="max_power_delivered"
                  // summaryList={boxSummary?.oem}
                />
                <AvgChartComputation
                  title="Car Max Power Delivered Analysis"
                  chartKey="max_power_delivered"
                  // summaryList={avgSummary?.oem}
                />
                {/* Max Torque Delivered */}
                <HorizChartsComputation
                  chartKey={"max_torque_delivered"}
                  // summaryList={countSummary?.oem}
                  title="Car Max Torque Delivered Analysis"
                />
                <BoxChartComputation
                  title="Car Max Torque Delivered Analysis"
                  chartKey="max_torque_delivered"
                  // summaryList={boxSummary?.oem}
                />
                <AvgChartComputation
                  title="Car Max Torque Delivered Analysis"
                  chartKey="max_torque_delivered"
                  // summaryList={avgSummary?.oem}
                />
                {/* Feature Score */}
                <HorizChartsComputation
                  chartKey={"feature_score"}
                  // summaryList={countSummary?.oem}
                  title="Car Feature Score Analysis"
                />
                <BoxChartComputation
                  title="Car Feature Score Analysis"
                  chartKey="feature_score"
                  // summaryList={boxSummary?.oem}
                />
                <AvgChartComputation
                  title="Car Feature Score Analysis"
                  chartKey="feature_score"
                  // summaryList={avgSummary?.oem}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

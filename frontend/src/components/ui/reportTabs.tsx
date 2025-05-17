import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

interface ReportTabs {
  tabs: { value: string; label: string }[];
  tabComponents: {
    key: string;
    componet: ReactNode;
  }[];
  defaultTab: string;
}

export default function ReportTabs(props: ReportTabs) {
  const { tabs, tabComponents, defaultTab } = props;
  return (
    <Tabs
      defaultValue={defaultTab || tabs?.[0]?.value}
      className="w-full justify-center py-4"
    >
      <TabsList className="flex gap-4 items-center flex-row justify-center w-[80%] flex-wrap h-auto min-h-9 self-center">
        {tabs &&
          tabs.length &&
          tabs.map(({ value, label }) => (
            <TabsTrigger
              className="cursor-pointer py-2 px-4 border border-gray-200"
              value={value}
            >
              {label}
            </TabsTrigger>
          ))}
      </TabsList>

      {tabComponents &&
        tabComponents.length &&
        tabComponents.map(({ key, componet }) => (
          <TabsContent value={key}>{componet}</TabsContent>
        ))}
    </Tabs>
  );
}

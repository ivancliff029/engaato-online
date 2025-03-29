import React, { useState } from "react";

interface TabItem {
  id: number;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  color?: string;
  tabs: TabItem[];
}

const Tabs: React.FC<TabsProps> = ({ color = "indigo", tabs }) => {
  const [activeTab, setActiveTab] = useState<number>(tabs[0]?.id || 1);

  const baseClasses = "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal";
  const activeClasses = `text-white bg-${color}-600`;
  const inactiveClasses = `text-${color}-600 bg-white`;

  return (
    <div className="w-full">
      <ul className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row gap-2" role="tablist">
        {tabs.map((tab) => (
          <li key={tab.id} className="flex-auto text-center">
            <button
              className={`${baseClasses} ${
                activeTab === tab.id ? activeClasses : inactiveClasses
              } transition-colors duration-200`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(tab.id);
              }}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="px-4 py-5 flex-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              id={`tabpanel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
              className={activeTab === tab.id ? "block" : "hidden"}
            >
              {tab.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TabsRender: React.FC = () => {
  const tabs: TabItem[] = [
    {
      id: 1,
      label: "Ongoing/Delivered",
      content: <p>No products purchased yet</p>,
    },
    {
      id: 2,
      label: "Viewed Products",
      content: <p>No products viewed yet</p>,
    },
  ];

  return <Tabs color="indigo" tabs={tabs} />;
};

export default TabsRender;
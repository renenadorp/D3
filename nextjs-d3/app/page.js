"use client";

import { useState } from "react";


import Intro from "./charts/intro";
import Philosophy from "./charts/philosophy";

import { PhilosophyContextProvider } from "./context_philosophy";

import { useRouter } from "next/navigation";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const tabs = [
  { name: "Introduction", id: "intro" },
  { name: "Timeline", id: "philosophy" },
];

function Navigation({ selectedTab = "intro", setselectedTab }) {
  return (
    <div>
      <div>
        <nav
          className="isolate divide-gray-200 grid grid-cols-1 md:grid-cols-2"
          aria-label="Tabs"
        >
          {tabs.map((tab, tabIdx) => (
            <button
              onClick={() => setselectedTab(tab.id)}
              key={tab.id}
              className={classNames(
                tab.id == selectedTab
                  ? "text-gray-900 border-gray-400 bg-gray-50"
                  : "text-gray-500 hover:text-gray-700 border-gray-100",
                "m-2 border-2 rounded-lg group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10"
              )}
              aria-current={tab.current ? "page" : undefined}
            >
              <span>{tab.name}</span>
              <span
                aria-hidden="true"
                className={classNames(
                  tab.current ? "bg-indigo-500" : "bg-transparent",
                  "absolute inset-x-0 bottom-0 h-0.5"
                )}
              />
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function SelectedGraph({ selectedTab = "philosophy", router }) {
  // get router

  if (selectedTab === "philosophy") {
    return <Philosophy />;
  }

}

export default function Home() {
  const router = useRouter();

  const [selectedTab, setselectedTab] = useState("philosophy");
  return (

    
    <PhilosophyContextProvider>
      <div className="w-full md:w-4/5 m-auto space-y-2 py-16 sm:py-24 min-h-screen">
        <div className="flex justify-center text-base font-semibold leading-6 text-gray-900">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Dashboard
          </h1>
        </div>

        <Navigation selectedTab={selectedTab} setselectedTab={setselectedTab} />
        <div className="w-full border-2 p-5 rounded-lg">
          <SelectedGraph selectedTab={selectedTab} router={router} />
        </div>
      </div>
    </PhilosophyContextProvider>
  );
}

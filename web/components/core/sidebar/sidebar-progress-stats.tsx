import React from "react";

import Image from "next/image";
// headless ui
import { Tab } from "@headlessui/react";
// hooks
import useLocalStorage from "hooks/use-local-storage";
import useIssuesView from "hooks/use-issues-view";
// images
import emptyLabel from "public/empty-state/empty_label.svg";
import emptyMembers from "public/empty-state/empty_members.svg";
// components
import { StateGroupIcon } from "@plane/ui";
import { SingleProgressStats } from "components/core";
// ui
import { Avatar } from "components/ui";
// types
import {
  IModule,
  TAssigneesDistribution,
  TCompletionChartDistribution,
  TLabelsDistribution,
  TStateGroups,
} from "types";

type Props = {
  distribution: {
    assignees: TAssigneesDistribution[];
    completion_chart: TCompletionChartDistribution;
    labels: TLabelsDistribution[];
  };
  groupedIssues: {
    [key: string]: number;
  };
  totalIssues: number;
  module?: IModule;
  roundedTab?: boolean;
  noBackground?: boolean;
  isPeekModuleDetails?: boolean;
};

export const SidebarProgressStats: React.FC<Props> = ({
  distribution,
  groupedIssues,
  totalIssues,
  module,
  roundedTab,
  noBackground,
  isPeekModuleDetails = false,
}) => {
  const { filters, setFilters } = useIssuesView();

  const { storedValue: tab, setValue: setTab } = useLocalStorage("tab", "Assignees");

  const currentValue = (tab: string | null) => {
    switch (tab) {
      case "Assignees":
        return 0;
      case "Labels":
        return 1;
      case "States":
        return 2;
      default:
        return 0;
    }
  };

  return (
    <Tab.Group
      defaultIndex={currentValue(tab)}
      onChange={(i) => {
        switch (i) {
          case 0:
            return setTab("Assignees");
          case 1:
            return setTab("Labels");
          case 2:
            return setTab("States");
          default:
            return setTab("Assignees");
        }
      }}
    >
      <Tab.List
        as="div"
        className={`flex w-full items-center gap-2 justify-between rounded-md ${
          noBackground ? "" : "bg-custom-background-90"
        } p-0.5
        ${module ? "text-xs" : "text-sm"}`}
      >
        <Tab
          className={({ selected }) =>
            `w-full  ${
              roundedTab ? "rounded-3xl border border-custom-border-200" : "rounded"
            } px-3 py-1 text-custom-text-100 ${
              selected
                ? "bg-custom-background-100 text-custom-text-300 shadow-custom-shadow-2xs"
                : "text-custom-text-400 hover:text-custom-text-300"
            }`
          }
        >
          Assignees
        </Tab>
        <Tab
          className={({ selected }) =>
            `w-full ${
              roundedTab ? "rounded-3xl border border-custom-border-200" : "rounded"
            } px-3 py-1 text-custom-text-100 ${
              selected
                ? "bg-custom-background-100 text-custom-text-300 shadow-custom-shadow-2xs"
                : "text-custom-text-400 hover:text-custom-text-300"
            }`
          }
        >
          Labels
        </Tab>
        <Tab
          className={({ selected }) =>
            `w-full ${
              roundedTab ? "rounded-3xl border border-custom-border-200" : "rounded"
            } px-3 py-1  text-custom-text-100 ${
              selected
                ? "bg-custom-background-100 text-custom-text-300 shadow-custom-shadow-2xs"
                : "text-custom-text-400 hover:text-custom-text-300"
            }`
          }
        >
          States
        </Tab>
      </Tab.List>
      <Tab.Panels className="flex w-full items-center justify-between text-custom-text-200">
        <Tab.Panel as="div" className="flex flex-col gap-1.5 pt-3.5 w-full h-44 overflow-y-auto">
          {distribution.assignees.length > 0 ? (
            distribution.assignees.map((assignee, index) => {
              if (assignee.assignee_id)
                return (
                  <SingleProgressStats
                    key={assignee.assignee_id}
                    title={
                      <div className="flex items-center gap-2">
                        <Avatar
                          user={{
                            id: assignee.assignee_id,
                            avatar: assignee.avatar ?? "",
                            first_name: assignee.first_name ?? "",
                            last_name: assignee.last_name ?? "",
                            display_name: assignee.display_name ?? "",
                          }}
                          height="18px"
                          width="18px"
                        />
                        <span>{assignee.display_name}</span>
                      </div>
                    }
                    completed={assignee.completed_issues}
                    total={assignee.total_issues}
                    {...(!isPeekModuleDetails && {
                      onClick: () => {
                        if (filters?.assignees?.includes(assignee.assignee_id ?? ""))
                          setFilters({
                            assignees: filters?.assignees?.filter((a) => a !== assignee.assignee_id),
                          });
                        else
                          setFilters({
                            assignees: [...(filters?.assignees ?? []), assignee.assignee_id ?? ""],
                          });
                      },
                      selected: filters?.assignees?.includes(assignee.assignee_id ?? ""),
                    })}
                  />
                );
              else
                return (
                  <SingleProgressStats
                    key={`unassigned-${index}`}
                    title={
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full border-2 border-custom-border-200 bg-custom-background-80">
                          <img src="/user.png" height="100%" width="100%" className="rounded-full" alt="User" />
                        </div>
                        <span>No assignee</span>
                      </div>
                    }
                    completed={assignee.completed_issues}
                    total={assignee.total_issues}
                  />
                );
            })
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 h-full">
              <div className="flex items-center justify-center h-20 w-20 bg-custom-background-80 rounded-full">
                <Image src={emptyMembers} className="h-12 w-12" alt="empty members" />
              </div>
              <h6 className="text-base text-custom-text-300">No assignees yet</h6>
            </div>
          )}
        </Tab.Panel>
        <Tab.Panel as="div" className="flex flex-col gap-1.5 pt-3.5 w-full h-44 overflow-y-auto">
          {distribution.labels.length > 0 ? (
            distribution.labels.map((label, index) => (
              <SingleProgressStats
                key={label.label_id ?? `no-label-${index}`}
                title={
                  <div className="flex items-center gap-2">
                    <span
                      className="block h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: label.color ?? "transparent",
                      }}
                    />
                    <span className="text-xs">{label.label_name ?? "No labels"}</span>
                  </div>
                }
                completed={label.completed_issues}
                total={label.total_issues}
                {...(!isPeekModuleDetails && {
                  onClick: () => {
                    if (filters.labels?.includes(label.label_id ?? ""))
                      setFilters({
                        labels: filters?.labels?.filter((l) => l !== label.label_id),
                      });
                    else setFilters({ labels: [...(filters?.labels ?? []), label.label_id ?? ""] });
                  },
                  selected: filters?.labels?.includes(label.label_id ?? ""),
                })}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 h-full">
              <div className="flex items-center justify-center h-20 w-20 bg-custom-background-80 rounded-full">
                <Image src={emptyLabel} className="h-12 w-12" alt="empty label" />
              </div>
              <h6 className="text-base text-custom-text-300">No labels yet</h6>
            </div>
          )}
        </Tab.Panel>
        <Tab.Panel as="div" className="flex flex-col gap-1.5 pt-3.5 w-full h-44 overflow-y-auto">
          {Object.keys(groupedIssues).map((group, index) => (
            <SingleProgressStats
              key={index}
              title={
                <div className="flex items-center gap-2">
                  <StateGroupIcon stateGroup={group as TStateGroups} />
                  <span className="text-xs capitalize">{group}</span>
                </div>
              }
              completed={groupedIssues[group]}
              total={totalIssues}
            />
          ))}
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

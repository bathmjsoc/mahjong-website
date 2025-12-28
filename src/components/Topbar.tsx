"use client";

import { TabLink, TabMenu } from "@/elements/TabMenu";

const TABS = [
  { label: "Tables", href: "" },
  { label: "Logs", href: "logs" },
  { label: "Graphs", href: "graphs" },
];

type TopbarProps = {
  uuid: string;
};

export default function Topbar({ uuid }: TopbarProps) {
  return (
    <nav className="bg-(--accent-color) flex items-center w-full h-15 pl-5 z-50">
      <TabMenu>
        {TABS.map(({ label, href }) => (
          <TabLink
            key={label}
            href={`/tournament/${uuid}${href ? `/${href}` : ""}`}
            className="w-30"
          >
            {label}
          </TabLink>
        ))}
      </TabMenu>
    </nav>
  );
}

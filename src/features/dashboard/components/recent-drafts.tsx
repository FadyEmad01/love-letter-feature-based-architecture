"use client";

import { DraftItem } from "@/features/dashboard/components/draft-item";

const recentDrafts = [
  { id: "draft-1", title: "To my beloved", editedAt: "Edited 2 hours ago" },
  { id: "draft-2", title: "To my beloved", editedAt: "Edited 2 hours ago" },
];

export function RecentDrafts() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-advercase text-xl">Recent Drafts</h3>
        <button
          type="button"
          className="text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          View All
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {recentDrafts.map((draft) => (
          <DraftItem
            key={draft.id}
            title={draft.title}
            editedAt={draft.editedAt}
          />
        ))}
      </div>
    </section>
  );
}

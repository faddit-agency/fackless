"use client";

import { useMemo, useState } from "react";
import { ResourceCard } from "@/components/cards/resource-card";
import { LiveSearchInput } from "@/components/live-search-input";
import type { Resource } from "@/lib/database.types";

interface ResourceSearchListProps {
  resources: Resource[];
  placeholder: string;
  emptyMessage: string;
  className?: string;
  listClassName?: string;
}

function resourceHaystack(resource: Resource) {
  return `${resource.title} ${resource.description ?? ""} ${resource.resource_type}`;
}

export function ResourceSearchList({
  resources,
  placeholder,
  emptyMessage,
  className,
  listClassName = "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
}: ResourceSearchListProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const filteredResources = useMemo(() => {
    if (!normalizedQuery) return resources;
    return resources.filter((resource) =>
      resourceHaystack(resource).toLowerCase().includes(normalizedQuery),
    );
  }, [resources, normalizedQuery]);

  return (
    <>
      <LiveSearchInput
        mode="local"
        onQueryChange={setQuery}
        placeholder={placeholder}
        className={className}
      />
      <div className={listClassName}>
        {filteredResources.length === 0 ? (
          <p className="col-span-full text-sm text-muted-foreground py-10 text-center">
            {normalizedQuery ? "검색 결과가 없습니다." : emptyMessage}
          </p>
        ) : (
          filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))
        )}
      </div>
    </>
  );
}

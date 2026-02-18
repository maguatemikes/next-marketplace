import { DirectoryCard, DirectoryItem } from "./DirectoryCard";

type ViewMode = "grid" | "map";

interface DirectoryLayoutProps {
  data: DirectoryItem[];
  viewMode: ViewMode;
}

export function DirectoryLayout({ data, viewMode }: DirectoryLayoutProps) {
  // Determine grid columns based on view mode
  const gridClass =
    viewMode === "grid"
      ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2";

  return (
    <div className={`grid ${gridClass} gap-6`}>
      {data.map((item) => (
        <DirectoryCard key={item.ID} item={item} />
      ))}
    </div>
  );
}

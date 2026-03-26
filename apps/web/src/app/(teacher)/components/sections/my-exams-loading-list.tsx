const skeletonRows = Array.from({ length: 4 }, (_, index) => index);

export function MyExamsLoadingList() {
  return skeletonRows.map((row) => (
    <div
      key={row}
      className="animate-pulse rounded-xl border border-[#DFE1E5] bg-white p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="h-5 w-1/3 rounded bg-[#E9EDF3]" />
          <div className="h-4 w-2/3 rounded bg-[#E9EDF3]" />
        </div>
        <div className="h-8 w-28 rounded bg-[#E9EDF3]" />
      </div>
      <div className="mt-4 h-16 rounded bg-[#E9EDF3]" />
    </div>
  ));
}

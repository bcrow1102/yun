interface JobData {
  id: number;
  temple: string;
  title: string;
  location: string;
  date: string;
  tag: string;
}

interface JobCardProps {
  job?: JobData;
  delay?: number;

  id?: number;
  temple?: string;
  title?: string;
  location?: string;
  date?: string;
  tag?: string;
}

export default function JobCard({
  job,
  delay = 0,
  id,
  temple,
  title,
  location,
  date,
  tag,
}: JobCardProps) {
  const currentJob: JobData = job ?? {
    id: id ?? 0,
    temple: temple ?? "",
    title: title ?? "",
    location: location ?? "",
    date: date ?? "",
    tag: tag ?? "",
  };

  const tagColors: Record<string, string> = {
    정규직: "bg-[#FFF9C4] text-[#6D6200]",
    계약직: "bg-[#F2F4F6] text-[#4E5968]",
    봉사: "bg-[#EAF3FF] text-[#3182F6]",
  };

  const defaultTagColor = "bg-[#F2F4F6] text-[#4E5968]";

  return (
    <article
      className="card-hover animate-fade-in-up cursor-pointer rounded-[22px] border border-[#E3E8EF] bg-[#F4F7FA] p-5 shadow-[0_2px_10px_rgba(25,31,40,0.03)] transition active:scale-[0.99]"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs font-medium text-[#667085]">
              {currentJob.temple}
            </span>

            {currentJob.tag && (
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${tagColors[currentJob.tag] ?? defaultTagColor
                  }`}
              >
                {currentJob.tag}
              </span>
            )}
          </div>

          <h3 className="truncate text-[17px] font-semibold tracking-[-0.015em] text-[#252A31]">
            {currentJob.title}
          </h3>

          <div className="mt-2 flex items-center gap-2 text-sm text-[#667085]">
            <span className="flex items-center gap-1">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z"
                />

                <circle cx="12" cy="10" r="2.2" />
              </svg>

              {currentJob.location}
            </span>

            <span>·</span>
            <span>{currentJob.date}</span>
          </div>
        </div>

        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-white text-[#536273]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9 5 7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </article>
  );
}
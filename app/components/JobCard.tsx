interface JobCardProps {
  job: {
    id: number;
    temple: string;
    title: string;
    location: string;
    date: string;
    tag: string;
  };
  delay: number;
}

export default function JobCard({ job, delay }: JobCardProps) {
  const tagColors: Record<string, string> = {
    정규직: "bg-sage-200 text-sage-800",
    계약직: "bg-warm-200 text-warm-800",
    봉사: "bg-sage-100 text-sage-700",
  };

  return (
    <article
      className="card-hover rounded-2xl border border-warm-100 bg-white p-4 animate-fade-in-up cursor-pointer active:scale-[0.98] transition-transform"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-warm-500">{job.temple}</span>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                tagColors[job.tag] || "bg-warm-100 text-warm-700"
              }`}
            >
              {job.tag}
            </span>
          </div>
          <h3 className="text-base font-semibold text-sage-900 truncate">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5 text-sm text-warm-500">
            <span className="flex items-center gap-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              {job.location}
            </span>
            <span>·</span>
            <span>{job.date}</span>
          </div>
        </div>
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sage-50 text-sage-600 shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </div>
    </article>
  );
}

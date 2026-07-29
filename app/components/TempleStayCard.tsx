interface TempleStayCardProps {
  stay: {
    id: number;
    name: string;
    location: string;
    duration: string;
    price: string;
    rating: number;
    image: string;
  };
  delay: number;
}

export default function TempleStayCard({
  stay,
  delay,
}: TempleStayCardProps) {
  return (
    <article
      className="card-hover min-w-0 w-full cursor-pointer overflow-hidden rounded-[22px] border border-[#F2F4F6] bg-white shadow-[0_5px_18px_rgba(25,31,40,0.04)] transition active:scale-[0.98] animate-fade-in-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex h-[128px] items-center justify-center bg-[#FFFBE0]">
        <span className="text-[52px]" aria-hidden="true">
          {stay.image}
        </span>
      </div>

      <div className="p-4">
        <h3 className="truncate text-[15px] font-bold tracking-[-0.025em] text-[#191F28]">
          {stay.name}
        </h3>

        <p className="mt-1 text-xs text-[#8B95A1]">
          {stay.location}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="rounded-full bg-[#FFF9C4] px-2.5 py-1 text-[11px] font-semibold text-[#6D6200]">
            {stay.duration}
          </span>

          <span className="text-xs font-medium text-[#8B95A1]">
            ★ {stay.rating}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[#F2F4F6] pt-3">
          <strong className="text-sm font-bold text-[#191F28]">
            {stay.price}
          </strong>

          <span className="text-xs font-semibold text-[#6D6200]">
            보기 →
          </span>
        </div>
      </div>
    </article>
  );
}
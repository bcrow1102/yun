interface TempleStayData {
  id: number;
  name: string;
  location: string;
  duration: string;
  price: string;
  rating: number;
  image: string;
}

interface TempleStayCardProps {
  stay?: TempleStayData;
  delay?: number;

  id?: number;
  name?: string;
  location?: string;
  duration?: string;
  price?: string;
  rating?: number;
  image?: string;
}

export default function TempleStayCard({
  stay,
  delay = 0,
  id,
  name,
  location,
  duration,
  price,
  rating,
  image,
}: TempleStayCardProps) {
  const currentStay: TempleStayData = stay ?? {
    id: id ?? 0,
    name: name ?? "",
    location: location ?? "",
    duration: duration ?? "",
    price: price ?? "",
    rating: rating ?? 0,
    image: image ?? "",
  };

  return (
    <article
      className="card-hover animate-fade-in-up min-w-0 w-full cursor-pointer overflow-hidden rounded-[22px] border border-[#E7E9EC] bg-white shadow-[0_2px_10px_rgba(25,31,40,0.03)] transition active:scale-[0.98]"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex h-[128px] items-center justify-center bg-[#FFFBE0]">
        <span className="text-[52px]" aria-hidden="true">
          {currentStay.image}
        </span>
      </div>

      <div className="p-4">
        <h3 className="truncate text-[15px] font-semibold tracking-[-0.015em] text-[#252A31]">
          {currentStay.name}
        </h3>

        <p className="mt-1 text-xs text-[#667085]">
          {currentStay.location}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="rounded-full bg-[#FFF9C4] px-2.5 py-1 text-[11px] font-semibold text-[#6D6200]">
            {currentStay.duration}
          </span>

          <span className="text-xs font-medium text-[#667085]">
            ★ {currentStay.rating}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[#E7E9EC] pt-3">
          <strong className="text-sm font-semibold text-[#252A31]">
            {currentStay.price}
          </strong>

          <span className="text-xs font-semibold text-[#6D6200]">
            보기 →
          </span>
        </div>
      </div>
    </article>
  );
}
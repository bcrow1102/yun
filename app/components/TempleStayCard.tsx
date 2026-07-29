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

export default function TempleStayCard({ stay, delay }: TempleStayCardProps) {
  return (
    <article
      className="card-hover snap-start shrink-0 w-[200px] rounded-2xl border border-warm-100 bg-white overflow-hidden animate-fade-in-up cursor-pointer active:scale-[0.97] transition-transform"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* 이미지 영역 */}
      <div className="flex items-center justify-center h-28 bg-gradient-to-br from-sage-50 to-warm-50">
        <span className="text-5xl">{stay.image}</span>
      </div>

      {/* 정보 영역 */}
      <div className="p-3.5">
        <h3 className="text-sm font-bold text-sage-900 truncate">{stay.name}</h3>
        <p className="text-xs text-warm-500 mt-0.5">{stay.location}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-sage-600 bg-sage-50 px-2 py-0.5 rounded-full">
            {stay.duration}
          </span>
          <span className="flex items-center gap-0.5 text-xs text-warm-600">
            ⭐ {stay.rating}
          </span>
        </div>
        <p className="mt-2 text-sm font-bold text-sage-800">{stay.price}</p>
      </div>
    </article>
  );
}

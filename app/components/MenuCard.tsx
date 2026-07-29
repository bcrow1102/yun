interface MenuCardProps {
  item: {
    id: string;
    title: string;
    emoji: string;
    desc: string;
    color: string;
  };
  delay: number;
}

export default function MenuCard({ item, delay }: MenuCardProps) {
  return (
    <button
      id={`menu-${item.id}`}
      className={`card-hover flex flex-col items-center justify-center gap-1.5 rounded-2xl ${item.color} p-4 min-h-[100px] animate-fade-in-up border border-warm-100/60 cursor-pointer active:scale-95 transition-transform`}
      style={{ animationDelay: `${delay}s` }}
    >
      <span className="text-3xl" aria-hidden>
        {item.emoji}
      </span>
      <span className="text-base font-semibold text-sage-900">{item.title}</span>
      <span className="text-xs text-warm-600">{item.desc}</span>
    </button>
  );
}

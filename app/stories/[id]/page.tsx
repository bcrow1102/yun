import Link from "next/link";
import { notFound } from "next/navigation";

type Scene = {
    number: string;
    title: string;
    image: string;
    paragraphs: string[];
};

type Story = {
    id: string;
    episode: string;
    category: string;
    readingTime: string;
    title: string;
    intro: string;
    scenes: Scene[];
    quote: string;
    meaning: string;
    source: string;
};

const stories: Record<string, Story> = {
    "1": {
        id: "1",
        episode: "첫 번째 이야기",
        category: "분노와 마음",
        readingTime: "3분",
        title: "화를 내는 사람에게 돌려준 선물",
        intro:
            "누군가 건넨 분노를 우리는 반드시 받아야 할까요? 거친 말을 쏟아낸 사람에게 부처님이 들려준 짧은 이야기입니다.",
        scenes: [
            {
                number: "장면 1",
                title: "분노한 방문자",
                image: "/images/stories/story-01-scene-1.webp",
                paragraphs: [
                    "어느 날 부처님이 라자가하의 죽림정사에 머물고 있을 때였습니다. 한 바라문이 몹시 화가 난 얼굴로 부처님을 찾아왔습니다.",
                    "그는 가까운 사람이 부처님의 가르침을 따라 출가했다는 소식을 듣고 마음이 상해 있었습니다. 부처님 앞에 선 그는 거칠고 모진 말을 쉬지 않고 쏟아냈습니다.",
                    "그러나 부처님은 그의 말을 막지도, 같은 말로 되돌려주지도 않았습니다. 그저 조용히 바라문이 말을 마칠 때까지 기다렸습니다.",
                ],
            },
            {
                number: "장면 2",
                title: "받지 않은 음식",
                image: "/images/stories/story-01-scene-2.webp",
                paragraphs: [
                    "바라문의 말이 끝나자 부처님은 차분하게 물었습니다. “그대의 집에도 친척이나 벗이 손님으로 찾아오는가?”",
                    "바라문이 그렇다고 대답하자 부처님은 다시 물었습니다. “그러면 그들에게 음식과 다과를 내어주는가? 만약 손님이 그것을 받지 않는다면 그 음식은 누구에게 남는가?”",
                    "바라문은 잠시 생각한 뒤 대답했습니다. “손님이 받지 않는다면 당연히 내게 남습니다.”",
                ],
            },
            {
                number: "장면 3",
                title: "분노를 돌려받은 사람",
                image: "/images/stories/story-01-scene-3.webp",
                paragraphs: [
                    "부처님은 말씀하셨습니다. “그와 같습니다. 그대가 내게 거친 말과 분노를 내놓았지만 나는 그것을 받지 않았습니다. 그러므로 그것은 여전히 그대에게 남아 있습니다.”",
                    "화를 화로 갚으면 두 사람이 함께 분노를 나누게 됩니다. 하지만 상대의 분노를 받아들이지 않고 마음을 지키면 자신뿐 아니라 상대에게도 분노를 멈출 기회를 줄 수 있습니다.",
                    "바라문은 자신이 쏟아낸 말이 결국 누구의 마음을 괴롭히고 있었는지 깨달았습니다. 그리고 부처님의 평온한 가르침에 귀를 기울이기 시작했습니다.",
                ],
            },
        ],
        quote: "남이 건넨 분노를 반드시 받아들일 필요는 없습니다.",
        meaning:
            "상대가 던진 말에 곧바로 같은 감정으로 대응하면 그의 분노가 어느새 나의 분노가 됩니다. 잠시 멈추고 그 감정을 받아들이지 않는 것은 상대에게 지는 일이 아니라 내 마음을 지키는 일입니다.",
        source:
            "이 글은 《상윳따 니까야》 SN 7.2에 전해지는 내용을 바탕으로 읽기 쉽게 풀어썼습니다.",
    },

    "2": {
        id: "2",
        episode: "두 번째 이야기",
        category: "삶과 죽음",
        readingTime: "4분",
        title: "겨자씨를 구하러 다닌 어머니",
        intro:
            "아이를 잃은 슬픔에 빠진 한 어머니가 집집마다 겨자씨를 구하며 삶과 죽음의 이치를 깨닫게 된 이야기입니다.",
        scenes: [
            {
                number: "장면 1",
                title: "슬픔에 빠진 어머니",
                image: "/images/stories/story-02-scene-1.webp",
                paragraphs: [
                    "키사 고타미라는 여인은 사랑하는 아이를 잃고 깊은 슬픔에 빠졌습니다. 아이가 다시 살아날 수 있으리라는 희망을 놓지 못한 채 사람들에게 도움을 구했습니다.",
                    "마을 사람들은 그녀의 슬픔을 안타깝게 바라보았지만 누구도 아이를 되돌릴 수는 없었습니다.",
                    "마침내 한 사람이 부처님을 찾아가 보라고 알려주었습니다. 고타미는 아이를 품에 안고 부처님 앞에 무릎을 꿇었습니다.",
                ],
            },
            {
                number: "장면 2",
                title: "죽음을 겪지 않은 집",
                image: "/images/stories/story-02-scene-2.webp",
                paragraphs: [
                    "부처님은 고타미에게 작은 부탁을 하셨습니다. “마을에 가서 겨자씨를 조금 구해 오너라. 다만 가족 중 누구도 죽음을 겪지 않은 집에서 받아야 한다.”",
                    "고타미는 집집마다 찾아가 겨자씨를 부탁했습니다. 겨자씨를 가진 집은 많았지만 가족을 잃어보지 않은 집은 단 한 곳도 없었습니다.",
                    "어떤 집은 부모를, 어떤 집은 자녀를, 또 어떤 집은 형제와 벗을 떠나보냈습니다. 고타미는 자신의 슬픔만이 세상에 홀로 존재하는 것이 아님을 조금씩 깨닫기 시작했습니다.",
                ],
            },
            {
                number: "장면 3",
                title: "다시 부처님 앞에서",
                image: "/images/stories/story-02-scene-3.webp",
                paragraphs: [
                    "해가 저물 무렵 고타미는 빈손으로 부처님께 돌아왔습니다. 그녀는 더 이상 아이를 살려달라고 부탁하지 않았습니다.",
                    "부처님은 태어난 모든 존재는 언젠가 헤어짐과 죽음을 마주하게 된다고 조용히 말씀하셨습니다.",
                    "고타미의 슬픔이 곧바로 사라진 것은 아니었습니다. 하지만 자신의 아픔이 모든 생명이 함께 겪는 삶의 일부임을 이해하면서 마음에는 조금씩 고요함이 찾아왔습니다.",
                ],
            },
        ],
        quote:
            "슬픔은 나만의 것이 아니며, 모든 생명은 서로의 아픔으로 이어져 있습니다.",
        meaning:
            "상실을 받아들인다는 것은 사랑했던 사람을 잊는다는 뜻이 아닙니다. 피할 수 없는 이별을 이해하고, 같은 아픔을 겪는 다른 사람의 마음까지 바라볼 수 있게 되는 것입니다.",
        source:
            "이 글은 불교 전승에 전해지는 키사 고타미와 겨자씨 이야기를 바탕으로 읽기 쉽게 풀어썼습니다.",
    },

    "3": {
        id: "3",
        episode: "세 번째 이야기",
        category: "정성과 자비",
        readingTime: "3분",
        title: "가난한 여인의 등불",
        intro:
            "가진 것은 적었지만 진심을 다해 밝힌 작은 등불 하나가 밤이 지나도록 꺼지지 않았던 이야기입니다.",
        scenes: [
            {
                number: "장면 1",
                title: "마지막 동전으로 산 등불",
                image: "/images/stories/story-03-scene-1.webp",
                paragraphs: [
                    "어느 날 많은 사람이 부처님과 수행자들을 위해 등불을 밝히고 있다는 소식을 들은 가난한 여인이 있었습니다.",
                    "부유한 사람들은 크고 화려한 등과 많은 기름을 준비했지만 여인에게는 작은 동전 몇 닢밖에 없었습니다.",
                    "여인은 가진 동전을 모두 내어 작은 등잔과 아주 적은 양의 기름을 구했습니다. 비록 보잘것없어 보였지만 그 마음만큼은 누구보다 정성스러웠습니다.",
                ],
            },
            {
                number: "장면 2",
                title: "작은 등불에 담은 마음",
                image: "/images/stories/story-03-scene-2.webp",
                paragraphs: [
                    "사원의 뜰에는 크고 화려한 등불이 가득했습니다. 여인은 그 한쪽에 자신의 작은 등불을 조심스럽게 내려놓았습니다.",
                    "그리고 마음속으로 빌었습니다. “이 작은 빛이 어둠 속에 있는 모든 이에게 도움이 되기를 바랍니다.”",
                    "밤이 깊어지며 수많은 등불이 바람과 기름 부족으로 하나씩 꺼져갔습니다. 그러나 여인이 밝힌 작은 등불은 흔들리면서도 계속 빛나고 있었습니다.",
                ],
            },
            {
                number: "장면 3",
                title: "새벽까지 남은 빛",
                image: "/images/stories/story-03-scene-3.webp",
                paragraphs: [
                    "새벽이 밝았을 때 크고 화려했던 등불들은 대부분 꺼져 있었습니다. 하지만 가난한 여인의 작은 등불은 여전히 조용히 타오르고 있었습니다.",
                    "사람들이 이를 신기하게 여기자 부처님은 등불의 크기보다 그 안에 담긴 마음을 보아야 한다고 말씀하셨습니다.",
                    "많이 가진 사람이 많이 내놓는 것도 귀하지만, 자신이 가진 작은 것을 진심으로 나누는 마음 역시 세상을 밝히는 큰 빛이 될 수 있습니다.",
                ],
            },
        ],
        quote: "등불의 크기가 아니라 그 안에 담긴 마음이 어둠을 밝힙니다.",
        meaning:
            "나눔의 가치는 겉으로 보이는 크기만으로 정해지지 않습니다. 작은 행동이라도 누군가를 위하는 진실한 마음에서 시작되었다면 오래도록 따뜻한 빛을 남길 수 있습니다.",
        source:
            "이 글은 불교 경전과 전승에 전해지는 가난한 여인의 등불 이야기를 바탕으로 읽기 쉽게 풀어썼습니다.",
    },
};

function renderStoryParagraph(text: string) {
    const parts = text
        .split(/((?:“[^”]*”)|(?:"[^"]*"))/g)
        .map((part) => part.trim())
        .filter(Boolean);

    return parts.map((part, index) => {
        const isQuote =
            (part.startsWith("“") && part.endsWith("”")) ||
            (part.startsWith('"') && part.endsWith('"'));

        if (isQuote) {
            return (
                <span
                    key={`${part}-${index}`}
                    className="mt-2 block text-[#374151]"
                >
                    {part}
                </span>
            );
        }

        return (
            <span
                key={`${part}-${index}`}
                className="block"
            >
                {part}
            </span>
        );
    });
}

export default async function StoryDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const story = stories[id];

    if (!story) {
        notFound();
    }

    const previousStory = stories[String(Number(id) - 1)];
    const nextStory = stories[String(Number(id) + 1)];

    return (
        <div className="min-h-screen bg-white text-[#252A31]">
            <main>
                <section className="border-b border-[#E6EDE3] bg-[#F3F7F1]">
                    <div className="mx-auto max-w-4xl px-5 py-10 md:px-8 md:py-16">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[#F4F54A] px-3 py-1 text-xs font-bold text-[#4D4300]">
                                {story.episode}
                            </span>

                            <span className="text-xs font-semibold text-[#61705B]">
                                {story.category} · {story.readingTime}
                            </span>
                        </div>

                        <h1 className="mt-5 text-[32px] font-bold leading-[1.25] tracking-[-0.045em] md:text-[48px]">
                            {story.title}
                        </h1>

                        <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#667085] md:text-base">
                            {story.intro}
                        </p>
                    </div>
                </section>

                <article className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
                    <div className="space-y-12 lg:space-y-10">
                        {story.scenes.map((scene) => (
                            <section
                                key={scene.number}
                                className="overflow-hidden rounded-[26px] border border-[#DDE7D9] bg-white lg:grid lg:grid-cols-[0.88fr_1.12fr] lg:items-center"
                            >
                                {/* 모바일: 글 먼저 / PC: 오른쪽 */}
                                <div className="px-5 py-7 md:px-10 md:py-10 lg:order-2 lg:px-9 lg:py-9 xl:px-10 xl:py-10">
                                    <span className="text-xs font-bold text-[#7A8B74]">
                                        {scene.number}
                                    </span>

                                    <h2 className="mt-2 text-[23px] font-bold tracking-[-0.035em] md:text-[28px]">
                                        {scene.title}
                                    </h2>

                                    <div className="mt-5 space-y-4">
                                        {scene.paragraphs.map((paragraph) => (
                                            <p
                                                key={paragraph}
                                                className="text-[16px] leading-8 text-[#4E5968]"
                                            >
                                                {renderStoryParagraph(paragraph)}
                                            </p>
                                        ))}
                                    </div>
                                </div>

                                {/* 모바일: 원본 비율 / PC: 모든 장면 동일 캔버스 */}
                                <div className="lg:order-1 lg:self-center lg:overflow-hidden lg:bg-[#F2ECE0] lg:aspect-[1467/1072]">
                                    <img
                                        src={scene.image}
                                        alt={scene.title}
                                        loading="lazy"
                                        decoding="async"
                                        className="block h-auto w-full lg:h-full lg:w-full lg:object-contain"
                                    />
                                </div>
                            </section>
                        ))}
                    </div>

                    <div className="mx-auto max-w-4xl">
                        <section className="mt-12 rounded-[24px] bg-[#FDFDC7] px-6 py-8 text-center md:mt-16 md:px-10 md:py-10">
                            <span className="text-xs font-bold text-[#7A6D00]">
                                오늘의 한 문장
                            </span>

                            <p className="mx-auto mt-3 max-w-3xl break-keep text-[21px] font-bold leading-9 tracking-[-0.025em] text-[#3D3800] md:text-[25px]">
                                {story.quote}
                            </p>
                        </section>

                        <section className="mt-8 rounded-[22px] border border-[#E3E8EF] bg-[#F7F8FA] p-5 md:p-6">
                            <h2 className="font-bold">
                                이 이야기가 전하는 뜻
                            </h2>

                            <p className="mt-3 text-[15px] leading-7 text-[#667085]">
                                {story.meaning}
                            </p>
                        </section>

                        <div className="mt-8 flex flex-col gap-3 border-t border-[#E7E9EC] pt-7 sm:flex-row sm:items-center sm:justify-between">
                            <Link
                                href="/stories"
                                className="text-sm font-semibold text-[#667085]"
                            >
                                ← 전체 이야기
                            </Link>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                {previousStory && (
                                    <Link
                                        href={`/stories/${previousStory.id}`}
                                        className="rounded-xl border border-[#E3E8EF] bg-white px-4 py-3 text-center text-sm font-bold"
                                    >
                                        ← 이전 이야기
                                    </Link>
                                )}

                                {nextStory && (
                                    <Link
                                        href={`/stories/${nextStory.id}`}
                                        className="rounded-xl bg-[#252A31] px-4 py-3 text-center text-sm font-bold text-white"
                                    >
                                        다음 이야기 →
                                    </Link>
                                )}
                            </div>
                        </div>

                        <p className="mt-8 text-xs leading-6 text-[#8B95A1]">
                            {story.source}
                        </p>
                    </div>
                </article>
            </main>
        </div>
    );
}
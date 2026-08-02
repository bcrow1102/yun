export type EraKey = "silla" | "goryeo" | "joseon" | "modern";
export type PublicationStatus = "deep" | "summary" | "planned";

export type MasterSection = {
    title: string;
    paragraphs: string[];
};

export type Master = {
    slug: string;
    number: string;
    status: PublicationStatus;
    name: string;
    hanja: string;
    years: string;
    era: EraKey;
    eraLabel: string;
    theme: string;
    place: string;
    introduction: string;
    sections: MasterSection[];
};

type PlannedMaster = Omit<Master, "status" | "sections">;

function planned(master: PlannedMaster): Master {
    return {
        ...master,
        status: "planned",
        sections: [],
    };
}

export const masters: Master[] = [
    {
        slug: "wonkwang",
        number: "01",
        status: "deep",
        name: "원광법사",
        hanja: "圓光",
        years: "6세기 중엽–7세기 전반",
        era: "silla",
        eraLabel: "신라",
        theme: "세속오계 · 대승교학 · 국가와 불교",
        place: "신라와 중국 수나라",
        introduction:
            "중국에서 대승불교를 배우고 돌아와 세속오계를 전하며 신라 사회에 큰 영향을 남긴 고승입니다.",
        sections: [
            {
                title: "시대와 생애",
                paragraphs: [
                    "원광은 신라 진평왕 때 활동한 고승입니다. 중국 남조의 진과 수나라에서 여러 불교 교학을 공부한 뒤 600년 무렵 신라로 돌아왔습니다.",
                    "귀국 후에는 불교 교학을 강의하고 점찰법회를 열었으며, 왕실의 요청으로 외교 문서를 작성하는 등 승려이자 지식인으로 활동했습니다.",
                ],
            },
            {
                title: "핵심 활동 — 교학과 점찰법회",
                paragraphs: [
                    "원광은 『성실론』과 『열반경』을 비롯한 여러 교학을 익혔고, 수나라 장안에서도 대승불교를 공부한 것으로 전합니다.",
                    "신라로 돌아온 뒤에는 가슬갑사에서 점찰법회를 열어 사람들이 자신의 삶을 돌아보고 참회하도록 이끌었습니다.",
                ],
            },
            {
                title: "이야기로 읽기 — 세속오계",
                paragraphs: [
                    "귀산과 추항이 평생 지킬 가르침을 청하자 원광은 사군이충, 사친이효, 교우이신, 임전무퇴, 살생유택의 다섯 계율을 전했습니다.",
                    "두 사람은 당시 낭도로 기록되며, 이 가르침은 후대에 화랑도의 정신을 보여주는 세속오계로 널리 해석되었습니다.",
                ],
            },
        ],
    },

    planned({
        slug: "jajang",
        number: "02",
        name: "자장율사",
        hanja: "慈藏",
        years: "590–658",
        era: "silla",
        eraLabel: "신라",
        theme: "계율 · 불국토 · 승단 정비",
        place: "황룡사·통도사와 신라",
        introduction:
            "계율을 중심으로 신라 승단을 정비하고 불국토 신앙과 사찰 건립에 큰 자취를 남긴 고승입니다.",
    }),

    {
        slug: "wonhyo",
        number: "03",
        status: "deep",
        name: "원효대사",
        hanja: "元曉",
        years: "617–686",
        era: "silla",
        eraLabel: "신라",
        theme: "화쟁 · 일심 · 무애행",
        place: "경산·경주를 비롯한 신라 전역",
        introduction:
            "서로 다른 가르침이 더 큰 관점에서 조화를 이룰 수 있음을 밝히고, 불교를 백성의 삶 가까이 전한 사상가입니다.",
        sections: [
            {
                title: "시대와 생애",
                paragraphs: [
                    "원효는 삼국의 경쟁과 통일 전쟁이 이어지던 7세기 신라에서 활동했습니다. 출가 뒤 여러 불교 교학을 폭넓게 탐구했습니다.",
                    "요석공주와의 인연으로 설총을 낳았다는 기록과 민중 속에서 노래와 춤으로 불교를 전했다는 전승이 함께 남아 있습니다.",
                ],
            },
            {
                title: "핵심 사상 — 화쟁과 일심",
                paragraphs: [
                    "화쟁은 대립하는 주장 가운데 하나만 옳다고 고집하기보다 각 주장이 성립하는 조건과 관점을 살펴 더 큰 이해 속에서 조화시키는 태도입니다.",
                    "일심은 다양한 현상과 가르침을 한마음의 바탕에서 이해하려는 관점입니다.",
                ],
            },
            {
                title: "이야기로 읽기 — 해골물",
                paragraphs: [
                    "당나라 유학길에서 무덤에 머물며 모든 경험이 마음에 따라 달라진다는 사실을 깨달았다는 이야기가 전합니다.",
                    "오늘날 익숙한 해골물 이야기는 원효의 깨달음을 설명하는 후대 전승으로 구분해 읽을 필요가 있습니다.",
                ],
            },
        ],
    },

    {
        slug: "uisang",
        number: "04",
        status: "summary",
        name: "의상대사",
        hanja: "義湘",
        years: "625–702",
        era: "silla",
        eraLabel: "신라",
        theme: "화엄 · 법계연기 · 교단",
        place: "부석사와 신라의 화엄도량",
        introduction:
            "화엄사상을 신라에 뿌리내리고 수행과 교학이 함께하는 화엄교단의 기틀을 세운 고승입니다.",
        sections: [
            {
                title: "시대와 생애",
                paragraphs: [
                    "의상은 당나라에서 화엄교학을 배운 뒤 신라로 돌아왔습니다.",
                    "부석사를 중심으로 제자를 길러 화엄사상과 수행 전통을 확산했습니다.",
                ],
            },
            {
                title: "핵심 사상 — 하나가 곧 전체인 세계",
                paragraphs: [
                    "화엄사상은 모든 존재가 고립되지 않고 서로 원인이 되고 조건이 되며 연결되어 있다고 봅니다.",
                    "의상의 『화엄일승법계도』는 이러한 세계관을 게송과 도식으로 압축해 보여줍니다.",
                ],
            },
            {
                title: "이야기로 읽기 — 선묘 설화",
                paragraphs: [
                    "선묘가 용이 되어 의상의 귀국길과 부석사 창건을 도왔다는 이야기가 전합니다.",
                    "이 이야기는 후대 신앙과 사찰 창건 설화가 겹쳐진 전승으로 구분해 살펴야 합니다.",
                ],
            },
        ],
    },

    planned({
        slug: "hyecho",
        number: "05",
        name: "혜초",
        hanja: "慧超",
        years: "704–787",
        era: "silla",
        eraLabel: "통일신라",
        theme: "구법 여행 · 왕오천축국전 · 밀교",
        place: "인도·중앙아시아·중국 당나라",
        introduction:
            "인도와 중앙아시아를 여행하고 『왕오천축국전』을 남겨 8세기 아시아를 기록한 구법승입니다.",
    }),

    planned({
        slug: "jinpyo",
        number: "06",
        name: "진표율사",
        hanja: "眞表",
        years: "8세기 활동",
        era: "silla",
        eraLabel: "통일신라",
        theme: "미륵신앙 · 참회 · 점찰법회",
        place: "금산사·발연사와 호남 지역",
        introduction:
            "엄격한 참회 수행과 미륵신앙을 펼치며 통일신라의 신앙 전통에 큰 영향을 준 고승입니다.",
    }),

    planned({
        slug: "doseon",
        number: "07",
        name: "도선국사",
        hanja: "道詵",
        years: "827–898",
        era: "silla",
        eraLabel: "통일신라",
        theme: "선종 · 사찰 입지 · 풍수 전승",
        place: "옥룡사와 신라 남부",
        introduction:
            "선 수행을 바탕으로 활동했으며 후대에는 사찰 입지와 풍수에 관한 수많은 전승의 중심이 된 고승입니다.",
    }),

    planned({
        slug: "gyunyeo",
        number: "08",
        name: "균여대사",
        hanja: "均如",
        years: "923–973",
        era: "goryeo",
        eraLabel: "고려",
        theme: "화엄교학 · 보현행원 · 향가",
        place: "개경 귀법사와 고려",
        introduction:
            "고려 초기 화엄교학을 통합하고 보현보살의 실천을 향가로 풀어낸 학승입니다.",
    }),

    planned({
        slug: "uicheon",
        number: "09",
        name: "대각국사 의천",
        hanja: "義天",
        years: "1055–1101",
        era: "goryeo",
        eraLabel: "고려",
        theme: "교장 · 천태종 · 교관겸수",
        place: "국청사·흥왕사와 고려",
        introduction:
            "동아시아의 불교 주석서를 모아 교장을 편찬하고 고려 천태종의 기반을 세운 왕자 출신 고승입니다.",
    }),

    {
        slug: "jinul",
        number: "10",
        status: "summary",
        name: "보조국사 지눌",
        hanja: "知訥",
        years: "1158–1210",
        era: "goryeo",
        eraLabel: "고려",
        theme: "정혜쌍수 · 돈오점수 · 결사",
        place: "송광사와 수선사 결사",
        introduction:
            "마음의 깨달음과 꾸준한 수행을 함께 강조하며 고려 불교의 수행 전통을 새롭게 세운 선승입니다.",
        sections: [
            {
                title: "시대와 생애",
                paragraphs: [
                    "지눌이 활동한 고려 중기는 불교가 국가와 밀접하게 연결된 한편 승단의 세속화에 대한 비판도 커지던 시기였습니다.",
                    "그는 뜻을 함께하는 수행자들과 결사를 조직해 수행의 본뜻으로 돌아가고자 했습니다.",
                ],
            },
            {
                title: "핵심 사상 — 돈오점수와 정혜쌍수",
                paragraphs: [
                    "돈오점수는 마음의 본성을 깨닫더라도 오랜 습관과 번뇌를 다스리는 수행이 계속되어야 한다는 설명입니다.",
                    "정혜쌍수는 마음을 고요히 하는 선정과 바르게 보는 지혜를 함께 닦는다는 뜻입니다.",
                ],
            },
            {
                title: "오늘의 질문",
                paragraphs: [
                    "무언가를 이해한 순간과 실제 삶이 달라지는 순간은 같지 않을 때가 많습니다.",
                    "지눌의 가르침은 깨달음 뒤에도 반복적인 수행과 성찰이 필요한 이유를 묻습니다.",
                ],
            },
        ],
    },

    planned({
        slug: "hyesim",
        number: "11",
        name: "진각국사 혜심",
        hanja: "慧諶",
        years: "1178–1234",
        era: "goryeo",
        eraLabel: "고려",
        theme: "간화선 · 선문염송집 · 수선사",
        place: "송광사와 수선사 결사",
        introduction:
            "지눌의 뒤를 이어 수선사 결사를 이끌고 간화선을 정착시키는 데 기여한 선승입니다.",
    }),

    planned({
        slug: "iryeon",
        number: "12",
        name: "보각국사 일연",
        hanja: "一然",
        years: "1206–1289",
        era: "goryeo",
        eraLabel: "고려",
        theme: "삼국유사 · 역사인식 · 선 수행",
        place: "인각사와 고려 각지",
        introduction:
            "선승으로 수행하면서 『삼국유사』를 편찬해 고대의 역사와 불교 전승을 후대에 남긴 고승입니다.",
    }),

    planned({
        slug: "taego-bou",
        number: "13",
        name: "태고 보우",
        hanja: "太古普愚",
        years: "1301–1382",
        era: "goryeo",
        eraLabel: "고려",
        theme: "임제선 · 구산 통합 · 왕사",
        place: "태고사·소설암과 고려",
        introduction:
            "원나라에서 임제선의 법맥을 이어받고 고려 선종 교단의 통합을 추진한 고승입니다.",
    }),

    planned({
        slug: "naong",
        number: "14",
        name: "나옹 혜근",
        hanja: "懶翁惠勤",
        years: "1320–1376",
        era: "goryeo",
        eraLabel: "고려",
        theme: "선 수행 · 회암사 · 민간 전승",
        place: "회암사·신륵사와 고려",
        introduction:
            "고려 말 선풍을 크게 일으켰으며 수행 가르침과 수많은 민간 전승을 남긴 선승입니다.",
    }),

    planned({
        slug: "muhak",
        number: "15",
        name: "무학 자초",
        hanja: "無學自超",
        years: "1327–1405",
        era: "goryeo",
        eraLabel: "고려 말·조선 초",
        theme: "왕사 · 조선 건국 · 회암사",
        place: "회암사와 한양",
        introduction:
            "나옹의 법을 이었으며 조선 건국기 왕사로 활동해 불교와 새 왕조의 관계를 보여주는 고승입니다.",
    }),

    planned({
        slug: "gihwa",
        number: "16",
        name: "함허 기화",
        hanja: "涵虛己和",
        years: "1376–1433",
        era: "joseon",
        eraLabel: "조선",
        theme: "현정론 · 선교겸수 · 호불론",
        place: "회암사·정수사와 조선",
        introduction:
            "배불론이 강해진 조선 초기에 『현정론』을 지어 불교를 변론하고 선과 교학을 함께 계승한 학승입니다.",
    }),

    planned({
        slug: "hyujeong",
        number: "17",
        name: "서산 휴정",
        hanja: "西山休靜",
        years: "1520–1604",
        era: "joseon",
        eraLabel: "조선",
        theme: "선교관 · 청허문파 · 승병",
        place: "묘향산과 조선 각지",
        introduction:
            "조선불교의 선교관을 정리하고 임진왜란 때 승군을 일으킨 청허문파의 중심 고승입니다.",
    }),

    planned({
        slug: "yujeong",
        number: "18",
        name: "사명 유정",
        hanja: "泗溟惟政",
        years: "1544–1610",
        era: "joseon",
        eraLabel: "조선",
        theme: "승병 · 외교 · 포로 귀환",
        place: "표충사·대흥사와 조선·일본",
        introduction:
            "임진왜란에서 승병장으로 활동하고 전후 일본과의 교섭에서 포로 귀환에 기여한 고승입니다.",
    }),

    planned({
        slug: "jinmuk",
        number: "19",
        name: "진묵 일옥",
        hanja: "震默一玉",
        years: "1562–1633",
        era: "joseon",
        eraLabel: "조선",
        theme: "수행 · 효 · 민간 설화",
        place: "봉서사·망해사와 전라도",
        introduction:
            "깊은 수행과 효행으로 이름났으며 역사적 행적 위에 풍부한 민간 설화가 겹쳐 전하는 고승입니다.",
    }),

    planned({
        slug: "seongchong",
        number: "20",
        name: "백암 성총",
        hanja: "栢庵性聰",
        years: "1631–1700",
        era: "joseon",
        eraLabel: "조선",
        theme: "불서 간행 · 교학 · 화엄",
        place: "징광사·쌍계사와 호남",
        introduction:
            "조선 후기 여러 불서를 간행하고 강학을 펼쳐 교학 전통의 계승에 크게 기여한 학승입니다.",
    }),

    planned({
        slug: "choui",
        number: "21",
        name: "초의 의순",
        hanja: "草衣意恂",
        years: "1786–1866",
        era: "joseon",
        eraLabel: "조선",
        theme: "선 · 차문화 · 시와 교유",
        place: "대흥사 일지암",
        introduction:
            "선 수행과 차문화를 함께 닦고 당대 문인들과 교유하며 조선 후기 불교문화의 폭을 넓힌 고승입니다.",
    }),

    planned({
        slug: "gyeongheo",
        number: "22",
        name: "경허 성우",
        hanja: "鏡虛惺牛",
        years: "1849–1912",
        era: "joseon",
        eraLabel: "조선 말·근대",
        theme: "선풍 진작 · 결사 · 근대 선불교",
        place: "천장암·수덕사와 충청 지역",
        introduction:
            "쇠퇴했던 선 수행의 기풍을 다시 일으켜 근현대 한국 선불교의 흐름에 큰 영향을 남긴 선승입니다.",
    }),

    planned({
        slug: "mangong",
        number: "23",
        name: "만공 월면",
        hanja: "滿空月面",
        years: "1871–1946",
        era: "modern",
        eraLabel: "근현대",
        theme: "선 수행 · 덕숭산문 · 민족의식",
        place: "수덕사와 덕숭산",
        introduction:
            "경허의 선풍을 이어 덕숭산 수행 공동체를 이끌고 일제강점기 한국불교의 자주성을 지킨 선승입니다.",
    }),

    planned({
        slug: "yongseong",
        number: "24",
        name: "백용성",
        hanja: "白龍城",
        years: "1864–1940",
        era: "modern",
        eraLabel: "근현대",
        theme: "독립운동 · 불교개혁 · 역경",
        place: "대각사와 전국",
        introduction:
            "3·1운동 민족대표로 참여하고 한글 역경과 생활불교 운동을 펼친 근대 불교개혁가입니다.",
    }),

    planned({
        slug: "han-yongun",
        number: "25",
        name: "만해 한용운",
        hanja: "萬海韓龍雲",
        years: "1879–1944",
        era: "modern",
        eraLabel: "근현대",
        theme: "불교개혁 · 독립운동 · 문학",
        place: "백담사·심우장과 한반도",
        introduction:
            "불교개혁론을 펼치고 3·1운동에 참여했으며 시와 산문으로 자유와 저항을 말한 승려입니다.",
    }),

    planned({
        slug: "cheongdam",
        number: "26",
        name: "청담 순호",
        hanja: "靑潭淳浩",
        years: "1902–1971",
        era: "modern",
        eraLabel: "근현대",
        theme: "불교정화 · 교육 · 현대 승단",
        place: "도선사와 한국불교 승단",
        introduction:
            "광복 이후 불교정화와 교육에 힘쓰며 현대 한국불교의 승단 재편 과정에 참여한 고승입니다.",
    }),

    planned({
        slug: "seongcheol",
        number: "27",
        name: "성철 퇴옹",
        hanja: "性徹退翁",
        years: "1912–1993",
        era: "modern",
        eraLabel: "근현대",
        theme: "선 수행 · 돈오돈수 · 백일법문",
        place: "해인사 백련암",
        introduction:
            "엄격한 수행과 선에 관한 가르침으로 현대 한국불교의 수행 담론에 큰 영향을 준 선승입니다.",
    }),

    planned({
        slug: "beopjeong",
        number: "28",
        name: "법정",
        hanja: "法頂",
        years: "1932–2010",
        era: "modern",
        eraLabel: "근현대",
        theme: "무소유 · 생명 · 대중 글쓰기",
        place: "송광사·불일암·길상사",
        introduction:
            "담백한 글과 삶을 통해 무소유와 생명 존중의 가치를 대중에게 전한 현대의 수행자입니다.",
    }),
];

export function getMaster(slug: string) {
    return masters.find((master) => master.slug === slug);
}

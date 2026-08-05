export type IllustrationContent = {
    type: "paragraph" | "dialogue";
    text: string;
};

export type IllustrationScene = {
    number: string;
    title: string;
    image: {
        src: string;
        alt: string;
        caption: string;
    };
    content: IllustrationContent[];
};

export type MasterIllustration = {
    slug: string;
    masterSlug: string;
    title: string;
    summary: string;
    classification: string;
    source: string;
    coverImage: {
        src: string;
        alt: string;
    };
    scenes: IllustrationScene[];
    recordGuide: string[];
};

export const wonhyoIllustrations: MasterIllustration[] = [
    {
        slug: "skull-water",
        masterSlug: "wonhyo",
        title: "원효, 밤의 물에서 마음을 보다",
        summary:
            "당나라로 향하던 원효가 어둠 속에서 마신 물과 아침에 마주한 해골을 통해, 경험을 바꾸는 마음의 작용을 깨달았다고 전하는 이야기입니다.",
        classification: "후대 문헌의 전승",
        source: "『송고승전』 계통 기록과 후대 전승",
        coverImage: {
            src: "/images/masters/wonhyo/episode-01-scene-04.webp",
            alt: "아침이 되어 해골과 고인 물을 발견한 원효와 의상",
        },
        scenes: [
            {
                number: "01",
                title: "서쪽으로 향하는 길",
                image: {
                    src: "/images/masters/wonhyo/episode-01-scene-01.webp",
                    alt: "천 보따리를 메고 산길을 걷는 원효와 의상",
                    caption:
                        "원효와 의상이 더 깊은 가르침을 배우기 위해 당나라로 향하는 모습을 재구성한 삽화",
                },
                content: [
                    {
                        type: "paragraph",
                        text: "신라의 경계를 벗어난 뒤로 산은 더욱 거칠어졌다.",
                    },
                    {
                        type: "paragraph",
                        text: "사람의 발길이 드문 길에는 키 큰 풀이 무릎 가까이 자라 있었고, 오래된 나무의 뿌리가 마른 흙 위로 뱀처럼 뻗어 있었다. 원효와 의상은 아침부터 별다른 말 없이 그 길을 걸었다. 등에 멘 행장은 가벼웠지만, 당나라까지 이어질 길은 헤아리기 어려울 만큼 멀었다.",
                    },
                    {
                        type: "paragraph",
                        text: "두 사람은 오래전부터 바다 건너와 대륙에서 전해진 경전들을 읽어 왔다. 그러나 글 속에는 또 다른 글이 있었고, 하나의 가르침을 이해할 때마다 그와 맞서는 다른 가르침이 나타났다. 원효는 알고 싶은 것이 많아질수록 자신이 아는 것이 얼마나 적은지 선명하게 느꼈다.",
                    },
                    {
                        type: "paragraph",
                        text: "당나라에는 신라에서 아직 구하기 어려운 경전과 논서가 있었다. 그곳에서는 이름난 학승들이 새로운 번역을 강론하고, 여러 나라에서 온 승려들이 한자리에 모여 불법을 논한다고 했다.",
                    },
                    {
                        type: "paragraph",
                        text: "의상이 앞서 걷다가 산등성이 너머를 바라보았다.",
                    },
                    {
                        type: "dialogue",
                        text: "“이 고개를 넘으면 길이 조금은 평탄해질 걸세.”",
                    },
                    {
                        type: "paragraph",
                        text: "원효는 대답하지 않고 걸음을 멈췄다. 뒤를 돌아보니 그들이 지나온 산길이 옅은 안개 속으로 사라지고 있었다. 신라의 마을도, 익숙한 사찰의 지붕도 이제 보이지 않았다.",
                    },
                    {
                        type: "dialogue",
                        text: "“무엇을 보는가?”",
                    },
                    {
                        type: "paragraph",
                        text: "의상이 묻자 원효가 천천히 몸을 돌렸다.",
                    },
                    {
                        type: "dialogue",
                        text: "“우리가 멀리 온 것인지 생각했네.”",
                    },
                    {
                        type: "dialogue",
                        text: "“이제 시작일 뿐이야.”",
                    },
                    {
                        type: "paragraph",
                        text: "원효는 작게 웃었다.",
                    },
                    {
                        type: "dialogue",
                        text: "“그렇겠지. 길도, 우리가 찾는 것도.”",
                    },
                    {
                        type: "paragraph",
                        text: "두 사람은 다시 서쪽을 향해 걸었다.",
                    },
                ],
            },
            {
                number: "02",
                title: "날이 저물다",
                image: {
                    src: "/images/masters/wonhyo/episode-01-scene-02.webp",
                    alt: "비 내리는 밤 무덤굴 안에서 쉬는 원효와 의상",
                    caption:
                        "거센 비를 피해 굴로 보이는 장소에서 밤을 보내는 두 사람을 재구성한 삽화",
                },
                content: [
                    {
                        type: "paragraph",
                        text: "오후부터 하늘이 낮아졌다.",
                    },
                    {
                        type: "paragraph",
                        text: "잿빛 구름이 산마루를 덮더니 바람이 불기 시작했다. 마른 나뭇잎이 길 위를 휩쓸고 지나갔고, 풀숲에서는 이름 모를 짐승이 움직이는 소리가 들렸다. 해가 완전히 지기 전까지 마을 하나를 찾으려 했지만, 길은 갈수록 깊은 산속으로 이어졌다.",
                    },
                    {
                        type: "paragraph",
                        text: "하루 종일 걸은 두 사람의 발에는 흙과 땀이 엉겨 붙어 있었다. 원효는 마른 입술을 혀로 적셨다. 아침에 채운 물은 이미 오래전에 떨어졌다.",
                    },
                    {
                        type: "paragraph",
                        text: "멀리서 천둥이 울렸다.",
                    },
                    {
                        type: "paragraph",
                        text: "곧 굵은 빗방울이 하나둘 떨어지기 시작했다. 처음에는 나뭇잎 위에서만 소리가 났지만, 얼마 지나지 않아 비는 길과 옷과 행장을 구분하지 않고 세차게 두드렸다.",
                    },
                    {
                        type: "dialogue",
                        text: "“이대로는 길을 잃겠네.”",
                    },
                    {
                        type: "paragraph",
                        text: "원효는 어둠 속을 살폈다. 비 사이로 희미한 산의 윤곽만 보일 뿐, 불빛도 지붕도 없었다.",
                    },
                    {
                        type: "dialogue",
                        text: "“조금만 더 가 보세.”",
                    },
                    {
                        type: "dialogue",
                        text: "“갈 수 있겠나?”",
                    },
                    {
                        type: "dialogue",
                        text: "“갈 수는 있네.”",
                    },
                    {
                        type: "paragraph",
                        text: "원효는 젖은 신발을 한 번 내려다보았다.",
                    },
                    {
                        type: "dialogue",
                        text: "“다만 오늘 밤은 길보다 몸을 누일 곳이 먼저겠어.”",
                    },
                    {
                        type: "paragraph",
                        text: "두 사람은 비를 피해 산비탈 아래로 내려갔다. 나무와 바위 사이를 더듬어 가던 의상이 걸음을 멈췄다.",
                    },
                    {
                        type: "dialogue",
                        text: "“저곳은 어떤가?”",
                    },
                    {
                        type: "paragraph",
                        text: "수풀 너머에 검은 입구가 보였다. 멀리서 보면 바위 아래 자연스럽게 생긴 굴처럼 보였다. 안쪽은 깊이를 알 수 없을 만큼 어두웠지만, 적어도 비바람은 막아줄 듯했다.",
                    },
                    {
                        type: "paragraph",
                        text: "원효가 먼저 안으로 들어갔다. 젖은 흙냄새와 오래 고인 공기의 냄새가 섞여 코끝에 닿았다. 바닥은 울퉁불퉁했지만 두 사람이 몸을 웅크릴 자리는 충분했다.",
                    },
                    {
                        type: "paragraph",
                        text: "의상이 행장을 내려놓았다.",
                    },
                    {
                        type: "dialogue",
                        text: "“좋은 곳은 아니군.”",
                    },
                    {
                        type: "paragraph",
                        text: "원효도 벽에 등을 기댔다.",
                    },
                    {
                        type: "dialogue",
                        text: "“오늘은 이것으로 충분하네.”",
                    },
                    {
                        type: "paragraph",
                        text: "밖에서는 비가 쉬지 않고 내렸다.",
                    },
                ],
            },
            {
                number: "03",
                title: "어둠 속의 한 모금",
                image: {
                    src: "/images/masters/wonhyo/episode-01-scene-03.webp",
                    alt: "어두운 굴 안에서 그릇에 담긴 물을 마시는 원효",
                    caption:
                        "정체를 알 수 없는 둥근 물체에 담긴 물을 마시는 원효를 재구성한 삽화",
                },
                content: [
                    {
                        type: "paragraph",
                        text: "밤이 깊어지자 빗소리가 조금 잦아들었다.",
                    },
                    {
                        type: "paragraph",
                        text: "의상은 행장을 베고 누운 지 오래지 않아 잠들었다. 원효도 피로에 눌려 눈을 감았지만, 목 안쪽의 마름은 좀처럼 사라지지 않았다. 처음에는 침을 삼키며 참았다. 그러나 시간이 흐를수록 혀와 입천장이 달라붙는 것처럼 느껴졌다.",
                    },
                    {
                        type: "paragraph",
                        text: "원효는 어둠 속에서 눈을 떴다.",
                    },
                    {
                        type: "paragraph",
                        text: "굴 안은 손을 눈앞에 가져가도 보이지 않을 만큼 캄캄했다. 그는 의상을 깨우지 않으려 조심스럽게 몸을 일으켰다. 바닥을 짚은 손에 축축한 흙과 작은 돌멩이가 닿았다.",
                    },
                    {
                        type: "paragraph",
                        text: "어딘가에서 물방울 떨어지는 소리가 났다.",
                    },
                    {
                        type: "dialogue",
                        text: "똑.",
                    },
                    {
                        type: "paragraph",
                        text: "잠시 뒤 다시.",
                    },
                    {
                        type: "dialogue",
                        text: "똑.",
                    },
                    {
                        type: "paragraph",
                        text: "원효는 소리를 따라 손을 뻗었다. 바닥을 더듬던 손끝에 둥글고 단단한 물체가 걸렸다. 낡은 바가지나 깨진 그릇처럼 느껴졌다. 손가락을 안으로 넣자 차가운 물이 닿았다.",
                    },
                    {
                        type: "paragraph",
                        text: "그는 두 손으로 그것을 조심스럽게 들어 올렸다.",
                    },
                    {
                        type: "paragraph",
                        text: "어둠 속에서는 모양도 빛깔도 알 수 없었다. 하지만 물 냄새는 나쁘지 않았다. 원효는 마른 입술을 그 가장자리에 대고 천천히 물을 마셨다.",
                    },
                    {
                        type: "paragraph",
                        text: "차가운 물이 입안으로 흘러들었다.",
                    },
                    {
                        type: "paragraph",
                        text: "첫 모금이 목을 지나자 온몸의 열이 식는 듯했다. 그는 한 모금 더 마셨다. 물은 맑고 달게 느껴졌다. 하루 종일 걷고 비에 젖은 뒤라서인지 그보다 시원한 물을 마셔본 적이 없는 것 같았다.",
                    },
                    {
                        type: "paragraph",
                        text: "빈 그릇을 내려놓은 원효는 긴 숨을 내쉬었다.",
                    },
                    {
                        type: "paragraph",
                        text: "그는 다시 자리로 돌아와 누웠다. 굴 바깥에서 떨어지는 빗방울 소리가 멀어지고 있었다. 조금 전까지 불편했던 바닥도 이제는 포근하게 느껴졌다.",
                    },
                    {
                        type: "paragraph",
                        text: "잠들기 직전, 원효는 어둠을 향해 낮게 중얼거렸다.",
                    },
                    {
                        type: "dialogue",
                        text: "“고맙구나.”",
                    },
                    {
                        type: "paragraph",
                        text: "누구에게 한 말인지 자신도 알지 못했다.",
                    },
                ],
            },
            {
                number: "04",
                title: "아침에 본 것",
                image: {
                    src: "/images/masters/wonhyo/episode-01-scene-04.webp",
                    alt: "아침에 해골과 고인 물을 발견하고 놀란 원효",
                    caption:
                        "밤에 물을 마신 그릇이 해골이었음을 알게 되는 순간을 재구성한 삽화",
                },
                content: [
                    {
                        type: "paragraph",
                        text: "새소리가 들렸다.",
                    },
                    {
                        type: "paragraph",
                        text: "원효는 눈을 떴다. 굴 입구로 들어온 아침빛이 바닥을 길게 비추고 있었다. 밤새 내리던 비는 그쳤고, 젖은 산에서는 흙과 풀 냄새가 짙게 올라왔다.",
                    },
                    {
                        type: "paragraph",
                        text: "의상은 입구 가까이에 앉아 젖은 장삼을 살피고 있었다.",
                    },
                    {
                        type: "dialogue",
                        text: "“깼는가?”",
                    },
                    {
                        type: "paragraph",
                        text: "원효는 몸을 일으켰다. 잠을 잘 잔 덕인지 몸은 전날보다 가벼웠다. 그는 무심코 밤에 물을 마셨던 곳을 바라보았다.",
                    },
                    {
                        type: "paragraph",
                        text: "빛이 굴 안쪽까지 조금씩 번지고 있었다.",
                    },
                    {
                        type: "paragraph",
                        text: "바닥에는 부서진 나무 조각도, 오래된 바가지도 없었다. 대신 사람의 뼈처럼 보이는 희고 둥근 물체들이 흙 속에 반쯤 묻혀 있었다. 벽가에는 낡은 돌이 층층이 쌓여 있었고, 그 위에는 오래전에 썩어 문드러진 천 조각이 붙어 있었다.",
                    },
                    {
                        type: "paragraph",
                        text: "굴이 아니었다.",
                    },
                    {
                        type: "paragraph",
                        text: "무덤이었다.",
                    },
                    {
                        type: "paragraph",
                        text: "원효의 시선이 한 곳에서 멈췄다.",
                    },
                    {
                        type: "paragraph",
                        text: "그가 밤새 그릇이라고 여겼던 것이 아침 햇빛 아래 드러나 있었다. 사람의 해골이었다. 움푹 팬 안쪽에는 탁한 빗물이 조금 남아 있었고, 썩은 나뭇잎과 벌레의 허물이 물 위에 떠 있었다.",
                    },
                    {
                        type: "paragraph",
                        text: "원효의 얼굴에서 핏기가 사라졌다.",
                    },
                    {
                        type: "paragraph",
                        text: "어젯밤 입안으로 흘러들던 차가운 물의 감촉이 다시 살아났다. 달고 맑게 느껴졌던 맛이 한순간에 비리고 역겨운 것으로 변했다. 그는 입을 막고 굴 밖으로 달려 나갔다.",
                    },
                    {
                        type: "paragraph",
                        text: "몸을 숙이자 속이 뒤집혔다.",
                    },
                    {
                        type: "paragraph",
                        text: "의상이 뒤따라 나왔다.",
                    },
                    {
                        type: "dialogue",
                        text: "“무슨 일인가?”",
                    },
                    {
                        type: "paragraph",
                        text: "원효는 한동안 대답하지 못했다. 거친 숨을 몰아쉬며 젖은 땅을 바라보았다. 눈앞에 놓인 것은 아침 햇빛과 빗물이 맺힌 풀잎, 그리고 흙 위로 기어가는 작은 벌레였다.",
                    },
                    {
                        type: "paragraph",
                        text: "어젯밤에는 달았다.",
                    },
                    {
                        type: "paragraph",
                        text: "아침에는 더러웠다.",
                    },
                    {
                        type: "paragraph",
                        text: "밤사이에 물이 달라진 것인가.",
                    },
                    {
                        type: "paragraph",
                        text: "해골이 다른 것이 되었는가.",
                    },
                    {
                        type: "paragraph",
                        text: "바람이 나뭇가지를 흔들었다. 잎사귀에 맺힌 빗물이 햇빛을 받아 잠시 반짝였다.",
                    },
                    {
                        type: "dialogue",
                        text: "“무엇을 보았나?”",
                    },
                    {
                        type: "paragraph",
                        text: "원효는 천천히 고개를 들었다. 무덤 안의 해골을 바라보고, 다시 자신의 손을 내려다보았다.",
                    },
                    {
                        type: "paragraph",
                        text: "손은 어젯밤과 같았다.",
                    },
                    {
                        type: "paragraph",
                        text: "입도, 물도, 자신도 그대로였다.",
                    },
                    {
                        type: "paragraph",
                        text: "달라진 것은 그가 그것을 바라보는 마음뿐이었다.",
                    },
                    {
                        type: "paragraph",
                        text: "원효의 거친 숨이 서서히 잦아들었다. 얼굴에 남아 있던 두려움도 조금씩 가라앉았다. 그는 오래도록 아무 말도 하지 않았다.",
                    },
                    {
                        type: "paragraph",
                        text: "의상이 다시 물으려 했을 때, 원효가 먼저 입을 열었다.",
                    },
                    {
                        type: "dialogue",
                        text: "“물은 그대로였네.”",
                    },
                    {
                        type: "dialogue",
                        text: "“무슨 말인가?”",
                    },
                    {
                        type: "paragraph",
                        text: "원효는 대답 대신 눈을 감았다.",
                    },
                    {
                        type: "paragraph",
                        text: "멀리서 아침 종소리와도 같은 새 울음이 산을 건너왔다.",
                    },
                ],
            },
            {
                number: "05",
                title: "갈라지는 길",
                image: {
                    src: "/images/masters/wonhyo/episode-01-scene-05.webp",
                    alt: "갈림길에서 서로 합장하며 작별하는 원효와 의상",
                    caption:
                        "의상은 서쪽으로 향하고 원효는 신라로 돌아서는 순간을 재구성한 삽화",
                },
                content: [
                    {
                        type: "paragraph",
                        text: "두 사람은 무덤 밖 바위에 앉았다.",
                    },
                    {
                        type: "paragraph",
                        text: "비가 그친 하늘 사이로 구름이 빠르게 흘러갔다. 산 아래로 이어진 길은 밤새 내린 비에 젖어 검게 빛났다. 그 길을 따라 계속 가면 당나라로 향할 수 있었다.",
                    },
                    {
                        type: "paragraph",
                        text: "의상은 행장을 다시 묶었다. 그러다 원효가 움직이지 않는 것을 보고 손을 멈췄다.",
                    },
                    {
                        type: "dialogue",
                        text: "“떠나지 않을 셈인가?”",
                    },
                    {
                        type: "paragraph",
                        text: "원효는 산 아래가 아니라 자신들이 지나온 동쪽 길을 바라보고 있었다.",
                    },
                    {
                        type: "dialogue",
                        text: "“나는 돌아가겠네.”",
                    },
                    {
                        type: "dialogue",
                        text: "“여기까지 와서 말인가?”",
                    },
                    {
                        type: "dialogue",
                        text: "“여기까지 왔기에 돌아갈 수 있는 것인지도 모르지.”",
                    },
                    {
                        type: "paragraph",
                        text: "의상은 원효의 얼굴을 바라보았다. 그를 설득하려는 듯 입을 열었다가 다시 다물었다.",
                    },
                    {
                        type: "dialogue",
                        text: "“당에는 우리가 보지 못한 경전이 많네.”",
                    },
                    {
                        type: "dialogue",
                        text: "“알고 있네.”",
                    },
                    {
                        type: "dialogue",
                        text: "“이름난 스승들도 있고.”",
                    },
                    {
                        type: "dialogue",
                        text: "“그것도 알고 있네.”",
                    },
                    {
                        type: "dialogue",
                        text: "“그런데도 돌아가겠다는 것인가?”",
                    },
                    {
                        type: "paragraph",
                        text: "원효는 잠시 무덤 쪽을 돌아보았다. 아침빛 속에서 그곳은 더 이상 밤의 굴처럼 보이지 않았다. 그러나 어젯밤 자신이 편안히 잠들었던 장소도 분명 그곳이었다.",
                    },
                    {
                        type: "dialogue",
                        text: "“어젯밤에는 쉴 만한 굴이었네. 아침에는 두려운 무덤이 되었지.”",
                    },
                    {
                        type: "paragraph",
                        text: "의상은 말없이 들었다.",
                    },
                    {
                        type: "dialogue",
                        text: "“밖의 것이 달라져서가 아니었네.”",
                    },
                    {
                        type: "paragraph",
                        text: "원효는 자신의 가슴에 손을 올렸다.",
                    },
                    {
                        type: "dialogue",
                        text: "“내 마음이 이름을 붙이고, 내 마음이 기뻐하고, 내 마음이 두려워했네.”",
                    },
                    {
                        type: "paragraph",
                        text: "바람이 두 사람의 젖은 옷자락을 흔들었다.",
                    },
                    {
                        type: "dialogue",
                        text: "“밖에서 찾으려 했던 것을, 더 멀리 간다고 만날 수 있을지 모르겠네.”",
                    },
                    {
                        type: "paragraph",
                        text: "오랜 침묵 끝에 의상이 행장을 등에 멨다.",
                    },
                    {
                        type: "dialogue",
                        text: "“그렇다면 자네의 길을 가게.”",
                    },
                    {
                        type: "paragraph",
                        text: "원효도 자리에서 일어났다.",
                    },
                    {
                        type: "paragraph",
                        text: "두 사람은 산길이 갈라지는 곳까지 함께 걸었다. 한쪽은 서쪽으로, 다른 한쪽은 동쪽으로 이어졌다. 의상은 짧게 합장한 뒤 서쪽 길로 향했다. 원효는 그 뒷모습이 산모퉁이 너머로 사라질 때까지 서 있었다.",
                    },
                    {
                        type: "paragraph",
                        text: "그리고 몸을 돌렸다.",
                    },
                ],
            },
            {
                number: "06",
                title: "백성들 사이로",
                image: {
                    src: "/images/masters/wonhyo/episode-01-scene-06.webp",
                    alt: "마을 사람들과 아이들에게 가르침을 전하는 원효",
                    caption:
                        "신라로 돌아와 백성들 가까이에서 가르침을 전하는 원효를 재구성한 삽화",
                },
                content: [
                    {
                        type: "paragraph",
                        text: "원효가 돌아온 뒤 사람들은 그를 예전과 같은 승려로만 보지 않았다. 그의 옷차림과 행동을 두고 손가락질하는 이도 있었고, 계율에서 벗어난 사람이라 수군거리는 이도 있었다.",
                    },
                    {
                        type: "paragraph",
                        text: "하지만 원효는 높은 자리에 머무르지 않았다.",
                    },
                    {
                        type: "paragraph",
                        text: "그는 장터와 마을을 다녔다. 농부와 장사꾼, 아이와 노인 사이에 앉았다. 때로는 노래했고, 때로는 춤을 추었으며, 사람들이 이해하기 어려운 말을 쉬운 소리로 바꾸어 들려주었다.",
                    },
                    {
                        type: "paragraph",
                        text: "어느 날 해가 저물 무렵, 원효는 장터 한복판에 서 있었다.",
                    },
                    {
                        type: "paragraph",
                        text: "사람들은 값을 흥정하고, 아이들은 흙먼지를 일으키며 뛰어다녔다. 술에 취한 사내가 웃음을 터뜨렸고, 좌판을 정리하던 노파가 원효에게 남은 떡 한 조각을 건넸다.",
                    },
                    {
                        type: "dialogue",
                        text: "“스님도 하나 드시오.”",
                    },
                    {
                        type: "paragraph",
                        text: "원효는 떡을 받아 들고 웃었다.",
                    },
                    {
                        type: "paragraph",
                        text: "누군가 뒤에서 그를 불렀다.",
                    },
                    {
                        type: "dialogue",
                        text: "“스님!”",
                    },
                    {
                        type: "paragraph",
                        text: "원효는 잠시 걸음을 멈췄지만 돌아보지 않았다.",
                    },
                    {
                        type: "paragraph",
                        text: "사람들 사이로 다시 걸어 들어간 그의 모습은 오래지 않아 장터의 소리와 저녁 먼지 속에 묻혔다.",
                    },
                ],
            },
        ],
        recordGuide: [
            "원효가 당나라로 향하던 중 무덤에서 밤을 보낸 뒤 마음의 작용을 깨달아 유학을 포기했다는 이야기는 후대 문헌을 통해 전해집니다.",
            "오늘날 널리 알려진 해골에 고인 물의 구체적인 장면은 원효의 깨달음을 상징적으로 압축해 전하는 형태로 구분해 볼 필요가 있습니다.",
            "원효와 의상의 대화, 밤길의 정황과 장터 장면은 이야기의 몰입을 위해 재구성한 부분입니다.",
            "원효의 입당 시도와 깨달음 전승, 귀환 이후 민중 속에서 교화했다는 흐름은 현재 원효 상세 자료에 정리된 기록과 전승을 바탕으로 삼았습니다.",
        ],
    },
];
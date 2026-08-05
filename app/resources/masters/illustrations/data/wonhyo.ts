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

    {
        slug: "yoseok-and-seolchong",
        masterSlug: "wonhyo",
        title: "원효와 요석공주, 설총으로 이어진 인연",
        summary:
            "원효가 거리에서 노래한 수수께끼 같은 말이 왕에게 전해지고, 요석궁의 공주와 인연을 맺어 설총을 낳았다고 전하는 『삼국유사』의 이야기입니다.",
        classification: "『삼국유사』에 전하는 설화",
        source: "『삼국유사』 권4 「원효불기」",
        coverImage: {
            src: "/images/masters/wonhyo/episode-02-scene-04.webp",
            alt: "요석궁에서 마주한 원효와 요석공주",
        },
        scenes: [
            {
                number: "01",
                title: "거리에서 부른 노래",
                image: {
                    src: "/images/masters/wonhyo/episode-02-scene-01.webp",
                    alt: "신라 왕경의 거리에서 노래를 부르는 원효",
                    caption:
                        "원효가 사람들 사이를 걸으며 뜻을 알기 어려운 노래를 부르는 장면을 재구성한 삽화",
                },
                content: [
                    {
                        type: "paragraph",
                        text: "원효가 신라 왕경의 거리를 오가며 기이한 노래를 부르기 시작했다.",
                    },
                    {
                        type: "paragraph",
                        text: "장터를 지나고 궁궐 가까운 길을 걸을 때도 그는 같은 말을 되풀이했다. 사람들은 발걸음을 멈추고 그를 바라보았지만, 노래의 뜻을 알아듣는 이는 없었다.",
                    },
                    {
                        type: "dialogue",
                        text: "“누가 자루 없는 도끼를 내게 빌려주겠는가. 내가 하늘을 떠받칠 기둥을 깎으리라.”",
                    },
                    {
                        type: "paragraph",
                        text: "어떤 이는 엉뚱한 노래라며 웃었고, 어떤 이는 이름난 승려가 어째서 저런 말을 하는지 수군거렸다.",
                    },
                    {
                        type: "paragraph",
                        text: "그러나 원효는 설명하지 않았다. 사람들의 반응에도 아랑곳하지 않고 같은 노래를 부르며 거리를 걸었다.",
                    },
                    {
                        type: "paragraph",
                        text: "그 말은 여러 사람의 입을 거쳐 마침내 궁궐 안까지 전해졌다.",
                    },
                ],
            },
            {
                number: "02",
                title: "왕이 알아들은 뜻",
                image: {
                    src: "/images/masters/wonhyo/episode-02-scene-02.webp",
                    alt: "신하에게 원효의 노래를 전해 듣는 신라의 왕",
                    caption:
                        "원효가 부른 노래의 뜻을 왕이 헤아리는 장면을 재구성한 삽화",
                },
                content: [
                    {
                        type: "paragraph",
                        text: "왕은 신하에게서 원효의 노래를 전해 들었다.",
                    },
                    {
                        type: "dialogue",
                        text: "“자루 없는 도끼를 얻어 하늘을 떠받칠 기둥을 깎겠다 하였느냐?”",
                    },
                    {
                        type: "paragraph",
                        text: "신하가 그렇다고 답하자 왕은 잠시 생각에 잠겼다.",
                    },
                    {
                        type: "paragraph",
                        text: "『삼국유사』는 왕이 그 노래를 듣고 원효의 뜻을 알아차렸다고 전한다. 원효가 귀한 여인과 인연을 맺어 뛰어난 아들을 얻고자 한다고 풀이한 것이다.",
                    },
                    {
                        type: "paragraph",
                        text: "당시 요석궁에는 남편을 잃고 홀로 지내던 공주가 있었다.",
                    },
                    {
                        type: "paragraph",
                        text: "왕은 나라에 현명한 인물이 태어난다면 좋은 일이라 여기고, 궁의 관리들에게 원효를 찾아 데려오라고 명하였다.",
                    },
                    {
                        type: "dialogue",
                        text: "“그를 찾아 요석궁으로 모셔라.”",
                    },
                    {
                        type: "paragraph",
                        text: "관리들은 곧 궁을 나서 원효가 다닌다는 길로 향했다.",
                    },
                ],
            },
            {
                number: "03",
                title: "다리 아래로 젖은 옷",
                image: {
                    src: "/images/masters/wonhyo/episode-02-scene-03.webp",
                    alt: "다리 아래 물에 빠져 옷이 젖은 원효와 그를 발견한 관리들",
                    caption:
                        "원효가 일부러 물에 빠져 옷을 적셨다고 전하는 장면을 재구성한 삽화",
                },
                content: [
                    {
                        type: "paragraph",
                        text: "원효를 찾던 관리들은 다리 가까이에서 그를 발견했다.",
                    },
                    {
                        type: "paragraph",
                        text: "그때 원효는 갑자기 발을 헛디딘 듯 물속으로 떨어졌다. 『삼국유사』는 그가 일부러 물에 빠져 옷을 적셨다고 기록한다.",
                    },
                    {
                        type: "paragraph",
                        text: "물에서 나온 원효의 장삼에서는 물이 뚝뚝 떨어졌다. 관리들은 젖은 옷차림으로 길을 계속 가게 할 수 없다며 그를 가까운 요석궁으로 안내했다.",
                    },
                    {
                        type: "dialogue",
                        text: "“궁에 드셔서 옷을 말리고 쉬었다 가십시오.”",
                    },
                    {
                        type: "paragraph",
                        text: "원효는 별다른 말 없이 그들을 따라갔다.",
                    },
                    {
                        type: "paragraph",
                        text: "거리에서 시작된 수수께끼 같은 노래는 그렇게 요석궁으로 이어졌다.",
                    },
                ],
            },
            {
                number: "04",
                title: "요석궁의 만남",
                image: {
                    src: "/images/masters/wonhyo/episode-02-scene-04.webp",
                    alt: "요석궁 안에서 처음 마주한 원효와 요석공주",
                    caption:
                        "요석궁에 머물게 된 원효와 공주가 마주하는 장면을 재구성한 삽화",
                },
                content: [
                    {
                        type: "paragraph",
                        text: "요석궁 안에는 남편을 잃은 뒤 홀로 지내던 공주가 있었다.",
                    },
                    {
                        type: "paragraph",
                        text: "궁의 사람들은 원효의 젖은 옷을 받아 말리고 머물 자리를 마련했다. 원효는 그곳에서 요석공주와 마주했다.",
                    },
                    {
                        type: "paragraph",
                        text: "두 사람이 어떤 말을 나누었는지, 원효가 요석궁에 얼마나 오래 머물렀는지는 기록에 자세히 남아 있지 않다.",
                    },
                    {
                        type: "paragraph",
                        text: "다만 『삼국유사』는 원효가 요석궁에 머문 뒤 공주가 아이를 잉태했다고 전한다.",
                    },
                    {
                        type: "paragraph",
                        text: "후대에는 이 만남을 사랑 이야기로 그리기도 하고, 뛰어난 인물의 탄생을 설명하는 설화로 해석하기도 했다.",
                    },
                    {
                        type: "paragraph",
                        text: "기록이 말해주지 않는 두 사람의 마음은 알 수 없다. 분명한 것은 이 인연에서 훗날 신라의 학자로 이름을 남길 설총이 태어났다는 사실이다.",
                    },
                ],
            },
            {
                number: "05",
                title: "설총의 탄생",
                image: {
                    src: "/images/masters/wonhyo/episode-02-scene-05.webp",
                    alt: "어린 설총을 안고 있는 요석공주",
                    caption:
                        "요석공주가 설총을 낳아 기르는 모습을 재구성한 삽화",
                },
                content: [
                    {
                        type: "paragraph",
                        text: "얼마 뒤 요석공주는 아들을 낳았다.",
                    },
                    {
                        type: "paragraph",
                        text: "아이의 이름은 설총이었다. 『삼국유사』는 설총이 태어나면서부터 총명했고, 경서와 역사에 널리 통달했다고 전한다.",
                    },
                    {
                        type: "paragraph",
                        text: "설총은 훗날 신라를 대표하는 학자이자 문장가로 이름을 남겼다. 왕에게 바른 정치를 권하는 이야기를 전했고, 신라의 유학 발전에 중요한 인물로 평가받았다.",
                    },
                    {
                        type: "paragraph",
                        text: "사람들은 원효가 거리에서 부른 ‘하늘을 떠받칠 기둥’이라는 노래를 설총의 탄생과 연결해 기억했다.",
                    },
                    {
                        type: "paragraph",
                        text: "수수께끼처럼 들렸던 노래는 뛰어난 인물이 세상에 나올 것이라는 예고로 풀이되었다.",
                    },
                ],
            },
            {
                number: "06",
                title: "승려의 이름을 내려놓다",
                image: {
                    src: "/images/masters/wonhyo/episode-02-scene-06.webp",
                    alt: "승복 대신 소박한 옷차림으로 백성들 사이를 걷는 원효",
                    caption:
                        "요석궁의 인연 뒤 소성거사라 부르며 세속의 모습으로 살아간 원효를 재구성한 삽화",
                },
                content: [
                    {
                        type: "paragraph",
                        text: "설총을 낳은 뒤 원효의 삶은 이전과 달라졌다.",
                    },
                    {
                        type: "paragraph",
                        text: "『삼국유사』는 그가 계율을 어긴 뒤 세속의 옷으로 갈아입고 스스로를 소성거사라 불렀다고 전한다.",
                    },
                    {
                        type: "paragraph",
                        text: "원효는 승려의 격식과 높은 자리에 머물기보다 마을과 장터를 다니며 평범한 사람들에게 불법을 전했다.",
                    },
                    {
                        type: "paragraph",
                        text: "그의 선택을 단순히 한 번의 파계로만 볼 것인지, 기존의 신분과 형식을 벗어나 백성 속으로 들어간 전환으로 볼 것인지는 해석이 갈릴 수 있다.",
                    },
                    {
                        type: "paragraph",
                        text: "요석공주와의 인연은 설총의 탄생으로 이어졌고, 원효에게는 이전과 다른 삶의 문을 여는 사건으로 전해졌다.",
                    },
                    {
                        type: "paragraph",
                        text: "이후 원효는 노래하고 춤추며 수많은 마을을 다녔다. 그 이야기는 다음 일화인 무애행으로 이어진다.",
                    },
                ],
            },
        ],
        recordGuide: [
            "원효가 ‘자루 없는 도끼’를 구하는 노래를 불렀고, 왕이 그 뜻을 헤아려 원효를 요석궁으로 데려오게 했다는 이야기는 『삼국유사』 권4 「원효불기」에 전합니다.",
            "원효가 일부러 물에 빠져 옷을 적신 뒤 요석궁에 머물렀고, 요석공주가 설총을 낳았다는 내용도 같은 기록에 나옵니다.",
            "원효와 요석공주가 실제로 나눈 대화와 감정, 정확한 체류 기간은 기록에 남아 있지 않습니다. 삽화의 표정과 공간, 장면의 세부 정황은 이야기 전달을 위해 재구성했습니다.",
            "설총이 원효와 요석공주의 아들이며 통일신라의 학자이자 문장가로 활동했다는 사실은 역사 자료에서도 확인됩니다.",
            "요석궁의 인연 이후 원효가 소성거사라 부르며 무애행을 펼쳤다는 흐름은 『삼국유사』의 서술을 따르되, 그 의미에 대해서는 여러 해석이 가능합니다.",
        ],
    },


    {
        slug: "muaehaeng",
        masterSlug: "wonhyo",
        title: "원효, 노래와 춤으로 세상에 들어가다",
        summary:
            "소성거사라 불린 원효가 무애박을 두드리며 마을과 장터를 다니고, 어려운 가르침을 노래와 이야기로 풀어 백성들에게 전했다고 전하는 무애행 이야기입니다.",
        classification: "『삼국유사』에 전하는 일화",
        source: "『삼국유사』 권4 「원효불기」",
        coverImage: {
            src: "/images/masters/wonhyo/episode-03-scene-05.webp",
            alt: "무애박을 들고 마을 사람들과 함께 노래하는 원효",
        },
        scenes: [
            {
                number: "01",
                title: "장터에 울린 낯선 소리",
                image: {
                    src: "/images/masters/wonhyo/episode-03-scene-01.webp",
                    alt: "장터에서 무애박을 두드리며 노래하는 소성거사 원효",
                    caption:
                        "소성거사 원효가 무애박을 들고 장터에서 노래를 시작하는 모습을 재구성한 삽화",
                },
                content: [
                    {
                        type: "paragraph",
                        text: "햇볕이 장터의 흙길을 밝게 비추던 날이었다.",
                    },
                    {
                        type: "paragraph",
                        text: "사람들은 채소와 곡식을 펼쳐 놓고 값을 흥정했고, 아이들은 좌판 사이를 뛰어다녔다. 그때 해진 옷을 여러 번 덧댄 사내가 장터 한복판에 들어섰다.",
                    },
                    {
                        type: "paragraph",
                        text: "산발한 머리에 짧은 수염을 기른 그는 한 손에 둥근 박 모양의 도구를 들고 있었다. 사람들은 곧 그가 소성거사라 불리는 원효임을 알아보았다.",
                    },
                    {
                        type: "dialogue",
                        text: "“저분이 예전에 이름난 스님이었다는 원효 아닌가?”",
                    },
                    {
                        type: "dialogue",
                        text: "“스님이라기에는 차림이 너무 남루한데.”",
                    },
                    {
                        type: "paragraph",
                        text: "원효는 사람들의 수군거림을 들었지만 개의치 않았다. 그는 막대기로 박을 가볍게 두드렸다.",
                    },
                    {
                        type: "dialogue",
                        text: "“함께 부르면 길이 되고, 함께 웃으면 마음이 열리네.”",
                    },
                    {
                        type: "paragraph",
                        text: "둥글고 맑은 소리가 장터 안으로 퍼졌다.",
                    },
                ],
            },
            {
                number: "02",
                title: "아이들이 먼저 다가오다",
                image: {
                    src: "/images/masters/wonhyo/episode-03-scene-02.webp",
                    alt: "마을 아이들과 마주 앉아 무애의 뜻을 이야기하는 원효",
                    caption:
                        "아이들이 원효에게 무애의 뜻을 묻고 함께 이야기를 나누는 장면을 재구성한 삽화",
                },
                content: [
                    {
                        type: "paragraph",
                        text: "어른들이 멀찍이 바라보는 동안 아이들이 먼저 원효 곁으로 모여들었다.",
                    },
                    {
                        type: "dialogue",
                        text: "“거사님, 그 박은 무엇입니까?”",
                    },
                    {
                        type: "paragraph",
                        text: "원효는 아이들과 눈높이를 맞추려고 흙바닥에 주저앉았다.",
                    },
                    {
                        type: "dialogue",
                        text: "“이름은 무애라 한단다.”",
                    },
                    {
                        type: "dialogue",
                        text: "“무애가 무슨 뜻이에요?”",
                    },
                    {
                        type: "paragraph",
                        text: "원효는 박의 둥근 몸통을 손바닥으로 쓰다듬었다.",
                    },
                    {
                        type: "dialogue",
                        text: "“막히거나 걸리는 데가 없다는 뜻이지.”",
                    },
                    {
                        type: "dialogue",
                        text: "“그럼 어디든 갈 수 있다는 말이에요?”",
                    },
                    {
                        type: "dialogue",
                        text: "“발로 가는 길도 그렇고, 마음이 가는 길도 그렇단다.”",
                    },
                    {
                        type: "paragraph",
                        text: "아이 하나가 박을 두드리는 흉내를 내자 원효가 웃었다.",
                    },
                    {
                        type: "dialogue",
                        text: "“마음이 자유로우면 높은 사람도 낮은 사람도 함께 웃을 수 있지.”",
                    },
                ],
            },
            {
                number: "03",
                title: "장사꾼과 나눈 이야기",
                image: {
                    src: "/images/masters/wonhyo/episode-03-scene-03.webp",
                    alt: "채소 장수와 이야기를 나누는 원효와 곁에서 듣는 아이",
                    caption:
                        "장터의 상인이 원효에게 수행과 삶에 관해 묻는 장면을 재구성한 삽화",
                },
                content: [
                    {
                        type: "paragraph",
                        text: "아이들의 웃음소리를 듣고 채소를 팔던 장사꾼도 고개를 들었다.",
                    },
                    {
                        type: "dialogue",
                        text: "“거사님, 노래하고 춤추는 것도 수행이라 할 수 있습니까?”",
                    },
                    {
                        type: "paragraph",
                        text: "원효가 장사꾼의 좌판 앞에 섰다.",
                    },
                    {
                        type: "dialogue",
                        text: "“손님을 속이지 않고 좋은 것을 내어주는 일도 수행이 될 수 있지요.”",
                    },
                    {
                        type: "dialogue",
                        text: "“저는 장사만 할 뿐인데요.”",
                    },
                    {
                        type: "dialogue",
                        text: "“장사할 때의 마음을 살피는 것이 먼저입니다. 저울을 속이지 않는 마음도 경전을 읽는 마음과 다르지 않지요.”",
                    },
                    {
                        type: "paragraph",
                        text: "장사꾼은 손에 들고 있던 무를 내려다보며 잠시 생각했다.",
                    },
                    {
                        type: "dialogue",
                        text: "“절에 가지 못해도 부처님의 가르침을 따를 수 있다는 말씀입니까?”",
                    },
                    {
                        type: "dialogue",
                        text: "“마음을 바르게 쓰는 자리가 곧 배움의 자리입니다.”",
                    },
                    {
                        type: "paragraph",
                        text: "곁에서 듣던 아이가 고개를 끄덕이자 장사꾼도 환하게 웃었다.",
                    },
                ],
            },
            {
                number: "04",
                title: "할머니의 걱정",
                image: {
                    src: "/images/masters/wonhyo/episode-03-scene-04.webp",
                    alt: "장터에 앉은 할머니의 걱정을 들어주는 원효",
                    caption:
                        "글을 모르는 노인이 가르침을 이해할 수 있는지 묻는 장면을 재구성한 삽화",
                },
                content: [
                    {
                        type: "paragraph",
                        text: "장터 한쪽에서 나물을 팔던 할머니가 원효를 불렀다.",
                    },
                    {
                        type: "dialogue",
                        text: "“거사님, 나는 글을 한 자도 모르오.”",
                    },
                    {
                        type: "paragraph",
                        text: "원효는 박을 내려놓고 할머니 곁에 앉았다.",
                    },
                    {
                        type: "dialogue",
                        text: "“글을 모르면 부처님의 말씀도 알 수 없는 것 아니오?”",
                    },
                    {
                        type: "paragraph",
                        text: "원효는 나물이 담긴 바구니를 바라보았다.",
                    },
                    {
                        type: "dialogue",
                        text: "“이 나물은 누구에게 주려고 뜯으셨습니까?”",
                    },
                    {
                        type: "dialogue",
                        text: "“먹을 사람이 먹으라고 가져왔지.”",
                    },
                    {
                        type: "dialogue",
                        text: "“상한 것은 골라내고 좋은 것만 담으셨겠지요?”",
                    },
                    {
                        type: "dialogue",
                        text: "“그야 당연하지.”",
                    },
                    {
                        type: "paragraph",
                        text: "원효가 미소 지었다.",
                    },
                    {
                        type: "dialogue",
                        text: "“남을 헤아리는 그 마음을 이미 알고 계십니다. 글보다 마음이 먼저입니다.”",
                    },
                    {
                        type: "paragraph",
                        text: "할머니는 한동안 원효의 손을 꼭 잡고 놓지 않았다.",
                    },
                ],
            },
            {
                number: "05",
                title: "함께 부르는 무애가",
                image: {
                    src: "/images/masters/wonhyo/episode-03-scene-05.webp",
                    alt: "무애박을 높이 들고 마을 사람들과 노래하고 춤추는 원효",
                    caption:
                        "원효와 남녀노소가 함께 무애가를 부르며 어울리는 모습을 재구성한 삽화",
                },
                content: [
                    {
                        type: "paragraph",
                        text: "원효가 다시 무애박을 들었다.",
                    },
                    {
                        type: "dialogue",
                        text: "“이번에는 나 혼자 부르지 않겠습니다.”",
                    },
                    {
                        type: "dialogue",
                        text: "“우리가 따라 부를 수 있겠소?”",
                    },
                    {
                        type: "dialogue",
                        text: "“노래는 잘 부르는 사람이 아니라 함께 부르는 사람이 주인이지요.”",
                    },
                    {
                        type: "paragraph",
                        text: "원효가 박을 두드리며 짧고 쉬운 가락을 시작했다. 아이들이 먼저 따라 했고, 장사꾼과 할머니도 손뼉을 쳤다.",
                    },
                    {
                        type: "dialogue",
                        text: "“막힘 없이 함께 가세, 미움 없이 함께 웃세.”",
                    },
                    {
                        type: "paragraph",
                        text: "조금 전까지 물건값을 두고 다투던 사람들도 하나둘 웃으며 노래에 섞였다.",
                    },
                    {
                        type: "dialogue",
                        text: "“거사님, 한 번 더 합시다!”",
                    },
                    {
                        type: "dialogue",
                        text: "“좋습니다. 이번에는 더 크게!”",
                    },
                    {
                        type: "paragraph",
                        text: "장터에는 경전의 어려운 말 대신 웃음과 박수, 단순한 노랫가락이 가득했다.",
                    },
                ],
            },
            {
                number: "06",
                title: "다시 길 위로",
                image: {
                    src: "/images/masters/wonhyo/episode-03-scene-06.webp",
                    alt: "무애박을 들고 마을을 떠나는 원효에게 손을 흔드는 사람들",
                    caption:
                        "마을 사람들의 배웅을 받으며 다음 길로 떠나는 원효를 재구성한 삽화",
                },
                content: [
                    {
                        type: "paragraph",
                        text: "해가 기울자 원효는 무애박을 등에 걸고 길을 나설 채비를 했다.",
                    },
                    {
                        type: "dialogue",
                        text: "“거사님, 오늘은 여기서 쉬어 가십시오.”",
                    },
                    {
                        type: "paragraph",
                        text: "장사꾼이 붙잡았지만 원효는 고개를 저었다.",
                    },
                    {
                        type: "dialogue",
                        text: "“다른 마을에도 노래를 기다리는 사람이 있을지 모르지요.”",
                    },
                    {
                        type: "dialogue",
                        text: "“언제 다시 오십니까?”",
                    },
                    {
                        type: "paragraph",
                        text: "아이들이 길가까지 따라 나와 물었다.",
                    },
                    {
                        type: "dialogue",
                        text: "“마음이 막힐 때 오늘 부른 노래를 떠올리거라.”",
                    },
                    {
                        type: "dialogue",
                        text: "“그러면 거사님이 계신 것과 같습니까?”",
                    },
                    {
                        type: "paragraph",
                        text: "원효가 뒤를 돌아보며 웃었다.",
                    },
                    {
                        type: "dialogue",
                        text: "“함께 웃고 서로를 헤아리는 곳이라면, 나는 거기 있는 셈이지.”",
                    },
                    {
                        type: "paragraph",
                        text: "사람들은 오래도록 손을 흔들었다. 원효는 해진 옷자락을 바람에 날리며 다음 마을로 걸어갔다.",
                    },
                ],
            },
        ],
        recordGuide: [
            "『삼국유사』 권4 「원효불기」는 원효가 무애라 불리는 도구를 만들어 노래하고 춤추며 여러 마을을 다녔다고 전합니다.",
            "같은 기록은 원효의 무애행을 통해 가난하고 무지한 사람들까지 부처의 이름을 알고 염불하게 되었다고 설명합니다.",
            "무애박의 정확한 형태와 연주 방식은 기록만으로 확정하기 어려우므로, 삽화에서는 후대에 널리 알려진 박 모양의 도구로 재구성했습니다.",
            "장터의 장사꾼과 할머니, 아이들의 질문과 원효의 대화는 무애행의 의미를 쉽게 전달하기 위해 재구성한 내용입니다.",
            "원효의 남루한 옷차림과 산발한 머리, 짧은 수염은 소성거사로 활동한 모습을 시각적으로 구분하기 위한 삽화적 표현입니다.",
        ],
    },
];

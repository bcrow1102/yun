import {
    getTempleBySlug,
    type Temple,
    type TempleSlug,
} from "../guide/temples";

const TEMPLE_STAY_OPERATOR_SOURCE =
    "한국불교문화사업단 템플스테이 공식 사이트 운영사찰 목록";
const TEMPLE_STAY_OPERATOR_CHECKED_AT = "2026-08-20";

type TempleStayOperatorBase = {
    officialId: string;
    officialName: string;
    address: string;
    sido: string;
    sigungu: string;
    phone: string;
    officialUrl: string;
};

type TempleStayOperatorIdentity =
    | {
        operatorType: "temple";
        operatorTempleSlug: TempleSlug;
    }
    | {
        operatorType: "institution";
        operatorTempleSlug?: never;
    };

type TempleStayOperatorRecord =
    TempleStayOperatorBase & TempleStayOperatorIdentity;

export type TempleStayOperator = TempleStayOperatorRecord & {
    source: typeof TEMPLE_STAY_OPERATOR_SOURCE;
    checkedAt: typeof TEMPLE_STAY_OPERATOR_CHECKED_AT;
};

const templeStayOperatorRecords = [
    {
        "officialId":  "Gamsansa",
        "officialName":  "감산사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0874",
        "address":  "경상북도 경주시 외동읍 앞등길 117-20",
        "sido":  "경북",
        "sigungu":  "경주시",
        "phone":  "010-3562-7096",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Gamsansa"
    },
    {
        "officialId":  "Gapsa",
        "officialName":  "갑사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0400",
        "address":  "충청남도 공주시 계룡면 갑사로 567-3",
        "sido":  "충남",
        "sigungu":  "공주시",
        "phone":  "041-857-8921",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Gapsa"
    },
    {
        "officialId":  "Gaeamsa",
        "officialName":  "개암사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0525",
        "address":  "전라북도 부안군 상서면 개암로 248",
        "sido":  "전북",
        "sigungu":  "부안군",
        "phone":  "063-581-0080",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Gaeamsa"
    },
    {
        "officialId":  "Gunbongsa",
        "officialName":  "건봉사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0273",
        "address":  "강원특별자치도 고성군 거진읍 건봉사로 723",
        "sido":  "강원",
        "sigungu":  "고성군",
        "phone":  "033-682-8103",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Gunbongsa"
    },
    {
        "officialId":  "Kyungguksa",
        "officialName":  "경국사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0042",
        "address":  "서울특별시 성북구 보국문로 113-10",
        "sido":  "서울",
        "sigungu":  "성북구",
        "phone":  "02-914-2828",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Kyungguksa"
    },
    {
        "officialId":  "Gounsa",
        "officialName":  "고운사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0832",
        "address":  "경상북도 의성군 단촌면 고운사길 415",
        "sido":  "경북",
        "sigungu":  "의성군",
        "phone":  "054-833-6934",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Gounsa"
    },
    {
        "officialId":  "Golgulsa",
        "officialName":  "골굴사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0705",
        "address":  "경상북도 경주시 문무대왕면 기림로 101-5",
        "sido":  "경북",
        "sigungu":  "경주시",
        "phone":  "054-775-1689 / 054-744-1689",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Golgulsa"
    },
    {
        "officialId":  "Gwanmunsa",
        "officialName":  "관문사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "gwanmunsa",
        "address":  "서울특별시 서초구 바우뫼로7길 111",
        "sido":  "서울",
        "sigungu":  "서초구",
        "phone":  "02-3460-5319",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Gwanmunsa"
    },
    {
        "officialId":  "Gwaneumsa_jj",
        "officialName":  "관음사(제주)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0982",
        "address":  "제주특별자치도 제주시 산록북로 660",
        "sido":  "제주",
        "sigungu":  "제주시",
        "phone":  "010-5219-8561",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Gwaneumsa_jj"
    },
    {
        "officialId":  "gwangjesa",
        "officialName":  "광제사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "gwangjesa",
        "address":  "세종특별자치시 모롱지로 94",
        "sido":  "세종",
        "sigungu":  "세종시",
        "phone":  "010-8540-3190",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=gwangjesa"
    },
    {
        "officialId":  "Guryongsa",
        "officialName":  "구룡사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0293",
        "address":  "강원특별자치도 원주시 소초면 구룡사로 500",
        "sido":  "강원",
        "sigungu":  "원주시",
        "phone":  "033-731-0503",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Guryongsa"
    },
    {
        "officialId":  "Guinsa",
        "officialName":  "구인사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0397",
        "address":  "충청북도 단양군 영춘면 구인사길 73",
        "sido":  "충북",
        "sigungu":  "단양군",
        "phone":  "043-420-7397(템플 사무실)",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Guinsa"
    },
    {
        "officialId":  "InternationalSeonCenter",
        "officialName":  "국제선센터",
        "operatorType":  "temple",
        "operatorTempleSlug":  "gukje-seon-center",
        "address":  "서울특별시 양천구 목동동로 167",
        "sido":  "서울",
        "sigungu":  "양천구",
        "phone":  "010-6728-2242",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=InternationalSeonCenter"
    },
    {
        "officialId":  "Gwijeongsa",
        "officialName":  "귀정사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0507",
        "address":  "전북특별자치도 남원시 산동면 대상2길 246",
        "sido":  "전북",
        "sigungu":  "남원시",
        "phone":  "063-626-0106",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Gwijeongsa"
    },
    {
        "officialId":  "Kumkangjeongsa",
        "officialName":  "금강정사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "geumgangjeongsa",
        "address":  "경기도 광명시 설월로 58",
        "sido":  "경기",
        "sigungu":  "광명시",
        "phone":  "02-898-8200",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Kumkangjeongsa"
    },
    {
        "officialId":  "Geumdangsa",
        "officialName":  "금당사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0587",
        "address":  "전라북도 진안군 마령면 마이산남로 217",
        "sido":  "전북",
        "sigungu":  "진안군",
        "phone":  "063)432-0102 (H.P)010-5644-4322",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Geumdangsa"
    },
    {
        "officialId":  "Kumyongsa",
        "officialName":  "금룡사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "geumnyongsa",
        "address":  "제주특별자치도 제주시 구좌읍 김녕로 148-11",
        "sido":  "제주",
        "sigungu":  "제주시",
        "phone":  "064-783-3663",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Kumyongsa"
    },
    {
        "officialId":  "Geumsansa",
        "officialName":  "금산사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0491",
        "address":  "전라북도 김제시 금산면 모악15길 1",
        "sido":  "전북",
        "sigungu":  "김제시",
        "phone":  "010-8690-3308",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Geumsansa"
    },
    {
        "officialId":  "Geumsunsa",
        "officialName":  "금선사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "geumseonsa",
        "address":  "서울특별시 종로구 비봉길 137",
        "sido":  "서울",
        "sigungu":  "종로구",
        "phone":  "02-395-9955",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Geumsunsa"
    },
    {
        "officialId":  "geumsuam",
        "officialName":  "금수암",
        "operatorType":  "temple",
        "operatorTempleSlug":  "geumsuam",
        "address":  "경상남도 산청군 금서면 새터길 57-98",
        "sido":  "경남",
        "sigungu":  "산청군",
        "phone":  "010-3898-8838",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=geumsuam"
    },
    {
        "officialId":  "Kirimsa",
        "officialName":  "기림사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0707",
        "address":  "경상북도 경주시 양북면 기림로 437-17",
        "sido":  "경북",
        "sigungu":  "경주시",
        "phone":  "054-746-3069 / 054-744-2292",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Kirimsa"
    },
    {
        "officialId":  "Kilsangsa",
        "officialName":  "길상사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "gilsangsa",
        "address":  "서울특별시 성북구 선잠로5길 68",
        "sido":  "서울",
        "sigungu":  "성북구",
        "phone":  "02-3672-5945 / 010-9677-5945",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Kilsangsa"
    },
    {
        "officialId":  "Naksansa",
        "officialName":  "낙산사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0286",
        "address":  "강원특별자치도 양양군 강현면 낙산사로 100",
        "sido":  "강원",
        "sigungu":  "양양군",
        "phone":  "033-672-2417",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Naksansa"
    },
    {
        "officialId":  "Naesosa",
        "officialName":  "내소사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0527",
        "address":  "전라북도 부안군 진서면 내소사로 243 내소사 템플사무국",
        "sido":  "전북",
        "sigungu":  "부안군",
        "phone":  "010-4082-7282",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Naesosa"
    },
    {
        "officialId":  "Naewonjungsa",
        "officialName":  "내원정사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0086",
        "address":  "부산광역시 서구 엄광산로40번길 80",
        "sido":  "부산",
        "sigungu":  "서구",
        "phone":  "051-254-3503 / 010-2880-3503",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Naewonjungsa"
    },
    {
        "officialId":  "Neunggasa",
        "officialName":  "능가사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0604",
        "address":  "전라남도 고흥군 점암면 팔봉길 21",
        "sido":  "전남",
        "sigungu":  "고흥군",
        "phone":  "010-9195-8091",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Neunggasa"
    },
    {
        "officialId":  "Daegwangsa_sn",
        "officialName":  "대광사(성남)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "daegwangsa-seongnam",
        "address":  "경기도 성남시 분당구 구미로185번길 30",
        "sido":  "경기",
        "sigungu":  "성남시",
        "phone":  "031-715-3000",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Daegwangsa_sn"
    },
    {
        "officialId":  "Daegwangsa_cw",
        "officialName":  "대광사(창원)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "daegwangsa-changwon",
        "address":  "경상남도 창원시 진해구 진해대로 303",
        "sido":  "경남",
        "sigungu":  "창원시",
        "phone":  "055-545-9595",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Daegwangsa_cw"
    },
    {
        "officialId":  "Daeseungsa",
        "officialName":  "대승사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0753",
        "address":  "경상북도 문경시 산북면 대승사길 283",
        "sido":  "경북",
        "sigungu":  "문경시",
        "phone":  "010-7704-4334",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Daeseungsa"
    },
    {
        "officialId":  "Daewonsa_gp",
        "officialName":  "대원사(가평)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0161",
        "address":  "경기도 가평군 북면 백둔로 21-162",
        "sido":  "경기",
        "sigungu":  "가평군",
        "phone":  "010-5073-0477",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Daewonsa_gp"
    },
    {
        "officialId":  "Daewonsa_bs",
        "officialName":  "대원사(보성)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0641",
        "address":  "전라남도 보성군 문덕면 죽산길 506-8",
        "sido":  "전남",
        "sigungu":  "보성군",
        "phone":  "061-853-1755",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Daewonsa_bs"
    },
    {
        "officialId":  "Daewonsa_sc",
        "officialName":  "대원사(산청)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0920",
        "address":  "경상남도 산청군 삼장면 대원사길 455",
        "sido":  "경남",
        "sigungu":  "산청군",
        "phone":  "010-4919-2446",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Daewonsa_sc"
    },
    {
        "officialId":  "Daeheungsa",
        "officialName":  "대흥사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0678",
        "address":  "전라남도 해남군 삼산면 대흥사길 400",
        "sido":  "전남",
        "sigungu":  "해남군",
        "phone":  "061-535-5775",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Daeheungsa"
    },
    {
        "officialId":  "Dogapsa",
        "officialName":  "도갑사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0663",
        "address":  "전라남도 영암군 군서면 도갑사로 306",
        "sido":  "전남",
        "sigungu":  "영암군",
        "phone":  "010.7423.5122",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Dogapsa"
    },
    {
        "officialId":  "Dorisa",
        "officialName":  "도리사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0725",
        "address":  "경상북도 구미시 해평면 도리사로 526",
        "sido":  "경북",
        "sigungu":  "구미시",
        "phone":  "010-6439-3747",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Dorisa"
    },
    {
        "officialId":  "Dorimsa",
        "officialName":  "도림사(곡성)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0607",
        "address":  "전라남도 곡성군 도림로 175",
        "sido":  "전남",
        "sigungu":  "곡성군",
        "phone":  "010-5427-3500",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Dorimsa"
    },
    {
        "officialId":  "dorimsa_dg",
        "officialName":  "도림사(대구)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "dorimsa-daegu",
        "address":  "대구광역시 동구 인산로 242",
        "sido":  "대구",
        "sigungu":  "동구",
        "phone":  "010 - 9256 - 7276",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=dorimsa_dg"
    },
    {
        "officialId":  "doseonsa",
        "officialName":  "도선사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0005",
        "address":  "서울시 강북구 도선사길278",
        "sido":  "서울",
        "sigungu":  "강북구",
        "phone":  "010-3157-3161",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=doseonsa"
    },
    {
        "officialId":  "Donghwasa",
        "officialName":  "동화사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0113",
        "address":  "대구광역시 동구 동화사1길 1 동화사 템플스테이",
        "sido":  "대구",
        "sigungu":  "동구",
        "phone":  "010-3534-8079 (업무시간: 09:00~17:00)",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Donghwasa"
    },
    {
        "officialId":  "Magoksa",
        "officialName":  "마곡사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0403",
        "address":  "충청남도 공주시 사곡면 마곡사로 966",
        "sido":  "충남",
        "sigungu":  "공주시",
        "phone":  "041-841-6226/010-7110-6226",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Magoksa"
    },
    {
        "officialId":  "Manggyeongsansa",
        "officialName":  "망경산사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "manggyeongsansa",
        "address":  "강원특별자치도 영월군 망경대산길 135-6",
        "sido":  "강원",
        "sigungu":  "영월군",
        "phone":  "033-374-8007",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Manggyeongsansa"
    },
    {
        "officialId":  "Myeongjoosa",
        "officialName":  "명주사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "myeongjusa-wonju",
        "address":  "강원특별자치도 원주시 신림면 물안길 62",
        "sido":  "강원",
        "sigungu":  "원주시",
        "phone":  "033-761-7885",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Myeongjoosa"
    },
    {
        "officialId":  "Myogaksa",
        "officialName":  "묘각사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0056",
        "address":  "서울특별시 종로구 종로63가길 31",
        "sido":  "서울",
        "sigungu":  "종로구",
        "phone":  "02-763-3109",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Myogaksa"
    },
    {
        "officialId":  "Myojeoksa",
        "officialName":  "묘적사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0188",
        "address":  "경기도 남양주시 와부읍 수레로661번길 174",
        "sido":  "경기",
        "sigungu":  "남양주시",
        "phone":  "(8am~5pm) 010-8161-1761",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Myojeoksa"
    },
    {
        "officialId":  "Mugaksa",
        "officialName":  "무각사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "mugaksa",
        "address":  "광주광역시 서구 운천로 230",
        "sido":  "광주",
        "sigungu":  "서구",
        "phone":  "062-383-0107",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Mugaksa"
    },
    {
        "officialId":  "Muryangsa",
        "officialName":  "무량사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0428",
        "address":  "충청남도 부여군 외산면 무량로 203",
        "sido":  "충남",
        "sigungu":  "부여군",
        "phone":  "041-836-5099",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Muryangsa"
    },
    {
        "officialId":  "Muwisa",
        "officialName":  "무위사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0599",
        "address":  "전라남도 강진군 성전면 무위사로 308(무위사)",
        "sido":  "전남",
        "sigungu":  "강진군",
        "phone":  "010-2533-4974",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Muwisa"
    },
    {
        "officialId":  "Munsuam",
        "officialName":  "문수암",
        "operatorType":  "temple",
        "operatorTempleSlug":  "munsuam-sancheong",
        "address":  "경상남도 산청군 시천면 마근담길 173-17",
        "sido":  "경남",
        "sigungu":  "산청군",
        "phone":  "055-973-5820",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Munsuam"
    },
    {
        "officialId":  "Daeheungsa_mi",
        "officialName":  "미륵대흥사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0398",
        "address":  "충청북도 단양군 대강면 황정산로423",
        "sido":  "충북",
        "sigungu":  "단양군",
        "phone":  "010-9773-9108",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Daeheungsa_mi"
    },
    {
        "officialId":  "mireuksa",
        "officialName":  "미륵사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0629",
        "address":  "전라남도 나주시 봉황면 세남로 408-64",
        "sido":  "전남",
        "sigungu":  "나주시",
        "phone":  "010-7192-1235",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=mireuksa"
    },
    {
        "officialId":  "mitasa",
        "officialName":  "미타사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0392",
        "address":  "충북 음성군 소이면 소이로 61번길 164",
        "sido":  "충북",
        "sigungu":  "음성군",
        "phone":  "043-873-0330",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=mitasa"
    },
    {
        "officialId":  "Mihwangsa",
        "officialName":  "미황사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0679",
        "address":  "전라남도 해남군 송지면 미황사길 164",
        "sido":  "전남",
        "sigungu":  "해남군",
        "phone":  "061-533-3521",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Mihwangsa"
    },
    {
        "officialId":  "Banyasa",
        "officialName":  "반야사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0374",
        "address":  "충청북도 영동군 황간면 백화산로 652",
        "sido":  "충북",
        "sigungu":  "영동군",
        "phone":  "010-5330-7722, 043-742-7722",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Banyasa"
    },
    {
        "officialId":  "SeoraksanBaekdamsa",
        "officialName":  "백담사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "baekdamsa",
        "address":  "강원특별자치도 인제군 북면 백담로 746",
        "sido":  "강원",
        "sigungu":  "인제군",
        "phone":  "033-462-5565",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=SeoraksanBaekdamsa"
    },
    {
        "officialId":  "Baekryunsa_ga",
        "officialName":  "백련사(가평)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "baengnyeonsa-gapyeong",
        "address":  "경기도 가평군 상면 샘골길 159-50",
        "sido":  "경기",
        "sigungu":  "가평군",
        "phone":  "010-3081-0208",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Baekryunsa_ga"
    },
    {
        "officialId":  "Baekryunsa_kang",
        "officialName":  "백련사(강진)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0598",
        "address":  "전라남도 강진군 도암면 백련사길 145",
        "sido":  "전남",
        "sigungu":  "강진군",
        "phone":  "061-434-0837",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Baekryunsa_kang"
    },
    {
        "officialId":  "Baekyangsa",
        "officialName":  "백양사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0667",
        "address":  "전라남도 장성군 북하면 백양로 1239",
        "sido":  "전남",
        "sigungu":  "장성군",
        "phone":  "061-392-0434",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Baekyangsa"
    },
    {
        "officialId":  "Baekjesa",
        "officialName":  "백제사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "baekjesa",
        "address":  "제주특별자치도 제주시 애월읍 광령남6길 54",
        "sido":  "제주",
        "sigungu":  "제주시",
        "phone":  "064-746-8009",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Baekjesa"
    },
    {
        "officialId":  "Beomeosa",
        "officialName":  "범어사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0066",
        "address":  "주소 부산 금정구 상마1길 20 범어사 선문화교육관",
        "sido":  "부산",
        "sigungu":  "금정구",
        "phone":  "051-508-5726",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Beomeosa"
    },
    {
        "officialId":  "Beomnyunsa",
        "officialName":  "법륜사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0232",
        "address":  "경기도 용인시 처인구 원삼면 농촌파크로 126",
        "sido":  "경기",
        "sigungu":  "용인시",
        "phone":  "010-6766-8700",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Beomnyunsa"
    },
    {
        "officialId":  "Beopjusa",
        "officialName":  "법주사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "beopjusa-boeun",
        "address":  "충청북도 보은군 속리산면 법주사로 405",
        "sido":  "충북",
        "sigungu":  "보은군",
        "phone":  "010-9528-5655",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Beopjusa"
    },
    {
        "officialId":  "BOGYEONGSA",
        "officialName":  "보경사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0869",
        "address":  "경상북도 포항시 북구 송라면 보경로 523",
        "sido":  "경북",
        "sigungu":  "포항시",
        "phone":  "010-5213-5354",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=BOGYEONGSA"
    },
    {
        "officialId":  "bokwangsa",
        "officialName":  "보광사(파주)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0247",
        "address":  "경기도 파주시 광탄면 보광로474번길 87",
        "sido":  "경기",
        "sigungu":  "파주시",
        "phone":  "010-2779-0215",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=bokwangsa"
    },
    {
        "officialId":  "bdg1133",
        "officialName":  "보덕관음사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "bodeokgwaneumsa",
        "address":  "경기도 용인시 처인구 운학로 187",
        "sido":  "경기",
        "sigungu":  "용인시",
        "phone":  "010-4345-6612",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=bdg1133"
    },
    {
        "officialId":  "borimsa1",
        "officialName":  "보림사(장흥)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0669",
        "address":  "전남 장흥군 유치면 보림사로 224",
        "sido":  "전남",
        "sigungu":  "장흥군",
        "phone":  "061-864-2055",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=borimsa1"
    },
    {
        "officialId":  "Bohyunsa",
        "officialName":  "보현사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0270",
        "address":  "강원특별자치도 강릉시 성산면 보현길 396",
        "sido":  "강원",
        "sigungu":  "강릉시",
        "phone":  "033-647-9455",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Bohyunsa"
    },
    {
        "officialId":  "Bongnyeongsa",
        "officialName":  "봉녕사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0201",
        "address":  "경기도 수원시 팔달구 창룡대로 236-54",
        "sido":  "경기",
        "sigungu":  "수원시",
        "phone":  "010-2643-3399",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Bongnyeongsa"
    },
    {
        "officialId":  "Bongsunsa",
        "officialName":  "봉선사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0190",
        "address":  "경기도 남양주시 진접읍 봉선사길 32",
        "sido":  "경기",
        "sigungu":  "남양주시",
        "phone":  "010-5262-9969",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Bongsunsa"
    },
    {
        "officialId":  "Bongeunsa",
        "officialName":  "봉은사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "bongeunsa",
        "address":  "서울특별시 강남구 봉은사로 531",
        "sido":  "서울",
        "sigungu":  "강남구",
        "phone":  "02-3218-4846",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Bongeunsa"
    },
    {
        "officialId":  "Bonginsa",
        "officialName":  "봉인사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "bonginsa",
        "address":  "경기도 남양주시 진건읍 사릉로156번길 295",
        "sido":  "경기",
        "sigungu":  "남양주시",
        "phone":  "031-528-5585",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Bonginsa"
    },
    {
        "officialId":  "Bongjeongsa",
        "officialName":  "봉정사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0789",
        "address":  "경상북도 안동시 서후면 봉정사길 222",
        "sido":  "경북",
        "sigungu":  "안동시",
        "phone":  "010-2578-4183",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Bongjeongsa"
    },
    {
        "officialId":  "Busuksa",
        "officialName":  "부석사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0435",
        "address":  "충청남도 서산시 부석면 부석사길 243",
        "sido":  "충남",
        "sigungu":  "서산시",
        "phone":  "041-662-3824",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Busuksa"
    },
    {
        "officialId":  "Bulgapsa",
        "officialName":  "불갑사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0662",
        "address":  "전라남도 영광군 불갑면 불갑사로 450",
        "sido":  "전남",
        "sigungu":  "영광군",
        "phone":  "010-8631-1080",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Bulgapsa"
    },
    {
        "officialId":  "Bulguksa",
        "officialName":  "불국사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "bulguksa",
        "address":  "경상북도 경주시 불국로 385",
        "sido":  "경북",
        "sigungu":  "경주시",
        "phone":  "054-746-0983 (for Koreans)",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Bulguksa"
    },
    {
        "officialId":  "Bulhoesa",
        "officialName":  "불회사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0624",
        "address":  "전라남도 나주시 다도로 1224-142",
        "sido":  "전남",
        "sigungu":  "나주시",
        "phone":  "061-337-3440",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Bulhoesa"
    },
    {
        "officialId":  "budda",
        "officialName":  "붓다선원",
        "operatorType":  "temple",
        "operatorTempleSlug":  "buddaseonwon",
        "address":  "경상남도 거창군 웅양면 개화길 397-115",
        "sido":  "경남",
        "sigungu":  "거창군",
        "phone":  "010-2204-3722",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=budda"
    },
    {
        "officialId":  "Sanasa",
        "officialName":  "사나사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0221",
        "address":  "경기도 양평군 옥천면 사나사길 329",
        "sido":  "경기",
        "sigungu":  "양평군",
        "phone":  "010-5186-5182",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Sanasa"
    },
    {
        "officialId":  "saseongam",
        "officialName":  "사성암",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0618",
        "address":  "전라남도 구례군 문척면 사성암길303",
        "sido":  "전남",
        "sigungu":  "구례군",
        "phone":  "010-4014-4544",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=saseongam"
    },
    {
        "officialId":  "Samwoonsa",
        "officialName":  "삼운사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "samunsa",
        "address":  "강원특별자치도 춘천시 후석로441번길 12",
        "sido":  "강원",
        "sigungu":  "춘천시",
        "phone":  "033-253-6542",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Samwoonsa"
    },
    {
        "officialId":  "Samhwasa",
        "officialName":  "삼화사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0275",
        "address":  "강원특별자치도 동해시 삼화로 584",
        "sido":  "강원",
        "sigungu":  "동해시",
        "phone":  "010-4219-8822 (상담 AM 9시~PM 5시)",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Samhwasa"
    },
    {
        "officialId":  "Seogosa",
        "officialName":  "서고사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0565",
        "address":  "전라북도 전주시 정여립로 1010-90",
        "sido":  "전북",
        "sigungu":  "전주시",
        "phone":  "010-2716-7707",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Seogosa"
    },
    {
        "officialId":  "Seogwangsa",
        "officialName":  "서광사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0436",
        "address":  "충청남도 서산시 부춘산1로 44",
        "sido":  "충남",
        "sigungu":  "서산시",
        "phone":  "041-664-2002",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Seogwangsa"
    },
    {
        "officialId":  "Seokbulsa",
        "officialName":  "석불사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "seokbulsa-mapo",
        "address":  "서울특별시 마포구 마포대로4다길 23-6",
        "sido":  "서울",
        "sigungu":  "마포구",
        "phone":  "02-712-1765",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Seokbulsa"
    },
    {
        "officialId":  "Seokwangsa",
        "officialName":  "석왕사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0264",
        "address":  "경기도 부천시 원미구 소사로 367",
        "sido":  "경기",
        "sigungu":  "부천시",
        "phone":  "032-663-7771~5",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Seokwangsa"
    },
    {
        "officialId":  "Seokjongsa",
        "officialName":  "석종사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0335",
        "address":  "충청북도 충주시 직동길 271-56",
        "sido":  "충북",
        "sigungu":  "충주시",
        "phone":  "010-3625-4505",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Seokjongsa"
    },
    {
        "officialId":  "Seonbonsa",
        "officialName":  "선본사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0699",
        "address":  "경상북도 경산시 갓바위로 699",
        "sido":  "경북",
        "sigungu":  "경산시",
        "phone":  "010-2631-1868",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Seonbonsa"
    },
    {
        "officialId":  "Sunamsa",
        "officialName":  "선암사(부산)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0095",
        "address":  "부산광역시 부산진구 백양산로 138",
        "sido":  "부산",
        "sigungu":  "부산진구",
        "phone":  "051-805-7573",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Sunamsa"
    },
    {
        "officialId":  "Seonamsa",
        "officialName":  "선암사(순천)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0650",
        "address":  "전라남도 순천시 승주읍 선암사길 450",
        "sido":  "전남",
        "sigungu":  "순천시",
        "phone":  "061-754-6250",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Seonamsa"
    },
    {
        "officialId":  "Seonunsa",
        "officialName":  "선운사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0480",
        "address":  "전북특별자치도 고창군 아산면 선운사로 250",
        "sido":  "전북",
        "sigungu":  "고창군",
        "phone":  "내국인:010-5231-1375/ 외국인:010-5166-1375",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Seonunsa"
    },
    {
        "officialId":  "SeoraksanSinheungsa",
        "officialName":  "설악산신흥사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0282",
        "address":  "강원특별자치도 속초시 설악산로 1137",
        "sido":  "강원",
        "sigungu":  "속초시",
        "phone":  "033-636-8001 / 월요일 휴관",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=SeoraksanSinheungsa"
    },
    {
        "officialId":  "Seongjusa",
        "officialName":  "성주사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0958",
        "address":  "경상남도 창원시 성산구 곰절길 191",
        "sido":  "경남",
        "sigungu":  "창원시",
        "phone":  "010-2055-3104",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Seongjusa"
    },
    {
        "officialId":  "ssa273",
        "officialName":  "성흥사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0946",
        "address":  "경남 창원시 진해구 대장로273",
        "sido":  "경남",
        "sigungu":  "창원시",
        "phone":  "055-552-5111, 010-3618-5111",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=ssa273"
    },
    {
        "officialId":  "Songgwangsa_sc",
        "officialName":  "송광사(순천)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0649",
        "address":  "전라남도 순천시 송광면 송광사안길 100",
        "sido":  "전남",
        "sigungu":  "순천시",
        "phone":  "010-8830-1921",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Songgwangsa_sc"
    },
    {
        "officialId":  "Songkwangsa_wj",
        "officialName":  "송광사(완주)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0541",
        "address":  "전라북도 완주군 소양면 송광수만로 255-16",
        "sido":  "전북",
        "sigungu":  "완주군",
        "phone":  "010-4223-8091//063-241-8090",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Songkwangsa_wj"
    },
    {
        "officialId":  "Suguksa",
        "officialName":  "수국사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0044",
        "address":  "서울특별시 은평구 서오릉로 23길 8-5",
        "sido":  "서울",
        "sigungu":  "은평구",
        "phone":  "02-356-2001, 010-7373-6300",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Suguksa"
    },
    {
        "officialId":  "Sudeoksa",
        "officialName":  "수덕사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0452",
        "address":  "충청남도 예산군 덕산면 수덕사안길 79",
        "sido":  "충남",
        "sigungu":  "예산군",
        "phone":  "041-330-7789(9시~17시) 점심시간11:20~12:20",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Sudeoksa"
    },
    {
        "officialId":  "Suwonsa",
        "officialName":  "수원사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0202",
        "address":  "경기도 수원시 팔달구 수원천로 300",
        "sido":  "경기",
        "sigungu":  "수원시",
        "phone":  "010-9420-9670",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Suwonsa"
    },
    {
        "officialId":  "Sujinsa",
        "officialName":  "수진사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "sujinsa",
        "address":  "경기도 남양주시 천마산로 115-13",
        "sido":  "경기",
        "sigungu":  "남양주시",
        "phone":  "031-591-3364",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Sujinsa"
    },
    {
        "officialId":  "Shingwangsa",
        "officialName":  "신광사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0877",
        "address":  "경상남도 거제시 사등면 오량2길 108",
        "sido":  "경남",
        "sigungu":  "거제시",
        "phone":  "010-9632-7749",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Shingwangsa"
    },
    {
        "officialId":  "Silleuksa",
        "officialName":  "신륵사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0226",
        "address":  "경기도 여주시 신륵사길 73",
        "sido":  "경기",
        "sigungu":  "여주시",
        "phone":  "031-885-2505",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Silleuksa"
    },
    {
        "officialId":  "sinahnsa",
        "officialName":  "신안사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0405",
        "address":  "충청남도 금산군 제원면 신안사로 970",
        "sido":  "충남",
        "sigungu":  "금산군",
        "phone":  "010-2122-1388",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=sinahnsa"
    },
    {
        "officialId":  "Sinheungsa",
        "officialName":  "신흥사(완도)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0666",
        "address":  "전라남도 완도군 완도읍 청해진남로 101-1",
        "sido":  "전남",
        "sigungu":  "완도군",
        "phone":  "010-4181-6499",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Sinheungsa"
    },
    {
        "officialId":  "Silsangsa",
        "officialName":  "실상사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0506",
        "address":  "전북특별자치도 남원시 산내면 실상사길 265",
        "sido":  "전북",
        "sigungu":  "남원시",
        "phone":  "010-9654-3031",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Silsangsa"
    },
    {
        "officialId":  "Simwonsa_sj",
        "officialName":  "심원사(성주)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0777",
        "address":  "경상북도 성주군 수륜면 가야산식물원길 17-56",
        "sido":  "경북",
        "sigungu":  "성주군",
        "phone":  "054-931-6887",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Simwonsa_sj"
    },
    {
        "officialId":  "Simtaeksa",
        "officialName":  "심택사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0048",
        "address":  "서울특별시 은평구 은평로20나길 5-23",
        "sido":  "서울",
        "sigungu":  "은평구",
        "phone":  "02) 355- 4607, 담당자 010-7471-4509,",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Simtaeksa"
    },
    {
        "officialId":  "Ssanggyesa_hd",
        "officialName":  "쌍계사(하동)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0965",
        "address":  "경상남도 하동군 화개면 쌍계사길 59",
        "sido":  "경남",
        "sigungu":  "하동군",
        "phone":  "010-6399-1901",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Ssanggyesa_hd"
    },
    {
        "officialId":  "Ssangbongsa",
        "officialName":  "쌍봉사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0686",
        "address":  "전라남도 화순군 이양면 쌍산의로 459",
        "sido":  "전남",
        "sigungu":  "화순군",
        "phone":  "010-4242-6043",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Ssangbongsa"
    },
    {
        "officialId":  "Anguksa",
        "officialName":  "안국사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0522",
        "address":  "전라북도 무주군 적상면 산성로 1050",
        "sido":  "전북",
        "sigungu":  "무주군",
        "phone":  "063-322-6162",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Anguksa"
    },
    {
        "officialId":  "Yaksusa",
        "officialName":  "약수사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0014",
        "address":  "서울특별시 관악구 약수암1길 28",
        "sido":  "서울",
        "sigungu":  "관악구",
        "phone":  "02-877-7515",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Yaksusa"
    },
    {
        "officialId":  "Yakchunsa",
        "officialName":  "약천사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0987",
        "address":  "제주특별자치도 서귀포시 이어도로 293-28",
        "sido":  "제주",
        "sigungu":  "서귀포시",
        "phone":  "064-738-5079, 010-7383-5079",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Yakchunsa"
    },
    {
        "officialId":  "Yeongoksa",
        "officialName":  "연곡사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0619",
        "address":  "전라남도 구례군 토지면 피아골로 774",
        "sido":  "전남",
        "sigungu":  "구례군",
        "phone":  "010-5227-1080",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Yeongoksa"
    },
    {
        "officialId":  "LotusLanternInternationalMeditationCenter",
        "officialName":  "연등국제선원",
        "operatorType":  "temple",
        "operatorTempleSlug":  "yeondeung-gukje-seonwon",
        "address":  "인천광역시 강화군 길상면 강화동로 349-60",
        "sido":  "인천",
        "sigungu":  "강화군",
        "phone":  "032-937-7033",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=LotusLanternInternationalMeditationCenter"
    },
    {
        "officialId":  "Yeonunsa",
        "officialName":  "연운사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "yeonunsa",
        "address":  "경기도 김포시 양촌읍 석모로5번길 48-11",
        "sido":  "경기",
        "sigungu":  "김포시",
        "phone":  "031-986-7117",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Yeonunsa"
    },
    {
        "officialId":  "Yeonjuam",
        "officialName":  "연주암",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0173",
        "address":  "경기도 과천시 자하동길 63",
        "sido":  "경기",
        "sigungu":  "과천시",
        "phone":  "010-9738-3234",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Yeonjuam"
    },
    {
        "officialId":  "Yeongguksa",
        "officialName":  "영국사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0369",
        "address":  "충청북도 영동군 양산면 영국동길 225-35",
        "sido":  "충북",
        "sigungu":  "영동군",
        "phone":  "010-7135-8843",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Yeongguksa"
    },
    {
        "officialId":  "Younglangsa",
        "officialName":  "영랑사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0416",
        "address":  "충청남도 당진시 고대면 진관로 142-52",
        "sido":  "충남",
        "sigungu":  "당진시",
        "phone":  "010-8776-0371",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Younglangsa"
    },
    {
        "officialId":  "Youngpyungsa",
        "officialName":  "영평사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0159",
        "address":  "세종특별자치시 장군면 영평사길 124",
        "sido":  "세종",
        "sigungu":  "세종시",
        "phone":  "010-7116-1854",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Youngpyungsa"
    },
    {
        "officialId":  "Okcheonsa",
        "officialName":  "옥천사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0882",
        "address":  "경상남도 고성군 개천면 연화산1로 471-9",
        "sido":  "경남",
        "sigungu":  "고성군",
        "phone":  "055-672-6296",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Okcheonsa"
    },
    {
        "officialId":  "Okcheonam",
        "officialName":  "옥천암",
        "operatorType":  "temple",
        "operatorTempleSlug":  "okcheonam-seoul",
        "address":  "서울특별시 서대문구 홍지문길 1-38",
        "sido":  "서울",
        "sigungu":  "서대문구",
        "phone":  "02-395-4031",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Okcheonam"
    },
    {
        "officialId":  "Yongmunsa_nam",
        "officialName":  "용문사(남해)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0902",
        "address":  "경상남도 남해군 이동면 용문사길 166-11",
        "sido":  "경남",
        "sigungu":  "남해군",
        "phone":  "010-7926-4425",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Yongmunsa_nam"
    },
    {
        "officialId":  "Yongmunsa_yang",
        "officialName":  "용문사(양평)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0223",
        "address":  "경기도 양평군 용문면 용문산로 782",
        "sido":  "경기",
        "sigungu":  "양평군",
        "phone":  "031-775-5797",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Yongmunsa_yang"
    },
    {
        "officialId":  "Yongmunsa_ye",
        "officialName":  "용문사(예천)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0826",
        "address":  "경상북도 예천군 용문면 용문사길 285-30",
        "sido":  "경북",
        "sigungu":  "예천군",
        "phone":  "010-5178-4665",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Yongmunsa_ye"
    },
    {
        "officialId":  "Yongyeonsa",
        "officialName":  "용연사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0269",
        "address":  "강원특별자치도 강릉시 사천면 중앙서로 961",
        "sido":  "강원",
        "sigungu":  "강릉시",
        "phone":  "01062373455",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Yongyeonsa"
    },
    {
        "officialId":  "Yongjoosa",
        "officialName":  "용주사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0263",
        "address":  "경기도 화성시 용주로 135-6",
        "sido":  "경기",
        "sigungu":  "화성시",
        "phone":  "010-7594-6887, 031-235-6886",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Yongjoosa"
    },
    {
        "officialId":  "Yonghwasa_chung",
        "officialName":  "용화사(청주)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0315",
        "address":  "충청북도 청주시 서원구 무심서로 565",
        "sido":  "충북",
        "sigungu":  "청주시",
        "phone":  "043-275-0516",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Yonghwasa_chung"
    },
    {
        "officialId":  "YONGHWASA_tong",
        "officialName":  "용화사(통영)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0960",
        "address":  "경상남도 통영시 봉수로 107-82",
        "sido":  "경남",
        "sigungu":  "통영시",
        "phone":  "055-649-3060",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=YONGHWASA_tong"
    },
    {
        "officialId":  "yongheungsa",
        "officialName":  "용흥사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "yongheungsa-damyang",
        "address":  "전라남도 담양군 월산면 용흥사길 442",
        "sido":  "전남",
        "sigungu":  "담양군",
        "phone":  "010-2723-0574",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=yongheungsa"
    },
    {
        "officialId":  "Unjusa",
        "officialName":  "운주사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0684",
        "address":  "전라남도 화순군 도암면 천태로 91-44",
        "sido":  "전남",
        "sigungu":  "화순군",
        "phone":  "010-4279-0660",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Unjusa"
    },
    {
        "officialId":  "wonhyosa",
        "officialName":  "원효사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0132",
        "address":  "광주광역시 북구 무등로 1514-35",
        "sido":  "광주",
        "sigungu":  "북구",
        "phone":  "062-266-0322/ 010-3926-0389",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=wonhyosa"
    },
    {
        "officialId":  "Woljeongsa",
        "officialName":  "월정사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "woljeongsa",
        "address":  "강원특별자치도 평창군 진부면 오대산로 374-8",
        "sido":  "강원",
        "sigungu":  "평창군",
        "phone":  "0507-1484-6606",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Woljeongsa"
    },
    {
        "officialId":  "Yukjijangsa",
        "officialName":  "육지장사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "yukjijangsa",
        "address":  "경기도 양주시 백석읍 기산로471번길 190",
        "sido":  "경기",
        "sigungu":  "양주시",
        "phone":  "031-871-0101",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Yukjijangsa"
    },
    {
        "officialId":  "Eunhaesa",
        "officialName":  "은해사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0818",
        "address":  "경상북도 영천시 청통면 은해사로 300",
        "sido":  "경북",
        "sigungu":  "영천시",
        "phone":  "054-335-3308",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Eunhaesa"
    },
    {
        "officialId":  "ijesa",
        "officialName":  "이제사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "ijesa",
        "address":  "충남 공주시 사곡면 다복골길 73-6",
        "sido":  "충남",
        "sigungu":  "공주시",
        "phone":  "010-2498-5038",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=ijesa"
    },
    {
        "officialId":  "Jabisunsa",
        "officialName":  "자비선사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "jabiseonsa",
        "address":  "경상북도 성주군 수륜면 계정길 208",
        "sido":  "경북",
        "sigungu":  "성주군",
        "phone":  "054-931-8874",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Jabisunsa"
    },
    {
        "officialId":  "Jangyuksa",
        "officialName":  "장육사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0796",
        "address":  "경상북도 영덕군 창수면 장육사1길 172",
        "sido":  "경북",
        "sigungu":  "영덕군",
        "phone":  "010-9733-6289",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Jangyuksa"
    },
    {
        "officialId":  "Jeondeungsa",
        "officialName":  "전등사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0122",
        "address":  "인천광역시 강화군 길상면 전등사로 37-41",
        "sido":  "인천",
        "sigungu":  "강화군",
        "phone":  "032-937-0152",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Jeondeungsa"
    },
    {
        "officialId":  "Jungtosa",
        "officialName":  "정토사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "jeongtosa-seongnam",
        "address":  "경기도 성남시 수정구 옛골로 42번길 3",
        "sido":  "경기",
        "sigungu":  "성남시",
        "phone":  "031-723-9796",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Jungtosa"
    },
    {
        "officialId":  "Jeonghyesa",
        "officialName":  "정혜사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0647",
        "address":  "전라남도 순천시 서면 정혜사길 32",
        "sido":  "전남",
        "sigungu":  "순천시",
        "phone":  "010-5058-8483",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Jeonghyesa"
    },
    {
        "officialId":  "Jogyesa",
        "officialName":  "조계사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "jogyesa",
        "address":  "서울특별시 종로구 우정국로 55",
        "sido":  "서울",
        "sigungu":  "종로구",
        "phone":  "02-768-8523",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Jogyesa"
    },
    {
        "officialId":  "Juklimsa",
        "officialName":  "죽림사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0808",
        "address":  "경상북도 영천시 금호읍 죽방길 279-57",
        "sido":  "경북",
        "sigungu":  "영천시",
        "phone":  "054-334-1261",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Juklimsa"
    },
    {
        "officialId":  "juglim4688",
        "officialName":  "죽림사(포항)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0873",
        "address":  "경북 포항시 북구 탑산길 10번길 11-4",
        "sido":  "경북",
        "sigungu":  "포항시",
        "phone":  "054-247-4688",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=juglim4688"
    },
    {
        "officialId":  "Joongheungsa",
        "officialName":  "중흥사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0169",
        "address":  "경기도 고양시 덕양구 대서문길 393",
        "sido":  "경기",
        "sigungu":  "고양시",
        "phone":  "010-3221-4488",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Joongheungsa"
    },
    {
        "officialId":  "Jeungsimsa",
        "officialName":  "증심사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0131",
        "address":  "광주광역시 동구 증심사길 177",
        "sido":  "광주",
        "sigungu":  "동구",
        "phone":  "062-226-0107",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Jeungsimsa"
    },
    {
        "officialId":  "Jijangjeongsa",
        "officialName":  "지장정사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "jijangjeongsa",
        "address":  "충청남도 논산시 노성면 화곡안길 103",
        "sido":  "충남",
        "sigungu":  "논산시",
        "phone":  "041-732-0106",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Jijangjeongsa"
    },
    {
        "officialId":  "Jikjisa",
        "officialName":  "직지사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0743",
        "address":  "경상북도 김천시 대항면 직지사길 95",
        "sido":  "경북",
        "sigungu":  "김천시",
        "phone":  "054-429-1716",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Jikjisa"
    },
    {
        "officialId":  "Jinkwansa",
        "officialName":  "진관사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0045",
        "address":  "서울특별시 은평구 진관길 73",
        "sido":  "서울",
        "sigungu":  "은평구",
        "phone":  "02-388-7999",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Jinkwansa"
    },
    {
        "officialId":  "Choneunsa",
        "officialName":  "천은사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0616",
        "address":  "전라남도 구례군 광의면 노고단로 209",
        "sido":  "전남",
        "sigungu":  "구례군",
        "phone":  "061-781-4800",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Choneunsa"
    },
    {
        "officialId":  "Cheonchuksa",
        "officialName":  "천축사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0024",
        "address":  "서울특별시 도봉구 도봉산길 92-2",
        "sido":  "서울",
        "sigungu":  "도봉구",
        "phone":  "02-954-1473",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Cheonchuksa"
    },
    {
        "officialId":  "chunggyesa",
        "officialName":  "청계사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "cheonggyesa-hadong",
        "address":  "경남 하동군 옥종면 안계길 67-182",
        "sido":  "경남",
        "sigungu":  "하동군",
        "phone":  "010-4600-1884",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=chunggyesa"
    },
    {
        "officialId":  "Cheongryangsa",
        "officialName":  "청량사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0754",
        "address":  "경상북도 봉화군 청량산길 199-152",
        "sido":  "경북",
        "sigungu":  "봉화군",
        "phone":  "010-2683-6704",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Cheongryangsa"
    },
    {
        "officialId":  "bluelotusganghwa",
        "officialName":  "청련사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0120",
        "address":  "인천광역시 강화군 강화읍 고비고개로 188번길 112(국화리)",
        "sido":  "인천",
        "sigungu":  "강화군",
        "phone":  "032-933-3886",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=bluelotusganghwa"
    },
    {
        "officialId":  "Cheongpyeongsa",
        "officialName":  "청평사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0307",
        "address":  "강원특별자치도 춘천시 북산면 오봉산길 810",
        "sido":  "강원",
        "sigungu":  "춘천시",
        "phone":  "01037171095",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Cheongpyeongsa"
    },
    {
        "officialId":  "chukseosa",
        "officialName":  "축서사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0755",
        "address":  "경상북도 봉화군 물야면 월계길 739",
        "sido":  "경북",
        "sigungu":  "봉화군",
        "phone":  "054-673-9962",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=chukseosa"
    },
    {
        "officialId":  "Tongdosa",
        "officialName":  "통도사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "tongdosa",
        "address":  "경상남도 양산시 하북면 통도사로 108",
        "sido":  "경남",
        "sigungu":  "양산시",
        "phone":  "055-384-7085",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Tongdosa"
    },
    {
        "officialId":  "TemplestayinformationCenter",
        "officialName":  "통합정보센터",
        "operatorType":  "institution",
        "address":  "서울특별시 종로구 우정국로 56",
        "sido":  "서울",
        "sigungu":  "종로구",
        "phone":  "02-2031-2000",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=TemplestayinformationCenter"
    },
    {
        "officialId":  "seokguram2",
        "officialName":  "팔공산석굴암",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0738",
        "address":  "대구광역시 군위군 부계면 남산4길24(제2석굴암)",
        "sido":  "대구",
        "sigungu":  "군위군",
        "phone":  "010-6770-2001",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=seokguram2"
    },
    {
        "officialId":  "Pyochungsa",
        "officialName":  "표충사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0909",
        "address":  "경상남도 밀양시 표충로 1338",
        "sido":  "경남",
        "sigungu":  "밀양시",
        "phone":  "055-353-1537",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Pyochungsa"
    },
    {
        "officialId":  "Hakrimsa",
        "officialName":  "학림사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "hakrimsa-gongju",
        "address":  "충청남도 공주시 반포면 제석골길 35-45",
        "sido":  "충남",
        "sigungu":  "공주시",
        "phone":  "042-825-0515",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Hakrimsa"
    },
    {
        "officialId":  "KoreaCultureTrainingInstitute",
        "officialName":  "한국문화연수원",
        "operatorType":  "institution",
        "address":  "충청남도 공주시 사곡면 마곡사로 1065",
        "sido":  "충남",
        "sigungu":  "공주시",
        "phone":  "041-841-9039",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=KoreaCultureTrainingInstitute"
    },
    {
        "officialId":  "Haeinsa",
        "officialName":  "해인사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "haeinsa",
        "address":  "경상남도 합천군 가야면 해인사길 122",
        "sido":  "경남",
        "sigungu":  "합천군",
        "phone":  "010-4763-3161",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Haeinsa"
    },
    {
        "officialId":  "Hyangiram",
        "officialName":  "향일암",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0657",
        "address":  "전라남도 여수시 돌산읍 향일암로 60",
        "sido":  "전남",
        "sigungu":  "여수시",
        "phone":  "010-6504-4742",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Hyangiram"
    },
    {
        "officialId":  "Hyundeoksa",
        "officialName":  "현덕사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "hyeondeoksa",
        "address":  "강원특별자치도 강릉시 연곡면 싸리골길 170",
        "sido":  "강원",
        "sigungu":  "강릉시",
        "phone":  "033-661-5878",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Hyundeoksa"
    },
    {
        "officialId":  "Hongbeopsa",
        "officialName":  "홍법사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "hongbeopsa",
        "address":  "부산광역시 금정구 두구로33번길 202",
        "sido":  "부산",
        "sigungu":  "금정구",
        "phone":  "051-508-0345",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Hongbeopsa"
    },
    {
        "officialId":  "Hwagyesa",
        "officialName":  "화계사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0003",
        "address":  "서울특별시 강북구 화계사길 117",
        "sido":  "서울",
        "sigungu":  "강북구",
        "phone":  "010-4024-4326",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Hwagyesa"
    },
    {
        "officialId":  "Hwaamsa",
        "officialName":  "화암사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0274",
        "address":  "강원특별자치도 고성군 토성면 화암사길 100",
        "sido":  "강원",
        "sigungu":  "고성군",
        "phone":  "033-633-7463",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Hwaamsa"
    },
    {
        "officialId":  "Hwaeomsa",
        "officialName":  "화엄사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0617",
        "address":  "전라남도 구례군 마산면 화엄사로 539",
        "sido":  "전남",
        "sigungu":  "구례군",
        "phone":  "010-4455-5592",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Hwaeomsa"
    },
    {
        "officialId":  "Hwaunsa",
        "officialName":  "화운사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "hwaunsa",
        "address":  "경기도 용인시 처인구 동백죽전대로 111-14",
        "sido":  "경기",
        "sigungu":  "용인시",
        "phone":  "031-337-2576",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Hwaunsa"
    },
    {
        "officialId":  "Hoeamsa",
        "officialName":  "회암사(양주)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0219",
        "address":  "경기도 양주시 회암사길 281",
        "sido":  "경기",
        "sigungu":  "양주시",
        "phone":  "031-866-0355 /010-7508-0355",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Hoeamsa"
    },
    {
        "officialId":  "Heungguksa_gy",
        "officialName":  "흥국사(고양)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0171",
        "address":  "경기도 고양시 덕양구 흥국사길 82",
        "sido":  "경기",
        "sigungu":  "고양시",
        "phone":  "02-381-7980(010-4451-7980)",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Heungguksa_gy"
    },
    {
        "officialId":  "Heungguksa_ys",
        "officialName":  "흥국사(여수)",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0659",
        "address":  "전라남도 여수시 흥국사길 160",
        "sido":  "전남",
        "sigungu":  "여수시",
        "phone":  "010-5756-5637",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Heungguksa_ys"
    },
    {
        "officialId":  "Huibangsa",
        "officialName":  "희방사",
        "operatorType":  "temple",
        "operatorTempleSlug":  "traditional-temple-0804",
        "address":  "경상북도 영주시 풍기읍 죽령로1720번길 278",
        "sido":  "경북",
        "sigungu":  "영주시",
        "phone":  "054-638-2400",
        "officialUrl":  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do?templeId=Huibangsa"
    }
] satisfies TempleStayOperatorRecord[];

export const templeStayOperators: TempleStayOperator[] =
    templeStayOperatorRecords.map((operator) => ({
        ...operator,
        source: TEMPLE_STAY_OPERATOR_SOURCE,
        checkedAt: TEMPLE_STAY_OPERATOR_CHECKED_AT,
    }));

const operatorsByOfficialId = new Map(
    templeStayOperators.map((operator) => [
        operator.officialId,
        operator,
    ]),
);
const operatorUrls = new Set(
    templeStayOperators.map((operator) => operator.officialUrl),
);
const templeOperatorCount = templeStayOperators.filter(
    (operator) => operator.operatorType === "temple",
).length;
const institutionOperatorCount = templeStayOperators.filter(
    (operator) => operator.operatorType === "institution",
).length;

if (
    templeStayOperators.length !== 171 ||
    templeOperatorCount !== 169 ||
    institutionOperatorCount !== 2 ||
    operatorsByOfficialId.size !== templeStayOperators.length ||
    operatorUrls.size !== templeStayOperators.length
) {
    throw new Error("TempleStay operator production data 검증 실패");
}

for (const operator of templeStayOperators) {
    if (
        !operator.officialId ||
        !operator.officialUrl ||
        !operator.source ||
        !operator.checkedAt
    ) {
        throw new Error(
            `TempleStay operator source 누락: ${operator.officialName}`,
        );
    }

    if (
        operator.operatorType === "temple" &&
        !getTempleBySlug(operator.operatorTempleSlug)
    ) {
        throw new Error(
            `TempleStay operator Temple relation 실패: ${operator.officialName}`,
        );
    }
}

export function getTempleStayOperatorByOfficialId(officialId: string) {
    return operatorsByOfficialId.get(officialId);
}

export function getTempleForOperator(
    operator: TempleStayOperator,
): Temple | undefined {
    return operator.operatorType === "temple"
        ? getTempleBySlug(operator.operatorTempleSlug)
        : undefined;
}

export function getTempleStayOperatorSearchValues(
    operator: TempleStayOperator,
) {
    const temple = getTempleForOperator(operator);

    return [
        operator.officialName,
        operator.address,
        operator.sido,
        operator.sigungu,
        operator.sigungu.replace(/(시|군|구)$/, ""),
        temple?.name,
        ...(temple?.aliases ?? []),
        temple?.location.sido,
        temple?.location.sigungu,
        temple?.location.address,
    ].filter((value): value is string => Boolean(value));
}

export function getTempleStayOperatorsByTempleSlug(slug: TempleSlug) {
    return templeStayOperators.filter(
        (operator) =>
            operator.operatorType === "temple" &&
            operator.operatorTempleSlug === slug,
    );
}

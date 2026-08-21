export type TempleRepresentativeImage = {
    src: string;
    alt: string;
    source: string;
    sourceUrl: string;
    license: string;
    licenseUrl: string;
    changes?: string;
};

export const templeRepresentativeImages: Readonly<
    Partial<Record<string, TempleRepresentativeImage>>
> = {
    jogyesa: {
        src: "/images/temples/jogyesa.webp",
        alt: "조계사 대웅전 전경",
        source: "Richard Mortel / Wikimedia Commons",
        sourceUrl:
            "https://commons.wikimedia.org/wiki/File:Jogye-sa_Buddhist_temple,_Seoul_(5)_(41087136622).jpg",
        license: "CC BY 2.0",
        licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    },
    bulguksa: {
        src: "/images/temples/bulguksa.webp",
        alt: "경주 불국사 전경",
        source: "국가유산청",
        sourceUrl:
            "https://www.heritage.go.kr/heri/cul/imgHeritage.do?ccimId=6287792&ccbaKdcd=13&ccbaAsno=05020000&ccbaCtcd=37",
        license: "공공누리 제1유형",
        licenseUrl: "https://www.kogl.or.kr/info/licenseType1.do",
    },
    haeinsa: {
        src: "/images/temples/haeinsa.webp",
        alt: "합천 해인사 전경",
        source:
            "[합천 해인사 전경] 한국민족문화대백과사전, 한국학중앙연구원",
        sourceUrl: "https://encykorea.aks.ac.kr/Article/E0062704",
        license: "공공누리 제1유형",
        licenseUrl: "https://www.kogl.or.kr/info/licenseType1.do",
    },
    tongdosa: {
        src: "/images/temples/tongdosa.webp",
        alt: "통도사 대웅전 전경",
        source: "G41rn8 / Wikimedia Commons",
        sourceUrl:
            "https://commons.wikimedia.org/wiki/File:Tongdosa_IMG_20161006_105140.jpg",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    woljeongsa: {
        src: "/images/temples/woljeongsa.webp",
        alt: "눈 내린 월정사 전경",
        source: "Leejiwoong35 / Wikimedia Commons",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:월정사.jpg",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    bongeunsa: {
        src: "/images/temples/bongeunsa.webp",
        alt: "봉은사 대웅전 전경",
        source: "Kallerna / Wikimedia Commons",
        sourceUrl:
            "https://commons.wikimedia.org/wiki/File:Bongeunsa_Seoul_10.jpg",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
};

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { parse as parseCsv } from "csv-parse/sync";
import { PDFParse } from "pdf-parse";

const root = process.cwd();
const mcstPdfPath = path.resolve(
    root,
    process.argv[2] ??
        "tmp/pdfs/mcst-traditional-temples-2026-06-01.pdf",
);
const localDataCsvPath = path.resolve(
    root,
    process.argv[3] ??
        "tmp/temple-import/localdata-traditional-temples-2026-08-15.csv",
);
const rawDirectory = path.resolve(root, "data/temples/raw");

function sha256(buffer) {
    return createHash("sha256").update(buffer).digest("hex");
}

async function extractMcst() {
    const buffer = await readFile(mcstPdfPath);
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getTable();
    await parser.destroy();

    const rows = result.pages.flatMap((page) =>
        page.tables.flatMap((table) =>
            table.filter((row) => /^\d+$/.test(row[0] ?? "")),
        ),
    );

    const records = rows.map(
        ([recordNo, sido, sigungu, address, name, denomination]) => ({
            recordNo: Number(recordNo),
            name: name.trim(),
            sido: sido.trim(),
            sigungu: sigungu.trim(),
            address: address.trim(),
            denomination: denomination.trim(),
        }),
    );

    if (
        records.length !== 991 ||
        records.some((record, index) => record.recordNo !== index + 1)
    ) {
        throw new Error(
            `MCST extraction validation failed: ${records.length} rows`,
        );
    }

    return {
        source: {
            title: "전통사찰 현황(991개소, 2026.6.1.기준)",
            authority: "문화체육관광부",
            asOf: "2026-06-01",
            publishedAt: "2026-06-15",
            url: "https://www.mcst.go.kr/site/s_policy/dept/deptView.jsp?pDataCD=0417000000&pSeq=2150&pType=03",
            originalFileSha256: sha256(buffer),
            recordCount: records.length,
        },
        records,
    };
}

async function extractLocalData() {
    const buffer = await readFile(localDataCsvPath);
    const csv = new TextDecoder("euc-kr").decode(buffer);
    const rows = parseCsv(csv, {
        columns: true,
        skip_empty_lines: true,
        relax_quotes: true,
    });

    const records = rows.map((row) => ({
        localGovCode: row["개방자치단체코드"].trim(),
        managementNo: row["관리번호"].trim(),
        name: (row["전통사찰명"] || row["사업장명"]).trim(),
        businessName: row["사업장명"].trim(),
        roadAddress: row["도로명주소"].trim(),
        lotAddress: row["지번주소"].trim(),
        x: row["좌표정보(X)"].trim() || null,
        y: row["좌표정보(Y)"].trim() || null,
        businessStatus: row["영업상태명"].trim(),
        detailedStatus: row["상세영업상태명"].trim(),
        cancellation: row["지정취소"].trim(),
        cancellationDate: row["지정취소일자"].trim(),
        updatedAt: row["최종수정시점"].trim(),
        dataUpdatedAt: row["데이터갱신시점"].trim(),
    }));

    if (records.length < 991) {
        throw new Error(
            `LOCALDATA extraction validation failed: ${records.length} rows`,
        );
    }

    return {
        source: {
            title: "행정안전부_LOCALDATA_문화_전통사찰",
            authority: "행정안전부 LOCALDATA",
            downloadedAt: "2026-08-15",
            url: "https://file.localdata.go.kr/file/traditional_temples/info",
            downloadUrl: "https://file.localdata.go.kr/file/download/traditional_temples/info",
            coordinateSystem: "EPSG:5174",
            originalFileEncoding: "CP949",
            originalFileSha256: sha256(buffer),
            recordCount: records.length,
        },
        records,
    };
}

await mkdir(rawDirectory, { recursive: true });

const [mcst, localData] = await Promise.all([
    extractMcst(),
    extractLocalData(),
]);

await Promise.all([
    writeFile(
        path.join(rawDirectory, "mcst-2026-06-01.json"),
        `${JSON.stringify(mcst, null, 2)}\n`,
    ),
    writeFile(
        path.join(rawDirectory, "localdata-2026-08-15.json"),
        `${JSON.stringify(localData, null, 2)}\n`,
    ),
]);

console.log(
    JSON.stringify(
        {
            mcstRecords: mcst.records.length,
            localDataRecords: localData.records.length,
            outputDirectory: path.relative(root, rawDirectory),
        },
        null,
        2,
    ),
);

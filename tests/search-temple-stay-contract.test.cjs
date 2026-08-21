const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const ts = require("typescript");

// The repository has no test transpiler dependency. This test-only hook lets
// Node's built-in runner exercise the production TypeScript modules directly.
require.extensions[".ts"] = (module, filename) => {
    const source = fs.readFileSync(filename, "utf8");
    const { outputText } = ts.transpileModule(source, {
        compilerOptions: {
            esModuleInterop: true,
            module: ts.ModuleKind.CommonJS,
            resolveJsonModule: true,
            target: ts.ScriptTarget.ES2022,
        },
        fileName: filename,
    });
    module._compile(outputText, filename);
};

const { searchYeon } = require("../app/search/data.ts");
const {
    getTempleStayProgramByOfficialId,
    templeStayPrograms,
} = require("../app/temples/stay/programs.ts");
const {
    getTempleForOperator,
    getTempleStayOperatorByOfficialId,
    templeStayOperators,
} = require("../app/temples/stay/operators.ts");
const { temples } = require("../app/temples/guide/temples.ts");

const templesByHref = new Map(
    temples.map((temple) => [`/temples/guide/${temple.slug}`, temple]),
);
const operatorsByUrl = new Map(
    templeStayOperators.map((operator) => [operator.officialUrl, operator]),
);
const programsByUrl = new Map(
    templeStayPrograms.map((program) => [program.officialUrl, program]),
);

function classifyResult(item) {
    const temple = templesByHref.get(item.href);
    if (temple) {
        return { entityType: "temple", entity: temple, item };
    }

    const operator = operatorsByUrl.get(item.href);
    if (operator) {
        return { entityType: "operator", entity: operator, item };
    }

    const program = programsByUrl.get(item.href);
    if (program) {
        return { entityType: "program", entity: program, item };
    }

    return { entityType: "other", entity: undefined, item };
}

function search(query) {
    return searchYeon(query).map(classifyResult);
}

function ofType(results, entityType) {
    return results.filter((result) => result.entityType === entityType);
}

function actualShape(results) {
    return results.map((result) => ({
        entityType: result.entityType,
        title: result.item.title,
        href: result.item.href,
    }));
}

function assertProgramMode(results, message) {
    const programs = ofType(results, "program");
    assert.ok(
        programs.length > 0,
        `${message}: expected Program results, got ${JSON.stringify(actualShape(results))}`,
    );
    assert.equal(
        programs.length,
        results.length,
        `${message}: Program mode must not fall back to other entity types`,
    );
    assert.ok(
        programs.every((result) => result.entity.detailStatus === "available"),
        `${message}: detail-unavailable Programs must be excluded`,
    );
    return programs;
}

function operatorHasLocation(operator, token) {
    return [
        operator.sido,
        operator.sigungu,
        operator.address,
    ].some((value) => value.includes(token));
}

test("A. 통도사: canonical Temple is searchable and Programs stay excluded", () => {
    const results = search("통도사");
    const temples = ofType(results, "temple");

    assert.ok(
        temples.some((result) => result.entity.slug === "tongdosa"),
        `expected canonical Tongdosa Temple, got ${JSON.stringify(actualShape(results))}`,
    );
    assert.equal(ofType(results, "program").length, 0);
});

test("B. 통도사 템플스테이: Operator mode excludes Programs", () => {
    const results = search("통도사 템플스테이");
    const operators = ofType(results, "operator");

    assert.ok(
        operators.some((result) => result.entity.officialId === "Tongdosa"),
        `expected Tongdosa Operator, got ${JSON.stringify(actualShape(results))}`,
    );
    assert.equal(ofType(results, "program").length, 0);
});

test("C. 담양 템플스테이: location-scoped Operator mode excludes Programs", () => {
    const results = search("담양 템플스테이");
    const operators = ofType(results, "operator");

    assert.ok(operators.length > 0, "expected at least one Damyang Operator");
    assert.ok(
        operators.every((result) => operatorHasLocation(result.entity, "담양")),
        `all Operator results must inherit Damyang context: ${JSON.stringify(actualShape(results))}`,
    );
    assert.equal(ofType(results, "program").length, 0);
});

test("D. 공주 템플스테이: location-scoped Operator mode excludes Programs", () => {
    const results = search("공주 템플스테이");
    const operators = ofType(results, "operator");

    assert.ok(operators.length > 0, "expected at least one Gongju Operator");
    assert.ok(
        operators.every((result) => operatorHasLocation(result.entity, "공주")),
        `all Operator results must inherit Gongju context: ${JSON.stringify(actualShape(results))}`,
    );
    assert.equal(ofType(results, "program").length, 0);
});

test("E. 통도사 휴식형: structured rest type enables Program mode", () => {
    const programs = assertProgramMode(search("통도사 휴식형"), "Tongdosa rest");

    assert.ok(programs.every((result) => result.entity.programType === "rest"));
    assert.ok(
        programs.every(
            (result) => result.entity.operatorOfficialId === "Tongdosa",
        ),
    );
});

test("F. 길상사 명상: stable Program-name signal enables Program mode", () => {
    const programs = assertProgramMode(search("길상사 명상"), "Kilsangsa meditation");

    assert.ok(
        programs.every(
            (result) =>
                result.entity.operatorOfficialId === "Kilsangsa" &&
                result.entity.programName.includes("명상"),
        ),
    );
    assert.ok(
        programs.every((result) => result.entity.officialProgramId !== "28166"),
        "detail-unavailable Program 28166 must not become a search candidate",
    );
    assert.equal(
        ofType(search("마음이 쉬어 가는 자리"), "program").some(
            (result) => result.entity.officialProgramId === "28166",
        ),
        false,
        "detail-unavailable Program 28166 must stay excluded even for its exact stable name",
    );
});

test("G. 서울 당일형 템플스테이: day type and Operator location enable Program mode", () => {
    const programs = assertProgramMode(search("서울 당일형 템플스테이"), "Seoul day");

    assert.ok(programs.every((result) => result.entity.programType === "day"));
    assert.ok(
        programs.every((result) => {
            const operator = getTempleStayOperatorByOfficialId(
                result.entity.operatorOfficialId,
            );
            return operator && operatorHasLocation(operator, "서울");
        }),
    );
});

test("H. 공주 체험형: experience type and Operator location enable Program mode", () => {
    const programs = assertProgramMode(search("공주 체험형"), "Gongju experience");

    assert.ok(
        programs.every((result) => result.entity.programType === "experience"),
    );
    assert.ok(
        programs.every((result) => {
            const operator = getTempleStayOperatorByOfficialId(
                result.entity.operatorOfficialId,
            );
            return operator && operatorHasLocation(operator, "공주");
        }),
    );
});

test("I. 한국문화연수원 휴식형: Institution relation works without a Temple", () => {
    const programs = assertProgramMode(
        search("한국문화연수원 휴식형"),
        "Korea Culture Training Institute rest",
    );

    assert.ok(programs.every((result) => result.entity.programType === "rest"));
    assert.ok(
        programs.every(
            (result) =>
                result.entity.operatorOfficialId ===
                "KoreaCultureTrainingInstitute",
        ),
    );

    const operator = getTempleStayOperatorByOfficialId(
        "KoreaCultureTrainingInstitute",
    );
    assert.equal(operator?.operatorType, "institution");
    assert.equal(getTempleForOperator(operator), undefined);
});

test("J. 템플스테이: alias alone stays in Operator mode", () => {
    const results = search("템플스테이");

    assert.ok(ofType(results, "operator").length > 0);
    assert.equal(ofType(results, "program").length, 0);
    assert.ok(
        results.every((result) => result.entityType === "operator"),
        `TempleStay alias must not fan out to Programs: ${JSON.stringify(actualShape(results))}`,
    );
});

test("K. 휴식형: type alias alone enables rest Program mode", () => {
    const programs = assertProgramMode(search("휴식형"), "rest type alias");

    assert.ok(programs.every((result) => result.entity.programType === "rest"));
});

test("L. 길상사: context alone keeps Programs excluded", () => {
    const results = search("길상사");
    const hasTempleOrOperator = results.some(
        (result) =>
            result.entityType === "temple" || result.entityType === "operator",
    );

    assert.ok(
        hasTempleOrOperator,
        `expected a Temple or Operator context result: ${JSON.stringify(actualShape(results))}`,
    );
    assert.equal(ofType(results, "program").length, 0);
});

// Keep the production identity lookup exercised without making any query test
// depend on a complete result count or result order.
assert.equal(getTempleStayProgramByOfficialId("28166")?.detailStatus, "unavailable");

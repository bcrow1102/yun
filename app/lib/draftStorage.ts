export type DraftType =
    | "event"
    | "temple-stay"
    | "temple-food"
    | "temple-guide"
    | "promote";

type StoredDraft<T> = {
    type: DraftType;
    data: T;
    updatedAt: number;
    expiresAt: number;
};

const STORAGE_PREFIX = "yeon-draft";
const THREE_DAYS = 1000 * 60 * 60 * 24 * 3;

function getStorageKey(type: DraftType) {
    return `${STORAGE_PREFIX}:${type}`;
}

function canUseStorage() {
    return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function saveDraft<T>(type: DraftType, data: T) {
    if (!canUseStorage()) return false;

    const now = Date.now();

    const draft: StoredDraft<T> = {
        type,
        data,
        updatedAt: now,
        expiresAt: now + THREE_DAYS,
    };

    try {
        window.localStorage.setItem(
            getStorageKey(type),
            JSON.stringify(draft),
        );

        return true;
    } catch (error) {
        console.error("초안 저장에 실패했습니다.", error);
        return false;
    }
}

export function loadDraft<T>(type: DraftType): StoredDraft<T> | null {
    if (!canUseStorage()) return null;

    try {
        const saved = window.localStorage.getItem(getStorageKey(type));

        if (!saved) return null;

        const draft = JSON.parse(saved) as StoredDraft<T>;

        if (
            !draft ||
            draft.type !== type ||
            typeof draft.updatedAt !== "number" ||
            typeof draft.expiresAt !== "number"
        ) {
            deleteDraft(type);
            return null;
        }

        if (Date.now() > draft.expiresAt) {
            deleteDraft(type);
            return null;
        }

        return draft;
    } catch (error) {
        console.error("초안을 불러오지 못했습니다.", error);
        deleteDraft(type);
        return null;
    }
}

export function deleteDraft(type: DraftType) {
    if (!canUseStorage()) return;

    try {
        window.localStorage.removeItem(getStorageKey(type));
    } catch (error) {
        console.error("초안을 삭제하지 못했습니다.", error);
    }
}

export function hasDraft(type: DraftType) {
    return loadDraft(type) !== null;
}

export function getDraftUpdatedAt(type: DraftType) {
    const draft = loadDraft(type);
    return draft?.updatedAt ?? null;
}
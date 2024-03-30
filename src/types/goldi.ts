export type GoldiMeta = {
    title: string;
    description: string;
    color: string;
};

export type GoldiData = any;

export type GoldiJSON = {
    meta: GoldiMeta;
    data: GoldiData;
}
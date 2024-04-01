import { GoldiColumn } from "../db/projectData";

export type GoldiMeta = {
    title: string;
    description: string;
    color: string;
};

export type GoldiData = {
    columns: GoldiColumn[];
};

export type GoldiJSON = {
    meta: GoldiMeta;
    data: GoldiData;
}
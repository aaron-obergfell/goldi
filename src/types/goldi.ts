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

export const defaultMeta: GoldiMeta = {
    title: "Neues Projekt - " + new Date().toJSON(),
    description: "Bitte ändern",
    color: "#000000"
}
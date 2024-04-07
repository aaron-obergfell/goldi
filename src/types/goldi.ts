import { GoldiColumn, GoldiImage, GoldiItem, GoldiValue, ItemToImageMapping, ItemToValueAssignment, ItemToValueMapping } from "../db/projectData";

export type GoldiMeta = {
    title: string;
    description: string;
    color: string;
};

export type GoldiData = {
    columns: GoldiColumn[];
    values: GoldiValue[];
    items: GoldiItem[];
    images: GoldiImage[];
    itemToValueMappings: ItemToValueMapping[];
    itemToImageMappings: ItemToImageMapping[];
    itemToValueAssignments: ItemToValueAssignment[];
};

export type GoldiJSON = {
    meta: GoldiMeta;
    data: GoldiData;
}

export const defaultMeta: GoldiMeta = {
    title: "Neues Projekt",
    description: "Bitte ändern",
    color: "#000000"
}
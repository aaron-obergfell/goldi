import { Project } from "../../db/appData";
import { GoldiItem, GoldiValue, ItemToValueMapping, projectDataRepository } from "../../db/projectData";
import { markAsEdited } from "../projects/projectService";

export async function addValue(value: GoldiValue, project: Project) {
    await projectDataRepository(project.id).values.add(value);
    await markAsEdited(project);
}

export async function mapToItem(ids: number[], item: GoldiItem, project: Project) {
    const db = projectDataRepository(project.id);
    const currentMappings: ItemToValueMapping[] = await db.itemToValueMappings.where({ itemId: item.id }).toArray();
    currentMappings.forEach(async mapping => {
        if (!ids.includes(mapping.valueId)) {
            await db.itemToValueMappings.delete(mapping.id);
        }
    });
    const currentValueIds = currentMappings.map(m => m.valueId);
    ids.filter(id => !currentValueIds.includes(id))
        .forEach(async id => {
            const newMapping: ItemToValueMapping = {
                itemId: item.id!,
                valueId: id
            }
            await db.itemToValueMappings.add(newMapping);
        })
    await markAsEdited(project);
}
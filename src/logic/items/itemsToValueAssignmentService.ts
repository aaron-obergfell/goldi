import { Project } from "../../db/appData";
import { GoldiColumn, GoldiItem, ItemToValueAssignment, ProjectDataRepository, projectDataRepository } from "../../db/projectData";
import { markAsEdited } from "../projects/projectService";

export async function updateValue(project: Project, item: GoldiItem, column: GoldiColumn, value: string | number) {
    if (!column.id || !item.id) {
        throw Error("hä?");
    }
    const db: ProjectDataRepository = projectDataRepository(project.id);
    const assignments: ItemToValueAssignment[] = await db.itemToValueAssignments.where({
        columnId: column.id,
        itemId: item.id
    }).toArray();
    if (assignments.length === 0) {
        if (value === "") {
            return;
        }
        await db.itemToValueAssignments.add({
            columnId: column.id,
            itemId: item.id,
            value: value
        });
        markAsEdited(project);
    } else if  (assignments.length > 1) {
        throw Error("hä?");
    } else {
        await db.itemToValueAssignments.update(assignments[0].id, {value: value});
        markAsEdited(project);
    }
}
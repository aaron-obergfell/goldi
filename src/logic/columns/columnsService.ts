import { Project } from "../../db/appData";
import { GoldiColumn, ProjectDataRepository, projectDataRepository } from "../../db/projectData";
import { markAsEdited } from "../projects/projectService";

export async function addColumn(column: GoldiColumn, project: Project) {
    await projectDataRepository(project.id).columns.add({ ...column, position: await determinePositionForNewColumn(project) });
    await markAsEdited(project);
}


export async function updateColumn(project: Project, goldiColumn: GoldiColumn, newName: string, newDescription: string) {
    try {
        await projectDataRepository(project.id).columns.update(goldiColumn.id, {
            name: newName,
            description: newDescription
        });
        await markAsEdited(project);
    } catch (error) {
        console.error(`Failed to update column: ${goldiColumn}`);
    }
}

async function determinePositionForNewColumn(project: Project): Promise<number> {
    const lastColumn: GoldiColumn | undefined = await projectDataRepository(project.id).columns
        .orderBy("position")
        .last();
    if (lastColumn) {
        return lastColumn.position + 1;
    } else {
        return 1;
    }
}

export async function moveLeft(project: Project, goldiColumn: GoldiColumn) {
    const columnForSwap: GoldiColumn | undefined = await projectDataRepository(project.id).columns
        .orderBy("position")
        .filter((otherColumn) => otherColumn.position < goldiColumn.position)
        .last();
    if (!columnForSwap) {
        console.error("Failed to move to left because it is already at the very left.");
        return;
    }
    await changePosition(project, goldiColumn, columnForSwap);
}

export async function moveRight(project: Project, goldiColumn: GoldiColumn) {
    const columnForSwap: GoldiColumn | undefined = await projectDataRepository(project.id).columns
        .orderBy("position")
        .filter((otherColumn) => otherColumn.position > goldiColumn.position)
        .first();
    if (!columnForSwap) {
        console.error("Failed to move to right because it is already at the very right.");
        return;
    }
    await changePosition(project, goldiColumn, columnForSwap);
}

export async function deleteColumn(project: Project, goldiColumn: GoldiColumn) {
    const db: ProjectDataRepository = projectDataRepository(project.id)
    let valuesCount: number = await db.values.where("columnId").equals(goldiColumn.id!).delete();
    console.info()
    let itemToImageMappingsCount: number = await db.itemToImageMappings.where("columnId").equals(goldiColumn.id!).delete();
    let itemToValueAssignmentsCount: number = await db.itemToValueAssignments.where("columnId").equals(goldiColumn.id!).delete();
    await db.columns.delete(goldiColumn.id);
    await markAsEdited(project);
    console.info(`${valuesCount} values deleted, ${itemToImageMappingsCount} itemToImageMappingsCount deleted, ${itemToValueAssignmentsCount} itemToValueAssignmentsCount deleted.`)
}

async function changePosition(project: Project, goldiColumn1: GoldiColumn, goldiColumn2: GoldiColumn) {
    const oldPositionOfColumn1: number = goldiColumn1.position;
    // update goldiColumn1
    await projectDataRepository(project.id).columns.update(goldiColumn1.id, { position: goldiColumn2.position })
    // update goldiColumn1
    await projectDataRepository(project.id).columns.update(goldiColumn2.id, { position: oldPositionOfColumn1 })
    await markAsEdited(project);
}
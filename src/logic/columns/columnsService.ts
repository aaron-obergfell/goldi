import { Project } from "../../db/appData";
import { GoldiColumn, projectDataRepository } from "../../db/projectData";
import { markAsEdited } from "../projects/projectService";

export async function addColumn(column: GoldiColumn, project: Project) {
    await projectDataRepository(project.id).columns.add({...column, position: await determinePositionForNewColumn(project)});
    await markAsEdited(project);
}


// async function updateColumn() {
//     try {
//         await projectDataRepository(props.projectId).columns.update(props.goldiColumn?.id, {
//             name: name,
//             type: type,
//             visible: visible
//         });
//     } catch (error) {
//         console.error(`Failed to update column: ${props.goldiColumn?.id}`);
//     }
// }

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
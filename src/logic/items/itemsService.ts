import { Project } from "../../db/appData";
import { GoldiColumn, GoldiItem, ProjectDataRepository, projectDataRepository } from "../../db/projectData";
import { markAsEdited } from "../projects/projectService";

export async function createEmptyItem(project: Project) {
    const emptyItem: GoldiItem = {
        titel: "",
        description: ""
    }
    await projectDataRepository(project.id).items.add(emptyItem);
}
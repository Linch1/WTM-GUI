import * as WTM from "wtm-lib";
import { WTMPaths } from "../Enum/paths";
import { guiProjectsJson } from "../Types/project.guiJsonProjects";
import { projectsCache } from "../Types/project.guiProjectsCache";
import { projectJsonInformations } from "../Types/project.jsonInformations";
import { Project } from "./Project";

export class GUIProjects{
    public PROJECTS_CACHE: projectsCache = {};
    public GUI_PATH = window.WTM_GUI.TEMPLATE_PATH as unknown as string;
    public PROJECTS_JSON_DIR_PATH = WTM.StringComposeWriter.concatenatePaths(
        this.GUI_PATH,
        WTMPaths.jsonProjectsDirectory
    );
    public PROJECTS_JSON_FILE_PATH = WTM.StringComposeWriter.concatenatePaths(
        this.PROJECTS_JSON_DIR_PATH,
        WTMPaths.jsonProjectsFile
    );
    public PROJECTS_JSON_INFORMATIONS: guiProjectsJson = {
        projectPaths: []
    }
    constructor(){
        // create the dire and the file if not exists
        WTM.FileWriter.createDirectory(this.PROJECTS_JSON_DIR_PATH);
        WTM.FileWriter.createFile(this.PROJECTS_JSON_FILE_PATH, JSON.stringify(this.PROJECTS_JSON_INFORMATIONS));
        // initalize the json informations
        this.PROJECTS_JSON_INFORMATIONS = JSON.parse(
            WTM.FileReader.readFile(this.PROJECTS_JSON_FILE_PATH)
        );
        this.refreshProjectsCache();
    }
    public saveJson(){
        WTM.FileWriter.writeFile(this.PROJECTS_JSON_FILE_PATH, JSON.stringify(this.PROJECTS_JSON_INFORMATIONS));
    }
    /**
     * @description update the projects cache and return it's values as an array
     */
    public readProjects(): Project[] {
        this.refreshProjectsCache();
        return Object.values(this.PROJECTS_CACHE);
    }
    /**
     * @description update the objects that contains the saved projects,
     * the object is of the type _projectsCache_
     */
    public refreshProjectsCache(): void{
        for ( let projectPath of this.PROJECTS_JSON_INFORMATIONS.projectPaths ){
            let projectInfos: projectJsonInformations = JSON.parse(
                WTM.FileReader.readFile(
                    WTM.StringComposeWriter.concatenatePaths(
                        projectPath,
                        WTMPaths.jsonPathInProjectDirectory,
                        WTMPaths.jsonProjectFIle
                    )
                )
            );
            let project = new Project(projectInfos);
            this.PROJECTS_CACHE[projectInfos.name] = project;
        }
    }
    /**
     * @description get a project by it's name, it returns the project if
     * it is present in the PROJECTS_CACHE else null.
     * @param projectName the name of the project to retrive
     */
    public getProjectByName(projectName: string): Project | undefined{
        if( this.PROJECTS_CACHE[projectName] ) return this.PROJECTS_CACHE[projectName] 
        else return undefined;
    }
    /**
     * @description add a new project
     * @param infos 
     */
    public addProject(infos: projectJsonInformations){
        this.PROJECTS_CACHE[infos.name] = new Project( infos );
        this.PROJECTS_JSON_INFORMATIONS.projectPaths.push(infos.path);
        this.saveJson();
    }
}
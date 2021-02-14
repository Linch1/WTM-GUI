import { projectJsonInformations } from "../Types/project.jsonInformations";
import * as WTM from "wtm-lib";
import { WTMPaths } from '../Enum/paths'

export class Project{
    
    public PROJECT_JSON_FILE_PATH: string;
    public PROJECT_JSON_DIR_PATH: string;

    constructor(
        public PROJECT_JSON_INFORMATIONS: projectJsonInformations
    ){

        this.PROJECT_JSON_DIR_PATH = WTM.StringComposeWriter.concatenatePaths(
            this.getPath(),
            WTMPaths.jsonPathInProjectDirectory,
        )
        this.PROJECT_JSON_FILE_PATH = WTM.StringComposeWriter.concatenatePaths(
            this.PROJECT_JSON_DIR_PATH,
            WTMPaths.jsonProjectFIle
        )
        this.initalize();
    }

    public initalize(){
        WTM.FileWriter.createDirectory(this.PROJECT_JSON_DIR_PATH);
        WTM.FileWriter.createDirectory(this.getViewsPath());
        WTM.FileWriter.createDirectory(this.getVisualsPath());
        WTM.FileWriter.createFile(this.PROJECT_JSON_FILE_PATH, JSON.stringify(this.PROJECT_JSON_INFORMATIONS));
    }
    public saveJson(){
        WTM.FileWriter.writeFile(
            this.PROJECT_JSON_FILE_PATH,
            JSON.stringify(this.PROJECT_JSON_INFORMATIONS)
        )
    }
    public getName(): string{
        return this.PROJECT_JSON_INFORMATIONS.name;
    }
    public getExtension(): WTM.extensions{
        return this.PROJECT_JSON_INFORMATIONS.extension;
    }
    public getViewsPath(): string{
        return this.PROJECT_JSON_INFORMATIONS.viewsPath;
    }
    public getVisualsPath(): string{
        return this.PROJECT_JSON_INFORMATIONS.visualsPath;
    }
    public getPath(): string{
        return this.PROJECT_JSON_INFORMATIONS.path;
    }
    public getScripts(): string[]{
        let scripts = [...this.PROJECT_JSON_INFORMATIONS.scripts, ...this.getVisualsDependenciesScripts()]
        return scripts;
    }
    public getStyles(): string[]{
        let styles = [ ...this.PROJECT_JSON_INFORMATIONS.styles, ...this.getVisualsDependenciesStyles()];
        return styles;
    }
    public getVisualsDependencies(){
        return this.PROJECT_JSON_INFORMATIONS.visualsDependencies;
    }
    public getVisualsDependenciesStyles(): string[]{
        let dependencies = this.PROJECT_JSON_INFORMATIONS.visualsDependencies;
        let styles: string[] = [];
        for ( let key of Object.keys(dependencies)){
            let visualDep = dependencies[key];
            styles.push(...visualDep.styles)
        }
        return styles;
    }
    public getVisualsDependenciesScripts(): string[]{
        let dependencies = this.PROJECT_JSON_INFORMATIONS.visualsDependencies;
        let scripts: string[] = [];
        for ( let key of Object.keys(dependencies)){
            let visualDep = dependencies[key];
            scripts.push(...visualDep.scripts)
        }
        return scripts;
    }
    public setViewsPath(newOne: string){
        this.PROJECT_JSON_INFORMATIONS.viewsPath = newOne;
        this.saveJson();
    }
    public setName(newOne: string){
        this.PROJECT_JSON_INFORMATIONS.name = newOne;
        this.saveJson();
    }
    public setVisualsPath(newOne: string){
        this.PROJECT_JSON_INFORMATIONS.visualsPath = newOne;
        this.saveJson();
    }
    public setPath(newOne: string){
        this.PROJECT_JSON_INFORMATIONS.path = newOne;
        this.saveJson();
    }
    public addScript( path: string){
        if( path.includes(this.getPath())) path = path.replace(this.getPath(), "");
        this.PROJECT_JSON_INFORMATIONS.scripts.push(path);
        this.saveJson();
    }
    public addStyle( path: string){
        if( path.includes(this.getPath())) path = path.replace(this.getPath(), "");
        this.PROJECT_JSON_INFORMATIONS.styles.push(path);
        this.saveJson();
    }
    public refreshVisualsDependencies(){
        let projectVisuals = new WTM.BulkVisual(this.getVisualsPath(), this.getExtension()).getAllVisuals();
        for ( let visual of projectVisuals){
            let stylesDep: string[] = visual.getStylesDependencies();
            let scriptsDep: string[] = visual.getScriptsDependencies();
            console.log(
                visual.getName(),
                stylesDep,
                scriptsDep
            )
            // parse styles dep for replace all the paths that starts with ./ or those who doesn't contains a '/' char
            for ( let i = 0; i<stylesDep.length; i++){
                let path = stylesDep[i]
                // if is relative visual path add the visual abs path at the start
                if( path.startsWith('./') || !path.includes('/') ) {
                    path = path.replace('./', '');
                    path = WTM.StringComposeWriter.concatenatePaths(
                        visual.getStylesDirPath(),
                        path
                    )
                    stylesDep[i] = path;
                }
            }
            // parse scripts dep for replace all the paths that starts with ./ or those who doesn't contains a '/' char
            for ( let i = 0; i<scriptsDep.length; i++){
                let path = scriptsDep[i]
                if( path.startsWith('./') || !path.includes('/') ) {
                    path = path.replace('./', '');
                    path = WTM.StringComposeWriter.concatenatePaths(
                        visual.getScriptsDirPath(),
                        path
                    )
                    scriptsDep[i] = path;
                }
            }
            if( stylesDep.length || scriptsDep.length ){
                this.PROJECT_JSON_INFORMATIONS.visualsDependencies[visual.getName()] = {
                    scripts: scriptsDep,
                    styles: stylesDep
                }
                this.saveJson();
            }
        }
    }

}
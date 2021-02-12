import * as WTM from "wtm-lib";
import { WError } from "../Errors/WtmError";
import { WLogger } from "../Logger/WLogger";
import { ERRORS } from "../Errors/Errors";
import { Project } from "../Project/Project";
const GUI = window.WTM_GUI;

$(document).ready(function() {
    $("#create-project").click( evt => {
        
        let name = $("#project-name").val() as string;
        let extension = $("#project-extension").val() as string;
        let path = $("#project-path").val() as string;
        let visualsPath = $("#project-visuals").val() as string;
        let viewsPath = $("#project-views").val() as string;
        let correct = true;
        if ( !name || name == "" ) { WLogger.log("no name provided"); correct = false}
        if ( !extension || extension == "" ) { WLogger.log("no extension provided"); correct = false}
        if ( !path || path == "" ) { WLogger.log("no path provided"); correct = false}
        if ( !visualsPath || visualsPath == "" ) { visualsPath = WTM.StringComposeWriter.concatenatePaths(path, 'visuals')}
        if ( !viewsPath || viewsPath == "" ) { viewsPath = WTM.StringComposeWriter.concatenatePaths(path, 'Views') }
        if ( !correct ) {
            WError.throw(ERRORS.NO_NAME_OR_EXTENSION_PROVIDED); 
            return;
        }
        if ( GUI.PROJECTS.getProjectByName(name) ){
            WError.throw(ERRORS.PROJECT_ALREADY_PRESENT); 
            return;
        }
        if( !WTM.StringComposeReader.checkValidExtension(extension)) {
            WLogger.log(extension);
            WError.throw(ERRORS.NO_VALID_EXTENSION);
            return;
        }
        GUI.PROJECTS.addProject(
            {
                name: name,
                extension: extension as WTM.extensions,
                path: path,
                visualsPath: visualsPath,
                viewsPath: viewsPath,
                scripts: [],
                styles: [],
                visualsDependencies: {}
            }
        )

    });

    $("#add-project-style").click( evt => {
        let stylePath = $("#project-style-path").val() as string;
        if ( !stylePath || stylePath == "" ) {
            WLogger.log("no path provided");
            WError.throw(ERRORS.NO_PATH_PROVIDED);
        }
        let currentProject = GUI.getCurrentSelectedProject();
        if(!currentProject) return;
        currentProject.addStyle(stylePath);
    });
    $("#add-project-script").click( evt => {
        let scriptPath = $("#project-script-path").val() as string;
        if ( !scriptPath || scriptPath == "" ) {
            WLogger.log("no path provided");
            WError.throw(ERRORS.NO_PATH_PROVIDED);
        }
        let currentProject = GUI.getCurrentSelectedProject();
        if(!currentProject) return;
        currentProject.addScript(scriptPath);
    });
    $("#refresh-project-visual-dependencies").click( evt => {
        let currentProject = GUI.getCurrentSelectedProject();
        if(!currentProject) return;
        currentProject.refreshVisualsDependencies();
    });
});
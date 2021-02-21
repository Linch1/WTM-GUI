import * as WTM from "wtm-lib";
import { WError } from "../Errors/WtmError";
import { WLogger } from "../Logger/WLogger";
import { ERRORS } from "../Errors/Errors";
const GUI = window.WTM_GUI;

$(document).ready(function() {
    $("#create-project").click( evt => {
        
        let name = $("#project-name").val() as string;
        let projectType = GUI.getCurrentSelectedProjectType() as string;
        let path = $("#project-path").val() as string;
        let visualsPath = $("#project-visuals").val() as string;
        let viewsPath = $("#project-views").val() as string;
        let correct = true;
        if ( !name || name == "" ) { WLogger.log("no name provided"); correct = false}
        if ( !projectType || projectType == "" ) { WLogger.log("no projectType provided"); correct = false}
        if ( !path || path == "" ) { WLogger.log("no path provided"); correct = false}
        if ( !visualsPath || visualsPath == "" ) { visualsPath = WTM.StringComposeWriter.concatenatePaths(path, WTM.ConstVisuals.visualsDirectory)}
        if ( !viewsPath || viewsPath == "" ) { viewsPath = WTM.StringComposeWriter.concatenatePaths(path, WTM.ConstViews.viewsDirectory) }
        if ( !correct ) {
            WError.throw(ERRORS.NO_NAME_OR_PORJECT_TYPE_PROVIDED); 
            return;
        }
        if ( GUI.PROJECTS.getProjectByName(name) ){
            WError.throw(ERRORS.PROJECT_ALREADY_PRESENT); 
            return;
        }
        if( !WTM.checkValidProjectType(projectType)) {
            WLogger.log(projectType);
            WError.throw(ERRORS.NO_VALID_PROJECT_TYPE);
            return;
        }
        GUI.PROJECTS.addProject(
            {
                name: name,
                projectType: projectType as WTM.ProjectTypes,
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
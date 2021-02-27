import * as WTM from "wtm-lib";
import { WError } from "../Errors/WtmError";
import { WLogger } from "../Logger/WLogger";
import { ERRORS } from "../Errors/Errors";
import electron from "electron";
import { StringComposeReader } from "wtm-lib";
const remote = electron.remote;
const dialog = remote.dialog;
const GUI = window.WTM_GUI;

$(document).ready(function() {

    $(".pj-folder").click( async evt => {
        evt.preventDefault();
        let target = $(evt.currentTarget);
        var path = await dialog.showOpenDialog( 
            remote.getCurrentWindow(), {
            properties: ['openDirectory']
            }
        ).then( (value) => value.filePaths[0] );
        target.attr("data-dialog-path", path);
        target.parent().find(".pj-folder-label").text( StringComposeReader.getPathLastElem(path))
    });
    $(".pj-folder-visuals").click( async evt => {
        evt.preventDefault();
        let target = $(evt.currentTarget);
        var path = await dialog.showOpenDialog( 
            remote.getCurrentWindow(), {
            properties: ['openDirectory']
            }
        ).then( (value) => value.filePaths[0] );
        target.attr("data-dialog-path", path);
        target.parent().find(".pj-folder-visuals-label").text( StringComposeReader.getPathLastElem(path))
    });
    $(".pj-folder-views").click( async evt => {
        evt.preventDefault();
        let target = $(evt.currentTarget);
        var path = await dialog.showOpenDialog( 
            remote.getCurrentWindow(), {
            properties: ['openDirectory']
            }
        ).then( (value) => value.filePaths[0] );
        target.attr("data-dialog-path", path);
        target.parent().find(".pj-folder-views-label").text( StringComposeReader.getPathLastElem(path))
    });
    

    $("#create-project").click( evt => {
        let name = $("#project-name").val() as string;
        let projectType = GUI.getCurrentSelectedProjectType() as string;
        let form = $("#add-project-form");
        let path = GUI.getFormElementValue(form.find(".pj-folder")) as string;
        let visualsPath = GUI.getFormElementValue(form.find(".pj-folder-visuals")) as string;
        let viewsPath = GUI.getFormElementValue(form.find(".pj-folder-views")) as string;
        let correct = true;
        if ( !name || name == "" ) { WLogger.log("no name provided"); correct = false}
        if ( !projectType || projectType == "" ) { WLogger.log("no projectType provided"); correct = false}
        if ( !path || path == "" ) { WLogger.log("no path provided"); correct = false}
        if ( !correct ) {
            WError.throw(ERRORS.NO_NAME_OR_PORJECT_TYPE_PROVIDED); 
            return;
        }
        if ( !visualsPath || visualsPath == "" ) { visualsPath = WTM.StringComposeWriter.concatenatePaths(path, WTM.ConstVisuals.Directory)}
        if ( !viewsPath || viewsPath == "" ) { viewsPath = WTM.StringComposeWriter.concatenatePaths(path, WTM.ConstViews.Directory) }
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
                author: "",
                autorhUrl: "",
                githubRepo: "",
                assetsAutoImport: false,
                visualsPath: visualsPath,
                viewsPath: viewsPath,
                scripts: [],
                styles: [],
                visualsDependencies: {},
                lib: {}
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
        
        
        currentProject.depManager.addStyle(stylePath);
    });
    $("#add-project-script").click( evt => {
        console.log('clicking')
        let scriptPath = $("#project-script-path").val() as string;
        console.log(scriptPath)
        if ( !scriptPath || scriptPath == "" ) {
            WLogger.log("no path provided");
            WError.throw(ERRORS.NO_PATH_PROVIDED);
        }
        let currentProject = GUI.getCurrentSelectedProject();
        console.log( currentProject )
        if(!currentProject) return;
        console.log( scriptPath )
        currentProject.depManager.addScript(scriptPath);
    });
    $("#refresh-project-visual-dependencies").click( evt => {
        let currentProject = GUI.getCurrentSelectedProject();
        if(!currentProject) return;
        currentProject.depManager.refreshVisualsDependencies();
    });
    
});
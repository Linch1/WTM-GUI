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
        if ( !visualsPath || visualsPath == "" ) { visualsPath = WTM.StringComposeWriter.concatenatePaths(path, WTM.ConstVisuals.Directory)}
        if ( !viewsPath || viewsPath == "" ) { viewsPath = WTM.StringComposeWriter.concatenatePaths(path, WTM.ConstViews.Directory) }
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

    $(".pj-lib-folder").click( async evt => {
        evt.preventDefault();
        let target = $(evt.currentTarget);
        var path = await dialog.showOpenDialog( 
            remote.getCurrentWindow(), {
            properties: ['openDirectory']
            }
        ).then( (value) => value.filePaths[0] );
        target.attr("data-dialog-path", path);
        target.parent().find(".pj-lib-folder-label").text( StringComposeReader.getPathLastElem(path))
    });

    //@ts-ignore
    $("#add-project-lib-form").parsley()
    $("#add-project-lib-form").submit( evt => {
        evt.preventDefault();
        let currentProject = GUI.getCurrentSelectedProject();
        if( !currentProject ) return;
        let form = $("#add-project-lib-form");
        let libName = GUI.getFormElementValue(form.find(".pj-lib-name")) as string;
        let libSite = GUI.getFormElementValue(form.find(".pj-lib-site-url")) as string;
        let libCdn = GUI.getFormElementValue(form.find(".pj-lib-cdn")) as string;
        let libContentPath = GUI.getFormElementValue(form.find(".pj-lib-folder")) as string;
        currentProject.depManager.addLib( libName, {
            cdn: {
                scripts: [],
                styles: []
            },
            url: libSite ? libSite : "",
            scripts: [],
            styles: [],
            visuals: []
        });
        if( libCdn ) currentProject.depManager.addLibCdnScriptOrStyle(libName, libCdn);
        if( libContentPath ) copyFolderInProjectLib(currentProject, libName, libContentPath);
    });
    function copyFolderInProjectLib(project: WTM.Project, libName: string, libContentPath: string) {
        if ( !WTM.FileReader.isDirectory(libContentPath) ) throw new Error(ERRORS.NO_FOLDER_PASSED);
        project.depManager.createLibFromPath(libName, libContentPath);
    }

    //@ts-ignore
    $("#replace-project-lib-content").parsley()
    $("#replace-project-lib-content").submit( evt => {
        evt.preventDefault();
        let currentProject = GUI.getCurrentSelectedProject();
        if( !currentProject ) return;
        let form = $("#replace-project-lib-content");
        let currentLibName = GUI.getCurrentSelectedProjectLib();
        if(!currentLibName) return;
        let libContentPath = GUI.getFormElementValue(form.find(".pj-lib-folder")) as string;
        if( libContentPath ) copyFolderInProjectLib(currentProject, currentLibName, libContentPath);
    });

    //@ts-ignore
    $("#add-project-lib-cdn-form").parsley()
    $("#add-project-lib-cdn-form").submit( evt => {
        evt.preventDefault();
        let currentProject = GUI.getCurrentSelectedProject();
        if( !currentProject ) return;
        let form = $("#add-project-lib-cdn-form");
        let currentLibName = GUI.getCurrentSelectedProjectLib();
        if(!currentLibName) return;
        let libCdn = GUI.getFormElementValue(form.find(".pj-lib-cdn")) as string;
        if( libCdn ) currentProject.depManager.addLibCdnScriptOrStyle(currentLibName, libCdn);
    });

    
});
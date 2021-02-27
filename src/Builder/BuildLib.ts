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
            styles: []
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

    $("#add-project-assets").click( evt => {
        let stylesPaths = GUI.getCurrentSelectedFolderTreeFiles(".project-styles > .folder-path");
        let scriptsPaths = GUI.getCurrentSelectedFolderTreeFiles(".project-scripts > .folder-path");
        let currentProject = GUI.getCurrentSelectedProject();
        if(!currentProject) return;
        currentProject.depManager.setScripts(scriptsPaths);
        currentProject.depManager.setStyles(stylesPaths);
    });

    $("#add-project-lib-assets").click( evt => {
        let stylesPaths = GUI.getCurrentSelectedFolderTreeFiles(".lib-styles > .folder-path");
        let scriptsPaths = GUI.getCurrentSelectedFolderTreeFiles(".lib-scripts > .folder-path");

        console.log(stylesPaths, scriptsPaths)
        let currentProject = GUI.getCurrentSelectedProject();
        if(!currentProject) return;
        let currentLib = GUI.getCurrentSelectedProjectLib();
        if(!currentLib) return;
        currentProject.depManager.setLibScripts(currentLib, scriptsPaths);
        currentProject.depManager.setLibStyles(currentLib, stylesPaths);
    });

    $("#remove-project-lib-cdn").click( evt => {

        let stylesPaths = GUI.getCurrentSelectedFolderTreeFiles(".lib-styles-cdn > .folder-path");
        let scriptsPaths = GUI.getCurrentSelectedFolderTreeFiles(".lib-scripts-cdn > .folder-path");

        let currentProject = GUI.getCurrentSelectedProject();
        if(!currentProject) return;
        let currentLib = GUI.getCurrentSelectedProjectLib();
        if(!currentLib) return;
        
        // remove from scripts and folders the fake-path
        let FAKE_FOLDER_CDN_SCRIPTS = "cdn-scripts"; // same variable used for populate the cdn scripts
        let FAKE_FOLDER_CDN_STYLES = "cdn-styles"; // same variable used for populate the cdn styles
        for ( let i = 0; i < stylesPaths.length; i++ ){
            stylesPaths[i] = stylesPaths[i].replace( `${FAKE_FOLDER_CDN_STYLES}/`, '');
        }
        for ( let i = 0; i < scriptsPaths.length; i++ ){
            scriptsPaths[i] = scriptsPaths[i].replace( `${FAKE_FOLDER_CDN_SCRIPTS}/`, '');
        }

        // actually removing them
        currentProject.depManager.removeMultipleLibCdnScriptsOrStyles(currentLib, [...scriptsPaths, ...stylesPaths]);
    });

    $("#reorder-lib").click( evt => {
        let newLibOrder = GUI.retriveLibReordered();
        let currentProject = GUI.getCurrentSelectedProject();
        if( !currentProject ) return;
        for  ( let i = 0; i < newLibOrder.length; i++ ){
            currentProject.depManager.setLibOrder( newLibOrder[i], i);
        }
    });
    
});
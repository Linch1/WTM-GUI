import * as WTM from "wtm-lib";
import { WError } from "../Errors/WtmError";
import { WLogger } from "../Logger/WLogger";
import { ERRORS } from "../Errors/Errors";
const electron = require("electron");
const BrowserWindow = electron.remote.BrowserWindow;
const GUI = window.WTM_GUI;

/**
 * @description analize and retrive the edits made to the views drag and drop
 */
function saveNewViewContent(){

}

$(document).ready(function() {

    $("#create-view").click( evt => { 
        let currentProject = GUI.getCurrentSelectedProject();
        if( !currentProject ) return;
        
        let name = $("#view-name").val() as string;
        let projectType = GUI.getCurrentSelectedProjectType() as string;
        console.log(projectType);
        WLogger.log(name + projectType);
        if ( !name || name == "" ) WLogger.log("no name provided");
        if ( !projectType || projectType == "" ) WLogger.log("no project type provided");
        if ( !name || name == "" || !projectType || projectType == "" ) {
            WError.throw(ERRORS.NO_NAME_OR_PORJECT_TYPE_PROVIDED); 
            return
        }
        if( !WTM.checkValidProjectType(projectType)) {
            WLogger.log(projectType);
            WError.throw(ERRORS.NO_VALID_PROJECT_TYPE);
            return 
        }
        new WTM.View(name, currentProject).create();
    });
    $("#add-block").click( evt => { 

        let blockName = $("#block-name").val() as string;
        let blockOpen = $("#block-open").val() as string;
        let blockClose = $("#block-close").val() as string;

        if ( !blockName || blockName == "" ) WLogger.log("no block name provided");
        if ( !blockName || blockName == "" ) {
            WError.throw(ERRORS.NO_BLOCK_NAME_PROVIDED); 
            return
        }
        
        let currentView = GUI.getCurrentSelectedView();
        let currentBlock = GUI.getCurrentSelectedViewBlock();
        if(!currentBlock || !currentView) return;

        currentView.addBlock({
            parentBlockName: currentBlock,
            blockName: blockName,
            open: blockOpen,
            close: blockClose
        });
    });

    // $("#include-path").click( evt => {
    //     let path = $("#path-to-include").val() as string;

    //     let currentView = GUI.getCurrentSelectedView();
    //     let currentBlock = GUI.getCurrentSelectedViewBlock();
    //     if(!currentView || !currentBlock) return;
    //     currentView.includeRelative(
    //         currentBlock,
    //         path
    //     )
    // });
    $("#view-demo").click( evt => {
        let currentView = GUI.getCurrentSelectedView();
        if( !currentView ) return;
        let viewPath = currentView.getPath();
        let win = new BrowserWindow({
            backgroundColor: '#FFF', // Add this new line
            width: 1200,
            height: 750,
            // frame: false,
            frame: true,
            webPreferences: {
              nodeIntegration: true,
              enableRemoteModule: true,
              webSecurity: false
            },
          });
          win.loadFile(viewPath);
    });
    
    $("#include-visual").click( evt => {
        let visual = GUI.getCurrentSelectedVisual();
        let currentView = GUI.getCurrentSelectedView();
        let currentBlock = GUI.getCurrentSelectedViewBlock();
        if(!visual || !currentView || !currentBlock) return;

        currentView.includeRelative(
            currentBlock,
            visual
        )
    });
    $("#save-view-drag-drop").click( evt => {
        let view = GUI.getCurrentSelectedView();
        if(!view) return;
        view.setBlocks(GUI.retriveViewReorderedPaths());
        view.reCreate();
    });
});
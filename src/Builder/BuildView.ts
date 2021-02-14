import * as WTM from "wtm-lib";
import { WError } from "../Errors/WtmError";
import { WLogger } from "../Logger/WLogger";
import { ERRORS } from "../Errors/Errors";
const GUI = window.WTM_GUI;

/**
 * @description analize and retrive the edits made to the views drag and drop
 */
function saveNewViewContent(){

}

$(document).ready(function() {

    $("#create-view").click( evt => { 
        let folderPath = $("#folder-path").val() as string;
        let name = $("#view-name").val() as string;
        let extension = $("#view-extension").val() as string;
        WLogger.log(name + extension);
        if ( !name || name == "" ) WLogger.log("no name provided");
        if ( !extension || extension == "" ) WLogger.log("no extension provided");
        if ( !name || name == "" || !extension || extension == "" ) {
            WError.throw(ERRORS.NO_NAME_OR_EXTENSION_PROVIDED); 
            return
        }
        if( !WTM.StringComposeReader.checkValidExtension(extension)) {
            WLogger.log(extension);
            WError.throw(ERRORS.NO_VALID_EXTENSION);
            return 
        }
        new WTM.View(folderPath, name, extension as WTM.extensions).create();
    });
    $("#add-block").click( evt => { 

        let blockName = $("#block-name").val() as string;
        let blockOpen = $("#block-open").val() as string;
        let blockClose = $("#block-close").val() as string;

        if ( !blockName || blockName == "" ) WLogger.log("no block name provided");
        if ( !blockName || blockName == "" ) {
            WError.throw(ERRORS.NO_NAME_OR_EXTENSION_PROVIDED); 
            return
        }
        
        let currentView = GUI.getCurrentSelectedView();
        let currentBlock = GUI.getCurrentSelectedViewBlock();
        if(!currentBlock || !currentView) return;

        currentView.addBlock({
            identifier_name: currentBlock,
            blockName: blockName,
            open: blockOpen,
            close: blockClose
        });
    });

    $("#include-path").click( evt => {
        let path = $("#path-to-include").val() as string;

        let currentView = GUI.getCurrentSelectedView();
        let currentBlock = GUI.getCurrentSelectedViewBlock();
        if(!currentView || !currentBlock) return;

        currentView.includeRelative(
            currentBlock,
            path
        )
    });
    $("#include-visual").click( evt => {
        let visual = GUI.getCurrentSelectedVisual();
        let currentView = GUI.getCurrentSelectedView();
        let currentBlock = GUI.getCurrentSelectedViewBlock();
        if(!visual || !currentView || !currentBlock) return;

        let renderPath = visual.getRenderFilePath();
        console.log(renderPath, visual.getDirPath())
        if( renderPath.includes(GUI.TEMPLATE_PATH)) renderPath = renderPath.replace(GUI.TEMPLATE_PATH, "");
        currentView.includeRelative(
            currentBlock,
            renderPath
        )
    });
    $("#save-view-drag-drop").click( evt => {
        let view = GUI.getCurrentSelectedView();
        if(!view) return;
        view.setBlocks(GUI.retriveViewReorderedPaths());
    });
});
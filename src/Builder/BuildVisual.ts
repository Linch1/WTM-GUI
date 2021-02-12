import * as WTM from "wtm-lib";
import { ERRORS } from "../Errors/Errors";
import { WError } from "../Errors/WtmError";
import { WLogger } from "../Logger/WLogger";

const GUI = window.WTM_GUI;

// visual.writer.editDefaultHtml(`
// <input type="text" name="" id="" value="" placeholder="Insert the visual name">
// `);


/**
 * @description populate the identifiers of all the visuals and render them
 * @param visuals a list of visuals
 * @param type the render type
 */
function renderVisuals(visuals: WTM.Visual[], type: WTM.renderTypes){
    WLogger.log(`Compiling visuals. Type: ${type}`);
    for ( let visual of visuals ){
        visual.writer.populateIdentifiers();
        visual.converter.render(type);
    }
}
/**
 * @description populate the identifiers of the given visual and render it
 * @param visuals a list of visuals
 * @param type the render type
 */
function renderVisual(visual: WTM.Visual, type: WTM.renderTypes){
    WLogger.log(`Compiling visual ${visual.getName()}. Type: ${type}`);
    visual.writer.populateIdentifiers();
    visual.converter.render(type);

}
$(document).ready(function() {
    
    let bulkVisuals: WTM.BulkVisual = new WTM.BulkVisual(process.env.PWD + "/visuals");
    let visuals: WTM.Visual[] = bulkVisuals.getAllVisuals();

    $(".render-visuals").click( (e) => { renderVisuals(visuals, $(e.currentTarget).attr("data-type") as WTM.renderTypes ); });
    $(".render-selected-visual").click( (e) => { 
        let targetSelect = $(`[data-name='${$(e.currentTarget).attr("data-select-target")}']`).find("select");
        let visualPath = targetSelect.find(":selected").val() as string;
        let visualExtension = targetSelect.find(":selected").attr("data-extension") as string;
        WLogger.log(visualPath);
        if( !WTM.StringComposeReader.checkValidExtension(visualExtension)) {
            WLogger.log(visualExtension);
            WError.throw(ERRORS.NO_VALID_EXTENSION);
            return;
        }
        renderVisual( new WTM.Visual(visualPath, visualExtension as WTM.extensions), $(e.currentTarget).attr("data-type") as WTM.renderTypes ); 
    });

    $(".update-selected-visual").click( (e) => { 
        let targetSelect = $(`[data-name='${$(e.currentTarget).attr("data-select-target")}']`).find("select");
        let visualPath = targetSelect.find(":selected").val() as string;
        let visualExtension = targetSelect.find(":selected").attr("data-extension") as string;
        let targetTextarea = $(`[data-name='${$(e.currentTarget).attr("data-textarea-target")}']`).find("textarea");
        WLogger.log(visualPath);
        if( !WTM.StringComposeReader.checkValidExtension(visualExtension)) {
            WLogger.log(visualExtension);
            WError.throw(ERRORS.NO_VALID_EXTENSION);
            return;
        }
        new WTM.Visual(visualPath, visualExtension as WTM.extensions).Vupdate(targetTextarea.val() as string, $(e.currentTarget).attr("data-type") as WTM.renderTypes);
    });

    $(".create-visual").click( evt => { 
        let name = $("#visual-name").val() as string;
        let extension = $("#visual-extension").val() as string;
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
        new WTM.Visual(GUI.VISUALS_PATH + name, extension as WTM.extensions).writer.createVisual();
    });
    $("#add-visual-style").click( evt => {
        let stylePath = $("#visual-style-path").val() as string;
        if ( !stylePath || stylePath == "" ) {
            WLogger.log("no path provided");
            WError.throw(ERRORS.NO_PATH_PROVIDED);
        }
        let currentVisual = GUI.getCurrentSelectedVisual();
        if(!currentVisual) return;
        currentVisual.writer.addStyle(stylePath);
    });
    $("#add-visual-script").click( evt => {
        let scriptPath = $("#visual-script-path").val() as string;
        if ( !scriptPath || scriptPath == "" ) {
            WLogger.log("no path provided");
            WError.throw(ERRORS.NO_PATH_PROVIDED);
        }
        let currentVisual = GUI.getCurrentSelectedVisual();
        if(!currentVisual) return;
        currentVisual.writer.addScript(scriptPath);
    });
});

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

    $(".render-visuals").click( (e) => { 
        let currentProject = GUI.getCurrentSelectedProject();
        if(!currentProject) return;
        let bulk: WTM.BulkVisual = new WTM.BulkVisual(GUI.TEMPLATE_PATH + `/${WTM.ConstVisuals.visualsDirectory}`, currentProject.getProjectType());
        renderVisuals(
            bulk.getAllVisuals(),
            $(e.currentTarget).attr("data-type") as WTM.renderTypes 
        ); 
    });
    $(".render-selected-visual").click( (e) => { 
        let currentVisual = GUI.getCurrentSelectedVisual();
        if( !currentVisual ) return;
        renderVisual( 
            currentVisual, 
            $(e.currentTarget).attr("data-type") as WTM.renderTypes 
        ); 
    });

    $(".update-selected-visual").click( (e) => { 
        let currentVisual = GUI.getCurrentSelectedVisual();
        if( !currentVisual ) return;
        let targetTextarea = $(`[data-name='${$(e.currentTarget).attr("data-textarea-target")}']`).find("textarea");
        currentVisual.Vupdate(targetTextarea.val() as string, $(e.currentTarget).attr("data-type") as WTM.renderTypes);
    });

    $(".create-visual").click( evt => { 
        
        if( !GUI.getCurrentSelectedProject() ) return;

        let name = $("#visual-name").val() as string;
        let projectType = GUI.getCurrentSelectedProjectTypeVisualsSection() as string;
        WLogger.log(name + projectType);
        if ( !name || name == "" ) WLogger.log("no name provided");
        if ( !projectType || projectType == "" ) WLogger.log("no projectType provided");
        if ( !name || name == "" || !projectType || projectType == "" ) {
            WError.throw(ERRORS.NO_NAME_OR_PORJECT_TYPE_PROVIDED); 
            return
        }
        if( !WTM.checkValidProjectType(projectType)) {
            WLogger.log(projectType);
            WError.throw(ERRORS.NO_VALID_PROJECT_TYPE);
            return 
        }
        console.log(GUI.VISUALS_PATH + name);
        new WTM.Visual(GUI.VISUALS_PATH + name, projectType as WTM.ProjectTypes).writer.createVisual();
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

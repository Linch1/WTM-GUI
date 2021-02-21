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
    for ( let visual of visuals ){
        renderVisual( visual, type );
    }
}
/**
 * @description populate the identifiers of the given visual and render it
 * @param visuals a list of visuals
 * @param type the render type
 */
function renderVisual(visual: WTM.Visual, type: WTM.renderTypes){
    if( visual.isCreated() ) {
        WLogger.log(`Compiling visual ${visual.getName()}. Type: ${type}`);
        visual.writer.populateIdentifiers();
        visual.converter.render(type);
    } else {
        let fbVisual = visual.getFallbackVisual();
        WLogger.log(`FALLBACK: Compiling visual ${visual.getName()}. Type: ${type}`);
        if( fbVisual ) {
            fbVisual.writer.populateIdentifiers();
            fbVisual.converter.render(type);
        };
    }

}
$(document).ready(function() {

    $("#render-visuals").click( (e) => { 
        let currentProject = GUI.getCurrentSelectedProject();
        if(!currentProject) return;
        let bulk: WTM.BulkVisual = new WTM.BulkVisual(currentProject.getVisualsPath(), currentProject.getProjectType());
        renderVisuals(
            bulk.getAllVisualsFiltered(),
            WTM.renderTypes.HTML
        ); 
    });
    $("#render-selected-visual").click( (e) => { 
        let currentVisual = GUI.getCurrentSelectedVisual();
        if( !currentVisual ) return;
        renderVisual( 
            currentVisual, 
            WTM.renderTypes.HTML
        ); 
    });

    $("#update-selected-visual").click( (e) => { 
        let currentVisual = GUI.getCurrentSelectedVisual();
        if( !currentVisual ) return;
        let targetTextarea = $(`[data-name='${$(e.currentTarget).attr("data-textarea-target")}']`).find("textarea");
        currentVisual.Vupdate( targetTextarea.val() as string, WTM.renderTypes.HTML );
    });

    $("#create-visual").click( evt => { 
        let currentProject = GUI.getCurrentSelectedProject()
        if( !currentProject ) return;

        let name = $("#visual-name").val() as string;
        let projectType = GUI.getCurrentSelectedProjectType() as string;
        WLogger.log(`Name: ${name}, Type: ${projectType}`);
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
        new WTM.Visual(currentProject.getVisualsPath(), name, projectType as WTM.ProjectTypes).writer.createVisual();
    });
    $("#create-non-existing-visuals").click( evt => { 
        let currentProject = GUI.getCurrentSelectedProject()
        if( !currentProject ) return;
        let bulkVisuals: WTM.BulkVisual = new WTM.BulkVisual(  currentProject.getVisualsPath(), currentProject.getProjectType() );
        let visuals: WTM.Visual[] = bulkVisuals.getAllVisuals();
        for (let visual of visuals) {
            if( !visual.isCreated()) visual.writer.createVisual();
        }
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

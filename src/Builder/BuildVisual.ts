import * as WTM from "wtm-lib";
import { StringComposeWriter } from "wtm-lib";
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
    let currentProject = GUI.getCurrentSelectedProject();
    if( visual.isCreated() ) {
        WLogger.log(`Compiling visual ${visual.getName()}. Type: ${type}`);
        visual.writer.populateIdentifiers();
        visual.converter.render(type, currentProject);
    } else {
        let fbVisual = visual.getFallbackVisual();
        WLogger.log(`FALLBACK: Compiling visual ${visual.getName()}. Type: ${type}`);
        if( fbVisual ) {
            fbVisual.writer.populateIdentifiers();
            fbVisual.converter.render(type, currentProject);
        };
    }

}
$(document).ready(function() {

    $("#render-visuals").click( (e) => { 
        let currentProject = GUI.getCurrentSelectedProject();
        console.log(currentProject)
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

    //@ts-ignore
    $("#add-visual-form").parsley()
    $("#add-visual-form").submit( evt => {
        evt.preventDefault();
        let currentProject = GUI.getCurrentSelectedProject()
        if( !currentProject ) return;

        let form = $("#add-visual-form");
        let name = GUI.getFormElementValue(form.find(".visual-name")) as string;
        let automaticallyAddIMports = GUI.getFormElementValue(form.find(".import-all-lib")) as boolean;
        let author = GUI.getFormElementValue(form.find(".visual-author")) as string;
        let authorUrl = GUI.getFormElementValue(form.find(".visual-author-url")) as string;
        let githubRepo = GUI.getFormElementValue(form.find(".visual-github-repo")) as string;
        let projectType = GUI.getCurrentSelectedProjectType() as string;
        
        new WTM.Visual(currentProject.getVisualsPath(), {
            name: name,
            projectPath: currentProject.getPath(),
            projectType: projectType as WTM.ProjectTypes,
            assetsAutoImport: automaticallyAddIMports,
            author: author,
            authorUrl: authorUrl,
            githubRepo: githubRepo
        }).writer.createVisual();
    });

    $("#import-visual-assets").click( evt => {
        let currentVisual = GUI.getCurrentSelectedVisual();
        if( !currentVisual ) return;
        currentVisual.depManager.autoImportAllCssAndJs();
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

    //@ts-ignore
    $("#add-visual-style-form").parsley()
    $("#add-visual-style-form").submit( evt => {
        evt.preventDefault();
        let form = $("#add-visual-style-form");
        let stylePath = GUI.getFormElementValue(form.find(".visual-style-path")) as string;
        if( stylePath.includes('./') ) stylePath = stylePath.replace( './', '');
        let currentVisual = GUI.getCurrentSelectedVisual();
        if(!currentVisual) return;
        currentVisual.depManager.addStyle(stylePath);
    });

    //@ts-ignore
    $("#add-visual-script-form").parsley()
    $("#add-visual-script-form").submit( evt => {
        evt.preventDefault();
        let form = $("#add-visual-script-form");
        let scriptPath = GUI.getFormElementValue(form.find(".visual-script-path")) as string;
        if ( !scriptPath || scriptPath == "" ) {
            WLogger.log("no path provided");
            WError.throw(ERRORS.NO_PATH_PROVIDED);
        }
        let currentVisual = GUI.getCurrentSelectedVisual();
        console.log( currentVisual );
        if(!currentVisual) return;
        currentVisual.depManager.addScript(scriptPath);
    });

    $("#add-folder-tree-selected-files").click( evt => {
        let stylesPaths = GUI.getCurrentSelectedFolderTreeFiles(".visuals-styles .folder-path");
        let scriptsPaths = GUI.getCurrentSelectedFolderTreeFiles(".visuals-scripts .folder-path");
        let currentVisual = GUI.getCurrentSelectedVisual();
        if(!currentVisual) return;
        currentVisual.depManager.setScripts(scriptsPaths);
        currentVisual.depManager.setStyles(stylesPaths);
    });

    

});

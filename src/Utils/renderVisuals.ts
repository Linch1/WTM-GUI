import * as WTM from "wtm-lib";
let projectType: WTM.ProjectTypes = WTM.ProjectTypes.ejs;
let visualsPath: string = '/home/pero/projects/WTM/GUI/WTM-VISUALS';
let bulk: WTM.BulkVisual = new WTM.BulkVisual(visualsPath, projectType);
for ( let visual of bulk.getAllVisuals() ){
    visual.writer.populateIdentifiers();
    visual.converter.render(WTM.renderTypes.HTML);
}
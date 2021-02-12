import * as WTM from "wtm-lib";
import { ERRORS } from "../Errors/Errors";
import { WError } from "../Errors/WtmError";
import { WLogger } from "../Logger/WLogger";
import { GUIProjects } from "../Project/GUIProjects"
import { Project } from "../Project/Project";

/**
 * ADD SOME PROPERTIES IN THE WINDOW
 */
window.WTM_LIB = WTM;
// @ts-ignore
window.WTM_GUI = {}
const GUI = window.WTM_GUI;
GUI.TEMPLATE_PATH = process.env.PWD as string;
GUI.VISUALS_PATH = GUI.TEMPLATE_PATH + "/visuals/" as string;
GUI.VIEWS_PATH = GUI.TEMPLATE_PATH + "/Views/" as string;
GUI.PROJECTS = new GUIProjects();
GUI.WLogger = WLogger.log;

const
VISUALS_SELECT: string = "VISUALS-SELECT",
VISUALS_TEXTAREA: string = "VISUALS-TEXTAREA",
VIEWS_SELECT: string = "VIEWS-SELECT",
VIEW_BLOCKS_SELECT: string = "VIEW-BLOCKS-SELECT",
PROJECTS_SELECT: string = "PROJECTS-SELECT",
ADD_SCRIPTS: string = "ADD-SCRIPTS",
ADD_STYLES: string = "ADD-STYLES";


/**
 * @description returns the selected project
 */
GUI.getCurrentSelectedProject = () => {
  WLogger.log(` Retriving selected project `);
  let currentSelected = $(`[data-name='${PROJECTS_SELECT}']`).find(":selected");
  let name = currentSelected.attr("data-name") as string;
  if(!name) return undefined;
  else return GUI.PROJECTS.getProjectByName(name)
}
/**
 * @description returns the selected visual
 */
GUI.getCurrentSelectedVisual = () => {
  WLogger.log(` Retriving selected visual `);
  let currentSelected = $(`[data-name='${VISUALS_SELECT}']`).find(":selected");
  let visualFolderPath = currentSelected.val() as string;
  let visualExtension = currentSelected.attr("data-extension") as string;
  if(!visualFolderPath || !visualExtension) return undefined;
  if( !WTM.StringComposeReader.checkValidExtension(visualExtension)) {
      WLogger.log(visualExtension);
      WError.throw(ERRORS.NO_VALID_EXTENSION);
      return 
  }
  else return new WTM.Visual(visualFolderPath, visualExtension as WTM.extensions);
}
/**
 * @description returns the selected view
 */
GUI.getCurrentSelectedView = () => {
  WLogger.log(` Retriving selected view `);
  let currentSelectedView = $(`[data-name='${VIEWS_SELECT}']`).find(":selected");
  let parentAbsPath = currentSelectedView.attr('data-parentPath') as string;
  let name = currentSelectedView.attr('data-name') as string;
  let extension = currentSelectedView.attr('data-extension') as string;
  if( !parentAbsPath || !name || !extension) return undefined;
  if( !WTM.StringComposeReader.checkValidExtension(extension)) {
    WLogger.log(extension);
    WError.throw(ERRORS.NO_VALID_EXTENSION);
    return 
}
  else return new WTM.View(parentAbsPath, name, extension as WTM.extensions);
}
/**
 * @description returns the selected view block
 */
GUI.getCurrentSelectedViewBlock = () => {
  WLogger.log(` Retriving selected block `);
  let block = $(`[data-name='${VIEW_BLOCKS_SELECT}']`).find(":selected").val() as string;
  if(!block) return undefined;
  else return block;
}
/**
 * @description add the project scripts where the ADD-SCRIPTS executable identifier is present
 */
GUI.populateScripts = (div: JQuery<HTMLElement>) => {
  WLogger.log(` Populating scripts `);
  let currentProject = GUI.getCurrentSelectedProject() ;
  if(!currentProject) return;
  for( let scriptPath of currentProject.getScripts()){
    div.append(` <script src="${scriptPath}" type="text/javascript"></script> `);
  }
}
/**
 * @description add the project styles where the ADD-STYLES executable identifier is present
 */
GUI.populateStyles = (div: JQuery<HTMLElement>) =>  {
  WLogger.log(` Populating styles `);
  let currentProject = GUI.getCurrentSelectedProject() ;
  if(!currentProject) return;
  console.log(currentProject.getStyles())
  for( let stylePath of currentProject.getStyles()){
    console.log(stylePath)
    div.append(` <link rel="stylesheet" type="text/css" href="${stylePath}"> `);
  }
}
/**
 * @description populate the passed select with the existing visuals of the current project
 * @param parentSelect a select jquery element
 */
GUI.populateProjects = (parentSelect: JQuery<HTMLElement>) =>  {
  WLogger.log(` Populating projects `);
  parentSelect.empty();
  let projects = GUI.PROJECTS.readProjects();
  for (let project of projects) {
    let name = project.getName();
    let path = project.getPath();
    let visualsPath = project.getVisualsPath();
    let viewsPath = project.getVisualsPath();
    let extension = project.getExtension();
    parentSelect.append(`<option 
    data-name="${name}" data-extension="${extension}"
    data-visualsPath="${visualsPath}" data-viewsPath="${viewsPath}"
    data-path="${path}" >${name}</option>`);
  }
}
/**
 * @description populate the passed select with the existing visuals of the current project
 * @param parentSelect a select jquery element
 */
GUI.populateVisuals = (parentSelect: JQuery<HTMLElement>) =>  {
  WLogger.log(` Populating visuals `);
  parentSelect.empty();

  let currentProject = GUI.getCurrentSelectedProject();
  if(!currentProject) return;

  let bulkVisuals: WTM.BulkVisual = new WTM.BulkVisual(  currentProject.getVisualsPath() );
  let visuals: WTM.Visual[] = bulkVisuals.getAllVisuals();
  for (let visual of visuals) {
    let name: string = visual.getName();
    let path: string = visual.getDirPath();
    let extension: string = visual.getExtension();
    parentSelect.append(`<option value="${path}" data-extension="${extension}" >${name}</option>`);
  }
}
/**
 * @description populate the passed select with the existing views of the current project
 * @param parentSelect a select jquery element
 */
GUI.populateViews = (parentSelect: JQuery<HTMLElement>) => {
  WLogger.log(` Populating views `);
  parentSelect.empty();
  
  let currentView = GUI.getCurrentSelectedProject();
  if(!currentView) return;

  let currentViewsPath = currentView.getViewsPath();
  let bulkViews: WTM.BulkView = new WTM.BulkView( currentViewsPath, 'view' );
  let views: WTM.View[] = bulkViews.getAllViews();
  for (let view of views) {
    let name: string = view.getName();
    let parentPath: string = GUI.VIEWS_PATH;
    let extension: string = view.getExtension();
    parentSelect.append(`<option data-parentPath="${parentPath}" data-extension="${extension}" data-name="${name}" >${name}</option>`);
  }
}
/**
 * @description populate the passed select with the existing blocks of the current selected view
 * @param parentSelect a select jquery element
 */
GUI.populateViewBlocks = (parentSelect: JQuery<HTMLElement>) => {
  WLogger.log(` Populating blocks `);
  parentSelect.empty();
  
  let view: WTM.View | undefined = GUI.getCurrentSelectedView();
  if(!view) return

  let viewBlocks: string[] = view.getBlocks();
  for (let block of viewBlocks) {
    parentSelect.append(`<option value="${block}" >${block}</option>`);
  }
}

/**
 * DECLARE THE DEFAULT EXECUTABLE IDENTIFIERS FUNCTIONS
 */
// process.env.PWD + "/visuals"
const
DefaultExecutable: {
    [key: string]: {
      params: string[];
      callback: (...args: any[]) => any;
    };
  } = {
    PROJECTS_SELECT: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${PROJECTS_SELECT}`);
        let container = $(`[data-name='${PROJECTS_SELECT}']`);
        if (!container.length) {
          WError.throw(ERRORS.NO_IDENTIFIER_FOUND);
          return;
        }
        let parentSelect = $("<select></select>");
        GUI.populateProjects(parentSelect);
        container.append(parentSelect);

        // add listener to change the text contained in the visuals textarea ( used for update them )
        $(`[data-name='${PROJECTS_SELECT}']`).change( evt => {
          let viewsSelect = $(`[data-name='${VIEWS_SELECT}']`).find("select");
          let visualsSelect = $(`[data-name='${VISUALS_SELECT}']`).find("select");
          let blockSelect = $(`[data-name='${VIEW_BLOCKS_SELECT}']`).find("select");
          GUI.populateViews(viewsSelect);
          GUI.populateViewBlocks(blockSelect);
          GUI.populateVisuals(visualsSelect);
        });

        return container;
      }
    },
    ADD_SCRIPTS: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${ADD_SCRIPTS}`);
        let container = $(`[data-name='${ADD_SCRIPTS}']`);
        GUI.populateScripts(container);
        return container;
      }
    },
    ADD_STYLES: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${ADD_STYLES}`);
        let container = $(`[data-name='${ADD_STYLES}']`);
        GUI.populateStyles(container);
        return container;
      }
    },
    VISUALS_SELECT: {
      params: [GUI.TEMPLATE_PATH],
      callback: (visualsPath: string) => {
        WLogger.log(` Executing ${VISUALS_SELECT}`);
        let container = $(`[data-name='${VISUALS_SELECT}']`);
        if (!container.length) {
          WError.throw(ERRORS.NO_IDENTIFIER_FOUND);
          return;
        }
        let parentSelect = $("<select></select>");
        GUI.populateVisuals(parentSelect);
        container.append(parentSelect);

        // add listener to change the text contained in the visuals textarea ( used for update them )
        $(`[data-name='${VISUALS_SELECT}']`).change( evt => {
          
          let visual = GUI.getCurrentSelectedVisual();
          if(!visual) return;

          $(`[data-name='${VISUALS_TEXTAREA}']`).find("textarea").val(visual.getHtmlDefault());
        });

        return container;
      },
    },
    VISUALS_TEXTAREA: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${VISUALS_TEXTAREA}`);
        let container = $(`[data-name='${VISUALS_TEXTAREA}']`);
        if (!container.length) {
          WError.throw(ERRORS.NO_IDENTIFIER_FOUND);
          return;
        }
        let textarea = $(`<textarea name="" id="" cols="30" rows="10"></textarea>`);
        container.append(textarea);
        return container;
      },
    },
    VIEWS_SELECT: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${VIEWS_SELECT}`);
        let container = $(`[data-name='${VIEWS_SELECT}']`);
        if (!container.length) {
          WError.throw(ERRORS.NO_IDENTIFIER_FOUND);
          return;
        }
        let parentSelect = $("<select></select>");
        GUI.populateViews(parentSelect);
        container.append(parentSelect);

        // add listener to change the view blocks
        $(`[data-name='${VIEWS_SELECT}']`).change( evt => {
          let parentSelect = $(`[data-name='${VIEW_BLOCKS_SELECT}']`).find("select");
          GUI.populateViewBlocks(parentSelect);
        });

        return container;
      },
    },
    VIEW_BLOCKS_SELECT: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${VIEW_BLOCKS_SELECT}`);
        let container = $(`[data-name='${VIEW_BLOCKS_SELECT}']`);
        if (!container.length) {
          WError.throw(ERRORS.NO_IDENTIFIER_FOUND);
          return;
        }
        let parentSelect = $("<select></select>");
        GUI.populateViewBlocks(parentSelect);
        container.append(parentSelect);
        return container;
      }
    }
  };


/**
 * EXECUTE THE DEFAULT EXECUTABLE IDENTIFIERS FUNCTIONS
 */
$(document).ready(function () {
  for (let key in DefaultExecutable) {
    let params: string[] = DefaultExecutable[key].params;
    let callback = DefaultExecutable[key].callback;
    WTM.IdentifierHtml.setExecutable(key, callback);
    WTM.IdentifierHtml.EXEC[key](...params);
  }
});

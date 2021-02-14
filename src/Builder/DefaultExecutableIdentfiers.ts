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
VIEW_DRAG_AND_DROP: string = "VIEW-INCLUDES-DRAG-AND-DROP",
PROJECTS_SELECT: string = "PROJECTS-SELECT",
ADD_SCRIPTS: string = "ADD-SCRIPTS",
ADD_STYLES: string = "ADD-STYLES",

CONTAINER_ATTR = 'data-container',
CONTAINER_CHILD_ATTR = 'data-to-populate',
CONTAINER_HEADER_ATTR = 'data-header';


/**
 * @description returns the selected project
 */
GUI.getCurrentSelectedProject = () => {
  WLogger.log(` Retriving selected project `);
  let currentSelected = $(`[data-name='${PROJECTS_SELECT}']`).find(":selected");
  let name = currentSelected.attr("data-name") as string;
  if(!name) {
    return undefined;
  } else {
    GUI.PROJECTS.refreshProjectsCache();
    return GUI.PROJECTS.getProjectByName(name)
  }
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
  else return new WTM.Visual(GUI.VISUALS_PATH + visualFolderPath, visualExtension as WTM.extensions);
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
  let block = $(`[data-name='${VIEW_BLOCKS_SELECT}']`).find(":selected").attr('data-block') as string;
  if(!block) return undefined;
  else return block;
}

function loadScript(div: HTMLElement, src: string) {
  var script = document.createElement('script');
  script.src = src;
  script.async = false;
  div.appendChild(script);
}
/**
 * @description add the project scripts where the ADD-SCRIPTS executable identifier is present
 */
GUI.populateScripts = (div: JQuery<HTMLElement>) => {
  WLogger.log(` Populating scripts `);
  let currentProject = GUI.getCurrentSelectedProject() ;
  if(!currentProject) return;
  for( let scriptPath of currentProject.getScripts()){
    loadScript(div[0], scriptPath);
  }
}
/**
 * @description add the project styles where the ADD-STYLES executable identifier is present
 */
GUI.populateStyles = (div: JQuery<HTMLElement>) =>  {
  WLogger.log(` Populating styles `);
  let currentProject = GUI.getCurrentSelectedProject() ;
  if(!currentProject) return;
  for( let stylePath of currentProject.getStyles()){
    div.append(` <link rel="stylesheet" type="text/css" href="${stylePath}"> `);
  }
}
/**
 * @description populate the passed select with the existing visuals of the current project
 * @param parentContainer a select jquery element
 */
GUI.populateProjects = (parentContainer: JQuery<HTMLElement>) =>  {
  WLogger.log(` Populating projects `);
  let childSkeleton = parentContainer.find(`[${CONTAINER_CHILD_ATTR}]`).clone();
  let projects = GUI.PROJECTS.readProjects();
  parentContainer.empty();
  for (let project of projects) {
    let child = childSkeleton.clone();
    let name = project.getName();
    let path = project.getPath();
    let visualsPath = project.getVisualsPath();
    let viewsPath = project.getVisualsPath();
    let extension = project.getExtension();

    child.attr('data-name', name);
    child.attr('data-extension', extension);
    child.attr('data-visualsPath', visualsPath);
    child.attr('data-viewsPath', viewsPath);
    child.attr('data-path', path);
    child.text(name);

    parentContainer.append(child)
  }
}
/**
 * @description populate the passed select with the existing visuals of the current project
 * @param parentContainer a select jquery element
 */
GUI.populateVisuals = (parentContainer: JQuery<HTMLElement>) =>  {
  WLogger.log(` Populating visuals `);
  
  let childSkeleton = parentContainer.find(`[${CONTAINER_CHILD_ATTR}]`).clone();
  parentContainer.empty();

  let currentProject = GUI.getCurrentSelectedProject();
  if(!currentProject) return;
  
  let bulkVisuals: WTM.BulkVisual = new WTM.BulkVisual(  currentProject.getVisualsPath() );
  let visuals: WTM.Visual[] = bulkVisuals.getAllVisuals();
  if( !visuals.length ) {
    let child = childSkeleton.clone();
    child.text('none');
    child.attr('data-path', "");
    child.attr('data-extension', "");
    parentContainer.append(child);
  }
  for (let visual of visuals) {
    let child = childSkeleton.clone();
    let name: string = visual.getName();
    let path: string = visual.getDirPath();
    let extension: string = visual.getExtension();
    child.attr('data-path', path);
    child.attr('data-extension', extension);
    child.text(name)
    parentContainer.append(child);
  }
}
/**
 * @description populate the passed select with the existing views of the current project
 * @param parentContainer a select jquery element
 */
GUI.populateViews = (parentContainer: JQuery<HTMLElement>) => {
  WLogger.log(` Populating views `);
  let childSkeleton = parentContainer.find(`[${CONTAINER_CHILD_ATTR}]`).clone();
  parentContainer.empty();
  
  let currentProject = GUI.getCurrentSelectedProject();
  if(!currentProject) return;

  let currentViewsPath = currentProject.getViewsPath();
  let bulkViews: WTM.BulkView = new WTM.BulkView( currentViewsPath, 'view' );
  let views: WTM.View[] = bulkViews.getAllViews();
  if( !views.length ) {
    let child = childSkeleton.clone();
    child.text('none');
    child.attr("data-parentPath", "");
    child.attr("data-extension", "");
    child.attr("data-name", "");
    parentContainer.append(child);
  }
  for (let view of views) {
    let child = childSkeleton.clone();
    let name: string = view.getName();
    let parentPath: string = GUI.VIEWS_PATH;
    let extension: string = view.getExtension();
    child.attr("data-parentPath", parentPath)
    child.attr("data-extension", extension)
    child.attr("data-name", name)
    child.text(name);
    parentContainer.append(child);
  }
}
/**
 * @description populate the passed select with the existing blocks of the current selected view
 * @param parentContainer a select jquery element
 */
GUI.populateViewBlocks = (parentContainer: JQuery<HTMLElement>) => {
  WLogger.log(` Populating blocks `);
  let childSkeleton = parentContainer.find(`[${CONTAINER_CHILD_ATTR}]`).clone();
  parentContainer.empty();
  
  let view: WTM.View | undefined = GUI.getCurrentSelectedView();
  if(!view) {
    let child = childSkeleton.clone();
    child.attr("data-block", "");
    child.text("none");
    parentContainer.append(child);
    return;
  }

  let viewBlocks: string[] = view.getBlocksNames();
  for (let block of viewBlocks) {
    let child = childSkeleton.clone();
    child.attr("data-block", block);
    child.text(block);
    parentContainer.append(child);
  }
}
/**
 * @description add the project scripts where the ADD-SCRIPTS executable identifier is present
 */
GUI.populateViewPathsToAllowReorder = (parentContainer: JQuery<HTMLElement>) => {
  WLogger.log(` Populating views content `);
  let childSkeleton = parentContainer.find(`[${CONTAINER_CHILD_ATTR}]`).clone();
  let headerSkeleton = parentContainer.find(`[${CONTAINER_HEADER_ATTR}]`).clone();
  parentContainer.empty()
  let parentSkeleton = parentContainer.clone();
  
  let view: WTM.View | undefined = GUI.getCurrentSelectedView();
  if(!view) return

  let viewBlocks: WTM.informationsJson["blocks"] = view.getBlocks();
  parentContainer.after(buildViewDragAndDropForReorderPaths( headerSkeleton, parentSkeleton, childSkeleton, viewBlocks, 'BODY' ));
  parentContainer.remove();
}
/**
 * @description build the drag and drop element inside the views section
 * - used in _GUI.populateViewContent_
 * @param headerSkeleton the header of the drag and drops sections
 * @param parentSkeleton the parent element of the drag and drops sections
 * @param childSkeleton the draggable elements
 * @param blocks the views blocks informations as object
 * @param currentBlock the current analized block
 * @param includedBlock not an empty string when the current block is a custom block that has as path a comment identifier
 */
function buildViewDragAndDropForReorderPaths(
  headerSkeleton: JQuery<HTMLElement>,
  parentSkeleton: JQuery<HTMLElement>, 
  childSkeleton: JQuery<HTMLElement>, 
  blocks: WTM.informationsJson["blocks"],
  currentBlock: string,
  includedBlock?: string
  ): JQuery<HTMLElement> {

  let toReturn = parentSkeleton.clone();
  toReturn.attr('data-block', currentBlock);
  // if the current block is also inside in another block it should have the data-path attribute
  if ( includedBlock ) {
    toReturn.attr('data-path', includedBlock);
  }
  let header = headerSkeleton.clone();
  header.find('h3').text(currentBlock)
  toReturn.append( header );
  console.log(includedBlock)

  for ( let pathToInclude of blocks[currentBlock].include ){
    if( WTM.Identifiers.checkCommentIdentifier(pathToInclude) ){
      toReturn.append(buildViewDragAndDropForReorderPaths(headerSkeleton, parentSkeleton, childSkeleton, blocks, WTM.Identifiers.getIdentifierTypeName(pathToInclude)[1], pathToInclude ));
    } else {
      let child = childSkeleton.clone();
      let pathElem = child.find('[data-path]');
      pathElem.text(pathToInclude);
      pathElem.attr('data-path', pathToInclude);
      toReturn.append( child );
    }
  }

  return toReturn;
}

GUI.retriveViewReorderedPaths = ():  WTM.informationsJson["blocks"] => {
  let replacedIdentifierTag = $(`[data-name='${VIEW_DRAG_AND_DROP}']`);
  let currentView = GUI.getCurrentSelectedView();
  if(!currentView) return {};
  let viewBlocks = currentView.getBlocks();
  let editedPathsOrder = replacedIdentifierTag.find('[data-path]:not([data-path=""]'); // get all the elements with a path inside
  let clearedElements: string[] = [];
  editedPathsOrder.each( ( index, elem ) => {
    console.log(index)
    let element = $(elem);
    let elementPath = element.attr('data-path') as string;

    // if parent has data-block attribute uses it, instead if it is undefined check for the closest element with the data-block attribute.
    // - .parent() is needed because when the element is an included custom block if .closest() is used it find as the block's parent  the block itself and auto-include the block in itself.
    // - .closest() instead is used for the other paths that non represtents custom blocks
    let elementBlockName = $(elem).parent('[data-block]').attr('data-block') as string || $(elem).closest('[data-block]').attr('data-block') as string;

    if( !elementBlockName || !elementPath ) return;
    if( !clearedElements.includes(elementBlockName) ){
      viewBlocks[elementBlockName].include = [];
      clearedElements.push(elementBlockName);
    }
    console.log(elementBlockName, elementPath)
    viewBlocks[elementBlockName].include.push(elementPath);
  });
  return viewBlocks; 
}

/**
 * DECLARE THE DEFAULT EXECUTABLE IDENTIFIERS FUNCTIONS
 */
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
        let replacedIdentifierTag = $(`[data-name='${PROJECTS_SELECT}']`);
        if (!replacedIdentifierTag.length) {
          WError.throw(ERRORS.NO_IDENTIFIER_FOUND);
          return;
        }
        let parentContainer = replacedIdentifierTag.find(`[${CONTAINER_ATTR}]`);
        GUI.populateProjects(parentContainer);

        // add listener to change the text contained in the visuals textarea ( used for update them )
        $(`[data-name='${PROJECTS_SELECT}']`).change( evt => {
          let viewsContainer = $(`[data-name='${VIEWS_SELECT}']`).find(`[${CONTAINER_ATTR}]`);
          let visualsContainer = $(`[data-name='${VISUALS_SELECT}']`).find(`[${CONTAINER_ATTR}]`);
          let blockContainer = $(`[data-name='${VIEW_BLOCKS_SELECT}']`).find(`[${CONTAINER_ATTR}]`);
          GUI.populateViews(viewsContainer);
          GUI.populateViewBlocks(blockContainer);
          GUI.populateVisuals(visualsContainer);
        });

        return replacedIdentifierTag;
      }
    },
    ADD_SCRIPTS: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${ADD_SCRIPTS}`);
        let replacedIdentifierTag = $(`[data-name='${ADD_SCRIPTS}']`);
        GUI.populateScripts(replacedIdentifierTag);
        return replacedIdentifierTag;
      }
    },
    ADD_STYLES: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${ADD_STYLES}`);
        let replacedIdentifierTag = $(`[data-name='${ADD_STYLES}']`);
        GUI.populateStyles(replacedIdentifierTag);
        return replacedIdentifierTag;
      }
    },
    VISUALS_SELECT: {
      params: [GUI.TEMPLATE_PATH],
      callback: (visualsPath: string) => {
        WLogger.log(` Executing ${VISUALS_SELECT}`);
        let replacedIdentifierTag = $(`[data-name='${VISUALS_SELECT}']`);
        if (!replacedIdentifierTag.length) {
          WError.throw(ERRORS.NO_IDENTIFIER_FOUND);
          return;
        }
        let parentContainer = replacedIdentifierTag.find(`[${CONTAINER_ATTR}]`);
        GUI.populateVisuals(parentContainer);

        // add listener to change the text contained in the visuals textarea ( used for update them )
        $(`[data-name='${VISUALS_SELECT}']`).change( evt => {
          
          let visual = GUI.getCurrentSelectedVisual();
          if(!visual) return;

          $(`[data-name='${VISUALS_TEXTAREA}']`).find("textarea").val(visual.getHtmlDefault());
        });

        return replacedIdentifierTag;
      },
    },
    VISUALS_TEXTAREA: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${VISUALS_TEXTAREA}`);
        let replacedIdentifierTag = $(`[data-name='${VISUALS_TEXTAREA}']`);
        if (!replacedIdentifierTag.length) {
          WError.throw(ERRORS.NO_IDENTIFIER_FOUND);
          return;
        }
        let textarea = $(`<textarea name="" id="" cols="30" rows="10"></textarea>`);
        replacedIdentifierTag.append(textarea);
        return replacedIdentifierTag;
      },
    },
    VIEWS_SELECT: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${VIEWS_SELECT}`);
        let replacedIdentifierTag = $(`[data-name='${VIEWS_SELECT}']`);
        if (!replacedIdentifierTag.length) {
          WError.throw(ERRORS.NO_IDENTIFIER_FOUND);
          return;
        }
        let parentContainer = replacedIdentifierTag.find(`[${CONTAINER_ATTR}]`);
        GUI.populateViews(parentContainer);

        // add listener to change the view blocks
        $(`[data-name='${VIEWS_SELECT}']`).change( evt => {
          GUI.populateViewBlocks(parentContainer);
        });

        return replacedIdentifierTag;
      },
    },
    VIEW_BLOCKS_SELECT: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${VIEW_BLOCKS_SELECT}`);
        let replacedIdentifierTag = $(`[data-name='${VIEW_BLOCKS_SELECT}']`);
        if (!replacedIdentifierTag.length) {
          WError.throw(ERRORS.NO_IDENTIFIER_FOUND);
          return;
        }
        let parentContainer = replacedIdentifierTag.find(`[${CONTAINER_ATTR}]`);
        GUI.populateViewBlocks(parentContainer);
        return replacedIdentifierTag;
      }
    },
    VIEW_DRAG_AND_DROP: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${VIEW_DRAG_AND_DROP}`);
        let replacedIdentifierTag = $(`[data-name='${VIEW_DRAG_AND_DROP}']`);
        if (!replacedIdentifierTag.length) {
          WError.throw(ERRORS.NO_IDENTIFIER_FOUND);
          return;
        }
        let parentContainer = replacedIdentifierTag.find(`[${CONTAINER_ATTR}]`);
        GUI.populateViewPathsToAllowReorder(parentContainer);
        return replacedIdentifierTag;
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

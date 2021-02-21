import * as WTM from "wtm-lib";
import { ConstViews } from "wtm-lib";
import { ERRORS } from "../Errors/Errors";
import { WError } from "../Errors/WtmError";
import { WLogger } from "../Logger/WLogger";

/**
 * ADD SOME PROPERTIES IN THE WINDOW
 */
window.WTM_LIB = WTM;
// @ts-ignore
window.WTM_GUI = {}
const GUI = window.WTM_GUI;
GUI.TEMPLATE_PATH = process.env.PWD as string;
GUI.VISUALS_PATH = GUI.TEMPLATE_PATH + `/${WTM.ConstVisuals.visualsDirectory}/` as string;
GUI.VIEWS_PATH = GUI.TEMPLATE_PATH + `/${WTM.ConstViews.viewsDirectory}/` as string;
GUI.PROJECTS = new WTM.BulkProjects(GUI.TEMPLATE_PATH);
GUI.WLogger = WLogger.log;

const
VISUALS_SELECT: string = "VISUALS-SELECT",
VISUALS_TEXTAREA: string = "VISUALS-TEXTAREA",
VIEWS_SELECT: string = "VIEWS-SELECT",
VIEW_BLOCKS_SELECT: string = "VIEW-BLOCKS-SELECT",
VIEW_DRAG_AND_DROP: string = "VIEW-INCLUDES-DRAG-AND-DROP",
PROJECTS_SELECT: string = "PROJECTS-SELECT",
PROJECTS_TYPES_SELECT: string = "PROJECTS-TYPES-SELECT",
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
  let visualsFolder = currentSelected.attr("data-visualsPath") as string;
  let visualName = currentSelected.attr("data-name") as string;
  let visualProjectType = currentSelected.attr("data-projectType") as string;
  if(!visualName || !visualProjectType || !visualsFolder) {
    WLogger.log(`Folder: ${visualsFolder}, Name: ${visualName}, Type: ${visualProjectType}`);
    WError.throw(ERRORS.MISSING_FIELDS);
    return;
  }
  if( !WTM.checkValidProjectType(visualProjectType) ) {
      WLogger.log(visualProjectType);
      WError.throw(ERRORS.NO_VALID_PROJECT_TYPE);
      return 
  }
  else {
    return new WTM.Visual(visualsFolder, visualName, visualProjectType as WTM.ProjectTypes).getVisualFiltered();
  }
}
/**
 * @description returns the selected view
 */
GUI.getCurrentSelectedView = () => {
  WLogger.log(` Retriving selected view `);
  let currentSelectedView = $(`[data-name='${VIEWS_SELECT}']`).find(":selected");
  let parentAbsPath = currentSelectedView.attr('data-parentPath') as string;
  let name = currentSelectedView.attr('data-name') as string;
  let projectType = currentSelectedView.attr('data-projectType') as string;
  if( !parentAbsPath || !name || !projectType) return undefined;
  if( !WTM.checkValidProjectType(projectType)) {
    WLogger.log(projectType);
    WError.throw(ERRORS.NO_VALID_PROJECT_TYPE);
    return 
}
  else return new WTM.View(parentAbsPath, name, projectType as WTM.ProjectTypes);
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
  let childSkeleton = parentContainer.find(`[${CONTAINER_CHILD_ATTR}]`).first().clone();
  let projects: WTM.Project[] = GUI.PROJECTS.readProjects();
  parentContainer.empty();
  for (let project of projects) {
    let child = childSkeleton.clone();
    let name = project.getName();
    let path = project.getPath();
    let visualsPath = project.getVisualsPath();
    let viewsPath = project.getVisualsPath();
    let projectType = project.getProjectType();

    child.attr('data-name', name);
    child.attr('data-projectType', projectType);
    child.attr('data-visualsPath', visualsPath);
    child.attr('data-viewsPath', viewsPath);
    child.attr('data-path', path);
    child.text(name);

    parentContainer.append(child)
  }
}
GUI.populateAviableProjectsTypes = (parentContainer: JQuery<HTMLElement>) =>  {
  WLogger.log(` Populating aviable projects types `);
  let childSkeleton = parentContainer.find(`[${CONTAINER_CHILD_ATTR}]`).first().clone();
  parentContainer.empty();
  for (let projectType in WTM.ProjectTypes ) {
    let child = childSkeleton.clone();
    child.val(projectType);
    child.attr('data-projectType', projectType);
    child.text(projectType);
    parentContainer.append(child)
  }
  let currentProject = GUI.getCurrentSelectedProject();
  if( !currentProject ) return;
  else parentContainer.val(currentProject.getProjectType());
}
/**
 * @description populate the passed select with the existing visuals of the current project
 * @param parentContainer a select jquery element
 */
GUI.populateVisuals = (parentContainer: JQuery<HTMLElement>) =>  {
  WLogger.log(` Populating visuals `);
  
  let childSkeleton = parentContainer.find(`[${CONTAINER_CHILD_ATTR}]`).first().clone();
  parentContainer.empty();

  let currentProject = GUI.getCurrentSelectedProject();
  if(!currentProject) return;
  
  let bulkVisuals: WTM.BulkVisual = new WTM.BulkVisual(  currentProject.getVisualsPath(), currentProject.getProjectType() );
  let visuals: WTM.Visual[] = bulkVisuals.getAllVisualsFiltered();
  if( !visuals.length ) {
    let child = childSkeleton.clone();
    child.text('none');
    child.attr('data-path', "");
    child.attr('data-projectType', "");
    parentContainer.append(child);
  }
  for (let visual of visuals) {
    let child = childSkeleton.clone();
    let name: string = visual.getName();
    let text: string = `${name}-${visual.getProjectType()} 🟢 `;;
    let projectType:  WTM.ProjectTypes = visual.getProjectType() as WTM.ProjectTypes;
    if( visual.getProjectType() == WTM.ProjectTypes.html && currentProject.getProjectType() != WTM.ProjectTypes.html) {
      text = `${name}-${visual.getProjectType()} 🟡 `; // type html as fallback
    } 
    
    child.attr('data-name', name);
    child.attr('data-visualsPath', currentProject.getVisualsPath())
    child.attr('data-projectType', projectType);
    child.text(text)
    parentContainer.append(child);
  }
}
/**
 * @description populate the passed select with the existing views of the current project
 * @param parentContainer a select jquery element
 */
GUI.populateViews = (parentContainer: JQuery<HTMLElement>) => {
  WLogger.log(` Populating views `);
  let childSkeleton = parentContainer.find(`[${CONTAINER_CHILD_ATTR}]`).first().clone();
  parentContainer.empty();
  
  let currentProject = GUI.getCurrentSelectedProject();
  if(!currentProject) return;

  let currentViewsPath = currentProject.getViewsPath();
  let bulkViews: WTM.BulkView = new WTM.BulkView( currentViewsPath, ConstViews.viewsPrefix, currentProject.getProjectType() );
  let views: WTM.View[] = bulkViews.getAllViews();
  if( !views.length ) {
    let child = childSkeleton.clone();
    child.text('none');
    child.attr("data-parentPath", "");
    child.attr("data-projectType", "");
    child.attr("data-name", "");
    parentContainer.append(child);
  }
  for (let view of views) {
    let child = childSkeleton.clone();
    let name: string = view.getName();
    let parentPath: string = GUI.VIEWS_PATH;
    let projectType: WTM.ProjectTypes = view.getProjectType();
    child.attr("data-parentPath", parentPath)
    child.attr("data-projectType", projectType)
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
  let childSkeleton = parentContainer.find(`[${CONTAINER_CHILD_ATTR}]`).first().clone();
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
  let childSkeleton = parentContainer.find(`[${CONTAINER_CHILD_ATTR}]`).first().clone();
  let headerSkeleton = parentContainer.find(`[${CONTAINER_HEADER_ATTR}]`).first().clone();
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
    viewBlocks[elementBlockName].include.push(elementPath);
  });
  return viewBlocks; 
}

/**
 * @description get the project type from the select of the types in the projects section
 */
GUI.getCurrentSelectedProjectType = () => {
  return $(`[data-name="${PROJECTS_TYPES_SELECT}"`).find('select').val() as unknown as WTM.ProjectTypes;
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
    PROJECTS_TYPES_SELECT: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${PROJECTS_TYPES_SELECT}`);
        let replacedIdentifierTag = $(`[data-name='${PROJECTS_TYPES_SELECT}']`);
        if (!replacedIdentifierTag.length) {
          WError.throw(ERRORS.NO_IDENTIFIER_FOUND);
          return;
        }
        let parentContainer = replacedIdentifierTag.find(`[${CONTAINER_ATTR}]`);
        GUI.populateAviableProjectsTypes(parentContainer);
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
          if(!visual || !visual.isCreated() ) return;

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
          GUI.populateViewBlocks($(`[data-name='${VIEW_BLOCKS_SELECT}']`).find(`[${CONTAINER_ATTR}]`));
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

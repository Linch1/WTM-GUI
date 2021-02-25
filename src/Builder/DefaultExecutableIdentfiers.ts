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
const GUI = window.WTM_GUI;

const
VISUALS_SELECT: string = "VISUALS-SELECT",
VISUALS_TEXTAREA: string = "VISUALS-TEXTAREA",
VIEWS_SELECT: string = "VIEWS-SELECT",
VIEW_BLOCKS_SELECT: string = "VIEW-BLOCKS-SELECT",
VIEW_DRAG_AND_DROP: string = "VIEW-INCLUDES-DRAG-AND-DROP",
FOLDER_TREE_VISUALS_SCRIPTS: string = "FOLDER-TREE-VISUALS-SCRIPTS",
FOLDER_TREE_VISUALS_STYLES: string = "FOLDER-TREE-VISUALS-STYLES",
FOLDER_TREE_LIB: string = "FOLDER-TREE-LIB",
PROJECTS_SELECT: string = "PROJECTS-SELECT",
PROJECTS_LIB_SELECT: string = "PROJECTS-LIB-SELECT",
PROJECTS_TYPES_SELECT: string = "PROJECTS-TYPES-SELECT",
ADD_SCRIPTS: string = "ADD-SCRIPTS",
ADD_STYLES: string = "ADD-STYLES",


CONTAINER_ATTR = 'data-container',
CONTAINER_CHILD_ATTR = 'data-to-populate',
CONTAINER_HEADER_ATTR = 'data-header';

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
    PROJECTS_LIB_SELECT: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${PROJECTS_LIB_SELECT}`);
        let replacedIdentifierTag = $(`[data-name='${PROJECTS_LIB_SELECT}']`);
        if (!replacedIdentifierTag.length) {
          WError.throw(ERRORS.NO_IDENTIFIER_FOUND);
          return;
        }
        let parentContainer = replacedIdentifierTag.find(`[${CONTAINER_ATTR}]`);
        GUI.populateAviableProjectsLib(parentContainer);
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
          console.log("pop")
          let visualAssetsJs: WTM.folderObject = WTM.FileReader.readFolderTree(visual.depManager.getAssetsScriptsPath());
          GUI.populateFolderTree($(`[data-name='${FOLDER_TREE_VISUALS_SCRIPTS}']`), visualAssetsJs);
          let visualAssetsCss: WTM.folderObject = WTM.FileReader.readFolderTree(visual.depManager.getAssetsStylesPath());
          GUI.populateFolderTree($(`[data-name='${FOLDER_TREE_VISUALS_STYLES}']`), visualAssetsCss);

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
        GUI.populateViewsDragDrop(replacedIdentifierTag);
        return replacedIdentifierTag;
      }
    },
    FOLDER_TREE_VISUALS_SCRIPTS: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${FOLDER_TREE_VISUALS_SCRIPTS}`);
        let replacedIdentifierTag = $(`[data-name='${FOLDER_TREE_VISUALS_SCRIPTS}']`);
        if (!replacedIdentifierTag.length) {
          WError.throw(ERRORS.NO_IDENTIFIER_FOUND);
          return;
        }
        
        let currentVisual = GUI.getCurrentSelectedVisual();
        if ( !currentVisual ) return;
        let visualAssetsJs: WTM.folderObject = WTM.FileReader.readFolderTree(currentVisual.depManager.getAssetsScriptsPath());
        GUI.populateFolderTree(replacedIdentifierTag, visualAssetsJs);
        
        return replacedIdentifierTag;
      }
    },
    FOLDER_TREE_VISUALS_STYLES: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${FOLDER_TREE_VISUALS_STYLES}`);
        let replacedIdentifierTag = $(`[data-name='${FOLDER_TREE_VISUALS_STYLES}']`);
        if (!replacedIdentifierTag.length) {
          WError.throw(ERRORS.NO_IDENTIFIER_FOUND);
          return;
        }
        

        let currentVisual = GUI.getCurrentSelectedVisual();
        if ( !currentVisual ) return;
        let visualAssetsCss: WTM.folderObject = WTM.FileReader.readFolderTree(currentVisual.depManager.getAssetsStylesPath());
        GUI.populateFolderTree(replacedIdentifierTag, visualAssetsCss);

        return replacedIdentifierTag;
      }
    },
    FOLDER_TREE_LIB: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${FOLDER_TREE_LIB}`);
        let replacedIdentifierTag = $(`[data-name='${FOLDER_TREE_LIB}']`);
        if (!replacedIdentifierTag.length) {
          WError.throw(ERRORS.NO_IDENTIFIER_FOUND);
          return;
        }
        let currentProject = GUI.getCurrentSelectedProject();
        if ( !currentProject ) return;
        let currentLib = GUI.getCurrentSelectedProjectLib();
        if(!currentLib) return;
        let libFolder: WTM.folderObject = WTM.FileReader.readFolderTree(currentProject.depManager.getProjectAssetsLibPath(currentLib));
        GUI.populateFolderTree(replacedIdentifierTag, libFolder);

        return replacedIdentifierTag;
      }
    },
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

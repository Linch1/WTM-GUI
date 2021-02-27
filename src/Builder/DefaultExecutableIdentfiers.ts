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
const 

GUI = window.WTM_GUI,

// identifiers
VISUALS_SELECT: string = "VISUALS-SELECT",
VIEWS_SELECT: string = "VIEWS-SELECT",
VIEW_BLOCKS_SELECT: string = "VIEW-BLOCKS-SELECT",
DRAG_DROP_VIEW: string = "DRAG-DROP-VIEW",
DRAG_DROP_LIB: string = "DRAG-DROP-LIB",
FOLDER_TREE_VISUALS_SCRIPTS: string = "FOLDER-TREE-VISUALS-SCRIPTS",
FOLDER_TREE_VISUALS_STYLES: string = "FOLDER-TREE-VISUALS-STYLES",
FOLDER_TREE_LIB_STYLES: string = "FOLDER-TREE-LIB-STYLES",
FOLDER_TREE_LIB_SCRIPTS: string = "FOLDER-TREE-LIB-SCRIPTS",
FOLDER_TREE_PROJECT_STYLES: string = "FOLDER-TREE-PROJECT-STYLES",
FOLDER_TREE_PROJECT_SCRIPTS: string = "FOLDER-TREE-PROJECT-SCRIPTS",
PROJECTS_SELECT: string = "PROJECTS-SELECT",
PROJECTS_LIB_SELECT: string = "PROJECTS-LIB-SELECT",
PROJECTS_TYPES_SELECT: string = "PROJECTS-TYPES-SELECT",
FOLDER_TREE_LIB_CDN_STYLES: string = "FOLDER-TREE-LIB-CDN-STYLES",
FOLDER_TREE_LIB_CDN_SCRIPTS: string = "FOLDER-TREE-LIB-CDN-SCRIPTS",
ADD_SCRIPTS: string = "ADD-SCRIPTS",
ADD_STYLES: string = "ADD-STYLES",

FAKE_FOLDER_CDN_SCRIPTS = "cdn-scripts",
FAKE_FOLDER_CDN_STYLES = "cdn-styles",

// container attribute
CONTAINER_ATTR = 'data-container';

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
        replacedIdentifierTag.change( evt => {
          let viewsContainer = $(`[data-name='${VIEWS_SELECT}']`).find(`[${CONTAINER_ATTR}]`);
          let visualsContainer = $(`[data-name='${VISUALS_SELECT}']`).find(`[${CONTAINER_ATTR}]`);
          let blockContainer = $(`[data-name='${VIEW_BLOCKS_SELECT}']`).find(`[${CONTAINER_ATTR}]`);
          let libContainer = $(`[data-name='${PROJECTS_LIB_SELECT}']`).find(`[${CONTAINER_ATTR}]`);
          let projectTypesContainer = $(`[data-name='${PROJECTS_TYPES_SELECT}']`).find(`[${CONTAINER_ATTR}]`);
          GUI.populateViews(viewsContainer);
          GUI.populateViewBlocks(blockContainer);
          GUI.populateVisuals(visualsContainer);
          GUI.populateAviableProjectsLib(libContainer);
          GUI.populateAviableProjectsTypes(projectTypesContainer);

          let currentProject = GUI.getCurrentSelectedProject();
          if(!currentProject ) return;
          let scriptsFolderTree: WTM.folderObject = WTM.FileReader.readFolderTree(currentProject.depManager.getAssetsScriptsPath());
          let stylesFolderTree: WTM.folderObject = WTM.FileReader.readFolderTree(currentProject.depManager.getAssetsStylesPath());
          GUI.populateFolderTree($(`[data-name='${FOLDER_TREE_PROJECT_SCRIPTS}']`), scriptsFolderTree, ["js"]);
          GUI.populateFolderTree($(`[data-name='${FOLDER_TREE_PROJECT_STYLES}']`), stylesFolderTree, ["css"]);

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

        replacedIdentifierTag.change( evt => {
          let currentProject = GUI.getCurrentSelectedProject();
          if(!currentProject ) return;
          let libName = GUI.getCurrentSelectedProjectLib();
          if(!libName ) return;
          let libFolderTree: WTM.folderObject = WTM.FileReader.readFolderTree(currentProject.depManager.getAssetsLibPath(libName));
          GUI.populateFolderTree($(`[data-name='${FOLDER_TREE_LIB_SCRIPTS}']`), libFolderTree, ["js"]);
          GUI.populateFolderTree($(`[data-name='${FOLDER_TREE_LIB_STYLES}']`), libFolderTree, ["css"]);

          let cdnStyles = currentProject.depManager.getAllLibCdnStyles( libName );
          let cdnTreeStyles: WTM.folderObject = { // fake tree
            level: 0,
            folderPath: FAKE_FOLDER_CDN_STYLES,
            folders: [],
            files: cdnStyles
          }
          GUI.populateFolderTree($(`[data-name='${FOLDER_TREE_LIB_CDN_STYLES}']`), cdnTreeStyles, ["css"]);
          
          let cdnScripts = currentProject.depManager.getAllLibCdnScripts( libName );
          let cdnTreeScripts: WTM.folderObject = { // fake tree
            level: 0,
            folderPath: FAKE_FOLDER_CDN_SCRIPTS,
            folders: [],
            files: cdnScripts
          }
          GUI.populateFolderTree($(`[data-name='${FOLDER_TREE_LIB_CDN_SCRIPTS}']`), cdnTreeScripts, ["js"]);
          

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
          console.log("pop")
          let visualAssetsJs: WTM.folderObject = WTM.FileReader.readFolderTree(visual.depManager.getAssetsScriptsPath());
          GUI.populateFolderTree($(`[data-name='${FOLDER_TREE_VISUALS_SCRIPTS}']`), visualAssetsJs, ["js"]);
          let visualAssetsCss: WTM.folderObject = WTM.FileReader.readFolderTree(visual.depManager.getAssetsStylesPath());
          GUI.populateFolderTree($(`[data-name='${FOLDER_TREE_VISUALS_STYLES}']`), visualAssetsCss, ["css"]);


        });

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
    DRAG_DROP_VIEW: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${DRAG_DROP_VIEW}`);
        let replacedIdentifierTag = $(`[data-name='${DRAG_DROP_VIEW}']`);
        if (!replacedIdentifierTag.length) {
          WError.throw(ERRORS.NO_IDENTIFIER_FOUND);
          return;
        }
        GUI.populateViewsDragDrop(replacedIdentifierTag);
        return replacedIdentifierTag;
      }
    },
    DRAG_DROP_LIB: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${DRAG_DROP_LIB}`);
        let replacedIdentifierTag = $(`[data-name='${DRAG_DROP_LIB}']`);
        if (!replacedIdentifierTag.length) {
          WError.throw(ERRORS.NO_IDENTIFIER_FOUND);
          return;
        }
        GUI.populateLibDragDrop(replacedIdentifierTag);
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
        GUI.populateFolderTree(replacedIdentifierTag, visualAssetsJs, ["js"]);
        
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
        GUI.populateFolderTree(replacedIdentifierTag, visualAssetsCss, ["css"]);

        return replacedIdentifierTag;
      }
    },
    FOLDER_TREE_LIB_STYLES: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${FOLDER_TREE_LIB_STYLES}`);
        let replacedIdentifierTag = $(`[data-name='${FOLDER_TREE_LIB_STYLES}']`);
        if (!replacedIdentifierTag.length) {
          WError.throw(ERRORS.NO_IDENTIFIER_FOUND);
          return;
        }
        let currentProject = GUI.getCurrentSelectedProject();
        if ( !currentProject ) return;
        let currentLib = GUI.getCurrentSelectedProjectLib();
        if(!currentLib) return;
        let libFolder: WTM.folderObject = WTM.FileReader.readFolderTree(currentProject.depManager.getProjectAssetsLibPath(currentLib));
        GUI.populateFolderTree(replacedIdentifierTag, libFolder, ["css"] );

        return replacedIdentifierTag;
      }
    },
    FOLDER_TREE_LIB_SCRIPTS: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${FOLDER_TREE_LIB_SCRIPTS}`);
        let replacedIdentifierTag = $(`[data-name='${FOLDER_TREE_LIB_SCRIPTS}']`);
        if (!replacedIdentifierTag.length) {
          WError.throw(ERRORS.NO_IDENTIFIER_FOUND);
          return;
        }
        let currentProject = GUI.getCurrentSelectedProject();
        if ( !currentProject ) return;
        let currentLib = GUI.getCurrentSelectedProjectLib();
        if(!currentLib) return;
        let libFolder: WTM.folderObject = WTM.FileReader.readFolderTree(currentProject.depManager.getProjectAssetsLibPath(currentLib));
        GUI.populateFolderTree(replacedIdentifierTag, libFolder, ["js"]);

        return replacedIdentifierTag;
      }
    },
    FOLDER_TREE_PROJECT_STYLES: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${FOLDER_TREE_PROJECT_STYLES}`);
        let replacedIdentifierTag = $(`[data-name='${FOLDER_TREE_PROJECT_STYLES}']`);
        if (!replacedIdentifierTag.length) {
          WError.throw(ERRORS.NO_IDENTIFIER_FOUND);
          return;
        }
        let currentProject = GUI.getCurrentSelectedProject();
        if ( !currentProject ) return;
        let currentLib = GUI.getCurrentSelectedProjectLib();
        if(!currentLib) return;
        let libFolder: WTM.folderObject = WTM.FileReader.readFolderTree(currentProject.depManager.getAssetsStylesPath());
        GUI.populateFolderTree(replacedIdentifierTag, libFolder, ["css"]);

        return replacedIdentifierTag;
      }
    },
    FOLDER_TREE_PROJECT_SCRIPTS: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${FOLDER_TREE_PROJECT_SCRIPTS}`);
        let replacedIdentifierTag = $(`[data-name='${FOLDER_TREE_PROJECT_SCRIPTS}']`);
        if (!replacedIdentifierTag.length) {
          WError.throw(ERRORS.NO_IDENTIFIER_FOUND);
          return;
        }
        let currentProject = GUI.getCurrentSelectedProject();
        if ( !currentProject ) return;
        let currentLib = GUI.getCurrentSelectedProjectLib();
        if(!currentLib) return;
        let libFolder: WTM.folderObject = WTM.FileReader.readFolderTree(currentProject.depManager.getAssetsScriptsPath());
        GUI.populateFolderTree(replacedIdentifierTag, libFolder, ["js"]);

        return replacedIdentifierTag;
      }
    },
    FOLDER_TREE_LIB_CDN_STYLES: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${FOLDER_TREE_LIB_CDN_STYLES}`);
        let replacedIdentifierTag = $(`[data-name='${FOLDER_TREE_LIB_CDN_STYLES}']`);
        if (!replacedIdentifierTag.length) {
          WError.throw(ERRORS.NO_IDENTIFIER_FOUND);
          return;
        }
        let currentProject = GUI.getCurrentSelectedProject();
        if ( !currentProject ) return;
        let currentLib = GUI.getCurrentSelectedProjectLib();
        if(!currentLib) return;
        let cdnStyles = currentProject.depManager.getAllLibCdnStyles( currentLib );
        // fake tree
        let cdnTree: WTM.folderObject = {
          level: 0,
          folderPath: FAKE_FOLDER_CDN_STYLES,
          folders: [],
          files: cdnStyles
        }
        GUI.populateFolderTree(replacedIdentifierTag, cdnTree, ["css"]);

        return replacedIdentifierTag;
      }
    },
    FOLDER_TREE_LIB_CDN_SCRIPTS: {
      params: [],
      callback: () => {
        WLogger.log(` Executing ${FOLDER_TREE_LIB_CDN_SCRIPTS}`);
        let replacedIdentifierTag = $(`[data-name='${FOLDER_TREE_LIB_CDN_SCRIPTS}']`);
        if (!replacedIdentifierTag.length) {
          WError.throw(ERRORS.NO_IDENTIFIER_FOUND);
          return;
        }
        let currentProject = GUI.getCurrentSelectedProject();
        if ( !currentProject ) return;
        let currentLib = GUI.getCurrentSelectedProjectLib();
        if(!currentLib) return;
        let cdnScripts = currentProject.depManager.getAllLibCdnScripts( currentLib );
        // fake tree
        let cdnTree: WTM.folderObject = {
          level: 0,
          folderPath: FAKE_FOLDER_CDN_SCRIPTS,
          folders: [],
          files: cdnScripts
        }
        GUI.populateFolderTree(replacedIdentifierTag, cdnTree, ["js"]);

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

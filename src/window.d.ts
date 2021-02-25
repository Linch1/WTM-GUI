import * as WTM from "wtm-lib";

export declare global {
    interface Window {
        WTM_LIB: any,
        WTM_GUI: {
            TEMPLATE_PATH: string,
            VISUALS_PATH: string,
            VIEWS_PATH: string,
            PROJECTS: WTM.BulkProjects,
            retriveViewReorderedPaths: () => WTM.informationsJson["blocks"],

            removePorjectDirectoryFromString: ( string: string ) => string;

            getFormElementValue: ( elem: JQuery<HTMLElement> ) => string | boolean | number ,

            getCurrentSelectedViewBlock: () => string | undefined,
            getCurrentSelectedView: () => WTM.View | undefined,
            getCurrentSelectedVisual: () => WTM.Visual | undefined,
            getCurrentSelectedProject: () => WTM.Project | undefined,
            getCurrentSelectedProjectType: () => WTM.ProjectTypes,
            getCurrentSelectedProjectLib: () => string | undefined ,
            getCurrentSelectedFolderTreeFiles: (folderTreeselector: string) => string[],

            populateScripts: (div: JQuery<HTMLElement>) => void,
            populateStyles: (div: JQuery<HTMLElement>) => void,
            populateVisuals: (parentSelect: JQuery<HTMLElement>) => void,
            populateViews: (parentSelect: JQuery<HTMLElement>) => void,
            populateViewBlocks: (parentSelect: JQuery<HTMLElement>) => void,
            populateProjects: (parentSelect: JQuery<HTMLElement>) => void,
            populateAviableProjectsTypes: (parentSelect: JQuery<HTMLElement>) => void,
            populateAviableProjectsLib: (parentSelect: JQuery<HTMLElement>) => void,

            populateViewsDragDrop: (parentSelect: JQuery<HTMLElement>) => void,
            populateFolderTree: (parentContainer: JQuery<HTMLElement>, folder: WTM.folderObject) => void,

            WLogger: (phrase: string) => any;
        }
    }
}
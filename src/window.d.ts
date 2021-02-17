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
            
            getCurrentSelectedViewBlock: () => string | undefined,
            getCurrentSelectedView: () => WTM.View | undefined,
            getCurrentSelectedVisual: () => WTM.Visual | undefined,
            getCurrentSelectedProject: () => WTM.Project | undefined,
            getCurrentSelectedProjectTypeProjectsSection: () => WTM.ProjectTypes,
            getCurrentSelectedProjectTypeVisualsSection: () => WTM.ProjectTypes,
            getCurrentSelectedProjectTypeViewsSection: () => WTM.ProjectTypes,

            populateScripts: (div: JQuery<HTMLElement>) => void,
            populateStyles: (div: JQuery<HTMLElement>) => void,
            populateVisuals: (parentSelect: JQuery<HTMLElement>) => void,
            populateViews: (parentSelect: JQuery<HTMLElement>) => void,
            populateViewBlocks: (parentSelect: JQuery<HTMLElement>) => void,
            populateViewPathsToAllowReorder: (parentSelect: JQuery<HTMLElement>) => void,
            populateProjects: (parentSelect: JQuery<HTMLElement>) => void,
            populateAviableProjectsTypes: (parentSelect: JQuery<HTMLElement>) => void,

            WLogger: (phrase: string) => any;
        }
    }
}
import { View } from "wtm-lib";
import { Visual } from "wtm-lib";
import { GUIProjects } from "./Project/GUIProjects";
import { Project } from "./Project/Project";
import * as WTM from "wtm-lib";

export declare global {
    interface Window {
        WTM_LIB: any,
        WTM_GUI: {
            TEMPLATE_PATH: string,
            VISUALS_PATH: string,
            VIEWS_PATH: string,
            PROJECTS: GUIProjects,
            retriveViewReorderedPaths: () => WTM.informationsJson["blocks"],
            getCurrentSelectedViewBlock: () => string | undefined,
            getCurrentSelectedView: () => View | undefined,
            getCurrentSelectedVisual: () => Visual | undefined,
            getCurrentSelectedProject: () => Project | undefined,
            populateScripts: (div: JQuery<HTMLElement>) => void,
            populateStyles: (div: JQuery<HTMLElement>) => void,
            populateVisuals: (parentSelect: JQuery<HTMLElement>) => void,
            populateViews: (parentSelect: JQuery<HTMLElement>) => void,
            populateViewBlocks: (parentSelect: JQuery<HTMLElement>) => void,
            populateViewPathsToAllowReorder: (parentSelect: JQuery<HTMLElement>) => void,
            populateProjects: (parentSelect: JQuery<HTMLElement>) => void,
            WLogger: (phrase: string) => any;
        }
    }
}
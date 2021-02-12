import * as WTM from "wtm-lib";
export type projectJsonInformations = {
    name: string;
    extension: WTM.extensions;
    visualsPath: string;
    viewsPath: string;
    path: string;
    scripts: string[];
    styles: string[];
    visualsDependencies: {
        [key: string]: {
            scripts: string[];
            styles: string[];
        }
    }
};
  
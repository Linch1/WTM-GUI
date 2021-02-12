import { WLogger } from "../Logger/WLogger";

export class WError{
    static throw(error: string){
        throw new Error(WLogger.format("[ERROR] " + error));   
    }
    
}
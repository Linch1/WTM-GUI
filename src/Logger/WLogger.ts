export class WLogger{
    static log(text: string){
        console.log(this.format(text));
    }
    static format(text: string): string{
        return `[WTM-LOGGER: ${new Date()
            .toISOString()
            .replace(/T/, "/")
            .replace(/\..+/, "")}] ${text}`
    }
}
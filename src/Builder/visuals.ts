import * as wtmlib from "wtm-lib";


let visualPath = process.env.PWD + '/visuals/';
console.log(visualPath)
let homeVisual = new wtmlib.Visual( visualPath + 'home', 'ejs');
// homeVisual.writer.createVisual();
// homeVisual.writer.editDefaultHtml(`
// <p>[WTM-HTML-ciaone]</p>
// <p>[WTM-HTML-COME-VA]</p>
// `);
homeVisual.writer.populateIdentifiers();
homeVisual.converter.render(wtmlib.renderTypes.HTML);
import * as wtmlib from "wtm-lib";

let homeView = new wtmlib.View(<string> process.env.PWD, 'home');
homeView.create();
homeView.includeRelative("BODY", "../../visuals/home/render.ejs");
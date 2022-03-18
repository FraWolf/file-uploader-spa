import { Engine } from "./Engine";

const engine = new Engine("#app", "#navbarLogin");

engine.FormListener();
engine.GetLoggedInfo();
engine.GetUserFiles();

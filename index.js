import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";
import AppRoot from "./components/appRoot.js";

class Main{
    constructor(){
        const domContainer = document.getElementById('Root');
        const appRoot = React.createElement(AppRoot, {
        }, null);

        ReactDOM.render(appRoot, domContainer);
    }
}

new Main();

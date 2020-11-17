import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";
import AppRoot from "./components/appRoot.js";

class Main{
    constructor(){
        const domContainer = document.getElementById('Root');
        const appRoot = React.createElement(AppRoot, {
        }, null);

        ReactDOM.render(appRoot, domContainer);

        document.getElementById('LearnMoreLink').addEventListener('click', () => {
            FormItInterface.CallMethod("FormIt.OpenURL", 'https://formit3d.github.io/FormItExamplePlugins/index.html');
        });

        document.getElementById('BuildLink').addEventListener('click', () => {
            FormItInterface.CallMethod("FormIt.OpenURL", 'https://formit3d.github.io/FormItExamplePlugins/docs/HowToBuild.html');
        });
    }
}

new Main();

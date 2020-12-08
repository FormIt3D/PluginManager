import AppRoot from "./components/appRoot.js";

class Main{
    constructor(){
        const domContainer = document.getElementById('Root');
        const appRoot = React.createElement(AppRoot, {
        }, null);
        FormItInterface.Initialize(() => {
            this.migratePlugins(() => {
                ReactDOM.render(appRoot, domContainer);
            });
        });

        document.getElementById('LearnMoreLink').addEventListener('click', () => {
            FormItInterface.CallMethod("FormIt.OpenURL", 'https://formit3d.github.io/FormItExamplePlugins/index.html');
        });

        document.getElementById('BuildLink').addEventListener('click', () => {
            FormItInterface.CallMethod("FormIt.OpenURL", 'https://formit3d.github.io/FormItExamplePlugins/docs/HowToBuild.html');
        });
    }

    //This migrates plugins from their previous git structure so clients stay in sync with latest plugin.
    migratePlugins(callback){
        if (localStorage.getItem('hasMigrated')){
            callback();
            return;
        }

        const migrationMap = {
            "https://formit3d.github.io/FormItWorkflowPlugins/RebuildCurve": "https://FormIt3D.github.io/RebuildCurve",
            "https://formit3d.github.io/FormItWorkflowPlugins/ValidateCleanModel": "https://FormIt3D.github.io/ValidateCleanModel",
            "https://formit3d.github.io/FormItWorkflowPlugins/StringLightGenerator": "https://FormIt3D.github.io/GenerateStringLights",
            "https://formit3d.github.io/FormItWorkflowPlugins/PropertiesPlus": "https://FormIt3D.github.io/PropertiesPlus",
            "https://formit3d.github.io/FormItWorkflowPlugins/ManageCameras": "https://FormIt3D.github.io/ManageCameras",
            "https://formit3d.github.io/FormItWorkflowPlugins/GenerateVertex": "https://FormIt3D.github.io/GenerateVertex",
            "https://formit3d.github.io/FormItWorkflowPlugins/FlipAlong": "https://FormIt3D.github.io/FlipAlong",
            "https://formit3d.github.io/FormItWorkflowPlugins/FilletCorner": "https://FormIt3D.github.io/FilletCorner",
            "https://formit3d.github.io/FormItWorkflowPlugins/ExtractMaterialTextures": "https://FormIt3D.github.io/ExtractMaterialTextures",
            "https://formit3d.github.io/FormItWorkflowPlugins/MeshUnmeshAll": "https://FormIt3D.github.io/MeshUnmeshAll"
        }

        FormItInterface.CallMethod("FormIt.GetInstalledPlugins", "", (installedPlugins) => {
            installedPlugins = JSON.parse(installedPlugins).filter(p => p);

            const migrationPromises = [];

            if (installedPlugins.length){
                installedPlugins.forEach((installedPluginPath) => {
                    const migrationPath = migrationMap[installedPluginPath]

                    if (migrationPath){
                        const migratePromise = new Promise((resolve,reject) => {
                            console.log('in promise')
                            FormItInterface.CallMethod("FormIt.UninstallPlugin", installedPluginPath, () => {
                                FormItInterface.CallMethod("FormIt.InstallPlugin", migrationPath, () => {
                                    resolve();
                                });   
                            });
                        });

                        migrationPromises.push(migratePromise);  
                    }

                    if(migrationPromises.length){
                        Promise.all(migrationPromises).then(() => {
                            callback();
                            localStorage.setItem('hasMigrated', 'true');
                        });
                    }else{
                        callback();
                    }
                });
            }else{
                callback();
            }
        });
    }
}

new Main();

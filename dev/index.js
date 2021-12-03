import AppRoot from "./components/appRoot.js";

class Main {
    constructor() {
        const domContainer = document.getElementById('Root');
        const appRoot = React.createElement(AppRoot, {}, null);
        FormItInterface.Initialize(async() => {
            await this.detectManuallyInstalledAddins();

            //TODO rewrite this as a promise.
            this.migratePlugins(() => {
                ReactDOM.render(appRoot, domContainer);
            });
        });
    }

    detectManuallyInstalledAddins() {
        return new Promise((resolve, reject) => {
            try {
                //TODO? If we have future plugins to detect, loop through a list
                const lumionPath = "C:/ProgramData/Autodesk/ApplicationPlugins/LumionLiveSyncForFormIt.bundle/Contents/LiveSyncForFormIt.dll";

                const lumionPluginUrl = "https://formit3d.github.io/Lumion";

                FormItInterface.CallMethod("FormIt.GetInstalledPlugins", "", async(installedPlugins) => {
                    installedPlugins = JSON.parse(installedPlugins).filter(p => p);

                    let isPluginInstalled = false;

                    if (installedPlugins.indexOf(lumionPluginUrl) > -1) {
                        isPluginInstalled = true;
                    }
                    
                    if (FormItInterface.Platform == 'Windows') {
                        const fileExists = await FormIt.FileSystem.FileExists(lumionPath);

                        //check if we need to install it
                        if (fileExists && !isPluginInstalled) {
                            FormItInterface.CallMethod("FormIt.InstallPlugin", lumionPluginUrl, () => {
                                //remember that the plugin was installed via this detection process
                                try {
                                    //if we have future plugins that are detected, need to read array before writing
                                    localStorage.setItem('pluginsInstalledByDetection', JSON.stringify([lumionPluginUrl]));
                                } catch(e) {
                                    console.log('Not adding pluginsInstalledByDetection since localStorage is not available');
                                }

                                resolve();
                                return;
                            });
                        //or check if we need to uninstall it
                        }else if (!fileExists && isPluginInstalled){
                            try{
                                const pluginsInstalledByDetection = JSON.parse(localStorage.getItem('pluginsInstalledByDetection'));

                                if (pluginsInstalledByDetection.indexOf(lumionPluginUrl) > -1) {
                                    FormItInterface.CallMethod("FormIt.UninstallPlugin", lumionPluginUrl);
                                    localStorage.setItem('pluginsInstalledByDetection', JSON.stringify([]));
                                }
                            } catch(e) {
                                console.log('Not trying to uninstall detected plugins, localStorage is unavailable');
                            }
                        }
                    }
                    resolve();
                    return;
                });
            } catch (e) {
                console.log(e);
                reject(e);
                return;
            }
        });
    }

    //This migrates plugins from their previous git structure so clients stay in sync with latest plugin.
    migratePlugins(callback) {
        try {
            if (localStorage.getItem('hasMigrated')) {
                callback();
                return;
            }
        } catch (e) {
            console.log('Skipping hasMigrated check');
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

            if (installedPlugins.length) {
                installedPlugins.forEach((installedPluginPath) => {
                    const migrationPath = migrationMap[installedPluginPath]

                    if (migrationPath) {
                        const migratePromise = new Promise((resolve, reject) => {
                            console.log('in promise')
                            FormItInterface.CallMethod("FormIt.UninstallPlugin", installedPluginPath, () => {
                                FormItInterface.CallMethod("FormIt.InstallPlugin", migrationPath, () => {
                                    resolve();
                                });
                            });
                        });

                        migrationPromises.push(migratePromise);
                    }

                    if (migrationPromises.length) {
                        Promise.all(migrationPromises).then(() => {
                            callback();
                            localStorage.setItem('hasMigrated', 'true');
                        });
                    } else {
                        callback();
                    }
                });
            } else {
                callback();
            }
        });
    }
}

new Main();
'use strict';

import PluginList from "./pluginList.js";
import InstallPluginControls from "./installPluginControls.js";
import SearchPlugins from "./searchPlugins.js";
import PluginBadge from "./pluginBadge.js";
import approvedPlugins from "./../approvedPlugins.js";
import promotedPlugins from "./../promotedPlugins.js";

import { Octokit } from "https://cdn.skypack.dev/@octokit/rest@18.5.4";

class AppRoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.octokit = new Octokit({
            //auth: token,
            log: console,
            previews: ["mercy-preview"],
        });

        this.discoverPlugins();
    }

    //TODO error handling.
    async discoverPlugins(){
            //TODO, there can be multiple pages. We should figure out the best UX to fetch new pages.
            const publicPluginsResult = await this.octokit.search.repos({
                q: 'topic:formit-plugin',
                per_page: 100
            });

            //TODO verify recommended.
            const recommendedPluginsResult = await this.octokit.search.repos({
                q: 'topic:formit-plugin-recommended'//&sort=stars&order=desc',
            });

            const publicPlugins = publicPluginsResult.data.items.filter((repo) => {
                return repo.has_pages;
            });

            //do some validation on our side that this plugin is actually recommended by us. Also check that it has pages installed.
            const recommendedPlugins = recommendedPluginsResult.data.items.filter((repo) => {
                const hasPages = repo.has_pages;
                const isApproved = approvedPlugins.indexOf(repo.html_url) > -1;

                return hasPages && isApproved;
            });

            const needsApprovalPlugins = recommendedPluginsResult.data.items.filter((repo) => {
                const hasPages = repo.has_pages;
                const isApproved = approvedPlugins.indexOf(repo.html_url) > -1;

                return hasPages && !isApproved;
            });

            this.organizeToInstalledPlugins({publicPlugins, recommendedPlugins, needsApprovalPlugins});
    }

    async fetchManifest(pluginData){
        try {
            // first, try to get manifest.json at the root folder
            let manifestURL = (pluginData.git_url) 
                ? `https://${pluginData.owner.login}.github.io/${pluginData.name}/manifest.json`
                : `${pluginData.local_url}/manifest.json`;

            const pluginName = (pluginData.git_url) 
            ? `${pluginData.name}`
            : `${pluginData.local_url}`;

            // this may throw a 404 if the plugin's manifest is not at the root
            // this is a valid configuration - the plugin may be versioned and its versions may exclusively live in subfolders
            let manifestObject = await fetch(manifestURL);

            // if we couldn't find it at the root, use versions.json to get the versioned path
            if (!manifestObject.ok) {

                console.log("No manifest.json found at the root of " + pluginName + " plugin, looking for a versioned subdir instead...");

                // try to get versions.json
                const versionsURL = (pluginData.git_url) 
                ? `https://${pluginData.owner.login}.github.io/${pluginData.name}/versions.json`
                : `${pluginData.local_url}/versions.json`;

                const versionsObject = await fetch(versionsURL);

                if (!versionsObject.ok) {

                    // we couldn't find versions.json
                    throw Error("No versions.json found.");
                }
 
                // get the versions JSON from the object
                const versionsJSON = await versionsObject.json();

                // TODO: Use new FormIt API "GetLatestVersion" instead of the below code
                // v22 and newer

                // the subpath that needs to be accessed from the plugin root dir, depending on the client version
                let versionPath = '';
                
                // get the current FormIt client version
                const clientVersionData = await FormIt.Version();
                const clientVersionMajor = clientVersionData["internalMajor"];
                const clientVersionMinor = clientVersionData["internalMinor"];

                // if the plugin is versioned, that client version is the minimum required to run the plugin
                let pluginMinimumVersionMajor = 0;
                let pluginMinimumVersionMinor = 0;

                // versions.json may have multiple versions specified; find the one compatible with this version of FormIt
                for (let i = 0; i < versionsJSON.length; i++)
                {
                    if ((clientVersionMajor >= versionsJSON[i]["version"]["major"]) && 
                    (clientVersionMinor >= versionsJSON[i]["version"]["minor"]) && 
                    ((versionsJSON[i]["version"]["major"] >= pluginMinimumVersionMajor) && 
                    (versionsJSON[i]["version"]["minor"] >= pluginMinimumVersionMinor)))
                    {
                        versionPath = versionsJSON[i]["path"];
                        pluginMinimumVersionMajor = versionsJSON[i]["version"]["major"];
                        pluginMinimumVersionMinor = versionsJSON[i]["version"]["minor"];
                    }
                }

                // did we get a version path from versions.json?
                if (versionPath === '') {

                    // no valid version path
                    throw Error("No valid path found in versions.json.");
                }

                console.log("Adding to plugin list: " + pluginData.name + " for FormIt version " + pluginMinimumVersionMajor + "." + pluginMinimumVersionMinor + " or newer.");

                const versionedURL = (pluginData.git_url) 
                ? `https://${pluginData.owner.login}.github.io/${pluginData.name}/${versionPath}/manifest.json`
                : `${pluginData.local_url}/${versionPath}/manifest.json`;

                manifestObject = await fetch(versionedURL);
                manifestURL = versionedURL;

                if (!manifestObject.ok) {

                    // we still couldn't find manifest.json
                    throw Error("No manifest.json found in the version subfolder, either. " + manifestObject.statusText);
                }
            }
            else
            {
                console.log("Adding to plugin list: " + pluginData.name + " for any FormIt version.");
            }

            let manifestJSON = await manifestObject.json();

            manifestJSON.manifestURL = manifestURL;

            return manifestJSON;
            
        }catch(e){
            console.log('Could not fetch manifest for', pluginData.name, e);
            return false;
        }
    }

    //TODO trigger this on plugin install so it updates installed list.
    organizeToInstalledPlugins(plugins){
        plugins = plugins || this.state.plugins;

        //TODO async wrapper to avoid this
        FormItInterface.CallMethod("FormIt.GetInstalledPlugins", "", async (installedPlugins) => {

            installedPlugins = JSON.parse(installedPlugins).filter(p => p);

            const checkInstalled = (plugin) => {
                //For now, going to make a "guess" at github pages url. This is because we'd have to make an 
                //API request for each repo, and I don't want to worry about rate limiting.
                const pagesUrl = `https://${plugin.owner.login}.github.io/${plugin.name}`;

                const installedIndex = installedPlugins.indexOf(pagesUrl);
                plugin.isInstalled = installedIndex > -1;

                //Also check if the plugin is a recommended plugin.
                plugin.isPromoted = promotedPlugins.indexOf(plugin.html_url) > -1;

                //TODO hacky, a better way to do this? Not thinking clearly
                installedPlugins[installedIndex] = plugin;

                return plugin;
            };

            const sortFunc = (a,b) => {
                //first sort by isPromoted, if same sort by next || 
                return Number(b.isPromoted) - Number(a.isPromoted)
                    || b.stargazers_count - a.stargazers_count
                    || a.name.localeCompare(b.name);
            }

            let recommendedPlugins = plugins.recommendedPlugins.map(checkInstalled).sort(sortFunc),
                publicPlugins = plugins.publicPlugins.map(checkInstalled).sort(sortFunc),
                needsApprovalPlugins = plugins.needsApprovalPlugins.map(checkInstalled).sort(sortFunc);

            installedPlugins = installedPlugins.map((plugin) => {
                if (typeof plugin === 'object'){
                    return plugin;
                }else{
                    return {
                        id: plugin,
                        isInstalled: true,
                        local_url: plugin
                    }
                }
            });

            let currentPlatform = FormItInterface.Platform;

            // Fetch the manifests for the plugins and filter out the ones not on user's platform
            const fetchFilterManifest = async (_plugins, keepInstalled = false) => {
                let filtered = []
                for(let pluginIx in _plugins) {
                    let plugin = _plugins[pluginIx];
                    if (!plugin.manifest) {
                        plugin.manifest = await this.fetchManifest(plugin);
                        if (!keepInstalled && plugin.manifest.hasOwnProperty('Platforms') &&
                            !plugin.manifest.Platforms.includes(currentPlatform)) {
                                continue;
                        } else {
                            filtered.push(plugin);
                        }
                    }
                }
                return filtered;
            }

            recommendedPlugins = await fetchFilterManifest(recommendedPlugins);
            publicPlugins = await fetchFilterManifest(publicPlugins);
            installedPlugins = await fetchFilterManifest(installedPlugins, true);

            // Get all plugins for searching
            var seen = {},
                allPlugins = recommendedPlugins.concat(publicPlugins)
                    .filter(function(plugin) {
                        var strPlugin = JSON.stringify(plugin);
                        return seen.hasOwnProperty(strPlugin) ? false : (seen[strPlugin] = true);
                    })

            this.setState({
                plugins: {
                    allPlugins,
                    recommendedPlugins,
                    publicPlugins,
                    installedPlugins,
                    needsApprovalPlugins
                }
            });
        });
    }

    async toggleInstallPlugin(plugin, isInstalling){
        //Might be necessary?
        /*const pagesResult = await this.octokit.repos.getPages({
            owner: plugin.owner.login,
            repo: plugin.name,
        });*/
    
        const pagesUrl = plugin.name
            //For now, going to make a "guess" at github pages url. This is because I'm seeing a 404 on pages info request. It may require auth.
            ? `https://${plugin.owner.login}.github.io/${plugin.name}`
            : plugin.local_url;

        if (isInstalling){
            //TODO async/await wrappers
            //FormIt.InstallPlugin(pagesUrl);
            FormItInterface.CallMethod("FormIt.InstallPlugin", pagesUrl, () => {
                this.organizeToInstalledPlugins();
            });
        }else{
            //FormIt.UninstallPlugin(pagesUrl);
            FormItInterface.CallMethod("FormIt.UninstallPlugin", pagesUrl, () => {
                this.organizeToInstalledPlugins();
            });
        }
    }

    addPlugin(pluginUrl){
        this.toggleInstallPlugin({
            local_url:pluginUrl
        }, true);
    }

    render() {

        const loadingControl = React.createElement(
            'div',
            {
                id: 'MainLoader',
                className: 'control is-loading'
            },
            React.createElement(
                'div',
                {
                    id: 'FindingText',
                    className: ''
                },
                'Finding some plugins'
            )
        );

        if (this.state.plugins){
            return React.createElement(
                'div',
                {
                    id: '',
                    className: ''
                },
                [
                    //'TODO search',
                    React.createElement(SearchPlugins, {
                        addPlugin: this.addPlugin.bind(this),
                        key:'SearchPlugin',
                        plugins: this.state.plugins.allPlugins,
                        toggleInstallPlugin: this.toggleInstallPlugin.bind(this)
                    }, null),
                    React.createElement(PluginList, {
                        pluginGroup: 'Installed',
                        plugins:this.state.plugins.installedPlugins,
                        toggleInstallPlugin: this.toggleInstallPlugin.bind(this),
                        key:'Installed'
                    }, null),
                    React.createElement(PluginList, {
                        pluginGroup: 'Recommended',
                        groupDescription: 'plugins suggested by the FormIt team',
                        isOpen: true,
                        plugins:this.state.plugins.recommendedPlugins,
                        toggleInstallPlugin: this.toggleInstallPlugin.bind(this),
                        key:'Recommended'
                    }, null),
                    React.createElement(PluginList, {
                        pluginGroup: 'Public',
                        groupDescription: 'plugins built by the community',
                        plugins:this.state.plugins.publicPlugins,
                        toggleInstallPlugin: this.toggleInstallPlugin.bind(this),
                        key:'Public'
                    }, null),
                    //TODO, no hard strategy here yet.
                    /*React.createElement(PluginList, {
                        pluginGroup: 'Needs approval',
                        groupDescription: 'Admin only',
                        plugins:this.state.plugins.needsApprovalPlugins,
                        toggleInstallPlugin: this.toggleInstallPlugin.bind(this),
                        key:'Needsapproval'
                    }, null),*/
                    React.createElement(InstallPluginControls, {
                        addPlugin: this.addPlugin.bind(this),
                        key:'AddPlugin'
                    }, null),
                ]
            );
        }else{
            return React.createElement(
                'div',
                {
                    className: ''
                },
                loadingControl
            );
        }
    }
}

export default AppRoot;

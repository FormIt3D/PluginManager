'use strict';

import PluginList from "./pluginList.js";
import InstallPluginControls from "./installPluginControls.js";
import PluginBadge from "./pluginBadge.js";
import approvedPlugins from "./../approvedPlugins.js";
import promotedPlugins from "./../promotedPlugins.js";

import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";

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
            const publicPluginsResult = await this.octokit.search.repos({
                q: 'topic:formit-plugin'//&sort=stars&order=desc',
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

                //Hacky, a better way to do this? Not thinking clearly.
                installedPlugins[installedIndex] = plugin;

                return plugin;
            };

            const sortFunc = (a,b) => {
                //first sort by isPromoted, if same sort by next || 
                return Number(b.isPromoted) - Number(a.isPromoted)
                    || b.stargazers_count - a.stargazers_count
                    || a.name.localeCompare(b.name);
            }

            const recommendedPlugins = plugins.recommendedPlugins.map(checkInstalled).sort(sortFunc);
            const publicPlugins = plugins.publicPlugins.map(checkInstalled).sort(sortFunc);
            const needsApprovalPlugins = plugins.needsApprovalPlugins.map(checkInstalled).sort(sortFunc);

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

            this.setState({
                plugins: {
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
                    React.createElement(PluginList, {
                        pluginGroup: 'Installed',
                        plugins:this.state.plugins.installedPlugins,
                        toggleInstallPlugin: this.toggleInstallPlugin.bind(this),
                        key:'Installed'
                    }, null),
                    React.createElement(PluginList, {
                        pluginGroup: 'Recommended',
                        groupDescription: 'plugins suggsested by FormIt team',
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
                    React.createElement(PluginList, {
                        pluginGroup: 'Needs approval',
                        groupDescription: 'Admin only',
                        plugins:this.state.plugins.needsApprovalPlugins,
                        toggleInstallPlugin: this.toggleInstallPlugin.bind(this),
                        key:'Needsapproval'
                    }, null),
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

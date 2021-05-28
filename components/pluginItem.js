'use strict';

//sample data
/*archive_url: "https://api.github.com/repos/mattributes/hello-world/{archive_format}{/ref}"
archived: false
assignees_url: "https://api.github.com/repos/mattributes/hello-world/assignees{/user}"
blobs_url: "https://api.github.com/repos/mattributes/hello-world/git/blobs{/sha}"
branches_url: "https://api.github.com/repos/mattributes/hello-world/branches{/branch}"
clone_url: "https://github.com/mattributes/hello-world.git"
collaborators_url: "https://api.github.com/repos/mattributes/hello-world/collaborators{/collaborator}"
comments_url: "https://api.github.com/repos/mattributes/hello-world/comments{/number}"
commits_url: "https://api.github.com/repos/mattributes/hello-world/commits{/sha}"
compare_url: "https://api.github.com/repos/mattributes/hello-world/compare/{base}...{head}"
contents_url: "https://api.github.com/repos/mattributes/hello-world/contents/{+path}"
contributors_url: "https://api.github.com/repos/mattributes/hello-world/contributors"
created_at: "2020-11-02T16:48:55Z"
default_branch: "main"
deployments_url: "https://api.github.com/repos/mattributes/hello-world/deployments"
description: "Created from FormIt Plugin Playground"
disabled: false
downloads_url: "https://api.github.com/repos/mattributes/hello-world/downloads"
events_url: "https://api.github.com/repos/mattributes/hello-world/events"
fork: false
forks: 0
forks_count: 0
forks_url: "https://api.github.com/repos/mattributes/hello-world/forks"
full_name: "mattributes/hello-world"
git_commits_url: "https://api.github.com/repos/mattributes/hello-world/git/commits{/sha}"
git_refs_url: "https://api.github.com/repos/mattributes/hello-world/git/refs{/sha}"
git_tags_url: "https://api.github.com/repos/mattributes/hello-world/git/tags{/sha}"
git_url: "git://github.com/mattributes/hello-world.git"
has_downloads: true
has_issues: true
has_pages: true
has_projects: true
has_wiki: true
homepage: null
hooks_url: "https://api.github.com/repos/mattributes/hello-world/hooks"
html_url: "https://github.com/mattributes/hello-world"
id: 309434589
issue_comment_url: "https://api.github.com/repos/mattributes/hello-world/issues/comments{/number}"
issue_events_url: "https://api.github.com/repos/mattributes/hello-world/issues/events{/number}"
issues_url: "https://api.github.com/repos/mattributes/hello-world/issues{/number}"
keys_url: "https://api.github.com/repos/mattributes/hello-world/keys{/key_id}"
labels_url: "https://api.github.com/repos/mattributes/hello-world/labels{/name}"
language: "HTML"
languages_url: "https://api.github.com/repos/mattributes/hello-world/languages"
license: null
merges_url: "https://api.github.com/repos/mattributes/hello-world/merges"
milestones_url: "https://api.github.com/repos/mattributes/hello-world/milestones{/number}"
mirror_url: null
name: "hello-world"
node_id: "MDEwOlJlcG9zaXRvcnkzMDk0MzQ1ODk="
notifications_url: "https://api.github.com/repos/mattributes/hello-world/notifications{?since,all,participating}"
open_issues: 0
open_issues_count: 0
owner: {
    avatar_url: "https://avatars3.githubusercontent.com/u/1610069?v=4"
    events_url: "https://api.github.com/users/mattributes/events{/privacy}"
    followers_url: "https://api.github.com/users/mattributes/followers"
    following_url: "https://api.github.com/users/mattributes/following{/other_user}"
    gists_url: "https://api.github.com/users/mattributes/gists{/gist_id}"
    gravatar_id: ""
    html_url: "https://github.com/mattributes"
    id: 1610069
    login: "mattributes"
    node_id: "MDQ6VXNlcjE2MTAwNjk="
    organizations_url: "https://api.github.com/users/mattributes/orgs"
    received_events_url: "https://api.github.com/users/mattributes/received_events"
    repos_url: "https://api.github.com/users/mattributes/repos"
    site_admin: false
    starred_url: "https://api.github.com/users/mattributes/starred{/owner}{/repo}"
    subscriptions_url: "https://api.github.com/users/mattributes/subscriptions"
    type: "User"
    url: "https://api.github.com/users/mattributes"
}
private: false
pulls_url: "https://api.github.com/repos/mattributes/hello-world/pulls{/number}"
pushed_at: "2020-11-02T16:50:15Z"
releases_url: "https://api.github.com/repos/mattributes/hello-world/releases{/id}"
score: 1
size: 5
ssh_url: "git@github.com:mattributes/hello-world.git"
stargazers_count: 0
stargazers_url: "https://api.github.com/repos/mattributes/hello-world/stargazers"
statuses_url: "https://api.github.com/repos/mattributes/hello-world/statuses/{sha}"
subscribers_url: "https://api.github.com/repos/mattributes/hello-world/subscribers"
subscription_url: "https://api.github.com/repos/mattributes/hello-world/subscription"
svn_url: "https://github.com/mattributes/hello-world"
tags_url: "https://api.github.com/repos/mattributes/hello-world/tags"
teams_url: "https://api.github.com/repos/mattributes/hello-world/teams"
topics: ["formit-plugin"]
trees_url: "https://api.github.com/repos/mattributes/hello-world/git/trees{/sha}"
updated_at: "2020-11-02T16:50:18Z"
url: "https://api.github.com/repos/mattributes/hello-world"
watchers: 0
watchers_count: 0*/

class PluginItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            //isInstalled : this.props.pluginData.isInstalled
            iconUrl: '',
            showOnThisPlatform: true
        };

        this.previewRef = React.createRef();

        //not using react state to avoid async problems with click events.
        this.canOpen = true;

        this.fetchManifest();
    }

    async fetchManifest(){

        try {
            // first, try to get manifest.json at the root folder
            let manifestURL = (this.props.pluginData.git_url) 
                ? `https://${this.props.pluginData.owner.login}.github.io/${this.props.pluginData.name}/manifest.json`
                : `${this.props.pluginData.local_url}/manifest.json`;

            const pluginName = (this.props.pluginData.git_url) 
            ? `${this.props.pluginData.name}`
            : `${this.props.pluginData.local_url}`;

            let manifestObject = await fetch(manifestURL);

            // if we couldn't find it at the root, use versions.json to get the versioned path
            if (!manifestObject.ok) {

                console.log("No manifest.json found at the root directory for " + pluginName + ", looking for a versioned subfolder instead...");

                // try to get versions.json
                const versionsURL = (this.props.pluginData.git_url) 
                ? `https://${this.props.pluginData.owner.login}.github.io/${this.props.pluginData.name}/versions.json`
                : `${this.props.pluginData.local_url}/versions.json`;

                const versionsObject = await fetch(versionsURL);

                if (!versionsObject.ok) {

                    // we couldn't find  versions.json
                    throw Error("No versions.json found. " + versionsObject.statusText);

                }
 
                // get the versions JSON from the object
                const versionsJSON = await versionsObject.json();

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
                    throw Error("No valid path found in versions.json. " + manifestObject.statusText);
                }

                const versionedURL = (this.props.pluginData.git_url) 
                ? `https://${this.props.pluginData.owner.login}.github.io/${this.props.pluginData.name}/${versionPath}/manifest.json`
                : `${this.props.pluginData.local_url}/${versionPath}/manifest.json`;

                manifestObject = await fetch(versionedURL);
                manifestURL = versionedURL;

                if (!manifestObject.ok) {

                    // we still couldn't find manifest.json
                    throw Error("No manifest.json found in the version subfolder, either. " + manifestObject.statusText);
                }
            }

            const manifestJSON = await manifestObject.json();

            if (manifestJSON.hasOwnProperty('Platforms'))
            {
                let currentPlatform = FormItInterface.Platform;

                if (manifestJSON.Platforms.includes(currentPlatform))
                {
                    this.setState({
                        showOnThisPlatform: true
                    });
                }
                else                
                {
                    this.setState({
                        showOnThisPlatform: false
                    });
                    return;
                }
            }

            this.props.addToGroupTotal();

            this.setState({
                manifest: manifestJSON
            });

            // set the icon
            if (manifestJSON && manifestJSON.PanelIcon) {

                // the PLUGINLOCATION specified in the manifest is the same as the dir where the manifest is
                const pluginLocation = manifestURL.replace('/manifest.json', '');

                const iconUrl = `${manifestJSON.PanelIcon.replace('PLUGINLOCATION', pluginLocation)}`;

                this.setState({iconUrl})
            }
            
        }catch(e){
            console.log('Could not fetch manifest for', this.props.pluginData, e);
        }
    }

    async handleToggleChange(e){
        const newInstallState = !this.props.pluginData.isInstalled;

        this.props.toggleInstallPlugin(this.props.pluginData, newInstallState);

        /*this.setState({
            isInstalled: newInstallState
        });*/
    }

    componentDidUpdate(){
        if (this.state.active){
            if (this.previewRef && this.previewRef.current){
                this.previewRef.current.focus();
            }
        }
    }

    handleBlur(){
        this.setState({
            active:false,
        });

        //to prevent re-opening when re-clicked.
        this.canOpen = false;

        setTimeout(() => {
            this.canOpen = true;
        }, 500);
    }

    async handlePreviewClick(){
        if (!this.canOpen){
            return;
        }

        if (!this.state.markdown){
            try{
                //For now, going to make a "guess" at github pages url
                const url = this.props.pluginData.git_url 
                    ? `https://${this.props.pluginData.owner.login}.github.io/${this.props.pluginData.name}/README.md`
                    : `${this.props.pluginData.local_url}/README.md`;

                //const url = `https://raw.githubusercontent.com/${this.props.pluginData.full_name}/main/README.md`
                const resultObj = await fetch(url);

                if (!resultObj.ok) {
                    throw Error(resultObj.statusText);
                }

                const data = await resultObj.text();

                this.setState({
                    markdown: marked(data)
                });
            }
            catch(e){
                console.log(e)
                this.setState({
                    markdown: `This plugin repo does not have a README.md to display.` //TODO just use git metadata?
                });
            }
        }

        this.setState({
            active:true
        });
    }

    render(){
        if (!this.state.showOnThisPlatform)
        {
            return null;
        }

        const pluginInstallButton = React.createElement(
            'div',
            {
                key: this.props.pluginData.id + 'install',
                className: 'field',
                title: this.state.isInstalled ? 'Uninstall': 'Install',
                onClick: (e) => {
                    //TODO Not working, find out why.
                    //e.preventDefault();
                    //e.stopPropagation();
                }
            },
            [
                React.createElement(
                    'input',
                    {
                        id: this.props.pluginData.id + 'switchInput',
                        name: this.props.pluginData.id + 'switchInput',
                        key: this.props.pluginData.id + 'switchInput',
                        className: 'switch is-rounded is-success',
                        type:'checkbox',
                        checked: this.props.pluginData.isInstalled,
                        //defaultChecked: this.props.pluginData.isInstalled,//this.state.isInstalled,
                        onChange: this.handleToggleChange.bind(this),
                        
                    }
                ),
                React.createElement(
                    'label',
                    {
                        key: this.props.pluginData.id + 'switchLabel',
                        htmlFor: this.props.pluginData.id + 'switchInput',
                        
                    },
                    ''
                )
            ]
        );

        const pluginName = React.createElement(
            'div',
            {
                key: this.props.id + 'name',
                className: 'pluginName'
            },
            this.state.manifest
                ? this.state.manifest.PluginName 
                : this.props.pluginData.name || this.props.pluginData.local_url
        );

        const pluginDescription = React.createElement(
            'div',
            {
                key: this.props.pluginData.id + 'description',
                className: 'pluginDescription'
            },
            this.state.manifest
                ? this.state.manifest.PluginDescription 
                : this.props.pluginData.description || 'No description'
        );

        const pluginStars = this.props.pluginData.git_url
            ? React.createElement(
                'div',
                {
                    key: this.props.pluginData.id + 'stars',
                    className: 'pluginStarsContainer'
                },
                [
                    React.createElement(
                        'i', 
                        {
                            key: this.props.pluginData.id + 'star', 
                            className:`fas fa-star ${this.props.pluginData.isApproved ? 'is-approved' : ''}`
                        },
                        ''
                    ),
                    React.createElement(
                        'div',
                        {
                            key: this.props.pluginData.id + 'count',
                            className: 'starCount'
                        },
                        this.props.pluginData.stargazers_count
                    ),
                ]
            )
            : null;

        const authorInfo = this.props.pluginData.git_url 
            ? React.createElement(
                'div',
                {
                    key: this.props.pluginData.id + 'authorContainer',
                    className: 'authorContainer'
                },
                [
                    React.createElement(
                        'img',
                        {
                            key: this.props.pluginData.id + 'authorImg',
                            className: '',
                            src: this.props.pluginData.owner.avatar_url
                        },
                        null
                    ),
                    React.createElement(
                        'div',
                        {
                            key: this.props.pluginData.id + 'authorName',
                            className: ''
                        },
                        this.props.pluginData.owner.login
                    )
                ]
            )
            : null;

        const githubButton = this.props.pluginData.git_url
            ? React.createElement('a',
                {
                    key: this.props.pluginData.id + 'githubbutton',
                    className:'githubButton',
                    onClick: (e) => {
                        FormItInterface.CallMethod("FormIt.OpenURL", this.props.pluginData.html_url);
                        e.stopPropagation();
                        e.preventDefault();
                    },
                    title:'Visit github project'
                },
                React.createElement('i', {className:'fab fa-github fa-lg'}, '')
            )
            : null

        return React.createElement(
            'li',
            {
                className: `${this.state.active ? 'active' : ''} ${this.props.pluginData.isPromoted ? 'isPromoted': ''}`,
                onClick: this.handlePreviewClick.bind(this),
                onBlur: this.handleBlur.bind(this),
                //key: `plugin-${this.props.pluginData.id}`
            },
            [
                React.createElement(
                    'div',
                    {
                        className: 'columns is-mobile',
                        key: 'columns'
                    },
                    [
                        React.createElement(
                            'div',
                            {
                                key: this.props.pluginData.id + 'col1',
                                className: 'column pluginIcon'
                            },
                            this.state.iconUrl
                                ? React.createElement(
                                    'img',
                                    {
                                        src: this.state.iconUrl
                                    },
                                    null
                                )
                                : null
                        ),
                        React.createElement(
                            'div',
                            {
                                key: this.props.pluginData.id + 'col2',
                                className: 'column pluginContent is-three-quarters'
                                
                            },
                            [
                                pluginStars,
                                pluginName,
                                pluginDescription,
                                authorInfo,
                            ]
                        ),
                        React.createElement(
                            'div',
                            {
                                key: this.props.pluginData.id + 'col3',
                                className: 'column pluginControls'
                            },
                            pluginInstallButton,
                            githubButton,
                        )
                    ]
                ),
                React.createElement(
                    'div', 
                    {
                        ref: this.previewRef,
                        tabIndex: -1,
                        key: 'markdown',
                        className: `preview`
                    },
                    [
                        React.createElement(
                            'div', 
                            {
                                key: 'loading',
                                className: `${this.state.markdown ? '' : 'control is-loading'}`,
                                dangerouslySetInnerHTML: {__html: this.state.markdown,}
                            },
                            null
                        )
                    ]
                )
            ]
        );
    }
}

export default PluginItem;
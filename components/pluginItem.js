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

let showVerbosePluginItemConsoleMessages = false;

// wrapper for console.log to toggle additional pluginItem console messages
let pluginItemConsoleLog = function(consoleMessage)
{
    if (showVerbosePluginItemConsoleMessages)
    {
        console.log(consoleMessage);
    }
}

class PluginItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            //isInstalled : this.props.pluginData.isInstalled
            iconUrl: '',
            isRecentlyUpdated: ''
        };

        this.handleMarkdownClick = this.handleMarkdownClick.bind(this);

        this.isInstalled = props.pluginData.isInstalled;

        this.previewRef = React.createRef();

        //not using react state to avoid async problems with click events.
        this.canOpen = true;

        this.processManifest();
    }

    processManifest(){
        try {

            if(!("manifest" in this.props.pluginData))
                return

            let manifestJSON = this.props.pluginData.manifest,
                manifestURL = manifestJSON.manifestURL;

            this.state.manifest = manifestJSON;

            // set the icon
            if (manifestJSON && manifestJSON.PanelIcon) {

                // the PLUGINLOCATION specified in the manifest is the same as the dir where the manifest is
                const pluginLocation = manifestURL.replace('/manifest.json', '');

                const iconUrl = `${manifestJSON.PanelIcon.replace('PLUGINLOCATION', pluginLocation)}`;

                this.state.iconUrl = iconUrl;
            }

            // calculate how recently the plugin was updated 
            const maxDaysElapsed = 10;
            let lastPushDate = new Date(this.props.pluginData.pushed_at);
            let today = new Date();

            let timeSinceLastUpdate = today.getTime() - lastPushDate.getTime();
            let daysSinceLastUpdate = timeSinceLastUpdate / (1000 * 3600 * 24);

            this.state.isRecentlyUpdated = daysSinceLastUpdate < maxDaysElapsed;
            
        }catch(e){
            console.log('Could not fetch manifest for', this.props.pluginData.name, e);
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

    async handlePreviewClick() {
        if (!this.state.active)
        {
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
        else {
            this.setState({
                active:false
            });
        }
    }

    handleMarkdownClick(event){
        if (event.target && event.target.href){
            const href = event.target.href;

            if (FormIt.OpenURL){
                FormIt.OpenURL(href); 
            }else{
                FormItInterface.CallMethod("FormIt.OpenURL", href);
            }
        }
    }

    render(){
        const pluginInstallButton = React.createElement(
            'div',
            {
                key: this.props.pluginData.id + 'install',
                className: 'field',
                title: this.state.isInstalled ? 'Uninstall': 'Install'
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
                : this.props.pluginData.description || 'No description provided.'
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

            const updateTags = this.props.pluginData.git_url 
            ? React.createElement(
                'div',
                {
                    key: this.props.pluginData.id + 'updateTagsContainer',
                    className: 'updateTagsContainer'
                },
                [
                    // the updated recently tag, if applicable
                    React.createElement(
                        'div',
                        {
                            key: this.props.pluginData.pushed_at,
                            className: this.state.isRecentlyUpdated ? 'lastUpdatedTag' : '',
                            title: 'Last updated: ' + this.props.pluginData.pushed_at
                        },
                        this.state.isRecentlyUpdated ? 'Recently updated' : ''
                    )
                ]
            )
            : null;

        // the "see more" link that reveals the preview
        const seeMore = React.createElement(
            'a',
            {
                key: this.props.pluginData.id + 'SeeMoreHyperlink',
                id: 'seeMoreHyperlink',
                className: 'pluginSeeMoreContainer',
                onClick: this.handlePreviewClick.bind(this)
            },
                this.state.active ? 'See Less' : 'See More'
        );

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
                    title:'Visit GitHub project'
                },
                React.createElement('i', {className:'fab fa-github fa-lg'}, '')
            )
            : null

        // the entire plugin item
        return React.createElement(
            'li',
            {
                id: this.props.pluginData.name + 'Container',
                className: `${this.state.active ? 'active' : ''} ${this.props.pluginData.isPromoted ? 'isPromoted': ''}`
                //key: `plugin-${this.props.pluginData.id}`
            },
            [
                // the plugin content container
                React.createElement(
                    'div',
                    {
                        className: 'columns is-mobile',
                        id: this.props.pluginData.name + 'ContentContainer',
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
                                updateTags,
                                seeMore
                            ]
                        ),
                        React.createElement(
                            'div',
                            {
                                key: this.props.pluginData.id + 'col3',
                                className: 'column pluginControls'
                            },
                            pluginInstallButton,
                            githubButton
                        )
                    ]
                ),

                // the panel of additional info, including a GitHub preview
                React.createElement(
                    'div', 
                    {
                        key: 'pluginInfoContainer',
                        className: `preview`,
                        id: 'pluginInfoContainer'
                    },
                    [
                        // the plugin type label
                        React.createElement(
                            'div', 
                            {
                                key: 'pluginTypeLabel',
                                className: 'pluginInfoLabel'
                            }, 'Plugin type: ',

                            React.createElement(
                                'div', 
                                {
                                    key: 'pluginTypeData',
                                    className: `pluginInfoData`
                                },
                                (this.state.manifest && this.state.manifest.PluginType) ? this.state.manifest.PluginType : 'Not specified'
                            ),
                        ),
                        // the plugin platform label
                        React.createElement(
                            'div', 
                            {
                                key: 'pluginPlatformLabel',
                                className: 'pluginInfoLabel'
                            }, 'Platforms: ',

                            React.createElement(
                                'div', 
                                {
                                    key: 'pluginPlatformData',
                                    className: `pluginInfoData`
                                },
                                (this.state.manifest && this.state.manifest.Platforms) ? this.state.manifest.Platforms : 'Web, Windows'
                            ),
                        ),
                        // the README label
                        React.createElement(
                            'div', 
                            {
                                key: 'READMELabel',
                                className: `pluginInfoLabel`
                            },
                            'Repo description:'
                        ),
                    ],
                    React.createElement(
                        'div', 
                        {
                            ref: this.previewRef,
                            tabIndex: -1,
                            key: 'markdown',
                            className: `preview`,
                            id: this.props.pluginData.name + 'PreviewContainer',
                            onClick: this.handleMarkdownClick
                        },
                        [
                            // the github preview pane
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
                )
            ]
        );
    }
}

export default PluginItem;
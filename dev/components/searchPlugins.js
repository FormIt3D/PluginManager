'use strict';

import PluginList from "./pluginList.js";

class SearchPlugins extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: this.props.isOpen,
            searchedPlugins: []
        };
    }

    render(){
        const searchInputRef = React.createRef(),
            input =  React.createElement('input', {
                key: 'searchInput',
                className: 'input',
                type: 'text',
                placeholder: 'Search all plugins',
                value: this.state.searchTerm || '',
                onChange: (e) => {
                    const value = e.target.value;
                    this.setState({
                        searchTerm: value, 
                        searchedPlugins: this.props.plugins.filter((repo) => {
                            // Check if the plugin information contains the search term(s)
                            return (repo.manifest ? (repo.manifest.PluginName + ' ' + repo.manifest.PluginDescription + ' ' + repo.owner.login) : 
                                repo.name).toLowerCase().replace(/-/g, ' ').includes(value);
                        })
                    })
                },
                ref: searchInputRef
            })

        return [
            React.createElement('div',
            {
                id:'SearchPlugins',
                key: 'SearchPlugins',
            },
            [
                input,
                React.createElement('a',
                    {
                        key: 'SearchLink',
                        onClick: () => {
                            if (this.state.searchTerm){
                                this.setState({searchTerm: ''})
                            }
                            searchInputRef.current.focus();
                        },
                        title:'Search'
                    },
                    React.createElement('i', {key: 'SearchIcon', className:'fas fa-' + (this.state.searchTerm ? 'times' : 'search')}, '')
                )
            ]),
            this.state.searchTerm ?
            React.createElement(PluginList, {
                pluginGroup: 'Search results',
                plugins: this.state.searchedPlugins,
                toggleInstallPlugin: this.props.toggleInstallPlugin.bind(this),
                key:'Search',
                isOpen: true
            }) : null
        ];
    }
}

export default SearchPlugins
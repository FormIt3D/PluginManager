'use strict';

import PluginItem from "./pluginItem.js";

class PluginList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: this.props.isOpen,
            numItems: 0
        };

        this.addToGroupTotalFunc = this.addToGroupTotal.bind(this)
    }

    addToGroupTotal(){
        this.setState({
            numItems: this.state.numItems + 1
        });
    }

    render(){
        const pluginList = this.props.plugins.map((pluginData, i) => {
            return React.createElement(PluginItem, {
                key: `pluginItem-${this.props.pluginGroup}-${pluginData ? pluginData.id : i}`,
                pluginData,
                toggleInstallPlugin: this.props.toggleInstallPlugin,
                addToGroupTotal: this.addToGroupTotalFunc
            }, null);
        });

        /*if (this.props.pluginGroup === "Installed"){
            console.log(this.props.pluginGroup, this.props.plugins)
            console.log(pluginList)
        }*/

        return React.createElement(
            'div',
            {className: `pluginList ${this.state.isOpen ? 'open': 'closed'}`},
            [
                React.createElement(
                    'div',
                    {
                        className: 'groupHeader',
                        onClick: () => {
                            this.setState({isOpen: !this.state.isOpen})
                        },
                        key:'groupHeader'
                    },
                    [
                        React.createElement(
                            'i',
                            {
                                className:`fas fas ${this.state.isOpen ? 'fa-angle-down' : 'fa-angle-right'}`,
                                key:'expandIcon'
                            },
                            ''
                        ),
                        React.createElement(
                            'span',
                            {
                                className:'pluginGroupName',
                                key:'groupName'
                            },
                            this.props.pluginGroup
                        ),
                        this.props.groupDescription
                        ? React.createElement(
                            'div',
                            {
                                className:'groupDescription',
                                key:'groupDescription'
                            },
                            this.props.groupDescription
                        )
                        : null,
                        React.createElement(
                            'div',
                            {
                                className:'count',
                                key:'count'
                            },
                            this.state.numItems
                        )
                    ]
                ),
                React.createElement(
                    'ul',
                    {
                        className: '',
                        id: 'pluginRow',
                        key:'list'
                    },
                    pluginList
                )
            ]
        );
    }
}

export default PluginList;
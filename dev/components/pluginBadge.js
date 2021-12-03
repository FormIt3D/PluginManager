'use strict';

class PluginBadge extends React.Component {
    render(){
        return React.createElement('div',
            {
                className:'pluginBadge',
                key: 'pluginBadge',
            },
            React.createElement('div',
                {
                    className:'triangle',
                    key: 'triangle',
                },
                null
            )
        );
    }
}

export default PluginBadge
'use strict';

class InstallPluginControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: this.props.isOpen
        };
    }

    render(){
        const input =  React.createElement('input', {
            key: 'installInput',
            className: 'input',
            type: 'text',
            placeholder: 'https://your-plugin.com',
            value: this.state.installUrl || '',
            onChange: (e) => {
                const value = e.target.value;
                this.setState({installUrl: value})
            }
        });

        return React.createElement('div',
            {
                id:'InstallPluginControls',
                key: 'InstallPluginControls',
            },
            [
                React.createElement('div',
                {
                    key:'addDesc'
                }
                ,
                'Add your private or local plugin:'),
                input,
                React.createElement('a',
                    {
                        key: 'AddNew',
                        onClick: () => {
                            if (this.state.installUrl){
                                this.props.addPlugin(this.state.installUrl);
                                this.setState({installUrl: ''});
                            }
                        },
                        title:'Add'
                    },
                    React.createElement('i', {key: 'AddIcon', className:'fas fa-plus-circle'}, '')
                ),
            ]
        );
    }
}

export default InstallPluginControls
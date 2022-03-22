'use strict';

class InstallPluginControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: this.props.isOpen
        };

        FormItInterface.SubscribeMessage("FormIt.Message.kInstallPlugin", (data) => {
            let jsonObj = JSON.parse(data);
            if (this.state.installUrl.startsWith(jsonObj.payload)) {
                this.setState({installUrl: ''});
            }
        });
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
                React.createElement('button',
                    {
                        key: 'AddNew',
                        className: "formit-web-button proceed",
                        onClick: () => {
                            if (this.state.installUrl){
                                this.props.addPlugin(this.state.installUrl);
                            }
                        },
                        title:'Add'
                    },
                    "Install"
                ),
                React.createElement('button',
                    {
                        key: 'LoadNew',
                        className: "formit-web-button",
                        onClick: () => {
                            if (this.state.installUrl){
                                this.props.loadPlugin(this.state.installUrl);
                            }
                        },
                        title:'Load'
                    },
                    "Load"
                )
            ]
        );
    }
}

export default InstallPluginControls
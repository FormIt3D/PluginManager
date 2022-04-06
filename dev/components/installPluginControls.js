'use strict';

class InstallPluginControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: this.props.isOpen
        };

        FormItInterface.SubscribeMessage("FormIt.Message.kInstallPlugin", (installedPlugin) => {
            if (this.state.installUrl.startsWith(installedPlugin)) {
                this.setState({installUrl: ''});
                if(this.notificationHandle)
                    FormIt.UI.CloseNotification(this.notificationHandle);
                FormIt.UI.ShowNotification(
                    "Plugin installed.",
                    FormIt.NotificationType.Success,
                    3000
                );
            }
        });
    }

    notificationHandle

    async showLoadingMessage(isLoading = false) {
        let copyInstallUrl = this.state.installUrl
        this.notificationHandle = await FormIt.UI.ShowNotification(
            "Attempting to install plugin...",
            FormIt.NotificationType.Information,
            5000
        );
        setTimeout(() => {
            if(this.state.installUrl == copyInstallUrl) {
                FormIt.UI.ShowNotification(
                    `Failed to ${isLoading ? 'load' : 'install'} plugin. Check your internet connection or ${FormItInterface.Platform == 'Windows' ? 'Script Editor' : 'console'} for errors.`,
                    FormIt.NotificationType.Error,
                    10000
                );
            }
        }, 5000);
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
                                this.showLoadingMessage();
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
                                this.setState({installUrl: ''});
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
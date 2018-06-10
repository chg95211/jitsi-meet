// @flow

import Tabs from '@atlaskit/tabs';
import React, { Component } from 'react';

import { StatelessDialog } from '../../../base/dialog';
import { translate } from '../../../base/i18n';

const logger = require('jitsi-meet-logger').getLogger(__filename);

/**
 * The type of the React {@code Component} props of {@link TabContainer}.
 */
export type Props = {

    /**
     * Which settings tab should be initially displayed. If not defined then
     * the first tab will be displayed.
     */
    defaultTab: number,

    /**
     * Disables dismissing the dialog when the blanket is clicked. Enabled
     * by default.
     */
    disableBlanketClickDismiss: boolean,

    /**
     * Callback invoked to close the dialog without saving changes.
     */
    onCancel: Function,

    /**
     * Callback invoked to save settings changes.
     */
    onSubmit: Function,


    /**
     * Invoked to obtain translated strings.
     */
    t: Function,

    tabs: Array<Object>

};

/**
 * The type of the React {@code Component} state of {@link TabContainer}.
 */
type State = {
    tabStates: Array<Object>
};

/**
 * A React {@code Component} for displaying a dialog with tabs.
 *
 * @extends Component
 */
class TabContainer extends Component<Props, State> {
    /**
     * Initializes a new {@code TabContainer} instance.
     *
     * @param {Object} props - The read-only React {@code Component} props with
     * which the new instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);
        const tabStates = this.props.tabs.map(tab => {
            return tab.props;
        });

        this.state = { tabStates };
        this._onSubmit = this._onSubmit.bind(this);
        this._onTabStateChange = this._onTabStateChange.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <StatelessDialog
                disableBlanketClickDismiss
                    = { this.props.disableBlanketClickDismiss }
                onCancel = { this.props.onCancel }
                onSubmit = { this._onSubmit }
                titleKey = 'settings.title'>
                <div className = 'settings-dialog'>
                    { this._renderTabs() }
                </div>
            </StatelessDialog>
        );
    }

    /**
     *
     */
    _renderTabs() {
        const { defaultTab = 0, onCancel, t, tabs } = this.props;
        const closeDialog = onCancel;

        if (tabs.length === 1) {
            return tabs[0].content;
        }

        if (tabs.length > 1) {
            return (
                <Tabs
                    tabs = {
                        tabs.map(({ className, component, label }, idx) => {
                            return {
                                content: <div className = { className }>
                                    <component
                                        closeDialog = { closeDialog }
                                        onTabStateChange
                                            = { this._onTabStateChange }
                                        { ...this.state.tabStates[idx] } />
                                </div>,
                                defaultSelected: defaultTab === idx,
                                label: t(label)
                            };
                        })
                    } />);
        }

        logger.warn('No settings tabs configured to display.');

        return null;
    }

    _onTabStateChange: (number, Object) => void;

    /**
     * Sets the state of a tab.
     */
    _onTabStateChange(tabId, state) {
        const tabStates = [ ...this.state.tabStates ];

        tabStates[tabId] = state;
        this.setState({ tabStates });
    }

    _onSubmit: () => void;

    /**
     *
     */
    _onSubmit() {
        const { onSubmit, tabs } = this.props;

        tabs.forEach(({ submit }, idx) => {
            submit(this.state.tabStates[idx]);
        });

        onSubmit();
    }
}

export default translate(TabContainer);

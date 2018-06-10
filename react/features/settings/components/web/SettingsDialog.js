// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { hideDialog } from '../../../base/dialog';
import {
    getLocalParticipant,
    PARTICIPANT_ROLE
} from '../../../base/participants';
import {
    DeviceSelection,
    getDeviceSelectionDialogProps,
    submitDeviceSelectionTab
} from '../../../device-selection';

import TabContainer from './TabContainer';
import MoreTab from './MoreTab';
import ProfileTab from './ProfileTab';
import { getMoreTabProps, getProfileTabProps } from '../../functions';
import { submitMoreTab, submitProfileTab } from '../../actions';
import { SETTINGS_TABS } from '../../constants';

declare var APP: Object;
declare var interfaceConfig: Object;

/**
 * The type of the React {@code Component} props of
 * {@link ConnectedSettingsDialog}.
 */
type Props = {

    /**
     * Which settings tab should be initially displayed. If not defined then
     * the first tab will be displayed.
     */
    defaultTab: string,

    tabs: Array<Object>,

    /**
     * Invoked to save changed settings.
     */
    dispatch: Function,
};

/**
 * A React {@code Component} for displaying a dialog to modify local settings
 * and conference-wide (moderator) settings. This version is connected to
 * redux to get the current settings.
 *
 * @extends Component
 */
class SettingsDialog extends Component<Props> {
    /**
     * Initializes a new {@code ConnectedSettingsDialog} instance.
     *
     * @param {Props} props - The React {@code Component} props to initialize
     * the new {@code ConnectedSettingsDialog} instance with.
     */
    constructor(props: Props) {
        super(props);

        // Bind event handlers so they are only bound once for every instance.
        this._onCloseDialog = this._onCloseDialog.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { tabs, defaultTab } = this.props;
        const defaultTabIdx = tabs.findIndex(({ name }) => name === defaultTab);

        return (
            <TabContainer
                defaultTab = {
                    defaultTabIdx === -1 ? undefined : defaultTabIdx
                }
                onCancel = { this._onCloseDialog }
                onSubmit = { this._onCloseDialog }
                tabs = { tabs } />
        );
    }

    _onCloseDialog: () => void;

    /**
     * Callback invoked to close the dialog without saving changes.
     *
     * @private
     * @returns {void}
     */
    _onCloseDialog() {
        this.props.dispatch(hideDialog());
    }
}

/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code ConnectedSettingsDialog} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     tabs: Array<Object>
 * }}
 */
function _mapStateToProps(state) {
    const configuredTabs = interfaceConfig.SETTINGS_SECTIONS || [];
    const jwt = state['features/base/jwt'];
    const localParticipant = getLocalParticipant(state);

    // The settings sections to display.
    const showDeviceSettings = configuredTabs.includes('devices');
    const showLanguageSettings = configuredTabs.includes('language');
    const showModeratorSettings
        = configuredTabs.includes('moderator')
            && localParticipant.role === PARTICIPANT_ROLE.MODERATOR;
    const showProfileSettings
        = configuredTabs.includes('profile') && jwt.isGuest;

    const tabs = [];

    if (showDeviceSettings) {
        tabs.push({
            name: SETTINGS_TABS.DEVICES,
            component: DeviceSelection,
            label: 'settings.devices',
            props: getDeviceSelectionDialogProps(state),
            styles: 'settings-pane devices-pane',
            submit: submitDeviceSelectionTab
        });
    }

    if (showProfileSettings) {
        tabs.push({
            name: SETTINGS_TABS.PROFILE,
            component: ProfileTab,
            label: 'profile.title',
            props: getProfileTabProps(state),
            styles: 'settings-pane profile-pane',
            submit: submitProfileTab
        });
    }

    if (showModeratorSettings || showLanguageSettings) {
        tabs.push({
            name: SETTINGS_TABS.MORE,
            component: MoreTab,
            label: 'settings.more',
            props: getMoreTabProps(state),
            styles: 'settings-pane more-pane',
            submit: submitMoreTab
        });
    }

    return { tabs };
}

export default connect(_mapStateToProps)(SettingsDialog);

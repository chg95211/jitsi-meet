// @flow

import { setFollowMe, setStartMutedPolicy } from '../base/conference';
import { openDialog } from '../base/dialog';
import { i18next } from '../base/i18n';

import { SET_SETTINGS_VIEW_VISIBLE } from './actionTypes';
import { SettingsDialog } from './components';
import { getMoreTabProps, getProfileTabProps } from './functions';

/**
 * Sets the visibility of the view/UI which renders the app's settings.
 *
 * @param {boolean} visible - If the view/UI which renders the app's settings is
 * to be made visible, {@code true}; otherwise, {@code false}.
 * @returns {{
 *     type: SET_SETTINGS_VIEW_VISIBLE,
 *     visible: boolean
 * }}
 */
export function setSettingsViewVisible(visible: boolean) {
    return {
        type: SET_SETTINGS_VIEW_VISIBLE,
        visible
    };
}

/**
 * Opens {@code SettingsDialog}.
 *
 * @param {string} defaultTab - The tab in {@code SettingsDialog} that should be
 * displayed initially.
 * @returns {Function}
 */
export function openSettingsDialog(defaultTab: string) {
    return openDialog(SettingsDialog, { defaultTab });
}


/**
 *
 */
export function submitMoreTab(newState) {
    return (dispatch, getState) => {
        const currentState = getMoreTabProps(getState());

        if (newState.displayName !== currentState.displayName) {
            APP.conference.changeLocalDisplayName(newState.displayName);
        }

        if (newState.email !== currentState.email) {
            APP.conference.changeLocalEmail(newState.email);
        }

        if (newState.followMe !== currentState.followMe) {
            dispatch(setFollowMe(newState.followMe));
        }

        if (newState.startAudioMuted !== currentState.startAudioMuted
            || newState.startVideoMuted !== currentState.startVideoMuted) {
            dispatch(setStartMutedPolicy(
                newState.startAudioMuted, newState.startVideoMuted));
        }

        if (newState.language !== currentState.language) {
            i18next.changeLanguage(newState.language);
        }
    };
}

/**
 *
 */
export function submitProfileTab(newState) {
    return (dispatch, getState) => {
        const currentState = getProfileTabProps(getState());

        if (newState.displayName !== currentState.displayName) {
            APP.conference.changeLocalDisplayName(newState.displayName);
        }

        if (newState.email !== currentState.email) {
            APP.conference.changeLocalEmail(newState.email);
        }
    };
}

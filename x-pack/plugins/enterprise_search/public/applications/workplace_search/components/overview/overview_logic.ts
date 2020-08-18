/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { HttpSetup } from 'src/core/public';

import { kea, MakeLogicType } from 'kea';

import { IAccount, IOrganization, IUser } from '../../types';
import { IFlashMessagesProps } from '../../../shared/types';

import { IFeedActivity } from './recent_activity';

export interface IOverviewServerData {
  hasUsers: boolean;
  hasOrgSources: boolean;
  canCreateContentSources: boolean;
  canCreateInvitations: boolean;
  isOldAccount: boolean;
  sourcesCount: number;
  pendingInvitationsCount: number;
  accountsCount: number;
  personalSourcesCount: number;
  activityFeed: IFeedActivity[];
  organization: IOrganization;
  isFederatedAuth: boolean;
  currentUser: IUser;
  fpAccount: IAccount;
}

export interface IOverviewActions {
  setServerData(serverData: IOverviewServerData): IOverviewServerData;
  setFlashMessages(flashMessages: IFlashMessagesProps): { flashMessages: IFlashMessagesProps };
  setHasErrorConnecting(hasErrorConnecting: boolean): { hasErrorConnecting: boolean };
  initializeOverview({ http }: { http: HttpSetup }): { http: HttpSetup };
}

export interface IOverviewValues extends IOverviewServerData {
  dataLoading: boolean;
  hasErrorConnecting: boolean;
  flashMessages: IFlashMessagesProps;
}

export const OverviewLogic = kea<MakeLogicType<IOverviewValues, IOverviewActions>>({
  actions: {
    setServerData: (serverData) => serverData,
    setFlashMessages: (flashMessages) => ({ flashMessages }),
    setHasErrorConnecting: (hasErrorConnecting) => ({ hasErrorConnecting }),
    initializeOverview: ({ http }) => ({ http }),
  },
  reducers: {
    organization: [
      {} as IOrganization,
      {
        setServerData: (_, { organization }) => organization,
      },
    ],
    isFederatedAuth: [
      true,
      {
        setServerData: (_, { isFederatedAuth }) => isFederatedAuth,
      },
    ],
    currentUser: [
      {} as IUser,
      {
        setServerData: (_, { currentUser }) => currentUser,
      },
    ],
    fpAccount: [
      {} as IAccount,
      {
        setServerData: (_, { fpAccount }) => fpAccount,
      },
    ],
    canCreateInvitations: [
      false,
      {
        setServerData: (_, { canCreateInvitations }) => canCreateInvitations,
      },
    ],
    flashMessages: [
      {},
      {
        setFlashMessages: (_, { flashMessages }) => flashMessages,
      },
    ],
    hasUsers: [
      false,
      {
        setServerData: (_, { hasUsers }) => hasUsers,
      },
    ],
    hasOrgSources: [
      false,
      {
        setServerData: (_, { hasOrgSources }) => hasOrgSources,
      },
    ],
    canCreateContentSources: [
      false,
      {
        setServerData: (_, { canCreateContentSources }) => canCreateContentSources,
      },
    ],
    isOldAccount: [
      false,
      {
        setServerData: (_, { isOldAccount }) => isOldAccount,
      },
    ],
    sourcesCount: [
      0,
      {
        setServerData: (_, { sourcesCount }) => sourcesCount,
      },
    ],
    pendingInvitationsCount: [
      0,
      {
        setServerData: (_, { pendingInvitationsCount }) => pendingInvitationsCount,
      },
    ],
    accountsCount: [
      0,
      {
        setServerData: (_, { accountsCount }) => accountsCount,
      },
    ],
    personalSourcesCount: [
      0,
      {
        setServerData: (_, { personalSourcesCount }) => personalSourcesCount,
      },
    ],
    activityFeed: [
      [],
      {
        setServerData: (_, { activityFeed }) => activityFeed,
      },
    ],
    dataLoading: [
      true,
      {
        setServerData: () => false,
        setHasErrorConnecting: () => false,
      },
    ],
    hasErrorConnecting: [
      false,
      {
        setHasErrorConnecting: (_, { hasErrorConnecting }) => hasErrorConnecting,
      },
    ],
  },
  listeners: ({ actions }) => ({
    initializeOverview: async ({ http }) => {
      try {
        const response = await http.get('/api/workplace_search/overview');
        actions.setServerData(response);
      } catch (error) {
        actions.setHasErrorConnecting(true);
      }
    },
  }),
});

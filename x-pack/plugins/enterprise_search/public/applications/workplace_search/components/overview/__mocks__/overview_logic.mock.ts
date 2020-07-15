/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { IOverviewValues } from '../overview_logic';
import { IAccount, IOrganization, IUser } from '../../../types';

export const mockLogicValues = {
  accountsCount: 0,
  activityFeed: [],
  canCreateContentSources: false,
  canCreateInvitations: true,
  currentUser: {} as IUser,
  fpAccount: {} as IAccount,
  hasOrgSources: false,
  hasUsers: false,
  isFederatedAuth: true,
  isOldAccount: false,
  organization: {} as IOrganization,
  pendingInvitationsCount: 0,
  personalSourcesCount: 0,
  sourcesCount: 0,
  dataLoading: true,
  hideOnboarding: false,
  hasErrorConnecting: false,
  statsColumns: 'halves',
  flashMessages: {},
} as IOverviewValues;

jest.mock('kea', () => ({
  ...(jest.requireActual('kea') as object),
  useActions: jest.fn(() => ({
    initializeOverview: () => ({}),
  })),
  useValues: jest.fn(() => ({
    ...mockLogicValues,
  })),
}));

import { useValues } from 'kea';

export const setMockValues = (values: object) => {
  (useValues as jest.Mock).mockImplementationOnce(() => {
    return {
      ...useValues(),
      ...values,
    };
  });
};

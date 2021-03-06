/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { useContext, useEffect } from 'react';
import { EuiPage, EuiPageBody, EuiSpacer } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { useActions, useValues } from 'kea';

import { SetWorkplaceSearchChrome as SetPageChrome } from '../../../shared/kibana_chrome';
import { SendWorkplaceSearchTelemetry as SendTelemetry } from '../../../shared/telemetry';
import { KibanaContext, IKibanaContext } from '../../../index';

import { OverviewLogic, IOverviewActions, IOverviewValues } from './overview_logic';

import { ErrorState } from '../error_state';

import { Loading } from '../shared/loading';
import { ProductButton } from '../shared/product_button';
import { ViewContentHeader } from '../shared/view_content_header';

import { OnboardingSteps } from './onboarding_steps';
import { OrganizationStats } from './organization_stats';
import { RecentActivity } from './recent_activity';

const ONBOARDING_HEADER_TITLE = i18n.translate(
  'xpack.enterpriseSearch.workplaceSearch.overviewOnboardingHeader.title',
  { defaultMessage: 'Get started with Workplace Search' }
);

const HEADER_TITLE = i18n.translate('xpack.enterpriseSearch.workplaceSearch.overviewHeader.title', {
  defaultMessage: 'Organization overview',
});

const ONBOARDING_HEADER_DESCRIPTION = i18n.translate(
  'xpack.enterpriseSearch.workplaceSearch.overviewOnboardingHeader.description',
  { defaultMessage: 'Complete the following to set up your organization.' }
);

const HEADER_DESCRIPTION = i18n.translate(
  'xpack.enterpriseSearch.workplaceSearch.overviewHeader.description',
  { defaultMessage: "Your organizations's statistics and activity" }
);

export const Overview: React.FC = () => {
  const { http } = useContext(KibanaContext) as IKibanaContext;

  const { initializeOverview } = useActions(OverviewLogic) as IOverviewActions;

  const {
    dataLoading,
    hasErrorConnecting,
    hasUsers,
    hasOrgSources,
    isOldAccount,
    organization: { name: orgName, defaultOrgName },
  } = useValues(OverviewLogic) as IOverviewValues;

  useEffect(() => {
    initializeOverview({ http });
  }, [initializeOverview]);

  if (hasErrorConnecting) return <ErrorState />;
  if (dataLoading) return <Loading />;

  const hideOnboarding = hasUsers && hasOrgSources && isOldAccount && orgName !== defaultOrgName;

  const headerTitle = hideOnboarding ? HEADER_TITLE : ONBOARDING_HEADER_TITLE;
  const headerDescription = hideOnboarding ? HEADER_DESCRIPTION : ONBOARDING_HEADER_DESCRIPTION;

  return (
    <EuiPage restrictWidth>
      <SetPageChrome isRoot />
      <SendTelemetry action="viewed" metric="overview" />

      <EuiPageBody>
        <ViewContentHeader
          title={headerTitle}
          description={headerDescription}
          action={<ProductButton />}
        />
        {!hideOnboarding && <OnboardingSteps />}
        <EuiSpacer size="xl" />
        <OrganizationStats />
        <EuiSpacer size="xl" />
        <RecentActivity />
      </EuiPageBody>
    </EuiPage>
  );
};

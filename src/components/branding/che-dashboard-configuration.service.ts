/*
 * Copyright (c) 2015-2018 Red Hat, Inc.
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
'use strict';

import { CheCliTool, TogglableFeature } from './branding';
import { CheBranding } from './che-branding';

export type FooterLink = {
  title: string;
  reference: string;
  longTitle?: string;
  envSpecific?: boolean;
};

const enum ENVIRONMENTS {
  UNKNOWN="UNKNOWN",
  LOCALHOST="LOCALHOST",
  DIT="DIT",
  UAT="UAT",
  OPS="OPS"
}

/**
 * This class handles configuration data of Dashboard.
 * @author Oleksii Kurinnyi
 */
export class CheDashboardConfigurationService {

  static $inject = [
    '$q',
    'cheBranding',
    '$location',
    '$interpolate'
  ];

  $q: ng.IQService;
  cheBranding: CheBranding;
  $location: ng.ILocationService;
  $interpolate: ng.IInterpolateService;

  constructor(
    $q: ng.IQService,
    cheBranding: CheBranding,
    $location: ng.ILocationService,
    $interpolate: ng.IInterpolateService
  ) {
    this.$q = $q;
    this.cheBranding = cheBranding;
    this.$location = $location;
    this.$interpolate = $interpolate;
  }

  allowedMenuItem(menuItem: che.ConfigurableMenuItem): boolean {
    const disabledItems = this.getDisabledItems();
    return (disabledItems).indexOf(menuItem) === -1;
  }

  allowRoutes(menuItem: che.ConfigurableMenuItem): ng.IPromise<void> {
    const defer = this.$q.defer<void>();
      if (this.allowedMenuItem(menuItem)) {
        defer.resolve();
      } else {
        defer.reject();
      }

    return defer.promise;
  }

  enabledFeature(feature: TogglableFeature): boolean {
    const disabledFeatures = this.cheBranding.getConfiguration().features.disabled;
    return disabledFeatures.indexOf(feature) === -1;
  }

  getFooterLinks(): { [key: string]: FooterLink } {
    const links: { [key: string]: FooterLink } = {};
    if (this.cheBranding.getProductSupportEmail()) {
      links.supportEmail = {
        title: 'Make a wish',
        reference: this.cheBranding.getProductSupportEmail()
      };
    }
    if (this.cheBranding.getFooter().email) {
      const email = this.cheBranding.getFooter().email;
      links.email = {
        title: email.title,
        reference: email.address
      };
    }
    if (this.cheBranding.getDocs().general) {
      links.docs = {
        title: 'Docs',
        reference: this.cheBranding.getDocs().general
      };
    }
    if (this.cheBranding.getDocs().faq) {
      links.faq = {
        title: 'FAQ',
        reference: this.cheBranding.getDocs().faq
      };
    }
    if (this.cheBranding.getProductHelpPath() && this.cheBranding.getProductHelpTitle()) {
      links.supportPath = {
        title: this.cheBranding.getProductHelpTitle(),
        reference: this.cheBranding.getProductHelpPath()
      };
    }

    // Add MAAP Links
    const maapLinks = this.getMaapLinks();
    for( var key in maapLinks ) {
      links[key] = maapLinks[key];
    }

    return links;
  }

  getMaapLinks(): { [key:string]: FooterLink } {
    const ENV = this.getEnvironment();
    const maapLinks = this.cheBranding.getMaapLinks();
    let links = {};
    for( var key in maapLinks ) {
      if( ( maapLinks[key]['envSpecific'] && ENV !== ENVIRONMENTS.UNKNOWN ) || !maapLinks[key]['envSpecific'] ) {
        let reference = this.$interpolate( maapLinks[key].reference )(this.cheBranding.getMaapServiceHosts());  // Add Service Host Info
        reference = this.$interpolate( reference )({"ENV": ENV})  // Add Environment Info
        links[key] = {
          "reference": reference,
          "title": maapLinks[key].title,
          "longTitle": maapLinks[key].longTitle
        }
      }
    }
    return links;
  }

  getCliTool(): CheCliTool {
    return this.cheBranding.getConfiguration().cheCliTool || 'chectl';
  }

  /**
   * Returns a string denoting the environment (e.g. DIT, UAT, etc.)
   */
  getEnvironment(): string {
    const host = this.$location.host().toUpperCase();

    if( host === ENVIRONMENTS.LOCALHOST.valueOf() ) {
      return ENVIRONMENTS.DIT;
    }
    
    const re = /ade.([^.]+).maap-project.org/i;
    const hostMatches = host.match(re);
    let env = ENVIRONMENTS.UNKNOWN;
    if( hostMatches != null ) {
      let hostEnv = hostMatches[1].toUpperCase();

      if( hostEnv === ENVIRONMENTS.DIT.valueOf() ) {
        env = ENVIRONMENTS.DIT;
      } else if( hostEnv === ENVIRONMENTS.UAT.valueOf() ) {
        env = ENVIRONMENTS.UAT;
      } else if( hostEnv === ENVIRONMENTS.OPS.valueOf() ) {
        env = ENVIRONMENTS.OPS;
      }
    }

    return env;
  }

  private getDisabledItems(): che.ConfigurableMenuItem[] {
    const menu = this.cheBranding.getConfiguration().menu;
    const disabled = menu.disabled || [];
    const forceEnabled = menu.enabled || [];

    const disabledItems = disabled.filter(item => forceEnabled.indexOf(item) === -1);
    return disabledItems;
  }

}

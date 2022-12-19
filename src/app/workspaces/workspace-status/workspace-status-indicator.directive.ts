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

/**
 * Defines a directive for creating simple indicator of workspace's status.
 * @author Oleksii Kurinnyi
 */
export class WorkspaceStatusIndicator implements ng.IDirective {
  restrict: string;
  replace: boolean;
  scope;

  /**
   * Default constructor that is using resource
   */
  constructor () {
    this.restrict = 'E';

    this.replace = true;

    this.scope = {
      status: '=cheStatus',
      tooltipEnabled: '=tooltipEnabled'
    };
  }

  /**
   * Template for the simple indicator of workspace's status
   * @param $element
   * @param $attrs
   * @returns {string} the template
   */
  template ($element: ng.IAugmentedJQuery, $attrs: ng.IAttributes) {
    let emptyCircleOnStopped = ($attrs as any).cheEmptyCircle;

    return '<span ng-switch="status" class="workspace-status-indicator">' +
      '<span ng-switch-when="STOPPED" uib-tooltip="Workspace Stopped" tooltip-placement="top" tooltip-enable="tooltipEnabled" class="fa ' + (emptyCircleOnStopped ? 'fa-circle-o' : 'fa-circle') + ' workspace-status-stopped"></span>' +
      '<span ng-switch-when="PAUSED" uib-tooltip="Workspace Paused" tooltip-placement="top" tooltip-enable="{{tooltipEnabled}}" class="fa fa-pause workspace-status-paused"></span>' +
      '<span ng-switch-when="RUNNING" uib-tooltip="Workspace Running" tooltip-placement="top" tooltip-enable="{{tooltipEnabled}}" class="fa fa-circle workspace-status-running"></span>' +
      '<span ng-switch-when="STARTING" uib-tooltip="Workspace Starting" tooltip-placement="top" tooltip-enable="{{tooltipEnabled}}" class="workspace-status-spinner">' +
      '<div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div></div>' +
      '</span>' +
      '<span ng-switch-when="STOPPING" uib-tooltip="Workspace Stopping" tooltip-placement="top" tooltip-enable="{{tooltipEnabled}}" class="workspace-status-spinner">' +
      '<div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div></div>' +
      '</span>' +
      '<span ng-switch-when="ERROR" uib-tooltip="Workspace Error" tooltip-placement="top" tooltip-enable="{{tooltipEnabled}}" class="fa fa-circle workspace-status-error"></span>' +
      '<span ng-switch-default class="fa ' + (emptyCircleOnStopped ? 'fa-circle-o' : 'fa-circle') + ' workspace-status-default"></span>' +
      '</span>';
  }
}

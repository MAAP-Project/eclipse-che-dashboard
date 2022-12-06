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
 * This class is handling the data for custom confirm dialog
 *
 * @author Oleksii Orel
 */
export class ConfirmDialogService {

  static $inject = ['$mdDialog'];

  private $mdDialog: ng.material.IDialogService;

    /**
     * Default constructor that is using resource
     */
    constructor ($mdDialog: ng.material.IDialogService) {
      this.$mdDialog = $mdDialog;
    }

  /**
   * Add new section to the workspace details.
   *
   * @param title{string} popup title
   * @param content{string} dialog content
   * @param buttonTitles dialog buttons titles
   * @param resolveButtonType dialog resolve button type
   *
   * @returns {ng.IPromise<any>}
   */
  showConfirmDialog(title: string, content: string, buttonTitles?: { resolve?: string, reject?: string }, resolveButtonType?: string ): ng.IPromise<any> {
    buttonTitles.reject = buttonTitles.reject || 'Close';
    resolveButtonType = resolveButtonType || 'Primary';
    return this.$mdDialog.show({
      bindToController: true,
      clickOutsideToClose: true,
      controller: 'CheConfirmDialogController',
      controllerAs: 'cheConfirmDialogController',
      locals: {
        content: content,
        $mdDialog: this.$mdDialog,
        title: title,
        buttons: buttonTitles,
        resolveButtonType: resolveButtonType
      },
      templateUrl: 'components/service/confirm-dialog/che-confirm-dialog.html'
    });
  }

}

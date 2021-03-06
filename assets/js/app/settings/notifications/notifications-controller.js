/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.login-history' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function() {
    'use strict';

    angular.module('frontend.settings')
        .controller('NotificationsController', [
            '_','$scope', '$rootScope','$log','EmailTransport',
            'Settings','MessageService','$uibModal',
            function controller(_,$scope, $rootScope,$log,EmailTransport,
                                Settings,MessageService,$uibModal) {


                $scope.updateKongaSettings = function() {
                    updateKongaSettings()
                }

                $scope.setDefaultTransport = function(name) {
                    $rootScope.konga_settings.default_transport = name;
                    updateKongaSettings()

                }

                $scope.configureTransport = function(transport) {
                    $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        size : 'sm',
                        templateUrl: 'js/app/settings/notifications/configure-transport-modal.html',
                        controller: function(_,$scope,$rootScope,$log,$uibModalInstance,MessageService,
                                             EmailTransport,_transport){

                            $scope.transport = _transport
                            $log.debug("configureTransport:transport => ",$scope.transport)


                            $scope.close = function() {
                                $uibModalInstance.dismiss()
                            }

                            $scope.submit = function() {
                                EmailTransport.update($scope.transport.id,{
                                    settings : $scope.transport.settings
                                }).then(function(updated){
                                    MessageService.success("Transport updated!")
                                    $scope.close()
                                })
                            }


                            $scope.getModelParent = function(path) {
                                var segs = path.split('.');
                                var root = $scope.transport.settings;

                                while (segs.length > 1) {
                                    var pathStep = segs.shift();
                                    if (typeof root[pathStep] === 'undefined') {
                                        root[pathStep] = {};
                                    }
                                    root = root[pathStep];
                                }
                                return root;
                            };

                            $scope.getModelLeaf = function(path) {
                                var segs = path.split('.');
                                return segs[segs.length-1];
                            };


                            $scope.getItemValue = function(item,path) {
                                return _.get(item, path, "")
                            }

                            $scope.setItemValue = function(item,path,value) {
                                console.log("#############",item)
                                console.log("#############",path)
                                return _.set(item, path, value)
                            }


                        },
                        resolve: {
                            _transport: function () {
                                return transport
                            }
                        }
                    });

                }

                function updateKongaSettings() {
                    Settings.update($rootScope.konga_settings_id,{
                            data : $rootScope.konga_settings
                        })
                        .then(function(settings){
                            $log.debug("Konga Settings updated",settings)
                            MessageService.success("Settings updated!")
                            //$rootScope.konga_settings = settings
                        }, function (error) {
                            $log.debug("Konga Settings failed to update",error)
                            MessageService.error("Failed to update settings!")
                        })
                }

                function _fetchEmailTransports() {
                    EmailTransport.load()
                        .then(function(transports){
                            $scope.transports = transports
                            $log.debug("NotificationsController:transports =>",$scope.transports)
                        })
                }


                _fetchEmailTransports()

            }
        ])
    ;
}());
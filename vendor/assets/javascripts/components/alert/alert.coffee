angular.module('rolodex.alert', [])

.controller('AlertController', ['$scope', '$attrs', ($scope, $attrs) ->
  $scope.closeable = 'close' of $attrs
])

.directive 'alert', ->
  restrict: 'EA'
  controller: 'AlertController'
  templateUrl: 'components/alert.html'
  transclude: true
  replace: true
  scope:
    type: '@'
    close: '&'

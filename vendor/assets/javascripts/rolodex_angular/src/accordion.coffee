angular.module("rolodex.accordion", ["rolodex.collapse"])

.constant("accordionConfig", closeOthers: true)

.controller("AccordionController", [
  "$scope"
  "$attrs"
  "accordionConfig"
  ($scope, $attrs, accordionConfig) ->
    # This array keeps track of the accordion groups
    @groups = []

    # Ensure that all the groups in this accordion are closed, unless close-others explicitly says not to
    @closeOthers = (openGroup) ->
      closeOthers = (if angular.isDefined($attrs.closeOthers) then $scope.$eval($attrs.closeOthers) else accordionConfig.closeOthers)
      if closeOthers
        angular.forEach @groups, (group) ->
          group.isOpen = false  if group isnt openGroup

    # This is called from the accordion-group directive to add itself to the accordion
    @addGroup = (groupScope) ->
      that = this
      @groups.push groupScope
      groupScope.$on "$destroy", (event) ->
        that.removeGroup groupScope

    # This is called from the accordion-group directive when to remove itself
    @removeGroup = (group) ->
      index = @groups.indexOf(group)
      @groups.splice index, 1  if index isnt -1

    return this
])

# The accordion directive simply sets up the directive controller
# and adds an accordion CSS class to itself element.
.directive "accordion", ->
  restrict: "EA"
  controller: "AccordionController"
  transclude: true
  replace: false
  templateUrl: 'rolodex_angular/template/accordion/accordion.html'

# The accordion-group directive indicates a block of html that will expand and collapse in an accordion
.directive "accordionGroup", ->
  require: "^accordion" # We need this directive to be inside an accordion
  restrict: "EA"
  transclude: true # It transcludes the contents of the directive into the template
  replace: true # The element containing the directive will be replaced with the template
  templateUrl: 'rolodex_angular/template/accordion/accordion-group.html'
  scope:
    heading: "@" # Interpolate the heading attribute onto this scope
    isOpen: "=?"
    isDisabled: "=?"

  controller: ->
    @setHeading = (element) ->
      @heading = element

  link: (scope, element, attrs, accordionCtrl) ->
    accordionCtrl.addGroup scope
    scope.$watch "isOpen", (value) ->
      accordionCtrl.closeOthers scope  if value
      return

    scope.toggleOpen = ->
      scope.isOpen = not scope.isOpen  unless scope.isDisabled

# Use accordion-heading below an accordion-group to provide a heading containing HTML
# <accordion-group>
#   <accordion-heading>Heading containing HTML - <img src="..."></accordion-heading>
# </accordion-group>
.directive "accordionHeading", ->
  restrict: "EA"
  transclude: true # Grab the contents to be used as the heading
  template: "" # In effect remove this element!
  replace: true
  require: "^accordionGroup"
  link: (scope, element, attr, accordionGroupCtrl, transclude) ->
    # Pass the heading to the accordion-group controller
    # so that it can be transcluded into the right place in the template
    # [The second parameter to transclude causes the elements to be cloned so that they work in ng-repeat]
    accordionGroupCtrl.setHeading transclude(scope, (->))

# Use in the accordion-group template to indicate where you want the heading to be transcluded
# You must provide the property on the accordion-group controller that will hold the transcluded element
# <div class="accordion-group">
#   <div class="accordion-heading" ><a ... accordion-transclude="heading">...</a></div>
#   ...
# </div>
.directive "accordionTransclude", ->
  require: "^accordionGroup"
  link: (scope, element, attr, controller) ->
    scope.$watch (-> controller[attr.accordionTransclude]), (heading) ->
      if heading
        element.html ""
        element.append heading

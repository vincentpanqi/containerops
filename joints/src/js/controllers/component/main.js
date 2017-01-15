devops.controller('ComponentController', ['$scope','$location','componentService', 'notifyService', 'loading', 'more',
  'apiService', 'utilService',
  function($scope,$location,componentService,notifyService,loading,more,apiService,utilService) {   

    $scope.filter = {
        "name" : "",
        "version" : ""
    }

    $scope.pageNum = 10;
    $scope.versionNum = 3;
    $scope.components = [];

    function getOffset(type,name){
      if(type == "component"){
        return $scope.components.length;
      }else{
        return _.find($scope.components,function(component){
          return component.name == name;
        }).versions.length;
      }
    }

    function showMoreComponent(){
      var promise = componentService.getComponents($scope.filter.name, $scope.filter.version, true, $scope.pageNum, $scope.versionNum, getOffset("component"));
      promise.done(function(data){
          loading.hide();
          appendComponents(data.components);
      });
      promise.fail(function(xhr,status,error){
          apiService.failToCall(xhr.responseJSON);
      }); 
    }

    function appendComponents(data){
      var components = utilService.componentDataTransfer(data);
      $scope.components = $scope.components.concat(components);
      $scope.$apply();
    }

    $scope.showMoreVersion = function(componentName){
      var promise = componentService.getComponents(componentName, "", false, $scope.pageNum, $scope.versionNum, getOffset("version",componentName));
      promise.done(function(data){
          loading.hide();
          appendVersions(data.components,componentName);
      });
      promise.fail(function(xhr,status,error){
          apiService.failToCall(xhr.responseJSON);
      }); 
    }

    function appendVersions(data,componentName){
      var target = _.find($scope.components,function(component){
        return component.name == componentName;
      });
      _.each(data,function(item){
        var version = {
          "id" : item.id,
          "version" : item.version
        }
        target.versions.push(version);
      })
      $scope.$apply();
    }

    $scope.showNewComponent = function(){
      $location.path("/component/create");
    }

    $scope.getComponents = function(){
      var promise = componentService.getComponents($scope.filter.name, $scope.filter.version, true, $scope.pageNum, $scope.versionNum, getOffset("component"));
      promise.done(function(data){
          loading.hide();
          $scope.components = utilService.componentDataTransfer(data.components);
          more.show(function(){
            showMoreComponent();
          });
      });
      promise.fail(function(xhr,status,error){
          apiService.failToCall(xhr.responseJSON);
      }); 
    }

    $scope.getComponents();
}]);
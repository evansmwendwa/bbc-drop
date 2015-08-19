appControllers.controller('CategoriesCtrl', ['$scope', '$http','AuthService','$state',
    function ($scope, $http) {

        $scope.controllerName = 'categories';

        $http.get('http://drop.ongair.im/api/categories.json')
        .then(function(response){
            $scope.categories =  response.data.data;
        }, function(data) {
            // log error
            console.log('An error has occured');
            console.log(data);
        });

        //sign out clears the OAuth cache, the user will have to reauthenticate when returning
        $scope.signOut = function() {
            AuthService.clearCache();
            $scope.connectedUser = false
            console.log('loged out');
            $state.transitionTo('login');
            // todo:
            // end the backend session
            // somewhere redirect the user to login
        }

        $scope.toggleActivation = function(category) {
            if(category.selected == true){
                category.selected = false;
            }
            else {
                category.selected = true;
            }
        }

        $scope.updatePreferences = function(categories){
            var myCategories = {
                'categories': []
            };

            // extract user selected categories
            angular.forEach(categories, function(category,key){
                if(category.selected == true){
                    this.push(category.id);
                }
            }, myCategories.categories);

            // update user selected categories
            $http.post('http://drop.ongair.im/api/auth/personalize',myCategories)
            .then(function(response){
                // save was successful
                $state.transitionTo('articles');
                console.log(response);
            }, function(error){
                // show error
                console.log(error);
            });
        }

    }
]);

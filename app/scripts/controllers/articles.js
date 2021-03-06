appControllers.controller('ArticlesCtrl', ['$scope', '$http','$stateParams','$timeout','Articles',
    function ($scope, $http, $stateParams, $timeout, Articles) {

        $scope.controllerName = 'article';
        $scope.articles = Articles.get();

        $scope.destroyArticle = function($article) {
            Articles.destroy($article);
        }

        $scope.share = function(provider){
            var url = Articles.getCurrentUrl(provider);
            window.open(url, '_blank');
        }

        // manage the article swipe actions
        $scope.pointer = {
            'dragging': false,
            'position': 0
        };

        $scope.dragStart = function($event, $article){
            var i = $scope.articles.indexOf($article);
            $scope.pointer.position = i;
            $scope.pointer.dragging = true;
            $scope.articles[i].pointer.start = $scope.articles[i].pointer.x;
        }

        $scope.dragging = function($event){
            var i = $scope.pointer.position;
            if($scope.pointer.dragging){

                $scope.articles[i].pointer.x = $scope.articles[i].pointer.start + $event.deltaX;
                $scope.articles[i].pointer.p = Math.abs($scope.articles[i].pointer.x);

                if($event.deltaX < 0) {
                    $scope.articles[i].pointer.za = 0;
                    $scope.articles[i].pointer.zb = 1;
                } else {
                    $scope.articles[i].pointer.za = 1;
                    $scope.articles[i].pointer.zb = 0;
                }
            }
        }

        $scope.dragEnd = function($event){
            var i = $scope.pointer.position;
            var $article =  $scope.articles[i];

            if(Math.abs($event.deltaX) > 130){
                if($event.deltaX > $article.pointer.start){
                    $scope.likeArticle($article);
                } else {
                    $scope.skipArticle($article);
                }
            } else {
                $article.pointer.x = 0;
                $article.pointer.left = 0;
                $article.pointer.right = 0;
            }

            $article.pointer.start = $article.pointer.x;
            $scope.pointer.dragging = false;
            $scope.pointer.position = 0;
        }

        $scope.likeArticle = function($article) {
            Articles.like($article);

            $article.pointer.x = 0;
            $article.pointer.left = 100;
            $article.pointer.right = 0;

            $timeout(function(){
                $scope.destroyArticle();
            },80);
        }

        $scope.skipArticle = function($article) {
            Articles.skip($article);

            $article.pointer.x = 0;
            $article.pointer.left = 0;
            $article.pointer.right = 100;

            $timeout(function(){
                $scope.destroyArticle();
            },80);
        }

        // Share Drawer Touch Events
        // drawer settings
        $scope.drawer = {
            'offset': -70,
            'top': 100,
            'translateY': 0,
            'open': false,
            'dragging': false,
            'startY': 0
        };

        $scope.drawerStartDragging = function($event) {
            $scope.drawer.startY = $scope.drawer.translateY;
            $scope.drawer.dragging = true;
        }

        $scope.drawerDragging = function($event) {
            if($scope.drawer.dragging) {
                $event.preventDefault();
                $scope.drawer.translateY = $scope.drawer.startY + Math.floor($event.deltaY);
            }
        }

        $scope.drawerEndDragging = function($event) {
            if($scope.drawer.translateY > $scope.drawer.startY) {
                $scope.closeDrawer();
            } else {
                $scope.openDrawer();
            }

            $scope.drawer.startY = $scope.drawer.translateY;
            $scope.drawer.dragging = false;
        }

        $scope.closeDrawer = function() {
            $scope.drawer.top = 100;
            $scope.drawer.offset = -70;
            $scope.drawer.open = false;
            $scope.drawer.translateY = 0;
        }

        $scope.openDrawer = function() {
            $scope.drawer.top = 0;
            $scope.drawer.offset = 0;
            $scope.drawer.open = true;
            $scope.drawer.translateY = 0;
        }

        $scope.toggleDrawer = function() {
            if($scope.drawer.open){
                $scope.closeDrawer();
            } else {
                $scope.openDrawer();
            }
        }
    }
]);

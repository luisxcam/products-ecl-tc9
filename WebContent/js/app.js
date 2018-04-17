'use strict';

(function () {
    //Angular Modules Angular Modules Angular Modules Angular Modules Angular Modules Angular Modules Angular Modules Angular Modules Angular Modules 
    angular.module('mainApp', ['appControllers', 'ngRoute'])
        .controller('mainCtrl', function () { })
        .service('ApiRequestsService', ApiRequestsService)
        .config(function ($routeProvider, $locationProvider) {
            $locationProvider.hashPrefix('');

            $routeProvider.when('/addproducts/', {
                controller: 'addProductCtrl',
                templateUrl: 'modals/addproducts.html',
                css: 'css/style.css'
            });
            $routeProvider.when('/searchproducts/', {
                controller: 'searchProductCtrl',
                templateUrl: 'modals/searchproducts.html',
                css: 'css/style.css'
            });
            $routeProvider.otherwise({
                controller: 'pieCtrl',
                templateUrl: 'modals/piechart.html',
                css: 'css/style.css'
            });
        });

    //Controller Declaration Controller Declaration Controller Declaration Controller Declaration Controller Declaration Controller Declaration 
    angular.module('appControllers', [])
        .controller('pieCtrl', PieCtrl)
        .controller('addProductCtrl', AddProductCtrl)
        .controller('searchProductCtrl', SearchProductCtrl);

    //Controllers Controllers Controllers Controllers Controllers Controllers Controllers Controllers Controllers Controllers Controllers Controllers 
    function PieCtrl(ApiRequestsService, $scope) {
        $scope.pieChartRequest = $scope.pieChartRequest || ApiRequestsService.dummyPieRequest('GET', 'availableProducts').then(function (data) {
            console.log(data);
            $scope.pieChartData = data;
        });
    }

    function AddProductCtrl(ApiRequestsService, $scope) {
        $scope.product = {};
        $scope.product.form = {
            productDescriptionEnglish: '',
            productDescriptionFrench: '',
            brandNameEnglish: '',
            brandNameFrench: '',
            productType: '',
            additionalProductIdentification: '',
            targetMarket: '',
            productImageUrl: '',
            status:''
        };

        $scope.product.blankForm = angular.copy($scope.product.form);

        $scope.product.submit = function () {
            $scope.productPost = $scope.productPost || ApiRequestsService.request('POST', 'product/create',$scope.product.form).then(function (data) {
                console.log(data);
            });
        };

        $scope.product.reset = function () {
            $scope.product.form = angular.copy($scope.product.blankForm);
            $scope.userForm.$setPristine();
        };
    }

    function SearchProductCtrl(ApiRequestsService, $scope) {
        $scope.helloWorld = 'hello search';
        console.log('search for product');
    }

    //API Request Service API Request Service API Request Service API Request Service API Request Service API Request Service API Request Service 
    function ApiRequestsService($http, $timeout) {
        var that = this;

        that.request = function (method, route, data) {
            var req = {
                method: method,
                url: 'http://localhost:8080/products-ut-wo-db/rest/' + route,
                data: data || {}
            }
            console.log('$HTTP => Making %s request to %s', method, route);
            console.log(data || 'no data on request');

            try {
                return $http(req).then(function (response) {
                    return response.data
                });
            } catch (e) {
                console.error('error on request');
                console.error(e);
            }
        }

        that.dummyPieRequest = function (method, route, data) {
            console.log('DUMMY => Making %s request to %s', method, route);
            console.log(data || 'no data on request');
            return $timeout(function () { return { availableProducts: 107, unusedProducts: 58 } }, 2000);
        }
    }
})();

// TODO: Need to check how exactly this chart works or come up with another framework
// google.charts.load("current", {
//     packages: ["corechart"]
// });
// google.charts.setOnLoadCallback(drawChart);

// function drawChart(data) {
//     var data = google.visualization.arrayToDataTable([
//         ['Products', 'Amount'],
//         ['Available Products', 11],
//         ['Used Products', 7]
//     ]);
//     var options = {
//         title: 'Stock Details',
//         pieHole: 0,
//     };
//     var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
//     chart.draw(data, options);
// }
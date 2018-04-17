'use strict';

(function () {
    //Angular Modules Angular Modules Angular Modules Angular Modules Angular Modules Angular Modules Angular Modules Angular Modules Angular Modules 
    angular.module('mainApp', ['appControllers', 'ngRoute'])
        .controller('mainCtrl',function(){})
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
        $scope.pieChartRequest = $scope.pieChartRequest || ApiRequestsService.request('GET', 'availableProducts').then(function (data) {
            console.log(data);
            $scope.pieChartData = data; //REMOVE ONCE DONE WITH THE CHART, THIS IS ONLY TO BIND THE DATA TO THE SITE AND DISPLAY IT
            //HERE IS WHERE THE CHART NEEDS TO BE CALLED TO DRAW
        });
    }

    function AddProductCtrl(ApiRequestsService, $scope) {
        $scope.product = {
            productEnglish:'',
            productFrench:'',
            brandNameEnglish:'',
            brandNameFrench:'',
            productType:'',
            submit:function(){
                console.log('hello world');
            }
        };
    }

    function SearchProductCtrl(ApiRequestsService, $scope) {
        $scope.helloWorld = 'hello search';
        console.log('search for product');
    }

    //API Request Service API Request Service API Request Service API Request Service API Request Service API Request Service API Request Service 
    function ApiRequestsService($http) {
        var that = this;

        that.request = function (method, route, data) {
            var req = {
                method: method,
                url: 'http://localhost:8080/products-ut-wo-db/rest/' + route,
                data: data || {}
            }
            console.log('HTTP => Making %s request to %s', method, route);
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
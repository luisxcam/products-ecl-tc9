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
        $scope.pieChartData = null;
        $scope.pieChartRequest = $scope.pieChartRequest || ApiRequestsService.request('GET', 'availableProducts').then(function (data) {
            $scope.pieChartData = data;
            new Chart(document.getElementById("myChart").getContext('2d'), {
                type: 'pie',
                data: {
                    labels: ["Available", "Unused"],
                    datasets: [{
                        label: 'Product Usage',
                        data: [data.availableProducts, data.unusedProducts],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)'
                        ],
                        borderWidth: 1
                    }]
                }//,
                // options:{
                //     responsive:false
                // }
            });
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
            status: ''
        };

        $scope.product.blankForm = angular.copy($scope.product.form);

        $scope.product.submit = function () {
            $scope.productPost = $scope.productPost || ApiRequestsService.request('POST', 'product/create', $scope.product.form).then(function (data) {
                console.log(data);
                $scope.productPost = null;
            });
        };

        $scope.product.reset = function () {
            $scope.product.form = angular.copy($scope.product.blankForm);
            $scope.userForm.$setPristine();
            $scope.productPost = null;
        };
    }

    function SearchProductCtrl(ApiRequestsService, $scope) {
        $scope.search = {};
        $scope.list = [];
        $scope.search.form = {
            productId: '',
            productDescriptionEnglish: ''
        }

        $scope.search.blankForm = angular.copy($scope.search.form);

        $scope.search.submit = function (productId, productDescriptionEnglish) {
            $scope.list = [];
            $scope.searchProduct = null;
            var route = '';
            if (!productId && !productDescriptionEnglish) route = 'products';
            else if (productId && productDescriptionEnglish) route = 'product/' + productId + '/productIdAndProductDescriptionEnglish/' + productDescriptionEnglish.toUpperCase();
            else if (productId) route = 'product/' + productId;
            else route = 'product/productDescriptionEnglish/' + productDescriptionEnglish.toUpperCase();

            $scope.searchProduct = $scope.searchProduct || ApiRequestsService.request('GET', route).then(function (data) {
                if (Array.isArray(data)) {
                    for (var x = 0; x < data.length; x++) {
                        $scope.list.push(data[x]);
                    }
                } else {
                    $scope.list.push(data);
                }
            });
        }

        $scope.search.nullSearch = function () {
            $scope.list = [];
            $scope.searchProduct = null;
            var route = '4real';
            $scope.searchProduct = $scope.searchProduct || ApiRequestsService.dummyNullSearch('GET', route).then(function (data) {
                $scope.list.push(data);
            });
        }

        $scope.search.reset = function () {
            $scope.search.form = angular.copy($scope.search.blankForm);
            $scope.searchForm.$setPristine();
            $scope.searchProduct = null;
            $scope.list = [];
        }
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
            console.log(data || 'no payload sent');

            return $http(req).then(function (response) {
                console.log(response);
                return response.data
            }).catch(function (e) {
                console.error('Could not run $HTTP. Error on the request');
                throw e;
            });
        }

        that.dummyPieRequest = function (method, route, data) {
            console.log('DUMMY => Making %s request to %s', method, route);
            console.log(data || 'no payload sent');
            return $timeout(function () {
                var responseData = {
                    availableProducts: 107,
                    unusedProducts: 58
                }
                console.log(responseData);
                return responseData;
            }, 2000);
        }

        that.dummyPostRequest = function (method, route, data) {
            console.log('DUMMY => Making %s request to %s', method, route);
            console.log(data || 'no payload sent');
            return $timeout(function () {
                var responseData = {
                    productDescriptionEnglish: 'Canned Veggies',
                    productDescriptionFrench: 'Canned French Veggies',
                    brandNameEnglish: 'English Soup',
                    brandNameFrench: 'French Soup',
                    productType: 'case',
                    additionalProductIdentification: 'Some Id',
                    targetMarket: 'canada',
                    productImageUrl: 'https://www.google.ca/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
                    status: 'active'
                }
                console.log(responseData);
                return responseData;
            }, 2000);
        }

        that.dummyNullSearch = function (method, route, data) {
            console.log('DUMMY => Making %s request to %s', method, route);
            console.log(data || 'no payload sent');
            return $timeout(function () {
                var responseData = {};
                console.log('returned a whole lot of nothing');
                return responseData;
            }, 2000);
        }

        that.dummySearch = function (method, route, data) {
            console.log('DUMMY => Making %s request to %s', method, route);
            console.log(data || 'no payload sent');
            return $timeout(function () {
                var responseData = [{
                    id: 1,
                    productDescriptionEnglish: 'english product description',
                    productDescriptionFrench: 'french product description',
                    brandNameEnglish: 'brand name english',
                    brandNameFrench: 'brand name french',
                    productType: 'product type',
                    additionalProductIdentification: 'ehhh dunno',
                    targetMarket: 'da world!',
                    productImageUrl: 'http://google.ca',
                    status: 'a-ok'
                },
                {
                    id: 2,
                    productDescriptionEnglish: 'What is Lorem Ipsum',
                    productDescriptionFrench: 'is simply dummy text',
                    brandNameEnglish: 'of the printing and typesetting ',
                    brandNameFrench: 'industry.',
                    productType: 'Lorem Ipsum has',
                    additionalProductIdentification: 'been the industrys standard',
                    targetMarket: 'dummy',
                    productImageUrl: 'https://www.lipsum.com/',
                    status: 'since the 1500s'
                }]
                console.log(responseData);
                return responseData;
            }, 2000);
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
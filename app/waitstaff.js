angular.module('ngWaitstaffApp', ['ngRoute'])

.constant('DEFAULT_TAX_RATE', 7.35)

.value('earnings', [])

.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl : './home.html',
        controller : 'HomeCtrl'
    }).when('/new-meal', {
        templateUrl : './newmeal.html',
        controller : 'NewMealCtrl'
    }).when('/earnings', {
        templateUrl : './earnings.html',
        controller : 'EarningsCtrl'
    })
    .otherwise({ redirectTo : '/' });
})

.controller('HomeCtrl', function($scope) {
})

.controller('NewMealCtrl', function($scope, earnings, DEFAULT_TAX_RATE) {
    $scope.data = {};
    $scope.subtotal = $scope.tip = $scope.total = null;
    $scope.init = function() {
        $scope.data.bmp = null;
        $scope.data.tipPcnt = null;
        $scope.data.taxRate = DEFAULT_TAX_RATE;
        $scope.submitted = false;
        $scope.error = 'none';
        $('#bmp').focus();
    }

    $scope.submit = function() {
        if($scope.mealForm.$valid) {
            updateCharges($scope.data);
            updateEarnings($scope.data);
            $scope.resetForm();
        } else {
            if ($scope.mealForm.$error.required) {
                $scope.error = 'required';
                console.log('The Form is not completely filled in');
            } 
            if ($scope.mealForm.$error.number) {
                $scope.error = 'number';
                console.log('The Form must contain numbers');
            }
            $scope.submitted = true;
        }
    }

    function updateCharges(data) {
        $scope.subtotal = data['bmp'] + (data['bmp'] * data['taxRate']/100);
        $scope.tip = data['bmp'] * data['tipPcnt']/100;
        $scope.total = $scope.subtotal + $scope.tip;
    };

    function updateEarnings(data) {
        earnings.push({'bmp':data.bmp, 'taxRate':data.taxRate, 'tipPcnt':data.tipPcnt});
    };

    $scope.resetForm = function() {
        $scope.init();
        $scope.mealForm.$setPristine();
    }

    $scope.$on('resetCtrl', function(event, data) {
        $scope.resetForm();
    });
    $scope.init();

})

.controller('EarningsCtrl', function($scope, earnings) {
    $scope.tipTotal = $scope.mealCount = $scope.avgTPM = 0;
    for (meal in earnings) {
        $scope.tipTotal += earnings[meal].bmp * earnings[meal].tipPcnt/100;
        $scope.mealCount += 1;
        $scope.avgTPM = $scope.tipTotal / $scope.mealCount;
    }

    $scope.resetCalc = function() {
        earnings.length = 0;
        $scope.tipTotal = $scope.mealCount = $scope.avgTPM = 0;
    }
});

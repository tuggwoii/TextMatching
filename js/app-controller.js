app.controller('AppController', function ($scope, $http, $timeout) {

    $http.get('/configs').success(function (res) {
        $scope.configs = res;
    });

    $http.get('/courses').success(function (res) {
        $scope.courses = res;
    });

    $http.get('/students').success(function (res) {
        $scope.students = res;
    });

    $scope.saveConfig = function () {
        $http.post('/configs', $scope.configs).success(function (res) {
            $scope.configs = res;
            alert('Saved.');
        });
    };

    $scope.saveCourse = function () {
        $http.post('/courses', $scope.courses).success(function (res) {
            $scope.courses = res;
            alert('Saved.');
        });
    };

    $scope.saveStudent = function () {
        $http.post('/students', $scope.students).success(function (res) {
            $scope.students = res;
            alert('Saved.');
        });
    };

    $scope.addCourse = function () {
        $scope.courses.push({
            name: 'New Course'
        });
    };

    $scope.addStudent= function () {
        $scope.students.push({
            name: 'New Student',
            uid: $scope.students.length
        });
    };

    $scope.removeCourse = function (index) {
        $scope.courses.splice(index, 1);
    };

    $scope.removeStudent = function (index) {
        $scope.students.splice(index, 1);
    };



});
app.controller('AppController', function ($scope, $http, $timeout) {

	$scope.model = {
		results: 10
	}; 
	
	function countKeywords(keys, value) {
		var count = 0;
		for(var i = 0 ; i < keys.length; i++) {
			if(value.indexOf(keys[i]) > -1) {
				count++;
			}
		}
		return count;
	}
	
	function firstKeywords(keys, value) {
		var position = -1;
		for(var i = 0 ; i < keys.length; i++) {
			
			if(position === -1) {
				position = value.indexOf(keys[i]);
			}
			else if (value.indexOf(keys[i]) > 0) {
				if(value.indexOf(keys[i]) != -1 && value.indexOf(keys[i]) < position) {
					position = value.indexOf(keys[i]);
				}
			}
		}
		return position;
	}
	
	function keywordsDistance(keys, value) {
		var positions = [];
		for(var i = 0 ; i < keys.length; i++) {
			if(value.indexOf(keys[i]) != -1) {
				positions.push(value.indexOf(keys[i]));
			}
		}
		var min = 0;
		if(positions.length > 1) {
			for(var i = 0; i < positions.length; i++) {
				for(var j = i + 1; j < positions.length; j++) {
					var absolute = 0;
					if(positions[i] > positions[j]) {
						absolute = positions[i] - positions[j];
					}
					else {
						absolute = positions[j] - positions[i];
					}
				}
			}
			if(min == 0) {
				min = absolute;
			}
			else {
				if(minabsolute> absolute) {
					min = absolute;
				}
			}
		}
		return min;
	}
	
	function addPriorityToData (data) {
		for(var i = 0 ; i < data.length; i++) {
			data[i].keyCount = countKeywords($scope.model.keywords.toLowerCase().split(' '), data[i].name.toLowerCase());
			data[i].firstKey = firstKeywords($scope.model.keywords.toLowerCase().split(' '), data[i].name.toLowerCase());
			data[i].keyDistance = keywordsDistance($scope.model.keywords.toLowerCase().split(' '), data[i].name.toLowerCase());
		}
	}

    $scope.search = function () {
		
		if(!$scope.model.results || $scope.model.results < 1 || isNaN(parseInt($scope.model.results))) {
			$scope.model.results = 10;
		}
		
		if($scope.model.keywords) {
			$scope.model.isLoad = true;
			$http.get('/search?keywords=' + $scope.model.keywords)
			.success(function(data){
				$scope.model.isLoad = false;
				$scope.model.data = data;
				addPriorityToData($scope.model.data);
				$scope.model.data = $scope.radixSort($scope.model.data);
				if($scope.model.data.length > $scope.model.results) {
					$scope.model.data = $scope.model.data.slice(0,$scope.model.results);
				}
				
			}).error(function(){
				alert('Get result error');
			});
		}
	}
	
	$scope.onKeypress = function (e) {
		if(e.keyCode == 13) {
			$scope.search();
		}
	}
	
	function bucketSortKeyCount(A) {
		var Bucket = new Array(10);
		for (i = 0; i < A.length; i++) {
			if(!Bucket[A[i].keyCount]) {
				Bucket[A[i].keyCount] = [];
			}
			Bucket[A[i].keyCount].push(A[i]);
		}
		var i = 0; 
		while (i < A.length) {
			for (var j = Bucket.length ; j >=0 ; j--) {
				if(Bucket[j] && Bucket[j].length) {
					Bucket[j] = bucketSortFirstKey(Bucket[j]);
					for (var k = 0 ; k < Bucket[j].length; k++) {
						A[i] = Bucket[j][k];
						i++;
					}
				}
			}
		}
		return A;
    }
	
	function bucketSortFirstKey(A) {
		var Bucket = new Array(50);
		for (i = 0; i < A.length; i++) {
			if(!Bucket[A[i].firstKey]) {
				Bucket[A[i].firstKey] = [];
			}
			Bucket[A[i].firstKey].push(A[i]);
		}
		var i = 0; 
		while (i < A.length) {
			for (var j = 0 ; j < Bucket.length; j++) {
				if(Bucket[j] && Bucket[j].length) {
					Bucket[j] = bucketSortKeyDistant(Bucket[j]);
					for (var k = 0 ; k < Bucket[j].length; k++) {
						A[i] = Bucket[j][k];
						i++;
					}
				}
			}
		}
		return A;
    }
	
	function bucketSortKeyDistant(A) {
		var Bucket = new Array(50);
		for (i = 0; i < A.length; i++) {
			if(!Bucket[A[i].keyDistance]) {
				Bucket[A[i].keyDistance] = [];
			}
			Bucket[A[i].keyDistance].push(A[i]);
		}
		var i = 0; 
		while (i < A.length) {
			for (var j = 0 ; j < Bucket.length; j++) {
				if(Bucket[j] && Bucket[j].length) {
					for (var k = 0 ; k < Bucket[j].length; k++) {
						A[i] = Bucket[j][k];
						i++;
					}
				}
			}
		}
		return A;
    }
	
	$scope.radixSort = function (A) {
		A = bucketSortKeyCount(A);
		return A;
	}

});
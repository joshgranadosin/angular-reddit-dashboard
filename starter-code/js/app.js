/* put js code here */
var redditDashApp = angular.module('redditDashApp', []);

redditDashApp.controller("redditDashCtrl", ['$scope', '$http', function($scope, $http){
	$scope.searchTerm = '';
	$scope.searchHistory = [];
	$scope.articles = [];
	$scope.articlesWithPics = [];

	if(window.localStorage.redditDashAppHistory){
		$scope.searchHistory = JSON.parse(window.localStorage.redditDashAppHistory);
	};

	populateArticlesWithPics = function(){
		$scope.articlesWithPics = [];
		for(let i = 0; i < $scope.articles.length && $scope.articlesWithPics.length < 4; i++){
			if(validateThumbnail($scope.articles[i].data.thumbnail)){
				$scope.articlesWithPics.push($scope.articles[i]);
			}
		}
	};

	validateThumbnail = function(s){
		if (s === 'self' || s === 'default' || s === 'nsfw' || s === ''){
			return false;
		}
		else{
			return s;
		}
	}

	save = function(){
		window.localStorage.setItem('redditDashAppHistory', JSON.stringify($scope.searchHistory))
	};

	$scope.switch = function(s){
		$scope.searchTerm = s;
		$scope.search();
	};

	$scope.delete = function(s){
		console.log('deleting ' + s);
		$scope.searchHistory.splice($scope.searchHistory.indexOf(s),1);
		console.log($scope.searchHistory);
		save();
		populateArticlesWithPics();
	};

	$scope.search = function(){
		console.log('Running search for ' + $scope.searchTerm)

		if($scope.searchHistory.indexOf($scope.searchTerm) === -1){
			$scope.searchHistory.unshift($scope.searchTerm);
		}

		var req = {
			url: 'http://www.reddit.com/search.json?q=' + $scope.searchTerm,
			method: 'GET'
		};

		$http(req).then(
			function success(res){
				$scope.articles = res.data.data.children
				console.log($scope.articles);
				save();
				populateArticlesWithPics();
			},
			function error(res){
				console.log(res);
			}
		);
	};


}]);

console.log('this file is running.');
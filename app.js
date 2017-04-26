var app = angular.module('myApp', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', 
	function($stateProvider, $urlRouterProvider) {
		
		$urlRouterProvider.otherwise('/parent');

		$stateProvider
			.state('parent', {
				url: '/parent',
				templateUrl: 'views/parent.html',
				controller: function(resParent, $scope){
					console.log('controller console');
					//$scope.name = resParent.name;
					$scope.data = resParent;
					console.log($scope.data);
				},
				resolve: {
					resParent: ['$http', function($http){
						console.log('resolve console');
						//return {'name' : 'reolved name in parent'};
						return $http.get('http://rest.learncode.academy/api/johnbob/friends/').then(function(res){
							return res.data;
						});
					}]
				}
			})
			.state('parent.child', {
				url: '/child',
				templateUrl: 'views/parent.child.html',
				controller: function($scope, resChild){
					$scope.name = resChild.name;
				},
				resolve: {
					resChild: function(resParent){
						console.log(resParent.name + " child name");
						return {'name' : 'child name and' + resParent.name};
					}
				}
			})


			.state('home', {
				url: '/home',
				template: '<h1>Home view</h1><p id="myHome">Go to myHome</p><div ui-view></div>',
				data: {
					name: 'Texas',
					location: 'north'
				},
				params: {
					age: null
				},
				resolve: {
					homeResFunc: function(){
						alert('resolve in home');
					}
				},
				controller: function($state, $stateParams){
					alert('controller');
					console.log($stateParams);
					console.log($state.current.data);
				},
				onEnter: function($state){
					alert($state.current);
					$(document).on('click', 'p#myHome', function(){
						alert('my Home clicked');
						//$state.go('home.myHome', {'name': 'value from home', 'age': 44});
						$state.go('.myHome');
					});
				},
				onExit: function(){
					alert('on exit from home');
				}	
				
			})
			.state('home.myHome', {
				url: '/myHome',
				//templateUrl: 'views/home.myHome.html',
				params: {
					name: null,
					age: null
				},
				data: {
					name: 'child Texas'
				},
				template: '<h3>My home</h3>',
				controller: function($state, $stateParams){
					console.log($stateParams.name, $stateParams.age);
					console.log($state.current.data);
				}
			})

			.state('about', {
				url: '/about',
				params: {
					parentData: null
				},
				resolve: {
					aboutFunc: function(){
						return {'name': 'aboutFunc'};
					}
				},
				views: {
					'': {
						templateUrl: 'views/about.html',
						controller: function($stateParams, $scope){
							console.log($stateParams.parentData);
							$scope.fromParent = $stateParams.parentData;
						}
					},
					'aboutMe@about': {
						templateUrl: 'views/about.aboutMe.html',
						controller: function(aboutFunc){
							console.log(aboutFunc);
							//console.log(friendFunc);//this throws an error because frienFunc is
							//the sibling's resolve where it is not accessible here, but it can access
							//it's own resolve 'aboutMeFunc' and the 'aboutFunc' resolve.
						},
						resolve: {
							aboutMeFunc: function(){
								return {'name': 'aboutMeFunc'};
							}
						}
					},
					'aboutFriend@about': {
						templateUrl: 'views/about.aboutFriend.html',
						resolve: {
							friendFunc: function(){
								return {'name': 'friendFunc'};
							}
						}
					}
				}
			});
			
		
}]);

/*app.run(function($rootScope){

	$rootScope.$on('$stateChangeStart', function(event, toState){
		console.log(toState.data.name, toState.data.location);
	});
});*/

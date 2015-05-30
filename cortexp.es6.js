Posts = new Mongo.Collection('posts');

if (Meteor.isClient) {
  angular
    .module('cortexp', ['angular-meteor'])
    .controller('CortexpCtrl', ['$scope', '$log', '$meteor', ($scope, $log, $meteor) => {
      $log.debug('cortexp controller');
      $scope.post = {};
      $scope.posts = $meteor
                       .collection(Posts)
                       .subscribe('posts');
      $scope.publish = (post) => {
        $log.debug('publish');
        post.createAt = post.updatedAt = Date.now();
        $scope.posts.save(angular.copy(post));
      };
    }])
    .filter('prettyDate', () => {
      return (input) => {
          return moment(input).format('DD/MM/YYYY');
      };
    })
    .run(($log) => $log.debug('Cortexp client is running'))
}

if (Meteor.isServer) {
  Meteor.startup(() => console.log('Cortexp server is running'));
  Meteor.publish('posts', () => Posts.find({}, { sort: { createdAt: -1 } }));
}

app.service('d3Service', ['$http', function ($http, data){
    var d3Service = {
        data: [{}]
      };

      d3Service.getAll = function () {
        // return $http.get('/data').success(function (data) {
        //   console.log('yo from the factory', data[0].links)
        //   angular.copy(data, d3Service.data);
        // });
        return $http.get('/data')
      };

return d3Service;
}])
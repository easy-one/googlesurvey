
    app.service('surveys', ['$http', function ($http) {
        var that = this,
            api = 'api/surveys.php';
        
        
        this.load = function () {
            return $http.get(api).success(function (response) {
                that.surveys = response;
            });
        };


        this.add = function  (id, survey) {
            this.surveys[id] = survey;
        };


        this.delete = function  (id) {
            return $http.delete(api + '?surveyId=' + id).success(function () {
                delete that.surveys[id];
            });
        };


        this.findByGoogleId = function (googleId) {
            for (var i in this.surveys) {
                if (this.surveys[i].survey_google_id === googleId) {
                    return i;
                }
            }
            return -1;
        };


        this.notEmpty = function () {
            for (var i in this.surveys) {
                return true;
            }
        }

    }]);
function StreamService($http,AppSettings) {
    'ngInject';

    const service = {};

    service.GetPosts = GetPosts;
    service.Like = Like;
    service.GetComments = GetComments;
    service.Comment = Comment;
    service.DeleteComment = DeleteComment;
    service.GetWatchedPosts = GetWatchedPosts;
    service.NewPost = NewPost ;
    service.Watch = Watch;
    service.UnWatch = UnWatch;
    service.Feature = Feature ;
    service.Report = Report;
    service.Delete = Delete;

    return service;

    function GetPosts(type , last){
        return $http.get(AppSettings.apiUrl + 'stream/world/' + type + '?last=' + last);
    }

    function GetWatchedPosts(last){
        return $http.get(AppSettings.apiUrl + 'stream/watched/last=' + last );
    }

    function GetComments(postid,last){
        return $http.get(AppSettings.apiUrl + 'livestream/'+postid+'/comments?last=' + last);
    }

    function Like(postid,ownerid){
        return $http.post(AppSettings.apiUrl + 'livestream/'+postid+'/props?owner='+ownerid);
    }

    function Comment(postId,comment){
        return $http({
            method: 'POST',
            url: AppSettings.apiUrl + 'livestream/'+postId+'/comments',
            data: comment,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

    function DeleteComment(commentId){
        return $http.post(AppSettings.apiUrl + 'livestream/'+commentId+'/delete');
    }

    function NewPost(post){
        return $http({
            method: 'POST',
            url: AppSettings.apiUrl + 'livestream?local='+post.local+'&imageId='+post.imageId,
            data: post.body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

    function Watch(postid){
        return $http.get(AppSettings.apiUrl + 'livestream/'+postid+'/watch');
    }

    function UnWatch(postid){
        return $http.get(AppSettings.apiUrl + 'livestream/'+postid+'/unwatch');
    }

    function Feature(postid){
        return $http.post(AppSettings.apiUrl + 'livestream/'+postid+'/feature');
    }

    function Report(postid){
        return $http.post(AppSettings.apiUrl + 'livestream/'+postid+'/report');
    }

    function Delete(postid){
        return $http.post(AppSettings.apiUrl + 'livestream/'+postid+'/delete');
    }

}

export default {
    name: 'StreamService',
    fn: StreamService
};

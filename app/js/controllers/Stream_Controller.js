/** @namespace self.PostType */

function StreamController ($state,$scope,$rootScope,StreamService,ImageService) {
    'ngInject';

    var self = this ;
    self.GetLastPosts = GetLastPosts;
    self.LoadMorePosts = LoadMorePosts;
    self.GetPostComments = GetPostComments;
    self.CommentOnPost = CommentOnPost;
    self.DeleteMyComment = DeleteMyComment;
    self.LikePost = LikePost;
    self.WatchPost = WatchPost;
    self.UnWatchPost = UnWatchPost;
    self.FeaturePost = FeaturePost ;
    self.ReportPost = ReportPost ;
    self.DeletePost = DeletePost ;
    self.NewPost = NewPost ;
    $rootScope.GetLastPosts = GetLastPosts ;
    $rootScope.GetLastWatchedPosts = GetLastWatchedPosts ;


    // init on startup
    if ($rootScope.PostType != 'Watched'){
        GetLastPosts();
    }else {
        GetLastWatchedPosts();
    }

    $scope.$on('ngRepeatFinished', function () {
        $('.ui.dropdown').dropdown();
        $('.item.delete_post').click(function(){
            $('.ui.basic.delete_post.modal').modal({dimmerSettings:{opacity:0.5}}).modal('show') ;
        });
        $('.item.feature_post').click(function(){
            $('.ui.basic.feature_post.modal').modal({dimmerSettings:{opacity:0.5}}).modal('show') ;
        });
        $('.item.report_post').click(function(){
            $('.ui.basic.report_post.modal').modal({dimmerSettings:{opacity:0.5}}).modal('show') ;
        });
    });



    function GetLastPosts() {
        self.IsDataLoading = true;

        $rootScope.PostType = typeof $rootScope.PostType !== 'undefined' ? $rootScope.PostType : 'Recent';

        StreamService.GetPosts($rootScope.PostType , -1)
            .then(
                resolve => {
                    self.IsDataLoading = false;
                    self.posts = resolve.data;
                },
                reject => {
                    self.IsDataLoading = false;
                    if(reject.status == 403){
                        $rootScope.IsAuthorized = false ;
                        $state.go('Login');
                    }
                }
            );
    }//GetLastPosts

    function LoadMorePosts() {
        self.IsLoadingMore = true;

        var LastPostId = self.posts[self.posts.length-1].id ;

        StreamService.GetPosts($rootScope.PostType , LastPostId)
            .then(
                resolve => {
                    self.IsLoadingMore = false;
                    self.posts = self.posts.concat(resolve.data);
                },
                reject => {
                    self.IsLoadingMore = false;
                    if(reject.status == 403){
                        $rootScope.IsAuthorized = false ;
                        $state.go('Login');
                    }
                }
            );
    }//LoadMoreConversation

    function GetLastWatchedPosts() {
        self.IsDataLoading = true;
        //set unreaded watched post counter to zero
        $rootScope.notifications.p = 0 ;

        var last = typeof last !== 'undefined' ? last : -1;
        $rootScope.PostType= 'Watched' ;

        StreamService.GetWatchedPosts(last)
            .then(
                resolve => {
                    self.IsDataLoading = false;
                    self.posts = resolve.data;
                },
                reject => {
                    self.IsDataLoading = false;
                    if(reject.status == 403){
                        $rootScope.IsAuthorized = false ;
                        $state.go('Login');
                    }
                }
            );
    }//GetLastWatchedPosts




    function GetPostComments(post,last) {
        post.IsCommentsLoading = true;
        var last = typeof last !== 'undefined' ? last : -1;

        StreamService.GetComments(post.id,last)
            .then(
                resolve => {
                    post.IsCommentsLoading = false;
                    post.comments = resolve.data;
                },
                reject => {
                    post.IsCommentsLoading = false;
                    if(reject.status == 403){
                        $rootScope.IsAuthorized = false ;
                        $state.go('Login');
                    }
                }
            );
    }//GetPostComments


    function LikePost(post){
        if (post.gp == false){
            post.isLiking = true;
            StreamService.Like(post.id, post.pid)
                .then(
                    /* eslint-disable */
                    resolve => {
                        post.isLiking = false;
                        post.gp=true;
                        post.pc = post.pc + 1;
                    },
                    reject => {
                        post.isLiking = false;
                    }
                );
        }
    }//LikePost

    function CommentOnPost(post){
        post.IsCommenting = true;
        StreamService.Comment(post.id,post.mycomment)
            .then(
                resolve => {
                    post.IsCommenting = false;
                    post.cc += 1 ;
                    GetPostComments(post);
                    post.mycomment = '';
                },
                reject => {
                    post.IsCommenting = false;
                    if(reject.status == 403){
                        $rootScope.IsAuthorized = false ;
                        $state.go('Login');
                    }
                }
            );
    }//CommentOnPost

    function DeleteMyComment(comment){
        comment.IsOptionLoading = true;
        StreamService.DeleteComment(comment.id)
            .then(
                resolve => {
                    comment.IsOptionLoading = false;
                    comment.deleted = true ;
                }
            );
    }//CommentOnPost


    function NewPost(){
        // handle if user wanna post photo or just plain text post
        if ($scope.file){
            ImagePost()
        }else{
            PlainPost()
        }
    }//NewPost


    function ImagePost() {
        var file = $scope.file;
        self.IsUploading = true;
        self.IsPosting = true ;
        var post = {} ;

        ImageService.UploadPhoto(file)
            .then(
                resolve => {
                    self.IsUploading = false;
                    post.imageId = resolve.data;
                    post.local = typeof post.local !== 'undefined' ? post.local : false;

                    post.body = self.New_post_body ;
                    StreamService.NewPost(post)
                        .then(
                            resolve => {
                                self.IsPosting = false;
                                self.New_post_body = '' ;
                                $scope.file = '' ;
                                $rootScope.PostType = 'Recent';
                                GetLastPosts();
                                $('.ui.accordion').accordion('close',0);
                            },
                            reject => {
                                self.IsPosting = false;
                                /* eslint-disable */
                                self.New_post_body = '' ;
                                $scope.file = '' ;
                                $rootScope.PostType = 'Recent';
                                GetLastPosts();
                                $('.ui.accordion').accordion('close',0);
                                if(reject.status == 403){
                                    $rootScope.IsAuthorized = false ;
                                    $state.go('Login');
                                }
                            }
                        );
                },
                reject => {
                    self.IsUploading = false;
                    if(reject.status == 403){
                        $rootScope.IsAuthorized = false ;
                        $state.go('Login');
                    }
                }
            );
    }//ImagePost

    function PlainPost(){
        self.IsPosting = true ;
        var post = {};
        post.imageId = '';
        post.local = typeof post.local !== 'undefined' ? post.local : false;
        post.body = self.New_post_body ;
        StreamService.NewPost(post)
            .then(
                resolve => {
                    self.IsPosting = false;
                    self.New_post_body = '' ;
                    $rootScope.PostType = 'Recent';
                    GetLastPosts();
                    $('.ui.accordion').accordion('close',0);
                },
                reject => {
                    self.IsPosting = false;
                    self.New_post_body = '' ;
                    $rootScope.PostType = 'Recent';
                    GetLastPosts();
                    $('.ui.accordion').accordion('close',0);
                    if(reject.status == 403){
                        $rootScope.IsAuthorized = false ;
                        $state.go('Login');
                    }
                }
            );
    }//PlainPost

    function WatchPost(post){
        post.IsOptionLoading = true ;
        StreamService.Watch(post.id)
            .then(
                resolve => {
                    post.IsOptionLoading = false;
                    post.w = true;
                }
            );
    } //WatchPost

    function UnWatchPost(post){
        post.IsOptionLoading = true ;
        StreamService.UnWatch(post.id)
            .then(
                resolve => {
                    post.IsOptionLoading = false;
                    post.w = false;
                }
            );
    } //UnWatchPost

    function FeaturePost(post){
        post.IsOptionLoading = true ;
        $('.ui.basic.feature_post.modal').modal('hide');
        StreamService.Feature(post.id)
            .then(
                resolve => {
                    post.IsOptionLoading = false;
                    post.featured = true;
                }
            );
    } //FeaturePost

    function ReportPost(post){
        post.IsOptionLoading = true ;
        $('.ui.basic.report_post.modal').modal('hide');
        StreamService.Report(post.id)
            .then(
                resolve => {
                    post.IsOptionLoading = false;
                    post.ishidden = true ;
                }
            );
    } //ReportPost

    function DeletePost(post){
        post.IsOptionLoading = true ;
        $('.ui.basic.delete_post.modal').modal('hide');
        StreamService.Delete(post.id)
            .then(
                resolve => {
                    post.ishidden = true ;
                }
            );
    }//DeletePost




}//StreamController function


export default {
    name: 'StreamController',
    fn: StreamController
};

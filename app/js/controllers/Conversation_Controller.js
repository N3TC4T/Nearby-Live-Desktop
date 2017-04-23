function ConversationController ($state,$stateParams ,$scope,$rootScope , ConversationService , PeopleService , ImageService, NotificationService) {
    'ngInject';

    //check for new events should set here
    var self = this ;


    self.GetConversationsList = GetConversationsList ;
    //self.GetConversationDetail = GetConversationDetail ;
    $rootScope.GetConversationDetail = GetConversationDetail ;
    self.ReplyPlainConversation = ReplyPlainConversation ;
    self.ReplyImageConversation = ReplyImageConversation ;
    self.DeleteConversation = DeleteConversation ;
    self.LoadMoreConversation = LoadMoreConversation ;

    self.DisableNotification = DisableNotification ;
    self.EnableNotification= EnableNotification;


    //handle new message broadcast
    $rootScope.$on('NewMessage', function(event, data) {
        // check if current conversation belongs to message or not
        // if yes add new message to messages list
        if($rootScope.conversations.active == data.convo){
            self.conversation.messages.unshift({
                date:new Date() ,
                dir: 0 ,
                body:data.body
            });
        }else {
            // if conversation is not active then update list
            GetConversationsList();
        }
    });

    //we need to scroll down when conversation rendered
    $scope.$on('ngRepeatFinished', function () {
        var element = document.getElementById('chat');
        element.scrollTop = element.scrollHeight - element.clientHeight;
    });

    //check if we have any pid in params , if yes set params to conversation
    //for speeding up i get params from url not load them again from web api
    if($stateParams.pid){
        var new_conversation = {} ;
        new_conversation.id = $stateParams.pid ;
        new_conversation.img = $stateParams.img ;
        new_conversation.name = $stateParams.name ;
        new_conversation.is_new = true ;
        GetConversationDetail(new_conversation)
    }

    //get latest conversations list on startup
    GetConversationsList();



    function GetConversationsList() {
        //set unread messages to zero
        $rootScope.notifications.mc = 0 ;

        self.liststart = typeof self.start !== 'undefined' ? self.start : 0;
        //self.listcount = typeof self.count !== 'undefined' ? self.count : 10;

        ConversationService.GetConversations({'start': self.liststart})
            .then(
                resolve => {
                    if(typeof $rootScope.conversations != 'undefined' && $rootScope.conversations.active != 'undefined'){
                        // that's mean list was loaded before and maybe we have active conversation
                        // so wee need active again after updating list
                        var active_conversation_id = $rootScope.conversations.active
                    }
                    $rootScope.conversations = resolve.data;
                    // active again
                    if (active_conversation_id){
                     $rootScope.conversations.active = active_conversation_id;
                    }
                }
            );
    }//GetConversationsList

    function GetConversationDetail(conversation) {
        self.IsConversationLoad = true;
        self.conversation = conversation ;

        if(!conversation.is_new){
            $rootScope.conversations.active = conversation.id;
        }

        //check if any notification setting for this user
        if(typeof $rootScope.User.settings[conversation.id] != 'undefined'){
            self.conversation.notification = $rootScope.User.settings[conversation.id].notification ;
        }else {
            // if not set global notifications setting
            self.conversation.notification = $rootScope.User.settings.global_settings.notification ;
        }

        // for new notifications we need to init messages variable
        self.conversation.messages = typeof self.conversation.messages !== 'undefined' ? self.conversation.messages : [];

        // here we get user online status
        PeopleService.OnlineStatus(self.conversation.id)
            .then(
                resolve => {
                    self.conversation.user_status = resolve.data[0];
                }
            );
        // and at least conversation messages
        ConversationService.GetConversation(self.conversation.id , {'latest': true , 'count':10 , 'start':0})
            .then(
                resolve => {
                    self.conversation.messages = resolve.data;
                    self.IsConversationLoad = false;
                }
            );
    }//GetConversationsList

    function LoadMoreConversation() {
        self.IsLoadingMore = true;

        self.conversation.start  = self.conversation.messages[self.conversation.messages.length - 1].msgid ;

        ConversationService.GetConversation(self.conversation.id , {'latest': false , 'count':10 , 'start':self.conversation.start})
            .then(
                resolve => {
                    self.IsLoadingMore = false;
                    self.conversation.messages = self.conversation.messages.concat(resolve.data);
                },
                reject => {
                    self.IsConversationLoad = false;
                }
            );
    }//LoadMoreConversation



    function ReplyPlainConversation(conversation) {
        self.IsMessageSending = true;
        //TODO: reply.body should not clear on fail send message so should i set a retry button ?
        conversation.messages.unshift({
            date:new Date() ,
            dir: 1 ,
            body:self.reply.body,
            status:'Sending'
        });
        ConversationService.SendMessage(conversation.id , self.reply.body)
            .then(
                resolve => {
                    conversation.messages[0].status = 'Sent';
                },
                reject => {
                    conversation.messages[0].status = 'Fail';
                }
            );
        self.reply.body = '';
    }//ReplyPlainConversation


    function ReplyImageConversation(conversation) {
        self.IsUploading = true;
        var file = $scope.file;
        ImageService.UploadPhoto(file)
            .then(
                resolve => {
                    self.IsUploading = false;
                    $('.ui.small.attach_file.modal').modal('hide');
                    $('#image_input').val('') ;
                    $scope.file = '' ;
                    var message_body = '[PHOTO-MSG]'+resolve.data ;
                    conversation.messages.unshift({
                        date:new Date() ,
                        dir: 1 ,
                        body: message_body,
                        status:'Sending'
                    });
                    self.IsMessageSending = true;
                    ConversationService.SendMessage(conversation.id , message_body)
                        .then(
                            resolve => {
                                conversation.messages[0].status = 'Sent';
                            },
                            reject => {
                                conversation.messages[0].status = 'Fail';
                            }
                        );
                }
            );
    }//ReplyImageConversation


    function DeleteConversation(conversation) {
        delete self.conversation ;
        $('.ui.basic.delete_chat.modal').modal('hide');
        ConversationService.DeleteallConversation(conversation.id)
            .then(
                resolve => {
                    GetConversationsList();
                }
            );
    }//DeleteConversation


    function DisableNotification(conversaton){
        NotificationService.DisableNotificationForUser(conversaton.id) ;
        conversaton.notification = false ;
    }

    function EnableNotification(conversaton){
        NotificationService.EnableNotificationForUser(conversaton.id) ;
        conversaton.notification = true ;
    }




}//ConversationController


export default {
    name: 'ConversationController',
    fn: ConversationController
};

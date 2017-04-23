function ConversationService($http,$rootScope,AppSettings) {
    'ngInject';

    const service = {};

    service.GetConversations = GetConversations;
    service.GetConversation = GetConversation;
    service.SendMessage = SendMessage;
    service.DeleteallConversation = DeleteallConversation ;

    return service;

    function GetConversations(params){
        return $http.get(AppSettings.apiUrl + 'conversations' ,{params:params});
    }

    function GetConversation(ConversationId,params){
        return $http.get(AppSettings.apiUrl + 'conversations/' + ConversationId ,{params:params});
    }

    function DeleteallConversation(ConversationId){
        return $http.post(AppSettings.apiUrl + 'conversations/' + ConversationId + '/delete');
    }

    function SendMessage(ConversationId, MessageBody){
        return $http({
            method: 'POST',
            url: AppSettings.apiUrl + 'conversations/' + ConversationId ,
            data: MessageBody,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

}

export default {
    name: 'ConversationService',
    fn: ConversationService
};

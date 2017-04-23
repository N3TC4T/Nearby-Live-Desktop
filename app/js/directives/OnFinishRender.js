function onFinishRender($timeout) {
    'ngInject';
    return {
        restrict: 'A',
        link: function (scope) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    };
}

export default {
    name: 'onFinishRender',
    fn: onFinishRender
};

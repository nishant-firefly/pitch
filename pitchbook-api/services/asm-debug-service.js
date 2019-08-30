(function (context) {
    'use strict';

    var DebugService = {
        ErrorTypes: {
            errorCleared: 'errorCleared',
            errorAdded: 'errorAdded'
        }
    };

    /**
     * The list of error to display in the order they were logged
     * @type {Array}
     * @private
     */
    var _errorList = [];
    
    /**
     * The next id to use for a logged error.  This will be unique per error and incremented each time an error is list
     */
    var _nextId = 1;


    /**
     * A list of registered callbacks that are listening for events
     * @type {Array}
     * @private
     */
    var _errorListeners = [];


    /**
     * Fire an event that will be propogated to all event listeners
     * @param eventType
     * @private
     */
    function _fireEvent(eventType, errorItem) {
        for (var i = 0; i < _errorListeners.length; i++) {
            var errorHandler = _errorListeners[i];
            errorHandler(eventType, errorItem, _errorList);
        }    
    }


    /**
     * Returns true if we are in debug mode
     * @returns {boolean}
     */
    DebugService.isDebug = function isDebug() {
        //TODO: This should only return true when we are in a dev environment for debugging reasons
        return true;
    };


    /**
     * Log and error to the debug service
     * @param message The error message to log
     * @param errorCode A unique code to identify this error
     * @param type {string} A string that identifies the type of error.  This is used to clear errors by type
     * @param data Additional data for the error
     * @param targetEl A target element that the error applies to
     * @return {number} The id of the error
     * @private
     */
    DebugService.logError = function logError(message, errorCode, type, targetEl, data) {
        var errorItem = {
            id: _nextId++,
            errorCode: errorCode,
            type: type,
            message: message,
            data: data
        };
        _errorList.push(errorItem);

        targetEl.classList.add('asm-element-has-error');

        _fireEvent(DebugService.ErrorTypes.errorAdded, errorItem);
    };
    
    
    DebugService.listen = function listen(callbackFn) {
        _errorListeners.push(callbackFn);    
    };


    /**
     * Clear a single error by id
     * @param id {number} The id of the error to clear
     */
    DebugService.clearError = function clearError(id) {
        for (var i = 0; i < _errorList.length; i++) {
            var error = _errorList[i];
            if (error.id === id) {
                _errorList.splice(i, 1);
                _fireEvent(DebugService.ErrorTypes.errorCleared, error);
                break;
            }
        }
    };


    /**
     * Returns the current list of errors
     * @returns {Array}
     */
    DebugService.getErrorList = function getErrorList() {
        return _errorList;
    };


    /**
     * Clears all errors that have the specified type
     * @param type
     */
    DebugService.clearErrorByType = function clearErrorByType(type) {
        var indicesToClear = [];

        for (var i = 0; i < _errorList.length; i++) {
            var error = _errorList[i];
            if (error.type === type) {
                indicesToClear.push(i);
            }
        }

        for (var i = indicesToClear.length - 1; i >= 0; i--) {
            var index = indicesToClear[i];
            _errorList.splice(index, 1);
            _fireEvent(DebugService.ErrorTypes.errorCleared, error);
        }
    };
    
    context.DebugService = DebugService;
})(ASM);
'use strict';

const ERRORS = {
    UNKNOWN_ERROR: {name: 'unknown_error', message: 'Unknown error'}
    , UNSUPPORTED_METHOD: {name: 'unsupported_method', message: 'Method is not supported', status: 400}
    , INVALID_INPUT_DATA: {name: 'invalid_input_data', message: 'Invalid input data', status: 400}
    , UNKNOWN_QUERY_ERROR: {name: 'unknown_query_error', message: 'Unknown query error'}
    , UNAUTHORIZED: {name: 'unauthorized', message: 'User authorization reqired', status: 403}
    , SESSION_INVALID: {name: 'session_invalid', message: 'Session data are absent or invalid', status: 403}
    , VALIDATION_ERROR: {name: 'validation_error', message: 'Validation data error', status: 400}
    , DUPLICATE_ENTRY: {name: 'duplicate_entry_error', message: 'Duplicate entry error', status: 409}
};

module.exports = ERRORS;

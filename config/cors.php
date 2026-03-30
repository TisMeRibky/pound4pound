<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*'], // only API routes

    'allowed_methods' => ['*'], // GET, POST, PUT, DELETE, etc.
    'allowed_origins' => ['https://app.example.com'], // replace with your frontend URL
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,

    // false for token-based auth; true only if you use cookies
    'supports_credentials' => false,
];

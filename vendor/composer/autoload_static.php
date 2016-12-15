<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit9ee1361cdfa5e242decfeada8c8e9451
{
    public static $files = array (
        '31a7cf013d73a96bec3a5977a94ebccd' => __DIR__ . '/../..' . '/simple_html_dom.php',
    );

    public static $prefixLengthsPsr4 = array (
        'Q' => 
        array (
            'QL\\' => 3,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'QL\\' => 
        array (
            0 => __DIR__ . '/..' . '/jaeger/querylist',
        ),
    );

    public static $classMap = array (
        'Callback' => __DIR__ . '/..' . '/jaeger/phpquery-single/phpQuery.php',
        'CallbackBody' => __DIR__ . '/..' . '/jaeger/phpquery-single/phpQuery.php',
        'CallbackParam' => __DIR__ . '/..' . '/jaeger/phpquery-single/phpQuery.php',
        'CallbackParameterToReference' => __DIR__ . '/..' . '/jaeger/phpquery-single/phpQuery.php',
        'CallbackReturnReference' => __DIR__ . '/..' . '/jaeger/phpquery-single/phpQuery.php',
        'CallbackReturnValue' => __DIR__ . '/..' . '/jaeger/phpquery-single/phpQuery.php',
        'DOMDocumentWrapper' => __DIR__ . '/..' . '/jaeger/phpquery-single/phpQuery.php',
        'DOMEvent' => __DIR__ . '/..' . '/jaeger/phpquery-single/phpQuery.php',
        'ICallbackNamed' => __DIR__ . '/..' . '/jaeger/phpquery-single/phpQuery.php',
        'phpQuery' => __DIR__ . '/..' . '/jaeger/phpquery-single/phpQuery.php',
        'phpQueryEvents' => __DIR__ . '/..' . '/jaeger/phpquery-single/phpQuery.php',
        'phpQueryObject' => __DIR__ . '/..' . '/jaeger/phpquery-single/phpQuery.php',
        'phpQueryPlugins' => __DIR__ . '/..' . '/jaeger/phpquery-single/phpQuery.php',
        'simple_html_dom' => __DIR__ . '/../..' . '/simple_html_dom.php',
        'simple_html_dom_node' => __DIR__ . '/../..' . '/simple_html_dom.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit9ee1361cdfa5e242decfeada8c8e9451::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit9ee1361cdfa5e242decfeada8c8e9451::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit9ee1361cdfa5e242decfeada8c8e9451::$classMap;

        }, null, ClassLoader::class);
    }
}
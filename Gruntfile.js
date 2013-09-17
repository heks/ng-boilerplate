/**
 * This file/module contains all configuration for the build process.
 */
module.exports = function ( grunt ) {
  grunt.config.init({
    /**
     * The `build_dir` folder is where our projects are compiled during
     * development and the `compile_dir` folder is where our app resides once it's
     * completely built.
     */
    build_dir: 'build',
    compile_dir: 'bin',

    /**
     * This is a collection of file patterns that refer to our app code (the
     * stuff in `src/`). These file paths are used in the configuration of
     * build tasks. `js` is all project javascript, less tests. `ctpl` contains
     * our reusable components' (`src/common`) template HTML files, while
     * `atpl` contains the same, but for our app's code. `html` is just our
     * main HTML file, `less` is our main stylesheet, and `unit` contains our
     * app's unit tests.
     */
    app_files: {
      js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
      jsunit: [ 'src/**/*.spec.js' ],
      
      coffee: [ 'src/**/*.coffee', '!src/**/*.spec.coffee' ],
      coffeeunit: [ 'src/**/*.spec.coffee' ],

      atpl: [ 'src/app/**/*.tpl.html' ],
      ctpl: [ 'src/common/**/*.tpl.html' ],

      html: [ 'src/index.html' ],
      less: 'src/less/main.less'
    },

    /**
     * This is a collection of files used during testing only.
     */
    test_files: {
      js: [
        'vendor/angular-mocks/angular-mocks.js'
      ]
    },

    /**
     * This is the same as `app_files`, except it contains patterns that
     * reference vendor code (`vendor/`) that we need to place into the build
     * process somewhere. While the `app_files` property ensures all
     * standardized files are collected for compilation, it is the user's job
     * to ensure non-standardized (i.e. vendor-related) files are handled
     * appropriately in `vendor_files.js`.
     *
     * The `vendor_files.js` property holds files to be automatically
     * concatenated and minified with our project source files.
     *
     * The `vendor_files.css` property holds any CSS files to be automatically
     * included in our app.
     *
     * The `vendor_files.assets` property holds any assets to be copied along
     * with our app's assets. This structure is flattened, so it is not
     * recommended that you use wildcards.
     */
    vendor_files: {
      js: [
        'vendor/angular/angular.js',
        'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'vendor/placeholders/angular-placeholders-0.0.1-SNAPSHOT.min.js',
        'vendor/angular-ui-router/release/angular-ui-router.js',
        'vendor/angular-ui-utils/modules/route/route.js'
      ],
      css: [
      ],
      assets: [
      ]
    },

    /**
     * TODO: implement me!
     * Tasks to disable during the build. These must be task names, not ngbp
     * module names. For example, Less defines two tasks, one to run during the
     * build as `less:build` and during the compile as `less:compile`. Either
     * of these can be listed to disable it, or `less` can be listed to disable
     * all of them.
     */
    disabled: [
    ],

    /**
     * The injection property allows you to have grunt tasks that you add
     * yourself run at specific points during the build. This can be useful for
     * tasks that may impact how ngBoilerplate will operate. For example, if
     * you need to do additional processing of script files after they have
     * been concatenated but before they have been minified, you could do so
     * here.
     *
     * See http://github.com/ngbp/ng-boilerplate/wiki/Injection
     */
    injections: {
      build: {
        pre: [
          // { priority: 50, task: 'myTask:subtask' }
        ]
      }
    }
  });

  /**
   * For tasks not build in to ngBoilerplate, load them below, include their
   * configuration above (if necessary), and tell ngBoilerplate where you want
   * it to run using the "injection" property above.
   */
   // grunt.loadNpmTasks( 'myTask' );

  /**
   * Lastly, you can define your own grunt tasks here. If you don't want
   * something done as part of ngBoilerplate - say something to run manually -
   * then you can list it here.
   */
  // grunt.registerTask( 'myTask', [ 'runThis', 'andThenThis' ]);

  /**
   * Load ngBoilerplate
   */
  grunt.verbose.subhead( "Starting ngBoilerplate..." );
  grunt.loadTasks( "tasks" );
};


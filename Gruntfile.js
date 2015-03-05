module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    copy: {
      build: {
        cwd: 'source',
        src: [ '**' ],
        dest: 'build',
        expand: true
      },
    },

    clean: {
      build: {
        src: [ 'build' ]
      },
    },

    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
      },
      dist: {
        // the files to concatenate
        src: ['public/client/*.js' ],
        // the location of the resulting JS file
        //'dist/<%= pkg.name %>.js'
        dest: 'dist/application.js'
      }
   },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      static_mappings: {
          // Because these src-dest file mappings are manually specified, every
          // time a new file is added or removed, the Gruntfile has to be updated.
          files: [
          {src: 'dist/application.js', dest: 'dist/application.min.js'}
          ],
        }

     //  dynamic_mappings: {
     //  // Grunt will search for "**/*.js" under "lib/" when the "uglify" task
     //  // runs and build the appropriate src-dest file mappings then, so you
     //  // don't need to update the Gruntfile when files are added or removed.
     //    files: [
     //      {
     //        expand: true,     // Enable dynamic expansion.
     //        cwd: 'public/',      // Src matches are relative to this path.
     //        src: ['**/*.js'], // Actual pattern(s) to match.
     //        dest: 'build/',   // Destination path prefix.
     //        ext: '.min.js',   // Dest filepaths will have this extension.
     //        extDot: 'first'   // Extensions in filenames begin after the first dot
     //      }
     //    ],
     // }
    },

    jshint: {
      files: [
        'Gruntfile.js',
        'test/**/*.js',
        'server.js',
        'public/client/**/*.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
        target: {
          files: [{
            expand: true,
            cwd: 'public/',
            src: ['*.css', '!*.min.css'],
            dest: 'build/',
            ext: '.min.css'
          }]
        }
     },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'jshint',
    'mochaTest'
  ]);

   grunt.registerTask('default', ['test', 'concat', 'uglify', 'cssmin']);

  grunt.registerTask('build', ['clean', 'copy'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here


    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    // add your deploy tasks here
  ]);
};

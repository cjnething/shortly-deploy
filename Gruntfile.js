module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),


    concat: {

      options: {
        separator: ';'
      },


      app: {
        src: ['public/client/app.js',
        'public/client/link.js',
        'public/client/links.js',
        'public/client/linkView.js',
        'public/client/linksView.js',
        'public/client/createLinkView.js',
        'public/client/router.js'
        ],
        dest: 'public/dist/application.js'
      },

      lib: {
        src: ['public/lib/jquery.js',
        'public/lib/underscore.js',
        'public/lib/backbone.js',
        'public/lib/handlebars.js'
        ],
        dest: 'public/dist/libraries.js'
      },
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
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
          {src: 'public/dist/application.js', dest: 'public/dist/application.min.js'},
          {src: 'public/dist/libraries.js', dest: 'public/dist/libraries.min.js'}
          ],
        }
      },

      jshint: {
        files: [
        'Gruntfile.js'
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
            src: ['style.css'],
            dest: 'public/dist',
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
          command: 'git push azure bugfix'
        }
      },
    });

grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-cssmin');
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


grunt.registerTask('server', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var git = grunt.util.spawn({
     cmd: 'git',
     grunt: true,
     args: 'add'
   });
    git.stdout.pipe(process.stdout);
    git.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });
  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'jshint',
    'mochaTest'
    ]);

  grunt.registerTask('build', [
    'concat:app',
    'concat:lib',
    'uglify',
    'cssmin'
    ]);


  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
      grunt.task.run([ 'shell' ]);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    'test',
    'build',
    'upload'
    ]);

};

module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
//       autoprefixer: {
//         options: {
//           // Task-specific options go here.
//         },
//         multiple_files: {
//           expand: true,
//           flatten: true,
//           src: 'css/*.css',
//           dest: 'css/autoprefixed/'
//         },
//       },
      
      svgmin: {
        options: { // Configuration that will be passed directly to SVGO
          plugins: [
            { removeUselessStrokeAndFill: false } // preserves some *not* useless paths
          ]
        },
        dist: {
          files: [{
            expand: true,
            cwd: 'icons/svgs',
            src: ['*.svg'],
            dest: 'icons/source'
          }]
        }
      },

      grunticon: {
        foo: {
          files: [{
              expand: true,
              cwd: 'icons/source',
              src: ['*.svg', '*.png'],
              dest: "icons/grunticon_output"
          }],
          options: {
            loadersnippet: 'grunticon.loader.js',
            template: 'icons/css.hbs',
            cssprefix: '.grunticon-',
            datasvgcss: '_data.svg.scss',
            datapngcss: '_data.png.scss',
            urlpngcss: '_data.fallback.scss'
          }
        }
      },
      
      copy: {
        grunticonToSass: {
          expand: true,
          cwd: 'icons/grunticon_output/',
          src: ['*.html', '**/*.png'],
          dest: 'icons/output/'
        }
      },
      
      watch: {
//         styles: {
//           files: 'css/*.css',
//           tasks: ['autoprefixer']
//         },
        grunticon: {
          files: 'icons/svgs/*.svg',
          tasks: ['svgmin', 'grunticon:foo', 'copy:grunticonToSass']
        }
      }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks( 'grunt-svgmin' );
    grunt.loadNpmTasks( 'grunt-autoprefixer' );
    grunt.loadNpmTasks( 'grunt-grunticon' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    //grunt.registerTask('default', ['autoprefixer', 'svgmin', 'grunticon:foo', 'copy:grunticonToSass']);
    grunt.registerTask('default', ['svgmin', 'grunticon:foo', 'copy:grunticonToSass']);

};
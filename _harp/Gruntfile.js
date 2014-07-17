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
      
      cssmin: {
        minify: {
          expand: true,
          cwd: 'css/',
          src: [ '*.css', '!*.min.css' ],
          dest: 'css/build/',
          ext: '.min.css'
        }
      },
      
      // First step of Grunticon: copy SVG files and minify them
      svgmin: {
        options: { // Configuration that will be passed directly to SVGO
          plugins: [
            { removeUselessStrokeAndFill: false } // preserves some *not* useless paths
          ]
        },
        dist: {
          files: [{
            expand: true,
            cwd: 'icons/_svgs',
            src: ['*.svg'],
            dest: 'icons/_source'
          }]
        }
      },

      // Next step: run the minified SVGs through grunticon
      // This will trigger the .scss files in the final output folder
      grunticon: {
        foo: {
          files: [{
              expand: true,
              cwd: 'icons/_source',
              src: ['*.svg', '*.png'],
              dest: "icons/_grunticon"
          }],
          options: {
            loadersnippet: 'grunticon.loader.js',
            template: 'icons/_css.hbs',
            cssprefix: '.grunticon-',
            datasvgcss: '_data.svg.scss',
            datapngcss: '_data.png.scss',
            urlpngcss: '_data.fallback.scss'
          }
        }
      },
      
      // Next Grunticon step: 
      // copy the HTML from _grunticon to the final output folder
      copy: {
        grunticonToSass: {
          expand: true,
          cwd: 'icons/_grunticon/',
          src: ['*.html'],
          dest: 'icons/output/'
        }
      },
      
      // Next Grunticon step: 
      // Copy and minify the pngs from _grunticon to output
      imagemin: {
        grunticon: {
          options: {
            cache: true
          },
          files: [{
            expand: true,
            cwd: 'icons/_grunticon/png/',
            src: ['*.png'],
            dest: 'icons/output/png/'
          }]
        }
      },
      
      // Final Grunticon step: 
      // Run SASS on the output files to create the final output
      sass: {
        grunticon: {
          options: {
            style: 'compressed'
          },
          files: {
            'icons/output/icons.data.png.css': 'icons/output/icons.data.png.scss',
            'icons/output/icons.data.svg.css': 'icons/output/icons.data.svg.scss',
            'icons/output/icons.fallback.css': 'icons/output/icons.fallback.scss'
          }
        }
      },
      
      bytesize: {
        css: {
          src: ['css/build/*.css']
        },
        js: {
          src: ['js/build/*.js']
        },
        grunticon: {
          src: ['icons/output/*.css']
        }
      },
      
      watch: {
        styles: {
          files: [ 'css/*.css'],
          tasks: ['cssmin','bytesize:css']
        },
        js: {
          files: 'js/build/*.js',
          tasks: ['bytesize:js']
        },
        grunticon: {
          files: 'icons/_svgs/*.svg',
          tasks: ['svgmin', 'grunticon:foo', 'copy:grunticonToSass', 'imagemin:grunticon']
        },
        grunticon_sass: {
          files: 'icons/_grunticon/*.scss',
          tasks: ['sass:grunticon','bytesize:grunticon']
        }
      }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks( 'grunt-svgmin' );
    grunt.loadNpmTasks( 'grunt-autoprefixer' );
    grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
    grunt.loadNpmTasks( 'grunt-grunticon' );
    grunt.loadNpmTasks( 'grunt-contrib-imagemin' );
    grunt.loadNpmTasks( 'grunt-contrib-sass' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-bytesize' );

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    //grunt.registerTask('default', ['autoprefixer', 'svgmin', 'grunticon:foo', 'copy:grunticonToSass']);
    grunt.registerTask('default', ['cssmin', 'svgmin', 'grunticon:foo', 'copy:grunticonToSass', 'imagemin:grunticon', 'sass']);

};
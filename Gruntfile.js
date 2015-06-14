// Generated on 2015-05-15 using generator-nodes 0.5.9
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

var path = require('path');

// Add bower packages to have them ignored by Wiredep.
var bowerIgnore = [
	'jquery.cookie',
	'jquery.placeholder',
	'fastclick',
	'angulartics-adobe',
	'angulartics-chartbeat',
	'angulartics-flurry',
	'angulartics-ga-cordova',
	'angulartics-gtm',
	'angulartics-kissmetrics',
	'angulartics-mixpanel',
	'angulartics-scroll',
	'angulartics-segmentio',
	'angulartics-splunk',
	'angulartics-woopra',
	'angulartics-marketo',
	'angulartics-intercom',
	'angulartics-piwik',
	'localforage',
	'js-data'
];
// Since we are writing a new environment file, we remove it from the usemin processing
var envFile = 'config/enviroment.js';
function skipEnv(context, block) {
	var cfg = {files: []};

	var outfile = path.join(context.outDir, block.dest);

	var files = {
		dest: outfile,
		src: []
	};
	context.inFiles.forEach(function(f) {
		if(f !== envFile) {
			files.src.push(path.join(context.inDir, f));
		}
	});
	cfg.files.push(files);
	context.outFiles = [block.dest];

	return cfg;
}

module.exports = function (grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);
	var modRewrite = require('connect-modrewrite');
	var browserSync = require('browser-sync');

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Configurable paths for the application
	var appConfig = {
		app: require('./bower.json').appPath || 'app',
		dist: 'dist',
		appName: '<%= scriptAppName %>'
	};

	// Define the configuration for all the tasks
	grunt.initConfig({

		// Project settings
		yeoman: appConfig,

		/*
			Watch tasks
		*/
		watch: {
			options: {
				spawn: false
			},
			bower: {
				files: ['bower.json'],
				tasks: ['wiredep', 'bs-reload']
			},
			js: {
				files: [
					'<%= yeoman.app %>/config/**/*.js',
					'<%= yeoman.app %>/common/**/*.js',
					'<%= yeoman.app %>/modules/**/*.js',
					'<%= yeoman.app %>/models/**/*.js',
					'<%= yeoman.app %>/config/**/*.js'
				],
				tasks: ['bs-reload']
			},
			html: {
				files: [
					'<%= yeoman.app %>/**/*.html'
				],
				tasks: ['bs-reload']
			},
			sass: {
				files: [
					'<%= yeoman.app %>/styles/**/*.{scss,sass}',
					'<%= yeoman.app %>/common/**/*.{scss,sass}',
					'<%= yeoman.app %>/modules/**/*.{scss,sass}'
				],
				tasks: ['sass:server', 'autoprefixer', 'bs-injectScss']
			},
			gruntfile: {
				files: ['Gruntfile.js']
			}
		},

		/*
		 Connect Webserver
		 */
		connect: {
			dist: {
				options: {
					open: true,
					keepalive: true,
					port: 9000,
					hostname: '0.0.0.0',
					livereload: false,
					base: '<%= yeoman.dist %>',
					middleware: function (connect) {

						// Mimic a production server,
						// necessary settings for Angular html5mode.

						return [
							require('connect-modrewrite') (['!(\\..+)$ /index.html [L]']),
							connect.static(appConfig.dist)
						];
					}
				}
			}
		},

		/*
			SASS & CSS Tasks
		*/
		// Add vendor prefixed styles
		autoprefixer: {
			options: {
				browsers: ['last 2 version']
			},
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/styles/',
					src: '{,*/}*.css',
					dest: '.tmp/styles/'
				}]
			}
		},
		// Compiles Sass to CSS and generates necessary files if requested
		sass: {
			options: {
				sourcemap: true,
				imagePath: '<%= yeoman.app %>/assets/images/'
			},
			server: {
				options: {
					debugInfo: true
				},
				files: {
					'.tmp/styles/main.css': '<%= yeoman.app %>/styles/main.scss'
				}
			}
		},
		// Remove any styles that are not present in html templates
		/*
			ATTENTION (generator-nodes v. 0.8.0+):

		 	https://github.com/giakki/uncss/issues/149

		 	We have disabled this feature, until inline ignore comments are supported
		*/
		uncss: {
			dist: {
				files: {
					'.tmp/styles/main.css': ['<%= yeoman.app %>/index.html', '<%= yeoman.app %>/**/*.template.html']
				},
				options: {
					csspath: '../.tmp/',
					report: 'gzip'
				}
			}
		},
		// Strip out comments from compiled css
		cssmin: {
			dist: {
				options: {
					keepSpecialComments: 0
				},
				files: {
					'<%= yeoman.dist %>/styles/main.css': '.tmp/styles/{,*/}*.css'
				}
			}
		},


		/*
			Javascript Tasks
		*/

		/*
			AngularJS Specific tasks
		 */
		// ng-annotate tries to make the code safe for minification automatically
		// by using the Angular long form for dependency injection.
		ngAnnotate: {
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/concat/scripts',
					src: '*.js',
					dest: '.tmp/concat/scripts'
				}]
			}
		},
		// Inline templates in Javascript to avoid async template loading
		ngtemplates: {
			dist: {
				cwd: '<%= yeoman.app %>',
				src: [
					'common/**/*.template.html',
					'modules/**/*.template.html'
				],
				dest: '.tmp/concat/scripts/templates.js',
				options: {
					usemin: 'scripts/scripts.js',
					module: 'typed',
					htmlmin: {
						collapseBooleanAttributes: false,
						collapseWhitespace: false,
						removeAttributeQuotes: false,
						removeComments: false, // Only if you don't use comment directives!
						removeEmptyAttributes: false,
						removeRedundantAttributes: false,
						removeScriptTypeAttributes: false,
						removeStyleLinkTypeAttributes: false
					}
				}
			}
		},
		//
		ngconstant: {
			options: {
				name: 'DEBUG_ENV',
				dest: '.tmp/concat/scripts/environment.js',
				constants: {
					DEBUG_ENV: false
				}
			},
			dist: {
			}
		},

		/*
			Image Optimization
		*/
		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/assets/images',
					src: '{,*/}*.{png,jpg,jpeg,gif}',
					dest: '<%= yeoman.dist %>/assets/images'
				}]
			}
		},
		svgmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/assets/images',
					src: '{,*/}*.svg',
					dest: '<%= yeoman.dist %>/assets/images'
				}]
			}
		},

		/*
			Global Build Tasks
		*/
		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		useminPrepare: {
			html: '<%= yeoman.app %>/index.html',
			options: {
				dest: '<%= yeoman.dist %>',
				flow: {
					html: {
						js: [
							{
								name: 'concat',
								createConfig: skipEnv
							},
							'uglifyjs'
						],
						post: {}
					}
				}
			}
		},
		// Performs rewrites based on filerev and the useminPrepare configuration
		usemin: {
			html: ['<%= yeoman.dist %>/{,*/}*.html'],
			css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
			options: {
				assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/assets/images']
			}
		},
		// Concatenate the scripts and the newly generated environment constant
		concat: {
			dist: {
				src: ['.tmp/concat/scripts/scripts.js', '.tmp/concat/scripts/enviroment.js'],
				dest: '.tmp/concat/scripts/scripts.js'
			}
		},
		// Disable Mangling: http://lisperator.net/uglifyjs/mangle
		uglify: {
			options: {
				mangle: false
			}
		},
		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.app %>',
					dest: '<%= yeoman.dist %>',
					src: [
						'*.{ico,png,txt}',
						'.htaccess',
						'*.html',
						'views/{,*/}*.html',
						'assets/images/{,*/}*.{webp}',
						'assets/fonts/*',
						'!assets/icons/raw',
						'assets/icons/*.{svg,png}'
					]
				}, {
					expand: true,
					cwd: '.tmp/images',
					dest: '<%= yeoman.dist %>/images',
					src: ['generated/*']
				}, {
					expand: true,
					flatten: true,
					cwd: '.',
					src: 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*.*',
					dest: '<%= yeoman.dist %>/assets/icons'
				}]
			},
			styles: {
				expand: true,
				cwd: '<%= yeoman.app %>/styles',
				dest: '.tmp/styles/',
				src: '{,*/}*.css'
			}
		},
		// Renames files for browser caching purposes
		// Until we have a proper flow for updating file refs, we dont cache-bust images nor fonts.
		filerev: {
			dist: {
				src: [
					'<%= yeoman.dist %>/scripts/{,*/}*.js',
					'<%= yeoman.dist %>/styles/{,*/}*.css',
					//'<%= yeoman.dist %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
					//'<%= yeoman.dist %>/assets/fonts/*'
				]
			}
		},


		/*
			Global Utility Tasks
		*/
		// Automatically inject Bower components into the app
		wiredep: {
			options: {
				cwd: '',
				exclude: bowerIgnore
			},
			app: {
				src: ['<%= yeoman.app %>/index.html'],
				ignorePath: /\.\.\//
			},
			sass: {
				src: ['<%= yeoman.app %>/styles/main.scss'],
				ignorePath: /\.\.\/\.\.\//
			}
		},
		// Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= yeoman.dist %>/{,*/}*',
						'!<%= yeoman.dist %>/.git*'
					]
				}]
			},
			server: '.tmp'
		},
		// Run some tasks in parallel to speed up the tasks processes
		concurrent: {
			server: [
				'sass:server'
			],
			dist: [
				'sass:server',
				'imagemin',
				'svgmin'
			]
		},

		/*
			Commandline tools, not part of any task-chains (standalone)

			Please look up the documentation for each task, to learn more.
		 */
		grunticon: {
			icons: {
				options: {
					enhanceSVG: true
				},
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/assets/icons/raw',
					src: ['*.svg', '*.png'],
					dest: '<%= yeoman.app %>/assets/icons'
				}]
			}
		},
		pageres: {
			app: {
				options: {
					url: '127.0.0.1:9000',
					sizes: ['1280x960', '1024x768', '640x480', '320x480'],
					dest: 'screenshots'
				}
			}
		}
	});

	/*
		Command line tasks
	 */
	grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
		if (target === 'dist') {
			return grunt.task.run(['build', 'connect:dist:keepalive']);
		}

		grunt.task.run([
			'clean:server',
			'wiredep',
			'concurrent:server',
			'autoprefixer',
			'bs-connect',
			'watch'
		]);
	});

	grunt.registerTask('dist', 'Start a web server from the build folder', function() {
		// So far, the only way to keep the BS server running is to have it watch files...
		grunt.task.run(['bs-connectDist', 'watch']);
	});

	grunt.registerTask('build', [
		'clean:dist',
		'wiredep',
		'concurrent:dist',
		'ngconstant',
		'useminPrepare',
		'ngtemplates',
		'concat',
		'autoprefixer:dist',
		'ngAnnotate',
		//'uncss',
		'copy:dist',
		'cssmin',
		'concat:dist',
		'uglify',
		'filerev',
		'usemin'
	]);

	grunt.registerTask('default', [
		'build'
	]);

	grunt.registerTask('bs-connect', function () {
		browserSync({
			server: {
				baseDir: ['app', '.tmp'],
				routes: {
					'/bower_components': './bower_components'
				}
			},
			middleware: [
				modRewrite(['!(\\..+)$ /index.html [L]'])
			]
		});
	});

	grunt.registerTask('bs-connectDist', function () {
		browserSync({
			server: {
				baseDir: ['dist']
			},
			middleware: [
				modRewrite(['!(\\..+)$ /index.html [L]'])
			]
		});
	});

	grunt.registerTask('bs-injectScss', function () {
		browserSync.reload('main.css');
	});

	grunt.registerTask('bs-reload', function () {
		browserSync.reload();
	});
};

module.exports = function (grunt) {

    require('time-grunt')(grunt);


    require('load-grunt-tasks')(grunt, ['grunt-*']);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            files: ['public/javascripts/dataHunt.js'],
            options: {
                browser: true,
                globals: {
                    module:     true,
                    console:    true,
                    $:          true,
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            missing: {
              src: [
                'public/javascripts/dependencies/*.js',
                'public/javascripts/dataHunter.js',
                'public/javascripts/controllers/*.js',
                'public/javascripts/services/*.js',
            ],
              dest: 'public/javascripts/DataHunt.js',
              nonull: true,
            },
        },
        watch: {
            files: [
                'public/javascripts/controllers/*.js',
                'public/javascripts/services/*.js',
            ],
            tasks: 'auto'
        },
        uglify: {
            dist: {
                files: {
                    'public/javascripts/DataHunt.min.js': ['public/javascripts/DataHunt.js']
                }
            }
        },

    });


    grunt.registerTask('auto', ['jshint','concat', 'uglify']);

};

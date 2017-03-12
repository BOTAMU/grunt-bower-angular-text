module.exports = function (grunt) {

    /***加载package.json中devDependencies里的所有依赖模块***/
    require("load-grunt-tasks")(grunt);

    /***任务配置,所有插件的配置信息***/
    grunt.initConfig({
        //读取package.json文件
        pkg: grunt.file.readJSON("package.json"),

        //concat用来合并JS文件
        concat: {
            options: {
                separator: ";"//定义一个用于插入合并输出文件之间的字符
            },
            js: {
                src: ["src/js/**/*.js"],//将要被合并的文件
                dest: "build/merge/<%= pkg.name %>.js"//合并后的JS文件所存放的路径
            }
        },

        //uglify用来压缩JS文件
        uglify: {
            options: {
                // 此处定义的banner注释(插入名字+版本和插入时间)将插入到输出文件的顶部
                banner: "/*! <%= pkg.name %>-<%= pkg.version %> <%= grunt.template.today('dd-mm-yyyy') %> */\n"
            },
            js: {
                //uglify会自动压缩concat任务中生成的文件
                expand: true,//启用下面的选项
                cwd: "build/merge/",//待压缩文件目录
                src: "**/*.js",//指定压缩的文件名后缀
                dest: "build",//压缩后文件存放路径
                ext: "-<%= pkg.version %>.min.js"//压缩成的文件使用版本+.min.js替换原有扩展名。
            }
        },

        //jshint用来检查js代码规范
        jshint: {
            files: ["Gruntfile.js","src/js/**/*.js"],//要进行js检查的文件
            //这里是覆盖jshint默认配置的选项
            globals: {
                jQuery: true,
                console: true,
                module: true,
                document: true
            }
        },

        //cssmin用来压缩CSS文件
        cssmin: {
            options: {
                // 此处定义的banner注释(插入名字+版本和插入时间)将插入到输出文件的顶部
                banner: "/*! <%= pkg.name %>-<%= pkg.version %> <%= grunt.template.today('dd-mm-yyyy') %> */\n"
            },
            css: {
                expand: true,//启用下面的选项
                cwd: "src/css/",//待压缩文件目录
                src: "**/*.css",//指定压缩的文件名后缀
                dest: "build",//压缩后文件存放路径
                ext: "-<%= pkg.version %>.min.css"//压缩成的文件使用版本+.min.js替换原有扩展名。
            }
        },

        //watch用来监听文件，当文件发生变化时会执行tasks中指定的任务
        watch: {
            options: {
                livereload: true
            },
            // '**' 表示包含所有的子目录
            // '*' 表示包含所有的文件
            files: ["<%= jshint.files %>", "*.html","src/tpls/*.html","src/css/*"],//监听的文件
            tasks: ["jshint","cssmin:css"]//文件发生改变时要做的事情
        },

        //wiredep自动将bower_components中的包加入到index.html中
        wiredep: {
            task: {
                src: ["index.html"]
            }
        },

        //通过connect任务，创建一个静态服务器
        connect: {
            options: {
                port: 9000,// 服务器端口号
                hostname: "localhost",//服务器地址(可以使用主机名localhost，也能使用IP)
                protocol: "http",//超文本传输协议,如http,https
                open: true,//表示静态服务启动之后是否以默认浏览器打开首页,即base.options.index指定的页面
                base: {
                    path: "./",//配置站点的根目录，这里把根目录配置成了当前的项目文件夹(./)
                    options: {
                        index: "index.html"
                    }
                },
                livereload: true
            },
            default: {}
        }
    });

    /***启动任务,grunt start,start这个名字可以是其它自定义名字***/
    grunt.registerTask("start","启动",function () {
        grunt.task.run([
            "concat",
            "uglify",
            "jshint",
            "cssmin",
            "wiredep",
            "connect:default",
            "watch"
        ]);
    });
};
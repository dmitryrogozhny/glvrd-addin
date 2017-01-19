var gulp = require("gulp");
var webserver = require("gulp-webserver");

var tsc = require("gulp-typescript");
var tslint = require("gulp-tslint");

gulp.task("webserver", function(){
    gulp.src("./dist")
    .pipe(webserver({
        https: true,
        port: "8443",
        host: "localhost",
        directoryListing: {
            enable: true,
            path: "./dist"
        },
        open: false,
        livereload: false
    }));
});

gulp.task("tslint", function() {
    return gulp.src(["app/**/*.tsx"])
    .pipe(tslint())
    .pipe(tslint.report("verbose"));
});

tscConfig = tsc.createProject("tsconfig.json");

gulp.task("tsc", function() {
    return gulp.src("./src/app/**/*.tsx")
    .pipe(tsc(tscConfig))
    .js.pipe(gulp.dest("dist"))
});

gulp.task("copy-files", function() {
    // copy html files
    gulp.src("./src/index.html").pipe(gulp.dest("dist"));
    gulp.src("./src/functionFile.html").pipe(gulp.dest("dist"));

    // copy images files
    gulp.src("./src/img/*.*").pipe(gulp.dest("dist/img"));

    // copy css files
    gulp.src("./src/css/proofreadEditor.css").pipe(gulp.dest("dist/css"));
    gulp.src("./node_modules/draft-js/dist/Draft.css").pipe(gulp.dest("dist/css"));

    // copy support pages
    gulp.src("./src/pages/*.*").pipe(gulp.dest("dist/pages"));
});

gulp.task("build", ["tsc", "copy-files"]);

gulp.task("default", ["tsc", "copy-files", "webserver"]);
const webpack = require("webpack-stream");
const gulp = require("gulp");
const zip = require("gulp-zip");
const del = require("del");
const mainBowerFiles = require("main-bower-files");
const exists = require("path-exists").sync;
const eslint = require("gulp-eslint");
const merge = require("gulp-merge-json");


gulp.task("clean", () => {
    return del(["build"]);
});


gulp.task("lint", () => {
    return gulp.src(["app/*.js", "src/*.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});


gulp.task("bower", ["clean"], () => {
    const bowerWithMin = mainBowerFiles().map((path) => {
        const newPath = path.replace(/.([^.]+)$/g, ".min.$1");
        return exists(newPath) ? newPath : path;
    });

    return gulp.src(bowerWithMin)
        .pipe(gulp.dest("build/lib/"));
});


// Extension

gulp.task("copy_ext", ["clean", "bower"], () => {
    return gulp.src(["src/**", "static/**", "build/lib/**"])
        .pipe(gulp.dest("build/ext/"));
});


function autopack(filename) {
    return gulp.src(`app/${filename}`)
        .pipe(webpack({
            "output": {filename}
        }))
        .pipe(gulp.dest("build/ext/"));
}

gulp.task("pack_ext:inject", ["clean"], () => autopack("page_inject.js"));
gulp.task("pack_ext:options", ["clean"], () => autopack("options.js"));
gulp.task("pack_ext", ["pack_ext:inject", "pack_ext:options"]);


function buildVersionTasks(env) {
    gulp.task(`pack_manifest:${env}`, ["clean"], () => {
        return gulp.src(["manifest/manifest.json", `manifest/${env}.json`])
            .pipe(merge({
                "fileName": "manifest.json"
            }))
            .pipe(gulp.dest(`build/ext_${env}/`));
    });

    gulp.task(`copy_final:${env}`, ["copy_ext", "pack_ext"], () => {
        return gulp.src("build/ext/**")
            .pipe(gulp.dest(`build/ext_${env}/`));
    });

    gulp.task(`zip_ext:${env}`, [`copy_final:${env}`, `pack_manifest:${env}`], () => {
        return gulp.src(`build/ext_${env}/**`)
            .pipe(zip(`faextender_${env}.zip`))
            .pipe(gulp.dest("build"));
    });

    gulp.task(`build:${env}`, [`zip_ext:${env}`]);
}

buildVersionTasks("chrome");
buildVersionTasks("firefox");
gulp.task("build", ["build:chrome", "build:firefox"]);


// Default task

gulp.task("default", ["build"]);

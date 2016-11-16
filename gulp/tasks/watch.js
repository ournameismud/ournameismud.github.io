import gulp from 'gulp'
import browserSync from 'browser-sync'
import watch from 'gulp-watch'
import config from '../config'

const $browserSync = config.browserSync
const reload = browserSync.reload

gulp.task('default', ['watch'])

gulp.task('server', () => browserSync($browserSync))

gulp.task('watch', () => {
	browserSync($browserSync)
	// watch scss
	watch(config.sass.watch, () => gulp.start('sass', reload))
	// watch js
	watch(config.js.watch, () => gulp.start('scripts', reload))
	// watch pug
	watch(config.pug.watch, () => gulp.start('pug', reload))
	// watch template
	watch(config.template.src, () => gulp.start('build-template', reload))
	// watch json
	watch(config.json.src, () => gulp.start('build-json', reload))
	// watch images
	watch(config.images.src, () =>  gulp.start('images', reload))
	// watch svg symbols
	watch(config.svgSymbols.src, () => gulp.start('symbols', reload))
	// watch svg assets
	watch(config.svg.assets, () => gulp.start('svg-assets', reload))
	// watch craft
	watch(config.craft.watch, reload)
})

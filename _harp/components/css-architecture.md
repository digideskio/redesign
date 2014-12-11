This site uses [SASS](http://sass-lang.com/) (specifically, SCSS) to build and manage the site’s CSS. SASS makes it very easy to break out the bits of CSS into as many modular pieces as you need to then compile them all into a few minified CSS files for production. 


## File locations

The SASS files are located in [`_harp/assets/css/`](https://github.com/OSLC/redesign/tree/gh-pages/_harp/assets/css).

The minified, concatenated files for production end up in [`_harp/assets/css/build/`](https://github.com/OSLC/redesign/tree/gh-pages/_harp/assets/css/build). These are the only files that should be on a public server.

The completed build files are:

- [`base.min.css`](https://github.com/OSLC/redesign/blob/gh-pages/_harp/assets/css/build/base.min.css) : the basic styles. These are served in a `<noscript>` tag to browsers that have disabled Javascript
- [`combined.min.css`](https://github.com/OSLC/redesign/blob/gh-pages/_harp/assets/css/build/combined.min.css) : A single combined CSS file with the complete stylesheet for the site. This is served up asynchronously to everyone with javascript enabled.
- [`critical.min.css`](https://github.com/OSLC/redesign/blob/gh-pages/_harp/assets/css/build/critical.min.css) : A generated subset of styles for “above-the-fold” content. The complete contents are placed inline in the `<head>` of templates to skip an HTTP request and speed up perceived loading time. More on this below.
- [`enhanced.min.css`](https://github.com/OSLC/redesign/blob/gh-pages/_harp/assets/css/build/enhanced.min.css) : The styles that are only applicable to enhanced clients with suitable JavaScript support. This file is not used directly in production. It is concatenated onto `base.min.css` to create `combined.min.css`.
- [`legacy.min.css`](https://github.com/OSLC/redesign/blob/gh-pages/_harp/assets/css/build/legacy.min.css) : The stylesheet from the 2011–2014 version of the site. It's only here to make it easy to compare files sizes. (It's larger than the new styles and was written without SASS.)

More about the use of these files in [Loading CSS and JavaScript](./fast-page-loading.html).


## SCSS files

Files and folders are prefixed with `_` to keep the Harp server/build from looking at them.

### [`_settings.scss`](https://github.com/OSLC/redesign/blob/gh-pages/_harp/assets/css/_settings.scss)

Many defaults and standards are set once here. Most are self-explanatory, but there are some major bits worth pointing out:

#### Color palette

As discussed in [this post](../posts/logo-and-colors-again.html), the main 6-hue color palette is standardized in an SCSS Map:

~~~
$palettes: (
  blue: (
    wheel:      hsl(211, 47%, 62%),
    x-light:    hsl(211, 47%, 90%),
    light:      hsl(211, 47%, 70%),
    mid-light:  hsl(211, 47%, 59%),
    base:       hsl(211, 47%, 48%),
    mid-dark:   hsl(211, 47%, 36%),
    dark:       hsl(211, 47%, 24%),
    x-dark:     hsl(211, 47%, 17%)
  ),
  red: (
    wheel:      hsl(11, 63%, 64%),
    x-light:    hsl(11, 63%, 90%),
    light:      hsl(11, 63%, 73%),
    mid-light:  hsl(11, 63%, 61%),
    base:       hsl(11, 63%, 49%),
    mid-dark:   hsl(11, 69%, 42%),
    dark:       hsl(11, 71%, 36%),
    x-dark:     hsl(11, 73%, 24%)
  ),
  […]
);
~~~

There is [a tiny helper function called `palette()`](https://github.com/OSLC/redesign/blob/gh-pages/_harp/assets/css/_helpers/_palette.scss) to access the colors in the map.

For example, to set a border to the "base" blue color:

~~~
background-color: palette(blue);
~~~

Access the shades/tints by name as the second (optional) paramter:

~~~
background-color: palette(blue, x-light);
~~~

#### Font sizes

These are defined also in a map:

~~~
$font-sizes: (
  n:       0,
  xxxs:    5px,
  xxs:     8px,
  xs:      11px, // Diminished Fifth; 16px * 70.71%
  s:       13px, // 5:6 Minor Third; 16px * 83.33%
  m:       16px, // Unison (base); 
  l:       19px, // 5:6 Minor Third; 16px * 120%
  xl:      23px, // 1:1.441 Diminished Fifth; 16px * 141%
  xxl:     27px, // 3:5 Major Sixth; 16px * 166.67%
  xxxl:    32px, // 1:2 Octave; 16px * 200%
  xxxxl:   38px, // 5:6 Minor Third; 32px * 120%
  xxxxxl:  48px // 1:3 Major Twelfth; 16px * 300%
);
~~~

Over the years I haven't found a better system for naming. I think starting with a base/medium size and going small/larger from there is more intuitive than using adjectives, say, puny->tiny->smaller->small->medium->larger->huge->monster or whatever.

[`_base/_typography.scss`](https://github.com/OSLC/redesign/blob/gh-pages/_harp/assets/css/_base/_typography.scss) defines the mixin `font-size()` to access the standard font sizes and also set the line height (second parameter).

For example, to set the font-size to `32px` (xxxl) with a line-height of `1`:

~~~
#aThing { @include font-size(xxxl,1); }
~~~

There are also mixins for the named font sizes (`font-size-xs` through `font-size-xxxxxl`) with reasonable line heights.

Also there are some named placeholders (eg `%font-size-m`) for use with `@extend`, but I now recommend against using those. SCSS placeholders I believe cause more grief than they save. Use the mixins instead. GZIP will mostly take care of the duplicate CSS expressions.


#### The grid

This site does not use a standard 6 or 18 or 12 column grid.

The grid widths available to you are defined in a map:

~~~
$grid-ratios: (
  full: 100%,
  half: 50%,
  major: 70.72%,
  minor: 29.28%
);
~~~

This does not leave you many options: a row can be either full-width, 2 half-and-half elements, or one big and one smaller element. More on this in [The Grid](./grid.html).

### [_base](https://github.com/OSLC/redesign/tree/gh-pages/_harp/assets/css/_base)

Only two files here.

- [`_reset.scss`](./reset.html): A normalize/reset to smooth out browser inconsistencies
- `_typography.scss`: A normalize/reset to smooth out browser inconsistencies

### [_components](https://github.com/OSLC/redesign/tree/gh-pages/_harp/assets/css/_components)

These files define small modules for re-use throughout the site. 

Names are mostly self-explanatory.

- [_breadcrumbs.scss](./breadcrumbs.html)
- [_buttons.scss](./buttons.html)
- [_cards.scss](./cards.html)
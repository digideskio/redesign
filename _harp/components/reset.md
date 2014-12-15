### [`_base/_reset.scss`](https://github.com/OSLC/redesign/blob/gh-pages/_harp/assets/css/_base/_reset.scss)

This is a lightly modified version of [normalize.css](http://necolas.github.io/normalize.css/) by Nicolas Gallagher and Jonathan Neal.

It smooths out many differences in default browser rendering.

Some particular twists I've put on it are the following:

**Using `box-sizing: border-box` for everything**:

~~~
html {
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: inherit;
}
~~~

This sets the box model so that `width` *includes* padding and borders, which makes the math of grids and other things quite a bit easier.

IE7 down won't do this, but you're good to go IE8+.

**Responsive media**

~~~
img, object, embed, iframe {
  max-width: 100% !important;
}

img {
  -ms-interpolation-mode: bicubic; 
  height: auto !important;
}
~~~

Ordinarily I hate hate hate `!important` but it's useful here to override hard-coded `height` and `width` on `<img>` or other media tags.

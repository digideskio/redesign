Use buttons for actions the visitor should take.

Pretty much everything builds off the `.btn` class.

~~~
<a class="btn">A button</a>
~~~

<a class="btn">A button</a>

There are some extension classes for certain varieties:

~~~
<a class="btn primary">Primary thing!</a>

<a class="btn good">Good thing!</a>

<a class="btn bad">Bad thing! :(</a>
~~~

<a class="btn primary">Primary thing!</a> <a class="btn good">Good thing!</a> <a class="btn bad">Bad thing! :(</a>

`class="btn"` can also be applied to `<button>` elements directly, of course.

~~~
<button class="btn">A button</button>
~~~

<button class="btn">A button button</button>


## Action links

In situations where you want to use something that *looks sorta like* a button, but is really *a link* (to a download, elsewhere, etc), I have the `.action` link class and an icon to go with it.

~~~
<a class="action"> 
  <div class="flag reversed">
    <div class="body">Watch at youtube.com</div>
    <div class="image">
      <i class="icon grunticon-action-outgoing"></i>
    </div>
  </div>
</a>
~~~

<div><a class="action"> <div class="flag reversed"><div class="body">Watch at youtube.com</div><div class="image"><i class="icon grunticon-action-outgoing"></i></div></div></a></div>
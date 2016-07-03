### Utilties
#### Low level CSS classes

This concept is based on the work by @jxnblk and @mrmrs on [basscss](http://github.com/basscss) and [tachyons](http://github.com/tachyons-css/).

By default, we include:

```sass
// Utilities
// ========================================

@import lib/clearfix
@import lib/colors
@import lib/icons
@import lib/layout
@import lib/typography
```

You can include a more robust low level css library by adding:

```sass
@import rolodex/settings/utilities/addons
``  `

or if you're using bower:

```sass
@import bower_components/vendor/assets/stylesheets/rolodex/settings/utilities/addons
```

### Utilities

* [Align ](#align)
* [Border](#border)
* [Clearfix](#clearfix)
* [Color](#color)
* [Display](#display)
* [Hide](#hide)
* [Icons](#icons)
* [Layout](#layout)
* [Margin](#margin)
* [Opacity](#opacity)
* [Padding](#padding)
* [Position](#position)
* [Responsive Margin](#responsive-margin)
* [Responsive Padding](#responsive-padding)
* [Typography](#typography)
* [Width](#width)

# Align

Vertical alignment for table layouts

```sass
.align-baseline
.align-top
.align-middle
.align-bottom
```

```html
<div class="overflow-auto">
  <div class="table">
    <div class="table-cell align-baseline">.align-baseline</div>
    <div class="table-cell align-top">.align-top</div>
    <div class="table-cell align-middle">.align-middle</div>
    <div class="table-cell align-bottom">.align-bottom</div>
  </div>
</div>
```

# Border

Default border styling, `1px solid $gray-light`:

```sass
.border
.border-top
.border-right
.border-bottom
.border-left
```

Border states:

```sass
.border--transparent  // border-color: transparent
.border--active       // border-color: $blue
```

No border:

```sass
.b0     // border: 0
.bt-0   // border-top: 0
.br-0   // border-right: 0
.bb-0   // border-bottom: 0
.bl-0   // border-left: 0
```

Border radius, default `$border-radius-base` (6px) and `$border-radius-mini` (4px):

```sass
.circle
.not-rounded

.rounded
.rounded-top
.rounded-right
.rounded-bottom
.rounded-left

.rounded-mini
.rounded-top-mini
.rounded-right-mini
.rounded-bottom-mini
.rounded-left-mini
```


```html
<div class="bg-gray-light rounded">
  <h1 class="px text-center border-bottom">Heading</h1>
</div>
```

# Clearfix

Clearfix classes `.clearfix`, `.group`:

```sass
.clearfix
.group
.clear-left
.clear-right
.clear-both
.clear-none
```

```html
<div class="clearfix">
  <div class="pull-left">left</div>
  <div class="pull-right">right</div>
</div>
```

# Color

Text and background color classes

Text color is `.color-[name]`, and background color is `.bg-[name]`, where `[name]` is from: [settings/variables/colors]().

```html
<div class="bg-slate">
  <h1 class="color-white">White Color</h1>
  <h2 class="bg-purple color-gold">Gold Color</h2>
</div>
```

# Display

Display utility classes:

```sass
.display-none
.display-inline
.display-inline-block
.display-block
.display-table
.display-table-cell
```

```html
<div class="overflow-auto">
  <span class="display-block">Full width</span>
  <div class="display-table">
    <div class="display-table-cell">its a table</div>
    <div class="display-table-cell">a fake table</div>
  </div>
</div>
```

# Hide

Responsive hide classes. Breakpoint for `display: none` based on `@media (min-width: $breakpoint)`.

```sass
.hide
.xs-hide
.sm-hide
.md-hide
.lg-hide
```

```html
<div class="overflow-auto">
  <span class="md-hide">Hidden when bigger than tablet</span>
  <span class="hide">Aggressive hide</span>
</div>
```

# Icons

Helpers for commonly used icons:

```sass
.i-icon
.i-caret
.i-caret-white
```

```html
<i class="i-icon i-custom-icon"></i>
<i class="i-caret"></i>
<i class="i-caret-white"></i>
```

# Layout

Helpers for layout:

```sass
.ir   // Image Replacement
```

Overflow:

```sass
.overflow-hidden
.overflow-scroll
.overflow-auto
```

Floats:

```sass
.float-left
.float-right
.float-none

.pull-left
.pull-right
```

Misc:

```sass
.cursor-pointer
.pointer-none
.user-select-none
```

# Margin

To keep things short, margin classes use a shorthand:

```
  prefixes:
    m   - margin
    mt  - margin top
    mr  - margin right
    mb  - margin bottom
    ml  - margin left
    mx  - x-axis (left and right)
    my  - y-axis (top and bottom)
    mn  - negative
    m0  - zero reset

  modifiers
    -baseline   (ex: mt-large)
    -h          ($gutter-half value, available on left/right/x)

  examples
    mt-base
    mb-x-large
    mr
    mx-small
    ml-h
```

The right side values for this shorthand (mt-`value`), are specified by the [`$baselines`]() variables:

| name | variable | value |
| ---- | -------- | ----- |
| step | $baseline-step | 6px |
| x-small | $baseline-x-small | 12px |
| small | $baseline-small | 18px |
| base | $baseline-base | 24px |
| large | $baseline-large | 30px |
| x-large | $baseline-x-large | 36px |
| xx-large | $baseline-xx-large | 42px |

(so `mt-small` is `margin-top: $baseline-small`)

```html
<div class="mt ml bg-slate">
  <h1 class="color-white text-center my-x-large">Big header</h1>
  <h2 class="mt-base">Sub header</h2>
</div>
```

# Opacity

Values for opacity:

```sass
.o-100
.o-90
.o-80
.o-70
.o-60
.o-50
.o-40
.o-30
.o-20
.o-10
.o-05
.o-025
.o-0
```

# Padding

To keep things short, padding classes use a shorthand (identical to margin):

```
  prefixes:
    p   - padding
    pt  - padding top
    pr  - padding right
    pb  - padding bottom
    pl  - padding left
    px  - x-axis (left and right)
    py  - y-axis (top and bottom)
    pn  - negative
    p0  - zero reset

  modifiers
    -baseline   (ex: mt-large)
    -h          ($gutter-half value, available on left/right/x)

  examples
    pt-base
    pb-x-large
    pr
    px-small
    pl-h
```

The right side values for this shorthand (pt-`value`), are specified by the [`$baselines`]() variables:

| name | variable | value |
| ---- | -------- | ----- |
| step | $baseline-step | 6px |
| x-small | $baseline-x-small | 12px |
| small | $baseline-small | 18px |
| base | $baseline-base | 24px |
| large | $baseline-large | 30px |
| x-large | $baseline-x-large | 36px |
| xx-large | $baseline-xx-large | 42px |

(so `pt-small` is `padding-top: $baseline-small`)

```html
<div class="pt pl bg-slate">
  <h1 class="color-white text-center py-x-large">Big header</h1>
  <h2 class="pt-base">Sub header</h2>
</div>
```

# Position

Utilities for position:

```sass
.position-relative
.position-absolute
.position-fixed
```

Z-indexes:

```sass
.z-100
.z-500
.z-1000
```

Position from [`$baselines`]() variables:

`.top-`

# Responsive Margin
# Responsive Padding
# Typography
# Width


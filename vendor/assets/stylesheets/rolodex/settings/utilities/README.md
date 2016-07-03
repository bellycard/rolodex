### Utilties
#### Low-level CSS classes

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

The new classes can be added by importing:

```sass
@import rolodex/settings/utilities/addons
```

or if you're using Bower:

```sass
@import bower_components/vendor/assets/stylesheets/rolodex/settings/utilities/addons
```

### Utilities

* [Align](#align)
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

# Border

Default border styling, `1px solid $gray-light`

```sass
.border
.border-top
.border-right
.border-bottom
.border-left
```

Border states

```sass
.border--transparent  // border-color: transparent
.border--active       // border-color: $blue
```

No border

```sass
.b0     // border: 0
.bt-0   // border-top: 0
.br-0   // border-right: 0
.bb-0   // border-bottom: 0
.bl-0   // border-left: 0
```

Border radius, default `$border-radius-base` (6px) and mini `$border-radius-mini` (4px)

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

# Clearfix

Clearfix classes `.group`, `.clearfix`

```sass
.group
.clearfix
.clear-left
.clear-right
.clear-both
.clear-none
```

# Color

Text color and background color

```.sass
.color-$color
.bg-$color
```

Where `$color` is from [rolodex/settings/variables/colors](https://github.com/bellycard/rolodex/blob/master/vendor/assets/stylesheets/rolodex/settings/variables/_colors.scss)

# Display

Display utility classes

```sass
.display-none
.display-inline
.display-inline-block
.display-block
.display-table
.display-table-cell
```

# Hide

Responsive visibility classes from [$breakpoints](https://github.com/bellycard/rolodex/blob/master/vendor/assets/stylesheets/rolodex/settings/variables/_layout.scss)

```sass
.hide
.xs-hide
.sm-hide
.md-hide
.lg-hide
```

# Icons

```sass
.i-icon
.i-caret
.i-caret-white
```

# Layout

Overflow

```sass
.overflow-hidden
.overflow-scroll
.overflow-auto
```

Floats

```sass
.float-left
.float-right
.float-none

.pull-left
.pull-right
```

Image replacement

```sass
.ir
```

Cursor

```sass
.cursor-pointer
.pointer-none
.user-select-none
```

# Margin

To keep things short, margin classes use a shorthand

Default top/bottom values are `$baseline-base` (24px)

Default left/right values are `$gutter` (30px)

Prefixes
```sass
 .m-  // margin
.mt-  // margin top
.mr-  // margin right
.mb-  // margin bottom
.ml-  // margin left
.mx-  // x-axis (left and right)
.my-  // y-axis (top and bottom)
.mn-  // negative
.m0-  // zero reset
```

Modifiers
````sass
-$baseline  // $baseline variable
-h          // $gutter-half, available on left/right/x
```

The [`$baseline`](https://github.com/bellycard/rolodex/blob/master/vendor/assets/stylesheets/rolodex/settings/variables/_layout.scss) variables are:

| name | variable | value |
| ---- | -------- | ----- |
| step | `$baseline-step` | 6px |
| x-small | `$baseline-x-small` | 12px |
| small | `$baseline-small` | 18px |
| base | `$baseline-base` | 24px |
| large | `$baseline-large` | 30px |
| x-large | `$baseline-x-large` | 36px |
| xx-large | `$baseline-xx-large` | 42px |

Examples
```sass
.mt-base     // margin-top: $baseline-base
.mb-x-large  // margin-bottom: $baseline-x-large
.mr          // margin-right: $gutter
.mx-small    // margin-left: $baseline-small; margin-right: $baseline-small
.ml-h        // margin-left: $gutter-half
```

# Opacity

Values for opacity

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

To keep things short, padding classes use a shorthand (identical to margin)

Default top/bottom values are `$baseline-base` (24px)

Default left/right values are `$gutter` (30px)

Prefixes
```sass
 .p-  // padding
.pt-  // padding top
.pr-  // padding right
.pb-  // padding bottom
.pl-  // padding left
.px-  // x-axis (left and right)
.py-  // y-axis (top and bottom)
.pn-  // negative
.p0-  // zero reset
```

Modifiers
````sass
-$baseline  // $baseline variable
-h          // $gutter-half, available on left/right/x
```

The [`$baseline`](https://github.com/bellycard/rolodex/blob/master/vendor/assets/stylesheets/rolodex/settings/variables/_layout.scss) variables are:

| name | variable | value |
| ---- | -------- | ----- |
| step | `$baseline-step` | 6px |
| x-small | `$baseline-x-small` | 12px |
| small | `$baseline-small` | 18px |
| base | `$baseline-base` | 24px |
| large | `$baseline-large` | 30px |
| x-large | `$baseline-x-large` | 36px |
| xx-large | `$baseline-xx-large` | 42px |

Examples
```sass
.pt-base     // padding-top: $baseline-base
.pb-x-large  // padding-bottom: $baseline-x-large
.pr          // padding-right: $gutter
.px-small    // padding-left: $baseline-small; padding-right: $baseline-small
.pl-h        // padding-left: $gutter-half
```

# Position

Default top/bottom values are `$baseline-base` (24px)

Default left/right values are `$gutter` (30px)

Prefixes

```sass
.top-
.right-
.bottom-
.left-
```

Modifiers
````sass
-$baseline  // $baseline variable
-h          // $gutter-half, available on left/right/x
```

The [`$baseline`](https://github.com/bellycard/rolodex/blob/master/vendor/assets/stylesheets/rolodex/settings/variables/_layout.scss) variables are:

| name | variable | value |
| ---- | -------- | ----- |
| step | `$baseline-step` | 6px |
| x-small | `$baseline-x-small` | 12px |
| small | `$baseline-small` | 18px |
| base | `$baseline-base` | 24px |
| large | `$baseline-large` | 30px |
| x-large | `$baseline-x-large` | 36px |
| xx-large | `$baseline-xx-large` | 42px |

Examples

```sass
.top-small    // top: $baseline-small
.right-step   // right: $baseline-step
.bottom-base  // bottom: $baseline-base
.left         // left: $gutter
```

Utilities for position

```sass
.position-relative
.position-absolute
.position-fixed
```

z index

```sass
.z-100
.z-500
.z-1000
```

```sass
.fill // top, right, bottom, left: 0
.fit  // max-width: 100%
```

Vertical/horizontal center

```sass
.center-x
.center-y
.center-xy
```

# Typography

Weight

```sass
.font-light
.font-bold
.font-regular
.font-italic
```

Family

```sass
.font-family-open-sans
.font-family-helvetica
.font-family-monospace
```

Alignment

```sass
.text-left
.text-center
.text-right
.text-justify
```

Words

```sass
.nowrap
.break-word
.truncate
```

Spacing

```sass
.tracked
.tracked-tight
.tracked-mega
```

Scale

```sass
.s-giga
.s-mega
.s-alpha
.s-bravo
.s-charlie
.s-delta
.s-echo
.s-foxtrot
.s-golf
.s-hotel
```

Headings

```sass
.h-alpha
.h-bravo
.h-charlie
.h-delta
.h-echo
.h-foxtrot
```

# Width

Max widths from [$breakpoints](https://github.com/bellycard/rolodex/blob/master/vendor/assets/stylesheets/rolodex/settings/variables/_layout.scss)

```sass
.max-width-xs
.max-width-sm
.max-width-md
.max-width-lg
```

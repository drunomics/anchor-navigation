# Anchor Navigation

## Table of contents

  * [Overview](#overview)
  * [Usage](#usage)
  * [Setup](#setup)
    * [1. Attaching anchors to paragraphs](#1-attaching-anchors-to-paragraphs)
    * [2. Configuring content types](#2-configuring-content-types)
    * [3. Positioning the anchor](#3-positioning-the-anchor)
    * [4. Styling and setting up the navigation display](#4-styling-and-setting-up-the-navigation-display)
    * [5. Injecting social icons](#5-injecting-social-icons)

## Overview

The anchor navigation is a plugin to create a table of contents menu out of the
paragraph headlines from a node.

## Usage

When enabled, the editor can select a checkbox to trigger the creation of the
table of contents for the node. The table of contents will be saved in a text-
field and can be edited. The editor can change the label or remove entries
individually.

After paragraphs are added or modified, the table of content generation must
be triggered again by selecting the checkbox for it.

The element will only be rendered if the table of contents is not empty.

## Setup

### 1. Attaching anchors to paragraphs

Add the `Anchor`-field to the paragraphs types which should provide an anchor
for the anchor navigation. The anchor form will show up only if the content
type also has the anchor navigation field attached to it (see below).

You can setup a fallback field which will be used for the anchor label if
the anchor label is not filled out for a specific paragraph.

Make sure the field is positioned at the beginning of the paragraph in their
respective viewmodes.

### 2. Configuring content types 

Add the `Anchor navigation`-field to the content types which should display
the navigation.

The `Anchor`-fields (and their form) will only be rendered if a content type
has the anchor navigation attached to it.

Setup the form display & display mode for the `Anchor navigation`-field:

In the field formatter, there is the option to either render the field as a
field or as a block. 
Selecting field will position it as configured in the entity viewmode. 
Alternatively when selecting block, add the `Anchor navigation`-block in the 
block layout to position the element.
Either way, the field must be added to the viewmode on which it should be 
rendered (even if block rendering is selected).

### 3. Positioning the anchor

Depending on your styling and media queries you have to move the anchor so
that the navigation jumps to the correct position.

Here an example which moves the anchor up to account for the drupal 8 toolbar:

```css
 .anchor-navigation__anchor {
   position: relative;
   top: -70px;
 }

 body.toolbar-fixed .anchor-navigation__anchor {
    top: -110px;
 }

 body.toolbar-fixed.toolbar-tray-open.toolbar-horizontal  .anchor-navigation__anchor {
   top: -150px;
 }
```

### 4. Styling and setting up the navigation display

Update anchor_navigation.settings.yml to setup the display

`breakpoints` Array of objects
You can set any number of breakpoints and for each breakpoints
- `breakpointUp` integer
The pixel value *from* which the breakpoint starts
- `display` String [fixed|sticky]
Which display variant to use while the breakpoint is active.

`highlightColor` String
Any valid css color value, will be set as the color for the navigation,
be default affects only the icons color.

`displaySettings` For each display variant ('sticky' or 'fixed') you can set:
- `offset`: integer
The pixel value of the distance from the window 
(top edge for sticky, bottom for fixed)
- `limitToParent`: boolean
Wether or not the navigation should not follow the window on scroll
past the parent element of where it's inserted.

Example:
```yaml
breakpoints:
  -
    breakpointUp: 0
    display: fixed
  - 
    breakpointUp: 900
    display: sticky
highlightColor: '#e4003a'
displaySettings:
  sticky:
    offset: 110
    limitToParent: true
  fixed:
    offset: 100
    limitToParent: true
```

### 5. Injecting social icons

There is a menu reserved for the social icons which is hidden by default. If you
have social icons on your page, you can attach them to the anchor navigation by
setting the `social_icons`-variable via preprocess hook, e.g.: 
`YOUR_MODULE_preprocess_anchor_navigation()`.

Make sure to style the icons for both the fixed and sticky variant.

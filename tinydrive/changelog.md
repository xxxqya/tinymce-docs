---
layout: default
title: Tiny Drive Changelog
title_nav: Changelog
description: The history of Tiny Drive releases.
keywords: changelog
class: changelog
---

{% capture changelog %}

## Version 1.2.1 (2019-04-24)
  * Added new dropbox/google drive icons.
  * Fixed an issue where file selection wouldn't be cleared when navigating to a new directory.
  * Fixed various focus issues where focus would be lost or moved incorrectly.
  * Fixed various async issues with the ui not being updated correctly.
  * Fixed an issue where it would scroll the file list to top if new files where added while scrolling.

## Version 1.2.0 (2019-03-28)
  * Added new google drive and dropbox file pickers
  * Improved file type listing support when picking files in tinymce
  * Improved alert messages when deleting folders
  * Improved handling of invalid file types in local file pickers and drag drop
  * Fixed an issue where concurrent async list operations could result in duplicate files
  * Fixed an issue where it wasn't possible to upload some file extension mp4, m4v, keynote, csv

## Version 1.1.0 (2018-11-26)
  * Added setting to allow user specific root through JWT payload
  * Fixed issue where backdrop wasn't displayed for preview menu

## Version 1.0.0 (2018-09-18)
  * Initial release

{% endcapture %}

{{ changelog | pretty_changelog }}

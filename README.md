# atom-ignore package

> Use a .atomignore file to hide files & folder in tree view and fuzzy finder

* * *

## Feature

Sometimes, you want to hide some files & folders from the tree view. With Atom, you can make it globally, or for each project, *via* the `gitignore` file.  
But... if you don't want to hide file globally, or ignore them in your repo ?

Use an `.atomignore` file in your projects !

It works like a regular `.gitignore` file, but only hides the files & folders in your Atom view.


## Usage

Simply add an `.atomignore` file in your project.

You can also control the state of hiding by using `atom-ignore:toggle`, `atom-ignore:enable` & `atom-ignore:disable` commands.

## Keybindings

With the success of Atom, it's really difficult to choose keybindings that will not enter in conflict whit anyone else's packages, so I have removed the default keystrokes and let the keymap empty to let you set your own keybindings.


## Caveats

This package uses a key hook built into the default Atom packages TreeView, FuzzyFinder, and Find-and-Replace and for 'ignoring vcs'. For this package to work, you need to have "Exclude VCS Ignored Paths" set to true, and there has to be a valid git repo associated with the project that has the .atomignore. It doesn't work for random folders that aren't tracked by git (sorry, it's the only hook we could find!)

Atom core **needs** better hooks to allow for useful packages like this one. Please log issues here:
- https://github.com/atom/fuzzy-finder/issues
- https://github.com/atom/tree-view/issues
- https://github.com/atom/find-and-replace/issues

If all 3 of these packages gave us a project specific config that would exclude items, then everyone's life would be a lot easier!




## Forked from atom-tree-ignore

https://github.com/leny/atom-tree-ignore

"use babel";
// sourceType: module

import { CompositeDisposable } from "atom";

let oPackageConfig,
    fActivate, fDeactivate,
    _oDisposables, _oAtomIgnoreFileDisposables,
    _bIsWindowsPlatform = document.body.classList.contains( "platform-win32" ),
    _oAtomIgnoreFiles,
    _fUpdate, _fApply, _fProjectChangedPaths, _fGetCurrentState,
    _fAddAtomIgnoreFiles, _fNormalizePath;


let iAmChangingIgnoredNames = false;

let originalIgnoredNames = [];

let changeIgnoredNames = function(newArray) {
  iAmChangingIgnoredNames = true;
  let isEnabled = _fGetCurrentState();
  if(isEnabled) {
    atom.config.set('core.ignoredNames', newArray);
  }
  else {
    atom.config.set('core.ignoredNames', originalIgnoredNames);
  }
}

let processIgnoreFile = function(contents) {
  // console.log("[ATOM-IGNORE] processing contents", contents);

  let lines = contents.split("\n").filter((i) => { return !!i; });

  // add original ignored names
  lines = lines.concat(originalIgnoredNames);

  // unique
  lines = [ ...new Set(lines) ]

  // console.log("[ATOM-IGNORE] lines: ", lines);

  changeIgnoredNames(lines);
};

oPackageConfig = {
    "enabled": {
        "type": "boolean",
        "default": true
    },
    "ignoreFileName": {
        "type": "string",
        "default": ".atomignore"
    }
};

fActivate = function() {
    console.log("[ATOM-IGNORE] Activating")

    originalIgnoredNames = atom.config.get("core.ignoredNames");

    _oDisposables && _oDisposables.dispose();
    _oDisposables = new CompositeDisposable();

    _oDisposables.add( atom.commands.add( "atom-workspace", {
        "atom-ignore:toggle": () => {
            _fApply( !atom.config.get( "atom-ignore.enabled" ) );
        },
        "atom-ignore:enable": _fApply.bind( null, true ),
        "atom-ignore:disable": _fApply.bind( null, false )
    } ) );

    _oDisposables.add( atom.commands.add( ".platform-win32, .platform-linux, .platform-darwin", {
        "tree-view:toggle": _fUpdate.bind( null )
    } ) );


    atom.packages.onDidActivateInitialPackages( () => {
        _oDisposables.add( atom.project.onDidChangePaths( _fProjectChangedPaths ) );

        _fProjectChangedPaths();

        atom.config.observe("core.ignoredNames", (newIgnoredNames) => {
          if(!iAmChangingIgnoredNames){
            console.log("[ATOM-IGNORE] atom changed core.ignoredNames");
            originalIgnoredNames = newIgnoredNames;
          }

          // reset it back to false
          iAmChangingIgnoredNames = false;
        });

        atom.config.observe( "atom-ignore.enabled", ( bNewValue ) => {
            if ( bNewValue !== atom.config.get( "atom-ignore.enabled" ) ) {
                _fApply( bNewValue );
            }
        } );

        _fUpdate();
    } );
};

fDeactivate = function() {
    _oDisposables && _oDisposables.dispose();
    _oAtomIgnoreFileDisposables && _oAtomIgnoreFileDisposables.dispose();
};

_fGetCurrentState = function() {
    return atom.config.get( "atom-ignore.enabled" );
};

_fApply = function( bValue ) {
    atom.config.set( "atom-ignore.enabled", bValue );
    _fUpdate();
};

_fUpdate = function() {
    let oIgnore,
        oIgnoredItems = {},
        sProjectRoot = "",
        bHandleProject;

  // TODO: update atom.config.get('core.ignoredNames')
  // console.log("[ATOM-IGNORE] UPDATING", _oAtomIgnoreFiles)

  Object.keys(_oAtomIgnoreFiles).forEach((key) => {
    let file = _oAtomIgnoreFiles[key];
    file.read().then((val) => {
      processIgnoreFile(val);
    });
  })
};

_fProjectChangedPaths = function() {
    _fAddAtomIgnoreFiles();
    _fUpdate();
};

_fAddAtomIgnoreFiles = function() {
    let sIgnoreFileName = atom.config.get( "atom-ignore.ignoreFileName" );

    _oAtomIgnoreFileDisposables && _oAtomIgnoreFileDisposables.dispose();
    _oAtomIgnoreFileDisposables = new CompositeDisposable();
    _oAtomIgnoreFiles = {};

    atom.project.getDirectories().forEach( ( oDirectory ) => {
        let oIgnoreFile = oDirectory.getFile( sIgnoreFileName );
        _oAtomIgnoreFiles[ _fNormalizePath( `${ oDirectory.getPath() }/` ) ] = oIgnoreFile;
        _oAtomIgnoreFileDisposables.add( oIgnoreFile.onDidChange( _fUpdate ) );
    } );
};

_fNormalizePath = function( sPath ) {
    if ( _bIsWindowsPlatform ) {
        return sPath.replace( /\\/g, "/" );
    }
    return sPath;
};



export {
    oPackageConfig as config,
    fActivate as activate,
    fDeactivate as deactivate
};

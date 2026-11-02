/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/* Colour theme. Pages are light by default, and stay light without this script. It maps the reader's choice onto
   Bootstrap's colour modes (data-bs-theme on <html>): Light, Dark, or Auto, which follows the OS colour scheme.
   darkThemeEnabled makes Auto the default (data-fluido-theme="auto" on <html>). The choice is kept in localStorage.
   Loaded in <head>, so a stored choice applies before the first paint. It shows the switch that site.vm puts,
   hidden, at the top of the menu: one button per mode. Plain ES5. */
( function() {
    var KEY = 'fluido-theme';
    var MODES = [ 'light', 'dark', 'auto' ];
    var root = document.documentElement;
    var osDark = window.matchMedia ? window.matchMedia( '(prefers-color-scheme: dark)' ) : null;
    var fallback = root.getAttribute( 'data-fluido-theme' ) === 'auto' ? 'auto' : 'light';

    function stored() {
        try {
            var mode = localStorage.getItem( KEY );
            return MODES.indexOf( mode ) >= 0 ? mode : fallback;
        } catch ( e ) {
            return fallback; // storage blocked
        }
    }

    var current = stored();

    function apply() {
        var dark = current === 'dark' || ( current === 'auto' && osDark !== null && osDark.matches );
        root.setAttribute( 'data-bs-theme', dark ? 'dark' : 'light' );
    }

    apply();
    if ( osDark ) {
        if ( osDark.addEventListener ) {
            osDark.addEventListener( 'change', apply );
        } else if ( osDark.addListener ) {
            osDark.addListener( apply );
        }
    }

    // the page carries the switch (three buttons), hidden until this script can make it work
    document.addEventListener( 'DOMContentLoaded', function() {
        var group = document.querySelector( '.theme-switch' );
        if ( !group ) {
            return;
        }
        var buttons = group.querySelectorAll( '[data-fluido-theme-value]' );
        function mark() {
            for ( var i = 0; i < buttons.length; i++ ) {
                var on = buttons[ i ].getAttribute( 'data-fluido-theme-value' ) === current;
                buttons[ i ].setAttribute( 'aria-pressed', on ? 'true' : 'false' );
                buttons[ i ].className = buttons[ i ].className.replace( /\s*\bactive\b/g, '' ) + ( on ? ' active' : '' );
            }
        }
        function choose() {
            current = this.getAttribute( 'data-fluido-theme-value' );
            try {
                localStorage.setItem( KEY, current );
            } catch ( e ) {
                // not stored: the choice lasts for this page only
            }
            apply();
            mark();
        }
        for ( var i = 0; i < buttons.length; i++ ) {
            buttons[ i ].addEventListener( 'click', choose );
        }
        mark();
        group.hidden = false;
    } );
} )();

!function(o,n){var e=0,t=[],l=function(o,n){t.push([o,n])},r=function(){for(var o=t.splice(0,t.length),n=o.length,e=0;e<n;e++)o[e][0].apply(null,o[e][1])},a=!1,c=[],f=[],i={},s={},d=function(n,t,r){if(!1!==t&&t instanceof Array&&0!==t.length){for(var a=!0,v=!1,p=!1,g=t.length,y=0;y<g;y++)if(f&&f[t[y]]){for(var b=f[t[y]].length,h=0;h<b;h++)if(void 0===i[f[t[y]][h]]){a=!1,v=f[t[y]][h],p=t[y];break}if(!a)break}else if(void 0===i[t[y]]){a=!1,v=t[y];break}if(!1===a)if(0===e){for(var j=[],g=t.length,y=0;y<g;y++)j.push(c[t[y]]||t[y]);console.error("Abtf.js() ➤ dependency unmet and no more scripts loading",(c[v]||v)+(c[p]?" ("+c[p]+")":""),n,j),r()}else{if(void 0===s[n+":"+v]){s[n+":"+v]=!0;for(var j=[],g=t.length,y=0;y<g;y++)j.push(c[t[y]]||t[y]);console.info("Abtf.js() ➤ wait for dependency",(c[v]||v)+(c[p]?" ("+c[p]+")":""),n,j)}void 0!==o.pcs&&o.pcs(u(n)),l(d,[n,t,r])}else r()}else r()},u=function(o){var n=document.createElement("a");return n.href=o,n.href},v=function(n,e,t){"function"!=typeof t&&(t=function(){}),void 0!==o.lcs?o.lcs(n,e,t):(o.ls(n,e),t())};o.j=function(n){if(console.log(n),"object"==typeof n&&void 0!==n[0]&&n[0]){void 0!==o.proxy&&o.proxy.js&&(o.mls=!0);var t=n[0];if(console.log(t),!1===n[1]?a=!1:(a=!0,f=n[1]&&"object"==typeof n[1]?n[1]:[]),c=n[2]&&n[2]instanceof Array?n[2]:[]){if(f){var l=[];for(var s in f)f.hasOwnProperty(s)&&l.push(c[s])}else l=!1;console.log("Abtf.js() ➤ abide dependencies",c,l)}var p=function(n){if(void 0!==t[n])if("object"==typeof t[n]){var l=t[n],f=l[0],s=!!l[1],g=void 0!==l[2]&&l[2],y=!!l[3]&&l[3],b=function(n,t,l,a,f){var s=[];if(a.length>0)for(var d=a.length,g=0;g<d;g++)s.push(c[a[g]]||a[g]);e++,v(u(n),function(d){a.length>0?d?console.info("Abtf.js() ➤ localStorage loaded",o.localUrl(n),c[l]||l,s,"➤",d):console.info("Abtf.js() ➤ loaded",o.localUrl(n),c[l]||l,s):d?console.info("Abtf.js() ➤ localStorage loaded",o.localUrl(n),"➤",d):console.info("Abtf.js() ➤ loaded",o.localUrl(n)),e--,!1!==l&&(i[l]=!0),r(),t||p(++f)},function(e){a.length>0?e?console.info("Abtf.js() ➤ localStorage "+(t?"async ":"")+"load start",o.localUrl(n),"➤",e,c[l]||l,s):console.info("Abtf.js() ➤ "+(t?"async ":"")+"download start",o.localUrl(n),c[l]||l,s):e?console.info("Abtf.js() ➤ localStorage "+(t?"async ":"")+"load start",o.localUrl(n),"➤",e):console.info("Abtf.js() ➤ "+(t?"async ":"")+"download start",o.localUrl(n))})};a&&y?d(f,y,function(){b(f,s,g,y,n)}):b(f,s,g,y,n),s&&p(++n)}else console.error("Abtf.js()","Invalid Javascript file configuration",n,t)};console.log("start s"),p(0)}},o.osl=l}(window.Abtf,Object),function(o){var n={},e=0,t=function(o){var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(o,n)};o.mls=!1,o.ls=function(l,r){var a=document.createElement("script");o.mls&&a.setAttribute("rel","abtf");var c,f,i=!1,s=function(){i||(i=!0,f(),r&&r(c))},d=function(){c=new Error(l||"EMPTY"),s()};if(!a.readyState||"async"in a)f=function(){a.onload=a.onerror=null},a.onerror=d,a.onload=s,a.async=!0,a.charset="utf-8",a.src=l,t(a);else{var u=e++,v={loaded:!0,complete:!0},p=!1;f=function(){a.onreadystatechange=a.onerror=null,n[u]=void 0},a.onreadystatechange=function(){var o=a.readyState;if(!c){if(!p&&v[o]&&(p=!0,t(a)),"loaded"===o&&(a.children,"loading"===a.readyState))return d();"complete"===a.readyState&&s()}},a.onerror=d,n[u]=a,a.src=l}}}(window.Abtf);
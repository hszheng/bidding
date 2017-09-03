/*
 * imgBox - jQuery Plugin
 * Yet another lightbox alternative
 *
 * Copyright (c) 2009 jQueryGlobe
 * Examples and documentation at: http://jqueryglobe.com/article/imgbox/
 * 
 * Version: 1.0.0 (21/10/2009)
 * Requires: jQuery v1.3+
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

eval(function (p, a, c, k, e, r) {
    e = function (c) {
        return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    };
    if (!''.replace(/^/, String)) {
        while (c--) r[e(c)] = k[c] || e(c);
        k = [function (e) {
            return r[e]
        }];
        e = function () {
            return '\\w+'
        };
        c = 1
    };
    while (c--)
        if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p
}(';(r($){$.18.1o=r(){K I.1I(r(){v b=$(I).m(\'1J\');q(b.2k(/^2l\\(["\']?(.*\\.2m)["\']?\\)$/i)){b=2n.$1;$(I).m({\'1J\':\'2o\',\'1K\':"2p:2q.2r.2s(2t=P, 2u="+($(I).m(\'2v\')==\'2w-2x\'?\'2y\':\'2z\')+", 19=\'"+b+"\')"}).1I(r(){v a=$(I).m(\'1p\');q(a!=\'2A\'&&a!=\'1L\')$(I).m(\'1p\',\'1L\')})}})};v g,8,L,A,u,Q=F,h,G=Z,H=0,C=20,B=20,11=$.1M($(\'<t/>\')[0],{12:0});$.18.6=r(a){K I.V(\'13.1N\').1q(\'13.1N\',r(){$.6($(I),a);K F})};$.6=r(e,o){q(Q){K F}g=e;8=$.1M({},$.18.6.1O,o);h=1P.R(g[0]);q($(\'#6-x-\'+h).1r){1s();K F}1a();q(8.W){$(\'#6-X\').V().1b().1Q().m({\'9\':$(1c).9(),\'S\':8.1R}).14()}L=2B 2C;L.19=$(g).1S(\'1T\');q(L.1t==F){1U();$(L).V().2D(\'2E\',r(){1a();1u()})}T{1u()}};$.18.6.1O={y:10,1V:\'2F\',1W:P,1v:P,1d:1X,1w:1X,1x:\'1Y\',2G:\'1Y\',1y:F,W:F,1R:0.5,1z:P,1Z:P};r 1u(){Q=P;q(8.1W==F){$(\'.6-x\').Y();$(\'.6-p-x\').Y()}T{G=G+2}u=21();v a=$(g).1S(\'15\')||\'\';$(\'<t U="6-x-\'+h+\'" D="6-x"></t>\').m({\'z-M\':G,\'y\':8.y}).1A(\'<O D="6-O" U="6-O-\'+h+\'" 19="\'+L.19+\'" 2H="\'+a+\'" />\').1e(\'1f\');$(\'<t U="6-p-\'+h+\'" D="6-p-x"><t D="6-p 6-p-n"/><t D="6-p 6-p-2I"/><t D="6-p 6-p-e"/><t D="6-p 6-p-2J"/><t D="6-p 6-p-s"/><t D="6-p 6-p-2K"/><t D="6-p 6-p-w"/><t D="6-p 6-p-2L"/></t>\').1e(\'1f\');q($.16.1B&&1g($.16.22.23(0,1))<7){$(\'#6-p-\'+h).1h(\'.6-p\').1o()}H=0;q(a.1r>0){$(\'<t U="6-1C" D="6-15" />\').2M(a).m(\'j\',u.j).1e(\'1f\');H=$(\'#6-1C\').2N();u.9+=H;u.k-=H>B+C?B:B*0.5;$(\'#6-1C\').Y();$(\'#6-x-\'+h).1A(\'<t D="6-15">\'+a+\'</t>\')}q(8.1d>0){v b=17();A={k:b.k-8.y,l:b.l-8.y,j:b.j,9:b.9};$(\'#6-x-\'+h).m(A).14();$(\'#6-p-\'+h).m({k:A.k,l:A.l,j:A.j+(8.y*2),9:A.9+(8.y*2),\'z-M\':G-1}).14();q(8.1y){u.S=1}11.12=0;$(11).24({12:1},{25:8.1d,26:8.1x,27:1D,1t:1E})}T{$(\'#6-O-\'+h).m(\'9\',(u.9-H)+\'J\');$(\'#6-x-\'+h).m(u).28(\'29\',1E);$(\'#6-p-\'+h).m({k:u.k,l:u.l,j:u.j+(8.y*2),9:u.9+(8.y*2),\'z-M\':G-1}).28(\'29\')}};r 1D(a){v b=E.N(A.j+(u.j-A.j)*a);v c=E.N(A.9+(u.9-A.9)*a);v d=E.N(A.k+(u.k-A.k)*a);v e=E.N(A.l+(u.l-A.l)*a);$(\'#6-x-\'+h).m({\'j\':b+\'J\',\'9\':c+\'J\',\'k\':d+\'J\',\'l\':e+\'J\'});$(\'#6-p-\'+h).m({\'j\':E.N(b+8.y*2)+\'J\',\'9\':E.N(c+8.y*2)+\'J\',\'k\':d+\'J\',\'l\':e+\'J\'});$(\'#6-O-\'+h).m(\'9\',E.N(c-((((c-E.1i(A.9,u.9))*2a)/(E.2O(A.9-u.9,u.9-A.9))*H/2a)))+\'J\');q(2P u.S!==\'2Q\'){v f=a<0.3?0.3:a;$(\'#6-x-\'+h).m(\'S\',f);q($.16.1B==F){$(\'#6-p-\'+h).m(\'S\',f)}}};r 1E(){q(8.W&&8.1z){$(\'#6-X\').1q(\'13\',{1F:g,h:h,8:8,H:H},1G)}$(\'#6-x-\'+h).m(\'1K\',\'\').1q(\'13\',{1F:g,h:h,8:8,H:H},1G).1A(\'<a 1T="2R:;" D="6-1j"></a>\').2b(\'.6-15\').14();q($.16.1B&&1g($.16.22.23(0,1))<7){$(\'#6-x-\'+h).1h(\'.6-1j\').1o()}Q=F};r 1G(e){e.2S();q(e.1H.2c==\'6-1j\'||(e.R.8.1z&&e.1H.U==\'6-X\')||(e.R.8.1Z&&e.1H.2c==\'6-O\'&&($(I).m(\'z-M\')==G||$(\'.6-O\').1r==1))){g=e.R.1F;h=e.R.h;8=e.R.8;H=e.R.H;1s()}T q($(I).m(\'z-M\')<G){$(I).2T(\'.6-p-x\').m(\'z-M\',++G);$(I).m(\'z-M\',++G)}};r 1s(){q(Q){K F}Q=P;$(\'#6-x-\'+h).2b(\'.6-1j, .6-15\').Y();q(8.1w>0){v a=17();A={k:a.k-8.y,l:a.l-8.y,j:a.j,9:a.9};v a=$(\'#6-x-\'+h).1p();u={k:a.k,l:a.l,j:$(\'#6-x-\'+h).j(),9:$(\'#6-x-\'+h).9()};q(8.1y){u.S=0}2U(r(){$(\'#6-x-\'+h).m(\'z-M\',Z);$(\'#6-p-\'+h).m(\'z-M\',Z)},8.1w*0.5);11.12=1;$(11).24({12:0},{25:8.1d,26:8.1x,27:1D,1t:1k})}T{q(8.W){1k()}T{$(\'#6-p-\'+h).1l(\'2d\');$(\'#6-x-\'+h).1l(\'2d\',1k)}}};r 1k(){$(\'#6-p-\'+h).1b().Y();$(\'#6-x-\'+h).Y();G=G>Z?G-2:Z;q(8.W){$(\'#6-X\').V().1b().1l(2e)}Q=F};r 21(){v a=2f();v b={j:L.j,9:L.9};v c=(8.y+C+B)*2;v d=(8.y+C+B)*2;q(8.1v&&(b.j>(a[0]-c)||b.9>(a[1]-d))){v e=E.1i(E.1i(a[0]-c,b.j)/b.j,E.1i(a[1]-d,b.9)/b.9);b.j=E.N(e*b.j);b.9=E.N(e*b.9)}q(8.1V==\'2V\'){b.k=a[3]+((a[1]-b.9-8.y*2)*0.5);b.l=a[2]+((a[0]-b.j-8.y*2)*0.5)}T{v f=17();b.k=f.k-((b.9-f.9)*0.5)-8.y;b.l=f.l-((b.j-f.j)*0.5)-8.y;b.k=b.k>a[3]+B+C?b.k:a[3]+B+C;b.l=b.l>a[2]+B+C?b.l:a[2]+B+C;b.k=b.k>a[1]+a[3]-(b.9+d)?a[1]+a[3]-(b.9+(B+C+8.y*2)):b.k;b.l=b.l>a[0]+a[2]-(b.j+c)?a[0]+a[2]-(b.j+(B+C+8.y*2)):b.l}q(8.1v==F){b.k=b.k>a[3]+C+B?b.k:a[3]+C+B;b.l=b.l>a[2]+C+B?b.l:a[2]+C+B}b.k=1g(b.k);b.l=1g(b.l);K b};r 2f(){K[$(2g).j(),$(2g).9(),$(1c).2W(),$(1c).2X()]};r 17(){v a=$(g).1h(\'O\').2Y(0);v b=a.2Z();b.k+=1m(a.m(\'30\'));b.l+=1m(a.m(\'31\'));b.k+=1m(a.m(\'2h-k-j\'));b.l+=1m(a.m(\'2h-l-j\'));b.j=a.j();b.9=a.9();K b};r 1U(){v a=17(g);$(\'#6-1n\').m(a).14()};r 1a(){$(L).V();$(\'#6-1n\').1Q()};r 2i(){1a();q(8.W){$(\'#6-X\').V().1b().1l(2e)}};r 2j(){$(\'<t U="6-1n"><t></t></t><t U="6-X"></t>\').1e(\'1f\');$(\'#6-1n\').13(2i).1h(\'t\').m(\'S\',0.4)};$(1c).32(r(){2j()})})(1P);', 62, 189, '||||||imgbox||opts|height||||||||nr||width|top|left|css|||bg|if|function||div|final_pos|var||wrap|padding||orig_pos|margin|shadow|class|Math|false|zindex|titleh|this|px|return|preloader|index|round|img|true|busy|data|opacity|else|id|unbind|overlayShow|overlay|remove|90||fx|prop|click|show|title|browser|getThumbPos|fn|src|hideActivity|stop|document|speedIn|appendTo|body|parseInt|find|min|close|_clean_up|fadeOut|parseFloat|loading|fixPNG|position|bind|length|zoomOut|complete|zoomIn|autoScale|speedOut|easingIn|zoomOpacity|hideOnOverlayClick|append|msie|tmp|draw|_finish|elem|clickHandler|target|each|backgroundImage|filter|relative|extend|pb|defaults|jQuery|hide|overlayOpacity|attr|href|showActivity|alignment|allowMultiple|500|swing|hideOnContentClick||getZoomTo|version|substr|animate|duration|easing|step|fadeIn|normal|100|children|className|fast|200|getViewport|window|border|cancelLoading|init|match|url|png|RegExp|none|progid|DXImageTransform|Microsoft|AlphaImageLoader|enabled|sizingMethod|backgroundRepeat|no|repeat|crop|scale|absolute|new|Image|one|load|auto|easingOut|alt|ne|se|sw|nw|html|outerHeight|max|typeof|undefined|javascript|stopPropagation|next|setTimeout|center|scrollLeft|scrollTop|eq|offset|paddingTop|paddingLeft|ready'.split('|'), 0, {}))

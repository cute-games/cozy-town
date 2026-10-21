# Run 4 finish, pass 17 M-001: the bus-stop view in October with and without the holiday pieces (HOL.g hidden), to tell what the white zig-zag on the shelter's roof is
BUS = "(()=>{closePanel();__goto('city');__setClock(null,11.5);wxForce('sunny');P.x=-14.5;P.z=2.0;P.yaw=Math.atan2(-(-16.2-P.x),-(9.6-P.z));P.pitch=.05;})()"
HIDE = "(()=>{if(HOL.g)HOL.g.visible=false;return 'holiday group hidden: '+!!HOL.g;})()"
VIEWS = [('bus-with', BUS), ('bus-without', HIDE)]

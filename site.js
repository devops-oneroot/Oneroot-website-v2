(function(){
  function tick(){
    var now=new Date();
    document.querySelectorAll('[data-clock]').forEach(function(el){
      try{el.textContent=now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:el.getAttribute('data-clock')});}catch(e){}
    });
    var days=Math.ceil((Date.UTC(2027,0,14,18,30)-now.getTime())/86400000);
    var st=days>1?'T-minus '+days+' days to opening':(days===1?'Opens tomorrow':'Open now. Come in.');
    document.querySelectorAll('[data-store-status]').forEach(function(el){el.textContent=st;});
  }
  tick(); setInterval(tick,20000);
  var views=window.STORE_VIEWS, img=document.getElementById('viewImg'), note=document.getElementById('viewNote');
  if(views&&img){
    document.querySelectorAll('[data-view]').forEach(function(b){
      b.addEventListener('click',function(){
        var v=views[+b.getAttribute('data-view')];
        img.src=v.src; img.alt=v.alt; if(note) note.textContent=v.note;
        document.querySelectorAll('[data-view]').forEach(function(o){
          var on=o===b; o.setAttribute('aria-pressed',on?'true':'false');
          o.style.background=on?'#212721':'transparent'; o.style.color=on?'#FFFFFF':'#212721';
        });
      });
    });
  }
  var f=document.getElementById('brandForm');
  if(f){f.addEventListener('submit',function(e){
    e.preventDefault(); var d=new FormData(f);
    var body='Company: '+(d.get('company')||'')+'\nName: '+(d.get('name')||'')+'\nPhone: '+(d.get('phone')||'')+'\nCategory: '+(d.get('category')||'')+'\n\n'+(d.get('message')||'');
    location.href='mailto:info@oneroot.farm?subject='+encodeURIComponent('Brand enquiry: '+(d.get('company')||''))+'&body='+encodeURIComponent(body);
  });}
})();

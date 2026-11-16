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
    var btns=[].slice.call(document.querySelectorAll('[data-view]')), cur=0, timer=null, paused=false;
    views.forEach(function(v){var p=new Image(); p.src=v.src;});
    img.style.transition='opacity .4s';
    function show(i){
      cur=i; var v=views[i];
      img.style.opacity='0';
      setTimeout(function(){img.src=v.src; img.alt=v.alt; if(note) note.textContent=v.note; img.style.opacity='1';},200);
      btns.forEach(function(o){
        var on=+o.getAttribute('data-view')===i; o.setAttribute('aria-pressed',on?'true':'false');
        o.style.background=on?'#212721':'transparent'; o.style.color=on?'#FFFFFF':'#212721';
      });
    }
    function next(){
      if(paused||document.hidden||views.length<2) return;
      var i; do{i=Math.floor(Math.random()*views.length);}while(i===cur);
      show(i);
    }
    function restart(){clearInterval(timer); timer=setInterval(next,4000);}
    btns.forEach(function(b){
      b.addEventListener('click',function(){show(+b.getAttribute('data-view')); restart();});
    });
    var box=img.parentNode;
    box.addEventListener('mouseenter',function(){paused=true;});
    box.addEventListener('mouseleave',function(){paused=false;});
    restart();
  }
  var f=document.getElementById('brandForm');
  if(f){
    var ph=f.elements.phone, nm=f.elements.name;
    if(ph){
      ph.addEventListener('input',function(){
        var c=ph.value.replace(/\D/g,'').slice(0,10); if(c!==ph.value) ph.value=c;
        ph.setCustomValidity('');
      });
      ph.addEventListener('invalid',function(){
        ph.setCustomValidity(ph.value?'Phone number must be exactly 10 digits.':'Please enter your phone number.');
      });
    }
    if(nm){
      nm.addEventListener('input',function(){nm.setCustomValidity('');});
      nm.addEventListener('invalid',function(){
        nm.setCustomValidity(nm.value?'Name can be at most 50 characters.':'Please enter your name.');
      });
    }
    var clr=document.getElementById('brandClear'), st=document.getElementById('brandStatus');
    function filled(){
      return [].some.call(f.elements,function(el){
        if(el.tagName==='SELECT') return el.selectedIndex>0;
        return (el.tagName==='INPUT'||el.tagName==='TEXTAREA')&&el.value.trim()!=='';
      });
    }
    function syncClear(){if(clr) clr.hidden=!filled();}
    f.addEventListener('input',syncClear);
    f.addEventListener('change',syncClear);
    if(clr) clr.addEventListener('click',function(){
      f.reset();
      [].forEach.call(f.elements,function(el){if(el.setCustomValidity) el.setCustomValidity('');});
      if(st) st.textContent='';
      clr.hidden=true;
    });
    syncClear();
  }
  if(f){f.addEventListener('submit',function(e){
    e.preventDefault(); var d=new FormData(f);
    var to='procurement@oneroot.farm', status=document.getElementById('brandStatus');
    function v(k){return (d.get(k)||'').toString().trim();}
    var subject='Brand enquiry for the oneroot store: '+v('company');
    var body=[
      'Hello oneroot team,',
      '',
      'We would like to sell our products in the oneroot store in Chamarajanagar.',
      '',
      'Company: '+v('company'),
      'Name: '+v('name'),
      'Phone: '+v('phone'),
      'Category: '+v('category'),
      '',
      'What we make:',
      v('message')||'-',
      '',
      'Please call us to discuss.',
      '',
      'Thanks,',
      v('name'),
      v('company')
    ].join('\n');
    var mobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if(mobile){
      // Opens the phone's mail app (Gmail if that is the default).
      location.href='mailto:'+to+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    }else{
      // Opens Gmail on the web with the email ready to send.
      var url='https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(to)+'&su='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
      var w=window.open(url,'_blank');
      if(w){try{w.opener=null;}catch(x){}}else{location.href=url;}
    }
    if(status){status.textContent='Your email is ready in Gmail. Press Send there to reach us.'; status.style.color='#FF7F00';}
  });}
})();

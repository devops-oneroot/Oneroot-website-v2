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
      cur=(i+views.length)%views.length; var v=views[cur];
      img.style.opacity='0';
      setTimeout(function(){img.src=v.src; img.alt=v.alt; if(note) note.textContent=v.note; img.style.opacity='1';},200);
      btns.forEach(function(o){
        var on=+o.getAttribute('data-view')===cur; o.setAttribute('aria-pressed',on?'true':'false');
        o.style.background=on?'#212721':'transparent'; o.style.color=on?'#FFFFFF':'#212721';
      });
    }
    // In order, 1 -> 2 -> ... -> last -> 1, never random.
    function next(){
      if(paused||document.hidden||views.length<2) return;
      show(cur+1);
    }
    function restart(){clearInterval(timer); timer=setInterval(next,4000);}
    btns.forEach(function(b){
      b.addEventListener('click',function(){show(+b.getAttribute('data-view')); restart();});
    });
    var box=img.parentNode;
    box.addEventListener('mouseenter',function(){paused=true;});
    box.addEventListener('mouseleave',function(){paused=false;});
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches) restart();
  }
  var mt=document.getElementById('mnav');
  if(mt){document.querySelectorAll('.mmenu a').forEach(function(a){a.addEventListener('click',function(){mt.checked=false;});});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')mt.checked=false;});}

  // The OneRoot backend (live): the enquiry form and the open roles. To try a
  // local backend, set window.ONEROOT_API='http://localhost:5000' before this script.
  var API=(window.ONEROOT_API||'https://contract-farming-backend-v2-lra6.onrender.com').replace(/\/+$/,'')+'/api/website';

  // ---- Brand enquiry form (store.html): sent to the backend, which emails procurement.
  var f=document.getElementById('brandForm');
  var clr=document.getElementById('brandClear'), st=document.getElementById('brandStatus');
  function say(t,c){if(st){st.textContent=t; st.style.color=c||'#9EA39E';}}

  // The same rules the backend checks (modules/website/enquiry.controller.js),
  // so a mistake shows under its field before anything is sent.
  var CATEGORIES=['Seeds','Crop nutrition','Crop protection','Tools and implements','Irrigation','Machinery','Animal health','Solar and post-harvest','Other'];
  var RULES={
    company:function(v){return !v?'Enter your company name':v.length<2?'Company name is too short':v.length>150?'Keep it under 150 characters':'';},
    name:function(v){return !v?'Enter your name':v.length<2?'Name is too short':v.length>50?'Name can be at most 50 characters':/\d/.test(v)?'Name should not contain numbers':'';},
    // A 10-digit Indian mobile number, starting with 6-9.
    phone:function(v){
      if(!v)return 'Enter your mobile number';
      if(/\D/.test(v))return 'Use digits only';
      if(v.length!==10)return 'Mobile number must be 10 digits';
      if(!/^[6-9]/.test(v))return 'Enter a valid mobile number';
      return '';
    },
    category:function(v){return CATEGORIES.indexOf(v)<0?'Choose a category':'';},
    message:function(v){return !v?'Tell us what you make':v.length<5?'Tell us a little more':v.length>3000?'Keep it under 3000 characters':'';}
  };
  function errEl(field){
    var lab=field.closest('label'), s=lab&&lab.querySelector('.ferr');
    if(lab&&!s){s=document.createElement('span'); s.className='ferr'; s.setAttribute('aria-live','polite');
      s.style.cssText='font-size: 13px; letter-spacing: 0.02em; text-transform: none; color: #FF8A80;'; lab.appendChild(s);}
    return s;
  }
  function showErr(name,msg){
    var el=f.elements[name]; if(!el) return;
    var s=errEl(el); if(s) s.textContent=msg||'';
    el.style.borderBottomColor=msg?'#FF8A80':'';
    el.setAttribute('aria-invalid',msg?'true':'false');
  }
  function check(name){var el=f.elements[name]; var msg=RULES[name]((el.value||'').trim()); showErr(name,msg); return msg;}
  function clearErrors(){Object.keys(RULES).forEach(function(n){showErr(n,''); var el=f.elements[n]; if(el) delete el.dataset.touched;});}

  if(f){
    // Our own messages under each field instead of the browser's pop-ups.
    f.setAttribute('novalidate','');
    Object.keys(RULES).forEach(function(name){
      var el=f.elements[name]; if(!el) return;
      el.addEventListener('blur',function(){el.dataset.touched='1'; check(name);});
      el.addEventListener('input',function(){if(el.dataset.touched||el.getAttribute('aria-invalid')==='true') check(name);});
      el.addEventListener('change',function(){if(el.dataset.touched) check(name);});
    });
    var ph=f.elements.phone;
    if(ph){
      ph.setAttribute('placeholder','10-digit mobile number');
      ph.addEventListener('input',function(){var c=ph.value.replace(/\D/g,'').slice(0,10); if(c!==ph.value) ph.value=c;});
    }
    function filled(){
      return [].some.call(f.elements,function(el){
        if(el.name==='website') return false;
        if(el.tagName==='SELECT') return el.selectedIndex>0;
        return (el.tagName==='INPUT'||el.tagName==='TEXTAREA')&&el.value.trim()!=='';
      });
    }
    function syncClear(){if(clr) clr.hidden=!filled();}
    f.addEventListener('input',syncClear);
    f.addEventListener('change',syncClear);
    if(clr) clr.addEventListener('click',function(){
      f.reset(); clearErrors(); say('');
      clr.hidden=true;
    });
    syncClear();

    f.addEventListener('submit',function(e){
      e.preventDefault();
      var first=null;
      Object.keys(RULES).forEach(function(name){var el=f.elements[name]; if(el) el.dataset.touched='1'; if(check(name)&&!first) first=el;});
      if(first){first.focus(); say('Please fix the highlighted fields.','#FF8A80'); return;}
      var d=new FormData(f), btn=f.querySelector('button[type="submit"]');
      function v(k){return (d.get(k)||'').toString().trim();}
      var body={company:v('company'),name:v('name'),phone:v('phone'),category:v('category'),message:v('message'),website:v('website')};
      if(btn){btn.disabled=true; btn.style.opacity='0.6'; btn.textContent='Sending…';}
      say('');
      fetch(API+'/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
        .then(function(r){return r.json().catch(function(){return {};}).then(function(j){return {ok:r.ok,j:j};});})
        .then(function(res){
          if(res.ok){
            f.reset(); clearErrors(); syncClear();
            say(res.j.message||'Thanks! We will be in touch.','#FF7F00');
          }else{
            // The backend's own field errors, shown under the fields too.
            var errs=res.j.errors||{}; Object.keys(errs).forEach(function(n){showErr(n,errs[n]);});
            say(res.j.message||'Could not send your enquiry. Please try again.','#FF8A80');
          }
        })
        .catch(function(){say('Could not reach us right now. Please try again, or write to procurement@oneroot.farm.','#FF8A80');})
        .then(function(){if(btn){btn.disabled=false; btn.style.opacity=''; btn.textContent='Send enquiry';}});
    });
  }

  // ---- Open roles (careers.html): the live list from the dashboard's Jobs page.
  // The roles written in the page stay as they are if the list cannot be loaded.
  var list=document.getElementById('rolesList');
  // A role (its arrow, or anywhere on the row) scrolls to How to apply / Contact
  // HR, which then says which role, and the HR email opens with it as the subject.
  var apply=document.getElementById('apply'), applyRole=document.getElementById('applyRole'), hrMail=document.getElementById('hrMail');
  function toApply(a){
    // An outside apply link (a form) is left to open on its own.
    if(/^https?:/i.test(a.getAttribute('href')||'')) return;
    if(!a.dataset.subject){
      var m=/subject=([^&]*)/.exec(a.getAttribute('href')||'');
      a.dataset.subject=m?decodeURIComponent(m[1]):'Application: '+((a.querySelector('.rn')||{}).textContent||'');
      a.dataset.mail=(/^mailto:([^?]+)/.exec(a.getAttribute('href')||'')||[])[1]||'hr@oneroot.farm';
    }
    a.setAttribute('href','#apply'); a.removeAttribute('target');
  }
  if(list&&apply){
    list.addEventListener('click',function(e){
      var a=e.target.closest('a.row'); if(!a||a.getAttribute('href')!=='#apply') return;
      e.preventDefault();
      var role=a.dataset.subject.replace(/^Application:\s*/,'');
      if(applyRole){applyRole.hidden=false; applyRole.textContent='Applying for: '+role+'. Mention it in your email.';}
      if(hrMail) hrMail.href='mailto:'+(a.dataset.mail||'hr@oneroot.farm')+'?subject='+encodeURIComponent(a.dataset.subject);
      apply.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
      if(history.replaceState) history.replaceState(null,'','#apply');
      // A brief highlight, so the eye lands on the right place.
      apply.style.backgroundColor='rgba(255,127,0,0.08)'; apply.style.boxShadow='0 0 0 16px rgba(255,127,0,0.08)';
      setTimeout(function(){apply.style.backgroundColor=''; apply.style.boxShadow='';},1600);
    });
    list.querySelectorAll('a.row').forEach(toApply);
  }
  if(list){
    fetch(API+'/jobs').then(function(r){if(!r.ok) throw 0; return r.json();}).then(function(jobs){
      if(!Array.isArray(jobs)) return;
      var tpl=list.querySelector('a.row');
      if(!jobs.length){
        var p=document.createElement('p');
        p.style.cssText='padding: 28px 0; font-size: 18px; color: #5A5F5A; margin: 0;';
        p.textContent='No open roles right now. Write to hr@oneroot.farm and we will keep you in mind.';
        list.innerHTML=''; list.appendChild(p); return;
      }
      if(!tpl) return;
      // A title listed more than once (Field sales executive) gets its place in the subject.
      var seen={}; jobs.forEach(function(j){seen[j.title]=(seen[j.title]||0)+1;});
      var frag=document.createDocumentFragment();
      jobs.forEach(function(j){
        var a=tpl.cloneNode(true);
        var subject='Application: '+j.title+(seen[j.title]>1&&j.location?' ('+j.location+')':'');
        var link=(j.applyLink||'').trim();
        if(/^https?:\/\//i.test(link)){a.href=link; a.target='_blank'; a.rel='noopener';}
        else a.href='mailto:'+(link&&link.indexOf('@')>0?link:'hr@oneroot.farm')+'?subject='+encodeURIComponent(subject);
        var n=a.querySelector('.rn'), dp=a.querySelector('.rd.lab'), lc=a.querySelectorAll('.rd');
        if(n) n.textContent=j.title;
        if(dp) dp.textContent=j.department;
        if(lc[1]) lc[1].textContent=j.location;
        a.title=[j.experience?'Experience: '+j.experience:'',j.employmentType||''].filter(Boolean).join(' · ');
        delete a.dataset.subject; delete a.dataset.mail;
        if(apply) toApply(a);
        frag.appendChild(a);
      });
      list.innerHTML=''; list.appendChild(frag);
    }).catch(function(){});
  }
})();

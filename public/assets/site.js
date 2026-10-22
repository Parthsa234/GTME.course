/* GTME.School v2 — interactions only. No decorative motion. */
(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var IST=330*60000;
var DOW=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"], MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var DOWL=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

/* ---------- workshop schedule: every Wed 20:00 IST and Sat 11:00 IST ---------- */
var SLOTS=[{dow:3,h:20,m:0},{dow:6,h:11,m:0}];
function istParts(ms){var d=new Date(ms+IST);return {y:d.getUTCFullYear(),mo:d.getUTCMonth(),d:d.getUTCDate(),dow:d.getUTCDay()}}
function nextSessions(n){
  var now=Date.now(),out=[],base=istParts(now);
  for(var i=0;i<21&&out.length<n;i++){
    var dayUTC=Date.UTC(base.y,base.mo,base.d+i);var dow=new Date(dayUTC).getUTCDay();
    SLOTS.forEach(function(s){if(s.dow===dow){var t=dayUTC+(s.h*60+s.m)*60000-IST;if(t>now+5*60000)out.push(t)}});
  }
  return out.sort(function(a,b){return a-b}).slice(0,n);
}
function pad(n){return n<10?"0"+n:""+n}
function fmtIST(t,long){var p=new Date(t+IST);return (long?DOWL:DOW)[p.getUTCDay()]+" "+p.getUTCDate()+" "+MON[p.getUTCMonth()]+" · "+pad(p.getUTCHours())+":"+pad(p.getUTCMinutes())+" IST"}
function fmtZone(t,tz){try{return new Intl.DateTimeFormat("en-GB",{timeZone:tz,hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date(t))}catch(e){return ""}}
function cd(ms){ms=Math.max(0,ms);var D=Math.floor(ms/864e5);ms-=D*864e5;var h=Math.floor(ms/36e5);ms-=h*36e5;var m=Math.floor(ms/6e4);return (D?D+"d ":"")+pad(h)+"h "+pad(m)+"m"}
var sessions=nextSessions(4);
function selectedSession(){var c=$("[name=session]:checked");return c?+c.value:0}
function tick(){
  var now=Date.now();
  if(sessions.length&&sessions[0]<=now)sessions=nextSessions(4);
  var t=sessions[0];
  $$("[data-next]").forEach(function(e){e.textContent=fmtIST(t,e.hasAttribute("data-long"))});
  $$("[data-cd]").forEach(function(e){var sel=selectedSession();e.textContent=cd((e.hasAttribute("data-cd-selected")&&sel?sel:t)-now)});
  $$("[data-days-to]").forEach(function(e){var d=Math.ceil((Date.parse(e.getAttribute("data-days-to"))-now)/864e5);
    e.textContent=d>1?d+" days left":d===1?"1 day left":"closed"});
  $$("[data-date]").forEach(function(r){if(Date.parse(r.getAttribute("data-date"))<now)r.classList.add("past")});
}
(function renderSessions(){
  var box=$("[data-sessions]");if(!box)return;
  box.innerHTML=sessions.map(function(t,i){
    return '<label class="sess"><input type="radio" name="session" value="'+t+'"'+(i===0?' checked':'')+'>'+
      '<span class="t"><b>'+fmtIST(t,true)+'</b><span>'+fmtZone(t,"Europe/London")+' London · '+fmtZone(t,"America/New_York")+' New York · '+fmtZone(t,"Asia/Dubai")+' Dubai</span></span>'+
      '<span class="st">'+(i===0?'NEXT':'OPEN')+'</span></label>'}).join("");
  box.addEventListener("change",tick);
})();
tick();setInterval(tick,20000);

/* ---------- nav dropdown, drawer, mobile bar ---------- */
$$(".dd>button").forEach(function(b){b.addEventListener("click",function(e){var d=b.parentNode,o=d.hasAttribute("data-open");$$(".dd").forEach(function(x){x.removeAttribute("data-open")});if(!o)d.setAttribute("data-open","");b.setAttribute("aria-expanded",!o);e.stopPropagation()})});
document.addEventListener("click",function(){$$(".dd").forEach(function(x){x.removeAttribute("data-open")})});
var drawer=$(".drawer");
$$("[data-drawer]").forEach(function(b){b.addEventListener("click",function(){if(drawer){drawer.setAttribute("data-open","");var f=$("a",drawer);if(f)f.focus()}})});
if(drawer){drawer.addEventListener("click",function(e){if(e.target===drawer||e.target.closest("[data-close]")||e.target.closest("a"))drawer.removeAttribute("data-open")});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")drawer.removeAttribute("data-open")})}
var mbar=$(".mbar"),hero=$(".hero,.phero");
function onScroll(){if(!mbar)return;var lim=hero?hero.getBoundingClientRect().bottom:400;
  if(lim<0){mbar.setAttribute("data-show","");document.body.classList.add("has-mbar")}else{mbar.removeAttribute("data-show");document.body.classList.remove("has-mbar")}}
window.addEventListener("scroll",onScroll,{passive:true});onScroll();

/* ---------- video slots ---------- */
$$("[data-vsl]").forEach(function(a){a.addEventListener("click",function(e){
  var u=a.getAttribute("data-vsl");if(!u){e.preventDefault();var c=a.querySelector("small");if(c)c.textContent="Video coming soon. Paste the Loom or YouTube link into data-vsl.";}
  else{a.href=u;a.target="_blank";a.rel="noopener"}
})});

/* ---------- machine tabs ---------- */
var MACH={
 m1:{t:"Sending infrastructure",d:"Domains, mailboxes, warm-up, the Azure and Google Workspace split, safe daily limits. You leave with a cost sheet you can hand to a client.",r:[0,1,1],img:"assets/photos/build-screen.jpg",c:["Google Workspace","Azure","Warm-up"]},
 m2:{t:"List engine",d:"ICP written as signals, not adjectives. Clay tables with enrichment waterfalls that run the cheap deterministic steps before a single AI credit.",r:[1,1,1],img:"assets/img/hf-work.jpg",c:["Clay","Apollo","Prospeo"]},
 m3:{t:"Research agent",d:"A Claude agent that reads job posts, funding, tech stack and posts for each account, then writes a first line grounded in evidence.",r:[1,1,1],img:"assets/photos/code-window.jpg",c:["Claude","Clay"]},
 m4:{t:"Copy & cadence",d:"Three-step plain-text sequences by segment, trigger line first and one line of pain. Tested against reply rate, not opinions.",r:[1,1,1],img:"assets/img/zp-dash2.jpg",c:["Days 0 · 3 · 7","A/B by segment"]},
 m5:{t:"Reply & booking",d:"Replies classified and answered in minutes, with the booking link and a human hand-off. Speed rules that turn positives into held calls.",r:[1,1,1],img:"assets/img/od-dash.jpg",c:["EmailBison","Smartlead","n8n","HeyReach"]},
 m6:{t:"Dashboard & attribution",d:"What to count, what to cut, and the weekly scoreboard a founder or VP Sales will read.",r:[0,1,1],img:"assets/img/sq-dash.jpg",c:["Sequencer data","Weekly scoreboard"]}
};
var RUNG=[["Live Build ₹99","Watched live","Not covered live"],["Launchpad","You build it, clinic review","You build it, clinic review"],["Operator","Shipped on a live account","Shipped on a live account"]];
var panel=$("[data-ppanel]");
$$("[data-machine]").forEach(function(b){b.addEventListener("click",function(){
  $$("[data-machine]").forEach(function(x){x.setAttribute("aria-selected","false")});b.setAttribute("aria-selected","true");
  var k=b.getAttribute("data-machine"),m=MACH[k];if(!panel||!m)return;
  var im=panel.querySelector("img");im.src=m.img;im.alt=m.t;
  panel.querySelector("[data-mt]").textContent=k.toUpperCase()+" · "+m.t;
  panel.querySelector("[data-md]").textContent=m.d;
  panel.querySelector("[data-mc]").innerHTML=m.c.map(function(x){return '<span class="chip">'+x+'</span>'}).join("");
  panel.querySelector("[data-mr]").innerHTML=m.r.map(function(on,i){return '<div class="'+(on?'on':'')+'"><b>'+RUNG[i][0]+'</b>'+(on?RUNG[i][1]:RUNG[i][2])+'</div>'}).join("");
})});

/* ---------- case filters ---------- */
$$("[data-filter]").forEach(function(b){b.addEventListener("click",function(){
  var f=b.getAttribute("data-filter");$$("[data-filter]").forEach(function(x){x.setAttribute("aria-pressed",x===b?"true":"false")});
  $$("[data-tags]").forEach(function(c){c.hidden=!(f==="all"||c.getAttribute("data-tags").split(" ").indexOf(f)>-1)});
})});
$$("[data-filter]").forEach(function(b){var f=b.getAttribute("data-filter"),n=$$("[data-tags]").filter(function(c){return f==="all"||c.getAttribute("data-tags").split(" ").indexOf(f)>-1}).length;var s=b.querySelector(".count");if(s)s.textContent=n});

/* ---------- case lightbox ---------- */
var IMG="assets/img/";
var CASES={
 happyfolks:{n:"HappyFolks",s:"HR tech SaaS · India",h:"Test wide, then go precise.",p:"Eight test campaigns showed which segment, mailbox set-up and message worked. The refined campaign turned 6.7% of contacts into replies. HappyFolks was acquired by Kula in Oct 2024.",
  img:[["hf-dash","Refined campaign: 549 contacted · 37 replied · 25 opportunities"],["hf-work","The campaign workspace: eight test campaigns"]],
  cols:["Campaign","Sent","Replies"],rows:[["HRM 200–1000 · 6K leads, retry","6,620","8"],["CEOs & founders · 5K, retry","5,294","6"],["HRM 200–1000 · new mailboxes","4,059","12"],["CEOs & founders · new mailboxes","3,903","9"],["Refined campaign (contacts)","549","37 → 25 opps",1]],
  w:["Mailbox and list rotation isolated what was suppressing replies","Savings-led copy with a zero-risk migration offer beat feature pitches","Going narrow lifted replies from under 0.3% to 6.7%"],
  q:["Working with [the SparqLabs] team was one good decision we made while running the company, since they helped us immensely in product positioning, GTM strategy, at time of initial user acquisition, fund raising and even during acquisition.","Vimal Ramakrishnan · Ex-founder, HappyFolks"],src:"HappyFolks sending dashboards"},
 routeelite:{n:"RouteElite",s:"Logistics services · US",h:"Five months, two channels, one customer base.",p:"US delivery contractors reached by cold email and SMS, with offers stacked so every customer could buy more than one service.",
  img:[["re-dash","Sending dashboard: 23.5K sent · 1.9% reply rate · 81 opportunities"],["re-site","The sequence builder"]],
  cols:["Metric","Result"],rows:[["Emails sent (dashboard)","23.5K"],["Reply rate (dashboard)","1.9%"],["Opportunities (dashboard)","81",1],["Response rate, first 60 days","0.5% → 5%+"],["New recurring subscriptions","350+",1],["New revenue","$38,440"],["Cross-sell uplift","+32%"]],
  w:["One customer profile, five products: every reply was worth more","SMS reached contractors who don't live in their inbox","Weekly subject-line and CTA tests compounded the response rate"],
  q:["Partnering with [SparqLabs] was a pivotal step in our growth journey. The young energetic team and their experience in B2B lead generation channels opened new avenues for us, as we adapted them before our competitors.","Steven · VP Operations, RouteElite"],src:"Sent, reply rate and opportunities from the sending dashboard. Subscriptions, revenue and cross-sell reported by the client"},
 okaydone:{n:"OkayDone",s:"Marketing agency · Bengaluru",h:"A bigger pipeline, better-fit brands.",p:"Three campaigns into brands, CMOs and creator partners. The main programme alone produced 1,411 replies and beat the previous agency's bar of 45 meetings a quarter.",
  img:[["od-dash","Main programme: 21,991 sent · 1,411 replied (6.42%) · 169 positive"],["od-dash2","Decision-maker campaign: 2,064 contacted · 68 replied · 12 opportunities"],["od-site","okaydone.in"]],
  cols:["Campaign","Sent","Replies","Positive"],rows:[["Brand outreach · main","21,991","1,411","169",1],["Brand outreach · follow-on","2,042","54","15"],["Decision-maker campaign","2,064","68","12 opps"]],
  w:["35+ high-value meetings with FinTech, D2C and luxury brands in 45 days","90% of show-ups were qualified meetings with the defined ICP","A/B tests on subject lines and CTAs before scaling"],src:"OkayDone sending dashboards"},
 filterking:{n:"FilterKing",s:"Industrial · HVAC filtration",h:"Same copy. New list. 76 opportunities.",p:"The message still worked; the list didn't. Rebuilding the list put the campaign back to work while a second list was tested alongside it.",
  img:[["fk-dash","Both FilterKing campaigns in the sending dashboard"]],
  cols:["Campaign","Sent","Replies","Opps"],rows:[["Old copy · new lead list","20,636","161","76",1],["Type 2 · new lead list","2,835","14","5"],["Total","23,471","175","81"]],
  w:["Diagnosed the list, not the copy: the message stayed","47% of replies on the main campaign became opportunities","A parallel list was tested before any scaling"],src:"FilterKing sending dashboard"},
 zaap:{n:"Zaap.ai",s:"Creator-economy SaaS · global",h:"Two audiences, one product.",p:"Linktree users were pitched a switch; influencers were offered a free Pro account. The first influencer wave replied at 15%.",
  img:[["zp-dash","Influencer campaign: 3,203 sent · 489 replied · 99 positive"],["zp-dash2","D2C campaign to Linktree users: 16,434 sent · 472 replied · 48 positive"],["zp-site","zaap.ai"]],
  cols:["Campaign","Sent","Replies","Positive"],rows:[["D2C · Linktree users","16,434","472","48"],["Influencers · wave 1","3,203","489","99",1],["Influencers · wave 2","1,326","60","10"],["Influencers · wave 3","814","32","4"],["Total","21,777","1,053","161"]],
  w:["A free Pro account gave influencers a reason to reply, and to post","Creator shout-outs delivered 600K+ impressions","300+ sign-ups came directly from the email campaigns"],src:"Zaap.ai sending dashboards"},
 sparq:{n:"Sparq Labs",s:"Our own outbound engine",h:"Volume, with control.",p:"The agency runs its own pipeline on the system it teaches. One sending workspace, every send, and the strongest campaigns run on it.",
  img:[["sq-dash","One workspace: 996.3K sent · 1.7% reply rate · 874 opportunities"],["sq-dash2","Campaign Jan–Feb: 24.8K sent · 183 opportunities"],["sq-dash3","Campaign summer: 13.4K sent · 64 opportunities"]],
  cols:["Campaign","Volume","Reply","Opps"],rows:[["5.6K list","5,602","14.9%","196",1],["2.7K list","2,743","15.2%","108"],["C-suite & directors","1,185","11.6%","52"],["1.6K list","1,565","10.2%","51"],["Campaign · Jan–Feb","24.8K","2.3%","183"],["Campaign · summer","13.4K","2.0%","64"]],
  w:["Google and Azure inboxes, warmed and rotated","Clay waterfall, Prospeo, Apollo, Apify for signals","Spintax and signal-based first lines; dashboards per campaign and per domain"],src:"Sparq Labs sending dashboards. Dashboard deal values use a $1,000 default and are not shown"},
 bazooka:{n:"Bazooka",s:"LinkedIn · vendor-published case",h:"From our own pipeline to client programmes.",p:"Bazooka, an AI LinkedIn outreach platform, published the Sparq Labs LinkedIn programme as a customer case study.",
  img:[["bz-case","mybazooka.com/cases/sparqlabs"],["bz-home","Bazooka's homepage, with Sparq Labs among its listed customers"]],
  cols:["What","Detail"],rows:[["Channel","LinkedIn"],["Reply rate","26%",1],["Booking rate","15%",1],["Closed LTV","$25K+"],["Time to first closed deals","< 3 weeks"]],
  w:["Openers referenced each prospect's own LinkedIn activity","Follow-ups ran automatically, timed to prospect activity","Angles that converted were scaled; the rest were retired"],src:"Figures as published by Bazooka"},
 wisemango:{n:"WiseMango",s:"Founder branding agency · India",h:"A lead magnet that filled the calendar.",p:"Leading with a free resource instead of a pitch: 24 of the 39 replies on the main campaign were positive.",
  img:[["wm-dash","Lead-magnet campaign: 582 sent · 39 replied · 24 positive (61.54%)"],["wm-dash2","Follow-on campaign: 717 sent · 24 replied · 7 positive"],["wm-site","wisemango.io"]],
  cols:["Campaign","Sent","Replies","Positive"],rows:[["Lead-magnet campaign","582","39","24",1],["Follow-on campaign","717","24","7"]],
  w:["The sales calendar was fully booked within 14 days","1–3 additional meetings booked every day","The newsletter passed 500 sign-ups"],src:"WiseMango sending dashboards"},
 letsunbound:{n:"LetsUnbound",s:"EdTech · India & UAE",h:"Three audiences, three offers.",p:"Schools, agencies and parents each got a different message. The best campaign opened at 91.6% and replied at 6.3%.",
  img:[["lu-dash","Campaign 1: 366 contacted · 91.64% open · 6.28% reply · 7 opportunities"],["lu-dash2","Campaign 2: 1,995 contacted · 63.51% open · 1.90% reply · 4 opportunities"],["lu-site","letsunbound.com"]],
  cols:["Campaign","Contacted","Reply","Opps"],rows:[["Campaign 1","366","6.28%","7",1],["Campaign 2","1,995","1.90%","4"]],
  w:["18 school meetings in the first two weeks","5 meetings with UAE consulting agencies on a $25K+ franchise offer","Alumni-parent targeting added 20+ interested families"],src:"LetsUnbound sending dashboards"},
 mz:{n:"MZ Media",s:"SaaS product video agency",h:"Proven lanes stay live. Tests earn their place.",p:"Campaigns ran as separate lanes. Lanes that produced SQLs kept their volume; new angles had to prove themselves in small tests first.",
  img:[["mz-offer","MZ Media's a16z Speedrun offer page: the funded-founder audience the outbound reaches"],["mz-site","mzmedia.digital"]],
  cols:["Metric","Result"],rows:[["SQLs generated · August","41+",1],["Emails sent · August","35K+"],["Replies → interested · June","296 → 20"],["Funded accounts asking for next steps","10+"],["YouTube-growth lane · reply rate","7–8%"],["Leads loaded in the system","22K+"]],
  w:["Lanes, not one big list: proven segments kept volume, tests stayed small","A personalised Loom and a 7-day content plan as the creator lead magnet","Interested replies routed into GoHighLevel within minutes"],src:"Sparq Labs weekly client reports, June–September 2026"}
};
var lb=$("dialog.lb");
function openCase(id){var c=CASES[id];if(!c||!lb)return;
  var th='<tr>'+c.cols.map(function(x){return '<th>'+x+'</th>'}).join("")+'</tr>';
  var tr=c.rows.map(function(r){var hi=r.length>c.cols.length;return '<tr'+(hi?' class="hi"':'')+'>'+r.slice(0,c.cols.length).map(function(x){return '<td>'+x+'</td>'}).join("")+'</tr>'}).join("");
  lb.innerHTML='<button class="lb-close" data-x aria-label="Close"><svg width="14" height="14" viewBox="0 0 14 14" stroke="#0B0B0B" stroke-width="2"><path d="M2 2l10 10M12 2L2 12"/></svg></button><div class="lb-in"><div class="lb-media">'+
   c.img.map(function(i){return '<figure><img src="'+IMG+i[0]+'.jpg" alt="'+i[1].replace(/"/g,"")+'" loading="lazy"><figcaption>'+i[1]+'</figcaption></figure>'}).join("")+
   '</div><div class="lb-info"><div class="kicker">'+c.s+'</div><div class="h2" style="font-size:clamp(28px,3vw,38px)">'+c.n+'</div><div class="h3">'+c.h+'</div><p style="font-size:15px;color:var(--ink-2);margin:0">'+c.p+'</p>'+
   '<div style="overflow-x:auto"><table class="tbl">'+th+tr+'</table></div><div class="note">Source: '+c.src+'.</div>'+
   '<div class="kicker">What made it work</div><ul class="lb-list">'+c.w.map(function(x){return '<li>'+x+'</li>'}).join("")+'</ul>'+
   (c.q?'<figure class="quote" style="background:var(--stone)"><div class="mk">“</div><blockquote>'+c.q[0]+'</blockquote><figcaption>'+c.q[1]+'</figcaption></figure>':'')+
   '</div></div>';
  if(lb.showModal)lb.showModal();else lb.setAttribute("open","");
}
$$("[data-case]").forEach(function(b){b.addEventListener("click",function(e){e.preventDefault();openCase(b.getAttribute("data-case"))})});
if(lb){lb.addEventListener("click",function(e){if(e.target===lb||e.target.closest("[data-x]"))lb.close()})}

/* ---------- which rung quiz ---------- */
var quiz=$("[data-quiz]");
if(quiz){var REC={
  workshop:["Live Build Workshop","₹99","Start here. Watch the engine get built in 150 minutes, take every template, and decide with real information.","workshop.html#checkout","Reserve a seat — ₹99"],
  launchpad:["Launchpad","₹24,999 + GST","You want to build the six machines yourself on your own stack, with a live clinic every week to fix what breaks. Credited in full to Operator within 21 days.","launchpad.html#buy","See Launchpad"],
  operator:["Operator Cohort","₹3.5L · $4,000","You want all six machines shipped on a live account, on a deadline, with a Demo Day you can send instead of a CV. Application and a call first.","operator.html#apply","Apply for Cohort 2"],
  lieutenant:["Lieutenant","₹5.3L · $6,000","You run an agency or a company and need the machines built on your own pipeline, with weekly 1:1 co-builds with Nish. Eight seats a cohort.","operator.html#apply","Talk to Nish"],
  teams:["SDR Team Program","₹2.5–4L per team","Three or more of you from one team is a private cohort, not individual seats. Start with the free 45-minute teardown.","teams.html#teardown","Book the free teardown"]};
 function decide(){var f=new FormData(quiz.querySelector("form")),who=f.get("who"),time=f.get("time"),goal=f.get("goal"),k="workshop";
  if(who==="team")k="teams";else if(who==="owner"&&goal==="ship"&&time!=="low")k="lieutenant";
  else if(goal==="ship"&&time==="high")k="operator";else if(goal==="build"||(goal==="ship"&&time==="mid"))k="launchpad";
  var r=REC[k],a=quiz.querySelector("[data-answer]");
  a.querySelector("[data-an]").textContent=r[0];a.querySelector("[data-ap]").textContent=r[1];a.querySelector("[data-ad]").textContent=r[2];
  var l=a.querySelector("[data-al]");l.href=r[3];l.querySelector("span").textContent=r[4];
  $$(".rung").forEach(function(x){x.classList.toggle("pick",x.getAttribute("data-rung")===k)});
 }
 quiz.addEventListener("change",decide);decide();
}

/* ---------- forms (front-end only: wire to your CRM / ESP before launch) ---------- */
$$("form[data-form]").forEach(function(f){f.addEventListener("submit",function(e){e.preventDefault();var ok=true;
  $$("[required]",f).forEach(function(i){var fl=i.closest(".field");var bad=!i.value.trim()||(i.type==="email"&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value));
    var er=fl?fl.querySelector(".err"):null;
    if(fl){if(bad){fl.setAttribute("data-bad","");if(er)er.textContent=i.type==="email"?"Enter an email like you@company.com":"Required"}else{fl.removeAttribute("data-bad");if(er)er.textContent=""}}
    if(bad)ok=false});
  var note=f.querySelector(".formnote");
  if(!ok){if(note){note.style.color="#B42318";note.textContent="Fix the highlighted fields."}return}
  var done=f.getAttribute("data-done");
  if(done&&f.parentNode.querySelector(done)){f.hidden=true;f.parentNode.querySelector(done).hidden=false}
  else if(note){note.style.color="";note.textContent=f.getAttribute("data-msg")||"Received."}
})});

/* ---------- copy ---------- */
$$("[data-copy]").forEach(function(b){b.addEventListener("click",function(){var src=$(b.getAttribute("data-copy"));if(!src)return;var txt=src.innerText.trim(),lbl=b.textContent;
  function done(m){b.textContent=m;setTimeout(function(){b.textContent=lbl},1800)}
  function sel(){var r=document.createRange();r.selectNodeContents(src);var s=window.getSelection();s.removeAllRanges();s.addRange(r);done("Selected — press Ctrl/⌘ C")}
  try{navigator.clipboard.writeText(txt).then(function(){done("Copied")},sel)}catch(e){sel()}
})});

/* ---------- workshop add-on total ---------- */
var add=$("#starter-kit");
if(add){var upd=function(){var t=99+(add.checked?499:0);$$("[data-total]").forEach(function(e){e.textContent="₹"+t});$$("[data-pay]").forEach(function(e){e.textContent="Reserve my seat — pay ₹"+t})};add.addEventListener("change",upd);upd()}

/* ---------- EMI estimator ---------- */
var emi=$("[data-emi]");
if(emi){var price={op:350000,lt:530000},sel="op",months=12;
 var money=function(n){return "₹"+Math.round(n).toLocaleString("en-IN")};
 var draw=function(){emi.querySelector("[data-emi-out]").textContent=money(price[sel]/months);emi.querySelector("[data-emi-m]").textContent=months+" months";emi.querySelector("[data-emi-total]").textContent=money(price[sel])};
 $$("[data-track]",emi).forEach(function(b){b.addEventListener("click",function(){sel=b.getAttribute("data-track");$$("[data-track]",emi).forEach(function(x){x.setAttribute("aria-pressed",x===b?"true":"false")});draw()})});
 $$("[data-months]",emi).forEach(function(b){b.addEventListener("click",function(){months=+b.getAttribute("data-months");$$("[data-months]",emi).forEach(function(x){x.setAttribute("aria-pressed",x===b?"true":"false")});draw()})});
 draw()}

/* ---------- Launchpad credit window ---------- */
$$("[data-credit-deadline]").forEach(function(e){var p=istParts(Date.now()+21*864e5);e.textContent=DOWL[p.dow]+" "+p.d+" "+MON[p.mo]+" "+p.y});

/* ---------- clinic tracker ---------- */
$$("[data-tracker]").forEach(function(t){var btns=$$("button.card",t),m=t.querySelector(".meter i"),o=t.querySelector("[data-done-n]");
 function u(){var n=btns.filter(function(b){return b.getAttribute("aria-pressed")==="true"}).length;if(m)m.style.setProperty("--p",(n/btns.length*100)+"%");if(o)o.textContent=n+" of "+btns.length+" shipped"}
 btns.forEach(function(b){b.addEventListener("click",function(){b.setAttribute("aria-pressed",b.getAttribute("aria-pressed")==="true"?"false":"true");u()})});u()});

$$("[data-year]").forEach(function(e){e.textContent=new Date().getFullYear()});


/* testimonial videos: click to play, only one at a time */
$$("[data-play]").forEach(function(w){var v=w.querySelector("video");
  w.addEventListener("click",function(e){if(e.target===v&&w.classList.contains("playing"))return;
    $$("[data-play] video").forEach(function(o){if(o!==v){o.pause()}});
    if(!w.classList.contains("playing")){w.classList.add("playing");v.controls=true;v.play().catch(function(){})}});
  v.addEventListener("pause",function(){if(v.ended){w.classList.remove("playing");v.controls=false}});
  v.addEventListener("ended",function(){w.classList.remove("playing");v.controls=false});
  v.addEventListener("play",function(){$$("[data-play] video").forEach(function(o){if(o!==v)o.pause()})});
});
/* ================= v3 motion (IntentLedSales-style) ================= */
var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* nav: scroll progress + scrollspy */
var prog=$(".nav .progress"),spy=$$("[data-spy]"),spyT=spy.map(function(a){return document.getElementById(a.getAttribute("data-spy"))});
function navScroll(){var h=document.documentElement,max=h.scrollHeight-h.clientHeight;if(prog)prog.style.transform="scaleX("+(max>0?h.scrollTop/max:0)+")";
  var cur=-1;spyT.forEach(function(t,i){if(t&&t.getBoundingClientRect().top<window.innerHeight*.4)cur=i});
  spy.forEach(function(a,i){a.classList.toggle("on",i===cur)});
  var home=$('.nav-links a[aria-current="page"]');if(home&&spyT.some(Boolean))home.classList.toggle("dim",cur>-1);}
window.addEventListener("scroll",navScroll,{passive:true});navScroll();

/* scroll reveal: transform + opacity, staggered by sibling index */
var AUTO=".out,.tool,.mod,.tvid,.proof,.fit>div,.sec-head,.center-head,.case,.card,.rung,.post,.pcard,.chart-card,.quote,.tcard,.week,.own>div,.faq,.cmp,.viz,.photo,.list>div,.stats,.guar>div,.door,.form-card,.fcard,.wheel-col,.cur-meta,.quiz,.dates .date-row,.more,.about>*,.checks>div,.steps-d>div,.note-card,.calc,.console,.strip>div,.branch";
if(!reduce&&"IntersectionObserver" in window){
  $$(AUTO).forEach(function(el){if(el.closest(".hero")||el.closest(".phero")||el.closest(".tpj")||el.classList.contains("reveal-up"))return;el.classList.add("reveal-up")});
  var sib=new Map();
  $$(".reveal-up,.reveal-left,.reveal-right").forEach(function(el){var p=el.parentNode,n=sib.get(p)||0;sib.set(p,n+1);if(!el.style.getPropertyValue("--rd"))el.style.setProperty("--rd",Math.min(n,6)*0.08+"s");
    var r=el.getBoundingClientRect();if(r.top>window.innerHeight*0.92)el.classList.add("reveal-hidden")});
  var rio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.remove("reveal-hidden");rio.unobserve(e.target)}})},{threshold:.12,rootMargin:"0px 0px -6% 0px"});
  $$(".reveal-hidden").forEach(function(el){rio.observe(el)});
}

/* flywheel: draw arcs when visible */
$$(".wheel").forEach(function(w){if(reduce||!("IntersectionObserver" in window)){w.classList.add("fw-drawn");return}
  var o=new IntersectionObserver(function(es){if(es[0].isIntersecting){w.classList.add("fw-drawn");o.disconnect()}},{threshold:.35});o.observe(w)});

/* three-phase journey: sticky, scroll-driven */
$$(".tpj").forEach(function(sec){
  var panes=$$(".tpj-pane",sec),copies=$$(".tpj-copy",sec),tabs=$$(".tpj-tab",sec),bar=$(".tpj-tabs .bar",sec),n=copies.length,last=-1;
  $$(".tpj-vis",sec).forEach(function(v){for(var i=0;i<12;i++){var d=document.createElement("i");d.className="tpj-particle";var s=2+Math.random()*3;
    d.style.cssText="left:"+(Math.random()*96)+"%;top:"+(Math.random()*96)+"%;width:"+s+"px;height:"+s+"px;animation-duration:"+(4.5+Math.random()*3.5)+"s;animation-delay:"+(-Math.random()*5)+"s";v.appendChild(d)}});
  function upd(){if(window.innerWidth<=980){panes.concat(copies).forEach(function(x){x.classList.add("on")});return}
    var r=sec.getBoundingClientRect(),total=sec.offsetHeight-window.innerHeight,pr=Math.min(1,Math.max(0,-r.top/Math.max(1,total)));
    var idx=Math.min(n-1,Math.floor(pr*n*0.999));if(bar)bar.style.transform="scaleX("+pr+")";
    if(idx!==last){last=idx;[panes,copies,tabs].forEach(function(g){g.forEach(function(x,i){x.classList.toggle("on",i===idx)})})}}
  tabs.forEach(function(t,i){t.addEventListener("click",function(){var total=sec.offsetHeight-window.innerHeight;window.scrollTo({top:sec.offsetTop+total*(i+0.5)/n,behavior:"smooth"})})});
  window.addEventListener("scroll",upd,{passive:true});window.addEventListener("resize",upd);upd();
});
})();

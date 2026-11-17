/* v2 standalone engine. Calendar helpers and daily income/cost calculation adapted
 * from supplied v0.9.8 src/core.js; no legacy storage or fixed-turn flow imported. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.LifeCore=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const KEY='lhm_v21_life_first_20261117',VERSION=1,START='2026-11-17',DAYS=180;
const GAME_VERSION='v2.1.3-plan003',PROTAGONIST='김미미';
const copy=s=>JSON.parse(JSON.stringify(s));
function dayAfter(str,n){let d=new Date(str+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
function initial(seed=Date.now()>>>0){return {version:VERSION,scene:'start',day:0,date:START,cash:300000,debt:30000000,health:75,mind:65,career:5,job:'retail',personality:'',salary:2100000,support:0,supportEnd:0,rent:600000,living:600000,repaid:0,seed:seed>>>0,flags:{plan003:true},relations:{minseo:0,soha:0,doyun:0,vendor:0},seen:[],history:[],ledger:null,last:null,ended:false};}
function random(s){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296;}
function relation(s,k,n){s.relations[k]=(s.relations[k]||0)+n;}
function effect(s,e={}){for(const [k,v]of Object.entries(e)){if(['cash','debt'].includes(k))s[k]=Math.max(0,s[k]+v);else if(['health','mind','career'].includes(k))s[k]=Math.max(0,Math.min(100,s[k]+v));else if(k==='flags')Object.assign(s.flags,v);else if(k==='relations')for(const [p,n]of Object.entries(v))relation(s,p,n);else s[k]=v;}}
function spend(s,n){if(!Number.isFinite(n)||n<0)throw Error('invalid cost');const loan=Math.max(0,n-s.cash);s.debt+=loan;s.cash=Math.max(0,s.cash-n);return loan;}
function repay(s,n){if(!Number.isFinite(n)||n<0)throw Error('invalid repayment');const paid=Math.min(Math.round(n),s.cash,s.debt);s.cash-=paid;s.debt-=paid;s.repaid+=paid;return paid;}
function advance(s,to){if(!Number.isInteger(to)||to<s.day||to>DAYS)throw Error('invalid date');const l={from:s.day,to,salary:0,support:0,cost:0,interest:0,arrears:0};while(s.day<to){const d=new Date(s.date+'T00:00:00Z'),days=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();if(s.salaryEnd&&s.day>=s.salaryEnd)s.salary=0;const salary=s.salary/days,help=s.day<s.supportEnd?s.support/days:0,cost=(s.rent+s.living)/days,interest=s.debt*(Math.pow(1.01,1/days)-1);s.cash+=salary+help;s.debt+=interest;let paid=Math.min(s.cash,cost);s.cash-=paid;s.debt+=cost-paid;l.salary+=salary;l.support+=help;l.cost+=cost;l.arrears+=cost-paid;l.interest+=interest;s.day++;s.date=dayAfter(START,s.day);}for(const k of ['cash','debt'])s[k]=Math.round(s[k]);for(const k of ['salary','support','cost','interest','arrears'])l[k]=Math.round(l[k]);s.ledger=l;return l;}
function snapshot(s){return Object.fromEntries(['cash','debt','health','mind','career','job','salary','support'].map(k=>[k,s[k]]));}
function choose(current,scenes,index){
const s=copy(current),sc=scenes[s.scene];if(!sc||s.ended)throw Error('not playable');
const choices=sc.choices(s),c=choices[index];if(!c||c.disabled?.(s))throw Error('unavailable choice');
const before=snapshot(s);let out=c.run?c.run(s):{};out=out||{};const actionAfter=snapshot(s);
let next=out.next||c.next;if(typeof next==='function')next=next(s);if(!next||!scenes[next])throw Error('missing next '+next);
const target=scenes[next],to=typeof target.day==='function'?target.day(s):target.day;
if(to!=null)advance(s,to);const entryBefore=snapshot(s);let notification=null;
if(target.enter&&!s.seen.includes(next)){target.enter(s);notification=target.notification?target.notification(s):null;}
const after=snapshot(s),choiceDelta={},transactions=[...(out.transactions||[])];if(transactions.length&&after.cash!==entryBefore.cash)transactions.push({label:notification?.from||'추가 입금',amount:after.cash-entryBefore.cash,source:'entry'});for(const k of ['cash','debt','health','mind','career','salary','support'])choiceDelta[k]=(actionAfter[k]-before[k])+(after[k]-entryBefore[k]);
s.seen.push(s.scene);s.history.push({scene:s.scene,day:current.day,choice:c.text,result:out.text||c.result||'',job:s.job});s.scene=next;
s.last={text:out.text||c.result||'',notification,before,after,choiceDelta,outcome:out.outcome||null,transactions,monthlyBefore:{salary:before.salary,support:before.support},monthlyAfter:{salary:actionAfter.salary,support:actionAfter.support},periodDelta:{cash:entryBefore.cash-actionAfter.cash,debt:entryBefore.debt-actionAfter.debt}};
if(target.ending)s.ended=true;return s;}

function valid(s,scenes){
const obj=v=>!!v&&typeof v==='object'&&!Array.isArray(v),str=v=>typeof v==='string';
return obj(s)&&s.version===VERSION&&Object.hasOwn(scenes,s.scene)&&Number.isInteger(s.day)&&s.day>=0&&s.day<=DAYS&&['cash','debt','health','mind','career','salary','support','supportEnd','rent','living','repaid','seed'].every(k=>Number.isFinite(s[k])&&s[k]>=0)&&s.date===dayAfter(START,s.day)&&obj(s.flags)&&obj(s.relations)&&Object.values(s.relations).every(Number.isFinite)&&Array.isArray(s.history)&&s.history.length<=100&&s.history.every(h=>obj(h)&&str(h.scene)&&Object.hasOwn(scenes,h.scene)&&Number.isInteger(h.day)&&h.day<=s.day&&str(h.choice)&&str(h.result))&&Array.isArray(s.seen)&&s.seen.every(id=>str(id)&&Object.hasOwn(scenes,id))&&(!s.transcript||(Array.isArray(s.transcript)&&s.transcript.length<=100&&s.transcript.every(t=>obj(t)&&str(t.id)&&Object.hasOwn(scenes,t.id)&&str(t.title)&&Array.isArray(t.body)&&t.body.every(str)&&Array.isArray(t.chat)&&t.chat.every(m=>obj(m)&&str(m.who)&&str(m.text)))))&&(!s.last||(obj(s.last)&&str(s.last.text)&&obj(s.last.before)&&obj(s.last.after)&&(!s.last.notification||(obj(s.last.notification)&&str(s.last.notification.from)&&Number.isFinite(s.last.notification.amount)&&s.last.notification.amount>0))&&['cash','debt','health','mind'].every(k=>Number.isFinite(s.last.before[k])&&Number.isFinite(s.last.after[k]))))&&(!s.last?.choiceDelta||Object.values(s.last.choiceDelta).every(Number.isFinite))&&(!s.last?.outcome||(['success','failure'].includes(s.last.outcome.kind)&&str(s.last.outcome.label)&&str(s.last.outcome.attempt)))&&(!s.last?.transactions||(Array.isArray(s.last.transactions)&&s.last.transactions.every(t=>obj(t)&&str(t.label)&&Number.isFinite(t.amount))))&&s.health<=100&&s.mind<=100&&s.career<=100&&['none','office','night','freelance','part','supported','streamer','retail','model'].includes(s.job)&&typeof s.ended==='boolean'&&s.ended===!!scenes[s.scene].ending;}

const jobs={none:'구직 중',office:'기획사 사무 계약직',night:'라운지 접객',freelance:'프리랜서 정산 업무',part:'예약 사무 계약직',supported:'현재 근로 없음',streamer:'인터넷 방송인',retail:'편의점 야간 알바',model:'촬영 보조 / 모델 준비'};

function rebateAmount(s){return s.flags.negotiatedRebateAmount||6000000;}
function rebateTotal(s){return rebateAmount(s)+(s.flags.secondDeal?8000000:0);}
function rebateOutstanding(s){if(!s.flags.rebate)return 0;const paid=s.flags.rebateReturnedAmount??(s.flags.settledAudit?rebateTotal(s):s.flags.returnedRebate?6000000:0);return Math.max(0,rebateTotal(s)-paid);}
function jobName(s){if(s.job==='office'&&s.flags?.retailToOffice)return '물류회사 인력 관리직';if(s.job==='freelance'&&s.flags?.route==='model'&&s.flags?.adShoot)return '프리랜서 광고 모델';return jobs[s.job]||'구직 중';}
function migrate(s){const d=copy(s);const rename=v=>{if(typeof v==='string')return v.replaceAll('지나 씨','미미 씨');if(Array.isArray(v))return v.map(rename);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,rename(x)]));return v;};return rename(d);}

return {GAME_VERSION,PROTAGONIST,migrate,jobName,rebateAmount,rebateTotal,rebateOutstanding,KEY,VERSION,START,DAYS,initial,copy,dayAfter,random,effect,spend,repay,advance,choose,valid,jobs};});
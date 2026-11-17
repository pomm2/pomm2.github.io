/* Presentation-only descriptions. Never executes a choice or reads hidden future flags. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./scenes.js'),require('./core.js'));else root.LifeChoiceUI=factory(root.LifeScenes,root.LifeCore);})(typeof globalThis!=='undefined'?globalThis:this,function(D,C){
'use strict';
const won=n=>'₩'+Math.round(n).toLocaleString('ko-KR');
const q=s=>'“'+s+'”';
const dialogues={
'민서한테 지원서를 보낸다':'응, 지원해볼게. 어디로 보내면 돼?',
'소하한테 면접 시간을 묻는다':'면접 한번 볼게. 언제 가면 돼?',
'계좌를 보내고 수정 견적을 올린다':'알겠어요. 계좌 보내드릴게요.',
'제안 메시지를 첨부해 팀장에게 보고한다':'팀장님, 거래처에서 이런 연락이 왔어요.',
'민서와 자료를 같이 확인한다':'같이 보자. 네가 받은 것도 보여줘.',
'추가 업무 보수를 팀장에게 묻는다':'업무가 늘면 보수도 다시 얘기할 수 있을까요?',
'주말 현장 업무까지 맡는다':'네, 주말 현장까지 제가 할게요.',
'민서와 나눠 맡을 수 있는지 묻는다':'민서야, 이거 나눠서 할래?',
'이번 주말은 쉬겠다고 답한다':'이번 주말은 좀 쉬려고요.',
'받은 차액 전액을 반환하고 원래 견적을 제출한다':'받은 돈 돌려드릴게요. 견적도 바로잡을게요.',
'회사에서 주말 행사까지 맡는다':'주말 행사까지 맡을게요.',
'외주 업체의 석 달 계약을 택한다':'석 달 계약으로 진행할게요.',
'현장 추가 없이 기존 업무만 유지한다':'현장까지는 어렵고, 지금 업무만 할게요.',
'단체방에 “표는 민서가 만들었어요”라고 쓴다':'표는 민서가 만들었어요.',
'팀장에게 “다음 것도 제가 할게요”라고 답한다':'다음 것도 제가 할게요.',
'민서에게 “담당은 내가 바꿔달라고 했어”라고 말한다':'담당은 내가 바꿔달라고 했어.',
'입금 내역과 원본을 제출한다':'제 계좌로 받은 내역도 같이 보내겠습니다.',
'태준에게 맡기고 기존 설명을 유지한다':'그럼 자료는 태준 씨가 보내주세요.',
'현재 업무를 유지하며 다음 프로젝트를 잡는다':'지금 일 마치고 다음 것도 할게요.',
'자료 정리를 마치고 며칠 쉰다':'자료 정리하고 며칠 쉬어도 될까요?',
'예약 사무직으로 출근한다':'네, 언제부터 출근하면 될까요?',
'단기 정리 업무만 받는다':'일단 이번 정리 업무만 맡을게요.',
'현장 총괄을 맡는다':'네, 사흘 동안 제가 맡을게요.',
'현장 일은 넘기고 기존 일정만 지킨다':'이번 현장 일은 어려울 것 같아요.',
'고정 테이블을 맡아본다':'고정 테이블 한번 맡아볼게요.',
'계약한 시간까지만 일한다':'오늘은 두 시까지만 할게요.',
'예약과 정산 업무도 배우겠다고 한다':'예약이랑 정산도 배워볼 수 있을까요?',
'낮에 식사하는 조건으로 연락처를 준다':'낮에 식사하는 거면 괜찮아요.',
'가게 예약으로만 만나겠다고 한다':'개인적으로는 어렵고, 가게에서 뵐게요.',
'소하와 함께 식사해도 되는지 묻는다':'소하랑 같이 가도 될까요?',
'퇴사하고 월 300만 원을 받는다':'그 조건이면 일 그만둘게요.',
'처음 합의한 일정만 지키겠다고 한다':'처음 얘기한 일정대로만 만나요.',
'추가 일정을 받고 소하에게 집에 일이 생겼다고 한다':'소하야, 집에 일이 생겨서 그날 못 갈 것 같아.',
'지원을 끝내고 다른 일을 구한다':'지원은 여기까지 받을게요.',
'예약 사무직 면접을 본다':'그 사무직, 면접 볼 수 있을까?',
'가게에 남아 고정 예약을 더 맡는다':'다음 달에도 남을게요. 예약 더 맡아볼게요.',
'일은 유지하고 예약 정리를 따로 맡는다':'일은 계속하고, 예약 정리도 해볼게요.',
'소하와 교육 자료를 만든다':'응, 같이 하자. 내가 맡을 부분 보내줘.',
'사무직에 지원하고 지원 조건을 정리한다':'그 사무직 지원해볼게. 도윤 씨랑도 얘기하고.',
'도윤과 추가 일정을 다시 합의한다':'다시 얘기해요. 만날 날짜부터 정하고요.',
'새 일은 맡지 않고 현재 일정을 정리한다':'이번에는 새 일 안 맡을게.',
'갱신하고 조건을 메시지로 남긴다':'같은 금액으로 더 이어가요. 일정은 적어둘게요.',
'지원을 끝내고 지금 일을 유지한다':'지원은 끝내고, 지금 일은 계속할게요.',
'지원을 끝내고 예약 사무직을 구한다':'지원은 끝내고 일을 다시 구할게요.',
'낮 예약 관리 일로 옮긴다':'낮 예약 관리 일로 옮길게요.',
'현재 일을 유지한다':'이번에는 안 옮기고 지금 일 계속할게요.',
'반환 일정을 확인하고 100만 원을 빌려준다':'일정 확인했어. 100 보내줄게.',
'돈은 어렵고 이사를 돕겠다고 한다':'돈은 어려운데, 이사는 도와줄 수 있어.',
'이번에는 어렵다고 답한다':'미안, 이번에는 어려울 것 같아.',
'300만 원을 투자하고 운영에 참여한다':'300 넣을게. 운영도 같이 할게.',
'투자 없이 사흘만 일한다':'투자는 안 하고, 사흘 일할게.',
'이번 행사는 참여하지 않는다':'이번 행사는 빠질게.'
};
function describe(id,s,c,index){
 if(c.hidden)return {dialogue:c.text,action:c.hint,labels:[],note:'성격 전용 선택지'};
 const t=c.text;if(id.startsWith('n_')&&['n_promise','n_information','n_afterpromise','n_preparation','n_relationship'].includes(id))return {dialogue:t,action:c.hint,labels:[],note:''};let dialogue=dialogues[t]||t;
 if(t==='현장 총괄을 맡는다'&&s.health<45)dialogue='하루 자료 정리만 맡을 수 있을까요?';
 const isQuote=/^[“"]/.test(dialogue);let action=t.replace(/[“”]/g,'');
 const actions={o_first:['민서와 원본 견적을 함께 정리한다.','남은 자료를 혼자 마무리한다.','오늘은 퇴근하고 다음 날 담당자에게 확인한다.'],o_offer:['개인 계좌를 보내고 수정 견적을 제출한다.','개인 입금을 거절하고 정상 견적을 요청한다.','거래처 제안 메시지를 팀장에게 제출한다.'],n_offer:['퇴사 조건에 동의하고 지원 계약을 맺는다.','근무를 유지하는 조건으로 지원금을 협상한다.','정기 지원 제안을 거절한다.']};
 if(actions[id])action=actions[id][index];
 if(t==='현장 총괄을 맡는다'&&s.health<45)action='종일 총괄 대신 하루 자료 정리만 맡는다.';
 if(id==='o_paid')action=index===0?(s.flags.rebate?'견적 변경과 입금받은 사실을 민서에게 알린다.':'민서와 받은 업무 자료를 공유한다.'):(s.flags.reported?'추가 검증 업무의 범위와 보수를 협의한다.':'내역을 직접 확인하고 민서와는 공유하지 않는다.');
 if(id==='o_second'&&s.flags.rebate)action=['민서를 제외하고 다음 차액 거래도 맡는다.','새 거래는 거절하고 이전 입금은 보유한다.','받은 차액을 반환하고 지급 내역 정정을 요청한다.'][index];
 let labels=[];const tag=(text,kind='condition')=>labels.push({text,kind});
 let note='';
 switch(id){
 case 'start':if(s.flags.plan003){tag(['월 급여 '+won(2100000),'월 정산 '+won(4500000),'월 기본 정산 '+won(1200000),'월 기본 보수 '+won(1700000)][index],'reward');if(index===0||index===1)tag('야간 근무');if(index===3)tag('모델 데뷔 아님');return {dialogue:t,action:c.hint,labels,note:''};}tag(['월 급여 '+won(2800000),'월 정산 '+won(4500000),'월 기본 정산 '+won(1200000),'월 급여 '+won(2100000),'월 기본 보수 '+won(1700000)][index],'reward');break;
 case 'o_first':tag(index===2?'추가 보수 없음':'퇴근 지연');if(index!==2)tag('피로 증가','cost');break;
 case 'o_offer':if(index===0){tag('입금 예정 +'+won(6000000),'reward');tag('위험한 거래','risk');note='회사 대금 지급 후 개인 계좌로 받는 제안.';}else if(index===1)tag('개인 보수 없음');else tag('자료 제출 / 금액 미정');break;
 case 'o_paid':tag(s.flags.reported&&index===1?'월 급여 '+won(3200000):'즉시 금전 변화 없음',s.flags.reported&&index===1?'reward':'condition');break;
 case 'o_work':if(index===0){tag('보수 +'+won(1800000),'reward');tag('주말 이틀');tag('피로 증가','cost');}else if(index===1){tag('협의 성사 시 +'+won(900000),'reward');tag('민서와 일정 협의');}else tag('추가 수입 없음 / 휴식');break;
 case 'o_second':if(s.flags.rebate){if(index===0){tag('입금 예정 +'+won(8000000),'reward');tag('위험한 거래','risk');}else if(index===2){tag(won(C.rebateOutstanding(s))+' 필요','cost');tag('반환 −'+won(C.rebateOutstanding(s)),'cost');}else tag('추가 입금 없음');}else if(t.includes('주말 행사')){tag('월 급여 '+won(3400000),'reward');tag('주말 근무','cost');}else if(t.includes('석 달')){tag('월 보수 '+won(3800000),'reward');tag('회사 퇴사 / 90일 계약');}else tag('현재 월수입 유지');break;
 case 'o_credit':tag('즉시 금전 변화 없음');break;
 case 'o_review':if(t.includes('입금 내역')){tag('차액 반환 −'+won(C.rebateOutstanding(s)),'cost');if(s.cash<(C.rebateOutstanding(s)))tag('부족액은 추가 차입','risk');}else if(t.includes('태준에게')){tag('결과 불확실','risk');note='태준이 제출할 자료는 아직 확인하지 못했어.';}else tag('현재 수입 유지');break;
 case 'o_life':if(s.job==='none'){tag(index===0?'월 급여 '+won(2400000):'보수 +'+won(1200000),'reward');if(index===1)tag('단기 업무 / 피로 증가','cost');}else if(index===0){tag('보수 +'+won(s.health<45?600000:s.career>=35?2400000:1500000),'reward');tag(s.health<45?'자료 정리 하루':'현장 사흘');tag('피로 증가','cost');}else tag('추가 수입 없음 / 휴식');break;
 case 'n_first':if(index===0){tag('추가 정산 +'+won(600000),'reward');tag('근무 연장 / 피로 증가','cost');}else if(index===1)tag('현재 정산 조건 유지');else tag('추가 교육 시간');break;
 case 'n_meet':tag(index===1?'가게 안에서만 만남':index===2?'소하 동행':'개인 연락처 공유');break;
 case 'n_offer':if(index===0){tag('월 지원 '+won(3000000),'reward');tag('퇴사 / 90일 지원');tag('주 2회 저녁');}else if(index===1){tag('협의 성사 시 월 '+won(1500000),'reward');tag('조건 협상 / 근무 유지');}else tag('현재 근로수입 유지');break;
 case 'n_conditions':if(s.support){if(index===0)tag('추가 보수 없음 / 기존 일정 요청');else if(index===1){tag('추가 보수 +'+won(s.flags.patronKind==='steady'?2000000:4000000),'reward');tag('생일 약속 취소','cost');tag('피로 증가','cost');if(s.salary)tag('빠지는 근무 정산 −'+won(350000),'cost');}else tag('정기 지원 종료');}else{if(index===0)tag('채용 시 월 '+won(2800000),'reward');else if(index===1){tag('월 정산 예상 '+won(5000000),'reward');tag('야간 업무 증가','cost');}else{tag('보수 +'+won(1000000),'reward');tag('추가 업무 / 피로 증가','cost');}}break;
 case 'n_follow':if(t.includes('교육 자료')){tag('내 보수 +'+won(s.relations.soha>0?1200000:600000),'reward');tag('분담 작업 / 피로 증가','cost');}else if(t.includes('그날 도윤')){tag('지원 관계 정보 공개');tag('이번 교육 보수 없음');}else if(t.includes('사무직')){tag('채용 시 월 '+won(2800000),'reward');if(s.support)tag('현재 지원은 재협의');}else if(t.includes('도윤과')){tag('별도 입금 +'+won(1000000),'reward');tag('월 지원 '+won(3000000),'reward');tag('종료일까지 '+Math.max(0,s.supportEnd-s.day)+'일');}else tag(s.salary||s.support?'현재 수입 유지 / 휴식':'정기 수입 없음');break;
 case 'n_contract':if(t.includes('제 이름')){tag('선금 +'+won(1200000),'reward');tag('예약금 −'+won(1800000),'cost');tag('현금 '+won(600000)+' 필요','cost');tag('추후 현장비 / 성과 변동','risk');}else if(t.includes('반씩')){tag('내 선금 +'+won(600000),'reward');tag('내 예약금 −'+won(900000),'cost');tag('현금 '+won(300000)+' 필요','cost');}else tag('계약 없음 / 현재 수입 유지');break;
 case 'n_settlement':{const e=D.loungeTerms(s);if(index<2){tag('현금 '+won(index===0?e.onsite:e.agency)+' 필요','cost');tag('지출 −'+won(index===0?e.onsite:e.agency),'cost');tag('잔금 '+won(e.baseBalance)+'~'+won(e.baseBalance+e.bonus),'reward');tag('성과금 지급 확률 '+Math.round(D.loungeRate(s)*100)+'%','chance');if(index===0&&D.loungeConflict(s))tag('지원 계약 변경 가능','risk');if(index===1)tag('대행 / 기존 약속 유지');}else{tag('선금 반환 −'+won(e.advance),'cost');tag('기지출 예약금 회수 불가','risk');if(s.cash<e.advance)tag('부족액은 추가 대출','risk');}break;}
 case 'n_renew':if(s.support){if(index===0){tag('월 지원 '+won(s.support),'reward');tag('기존 종료일에서 90일 연장');}else{tag('지원 종료');tag(s.salary?'현재 근로수입 유지':'채용 시 월 '+won(2800000));}}else{if(index===0)tag('월 급여 '+won(s.flags.trainingWork||s.flags.adminGig?3200000:2800000),'reward');else tag('현재 근로수입 유지');}break;
 case 'n_life':if(index===0){tag(won(1000000)+' 필요','cost');tag('대여 −'+won(1000000),'cost');tag('회수 지연 가능','risk');note='약속한 반환 기한은 열흘이지만 늦어질 수 있어.';}else if(index===1)tag('현금 변화 없음 / 반나절 도움');else tag('현금 변화 없음');break;

 case 'v_stream':if(index===0){tag('후원금 +'+won(2500000),'reward');tag('개인 통화 / 사생활 노출','risk');}else tag('개인 연락 없음 / 후원 제한');break;
 case 'v_stream2':if(index===0){tag('광고비 +'+won(4000000),'reward');tag('후기 수정 권한은 광고주','risk');}else tag('광고비 없음');break;
 case 'v_retail':if(index===1){tag(won(400000)+' 필요','cost');tag('보전 −'+won(400000),'cost');}else tag('정산 자료 확인 / 개인 지출 없음');break;
 case 'v_retail2':tag(index===0?'월 급여 '+won(3100000):'월 급여 '+won(2100000),'reward');if(index===0)tag('주말 대응','cost');break;
 case 'v_model':if(index===1){tag('촬영 보수 +'+won(3000000),'reward');tag('사용 범위 미확인','risk');}else tag('계약서 요청 / 보수 없음');break;
 case 'v_model2':if(index===0){tag('촬영 보수 +'+won(4500000),'reward');tag('기존 근로수입 종료','cost');}else tag('월 기본 보수 '+won(1700000),'reward');break;
 case 'common_opportunity':if(index===0){tag('성공 확률 '+Math.round(D.investmentRate(s)*100)+'%','chance');tag('고위험','risk');tag(won(3000000)+' 필요','cost');tag('투자금 −'+won(3000000),'cost');tag('성공 시 총 정산 '+won(8000000),'reward');note='총 정산에는 투자금 회수분이 포함돼. 실패하면 투자금 손실 가능.';}else if(index===1){tag('보수 +'+won(900000),'reward');tag('사흘 근무 / 피로 증가','cost');}else tag('투자와 근무 모두 참여 안 함');break;
 case 'last':{const pay=index===0?Math.min(s.debt,Math.max(0,s.cash-s.rent-s.living)):index===1?Math.min(s.cash,s.debt):0;tag('추가 상환 '+won(pay),pay?'cost':'condition');if(index===0)tag('월세 / 생활비 '+won(s.rent+s.living)+' 확보 목표');if(index===1)tag('생활비까지 사용할 수 있음','risk');break;}
 }
 return {dialogue:id==='last'?t:isQuote?dialogue:dialogues[t]?q(dialogue):t,action,labels,note};
}
return {describe};});
/* 아직 안 망했다 v2.0 — 사건 D 「친구 약혼자 외도 목격」 5분 데모
   시나리오 데이터. 조건/효과는 엔진(engine.js)이 해석한다.
   when:  [[필드, 연산자, 값], ...]  전부 참이어야 노출
   effects: { cash: 증감액, evidenceLevel: 0|1|2, subinTrust: 'normal'|'high'|'shaken'|'broken',
              tookMoney: bool, minjaeHostile: bool, hasWomanInfo: bool, flags: {...}, once: '키' }
   route: [{when, to}, ...] 위에서부터 처음 참인 곳으로. 마지막은 when 없는 기본값. */

var SCENES = {
  /* ───────── 1막. 첫 선택까지 5터치 ───────── */
  D1_01: {
    stamp: '결혼식 D-3',
    type: 'alert',
    img: 'sc-25',
    alerts: [
      { app: '신한카드', kind: 'card', kicker: '이번 달 결제 예정', amount: '1,280,000원', meta: '출금 D-3 · 11/19 자동이체' },
      { app: '토스뱅크', kind: 'bank', kicker: '통장 잔액', amount: '312,400원', meta: '11월 16일 (월) 22:48' }
    ],
    caption: [
      '월급날은 열흘 남았고, 통장엔 30만 원.',
      '이번 달만 넘기면 된다고, 매번 그렇게 생각했다.'
    ],
    next: 'D1_02'
  },

  D1_02: {
    stamp: '결혼식 D-3',
    type: 'kakao',
    img: 'sc-08',
    room: { name: '수빈', note: '친구 · 10년' },
    msgs: [
      { who: '수빈', text: '지나야 나 사회자 너로 할까 진짜 고민 중 ㅋㅋ' },
      { who: '수빈', text: '축의금은 진짜 주지 마! 그냥 와서 많이 먹어' },
      { who: '수빈', text: '드레스 내일 마지막 가봉이야. 나 지금 떨려서 잠이 안 와' }
    ],
    next: 'D1_03'
  },

  D1_03: {
    stamp: '결혼식 D-3',
    type: 'scene',
    img: 'sc-09',
    caption: [
      '수빈이는 늘 착하고, 늘 나보다 여유롭다.',
      '십 년 동안 이 순서가 한 번도 바뀐 적이 없었다.'
    ],
    next: 'D1_04'
  },

  D1_04: {
    stamp: '결혼식 D-3 · 밤 11:40',
    type: 'scene',
    img: 'sc-17',
    caption: [
      '편의점 뒤 골목, 셔터 내린 가게 앞.',
      '흰 벤츠 조수석에서 내린 건 민재 오빠였다.',
      '옆에 탄 여자가 오빠 볼에 입을 맞췄다. 오빠가 고개를 돌려, 나와 눈이 마주쳤다.'
    ],
    next: 'D1_05'
  },

  D1_05: {
    stamp: '결혼식 D-3 · 밤 11:41',
    type: 'kakao',
    img: 'sc-11',
    room: { name: '민재 오빠', note: '수빈이 약혼자' },
    msgs: [
      { who: '민재', text: '지나야 잠깐만.' },
      { who: '민재', text: '어디 가지 마. 1분만.' },
      { who: '민재', text: '제발 수빈이한테 아직 말하지 마.' }
    ],
    next: 'D1_06'
  },

  D1_06: {
    stamp: '결혼식 D-3 · 밤 11:43',
    type: 'choice',
    img: 'sc-17',
    narration: '차 옆에 선 오빠가 숨을 몰아쉬었다. 손이 떨렸다.',
    speaker: '민재',
    lines: [
      '딱 한 번 실수야. 다음 달 결혼인데, 지금 깨지면 양가 다 뒤집어져.',
      '너 카드값 급한 거 들었어. 오늘 못 본 걸로 해주면 500, 지금 바로 보낼게.'
    ],
    choices: [
      {
        text: '500, 지금 바로 보내세요.',
        badge: '+500만 원',
        effects: { cash: 5000000, tookMoney: true, evidenceLevel: 1, flags: { money500: true } },
        once: 'money500',
        next: 'D2_MONEY'
      },
      {
        text: '오빠가 직접 수빈이한테 말해요.',
        badge: '돈 안 받음',
        effects: { tookMoney: false, flags: { gaveDeadline: true } },
        next: 'D2_REFUSE'
      },
      {
        text: '방금 내린 여자, 누구예요?',
        badge: '돈 보류',
        effects: { tookMoney: false, flags: { infoAttempt: true } },
        next: 'D2_INFO'
      }
    ]
  },

  /* ───────── 2막-가. 돈을 받은 길 ───────── */
  D2_MONEY: {
    stamp: '결혼식 D-3 · 밤 11:44',
    type: 'alert',
    img: 'sc-24',
    alerts: [
      { app: '토스', kind: 'bank', kicker: '입금', amount: '+5,000,000원', meta: "박민재 · 메모 '지나 대여금'" },
      { app: '신한카드', kind: 'card', kicker: '이번 달 결제 예정', amount: '1,280,000원', meta: '잔액 충분 · 11/19' }
    ],
    caption: [
      '10초 만에 카드값 걱정이 사라졌다.',
      "메모란의 '대여금' 세 글자가 자꾸 눈에 밟혔다.",
      "1분 뒤 오빠한테서 카톡이 왔다. '오늘 일 아무한테도 말하지 마.'"
    ],
    next: 'D3_MONEY'
  },

  D3_MONEY: {
    stamp: '결혼식 D-3 · 밤 11:52',
    type: 'kakao',
    img: 'sc-06',
    room: { name: '수빈', note: '친구 · 10년' },
    msgs: [
      { who: '수빈', text: '지나야! 민재 오빠가 너 급하다고 500 빌려줬다며??' },
      { who: '수빈', text: '야 나한테 말하지 ㅠㅠ 그래도 오빠가 챙겨줘서 다행이다' },
      { who: '수빈', text: '결혼식 때 꼭 와!! 부케 받아야 해' }
    ],
    caption: ['선수를 쳤다. 나는 이미 "돈 빌린 불쌍한 애"가 되어 있었다.'],
    choices: [
      {
        text: '응, 고마워. 식장에서 보자.',
        effects: { flags: { silent: true } },
        next: 'D4_MAIN'
      },
      {
        text: '(민재에게) 대여금 아니라 입막음이죠.',
        effects: { minjaeHostile: true },
        next: 'D3_MONEY_PUSH'
      }
    ]
  },

  D3_MONEY_PUSH: {
    stamp: '결혼식 D-3 · 밤 11:56',
    type: 'choice',
    img: 'sc-35',
    narration: '답장이 3분 만에 왔다. 이번엔 말투가 달랐다.',
    speaker: '민재',
    lines: [
      '500 받고 뒤통수 치는 거야?',
      '수빈이한테 말하면, 그 돈 빌린 것도 다 알려질 텐데.'
    ],
    caption: ['돈은 이미 통장에 있고, 말은 이미 늦었다.'],
    choices: [
      {
        text: '그래도 말할 거야. 다 보여줄게.',
        effects: { flags: { silent: false } },
        next: 'D4_MAIN'
      },
      {
        text: '…알았어. 아무 말 안 할게.',
        effects: { flags: { silent: true } },
        next: 'D4_MAIN'
      }
    ]
  },

  /* ───────── 2막-나. 거절한 길 ───────── */
  D2_REFUSE: {
    stamp: '결혼식 D-3 · 밤 11:44',
    type: 'scene',
    img: 'sc-10',
    caption: ['오빠가 한 걸음 물러섰다.'],
    speaker: '민재',
    lines: ['…야. 너 진짜 그럴 거야? 다음 달이야, 다음 달.'],
    after: [
      '화도 못 내고, 자꾸 시간을 달라고 했다. 처음 보는 얼굴이었다.',
      '알았어. 내가 직접 말할게. 사흘만 줘.'
    ],
    caption2: ['돈은 안 받았다. 대신 사흘을 줬다.'],
    next: 'D3_REFUSE'
  },

  D3_REFUSE: {
    stamp: '결혼식 D-3 · 밤 12:20',
    type: 'kakao',
    img: 'sc-06',
    room: { name: '수빈', note: '친구 · 10년' },
    msgs: [
      { who: '수빈', text: '지나야 혹시 어제 민재 오빠 봤어?' },
      { who: '수빈', text: "오빠가 갑자기 나한테 '지나가 무슨 말 하던?' 이러는 거 있지" },
      { who: '수빈', text: '둘이 무슨 일 있어? 나 요즘 잠이 안 와' }
    ],
    caption: ['사흘째. 오빠는 아직 말하지 않았다.'],
    choices: [
      {
        text: '오빠가 직접 말할 거야. 나는 기다려.',
        effects: { subinTrust: 'high' },
        next: 'D4_WAIT'
      },
      {
        text: '어젯밤에 오빠 봤어. 다른 여자랑 있었어.',
        effects: { subinTrust: 'shaken' },
        next: 'D4_SHAKEN'
      },
      {
        text: '아무 일도 아냐. 내가 피곤했나 봐.',
        effects: { flags: { silent: true } },
        next: 'D4_MAIN'
      }
    ]
  },

  D4_WAIT: {
    stamp: '결혼식 D-1 · 밤 11:00',
    type: 'scene',
    img: 'sc-15',
    caption: ['사흘째 밤 11시. 수빈이한테서 전화가 왔다.'],
    speaker: '수빈',
    lines: [
      '지나야. 오빠가 다 말했어.',
      '드레스 입고 거울 보고 있었는데, 갑자기 웃음이 나더라.'
    ],
    after: ['수빈이는 울지도, 화내지도 않았다. 그게 더 무서웠다.'],
    caption2: ['나는 택시를 잡았다. 카드값 문자는 아직 읽지 않았다.'],
    next: 'END_CONFESS'
  },

  D4_SHAKEN: {
    stamp: '결혼식 D-2 · 새벽 1:10',
    type: 'choice',
    img: 'sc-26',
    narration: '수빈이의 답장이 늦었다. 말풍선이 세 번이나 떴다가 사라졌다.',
    speaker: '수빈',
    lines: [
      '너 지금 장난하는 거 아니지.',
      '내일이 결혼식인데. 증거는 있어? 사진이라도.'
    ],
    caption: ['아무것도 없었다. 내가 본 것 말고는.'],
    choices: [
      {
        text: '미안. 내가 잘못 봤나 봐.',
        effects: { flags: { backedDown: true } },
        next: 'END_ISOLATED'
      },
      {
        text: '증거는 없어. 근데 내가 본 건 사실이야.',
        effects: { flags: { stoodGround: true } },
        next: 'END_WALK_AWAY'
      }
    ]
  },

  /* ───────── 2막-다. 정보를 캐는 길 ───────── */
  D2_INFO: {
    stamp: '결혼식 D-3 · 밤 11:45',
    type: 'scene',
    img: 'sc-07',
    caption: ['오빠가 눈을 피했다.'],
    speaker: '민재',
    lines: [
      '…회사 거래처 팀장 동생이야. 술 마시고 데려다준 것뿐이야.',
      '그리고 500 얘기는 잊어. 너도 지금 그거 받을 처지 아니잖아.'
    ],
    after: ['말끝이 자꾸 흐려졌다. 번호판은 32라 8**7. 여자 코트엔 낯선 로고가 있었다.'],
    caption2: ['정보를 캐려다, 내 처지까지 읽혔다.'],
    next: 'D3_INFO'
  },

  D3_INFO: {
    stamp: '결혼식 D-2',
    type: 'choice',
    img: 'sc-33',
    narration: '이틀 뒤. 그 여자가 누구인지 알면 판이 달라질 것 같았다. 방법마다 잃을 게 달랐다.',
    choices: [
      {
        text: '민재 회사 후배한테 슬쩍 물어본다.',
        badge: '발각 위험',
        effects: { hasWomanInfo: true, evidenceLevel: 2, minjaeHostile: true, subinTrust: 'shaken' },
        next: 'D3_INFO_CAUGHT'
      },
      {
        text: '차 번호로 혼자 조용히 찾아본다.',
        badge: '근거 약함',
        effects: { evidenceLevel: 1 },
        next: 'D3_INFO_QUIET'
      },
      {
        text: '그 여자에게 직접 가서 물어본다.',
        badge: '망신 위험',
        outcomes: [
          { p: 0.5, effects: { hasWomanInfo: true, evidenceLevel: 2, minjaeHostile: true, subinTrust: 'shaken' }, next: 'D3_INFO_BRAZEN_WIN' },
          { p: 0.5, effects: { hasWomanInfo: false, evidenceLevel: 0, minjaeHostile: true, subinTrust: 'broken' }, next: 'D3_INFO_BRAZEN_FAIL' }
        ]
      }
    ]
  },

  D3_INFO_CAUGHT: {
    stamp: '결혼식 D-1',
    type: 'kakao',
    img: 'sc-27',
    room: { name: '민재 오빠', note: '수빈이 약혼자' },
    msgs: [
      { who: '민재', text: '너 우리 회사 사람들한테 내 얘기 하고 다녔어? 미쳤구나.' },
      { who: '수빈', text: '지나야… 오빠가 너 요즘 이상하다는데. 나 무서워' }
    ],
    caption: [
      '그 여자는 ○○건설 대표의 조카, 김서연.',
      '정보는 얻었다. 대신 오빠는 이제 나를 적으로 본다.'
    ],
    next: 'D4_MAIN'
  },

  D3_INFO_QUIET: {
    stamp: '결혼식 D-1',
    type: 'choice',
    img: 'sc-27',
    narration: '번호판으로 찾은 건 대리운전 기록과 등기 이전 내역뿐이었다.',
    caption: ['확실한 건 아무것도 없다. 다만 그날 밤을 세 번 다시 떠올렸다.'],
    choices: [
      {
        text: '수빈이한테 먼저 물어본다. "오빠 요즘 어때?"',
        effects: { subinTrust: 'high' },
        next: 'D3_INFO_ASK'
      },
      {
        text: '그냥 덮는다. 결혼식은 참석.',
        effects: { flags: { dropped: true } },
        next: 'D4_MAIN'
      }
    ]
  },

  D3_INFO_ASK: {
    stamp: '결혼식 D-1',
    type: 'scene',
    img: 'sc-13',
    caption: ['수빈이에게 오빠 얘기를 꺼냈다. 웃고 있던 얼굴이 굳었다.'],
    speaker: '수빈',
    lines: ['…나도 이상하다고 생각했어. 오빠 폰에 모르는 번호가 자꾸 떠.'],
    after: ['수빈이가 먼저 찾아 나섰다. 사흘 뒤, 그녀 손에 사진 한 장이 남았다.'],
    effects: { subinTrust: 'high', evidenceLevel: 2 },
    next: 'D4_MAIN'
  },

  D3_INFO_BRAZEN_WIN: {
    stamp: '결혼식 D-2',
    type: 'scene',
    img: 'sc-38',
    caption: ['그 여자는 내 이름을 듣고도 놀라지 않았다. 오히려 명함을 먼저 내밀었다.'],
    speaker: '서연',
    lines: ['민재 씨한테 얘기 많이 들었어요. …근데 저, 다음 달에 결혼해요. 민재 씨랑.'],
    after: [
      '머릿속이 하얘졌다. 이 여자는 민재의 또 다른 약혼녀였다.',
      '이름, 소속, 그리고 이 대화까지. 이제 내 손에 다 있다.'
    ],
    next: 'D4_MAIN'
  },

  D3_INFO_BRAZEN_FAIL: {
    stamp: '결혼식 D-2',
    type: 'kakao',
    img: 'sc-35',
    room: { name: '민재 오빠', note: '수빈이 약혼자' },
    msgs: [
      { who: '민재', text: '너 지금 내 여자한테 찾아가서 뭐 한 거야?' },
      { who: '수빈', text: '지나야, 오빠가 너가 이상한 여자한테 시비 걸었다는데. 나 진짜 무서워.' }
    ],
    caption: ['정보는 못 얻었고, 소문만 남았다.'],
    next: 'D4_MAIN'
  },

  /* ───────── 3막. 결혼식 전날 밤 ───────── */
  D4_MAIN: {
    stamp: '결혼식 D-0 · 밤 11:00',
    type: 'kakao',
    img: 'sc-06',
    room: { name: '수빈', note: '친구 · 10년' },
    msgs: [
      { who: '수빈', text: '내일 부케 꼭 받아줘. 약속해.' },
      { who: '수빈', text: '지나야, 고마워. 진짜.' }
    ],
    caption: ['답장을 쓰다 지웠다. 세 번째에 손이 멈췄다.'],
    choices: [
      {
        text: '(아무 말 없이 내일 결혼식에 간다)',
        route: [
          { when: [['tookMoney', '=', true]], to: 'END_SILENT_RICH' },
          { to: 'END_WALK_AWAY' }
        ]
      },
      {
        text: '(수빈이에게 지금 다 말한다)',
        next: 'D4_REVEAL'
      },
      {
        text: '(그 여자 이름 쥐고 민재에게 전화한다)',
        when: [['hasWomanInfo', '=', true]],
        badge: '협상',
        next: 'D4_DEAL'
      },
      {
        text: '(500만 원 돌려보내고 조용히 사라진다)',
        when: [['tookMoney', '=', true]],
        badge: '전액 반환',
        effects: { cash: -5000000, tookMoney: false, flags: { returned500: true } },
        next: 'D4_RETURN'
      }
    ]
  },

  D4_REVEAL: {
    stamp: '결혼식 D-0 · 새벽 2:00',
    type: 'scene',
    route: [
      { when: [['tookMoney', '=', true]], to: 'D4_REVEAL_BOUGHT' },
      { when: [['evidenceLevel', '>=', 2], ['subinTrust', '!=', 'shaken'], ['subinTrust', '!=', 'broken']], to: 'D4_REVEAL_WIN' },
      { when: [['evidenceLevel', '>=', 2]], to: 'D4_REVEAL_DISTANT' },
      { to: 'D4_REVEAL_LOSS' }
    ],
    caption: [
      '내가 본 것과 오간 말을 전부 적어서 보냈다.',
      '보내고 나서, 휴대폰을 뒤집어 놓았다.'
    ]
  },

  D4_REVEAL_BOUGHT: {
    stamp: '결혼식 D-0 · 새벽 2:40',
    type: 'scene',
    img: 'sc-26',
    speaker: '민재',
    lines: ['돈 받아 먹고 이제 와서 뒤통수? 영수증 내가 올릴까?'],
    caption2: ['민재는 정말 올렸다. "지나 대여금 5,000,000" 캡처를, 단톡방에.', '엎어진 건 식장이 아니라, 내 자리였다.'],
    next: 'END_BURNED'
  },

  D4_REVEAL_WIN: {
    stamp: '결혼식 D-0 · 새벽 3:10',
    type: 'scene',
    img: 'sc-09',
    speaker: '수빈',
    lines: [
      '…나 그 여자한테 어제 직접 들었어.',
      '너 혼자 알고 있었으면서, 나한테는 왜 말 안 했어.'
    ],
    caption2: ['결혼식은 취소됐다. 수빈이는 사흘을 울었다.'],
    next: 'END_TRUTH'
  },

  D4_REVEAL_DISTANT: {
    stamp: '결혼식 D-0 · 새벽 3:10',
    type: 'scene',
    img: 'sc-40',
    speaker: '수빈',
    lines: ['증거는 있네.', '근데 너, 왜 이제야 말해? 나 계속 옆에 있었는데.'],
    caption2: ['파혼은 했다. 그리고 수빈이는 나를 다시 부르지 않았다.'],
    next: 'END_TRUTH_DISTANT'
  },

  D4_REVEAL_LOSS: {
    stamp: '결혼식 D-0 · 새벽 3:10',
    type: 'scene',
    img: 'sc-40',
    speaker: '수빈',
    lines: ['사진도 없이, 말로만?', '지나야, 나 결혼해. 미안.'],
    caption2: ['그 뒤로 수빈이에게서 카톡이 오지 않는다.'],
    next: 'END_ISOLATED'
  },

  D4_DEAL: {
    stamp: '결혼식 D-0 · 밤 11:30',
    type: 'choice',
    img: 'sc-44',
    narration: '민재 오빠를 조용한 데로 불렀다. 그 여자 이름을 꺼내자 얼굴이 하얗게 질렸다.',
    speaker: '민재',
    lines: ['…뭘 원해.'],
    choices: [
      {
        text: '이직 자리. 오빠 회사 협력사 MD로.',
        effects: { flags: { deal: 'job' } },
        next: 'END_DEAL'
      },
      {
        text: '2,000만 원. 계좌로.',
        effects: { cash: 20000000, tookMoney: true, flags: { deal: 'money' } },
        once: 'dealMoney',
        next: 'END_DEAL'
      }
    ]
  },

  D4_RETURN: {
    stamp: '결혼식 D-0 · 밤 11:40',
    type: 'scene',
    img: 'sc-45',
    caption: [
      '토스로 5,000,000원을 돌려보냈다. 메모는 비워 뒀다.',
      '카드값 문자는 다시 왔다. 이번엔 읽지 않았다.'
    ],
    next: 'END_WALK_AWAY'
  },

  /* ───────── 엔딩 8종 ───────── */
  END_SILENT_RICH: {
    type: 'ending', no: 'ENDING 01', img: 'sc-26',
    title: '조용한 사람',
    body: [
      '결혼식은 예정대로 치러졌다. 나는 부케를 받고, 사진 앞에서 웃었다.',
      '카드값은 사라졌다. 대신 수빈이와 밥을 먹을 때마다 민재가 먼저 계산했다.',
      '그 사람은 끝까지 친절했다. 친절할수록, 나는 아무 말도 못 했다.'
    ],
    note: '카드값은 막았다 · 말할 수 있는 자리는 잃었다'
  },

  END_BURNED: {
    type: 'ending', no: 'ENDING 02', img: 'sc-40',
    title: '돈 받은 사람',
    body: [
      '단톡방에 올라온 건, 내 사정을 적은 영수증 한 장이었다.',
      '수빈이는 나를 보지 않았고, 민재는 위로받는 사람이 됐다.',
      '돈은 남았다. 그 돈으로 할 수 있는 일이 하나 줄었을 뿐이다.'
    ],
    note: '돈은 남았다 · 사람은 남지 않았다'
  },

  END_CONFESS: {
    type: 'ending', no: 'ENDING 03', img: 'sc-15',
    title: '직접 말하게 한 사람',
    body: [
      '민재는 사흘째 밤, 드레스를 입은 수빈이 앞에서 다 말했다.',
      '수빈이는 결혼을 미뤘다. 깨진 게 아니라, 미뤘다.',
      '일주일 뒤 우리는 같은 카페에 앉아 아무 일도 없던 것처럼 웃었다. 그게 제일 어려운 일이었다.'
    ],
    note: '돈 0원 · 우정 유지 · 결혼은 보류'
  },

  END_TRUTH: {
    type: 'ending', no: 'ENDING 04', img: 'sc-38',
    title: '부케를 받지 않은 사람',
    body: [
      '결혼식은 취소됐다. 홀 예약금을 누가 냈는지는 아무도 말하지 않았다.',
      '수빈이는 사흘을 울고, 나흘째에 "밥은 먹었어?"라고 물었다.',
      '카드값은 그대로다. 그런데 이번 달은, 왜인지 덜 무섭다.'
    ],
    note: '돈 0원 · 수빈이와의 사이 유지'
  },

  END_TRUTH_DISTANT: {
    type: 'ending', no: 'ENDING 05', img: 'sc-09',
    title: '증거를 든 사람',
    body: [
      '증거는 완벽했다. 파혼도 깔끔했다.',
      '다만 수빈이는 내가 그걸 사흘 동안 혼자 들고 있었다는 걸, 끝내 이해하지 못했다.',
      '명백한 사람과 믿을 만한 사람은 다르다는 걸 그때 배웠다.'
    ],
    note: '옳았지만 늦었다 · 거리는 남았다'
  },

  END_ISOLATED: {
    type: 'ending', no: 'ENDING 06', img: 'sc-23',
    title: '빈자리',
    body: [
      '결혼식은 치러졌다. 나는 초대받지 못했다.',
      '십 년치 대화가 사라진 자리에는 아무것도 남지 않았다.',
      '가끔 그 방에 내가 앉아 있던 의자를 떠올린다.'
    ],
    note: '잃은 것: 친구 하나, 그 외 전부'
  },

  END_DEAL: {
    type: 'ending', no: 'ENDING 07', img: 'sc-44',
    title: '새 줄',
    body: [
      '민재는 값을 치렀다. 나는 그 값을 받았다.',
      '새 자리는 좋았다. 월급도, 명함도, 사람들도.',
      '다만 회식 자리에서 민재를 마주칠 때마다, 우리는 서로의 이름을 부르지 않는다.'
    ],
    note: '수빈이는 끝까지 모른다'
  },

  END_WALK_AWAY: {
    type: 'ending', no: 'ENDING 08', img: 'sc-45',
    title: '각자의 길',
    body: [
      '나는 축의금을 내고, 부케를 받지 않고, 먼저 나왔다.',
      '수빈이는 행복해 보였다. 민재도. 그 장면이 진짜인지는 끝까지 모른 채로.',
      '집에 돌아와 카드값 문자를 확인했다. 128만 원. 이번엔 내가 갚는다.'
    ],
    note: '아무 일도 일어나지 않았다'
  }
};

if (typeof module === 'object' && module.exports) module.exports = SCENES;

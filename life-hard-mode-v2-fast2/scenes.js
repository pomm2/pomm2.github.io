/* 아직 안 망했다 v2.0-fast2 — 사건 D 「친구 약혼자 외도 목격」
   시나리오 데이터. 조건/효과는 엔진(engine.js)이 해석한다.
   when:  [[필드, 연산자, 값], ...]  전부 참이어야 노출
   effects: { cash: 증감액, evidenceLevel: 0|1|2, subinTrust: 'normal'|'high'|'shaken'|'broken',
              tookMoney: bool, minjaeHostile: bool, hasWomanInfo: bool, flags: {...}, once: '키' }
   route: [{when, to}, ...] 위에서부터 처음 참인 곳으로. 마지막은 when 없는 기본값.

   fast2 원칙
   - 같은 화면으로 합류하는 경로는, 합류 직전에 인물이 아는 사실과 감정 상태가 같은 경로끼리만 묶는다.
     (수빈이 500만 원을 모르는 경로 → D4_MAIN / 의심하는 경로 → D4_DOUBT /
      거리를 둔 경로 → D4_COLD / 이미 사진을 본 경로 → D4_ASKED / 어제 답을 못 들은 경로 → D4_SILENT)
   - 화면 문장은 사건의 의미를 해설하지 않고, 실제 대사·행동·알림·침묵으로만 전달한다. */

var SCENES = {
  /* ───────── 1막. 목격 → 첫 선택. 화면 3컷, 첫 선택까지 터치 2회 ───────── */
  D1_01: {
    stamp: '결혼식 D-3 · 밤 11:40',
    type: 'scene',
    img: 'sc-17',
    caption: [
      '편의점 뒤 골목. 흰 벤츠 조수석 문이 열리고 민재 오빠가 내렸다.',
      '운전석에서 내린 여자가 오빠 볼에 입을 맞혔다. 오빠가 고개를 돌렸다가 나랑 눈이 맞았다.'
    ],
    speaker: '민재',
    lines: ['…지나야?'],
    after: [
      '오빠가 차 문을 닫고 이쪽으로 걸어온다.',
      '주머니에서 전화가 울린다. 수빈이다.'
    ],
    next: 'D1_02'
  },

  D1_02: {
    stamp: '결혼식 D-3 · 밤 11:41',
    type: 'kakao',
    img: 'sc-11',
    rooms: [
      {
        name: '수빈', note: '친구 · 10년',
        msgs: [
          { who: '수빈', text: '지나야~ 내일 드레스 최종 가봉인데 나랑 같이 갈래?' },
          { who: '수빈', text: '오빠 폰이 요즘 자꾸 거꾸로 놓여 있어서 기분이 이상해 ㅠㅠ 나 미쳤나' }
        ]
      },
      {
        name: '민재 오빠', note: '수빈이 약혼자',
        msgs: [
          { who: '민재', text: '지나야 가지 마.' },
          { who: '민재', text: '1분이면 돼. 수빈이한테만은 아직 말하지 마.' }
        ]
      }
    ],
    caption: ['답장을 고르는 사이, 오빠가 내 앞에 섰다.'],
    next: 'D1_03'
  },

  D1_03: {
    stamp: '결혼식 D-3 · 밤 11:42',
    type: 'choice',
    img: 'sc-35',
    alerts: [
      { app: '신한카드', kind: 'card', kicker: '이번 달 결제 예정', amount: '1,280,000원', meta: '11/19 자동이체' },
      { app: '토스뱅크', kind: 'bank', kicker: '통장 잔액', amount: '310,000원', meta: '월급 D-10' }
    ],
    speaker: '민재',
    lines: [
      '딱 한 번 실수야. 사흘 뒤가 결혼인데, 지금 깨지면 양가 다 뒤집어져.',
      '수빈이한테 들었어. 너 이번 달 카드값 막막하다고. 오늘 일 못 본 걸로 해주면 500 보낼게. 지금 바로.'
    ],
    choices: [
      {
        text: '보내주세요. 오늘 일은 없었던 걸로 할게요.',
        badge: '+500만 원',
        effects: { cash: 5000000, tookMoney: true, evidenceLevel: 1, flags: { money500: true } },
        once: 'money500',
        next: 'D2_MONEY'
      },
      {
        text: '돈은 안 받을게요. 오빠가 직접 수빈이한테 말해요.',
        badge: '돈 안 받음',
        effects: { tookMoney: false, flags: { gaveDeadline: true } },
        next: 'D2_REFUSE'
      },
      {
        text: '방금 내린 사람, 누구예요?',
        badge: '돈 보류',
        effects: { tookMoney: false, flags: { infoAttempt: true } },
        next: 'D2_INFO'
      }
    ]
  },

  /* ───────── 2막-가. 돈을 받은 길: 입금 → 다음 날 아침 수빈 → 두 번째 선택 ───────── */
  D2_MONEY: {
    stamp: '결혼식 D-3 · 밤 11:44',
    type: 'alert',
    img: 'sc-24',
    alerts: [
      { app: '토스뱅크', kind: 'bank', kicker: '입금', amount: '+5,000,000원', meta: "박민재 · 메모 '지나 대여금'" },
      { app: '신한카드', kind: 'card', kicker: '11/19 결제 예정', amount: '1,280,000원', meta: '잔액 5,310,000원' }
    ],
    caption: [
      '잔액 5,310,000원. 모자라던 카드값이 채워졌다.',
      "메모란에는 '대여금' 세 글자."
    ],
    next: 'D2_MONEY_PROBLEM'
  },

  D2_MONEY_PROBLEM: {
    stamp: '결혼식 D-2 · 아침 8:12',
    type: 'kakao',
    img: 'sc-06',
    rooms: [
      {
        name: '수빈', note: '친구 · 10년',
        msgs: [
          { who: '수빈', text: '지나야. 오빠 폰 충전기 꽂아주다가 알림 봤어.' },
          { who: '수빈', text: '어제 밤 11시 44분, 박민재 → 지나 5,000,000원' },
          { who: '수빈', text: '너 둘 어제 만났지. 어디서?' }
        ]
      }
    ],
    caption: ['답장을 쓰다 지웠다. 수빈이한테서 전화가 온다.'],
    next: 'D2_MONEY_CHOICE'
  },

  D2_MONEY_CHOICE: {
    stamp: '결혼식 D-2 · 아침 8:20',
    type: 'choice',
    img: 'sc-26',
    narration: '벨이 세 번 울렸다. 그 사이 수빈이 문자를 두 개 더 보냈다.',
    choices: [
      {
        text: '받아서, 오빠한테 카드값 빌린 거라고 말한다.',
        effects: { flags: { toldTruthMoney: true } },
        next: 'D2_MONEY_HONEST'
      },
      {
        text: '안 받고 문자로 보낸다. "아무 일 없었어. 오빠한테 말하지 마."',
        effects: { flags: { covered: true } },
        next: 'D2_MONEY_HIDE'
      },
      {
        text: '전화를 받지 않는다.',
        effects: { flags: { ignoredCall: true } },
        next: 'D2_MONEY_IGNORE'
      }
    ]
  },

  D2_MONEY_HONEST: {
    stamp: '결혼식 D-2 · 오전 9:05',
    type: 'kakao',
    img: 'sc-06',
    rooms: [
      {
        name: '수빈', note: '친구 · 10년',
        msgs: [
          { who: '수빈', text: '아 그래… 카드값이 그렇게 급했어?' },
          { who: '수빈', text: '근데 오빠가 네 카드값을 어떻게 알았대? 나는 오빠한테 그런 얘기 한 적 없는데.' },
          { who: '수빈', text: '내일 오빠한테 한 번 물어볼게. 가봉 끝나고.' }
        ]
      }
    ],
    caption: ['통화는 4분 만에 끝났다. 마지막 1분은 서로 아무 말도 하지 않았다.'],
    effects: { subinTrust: 'high' },
    next: 'D4_DOUBT'
  },

  D2_MONEY_HIDE: {
    stamp: '결혼식 D-2 · 오전 9:20',
    type: 'kakao',
    img: 'sc-06',
    rooms: [
      {
        name: '수빈', note: '친구 · 10년',
        msgs: [
          { who: '수빈', text: '뭐야 이게.' },
          { who: '수빈', text: '문자 보낼 시간은 있네.' },
          { who: '수빈', text: '알았어. 내가 직접 알아볼게.' }
        ]
      }
    ],
    caption: ['5분 뒤 오빠한테서 카톡이 왔다. "수빈이한테는 내가 얘기할게. 너는 아무 말 하지 마."'],
    effects: { subinTrust: 'shaken' },
    next: 'D4_DOUBT'
  },

  D2_MONEY_IGNORE: {
    stamp: '결혼식 D-2 · 오전 9:40',
    type: 'scene',
    img: 'sc-23',
    caption: ['전화를 받지 않았다. 네 번 울리고 끊겼다.', '곧 음성 메시지가 왔다.'],
    speaker: '수빈',
    lines: [
      '안 받는 거 봐.',
      '오늘 가봉 끝나고 네 집 앞으로 갈게. 그때 얼굴 보고 얘기하자.'
    ],
    after: ['저녁에 수빈이가 현관 앞에 왔다. 초인종을 세 번 눌렀다.'],
    caption2: ['카톡이 한 통 왔다. "나 오빠한테 직접 물어볼게."'],
    effects: { subinTrust: 'shaken' },
    next: 'D4_DOUBT'
  },

  /* ───────── 2막-나. 거절한 길: 사흘의 약속 → 입막음용 거짓말 → 두 번째 선택 ───────── */
  D2_REFUSE: {
    stamp: '결혼식 D-3 · 밤 11:44',
    type: 'scene',
    img: 'sc-10',
    caption: ['오빠가 한 걸음 물러섰다.'],
    speaker: '민재',
    lines: [
      '…야. 지금 말하면 다 끝장이야. 결혼식 사흘 남았어.',
      '알았어. 내가 말할게. 사흘만 줘. 결혼식 끝나고 내가 직접 말할게.'
    ],
    after: ['오빠는 화를 내지 않았다. 고개를 두 번 숙이고 차 문을 잡았다.'],
    next: 'D2_REFUSE_DEAL'
  },

  D2_REFUSE_DEAL: {
    stamp: '결혼식 D-3 · 밤 11:45',
    type: 'choice',
    img: 'sc-13',
    narration: '오빠가 시동을 걸지 않고 창문을 내렸다.',
    speaker: '민재',
    lines: [
      '하나만 부탁하자.',
      '수빈이가 오늘 뭐 했냐고 물으면 야근이라고 해줘. 내가 말할 때까지만.'
    ],
    choices: [
      {
        text: '그 말은 해줄게. 사흘이니까.',
        effects: { flags: { coverStory: true } },
        next: 'D2_REFUSE_COVER'
      },
      {
        text: '거짓말은 안 할게요. 말할 거면 내일 해요.',
        effects: { flags: { noCover: true } },
        next: 'D2_REFUSE_NOLIE'
      }
    ]
  },

  D2_REFUSE_COVER: {
    stamp: '결혼식 D-2 · 낮 12:10',
    type: 'kakao',
    img: 'sc-06',
    rooms: [
      {
        name: '수빈', note: '친구 · 10년',
        msgs: [
          { who: '수빈', text: '지나야 오빠 어제 뭐 했어? 오빠 동료가 우리 골목에서 봤다던데' },
          { who: '수빈', text: '야근이라고? ㅎㅎ 그렇겠지' },
          { who: '수빈', text: '근데 요즘 오빠가 폰을 뒤집어 놓는 게 자꾸 신경 쓰여 ㅠㅠ' }
        ]
      }
    ],
    caption: ['세 번째 메시지에는 답이 없었다.'],
    effects: { subinTrust: 'high' },
    next: 'D3_REFUSE'
  },

  D2_REFUSE_NOLIE: {
    stamp: '결혼식 D-3 · 밤 11:52',
    type: 'scene',
    img: 'sc-45',
    caption: ['오빠가 차에 올라타고, 시동 걸기 전에 창문을 내렸다.'],
    speaker: '민재',
    lines: ['그럼 내가 내일 말할게. 거짓말은 안 해도 돼.'],
    after: ['차가 골목을 나갔다.'],
    next: 'D3_REFUSE'
  },

  D3_REFUSE: {
    stamp: '결혼식 D-1 · 밤 10:20',
    type: 'kakao',
    img: 'sc-06',
    room: { name: '수빈', note: '친구 · 10년' },
    msgs: [
      { who: '수빈', text: '지나야 혹시 어제 민재 오빠 봤어?' },
      { who: '수빈', text: "오빠가 갑자기 나한테 '지나가 무슨 말 하던?' 이러는 거 있지" },
      { who: '수빈', text: '둘이 무슨 일 있어? 나 내일 결혼인데 잠이 안 와' }
    ],
    caption: ['오빠는 아직 말하지 않았다. 결혼식은 내일이다.'],
    choices: [
      {
        text: '오빠가 직접 말할 거야. 조금만 기다려줘.',
        effects: { subinTrust: 'high' },
        next: 'D4_WAIT'
      },
      {
        text: '3일 전 밤에 오빠 봤어. 다른 여자랑 있었어.',
        effects: { subinTrust: 'shaken' },
        next: 'D4_SHAKEN'
      },
      {
        text: '아무 일도 아냐. 내가 예민했나 봐.',
        effects: { flags: { silent: true } },
        next: 'D4_SILENT'
      }
    ]
  },

  /* ───────── 2막-다. 정보를 캐는 길: 얼버무림 → 대가를 치르는 두 번째 선택 ───────── */
  D2_INFO: {
    stamp: '결혼식 D-3 · 밤 11:45',
    type: 'scene',
    img: 'sc-07',
    caption: ['오빠가 내 눈을 안 보고 대답했다.'],
    speaker: '민재',
    lines: [
      '…거래처 팀장 동생이야. 술 마시고 데려다준 것뿐이야.',
      '500 얘기는 없던 걸로 해. 그 돈 받으면 네가 더 곤란해져.'
    ],
    after: [
      '평소처럼 말했다. 차 키는 세 번이나 떨어뜨렸다.',
      '번호판은 32라 8**7. 여자 코트 가슴팍에 낯선 로고가 있었다.'
    ],
    next: 'D3_INFO'
  },

  D3_INFO: {
    stamp: '결혼식 D-2',
    type: 'choice',
    img: 'sc-33',
    narration: '하루 뒤. 회사 화장실에서 번호판 사진을 다시 열었다.',
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
        text: '그 여자한테 직접 가서 물어본다.',
        badge: '망신 위험',
        outcomes: [
          { p: 0.5, effects: { hasWomanInfo: true, evidenceLevel: 2, minjaeHostile: true }, next: 'D3_INFO_BRAZEN_WIN' },
          { p: 0.5, effects: { hasWomanInfo: false, evidenceLevel: 0, minjaeHostile: true, subinTrust: 'broken' }, next: 'D3_INFO_BRAZEN_FAIL' }
        ]
      }
    ]
  },

  D3_INFO_CAUGHT: {
    stamp: '결혼식 D-1',
    type: 'kakao',
    img: 'sc-27',
    rooms: [
      {
        name: '민재 오빠', note: '수빈이 약혼자',
        msgs: [
          { who: '민재', text: '너 우리 회사 사람들한테 내 얘기 하고 다녔어?' }
        ]
      },
      {
        name: '수빈', note: '친구 · 10년',
        msgs: [
          { who: '수빈', text: '지나야… 오빠가 너 요즘 이상하다는데. 나 무서워' }
        ]
      }
    ],
    caption: [
      '후배는 세 번 묻자 바로 말했다. 그 여자는 ○○건설 대표 조카, 김서연.',
      '오후에 민재 오빠한테서 전화가 두 번 왔다. 받지 않았다.'
    ],
    next: 'D4_COLD'
  },

  D3_INFO_QUIET: {
    stamp: '결혼식 D-1',
    type: 'choice',
    img: 'sc-27',
    narration: '번호판으로 나온 건 차종과 등록 지역뿐이었다.',
    caption: ['메모장에 번호를 적어 뒀다. 32라 8**7. 그게 내가 가진 전부였다.'],
    choices: [
      {
        text: '수빈이한테 먼저 물어본다. "오빠 요즘 어때?"',
        effects: { subinTrust: 'high' },
        next: 'D3_INFO_ASK'
      },
      {
        text: '그냥 덮는다. 결혼식은 간다.',
        effects: { flags: { dropped: true } },
        next: 'D4_MAIN'
      }
    ]
  },

  D3_INFO_ASK: {
    stamp: '결혼식 D-1',
    type: 'scene',
    img: 'sc-13',
    caption: ['수빈이한테 3일 전 밤에 본 걸 꺼냈다.'],
    speaker: '수빈',
    lines: [
      '…나도 이상하다고 생각했어. 오빠 폰에 모르는 번호가 자꾸 떠.',
      '내가 한번 찾아볼게. 너는 내일 그냥 와.'
    ],
    after: ['수빈이는 그날 밤 웨딩홀 근처 카페에 갔다. 나는 따라가지 않았다.'],
    effects: { subinTrust: 'high', evidenceLevel: 2, flags: { subinMetWoman: true } },
    next: 'D4_ASKED'
  },

  D3_INFO_BRAZEN_WIN: {
    stamp: '결혼식 D-2',
    type: 'scene',
    img: 'sc-38',
    caption: ['그 여자는 내 이름을 듣고도 놀라지 않았다. 명함을 먼저 내밀었다.'],
    speaker: '서연',
    lines: ['민재 씨한테 얘기 많이 들었어요. …저, 다음 달에 결혼해요. 민재 씨랑.'],
    after: [
      '웨딩홀 이름이 내가 아는 곳이었다.',
      '서연은 명함 뒤에 자기 번호를 적어서 건넸다.'
    ],
    next: 'D4_MAIN'
  },

  D3_INFO_BRAZEN_FAIL: {
    stamp: '결혼식 D-2',
    type: 'kakao',
    img: 'sc-35',
    rooms: [
      {
        name: '민재 오빠', note: '수빈이 약혼자',
        msgs: [
          { who: '민재', text: '너 지금 내 여자한테 찾아가서 뭐 한 거야?' }
        ]
      },
      {
        name: '수빈', note: '친구 · 10년',
        msgs: [
          { who: '수빈', text: '지나야, 오빠가 너가 이상한 여자한테 시비 걸었다는데. 나 진짜 무서워.' }
        ]
      }
    ],
    caption: ['초인종은 세 번 울렸고 문은 열리지 않았다.', '저녁에 민재 오빠한테서 전화가 세 번 왔다. 받지 않았다.'],
    next: 'D4_COLD'
  },

  /* ───────── 3막. 결혼식 전날 밤 — 경로별로 인물이 아는 사실이 다르다 ───────── */
  D4_WAIT: {
    stamp: '결혼식 D-1 · 밤 11:00',
    type: 'scene',
    img: 'sc-15',
    caption: ['40분 뒤 수빈이한테서 전화가 왔다.'],
    speaker: '수빈',
    lines: [
      '지나야. 오빠가 다 말했어.',
      '가봉 끝나고 드레스 걸어놓고 있었는데, 오빠가 와서 다 말하더라.'
    ],
    after: ['수빈이는 울지도 화내지도 않았다. 목소리가 점점 작아졌다.', '"식은 내일 못 해. 미루자는 말은 내가 할게."'],
    next: 'END_CONFESS'
  },

  D4_SHAKEN: {
    stamp: '결혼식 D-0 · 새벽 1:10',
    type: 'choice',
    img: 'sc-26',
    narration: '답장이 늦었다. 말풍선이 세 번 떴다가 사라졌다.',
    speaker: '수빈',
    lines: [
      '너 지금 장난하는 거 아니지.',
      '나 내일 결혼해. 증거는 있어? 사진이라도.'
    ],
    caption: ['없다. 내가 본 것 말고는.'],
    choices: [
      {
        text: '미안. 내가 잘못 봤나 봐.',
        effects: { flags: { backedDown: true } },
        next: 'END_ISOLATED'
      },
      {
        text: '증거는 없어. 근데 본 건 사실이야.',
        effects: { flags: { stoodGround: true } },
        next: 'END_WALK_AWAY'
      }
    ]
  },

  D4_MAIN: {
    /* 수빈이 500만 원도, 외도도 모를 때만 온다. */
    stamp: '결혼식 D-0 · 밤 11:00',
    type: 'kakao',
    img: 'sc-06',
    room: { name: '수빈', note: '친구 · 10년' },
    msgs: [
      { who: '수빈', text: '내일 부케 꼭 받아줘. 약속해.' },
      { who: '수빈', text: '드레스 옆에 네 자리 비워뒀어.' },
      { who: '수빈', text: '아침에 일찍 와. 나 준비할 때 옆에 있어줘.' }
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
        text: '(지금 수빈이한테 다 말한다)',
        next: 'D4_REVEAL'
      },
      {
        text: '(그 여자 이름 쥐고 민재한테 전화한다)',
        when: [['hasWomanInfo', '=', true]],
        badge: '협상',
        next: 'D4_DEAL'
      }
    ]
  },

  D4_DOUBT: {
    /* 수빈이 500만 원을 봤고, 이유를 아직 못 들은 경로. */
    stamp: '결혼식 D-0 · 밤 10:40',
    type: 'kakao',
    img: 'sc-23',
    room: { name: '수빈', note: '친구 · 10년' },
    msgs: [
      { who: '수빈', text: '지나야. 나 오빠한테 물어봤어. 너 카드값 때문에 빌려준 거라고 하더라.' },
      { who: '수빈', text: '근데 오빠가 그 얘기 할 때 나 안 보고 했어. 그게 계속 생각나.' },
      { who: '수빈', text: '내일 12시에 신부 대기실로 와줄래? 5분만.' }
    ],
    caption: ['수빈이한테 전화를 걸었다가 끊었다. 답장은 문자로 했다.'],
    choices: [
      {
        text: '(지금 다 말한다. 3일 전 밤에 본 것까지)',
        next: 'D4_REVEAL'
      },
      {
        text: '(돈은 카드값이라고 끝까지 말한다)',
        next: 'END_SILENT_RICH'
      },
      {
        text: '(500만 원을 돌려보내고, 예식에는 참석한다)',
        badge: '전액 반환',
        effects: { cash: -5000000, tookMoney: false, flags: { returned500: true } },
        next: 'D4_RETURN'
      }
    ]
  },

  D4_COLD: {
    /* 수빈이 민재의 화를 봤거나, 지나를 무서워하는 경로. */
    stamp: '결혼식 D-0 · 밤 11:20',
    type: 'kakao',
    img: 'sc-40',
    room: { name: '수빈', note: '친구 · 10년' },
    msgs: [
      { who: '수빈', text: '지나야. 오빠가 오늘 너 얘기 하면서 화를 냈어.' },
      { who: '수빈', text: '내일 끝나고 셋이서 얘기하자. 오늘 밤엔 조용히 있어줄래.' },
      { who: '수빈', text: '나 지금은 아무 얘기도 못 하겠어. 미안.' }
    ],
    caption: ['전화를 걸었더니 두 번 울리고 끊겼다.'],
    choices: [
      {
        text: '(답장하지 않고 결혼식 날을 맞는다)',
        next: 'END_ISOLATED'
      },
      {
        text: '(지금 다 말한다. 내가 본 것까지)',
        next: 'D4_REVEAL'
      },
      {
        text: '(그 여자 이름 쥐고 민재한테 전화한다)',
        when: [['hasWomanInfo', '=', true]],
        badge: '협상',
        next: 'D4_DEAL'
      }
    ]
  },

  D4_SILENT: {
    /* 수빈이 D-1에 물었는데 지나가 "아무 일도 아냐"로 넘긴 경로. */
    stamp: '결혼식 D-0 · 밤 10:30',
    type: 'kakao',
    img: 'sc-27',
    room: { name: '수빈', note: '친구 · 10년' },
    msgs: [
      { who: '수빈', text: '지나야. 어제 내가 물어봤을 때, 너 아무 일 없다고 했지.' },
      { who: '수빈', text: '나 그 말 계속 생각났어. 하루 종일.' },
      { who: '수빈', text: '내일 끝나고 우리 집으로 와. 그때는 다 얘기해줄 수 있지?' }
    ],
    caption: ['답장을 한 줄 쓰고 지웠다.'],
    choices: [
      {
        text: '(지금 전부 말한다)',
        next: 'D4_REVEAL'
      },
      {
        text: '"응, 내일 얘기하자."',
        next: 'END_WALK_AWAY'
      }
    ]
  },

  D4_ASKED: {
    /* 수빈이 웨딩홀 앞에서 그 여자를 직접 본 경로. */
    stamp: '결혼식 D-0 · 밤 10:20',
    type: 'kakao',
    img: 'sc-09',
    room: { name: '수빈', note: '친구 · 10년' },
    msgs: [
      { who: '수빈', text: '지나야. 나 어제 웨딩홀 앞 카페에 갔다가 봤어.' },
      { who: '수빈', text: '민재 오빠가 그 여자랑 앉아 있었어. 손잡고 있었어.' },
      { who: '수빈', text: '너 3일 전에 봤다면서. 그날부터 알고 있었어?' }
    ],
    caption: ['사진 한 장이 같이 왔다. 흔들린 사진이었다.'],
    choices: [
      {
        text: '(3일 전부터 알고 있었다고 말한다)',
        next: 'D4_REVEAL'
      },
      {
        text: '(그날은 그냥 지나갔다고 한다)',
        next: 'END_ISOLATED'
      }
    ]
  },

  D4_REVEAL: {
    stamp: '결혼식 D-0 · 새벽 2:00',
    type: 'scene',
    route: [
      { when: [['tookMoney', '=', true]], to: 'D4_REVEAL_BOUGHT' },
      { when: [['flags.subinMetWoman', '=', true]], to: 'D4_REVEAL_WIN' },
      { when: [['evidenceLevel', '>=', 2]], to: 'D4_REVEAL_DISTANT' },
      { to: 'D4_REVEAL_LOSS' }
    ],
    caption: [
      '3일 전 밤에 본 것부터, 그동안 오간 말까지 다 말했다.',
      '말하고 나서 휴대폰을 뒤집어 놓았다.'
    ]
  },

  D4_REVEAL_BOUGHT: {
    stamp: '결혼식 D-0 · 새벽 2:40',
    type: 'scene',
    img: 'sc-26',
    speaker: '민재',
    lines: ['돈 받아 먹고 이제 와서 뒤통수? 영수증 내가 올릴까?'],
    caption2: [
      '민재는 정말 올렸다. "지나 대여금 5,000,000원" 캡처가 단톡방에 붙었다.',
      '아침에 수빈이한테서 온 카톡은 한 줄이었다. "지금은 연락하지 마."'
    ],
    next: 'END_BURNED'
  },

  D4_REVEAL_WIN: {
    stamp: '결혼식 D-0 · 새벽 3:10',
    type: 'scene',
    img: 'sc-38',
    speaker: '수빈',
    lines: [
      '…3일 전에 봤으면 그날 밤에 말했어야지.',
      '나 그 여자한테 다 들었어. 서연이라고 했어.'
    ],
    caption2: ['수빈이는 새벽 4시에 전화를 끊었다. 아침까지 다시 오지 않았다.'],
    next: 'END_TRUTH'
  },

  D4_REVEAL_DISTANT: {
    stamp: '결혼식 D-0 · 새벽 3:10',
    type: 'scene',
    img: 'sc-40',
    speaker: '수빈',
    lines: ['증거는 있네.', '근데 너, 왜 이제야 말해? 나 계속 옆에 있었는데.'],
    caption2: ['파혼은 했다. 수빈이는 그 뒤로 먼저 연락하지 않았다.'],
    next: 'END_TRUTH_DISTANT'
  },

  D4_REVEAL_LOSS: {
    stamp: '결혼식 D-0 · 새벽 3:10',
    type: 'scene',
    img: 'sc-40',
    speaker: '수빈',
    lines: ['사진도 없이, 말로만?', '지나야, 나 결혼해. 미안.'],
    caption2: ['카톡방은 조용해졌다. 수빈이의 프로필 사진이 웨딩 사진으로 바뀌었다.'],
    next: 'END_ISOLATED'
  },

  D4_DEAL: {
    stamp: '결혼식 D-0 · 밤 11:30',
    type: 'choice',
    img: 'sc-44',
    narration: '민재 오빠를 편의점 앞으로 불렀다. 그 여자 이름을 꺼내자 오빠가 담배를 껐다.',
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
      '오빠한테서 전화가 두 번 왔다. 받지 않았다.',
      '다음 날 예식에는 갔다.'
    ],
    next: 'END_WALK_AWAY'
  },

  /* ───────── 엔딩 8종 ───────── */
  END_SILENT_RICH: {
    type: 'ending', no: 'ENDING 01', img: 'sc-26',
    title: '조용한 사람',
    body: [
      '12시에 신부 대기실에 갔다. 5분은 3분으로 줄었다.',
      '수빈이는 마지막에 "알겠어"만 말했다. 부케는 사촌이 받았다.',
      '카드값 128만 원은 자동이체로 빠졌다. 500만 원은 통장에 그대로 있고, 우리 셋은 그 얘기를 하지 않는다.'
    ],
    note: '카드값은 막았다 · 수빈이는 아직 모른다'
  },

  END_BURNED: {
    type: 'ending', no: 'ENDING 02', img: 'sc-40',
    title: '돈 받은 사람',
    body: [
      '단톡방에 올라온 건 영수증 한 장이었다. 보낸 사람은 민재, 받는 사람은 나.',
      '수빈이는 예식장 입구에서 나를 봤다. 아무 말도 하지 않고 안으로 들어갔다.',
      '카드값 128만 원은 그달에 나갔다. 남은 403만 원은 반년 동안 그대로 있었다.'
    ],
    note: '돈은 남았다 · 단톡방에 영수증이 남았다'
  },

  END_CONFESS: {
    type: 'ending', no: 'ENDING 03', img: 'sc-15',
    title: '직접 말하게 한 사람',
    body: [
      '민재는 결혼식 전날 밤, 드레스를 걸어둔 수빈이 앞에서 다 말했다.',
      '수빈이는 식을 한 달 미뤘다. 홀에는 취소 수수료가 붙었다.',
      '일주일 뒤 우리는 같은 카페에 앉았다. 수빈이는 화도 안 냈고, 웃지도 않았다. 그냥 커피를 두 잔 시켰다.'
    ],
    note: '돈 0원 · 결혼은 한 달 미뤘다'
  },

  END_TRUTH: {
    type: 'ending', no: 'ENDING 04', img: 'sc-38',
    title: '부케를 받지 않은 사람',
    body: [
      '결혼식은 취소됐다. 홀 예약금은 수빈이 어머니가 날렸다.',
      '수빈이는 사흘을 울고, 나흘째에 "밥은 먹었어?"라고 물었다.',
      '카드값 128만 원은 아직 못 냈다. 독촉 문자는 사흘째 같은 문장이다.'
    ],
    note: '돈 0원 · 수빈이와의 사이는 남았다'
  },

  END_TRUTH_DISTANT: {
    type: 'ending', no: 'ENDING 05', img: 'sc-09',
    title: '증거를 든 사람',
    body: [
      '파혼은 깔끔했다. 민재는 반지와 예식장 계약서를 수빈이 어머니한테 넘겼다.',
      '수빈이는 내가 사흘 동안 혼자 알고 있었다는 걸 마지막까지 물었다. 나는 세 번 같은 대답을 했다.',
      '수빈이의 카톡방은 단톡방에서 내가 나간 뒤로 조용하다.'
    ],
    note: '파혼은 했다 · 연락은 끊겼다'
  },

  END_ISOLATED: {
    type: 'ending', no: 'ENDING 06', img: 'sc-23',
    title: '빈자리',
    body: [
      '결혼식은 예정대로 열렸다. 내 이름은 하객 명단에서 빠졌다.',
      '저녁에 수빈이가 사진을 올렸다. 내가 서 있어야 할 자리에 사촌이 서 있었다.',
      '카톡방은 그대로 있다. 마지막 메시지는 내가 보낸 "축하해". 답장은 없다.'
    ],
    note: '하객 명단에서 빠졌다 · 카톡방은 조용하다'
  },

  END_DEAL: {
    type: 'ending', no: 'ENDING 07', img: 'sc-44',
    title: '새 줄',
    body: [
      '민재는 약속을 지켰다. 협력사 MD 자리는 한 달 뒤에 났다.',
      '월급은 60만 원 올랐고, 명함에 부서가 새로 찍혔다.',
      '회식에서 민재를 만났다. 민재는 내 이름을 부르지 않고 잔만 들었다. 나도 그랬다.'
    ],
    note: '수빈이는 끝까지 모른다'
  },

  END_WALK_AWAY: {
    type: 'ending', no: 'ENDING 08', img: 'sc-45',
    title: '각자의 길',
    body: [
      '축의금 봉투에 10만 원을 넣고, 이름은 작게 적었다.',
      '부케는 받지 않았다. 2부가 시작되기 전에 나왔다.',
      '집에 와서 카드값 문자를 다시 열었다. 128만 원. 통장에는 31만 원이 있다.'
    ],
    note: '돈 0원 · 부케는 받지 않았다'
  }
};

if (typeof module === 'object' && module.exports) module.exports = SCENES;

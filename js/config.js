// config.js 맨 위
const PA_URL = 'https://defaultb9501effd05e4bf18a87898d83f46c.eb.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/6d893f6e53384aecafde81176803d45a/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=B8jsk9sYpiU4ar9h-4QZgShDpRzAviLA2xrPieZ_P1Y';
const ADMIN_PW = '3692';
const MANAGER_EMAIL = 'orionjungtpz@poscointl.com';
const SPLASH_DEFAULT = 'data:image/webp;base64,...'; // 기존 값 유지

const ORG = {
  '포스코타워-송도': {
    zones: {
      '비즈니스라운지': { icon: '🛋️', inspectors: ['오세림', '전승리'] },
      'SWC송도':        { icon: '☕', inspectors: ['권민경'] }
    }
  },
  '포스코센터': {
    zones: {
      '사무공간':  { icon: '🖥️', inspectors: ['김영은', '윤동기', '김영민'] },
      'SWC포스코': { icon: '☕', inspectors: ['김상미', '고지은'] }
    }
  },
  '그랜드센트럴': {
    zones: {
      'SWC서울역': { icon: '☕', inspectors: ['정다인', '김진경'] }
    }
  }
};

const ZONE_CONFIG = {

  // ── 비즈니스라운지 ──
  '비즈니스라운지': {
    items:     ['monitor','chair','light','clean'],
    itemNames: ['예약모니터','의자','조명','청결상태'],
    roomItems: {
      '접견실':      ['monitor','chair','light','clean'],
      'BIZ 1':      ['monitor','chair','light','clean','TV'],
      'BIZ 2':      ['monitor','chair','light','clean','TV'],
      'BIZ 3':      ['monitor','chair','light','clean','TV'],
      'BIZ 4':      ['monitor','chair','light','clean','TV'],
      'BIZ 5':      ['monitor','chair','light','clean','TV'],
      'BIZ 6':      ['monitor','chair','light','clean','TV'],
      'BIZ 7':      ['monitor','chair','light','clean','TV'],
      'BIZ 8':      ['monitor','chair','light','clean','TV'],
      'BIZ 9':      ['monitor','chair','light','clean','TV'],
      'BIZ 10':     ['monitor','chair','light','clean','TV'],
      'BIZ 11':     ['monitor','chair','light','clean','TV'],
      'BIZ 12':     ['monitor','chair','light','clean','TV'],
      'BIZ 13':     ['monitor','chair','light','clean','TV'],
      'BIZ 14':     ['monitor','chair','light','clean','TV'],
      'BIZ 15':     ['monitor','chair','light','clean','TV'],
      'BIZ 16':     ['monitor','chair','light','clean','TV'],
      'BIZ 17':     ['monitor','chair','light','clean','TV'],
      'BIZ 18':     ['monitor','chair','light','clean','TV'],
      'TRAINING 1': ['monitor','chair','light','clean','roll'],
      'TRAINING 2': ['monitor','chair','light','clean','roll'],
      'TRAINING 3': ['monitor','chair','light','clean','roll']
    },
    itemNameMap: {
      'monitor':'예약모니터','chair':'의자','light':'조명',
      'clean':'청결상태','TV':'TV','roll':'롤스크린'
    },
    seatMap: {
      '접견실':8,
      'BIZ 1':12,'BIZ 2':12,'BIZ 3':8,'BIZ 4':8,'BIZ 5':8,
      'BIZ 6':8,'BIZ 7':10,'BIZ 8':8,'BIZ 9':8,'BIZ 10':8,
      'BIZ 11':5,'BIZ 12':5,'BIZ 13':10,'BIZ 14':5,
      'BIZ 15':8,'BIZ 16':8,'BIZ 17':10,'BIZ 18':8,
      'TRAINING 1':16,'TRAINING 2':16,'TRAINING 3':16
    },
    rooms: [
      { group:'접견실',        list:['접견실'] },
      { group:'BIZ ROOM',     list:['BIZ 1','BIZ 2','BIZ 3','BIZ 4','BIZ 5','BIZ 6','BIZ 7','BIZ 8','BIZ 9','BIZ 10','BIZ 11','BIZ 12','BIZ 13','BIZ 14','BIZ 15','BIZ 16','BIZ 17','BIZ 18'] },
      { group:'TRAINING ROOM', list:['TRAINING 1','TRAINING 2','TRAINING 3'] }
    ]
  },

  // ── SWC송도 ──
  'SWC송도': {
    items:     ['chair','light','tissue','clean'],
    itemNames: ['의자','조명','갑 티슈','청결상태'],
    roomItems: {
      '임원실 1': ['chair','light','tissue','clean'],
      '임원실 2': ['chair','light','tissue','clean'],
      '임원실 3': ['chair','light','tissue','clean'],
      '임원실 4': ['chair','light','tissue','clean'],
      '임원실 5': ['chair','light','tissue','clean'],
      '임원실 6': ['chair','light','tissue','clean'],
      '스마트워크센터': ['chair','clock','paper'],
      '탕비실':        ['coffee','cup','etc']
    },
    itemNameMap: {
      'chair':'의자','light':'조명','tissue':'갑 티슈','clean':'청결상태',
      'clock':'시계','paper':'복사용지',
      'coffee':'커피머신','cup':'종이컵','etc':'기타'
    },
    seatMap: {
      '임원실 1':7,'임원실 2':7,'임원실 3':7,
      '임원실 4':7,'임원실 5':7,'임원실 6':7,
      '스마트워크센터':10,'탕비실':0
    },
    rooms: [
      { group:'출장임원실',      list:['임원실 1','임원실 2','임원실 3','임원실 4','임원실 5','임원실 6'] },
      { group:'스마트워크센터',  list:['스마트워크센터'] },
      { group:'탕비실',          list:['탕비실'] }
    ]
  },

  // ── 사무공간 (층 선택 추가 → floorConfig 사용) ──
  '사무공간': {
    useFloor: true,   // ← 층 선택 단계 활성화 플래그
    floors: ['8층','13층','16층','탕비공간'],
    floorConfig: {
      '8층': {
        itemNameMap: {
    'chair':'의자','light':'조명','TV':'TV','clean':'청결상태',
    'desk':'책상','pen':'필기도구','clock':'시계','calendar':'달력','doorlock':'도어락'  // ← 추가
    },
        rooms: [
          { group:'8층 접견실',    list:['접견실'] },
          { group:'8층 출장임원실', list:['출장임원실'] },
          { group:'8층 회의실',    list:['1회의실','2회의실','3회의실','4회의실','5회의실','6회의실','7회의실'] },
          { group:'8층 영상회의실', list:['영상회의실'] }
        ],
        roomItems: {
          '접견실':    ['chair','light','clean'],
          '출장임원실':['desk','chair','pen','clock','calendar','doorlock','light','TV','clean'],
          '1회의실':   ['desk','chair','pen','clock','light','TV','clean'],
          '2회의실':   ['desk','chair','pen','clock','light','TV','clean'],
          '3회의실':   ['desk','chair','pen','clock','light','TV','clean'],
          '4회의실':   ['desk','chair','pen','clock','light','TV','clean'],
          '5회의실':   ['desk','chair','pen','clock','light','TV','clean'],
          '6회의실':   ['desk','chair','pen','clock','light','TV','clean'],
          '7회의실':   ['desk','chair','pen','clock','light','TV','clean'],
          '영상회의실':['chair','light','TV','clean']
        },
        seatMap: {
          '접견실':6,'출장임원실':4,
          '1회의실':4,'2회의실':6,'3회의실':4,
          '4회의실':6,'5회의실':6,'6회의실':10,'7회의실':10,
          '영상회의실':15
        }
      },
      '13층': {
        itemNameMap: {
          'chair':'의자','light':'조명','TV':'TV','clean':'청결상태'
        },
        rooms: [
          { group:'13층 회의실',     list:['1회의실'] },
          { group:'13층 다목적회의실',list:['다목적회의실'] }
        ],
        roomItems: {
          '1회의실':    ['chair','light','clean'],
          '다목적회의실':['chair','light','TV','clean']
        },
        seatMap: {
          '1회의실':6,'다목적회의실':20
        }
      },
    '16층': {
  itemNameMap: {
    'chair':'의자','light':'조명','TV':'TV','clean':'청결상태',
    'desk':'책상','pen':'필기도구','clock':'시계','calendar':'달력','doorlock':'도어락'
  },
  rooms: [
    { group:'16층 출장임원실', list:['출장임원실'] },
    { group:'16층 회의실',    list:['1회의실','2회의실','3회의실','4회의실','5회의실'] },
    { group:'16층 중회의실',  list:['중회의실'] }
  ],
  roomItems: {
  '출장임원실':['desk','chair','pen','clock','calendar','doorlock','light','TV','clean'],
  '1회의실':   ['desk','chair','pen','clock','light','TV','clean'],
  '2회의실':   ['desk','chair','pen','clock','light','TV','clean'],
  '3회의실':   ['desk','chair','pen','clock','light','TV','clean'],
  '4회의실':   ['desk','chair','pen','clock','light','TV','clean'],
  '5회의실':   ['desk','chair','pen','clock','light','TV','clean'],
  '중회의실':  ['desk','chair','pen','clock','light','TV','clean']
},
  },
  seatMap: {
    '출장임원실':4,
    '1회의실':4,'2회의실':6,'3회의실':4,
    '4회의실':6,'5회의실':6,'중회의실':12
  }
},
      '탕비공간': {
  itemNameMap: {
    'coffee':'커피머신','tea':'티백류','cup':'종이컵','etc':'기타'
  },
  rooms: [
    { group:'8층 탕비실',  list:['8층 탕비실'] },
    { group:'13층 탕비실', list:['13층 탕비실'] },
    { group:'16층 탕비실', list:['16층 탕비실'] }
  ],
  roomItems: {
    '8층 탕비실':  ['coffee','tea','cup','etc'],
    '13층 탕비실': ['coffee','tea','cup','etc'],
    '16층 탕비실': ['coffee','tea','cup','etc']
  },
  seatMap: {
    '8층 탕비실':0,'13층 탕비실':0,'16층 탕비실':0
  }
    }
  },

  // ── SWC포스코 ──
  'SWC포스코': {
    items:     ['chair','light','TV','airpurifier'],
    itemNames: ['의자','조명','TV','공기청정기'],
    roomItems: {
      '출장임원실 1': ['chair','light','TV','airpurifier'],
      '출장임원실 2': ['chair','light','TV','airpurifier'],
      '출장임원실 3': ['chair','light','TV','airpurifier'],
      '출장임원실 4': ['chair','light','TV','airpurifier'],
      '출장임원실 5': ['chair','light','TV','airpurifier'],
      '스마트워크센터':['chair','paper'],
      'PT룸': ['chair','light','TV','clean'],
      '회의실 1': ['chair','light','TV','clean'],
      '회의실 2': ['chair','light','TV','clean'],
      '회의실 3': ['chair','light','TV','clean'],
      '회의실 4': ['chair','light','TV','clean'],
      '회의실 5': ['chair','light','TV','clean'],
      '탕비실': ['capsule','cup','sink']
    },
    itemNameMap: {
      'chair':'의자','light':'조명','TV':'TV','airpurifier':'공기청정기',
      'paper':'복사용지','clean':'청결상태',
      'capsule':'캡슐커피','cup':'종이컵','sink':'싱크대'
    },
    seatMap: {
      '출장임원실 1':1,'출장임원실 2':1,'출장임원실 3':1,'출장임원실 4':1,'출장임원실 5':1,
      '스마트워크센터':60,'PT룸':12,'회의실 1':8, '회의실 2':6,'회의실 3':6, '회의실 4':6, '회의실 5':6, '탕비실':0
    },
    rooms: [
      { group:'출장임원실',     list:['출장임원실 1','출장임원실 2','출장임원실 3','출장임원실 4','출장임원실 5'] },
      { group:'스마트워크센터', list:['스마트워크센터'] },
      { group:'회의실', list:['PT룸','회의실 1', '회의실 2', '회의실 3', '회의실 4', '회의실 5', ] },
      { group:'탕비실',         list:['탕비실'] }
    ]
  },

  // ── SWC서울역 (그랜드센트럴) ──
  'SWC서울역': {
    items:     ['chair','light','TV','clean'],
    itemNames: ['의자','조명','TV','청결상태'],
    roomItems: {
      '출장임원실 1':    ['chair','light','TV'],
      '출장임원실 2':    ['chair','light','TV'],
      '회의실 1':     ['chair','light','TV','clean'],
      '회의실 2':     ['chair','light','TV','clean'],
      '회의실 3':     ['chair','light','TV','clean'],
      '회의실 4':     ['chair','light','TV','clean'],
      '스마트워크센터':['chair','paper'],
      '탕비실':        ['capsule','cup','sink']
    },
    itemNameMap: {
      'chair':'의자','light':'조명','TV':'TV','clean':'청결상태',
      'paper':'복사용지',
      'capsule':'캡슐커피','cup':'종이컵','sink':'싱크대'
    },
    seatMap: {
      '출장임원실 1':1,'출장임원실 2':1,'회의실 1':6,'회의실 2':6,'회의실 3':6,'회의실 4':6,
      '스마트워크센터':70,'탕비실':0
    },
    rooms: [
      { group:'출장임원실',     list:['출장임원실 1','출장임원실 2'] },
      { group:'회의실',         list:['회의실 1','회의실 2','회의실 3','회의실 4'] },
      { group:'스마트워크센터', list:['스마트워크센터'] },
      { group:'탕비실',         list:['탕비실'] }
    ]
  }
};
const BLDG_NAMES = ['포스코타워-송도', '포스코센터', '그랜드센트럴'];

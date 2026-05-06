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
  '비즈니스라운지': {
    items:     ['chair','light','roll','marker','tissue','wet'],
    itemNames: ['의자','전등','롤스크린','보드마카','휴지','물티슈'],
    seatMap: {
      '접견실':8,
      'BIZ 1':12,'BIZ 2':12,'BIZ 3':8,'BIZ 4':8,'BIZ 5':8,
      'BIZ 6':8,'BIZ 7':10,'BIZ 8':8,'BIZ 9':8,'BIZ 10':8,
      'BIZ 11':5,'BIZ 12':5,'BIZ 13':10,'BIZ 14':5,
      'BIZ 15':8,'BIZ 16':8,'BIZ 17':10,'BIZ 18':8,
      'TRAINING 1':16,'TRAINING 2':16,'TRAINING 3':16
    },
    rooms: [
      { group:'접견실',       list:['접견실'] },
      { group:'BIZ ROOM',    list:['BIZ 1','BIZ 2','BIZ 3','BIZ 4','BIZ 5','BIZ 6','BIZ 7','BIZ 8','BIZ 9','BIZ 10','BIZ 11','BIZ 12','BIZ 13','BIZ 14','BIZ 15','BIZ 16','BIZ 17','BIZ 18'] },
      { group:'TRAINING ROOM',list:['TRAINING 1','TRAINING 2','TRAINING 3'] }
    ]
  },
  'SWC송도': {
    items:     ['chair','meetingChair','tissue','etc'],
    itemNames: ['의자','회의의자','각티슈','기타'],
    roomItems: {
      '임원실 1':['chair','meetingChair','tissue','etc'],
      '임원실 2':['chair','meetingChair','tissue','etc'],
      '임원실 3':['chair','meetingChair','tissue','etc'],
      '임원실 4':['chair','meetingChair','tissue','etc'],
      '임원실 5':['chair','meetingChair','tissue','etc'],
      '임원실 6':['chair','meetingChair','tissue','etc']
    },
    seatMap: {
      '임원실 1':7,'임원실 2':7,'임원실 3':7,
      '임원실 4':7,'임원실 5':7,'임원실 6':7
    },
    rooms: [
      { group:'임원실', list:['임원실 1','임원실 2','임원실 3','임원실 4','임원실 5','임원실 6'] }
    ]
  },
  '사무공간': {
    items:     ['chair','light','TV','marker','etc'],
    itemNames: ['의자','전등','TV','보드마카','기타'],
    seatMap: {
      '접견실':6,
      '8층_1회의실':4,'8층_2회의실':6,'8층_3회의실':4,
      '8층_4회의실':6,'8층_5회의실':6,'8층_6회의실':10,
      '8층_7회의실':10,'8층_영상회의실':15,
      '16층_1회의실':4,'16층_2회의실':6,'16층_3회의실':4,
      '16층_4회의실':6,'16층_5회의실':6,'16층_중회의실':12
    },
    displayName: {
      '8층_1회의실':'1회의실','8층_2회의실':'2회의실','8층_3회의실':'3회의실',
      '8층_4회의실':'4회의실','8층_5회의실':'5회의실','8층_6회의실':'6회의실',
      '8층_7회의실':'7회의실','8층_영상회의실':'영상회의실',
      '16층_1회의실':'1회의실','16층_2회의실':'2회의실','16층_3회의실':'3회의실',
      '16층_4회의실':'4회의실','16층_5회의실':'5회의실','16층_중회의실':'중회의실'
    },
    rooms: [
      { group:'8층 접견실',  list:['접견실'] },
      { group:'8층 회의실',  list:['8층_1회의실','8층_2회의실','8층_3회의실','8층_4회의실','8층_5회의실','8층_6회의실','8층_7회의실','8층_영상회의실'] },
      { group:'16층 회의실', list:['16층_1회의실','16층_2회의실','16층_3회의실','16층_4회의실','16층_5회의실','16층_중회의실'] }
    ]
  }
};

const BLDG_NAMES = ['포스코타워-송도', '포스코센터', '그랜드센트럴'];

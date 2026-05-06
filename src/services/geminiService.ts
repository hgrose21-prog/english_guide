export interface Curriculum {
  overview: string;
  situationalPhrases: {
    situation: string;
    phrases: {
      original: string;
      pronunciation: string;
      meaning: string;
      tip?: string;
    }[];
  }[];
  keyVocabulary: {
    word: string;
    meaning: string;
  }[];
  culturalTips: string[];
}

export async function generateCurriculum(
  language: string,
  duration: string,
  level: string,
  goal: string
): Promise<Curriculum> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const mockData: Record<string, Curriculum> = {
    '영어': {
      overview: `${language} 여행을 위한 ${duration} 집중 코스입니다. ${level} 수준에 맞춰 ${goal}을 달성할 수 있도록 구성했습니다.`,
      situationalPhrases: [
        {
          situation: "공항 및 입국 심사",
          phrases: [
            { original: "Where is the baggage claim?", pronunciation: "웨어 이즈 더 배기지 클레임?", meaning: "수하물 찾는 곳이 어디인가요?", tip: "입국장 안내판에서 'Baggage Claim' 아이콘을 찾으세요." },
            { original: "I am here for sightseeing.", pronunciation: "아이 엠 히어 포 사이트시잉", meaning: "관광 목적으로 왔습니다.", tip: "입국 심사 시 방문 목적을 물을 때 답변하세요." }
          ]
        },
        {
          situation: "식당에서 주문하기",
          phrases: [
            { original: "Can I see the menu, please?", pronunciation: "캔 아이 씨 더 메뉴, 플리즈?", meaning: "메뉴판 좀 볼 수 있을까요?", tip: "손을 살짝 들어 종업원에게 도움을 요청하세요." },
            { original: "Check, please.", pronunciation: "체크, 플리즈", meaning: "계산 부탁합니다.", tip: "미국 등 일부 국가에서는 자리에서 계산하는 것이 보통입니다." }
          ]
        }
      ],
      keyVocabulary: [
        { word: "Water", meaning: "물" },
        { word: "Exit", meaning: "출구" },
        { word: "Help", meaning: "도와주세요" },
        { word: "Price", meaning: "가격" }
      ],
      culturalTips: [
        "식당에서는 보통 15-20% 정도의 팁을 주는 문화가 있습니다.",
        "처음 만난 사람에게는 가벼운 눈인사와 스몰토크가 자연스럽습니다.",
        "줄을 서는 매너가 매우 중요하게 여겨집니다."
      ]
    },
    '일본어': {
      overview: `일본 여행을 위한 ${duration} 단기 완성 커리큘럼입니다. ${level} 단계에 적합한 ${goal} 맞춤 표현을 배워봅니다.`,
      situationalPhrases: [
        {
          situation: "기본 인사 및 식당",
          phrases: [
            { original: "すみません、メニューをお願いします。", pronunciation: "스미마셍, 메뉴오 오네가이시마스", meaning: "저기요, 메뉴판 부탁합니다.", tip: "주문을 부를 때는 '스미마셍'이라고 말하세요." },
            { original: "お会計をお願いします。", pronunciation: "오카이케이오 오네가이시마스", meaning: "계산 부탁드립니다.", tip: "카운터에서 계산하는 경우가 많습니다." }
          ]
        },
        {
          situation: "길 찾기",
          phrases: [
            { original: "駅はどこですか？", pronunciation: "에키와 도코데스카?", meaning: "역은 어디인가요?", tip: "지도를 보여주며 물어보면 더 정확한 답변을 얻을 수 있습니다." }
          ]
        }
      ],
      keyVocabulary: [
        { word: "はい", meaning: "네" },
        { word: "いいえ", meaning: "아니오" },
        { word: "トイレ", meaning: "화장실" },
        { word: "いくらですか", meaning: "얼마인가요?" }
      ],
      culturalTips: [
        "식당이나 가게에서 큰 소리로 부르는 것보다 눈을 맞추는 것이 좋습니다.",
        "대중교통 이용 시 통화나 큰 소리로 대화하는 것은 예의에 어긋납니다.",
        "결제 시 돈은 상점 비치된 트레이에 올려두는 문화가 일반적입니다."
      ]
    },
    'DEFAULT': {
      overview: `${language} 여행을 위한 맞춤형 가이드입니다. ${duration} 동안 ${level} 수준에서 ${goal} 목표를 향해 나아갑니다.`,
      situationalPhrases: [
        {
          situation: "일상 소통 및 인사",
          phrases: [
            { original: "Hello / Service please", pronunciation: "헬로 / 서비스 플리즈", meaning: "안녕하세요 / 여기 좀 봐주세요", tip: "미소를 지으며 눈을 맞추는 것이 기본입니다." },
            { original: "How much is this?", pronunciation: "하우 머치 이즈 디스?", meaning: "이것은 얼마인가요?", tip: "계산기를 활용하면 더 의사소통이 쉽습니다." }
          ]
        }
      ],
      keyVocabulary: [
        { word: "Yes", meaning: "예" },
        { word: "No", meaning: "아니오" },
        { word: "Please", meaning: "부탁합니다" },
        { word: "Thank you", meaning: "감사합니다" }
      ],
      culturalTips: [
        "현지어로 간단한 인사말('안녕하세요', '고마워요')을 건네면 서비스 품질이 달라질 수 있습니다.",
        "공공장소에서는 에티켓을 지켜주세요.",
        "환율을 미리 체크하고 현금을 적절히 준비하세요."
      ]
    }
  };

  return mockData[language] || mockData['DEFAULT'];
}

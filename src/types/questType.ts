import type { topicGeneralType } from "./topicType";

export enum QuestionType {
    MCQ = 'MCQ',
    FN = 'FN',
    FNS = 'FNS',
    FS = 'FS',
    MP = 'MP'
  }
  
  export enum BloomType {
    REMEMBER = 'REMEMBER',
    UNDERSTAND = 'UNDERSTAND',
    APPLY = 'APPLY',
    ANALYZE = 'ANALYZE',
    EVALUATE = 'EVALUATE',
    CREATE = 'CREATE'
  }
  
  export interface AnswerBase {
    id: string;
    questionId: string;
  }

  export interface AnswersFn extends AnswerBase {
    answer: number;
    tolerance: number;
  }
  
  export interface AnswersFns extends AnswerBase {
    answer: string;
  }
  
  export interface AnswersFs extends AnswerBase {
    answer: string;
    synonyms?: string;
  }
  
  export interface AnswersMcq extends AnswerBase {
    content: string;
    isCorrect: boolean;
  }
  
  export interface AnswersMp extends AnswerBase {
    column1: string;
    column2: string;
  }

  export interface QuestionImgs {
    id: number;
    questionId: string;
    url: string;
    indexOrder: number;
  }
  
  export interface Question {
    id: string;
    topicId: string;
    questionType: QuestionType;
    bloom: BloomType;
    status: boolean;
    questionContent: string;
    indexOrder: number;
    fnAnswers?: AnswersFn[];
    fnsAnswers?: AnswersFns[];
    fsAnswers?: AnswersFs[];
    mcqAnswers?: AnswersMcq[];
    mpAnswers?: AnswersMp[];
    questionImgs?: QuestionImgs[];
    createdAt: string;
    updatedAt: string;
  }

  export interface LessonImgs {
    id: string;
    sectionId: string;
    url: string;
    indexOrder: number;
  }
  
  export interface LessonSection {
    id: string;
    lessonId: string;
    title: string;
    content: string;
    level: number;
    orderIndex: number;
    parent?: LessonSection;
    children?: LessonSection[];
    images?: LessonImgs[];
    refs?: Refs[];
  }
  
  export interface Lesson {
    id: string;
    title: string;
    topic?: topicGeneralType;
    sections: LessonSection[];
    createdAt: string;
    updatedAt: string;
  }

  export enum RefType {
    VIDEO = 'VIDEO',
    DOCUMENT = 'DOCUMENT',
    LINK = 'LINK'
  }
  
  export interface Refs {
    id: string;
    type: RefType;
    url: string;
    sectionId?: string; 
  }

  export interface Quest {
    id: string;
    topicId?: topicGeneralType;
    title: string;
    status: boolean;
    description?: string;
    indexOrder?: number;
    lessons: Lesson[];
    questions: Question[];
    createdAt: string;
    updatedAt: string;
  }